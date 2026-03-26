const CONFIG = {
  scriptName: "Script 0A",
  scriptVersion: "2.1",
  scriptPurpose: "Rename Detector — identifies batch variants (.A) and plain whammies (fuzzy matches)",

  tables: {
    staging: "tblcPSP5NcP0ioUP8",
    systemLogs: "tblk1v5VHPEC2c2u2",
    upcAdmin: "tbl56i9Rlm2mK6t1w",
    spd: "tbl7mZpHJCUs1r0cg",
    pm: "tblgLqMMXX2HcKt9U",
  },

  fields: {
    staging: {
      supplierSku: "fldeEd9FiNq5AtGNk",
      etlStatus: "fldbrUDvLv8OEnEqh",
      importType: "fldjdRY1TAJypmcPF",
      description: "fldkAm1iLOJJYmzmi",
    },
    spd: {
      sku: "fldK3FyPA98F3smc9",
      description: "fldoROoSpEm5FuUnI",
      pmLink: "fldGxaIlPVor7QEwN",
    },
    pm: {
      skuMaster: "fldMfK3uyPnDbKONn",
      description: "fld7hdhxyu61r5Olm",
      status: "flddq6S7409EBM71D",
      transitionLink: "fldvqYzX3ZVB1UsRi",
    },
    systemLogs: {
      notes: "fld4l6AJhVNRzIaY8",
      systemEvent: "flda8oHUThBc1Kb7I",
      severity: "fldPdoc6JPYHV9gpb",
      systemLog: "fldog9l4DwJeE5Qj8",
      stagingLink: "fldjHeNOkAl5rXSQd",
      reviewed: "fldJ1v4BeTILLN37J",
    },
  },

  fuzzyThreshold: 0.85,
};

// [... logUI, generateBatchId, getCurrentUserEmail, chunk, logEvent, logAnomaly, logDual ...]

// [... similarity() and normalise() functions unchanged ...]

