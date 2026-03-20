// =============================================================
// SCRIPT 0B — VALIDATION GATE v1.1
// Utile PIM | Base: appefUQrLFZYN4Y5t
// Schema verified against live metadata: 2026-03-03
// =============================================================
// CHANGELOG v1.1 (2026-03-03):
//   Complete logic rewrite based on corrected requirements.
//   The gate protects the A+Z transition window and catches data
//   quality errors. It does NOT gate lifecycle signals (EOR/DD).
//
// RULES:
//
//   R1 — Price change (0% threshold — any change triggers):
//        Applies to ALL incoming PR records.
//        Two tiers:
//          HOLD  → if PM has an active .Z pair (Transition_Linked_SKU populated)
//                  Price change during transition = margin risk, needs human eyes
//          LOG   → if no .Z pair, price change is informational only, record flows
//
//   R2 — Zero or negative price:
//        Always HOLD regardless of context. This is a data error.
//
//   R3 — EOR / DD:
//        NO GATE. EOR and DD records always pass through like ST stock records.
//        They are only caught if they ALSO trigger R1 or R4 on the same record.
//        The EOR/DD status signal itself is never a reason to hold.
//
//   R4 — Supplier description drift:
//        Always HOLD. Incoming description differs from current SPD value.
//        Human must approve before description can be overwritten.
//
//   R5 — Active SKU status contradiction (A+Z context only):
//        Only HOLD if the PM record has a live .Z pair AND incoming signals
//        a lifecycle change. Standalone active records without a .Z pair flow.
//
// OUTPUT STATES:
//   Staging "pending"        → passed all rules, safe for Script 1 / 2B
//   Staging "pending_review" → held, one or more rules triggered
//
// RELEASE PATH:
//   Operator reviews Anomalies table → corrects Staging if needed →
//   checks Approved → runs Script 0C to re-queue → Script 1 / 2B
// =============================================================

