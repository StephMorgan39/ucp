// ═══════════════════════════════════════════════════════════════════════════════
// SCRIPT 0A — RENAME DETECTOR (Refactored for Airtable Automation)
// Version: 2.1.1
// Purpose: Identifies batch variants (.A) and plain whammies (fuzzy matches)
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  scriptName: "Script 0A",
  scriptVersion: "2.1.1",
  scriptPurpose:
    "Rename Detector — identifies batch variants (.A) and plain whammies (fuzzy matches)",
  executionContext: "automation",
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

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1: CORE UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

let _logBuffer = [];

function logUI(message) {
  if (CONFIG.executionContext === "extension") {
    output.markdown(message);
  } else {
    const cleaned = message.replace(/[#*`_~]/g, "").trim();
    _logBuffer.push(cleaned);
    console.log(cleaned);
  }
}

function generateBatchId() {
  const now = new Date();
  const pad = (n, len = 2) => String(n).padStart(len, "0");
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${datePart}-${timePart}-${randomPart}`;
}

function getCurrentUserEmail() {
  if (CONFIG.executionContext === "automation") {
    try {
      const cfg = input.config();
      return cfg.userEmail || cfg.operatorEmail || "automation@system.local";
    } catch (e) {
      return "automation@system.local";
    }
  } else {
    try {
      const user = base.currentUser;
      return user?.email || "operator@manual.local";
    } catch (e) {
      return "operator@manual.local";
    }
  }
}

// Helper for Automation context: safely extract string from getCellValue
function getStringValue(record, fieldId) {
  const value = record.getCellValue(fieldId);
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && value.name) return value.name;
  if (Array.isArray(value)) return value.map((v) => v.name || v).join(", ");
  return String(value).trim();
}

function chunk(array, size = 50) {
  if (!Array.isArray(array)) return [];
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2: TEXT PROCESSING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function normalise(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function similarity(str1, str2) {
  if (!str1 && !str2) return 1;
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;
  const len1 = str1.length;
  const len2 = str2.length;
  const lenRatio = Math.min(len1, len2) / Math.max(len1, len2);
  if (lenRatio < 0.5) return lenRatio * 0.5;
  let prevRow = [];
  let currRow = [];
  let s1 = str1,
    s2 = str2;
  if (len1 > len2) {
    s1 = str2;
    s2 = str1;
  }
  const m = s1.length,
    n = s2.length;
  for (let j = 0; j <= n; j++) prevRow[j] = j;
  for (let i = 1; i <= m; i++) {
    currRow[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        prevRow[j] + 1,
        currRow[j - 1] + 1,
        prevRow[j - 1] + cost,
      );
    }
    [prevRow, currRow] = [currRow, prevRow];
  }
  const distance = prevRow[n];
  const maxLen = Math.max(m, n);
  return maxLen === 0 ? 1 : 1 - distance / maxLen;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3: LOGGING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

async function logEvent(
  sysLogTable,
  eventType,
  notes,
  severity = "Info",
  options = {},
) {
  const F = CONFIG.fields.systemLogs;
  const timestamp = new Date().toISOString();
  const operator = options.operatorEmail || "system";
  // Only allowed values for single select fields!
  const allowedSystemLog = ["Logged", "Error", "System_Fixed", "Open"];
  const allowedSeverity = ["Info", "Low", "Medium", "High", "Critical"];
  const systemLogValue = allowedSystemLog.includes(
    severity === "Error" ? "Error" : "Logged",
  )
    ? severity === "Error"
      ? "Error"
      : "Logged"
    : "Logged";
  const severityValue = allowedSeverity.includes(severity) ? severity : "Info";
  const recordData = {
    [F.systemEvent]: { name: eventType }, // eventType must match allowed options in your field!
    [F.notes]: `[${timestamp}] [${CONFIG.scriptName}] [${operator}]\n\n${notes}`,
    [F.severity]: { name: severityValue },
    [F.systemLog]: { name: systemLogValue },
    [F.reviewed]: options.reviewed ?? false,
  };
  if (
    options.stagingLinks &&
    Array.isArray(options.stagingLinks) &&
    options.stagingLinks.length > 0
  ) {
    recordData[F.stagingLink] = options.stagingLinks.map((id) => ({ id }));
  }
  try {
    await sysLogTable.createRecordAsync(recordData);
  } catch (error) {
    console.error(`⚠️ logEvent failed: ${error.message}`);
  }
}

async function logAnomaly(sysLogTable, anomalyType, details, options = {}) {
  await logEvent(sysLogTable, anomalyType, details, "Warning", {
    ...options,
    reviewed: false,
  });
}

async function logDual(
  sysLogTable,
  uiMessage,
  eventType,
  logDetails,
  severity = "Info",
  options = {},
) {
  logUI(uiMessage);
  await logEvent(sysLogTable, eventType, logDetails, severity, options);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4: MAIN PROCESSING FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  logUI(`# ${CONFIG.scriptName} — ${CONFIG.scriptPurpose}`);
  logUI(`> Version: ${CONFIG.scriptVersion}`);
  logUI(`> Mode: ${CONFIG.executionContext.toUpperCase()}`);

  const stagingTable = base.getTable(CONFIG.tables.staging);
  const spdTable = base.getTable(CONFIG.tables.spd);
  const pmTable = base.getTable(CONFIG.tables.pm);
  const sysLogTable = base.getTable(CONFIG.tables.systemLogs);

  const batchId = generateBatchId();
  const operatorEmail = getCurrentUserEmail();

  logUI(`### Batch ID: \`${batchId}\``);
  logUI(`### Operator: \`${operatorEmail}\``);

  await logEvent(
    sysLogTable,
    "Script_Start",
    `${CONFIG.scriptName} v${CONFIG.scriptVersion} initiated.\nBatch ID: ${batchId}\nOperator: ${operatorEmail}`,
    "Info",
    { operatorEmail, reviewed: true },
  );

  const F = CONFIG.fields;

  // Fetch Pending Staging Records
  const pendingRows = await stagingTable.selectRecordsAsync({
    fields: [
      F.staging.supplierSku,
      F.staging.description,
      F.staging.etlStatus,
      F.staging.importType,
    ],
  });

  const filtered = pendingRows.records.filter((r) => {
    const status = getStringValue(r, F.staging.etlStatus).toLowerCase();
    const type = getStringValue(r, F.staging.importType).toUpperCase();
    return status === "pending" && type === "ST";
  });

  logUI(`✅ Pending ST rows found: **${filtered.length}**`);

  if (!filtered.length) {
    logUI("✅ Nothing to process. Exiting.");
    await logEvent(
      sysLogTable,
      "Script_Complete",
      `${CONFIG.scriptName} completed with no records to process.\nBatch ID: ${batchId}`,
      "Info",
      { operatorEmail, reviewed: true },
    );
    return;
  }

  // Load SPD Reference Data
  const spdQ = await spdTable.selectRecordsAsync({
    fields: [F.spd.sku, F.spd.description, F.spd.pmLink],
  });

  const spdByNormDesc = new Map();
  const spdBySkuUpper = new Map();

  for (const r of spdQ.records) {
    const sku = getStringValue(r, F.spd.sku).trim().toUpperCase();
    const desc = getStringValue(r, F.spd.description).trim();
    spdBySkuUpper.set(sku, r);
    if (desc.length >= 5) {
      spdByNormDesc.set(normalise(desc), r);
    }
  }

  logUI(
    `📦 SPD lookup loaded: **${spdBySkuUpper.size}** SKUs, **${spdByNormDesc.size}** descriptions`,
  );

  let type1Count = 0;
  let type2Count = 0;

  // TYPE 1 — BATCH VARIANT DETECTION (.A suffix)
  logUI("## TYPE 1 — Batch Variant (.A suffix)");

  const dotARows = filtered.filter((r) =>
    getStringValue(r, F.staging.supplierSku)
      .trim()
      .toUpperCase()
      .endsWith(".A"),
  );

  // Build map of base SKUs (non-.A) for pairing check
  const baseSkuMap = new Map();
  for (const r of filtered) {
    const sku = getStringValue(r, F.staging.supplierSku).trim().toUpperCase();
    if (!sku.endsWith(".A")) {
      baseSkuMap.set(sku, r);
    }
  }

  for (const dotARow of dotARows) {
    const rawSku = getStringValue(dotARow, F.staging.supplierSku)
      .trim()
      .toUpperCase();
    const baseSku = rawSku.slice(0, -2); // Remove ".A"
    const hasPair = baseSkuMap.has(baseSku);

    logUI(
      `- \`${rawSku}\` → base \`${baseSku}\` ${hasPair ? "✅ pair found" : "⚠️ no base code in batch"}`,
    );

    await logEvent(
      sysLogTable,
      "Rename_Detection",
      `TYPE 1 Batch Variant detected.\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Dot-A SKU: ${rawSku}\n` +
        `Base SKU: ${baseSku}\n` +
        `Pair in batch: ${hasPair ? "YES" : "NO — will resolve on depletion"}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `This is normal for Decobella batch variants.\n` +
        `Script 1 will handle routing.`,
      "Info",
      {
        operatorEmail,
        reviewed: true,
        stagingLinks: [dotARow.id],
      },
    );
    type1Count++;
  }

  // TYPE 2 — PLAIN WHAMMY DETECTION (Fuzzy description match)
  logUI("## TYPE 2 — Plain Whammy (unknown SKU, matched description)");

  // Load PM statuses for active SKU validation
  const pmQ = await pmTable.selectRecordsAsync({
    fields: [F.pm.skuMaster, F.pm.status],
  });

  const activePmSkus = new Set(
    pmQ.records
      .filter((r) =>
        ["ACTIVE", "NEW PRODUCTS", "SKU_TRANSITION"].includes(
          getStringValue(r, F.pm.status).trim().toUpperCase(),
        ),
      )
      .map((r) => getStringValue(r, F.pm.skuMaster).trim().toUpperCase()),
  );

  logUI(`📦 Active PM SKUs loaded: **${activePmSkus.size}**`);

  for (const row of filtered) {
    const rawSku = getStringValue(row, F.staging.supplierSku)
      .trim()
      .toUpperCase();
    const rawDesc = getStringValue(row, F.staging.description).trim();

    // Skip .A rows (already handled in TYPE 1)
    if (rawSku.endsWith(".A")) continue;

    // Skip if SKU already exists in SPD
    if (spdBySkuUpper.has(rawSku)) continue;

    const normIncoming = normalise(rawDesc);

    // Skip very short descriptions (unreliable for fuzzy matching)
    if (normIncoming.length < 5) continue;

    // Find best fuzzy match
    let bestScore = 0;
    let bestSpdRecord = null;

    for (const [normDesc, spdRec] of spdByNormDesc.entries()) {
      const score = similarity(normIncoming, normDesc);
      if (score > bestScore) {
        bestScore = score;
        bestSpdRecord = spdRec;
      }
    }

    // If match exceeds threshold, log as Plain Whammy
    if (bestScore >= CONFIG.fuzzyThreshold && bestSpdRecord) {
      const matchedSku = getStringValue(bestSpdRecord, F.spd.sku);
      const matchedDesc = getStringValue(bestSpdRecord, F.spd.description);

      logUI(
        `- **NEW:** \`${rawSku}\` matched to **EXISTING:** \`${matchedSku}\`\n` +
          `  Similarity: ${(bestScore * 100).toFixed(1)}%`,
      );

      await logEvent(
        sysLogTable,
        "Rename_Detection",
        `TYPE 2 Plain Whammy detected.\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `NEW supplier SKU: ${rawSku}\n` +
          `NEW description: ${rawDesc}\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `MATCHED existing SPD SKU: ${matchedSku}\n` +
          `MATCHED description: ${matchedDesc}\n` +
          `Match score: ${(bestScore * 100).toFixed(1)}%\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `ACTION REQUIRED:\n` +
          `• Old SPD record → Z suffix on PLU\n` +
          `• New record → B suffix on PLU\n` +
          `Script 1 will handle routing. Script 2 will handle transition.`,
        "Info",
        {
          operatorEmail,
          reviewed: true,
          stagingLinks: [row.id],
        },
      );
      type2Count++;
    }
  }

  // SUMMARY
  logUI("---");
  logUI(`## Summary`);
  logUI(`- TYPE 1 (Batch .A variants detected): **${type1Count}**`);
  logUI(`- TYPE 2 (Plain whammy renames detected): **${type2Count}**`);
  logUI(`✅ ${CONFIG.scriptName} complete.`);
  logUI(`➡️ Run **Script 0B** next.`);

  await logEvent(
    sysLogTable,
    "Script_Complete",
    `${CONFIG.scriptName} v${CONFIG.scriptVersion} completed.\n` +
      `Batch ID: ${batchId}\n` +
      `TYPE 1 detections: ${type1Count}\n` +
      `TYPE 2 detections: ${type2Count}\n` +
      `Total records processed: ${filtered.length}`,
    "Info",
    { operatorEmail, reviewed: true },
  );

  if (CONFIG.executionContext === "automation") {
    output.set("batchId", batchId);
    output.set("type1Count", type1Count);
    output.set("type2Count", type2Count);
    output.set("totalProcessed", filtered.length);
    output.set("logSummary", _logBuffer.join("\n"));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXECUTE
// ═══════════════════════════════════════════════════════════════════════════════
await main();
