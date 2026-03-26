/**
 * SCRIPT 0B — VALIDATION GATE v1.3
 * Utile PIM | Base: appefUQrLFZYN4Y5t
 *
 * DESIGN PRINCIPLE (v1.3):
 *   UPCAdmin = things Nina MUST approve before import can proceed.
 *   SystemLogs = everything else — informational, auto-resolved, new products.
 *   Nina reviews UPCAdmin only. She sees the rest in System Activity after the fact.
 *
 * RULES:
 *   R1 — Price change DURING active A+Z transition  → HOLD (UPCAdmin) — margin risk
 *   R1 — Price change, no transition                → SystemLog INFO only, record flows
 *   R2 — Zero or negative price                     → HOLD (UPCAdmin) — data error
 *   R3 — EOR/DD                                     → always flow, no gate
 *   R4 — Description drift                          → SystemLog INFO only, Script 1 null-safe
 *   R5 — Lifecycle change during A+Z transition     → SystemLog INFO only
 *   R8 — EOR row, both stock fields null            → HOLD (UPCAdmin) — column missing from file
 *
 *   Body type, dimensions, unknown SKUs:
 *   → NOT held. Script 1 handles via standardization engine.
 *   → Unresolvable values logged to SystemLogs as warnings for Nina to review after import.
 */

