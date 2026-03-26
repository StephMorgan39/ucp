/**
 * SCRIPT 0B — VALIDATION GATE v1.4
 * Utile PIM | Base: appefUQrLFZYN4Y5t
 *
 * DESIGN PRINCIPLE (v1.4):
 *   UPCAdmin   = things Nina MUST approve before import can proceed.
 *   SystemLogs = everything else — informational, auto-resolved, new products.
 *   Nina reviews UPCAdmin only. She sees the rest in System Activity after the fact.
 *
 * RULES:
 *   R1 — Price change DURING active A+Z transition  → HOLD (UPCAdmin)
 *   R1 — Price change, no transition                → SystemLog INFO only
 *   R2 — Zero or negative price                     → HOLD (UPCAdmin)
 *   R3 — EOR/DD                                     → always flow, no gate
 *   R4 — Description drift                          → SystemLog INFO only
 *   R5 — Lifecycle change during A+Z transition     → SystemLog INFO only
 *   R8 — EOR row, both stock fields null            → HOLD (UPCAdmin)
 */

// ─────────────────────────────────────────────────────────
// CONFIG — Centralized schema
// ─────────────────────────────────────────────────────────
const CONFIG = {
  scriptName: "Script 0B",
  scriptVersion: "1.4",
  scriptPurpose: "Validation Gate — holds records that need Nina approval",

  tables: {
    staging: "tblcPSP5NcP0ioUP8",
    systemLogs: "tblk1v5VHPEC2c2u2",
    upcAdmin: "tbl56i9Rlm2mK6t1w",
    spd: "tbl7mZpHJCUs1r0cg",
    pm: "tblgLqMMXX2HcKt9U",
    pricingBridge: "tblW85ycReRUr0Ze1",
  },

  fields: {
    staging: {
      supplierSku: "fldeEd9FiNq5AtGNk",
      etlStatus: "fldbrUDvLv8OEnEqh",
      importType: "fldjdRY1TAJypmcPF",
      description: "fldkAm1iLOJJYmzmi",
      price: "fldHDkQCH8jKeJZ7g",
      discontinued: "fld86PlXSbmJlrx8N",
      endOfRange: "fldE3iZL2T294su95",
      eorStock: "fld4WI1P7S1cGxoyo",
      soh: "fldhNujCBWdylBEzS",
    },
    systemLogs: {
      notes: "fld4l6AJhVNRzIaY8",
      systemEvent: "flda8oHUThBc1Kb7I",
      severity: "fldPdoc6JPYHV9gpb",
      systemLog: "fldog9l4DwJeE5Qj8",
      stagingLink: "fldjHeNOkAl5rXSQd",
      reviewed: "fldJ1v4BeTILLN37J",
      upcAdminLink: "fldWXFUMjSnBFAGvd",
    },
    upcAdmin: {
      notes: "fldB7o9RtnQPi4goY",
      errorType: "fldjYiDzJmdYJp6uF",
      severity: "fld3TPgysD2hLbtvR",
      resolutionStatus: "fld4li4vcLn43h2N4",
      stagingLink: "fldz5hJMgnsZu0T07",
      approved: "flddfVzPFP0NjYhVc",
      activity: "fldWXFUMjSnBFAGvd",
    },
    spd: {
      sku: "fldmeU6JZIwvGAuRH",
      description: "fldoROoSpEm5FuUnI",
      pmLink: "fldGxaIlPVor7QEwN",
    },
    pm: {
      skuMaster: "fldMfK3uyPnDbKONn",
      status: "flddq6S7409EBM71D",
      transitionLink: "fldvqYzX3ZVB1UsRi",
    },
    pricingBridge: {
      pmLink: "fldAYj8E8RicN1EmL",
      priceType: "fldlCCMJvTDaNin4h",
      cost: "fldxf21wIe7LXyHFz",
    },
  },
};