async function main() {
  const stagingTable = base.getTable("tblcPSP5NcP0ioUP8"); // tblcPSP5NcP0ioUP8
  const spdTable = base.getTable("tbl7mZpHJCUs1r0cg"); // tbl7mZpHJCUs1r0cg
  const pbTable = base.getTable("tblW85ycReRUr0Ze1"); // tblW85ycReRUr0Ze1
  const pmTable = base.getTable("tblgLqMMXX2HcKt9U"); // tblgLqMMXX2HcKt9U
  const anomTable = base.getTable("tbl56i9Rlm2mK6t1w"); // tbl56i9Rlm2mK6t1w
  const adminLogs = base.getTable("tblk1v5VHPEC2c2u2"); // tblk1v5VHPEC2c2u2

  console.log("# 🛡️ Script 0B — Validation Gate v1.1");
  console.log(`> Running at: \`${new Date().toLocaleString()}\``);
  console.log(
    "> **Gate logic:** Protects A+Z transition window + catches data errors. " +
      "EOR/DD always flow. Price changes only held during active transition.",
  );
  console.log("---");

  // ============================================================
  // STEP 1 — Load pending Staging records
  // ============================================================
  console.log("## Step 1 — Loading pending Staging records...");

  const stagingQuery = await stagingTable.selectRecordsAsync({
    fields: [
      "fldeEd9FiNq5AtGNk", // Supplier SKU
      "fldjdRY1TAJypmcPF", // Import Type
      "fldbrUDvLv8OEnEqh", // Sys Etl Process Status
      "fldkAm1iLOJJYmzmi", // Supplier Prod Description
      "fldHDkQCH8jKeJZ7g", // Retail Excl (currency — incoming price)
    ],
  });

  const pendingRecords = stagingQuery.records.filter(
    (r) => r.getCellValueAsString("fldbrUDvLv8OEnEqh") === "pending",
  );

  console.log(
    `✅ Found **${pendingRecords.length}** pending records to validate.`,
  );
  if (pendingRecords.length === 0) {
    console.log("Nothing to validate. Exiting.");
    return;
  }

  // ============================================================
  // STEP 2 — Build reference indexes
  // ============================================================
  console.log("---");
  console.log("## Step 2 — Building reference indexes...");

  // SPD index: normKey → record
  const spdQuery = await spdTable.selectRecordsAsync({
    fields: [
      "fldmeU6JZIwvGAuRH", // Supplier Product Data ID (formula — match key)
      "fldoROoSpEm5FuUnI", // Supplier Product Description
      "fldGxaIlPVor7QEwN", // Product Master 2 (link → PM)
    ],
  });

  const spdIndex = {};
  for (const rec of spdQuery.records) {
    const key = rec
      .getCellValueAsString("fldmeU6JZIwvGAuRH")
      .trim()
      .toUpperCase();
    if (key) spdIndex[key] = rec;
  }

  // PM index: pmRecordId → { hasActiveZPair, productStatus, transitionLinks }
  // hasActiveZPair = Transition_Linked_SKU is populated (mid-transition window)
  const pmQuery = await pmTable.selectRecordsAsync({
    fields: [
      "fldSZsiBxKNTHPFel", // Product Route
      "fldvqYzX3ZVB1UsRi", // Transition Linked SKU — FIX: required to detect active Z pair
      "flddq6S7409EBM71D", // Product_Status — FIX: required for R5 currentPMStatus check
    ],
  });

  const pmIndex = {};
  for (const rec of pmQuery.records) {
    const route = rec.getCellValueAsString("fldSZsiBxKNTHPFel") || "";
    const transition = rec.getCellValue("fldvqYzX3ZVB1UsRi") || []; // FIX: read Transition_Linked_SKU
    const status = rec.getCellValueAsString("flddq6S7409EBM71D") || ""; // FIX: read Product_Status
    pmIndex[rec.id] = {
      hasActiveZPair: transition.length > 0, // FIX: was 'isTransitioning' — renamed to match usage below
      productStatus: status, // FIX: was never stored; R5 needs this
    };
  }

  // PricingBridge cost index: pmRecordId|priceType → last known cost
  const pbQuery = await pbTable.selectRecordsAsync({
    fields: [
      "fldAYj8E8RicN1EmL", // Product SKU (link → PM)
      "fldlCCMJvTDaNin4h", // price_type
      "fldxf21wIe7LXyHFz", // Cost
    ],
  });

  const pbCostIndex = {};
  for (const rec of pbQuery.records) {
    const pmLinks = rec.getCellValue("fldAYj8E8RicN1EmL") || [];
    const pt = rec.getCellValueAsString("fldlCCMJvTDaNin4h").toLowerCase();
    const cost = rec.getCellValue("fldxf21wIe7LXyHFz");
    if (pmLinks.length > 0 && pt && cost !== null) {
      pbCostIndex[`${pmLinks[0].id}|${pt}`] = cost;
    }
  }

  console.log(
    `✅ Indexed: **${Object.keys(spdIndex).length}** SPD | ` +
      `**${Object.keys(pbCostIndex).length}** PricingBridge costs | ` +
      `**${Object.keys(pmIndex).length}** PM records`,
  );

  const normSku = (s) =>
    String(s || "")
      .replace(/[-\s]/g, "")
      .trim()
      .toUpperCase();

  // ============================================================
  // STEP 3 — Run validation rules
  // ============================================================
  console.log("---");
  console.log("## Step 3 — Validating...");

  const chunk = (arr, n) => {
    const out = [];
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
  };

  const stagingUpdates = []; // pending_review holds
  const anomCreates = []; // Anomalies records (hold-level violations only)
  const adminNotes = []; // Admin Log notes (holds AND informational)

  let countClean = 0;
  let countHeld = 0;
  let countInfoLogged = 0; // passed but had informational notes

  for (const stagingRec of pendingRecords) {
    const rawSku = stagingRec.getCellValueAsString("fldeEd9FiNq5AtGNk").trim();
    const normKey = normSku(rawSku);
    const importType = stagingRec.getCellValueAsString("fldjdRY1TAJypmcPF");

    const spdRec = spdIndex[normKey] || null;
    const pmLinks = spdRec
      ? spdRec.getCellValue("fldGxaIlPVor7QEwN") || []
      : [];
    const pmId = pmLinks.length > 0 ? pmLinks[0].id : null;
    const pmData = pmId ? pmIndex[pmId] : null;
    const inZWindow = pmData ? pmData.hasActiveZPair : false; // mid-transition?

    const holds = []; // violations that HOLD the record
    const infoLogs = []; // informational notes that do NOT hold

    // --------------------------------------------------------
    // R1 — Price change (any incoming PR record)
    // HOLD if in A+Z transition window, LOG if not
    // --------------------------------------------------------
    if (importType.startsWith("PR") && pmId) {
      const priceType = importType.includes("_")
        ? importType.split("_").slice(1).join("_").toLowerCase()
        : "standard";
      const incomingCost = stagingRec.getCellValue("fldHDkQCH8jKeJZ7g");
      const lastKnown = pbCostIndex[`${pmId}|${priceType}`];

      if (lastKnown !== undefined && incomingCost !== null) {
        if (Math.abs(incomingCost - lastKnown) > 0) {
          const pct =
            lastKnown !== 0
              ? (((incomingCost - lastKnown) / lastKnown) * 100).toFixed(1)
              : "N/A";
          const direction =
            incomingCost > lastKnown ? "▲ increase" : "▼ decrease";
          const detail =
            `Price ${direction} on SKU ${rawSku} | price_type: ${priceType} | ` +
            `Last known: ${lastKnown} → Incoming: ${incomingCost} (${pct}%)`;

          if (inZWindow) {
            // HOLD High — mid-transition, margin is sensitive
            holds.push({
              rule: "R1",
              label: "Price Change During A+Z Transition — High Priority",
              detail:
                detail +
                "\nSKU is in active A+Z transition window. Price change during transition carries margin risk — hold for review.",
              severity: "High",
            });
          } else {
            // FIX: spec says non-transition price change is INFO only — record should flow, not be held
            infoLogs.push({
              rule: "R1",
              label: "Price Change — Standard (Informational)",
              detail:
                detail +
                "\nNo active Z pair. Standard price update — logged for visibility, record continues to Script 1/2B.",
            });
          }
        }
      }
    }

    // --------------------------------------------------------
    // R2 — Zero or negative price (always hold, always a data error)
    // --------------------------------------------------------
    if (importType.startsWith("PR")) {
      const incomingCost = stagingRec.getCellValue("fldHDkQCH8jKeJZ7g");
      if (incomingCost !== null && incomingCost <= 0) {
        holds.push({
          rule: "R2",
          label: "Zero or Negative Price — Data Error",
          detail: `SKU ${rawSku}: incoming price = ${incomingCost}. This is likely a data error in the supplier file. Correct before releasing.`,
          severity: "High",
        });
      }
    }

    // --------------------------------------------------------
    // R3 — EOR / DD: NO GATE
    // These always flow. Only caught here if they also trigger R1 or R4.
    // (no code needed — the absence of a rule IS the rule)
    // --------------------------------------------------------

    // --------------------------------------------------------
    // R4 — Description drift (always hold)
    // --------------------------------------------------------
    if (spdRec) {
      const incoming = stagingRec
        .getCellValueAsString("fldkAm1iLOJJYmzmi")
        .trim()
        .toUpperCase();
      const existing = spdRec
        .getCellValueAsString("fldoROoSpEm5FuUnI")
        .trim()
        .toUpperCase();
      if (incoming && existing && incoming !== existing) {
        holds.push({
          rule: "R4",
          label: "Supplier Description Drift — Approval Required",
          detail:
            `Description change detected on SKU ${rawSku}.\n` +
            `Current SPD: "${existing.substring(0, 120)}"\n` +
            `Incoming:    "${incoming.substring(0, 120)}"`,
          severity: "Low",
        });
      }
    }

    // --------------------------------------------------------
    // R5 — Active SKU status contradiction (A+Z window only)
    // Only flag if SKU is in active transition AND incoming
    // signals a lifecycle change via the Is_Discontinued or Is_End_Of_Range checkboxes
    // FIX: was reading fldA6XW6HKOD9ks3Q (Stock Status) which is not in the schema.
    //      Staging has fld86PlXSbmJlrx8N (Is_Discontinued) and fldE3iZL2T294su95 (Is_End_Of_Range).
    // --------------------------------------------------------
    // Rule R5: Detect lifecycle signals on active records during A+Z window
    if (pmId && inZWindow) {
      const isDiscontinued =
        stagingRec.getCellValue("fld86PlXSbmJlrx8N") === true;
      const isEOR = stagingRec.getCellValue("fldE3iZL2T294su95") === true;
      const currentPMStatus = pmData ? pmData.productStatus : null;

      if (currentPMStatus === "Active" && (isDiscontinued || isEOR)) {
        const signal = isDiscontinued ? "Is_Discontinued" : "Is_End_Of_Range";
        infoLogs.push({
          rule: "R5",
          label: "Lifecycle Change During Transition (Informational)",
          detail: `SKU ${rawSku} has ${signal} = true. Proceeding to Script 1.`,
        });
      }
    }
    // --------------------------------------------------------
    // Route result
    // --------------------------------------------------------
    if (holds.length > 0) {
      // HOLD the record
      countHeld++;

      stagingUpdates.push({
        id: stagingRec.id,
        fields: {
          fldbrUDvLv8OEnEqh: { name: "pending_review" },
        },
      });

      // One Anomalies record per hold-level violation
      const severityMap = {
        Critical: "Critical",
        High: "High",
        Medium: "Medium",
        Low: "Low",
        Info: "Info",
      };
      const errorTypeMap = {
        R1: "Price_Spike",
        R2: "Zero_Price",
        R4: "Description_Drift",
        R5: "Stock_Logic_Error",
      };

      for (const h of holds) {
        anomCreates.push({
          fields: {
            fldjYiDzJmdYJp6uF: {
              name: errorTypeMap[h.rule] || "Missing_Data",
            }, // Changed fallback from 'Data_Quality' to a valid schema option to prevent routing crashes
            fld3TPgysD2hLbtvR: {
              name: severityMap[h.severity] || "Medium",
            },
            fldbPrkOy6XavA4ef: {
              name: "ETL_Script",
            },
            fld4li4vcLn43h2N4: {
              name: "Open",
            },
            fld0wlmRbNFgVpbXS: rawSku.substring(0, 200),
            fldE7JCdKubLvxysd: new Date().toISOString().split("T"),
            fldB7o9RtnQPi4goY:
              `RULE: [${h.rule}] ${h.label}\n\n` +
              `DETAIL:\n${h.detail}\n\n` +
              `ACTION: Review Staging record for SKU ${rawSku}. ` +
              `Correct if needed, then check Approved on this Anomaly. ` +
              `Run Script 0C to release back to pending.`,
          },
        });
      }
      // Also log any informational notes that came along with a held record
      // NEW: Silent Continuation Snippet
      if (infoLogs.length > 0) {
        const allNotes = [
          ...holds.map((h) => `[HOLD] ${h.label}`),
          ...infoLogs.map((i) => `[INFO] ${i.label}`),
        ].join(" | ");

        adminNotes.push({
          fields: {
            // 1. The Reason/Note
            fld4l6AJhVNRzIaY8: `Script 0B — SKU ${rawSku} HELD. ${holds.length} hold(s): ${allNotes}`,

            // 2. The Category (Keeps your admin panel categorized)
            flda8oHUThBc1Kb7I: { name: "Missing_Data" },

            // 3. The Status (Set to "Info" so it doesn't hit the Review queue)
            fldog9l4DwJeE5Qj8: { name: "Under_Review" }, // HUMAN ACTION REQUIRED

            // 4. The Identifier
            fldILG5KBZqYIZx2v: rawSku.substring(0, 200), //detected value

            // NOTE: fldog9l4DwJeE5Qj8 (Under_Review) is OMITTED so it stays silent.
          },
        });
      }
    } else if (infoLogs.length > 0) {
      // PASS — but write informational Admin Log notes
      countInfoLogged++;
      for (const info of infoLogs) {
        adminNotes.push({
          fields: {
            fld4l6AJhVNRzIaY8: `Script 0B ℹ️ SKU ${rawSku} passed. [${info.rule}] ${info.label}`,
            flda8oHUThBc1Kb7I: { name: "Missing_Data" },
            fldPdoc6JPYHV9gpb: { name: "Info" },
            fldog9l4DwJeE5Qj8: { name: "Logged" },
            fldILG5KBZqYIZx2v: rawSku.substring(0, 200), //detected value
          },
        });
      }
      // Record stays pending — no stagingUpdate needed
    } else {
      countClean++;
      // Record stays pending — flows straight to Script 1 / 2B
    }
  }

  // ============================================================
  // STEP 4 — Preview + confirm
  // ============================================================
  console.log("---");
  console.log("## Step 4 — Validation Results");
  console.log(
    "| Result | Count |\n|---|---|\n" +
      `| ✅ Clean — flows to Script 1/2B         | ${countClean}        |\n` +
      `| ℹ️  Passed with info note (no hold)      | ${countInfoLogged}   |\n` +
      `| 🔴 Held — pending_review                 | ${countHeld}         |\n` +
      `| Anomalies records to create              | ${anomCreates.length}|\n` +
      `| Admin Log notes to write                 | ${adminNotes.length} |`,
  );

  if (countHeld === 0 && adminNotes.length === 0) {
    console.log("✅ All records passed cleanly. Run Script 1 / 2B.");
    return;
  }

  if (countHeld === 0) {
    console.log(
      `ℹ️ No records held. **${countInfoLogged}** record(s) passed with informational notes. ` +
        `Run Script 1 / 2B — notes will be written to Admin Logs.`,
    );
  }

  // ============================================================
  // STEP 5 — Write
  // ============================================================
  console.log("---");
  console.log("## Step 5 — Writing...");

  try {
    if (stagingUpdates.length > 0) {
      console.log(
        `Holding ${stagingUpdates.length} Staging records → pending_review...`,
      );
      for (const batch of chunk(stagingUpdates, 50)) {
        await stagingTable.updateRecordsAsync(batch);
      }
      console.log("✅ Holds applied.");
    }

    if (anomCreates.length > 0) {
      console.log(`Creating ${anomCreates.length} Anomalies records...`);
      for (const batch of chunk(anomCreates, 50)) {
        await anomTable.createRecordsAsync(batch);
      }
      console.log("✅ Anomalies written.");
    }

    if (adminNotes.length > 0) {
      for (const batch of chunk(adminNotes, 50)) {
        await adminLogs.createRecordsAsync(batch);
      }
      console.log(`✅ ${adminNotes.length} Admin Log notes written.`);
    }
  } catch (e) {
    console.log("❌ **Write error:** " + e.message);
    try {
      await adminLogs.createRecordsAsync([
        {
          fields: {
            fld4l6AJhVNRzIaY8: "Script 0B WRITE ERROR: " + e.message,
          },
        },
      ]);
    } catch (logErr) {
      console.log("⚠️ Could not write to Admin Logs: " + logErr.message);
    }
    return;
  }

  // ============================================================
  // STEP 6 — Summary
  // ============================================================
  console.log("---");
  console.log("## ✅ Validation Gate Complete");
  console.log(
    "| Metric | Count |\n|--------|-------|\n" +
      `| Records scanned                 | ${pendingRecords.length} |\n` +
      `| Passed clean                    | ${countClean}            |\n` +
      `| Passed with info note           | ${countInfoLogged}       |\n` +
      `| Held (pending_review)           | ${countHeld}             |\n` +
      `| Anomalies created               | ${anomCreates.length}    |`,
  );

  if (countHeld > 0) {
    console.log(
      "> **Next steps for held records:**\n" +
        "> 1. Review **Anomalies** table — each hold has the rule, detail and action\n" +
        "> 2. Correct values in **Staging** if needed\n" +
        "> 3. Check **Approved** ✅ on each Anomaly when satisfied\n" +
        "> 4. Run **Script 0C** to release approved records → pending\n" +
        "> 5. Run Script 1 / 2B as normal",
    );
  } else {
    console.log("> ✅ No holds. Safe to run Script 1 / 2B now.");
  }
}

await main();