// ─────────────────────────────────────────────────────────
// LOG HELPER — works in both script UI and automation mode
// ─────────────────────────────────────────────────────────
const log = (msg) => {
  try { output.markdown(msg); } catch(_) {}
  console.log(String(msg).replace(/\*\*/g,'').replace(/`/g,'').replace(/#+\s/g,''));
};

async function main() {
  log("# 🛡️ Script 0B — Validation Gate v1.3");
  log(`> Running at: \`${new Date().toLocaleString()}\``);
  log("> Gate: only holds things Nina must approve. Everything else logs and flows.");
  log("---");

  const stagingTable = base.getTable("tblcPSP5NcP0ioUP8");
  const spdTable     = base.getTable("tbl7mZpHJCUs1r0cg");
  const pbTable      = base.getTable("tblW85ycReRUr0Ze1");
  const pmTable      = base.getTable("tblgLqMMXX2HcKt9U");
  const anomTable    = base.getTable("tbl56i9Rlm2mK6t1w");
  const adminLogs    = base.getTable("tblk1v5VHPEC2c2u2");

  // ──────────────────────────────────────────────────────
  // STEP 1 — Load pending Staging records
  // ──────────────────────────────────────────────────────
  log("## Step 1 — Loading pending Staging records...");

  const stagingQuery = await stagingTable.selectRecordsAsync({
    fields: [
      "fldeEd9FiNq5AtGNk", // Supplier SKU
      "fldjdRY1TAJypmcPF", // Import Type
      "fldbrUDvLv8OEnEqh", // Sys Etl Process Status
      "fldkAm1iLOJJYmzmi", // Supplier Product Description
      "fldHDkQCH8jKeJZ7g", // Retail Excl (price)
      "fld86PlXSbmJlrx8N", // Is Discontinued       — R5
      "fldE3iZL2T294su95", // Is End Of Range       — R5
      "fld4WI1P7S1cGxoyo", // Stock On Hand EOR     — R8
      "fldhNujCBWdylBEzS", // Stock On Hand         — R8
    ],
  });

  const pendingRecords = stagingQuery.records.filter(
    r => r.getCellValueAsString("fldbrUDvLv8OEnEqh") === "pending"
  );

  log(`✅ Found **${pendingRecords.length}** pending records to validate.`);
  if (pendingRecords.length === 0) {
    log("Nothing to validate. Run Script 0A first.");
    return;
  }

  // ──────────────────────────────────────────────────────
  // STEP 2 — Build reference indexes
  // ──────────────────────────────────────────────────────
  log("---");
  log("## Step 2 — Building reference indexes...");

  // SPD index: normKey → record
  const spdQuery = await spdTable.selectRecordsAsync({
    fields: [
      "fldmeU6JZIwvGAuRH", // Supplier Product Data ID
      "fldoROoSpEm5FuUnI", // SPD Product Description
      "fldGxaIlPVor7QEwN", // ProductMaster link
    ],
  });
  const spdIndex = {};
  for (const rec of spdQuery.records) {
    const key = rec.getCellValueAsString("fldmeU6JZIwvGAuRH").trim().toUpperCase();
    if (key) spdIndex[key] = rec;
  }

  // PM index: pmId → { hasActiveZPair, productStatus }
  const pmQuery = await pmTable.selectRecordsAsync({
    fields: [
      "fldvqYzX3ZVB1UsRi", // Transition Linked SKU
      "flddq6S7409EBM71D", // stock status DB
    ],
  });
  const pmIndex = {};
  for (const rec of pmQuery.records) {
    const transition = rec.getCellValue("fldvqYzX3ZVB1UsRi") || [];
    pmIndex[rec.id] = {
      hasActiveZPair: transition.length > 0,
      productStatus:  rec.getCellValueAsString("flddq6S7409EBM71D") || "",
    };
  }

  // PricingBridge cost index: "pmId|priceType" → last known cost
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
    const pt      = rec.getCellValueAsString("fldlCCMJvTDaNin4h").toLowerCase();
    const cost    = rec.getCellValue("fldxf21wIe7LXyHFz");
    if (pmLinks.length > 0 && pt && cost !== null) {
      pbCostIndex[`${pmLinks[0].id}|${pt}`] = cost;
    }
  }

  log(
    `✅ Indexed: **${Object.keys(spdIndex).length}** SPD | ` +
    `**${Object.keys(pbCostIndex).length}** PricingBridge | ` +
    `**${Object.keys(pmIndex).length}** PM`
  );

  const normSku = s =>
    String(s || "").replace(/[-\s]/g, "").trim().toUpperCase();

  // ──────────────────────────────────────────────────────
  // STEP 3 — Run validation rules
  // ──────────────────────────────────────────────────────
  log("---");
  log("## Step 3 — Validating...");

  const chunk = (arr, n) => {
    const o = [];
    for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n));
    return o;
  };

  const stagingUpdates = [];
  const anomCreates    = [];
  const infoLogBatch   = [];

  let countClean = 0, countHeld = 0, countInfoLogged = 0;

  for (const stagingRec of pendingRecords) {
    const rawSku     = stagingRec.getCellValueAsString("fldeEd9FiNq5AtGNk").trim();
    const normKey    = normSku(rawSku);
    const importType = stagingRec.getCellValueAsString("fldjdRY1TAJypmcPF");

    const spdRec   = spdIndex[normKey] || null;
    const pmLinks  = spdRec ? spdRec.getCellValue("fldGxaIlPVor7QEwN") || [] : [];
    const pmId     = pmLinks.length > 0 ? pmLinks[0].id : null;
    const pmData   = pmId ? pmIndex[pmId] : null;
    const inZWindow = pmData ? pmData.hasActiveZPair : false;

    const holds    = []; // → UPCAdmin, blocks record
    const infoLogs = []; // → SystemLogs only, record flows

    // ── R1 — Price change ─────────────────────────────────
    if (importType.startsWith("PR") && pmId) {
      const incoming  = stagingRec.getCellValue("fldHDkQCH8jKeJZ7g");
      const lastKnown = pbCostIndex[`${pmId}|standard`];

      if (lastKnown !== undefined && incoming !== null && Math.abs(incoming - lastKnown) > 0) {
        const pct       = lastKnown !== 0
          ? (((incoming - lastKnown) / lastKnown) * 100).toFixed(1)
          : "N/A";
        const direction = incoming > lastKnown ? "▲ increase" : "▼ decrease";
        const detail    =
          `Price ${direction} | SKU: ${rawSku}\n` +
          `Previous: R${lastKnown} → Incoming: R${incoming} (${pct}%)`;

        if (inZWindow) {
          // Mid-transition — margin risk → HOLD
          holds.push({
            errorType: "Price_Spike",
            severity:  "Critical",
            label:     "Price Change During Code Transition — Hold for Review",
            detail:    detail + "\nThis SKU is mid-transition (old and new code both active). " +
                       "A price change here carries margin risk. Review before releasing.",
          });
        } else {
          // Normal price update → log only, flows through
          infoLogs.push(`Price update: ${rawSku} | ${detail}`);
        }
      }
    }

    // ── R2 — Zero or negative price ──────────────────────
    if (importType.startsWith("PR")) {
      const incoming = stagingRec.getCellValue("fldHDkQCH8jKeJZ7g");
      if (incoming !== null && incoming <= 0) {
        holds.push({
          errorType: "Zero_Price",
          severity:  "Critical",
          label:     "Zero or Negative Price — Data Error in Supplier File",
          detail:
            `SKU: ${rawSku} | Incoming price: R${incoming}\n` +
            `A price of zero or less is not valid. Check the supplier file for this SKU.`,
        });
      }
    }

    // ── R3 — EOR/DD: NO GATE ─────────────────────────────
    // EOR and DD records always flow unless also triggering R1 or R8.

    // ── R4 — Description drift → INFO only, flows ────────
    if (spdRec) {
      const incoming = stagingRec.getCellValueAsString("fldkAm1iLOJJYmzmi").trim().toUpperCase();
      const existing = spdRec.getCellValueAsString("fldoROoSpEm5FuUnI").trim().toUpperCase();
      if (incoming && existing && incoming !== existing) {
        infoLogs.push(
          `Description change: ${rawSku}\n` +
          `  Was: "${existing.substring(0, 100)}"\n` +
          `  Now: "${incoming.substring(0, 100)}"\n` +
          `  Script 1 will update SPD null-safe.`
        );
      }
    }

    // ── R5 — Lifecycle change during A+Z → INFO only ─────
    if (pmId && inZWindow) {
      const isDiscontinued = stagingRec.getCellValue("fld86PlXSbmJlrx8N") === true;
      const isEOR          = stagingRec.getCellValue("fldE3iZL2T294su95") === true;
      if (isDiscontinued || isEOR) {
        const signal = isDiscontinued ? "Discontinued" : "End of Range";
        infoLogs.push(
          `Lifecycle signal during active transition: ${rawSku} | Signal: ${signal} | Proceeding.`
        );
      }
    }

    // ── R8 — EOR with no stock figure at all → HOLD ───────
    // Zero is valid. Null on BOTH fields = column missing from file = data error.
    if (importType.startsWith("EOR")) {
      const eorStock = stagingRec.getCellValue("fld4WI1P7S1cGxoyo");
      const soh      = stagingRec.getCellValue("fldhNujCBWdylBEzS");
      if (eorStock === null && soh === null) {
        holds.push({
          errorType: "Missing_Data",
          severity:  "Critical",
          label:     "End of Range Record Has No Stock Quantity",
          detail:
            `SKU: ${rawSku}\n` +
            `Both Stock On Hand and EOR Stock are empty — the stock column appears to be missing from the file.\n` +
            `Zero stock is valid for EOR. This hold means no stock value was present at all.\n` +
            `Check the EOR file. Add the correct stock figure to this Staging record, then approve.`,
        });
      }
    }

    // ── Route result ──────────────────────────────────────
    if (holds.length > 0) {
      countHeld++;

      stagingUpdates.push({
        id: stagingRec.id,
        fields: { "fldbrUDvLv8OEnEqh": { name: "pending_review" } },
      });

      for (const h of holds) {
        anomCreates.push({
          fields: {
            "fldjYiDzJmdYJp6uF": { name: h.errorType },
            "fld3TPgysD2hLbtvR": { name: h.severity === "Critical" ? "🔴 Critical (Stops Import)" : "Important" },
            "fldbPrkOy6XavA4ef": { name: "ETL_Script" },
            "fld4li4vcLn43h2N4": { name: "Open" },
            "fld0wlmRbNFgVpbXS": rawSku.substring(0, 200),
            "fldE7JCdKubLvxysd": new Date().toISOString().split("T")[0],
            "fldB7o9RtnQPi4goY":
              `[${h.label}]\n\n${h.detail}\n\n` +
              `To release: correct the value in Staging → tick Approved here → run Step 3 (Release Approved).`,
          },
        });
      }

      // Attach any info logs as a single SystemLog note on this held record
      if (infoLogs.length > 0) {
        infoLogBatch.push({
          fields: {
            "fld4l6AJhVNRzIaY8":
              `Script 0B — SKU ${rawSku} HELD. Additional notes:\n` +
              infoLogs.join("\n---\n"),
            "flda8oHUThBc1Kb7I": { name: "System_Event" },
            "fldPdoc6JPYHV9gpb": { name: "Info" },
            "fldog9l4DwJeE5Qj8": { name: "Logged" },
            "fldjHeNOkAl5rXSQd": [{ id: record.id }] //staginglink
          },
        });
      }

    } else if (infoLogs.length > 0) {
      // Passed — write one SystemLog entry per SKU with all notes combined
      countInfoLogged++;
      infoLogBatch.push({
        fields: {
          "fld4l6AJhVNRzIaY8":
            `Script 0B — SKU ${rawSku} passed with notes:\n` +
            infoLogs.join("\n---\n"),
          "flda8oHUThBc1Kb7I": { name: "System_Event" },
          "fldPdoc6JPYHV9gpb": { name: "Info" },
          "fldog9l4DwJeE5Qj8": { name: "Logged" },
          "fldjHeNOkAl5rXSQd": [{ id: record.id }] //staginglink
        },
      });

    } else {
      countClean++;
    }
  }

  // ──────────────────────────────────────────────────────
  // STEP 4 — Results summary
  // ──────────────────────────────────────────────────────
  log("---");
  log("## Step 4 — Results");
  log(
    `| Result | Count |\n|---|---|\n` +
    `| ✅ Clean — flows to Script 1            | ${countClean}         |\n` +
    `| ℹ️  Passed with notes (SystemLog)        | ${countInfoLogged}    |\n` +
    `| 🔴 Held — requires Nina approval        | ${countHeld}          |\n` +
    `| UPCAdmin records to create              | ${anomCreates.length} |\n` +
    `| SystemLog entries to write              | ${infoLogBatch.length}|`
  );

  if (countHeld === 0 && infoLogBatch.length === 0) {
    log("✅ All records passed cleanly. Safe to run Step 4 — Update Product Records.");
    return;
  }

  // ──────────────────────────────────────────────────────
  // STEP 5 — Write
  // ──────────────────────────────────────────────────────
  log("---");
  log("## Step 5 — Writing...");

  try {
    if (stagingUpdates.length > 0) {
      for (const b of chunk(stagingUpdates, 50))
        await stagingTable.updateRecordsAsync(b);
      log(`✅ ${stagingUpdates.length} Staging rows set to pending_review.`);
    }

    if (anomCreates.length > 0) {
      for (const b of chunk(anomCreates, 50))
        await anomTable.createRecordsAsync(b);
      log(`✅ ${anomCreates.length} UPCAdmin records created.`);
    }

    if (infoLogBatch.length > 0) {
      // Write in chunks of 50 but batch similar notes together to keep log clean
      for (const b of chunk(infoLogBatch, 50))
        await adminLogs.createRecordsAsync(b);
      log(`✅ ${infoLogBatch.length} SystemLog notes written.`);
    }

  } catch (err) {
    log(`❌ Write error: ${err.message}`);
    try {
      await adminLogs.createRecordsAsync([{
        fields: {
          "fld4l6AJhVNRzIaY8": `Script 0B WRITE ERROR: ${err.message}`,
          "flda8oHUThBc1Kb7I": { name: "System_Event" },
          "fldPdoc6JPYHV9gpb": { name: "High" },
          "fldog9l4DwJeE5Qj8": { name: "Logged" },
        },
      }]);
    } catch(_) {}
    return;
  }

  // ──────────────────────────────────────────────────────
  // STEP 6 — Summary
  // ──────────────────────────────────────────────────────
  log("---");
  log("## ✅ Validation Gate Complete");
  log(
    `| Metric | Count |\n|---|---|\n` +
    `| Records scanned         | ${pendingRecords.length} |\n` +
    `| Passed clean            | ${countClean}            |\n` +
    `| Passed with notes       | ${countInfoLogged}       |\n` +
    `| Held (needs approval)   | ${countHeld}             |\n` +
    `| UPCAdmin records created| ${anomCreates.length}    |`
  );

  if (countHeld > 0) {
    log(
      "> **Next steps:**\n" +
      "> 1. Open Import Hub → Review Queue\n" +
      "> 2. Review each flagged record — the Notes field explains exactly what to do\n" +
      "> 3. Correct the Staging record value if needed\n" +
      "> 4. Tick **Approved** on the UPCAdmin record\n" +
      "> 5. Run **Step 3 — Release Approved**\n" +
      "> 6. Then run **Step 4 — Update Product Records**"
    );
  } else {
    log("> ✅ No holds. Run Step 4 — Update Product Records now.");
  }
}

await main();