async function main() {
  logUI(`# ${CONFIG.scriptName} — ${CONFIG.scriptPurpose}`);
  logUI(`> Version: ${CONFIG.scriptVersion}`);

  const stagingTable = base.getTable(CONFIG.tables.staging);
  const spdTable = base.getTable(CONFIG.tables.spd);
  const pmTable = base.getTable(CONFIG.tables.pm);
  const sysLogTable = base.getTable(CONFIG.tables.systemLogs);

  const batchId = generateBatchId();
  const operatorEmail = getCurrentUserEmail();

  logUI(`### Batch ID: \`${batchId}\``);

  const F = CONFIG.fields;
  const pendingRows = await stagingTable.selectRecordsAsync({
    fields: [F.staging.supplierSku, F.staging.description, F.staging.etlStatus, F.staging.importType],
  });

  const filtered = pendingRows.records.filter((r) => {
    const status = r.getCellValueAsString(F.staging.etlStatus).trim().toUpperCase();
    const type = r.getCellValueAsString(F.staging.importType).trim().toUpperCase();
    return status === "PENDING" && type === "ST";
  });

  logUI(`✅ Pending ST rows: **${filtered.length}**`);
  if (!filtered.length) {
    logUI("✅ Nothing to process.");
    return;
  }

  // Load SPD
  const spdQ = await spdTable.selectRecordsAsync({
    fields: [F.spd.sku, F.spd.description, F.spd.pmLink],
  });

  const spdByNormDesc = new Map();
  const spdBySkuUpper = new Map();
  for (const r of spdQ.records) {
    const sku = r.getCellValueAsString(F.spd.sku).trim().toUpperCase();
    const desc = r.getCellValueAsString(F.spd.description).trim();
    spdBySkuUpper.set(sku, r);
    if (desc.length >= 5) spdByNormDesc.set(normalise(desc), r);
  }

  let type1Count = 0, type2Count = 0;

  // ── TYPE 1 — Batch Variant (.A suffix detection) ────────
  logUI("## TYPE 1 — Batch Variant (.A suffix)");

  const dotARows = filtered.filter((r) =>
    r.getCellValueAsString(F.staging.supplierSku).trim().toUpperCase().endsWith(".A")
  );
  const baseSkuMap = new Map();
  for (const r of filtered) {
    const sku = r.getCellValueAsString(F.staging.supplierSku).trim().toUpperCase();
    if (!sku.endsWith(".A")) baseSkuMap.set(sku, r);
  }

  for (const dotARow of dotARows) {
    const rawSku = dotARow.getCellValueAsString(F.staging.supplierSku).trim().toUpperCase();
    const baseSku = rawSku.slice(0, -2);
    const hasPair = baseSkuMap.has(baseSku);

    logUI(
      `- \`${rawSku}\` → base \`${baseSku}\` ${hasPair ? "✅ pair found" : "⚠️ no base code in batch"}`
    );

    // NEW: Use logEvent helper
    await logEvent(
      sysLogTable,
      "Rename_Detection",
      `TYPE 1 Batch Variant detected.\nDot-A SKU: ${rawSku}\nBase SKU: ${baseSku}\nPair in batch: ${
        hasPair ? "YES" : "NO — will resolve on depletion"
      }\n\nThis is normal for Decobella batch variants. Script 1 will handle routing.`,
      "Info",
      {
        operatorEmail,
        reviewed: true, // Auto-mark reviewed (informational only)
      }
    );
    type1Count++;
  }

  // ── TYPE 2 — Plain Whammy (fuzzy description match) ────
  logUI("## TYPE 2 — Plain Whammy (unknown SKU, matched description)");

  const pmQ = await pmTable.selectRecordsAsync({
    fields: [F.pm.skuMaster, F.pm.status],
  });
  const activePmSkus = new Set(
    pmQ.records
      .filter((r) => ["ACTIVE", "NEW PRODUCTS", "SKU_Transition"].includes(
        r.getCellValueAsString(F.pm.status).trim()
      ))
      .map((r) => r.getCellValueAsString(F.pm.skuMaster).trim().toUpperCase())
  );

  for (const row of filtered) {
    const rawSku = row.getCellValueAsString(F.staging.supplierSku).trim().toUpperCase();
    const rawDesc = row.getCellValueAsString(F.staging.description).trim();

    if (rawSku.endsWith(".A")) continue; // Skip .A rows
    if (spdBySkuUpper.has(rawSku)) continue; // Skip if SKU already known

    const normIncoming = normalise(rawDesc);
    if (normIncoming.length < 5) continue;

    let bestScore = 0, bestSpdRecord = null;
    for (const [normDesc, spdRec] of spdByNormDesc.entries()) {
      const score = similarity(normIncoming, normDesc);
      if (score > bestScore) {
        bestScore = score;
        bestSpdRecord = spdRec;
      }
    }

    if (bestScore >= CONFIG.fuzzyThreshold && bestSpdRecord) {
      const matchedSku = bestSpdRecord.getCellValueAsString(F.spd.sku);
      const matchedDesc = bestSpdRecord.getCellValueAsString(F.spd.description);

      logUI(
        `- **NEW:** \`${rawSku}\` matched to **EXISTING:** \`${matchedSku}\`\n` +
        `  Similarity: ${(bestScore * 100).toFixed(1)}%`
      );

      // NEW: Use logEvent helper for detection
      await logEvent(
        sysLogTable,
        "Rename_Detection",
        `TYPE 2 Plain Whammy detected.\nNEW supplier SKU: ${rawSku}\nMATCHED existing SPD SKU: ${matchedSku}\n` +
        `Match score: ${(bestScore * 100).toFixed(1)}%\n\n` +
        `ACTION: Old SPD record → Z suffix on PLU. New record → B suffix on PLU.\n` +
        `Script 1 will handle routing. Script 2 will handle transition.`,
        "Info",
        {
          operatorEmail,
          reviewed: true,
        }
      );
      type2Count++;
    }
  }

  logUI("---");
  logUI(`## Summary`);
  logUI(`- TYPE 1 (Batch .A variants detected): **${type1Count}**`);
  logUI(`- TYPE 2 (Plain whammy renames detected): **${type2Count}**`);
  logUI(`✅ ${CONFIG.scriptName} complete. Run ${CONFIG.scriptName.replace("0A", "0B")} next.`);
}

await main();