// ─────────────────────────────────────────────────────────
// HELPERS — Logging & utilities
// ─────────────────────────────────────────────────────────
const logUI = (msg) => {
  try {
    output.markdown(msg);
  } catch (_) {}
  console.log(
    String(msg)
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/#+\s/g, "")
  );
};

const chunk = (arr, n) => {
  const o = [];
  for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n));
  return o;
};

const normSku = (s) =>
  String(s || "").replace(/[-\s]/g, "").trim().toUpperCase();

async function logEvent(sysLogTable, eventType, notes, severity = "Info", meta = {}) {
  const F = CONFIG.fields.systemLogs;
  const fields = {
    [F.systemEvent]: eventType,
    [F.notes]: notes,
    [F.severity]: severity,
  };
  if (meta.stagingRecordId) fields[F.stagingLink] = [{ id: meta.stagingRecordId }];
  if (meta.reviewed !== undefined) fields[F.reviewed] = meta.reviewed;
  const rec = await sysLogTable.createRecordAsync(fields);
  return rec;
}

async function logAnomaly(upcAdminTable, errorType, label, detail, severity = "Critical", meta = {}) {
  const F = CONFIG.fields.upcAdmin;
  const fields = {
    [F.errorType]: errorType,
    [F.notes]: `[${label}]\n\n${detail}`,
    [F.severity]: severity,
    [F.resolutionStatus]: "Unresolved",
  };
  if (meta.stagingRecordId) fields[F.stagingLink] = [{ id: meta.stagingRecordId }];
  const rec = await upcAdminTable.createRecordAsync(fields);
  return rec;
}

async function logDual(sysLogTable, upcAdminTable, eventType, errorType, detail, severity, meta = {}) {
  const anomRec = await logAnomaly(upcAdminTable, errorType, eventType, detail, severity, meta);
  const sysRec = await logEvent(sysLogTable, eventType, detail, severity, {
    ...meta,
    reviewed: false,
  });

  // Cross-link: UPCAdmin → SystemLog
  const F = CONFIG.fields.upcAdmin;
  if (sysRec) {
    await upcAdminTable.updateRecordAsync(anomRec.id, {
      [F.activity]: [{ id: sysRec.id }],
    });
  }

  return { anomRec, sysRec };
}

// ─────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────
async function main() {
  logUI(`# 🛡️ ${CONFIG.scriptName} — ${CONFIG.scriptPurpose}`);
  logUI(`> Version: ${CONFIG.scriptVersion}`);
  logUI("> Gate: only holds things Nina must approve. Everything else logs and flows.");
  logUI("---");

  const F = CONFIG.fields;
  const stagingTable = base.getTable(CONFIG.tables.staging);
  const spdTable = base.getTable(CONFIG.tables.spd);
  const pmTable = base.getTable(CONFIG.tables.pm);
  const pbTable = base.getTable(CONFIG.tables.pricingBridge);
  const sysLogTable = base.getTable(CONFIG.tables.systemLogs);
  const upcAdminTable = base.getTable(CONFIG.tables.upcAdmin);

  // ──────────────────────────────────────────────────────
  // STEP 1 — Load pending Staging records
  // ──────────────────────────────────────────────────────
  logUI("## Step 1 — Loading pending Staging records...");

  const stagingQuery = await stagingTable.selectRecordsAsync({
    fields: [
      F.staging.supplierSku,
      F.staging.importType,
      F.staging.etlStatus,
      F.staging.description,
      F.staging.price,
      F.staging.discontinued,
      F.staging.endOfRange,
      F.staging.eorStock,
      F.staging.soh,
    ],
  });

  const pendingRecords = stagingQuery.records.filter(
    (r) => r.getCellValueAsString(F.staging.etlStatus) === "pending"
  );

  logUI(`✅ Found **${pendingRecords.length}** pending records to validate.`);
  if (pendingRecords.length === 0) {
    logUI("Nothing to validate. Run Script 0A first.");
    return;
  }

  // ──────────────────────────────────────────────────────
  // STEP 2 — Build reference indexes
  // ──────────────────────────────────────────────────────
  logUI("---");
  logUI("## Step 2 — Building reference indexes...");

  // SPD index: normKey → record
  const spdQuery = await spdTable.selectRecordsAsync({
    fields: [F.spd.sku, F.spd.description, F.spd.pmLink],
  });
  const spdIndex = {};
  for (const rec of spdQuery.records) {
    const key = rec.getCellValueAsString(F.spd.sku).trim().toUpperCase();
    if (key) spdIndex[key] = rec;
  }

  // PM index: pmId → { hasActiveZPair, productStatus }
  const pmQuery = await pmTable.selectRecordsAsync({
    fields: [F.pm.transitionLink, F.pm.status],
  });
  const pmIndex = {};
  for (const rec of pmQuery.records) {
    const transition = rec.getCellValue(F.pm.transitionLink) || [];
    pmIndex[rec.id] = {
      hasActiveZPair: transition.length > 0,
      productStatus: rec.getCellValueAsString(F.pm.status) || "",
    };
  }

  // PricingBridge cost index: "pmId|priceType" → last known cost
  const pbQuery = await pbTable.selectRecordsAsync({
    fields: [F.pricingBridge.pmLink, F.pricingBridge.priceType, F.pricingBridge.cost],
  });
  const pbCostIndex = {};
  for (const rec of pbQuery.records) {
    const pmLinks = rec.getCellValue(F.pricingBridge.pmLink) || [];
    const pt = rec.getCellValueAsString(F.pricingBridge.priceType).toLowerCase();
    const cost = rec.getCellValue(F.pricingBridge.cost);
    if (pmLinks.length > 0 && pt && cost !== null) {
      pbCostIndex[`${pmLinks[0].id}|${pt}`] = cost;
    }
  }

  logUI(
    `✅ Indexed: **${Object.keys(spdIndex).length}** SPD | ` +
    `**${Object.keys(pbCostIndex).length}** PricingBridge | ` +
    `**${Object.keys(pmIndex).length}** PM`
  );

  // ──────────────────────────────────────────────────────
  // STEP 3 — Run validation rules
  // ──────────────────────────────────────────────────────
  logUI("---");
  logUI("## Step 3 — Validating...");

  let countClean = 0,
    countHeld = 0,
    countInfoLogged = 0;
  const stagingUpdates = [];

  for (const stagingRec of pendingRecords) {
    const rawSku = stagingRec.getCellValueAsString(F.staging.supplierSku).trim();
    const normKey = normSku(rawSku);
    const importType = stagingRec.getCellValueAsString(F.staging.importType);

    const spdRec = spdIndex[normKey] || null;
    const pmLinks = spdRec ? spdRec.getCellValue(F.spd.pmLink) || [] : [];
    const pmId = pmLinks.length > 0 ? pmLinks[0].id : null;
    const pmData = pmId ? pmIndex[pmId] : null;
    const inZWindow = pmData ? pmData.hasActiveZPair : false;

    const holds = [];
    const infoLogs = [];

    // ── R1 — Price change ─────────────────────────────────
    if (importType.startsWith("PR") && pmId) {
      const incoming = stagingRec.getCellValue(F.staging.price);
      const lastKnown = pbCostIndex[`${pmId}|standard`];

      if (lastKnown !== undefined && incoming !== null && Math.abs(incoming - lastKnown) > 0) {
        const pct = lastKnown !== 0 ? (((incoming - lastKnown) / lastKnown) * 100).toFixed(1) : "N/A";
        const direction = incoming > lastKnown ? "▲ increase" : "▼ decrease";
        const detail =
          `Price ${direction} | SKU: ${rawSku}\n` +
          `Previous: R${lastKnown} → Incoming: R${incoming} (${pct}%)`;

        if (inZWindow) {
          holds.push({
            errorType: "Price_Spike",
            severity: "Critical",
            label: "Price Change During Code Transition — Hold for Review",
            detail:
              detail +
              "\nThis SKU is mid-transition (old and new code both active). " +
              "A price change here carries margin risk. Review before releasing.",
          });
        } else {
          infoLogs.push(`Price update: ${rawSku} | ${detail}`);
        }
      }
    }

    // ── R2 — Zero or negative price ──────────────────────
    if (importType.startsWith("PR")) {
      const incoming = stagingRec.getCellValue(F.staging.price);
      if (incoming !== null && incoming <= 0) {
        holds.push({
          errorType: "Zero_Price",
          severity: "Critical",
          label: "Zero or Negative Price — Data Error in Supplier File",
          detail:
            `SKU: ${rawSku} | Incoming price: R${incoming}\n` +
            `A price of zero or less is not valid. Check the supplier file for this SKU.`,
        });
      }
    }

    // ── R3 — EOR/DD: NO GATE
    // EOR and DD records always flow unless also triggering R1 or R8.

    // ── R4 — Description drift → INFO only, flows ────────
    if (spdRec) {
      const incoming = stagingRec.getCellValueAsString(F.staging.description).trim().toUpperCase();
      const existing = spdRec.getCellValueAsString(F.spd.description).trim().toUpperCase();
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
      const isDiscontinued = stagingRec.getCellValue(F.staging.discontinued) === true;
      const isEOR = stagingRec.getCellValue(F.staging.endOfRange) === true;
      if (isDiscontinued || isEOR) {
        const signal = isDiscontinued ? "Discontinued" : "End of Range";
        infoLogs.push(
          `Lifecycle signal during active transition: ${rawSku} | Signal: ${signal} | Proceeding.`
        );
      }
    }

    // ── R8 — EOR with no stock figure at all → HOLD ───────
    if (importType.startsWith("EOR")) {
      const eorStock = stagingRec.getCellValue(F.staging.eorStock);
      const soh = stagingRec.getCellValue(F.staging.soh);
      if (eorStock === null && soh === null) {
        holds.push({
          errorType: "Missing_Data",
          severity: "Critical",
          label: "End of Range Record Has No Stock Quantity",
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
        fields: { [F.staging.etlStatus]: { name: "pending_review" } },
      });

      for (const h of holds) {
        await logDual(
          sysLogTable,
          upcAdminTable,
          "Validation_Hold",
          h.errorType,
          `${h.detail}\n\nTo release: correct the value in Staging → tick Approved in UPCAdmin → run Step 3 (Release Approved).`,
          h.severity,
          { stagingRecordId: stagingRec.id }
        );
      }
    } else if (infoLogs.length > 0) {
      countInfoLogged++;
      await logEvent(
        sysLogTable,
        "Validation_Note",
        `SKU ${rawSku} passed with notes:\n` + infoLogs.join("\n---\n"),
        "Info",
        { stagingRecordId: stagingRec.id, reviewed: true }
      );
    } else {
      countClean++;
    }
  }

  // ──────────────────────────────────────────────────────
  // STEP 4 — Update Staging records
  // ──────────────────────────────────────────────────────
  if (stagingUpdates.length > 0) {
    for (const b of chunk(stagingUpdates, 50)) {
      await stagingTable.updateRecordsAsync(b);
    }
    logUI(`✅ ${stagingUpdates.length} Staging rows set to pending_review.`);
  }

  // ──────────────────────────────────────────────────────
  // SUMMARY
  // ──────────────────────────────────────────────────────
  logUI("---");
  logUI("## ✅ Validation Gate Complete");
  logUI(
    `| Result | Count |\n|---|---|\n` +
    `| ✅ Clean — flows to Script 1 | ${countClean} |\n` +
    `| ℹ️ Passed with notes | ${countInfoLogged} |\n` +
    `| 🔴 Held — needs approval | ${countHeld} |`
  );

  if (countHeld > 0) {
    logUI("> **Next:** Open Import Hub → Review Queue → Approve records → Run Step 3");
  } else {
    logUI("> ✅ No holds. Run Step 4 — Update Product Records now.");
  }
}

await main();