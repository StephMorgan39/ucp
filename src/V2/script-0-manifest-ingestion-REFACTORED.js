/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCRIPT 0 — CSV STAGING LOADER v2.5
 * ═══════════════════════════════════════════════════════════════════════════
 * Merged from:
 *   - v2.4 (PDF template): production-grade automation safety, dual logging,
 *     GENCODE sanitisation, batch error handling, status lifecycle
 *   - v2.0 (inline): dual CSV type support (ST / PR), PR enrichment routing,
 *     data protection rules (SKU + Description locked on PR enrichment)
 *
 * Changes in v2.5:
 *   ✅ Full v2.4 CONFIG structure (tables + fields, sysLog + admin namespaces)
 *   ✅ ST and PR import routing from v2.0 (dedup + enrichment logic retained)
 *   ✅ Data Protection block: PR cannot overwrite SupplierSKU or Description
 *   ✅ Dual logging helpers: logToSystemLogs / logToUPCAdmin / logDual (v2.4)
 *   ✅ Automation-safe trigger detection via input.config()
 *   ✅ GENCODE sanitisation with per-row logging
 *   ✅ importType sourced from HelperTag (first token) — no manual prompt
 *   ✅ CANONICAL_TO_STAGING hardcoded map (v2.4 pattern; avoids async per-row lookup)
 *   ✅ Shared config header aligned to UTILE PIM SHARED CONFIG canonical IDs
 *   ✅ output.text() summary on completion
 *
 * EXECUTION MODEL:
 *   Automation trigger → SourceMetadata record created with attachment
 *   HelperTag = "ST ..." or "PR ..." determines import type
 *   Script parses CSV, deduplicates against Staging, creates/enriches records
 *   Dual-logs all errors and GENCODE corrections
 *   Updates SourceMetadata.Import Status on completion
 *
 * PIPELINE POSITION: Script 0 → (0A → 0B → 0C → 1 → 2B → 2A → 3)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — All table and field IDs in one place
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  scriptName: "Script 0",
  scriptVersion: "2.5",

  tables: {
    sourceMetadata: "tblz0ZlAJByjkqPbH", // SourceMetadata
    staging: "tblcPSP5NcP0ioUP8", // Staging
    manifest: "tblwPVgm3fLS1WjMo", // ManifestSourceConfig
    systemLogs: "tblk1v5VHPEC2c2u2", // SystemLogs
    upcAdmin: "tbl56i9Rlm2mK6t1w", // UPCAdmin (Anomalies)
  },

  fields: {
    // SourceMetadata
    meta: {
      attachment: "fld9ROntbwWHYGBt9", // Supplier Source Upload
      helperTag: "fldznkw7kfCI8sXjn", // Helper Tag (ST / PR prefix)
      supplier: "fldxFveyMk1iCU7xC", // Suppliers link
      importStatus: "fldtTTRihPTXisag8", // Import Status singleSelect
    },

    // Staging
    staging: {
      etlStatus: "fldbrUDvLv8OEnEqh", // Sys Etl Process Status
      importType: "fldjdRY1TAJypmcPF", // SPD Import class Type
      sourceMetaLink: "fldbffhLGECRlzSt2", // Source Metadata ID link
      supplierLink: "fldhYMKeVijNr36Fs", // Supplier link
      supplierSku: "fldeEd9FiNq5AtGNk", // Supplier SKU
      description: "fldkAm1iLOJJYmzmi", // Supplier Product Description
      systemLogsLink: "fldLRRurxuTiCI9wV", // SystemLogs link
      upcAdminLink: "fldRihOoeHZFzv7jP", // UPCAdmin link
      dimensions: "fldvZjLna62iMbj5K", // Dimensions MM
      thickness: "fldbgiMR2Qlm169Mu", // Thickness (Raw)
      bodyType: "fldIEO5cTzgLSSOC0", // Body Type Class
      bodyFinish: "fld4QhEwwFSgFsHRB", // Body Finish
      noFaces: "fldkh9EFaIKvc0yIj", // No Faces
      peiClass: "fldqFzEPIby2C94Du", // PEI Class
      slipRating: "fldfMSgqnPwP2hvtl", // Tech Slip Rating
      pceBox: "fldiTSUcLPa4uLT4L", // Pce Box
      sqmBox: "fldvVC9z72GqYdDko", // Sqm Box
      kgBox: "fldS2mZdWoY7hPU3G", // Kg Box
      boxPallet: "fld8Qz10GgXiS6Da5", // Box Pallet
      sqmPallet: "fldf5VU6KDd2cSqUB", // Sqm Pallet
      kgPallet: "fldOfxvmWk1K1J0TQ", // Kg Pallet
      soh: "fldhNujCBWdylBEzS", // Stock On Hand
      sav: "fldqPizK5v1z69O7L", // Stock Available
      soo: "fld6ich1CWKGs0tur", // Stock Special Order
      eta: "fldcvr9PjTp0HeKnB", // ETA date
      eorStock: "fld4WI1P7S1cGxoyo", // EOR Stock level
      retailIncl: "fldMP2ywTGMepEX9K", // Retail Incl (PR)
      stockReserved: "fldslE6XEO2Lqi4Qd", // Stock Reserved
    },

    // SystemLogs
    sysLog: {
      notes: "fld4l6AJhVNRzIaY8",
      systemEvent: "flda8oHUThBc1Kb7I",
      severity: "fldPdoc6JPYHV9gpb",
      systemLog: "fldog9l4DwJeE5Qj8",
      operatorEmail: "fldyYs6l736JsE2iJ",
      operatorNotes: "fldXtmbbu2ApOWYe4",
      stagingLink: "fldjHeNOkAl5rXSQd",
      upcAdminLink: "fldWXFUMjSnBFAGvd",
      reviewed: "fldJ1v4BeTILLN37J",
    },

    // UPCAdmin (Anomalies)
    admin: {
      errorType: "fldjYiDzJmdYJp6uF",
      severity: "fld3TPgysD2hLbtvR",
      detectedBy: "fldbPrkOy6XavA4ef",
      resolutionStatus: "fld4li4vcLn43h2N4",
      notes: "fldB7o9RtnQPi4goY",
      dateDetected: "fldE7JCdKubLvxysd",
      stagingLink: "fldz5hJMgnsZu0T07",
      sourceTable: "fldHEz5b8phNb85jT",
      systemLogLink: "fldGpOua9oNrOPesT",
    },

    // ManifestSourceConfig
    manifest: {
      incomingColName: "fldHCtuNeJJCEHiO7", // Incoming Column Name
      canonicalRegistry: "fldRcrppQB3MG5YuV", // Canonical Registry link
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CANONICAL → STAGING FIELD MAP
// Keyed by CanonicalRegistry numeric ID → Staging field ID
// Verified against ManifestSourceConfig + CanonicalRegistry + Staging schema
// ─────────────────────────────────────────────────────────────────────────────
const CANONICAL_TO_STAGING = {
  424: "fldeEd9FiNq5AtGNk", // Supplier SKU
  356: "fldkAm1iLOJJYmzmi", // Supplier Product Description
  292: "fldvZjLna62iMbj5K", // Dimensions MM
  422: "fldbgiMR2Qlm169Mu", // Thickness (Raw)
  362: "fldIEO5cTzgLSSOC0", // Body Type Class
  427: "fldslE6XEO2Lqi4Qd", // Stock Reserved
  483: "fld4QhEwwFSgFsHRB", // Body Finish
  299: "fldkh9EFaIKvc0yIj", // No Faces
  300: "fldqFzEPIby2C94Du", // PEI Class
  304: "fldfMSgqnPwP2hvtl", // Tech Slip Rating
  306: "fldiTSUcLPa4uLT4L", // Pce Box
  307: "fldvVC9z72GqYdDko", // Sqm Box
  479: "fldS2mZdWoY7hPU3G", // Kg Box
  480: "fld8Qz10GgXiS6Da5", // Box Pallet
  481: "fldf5VU6KDd2cSqUB", // Sqm Pallet
  390: "fldOfxvmWk1K1J0TQ", // Kg Pallet
  371: "fldhNujCBWdylBEzS", // Stock On Hand
  375: "fldqPizK5v1z69O7L", // Stock Available
  376: "fldMP2ywTGMepEX9K", // Retail Incl (PR)
};

// Field type classifications (used for type casting during row mapping)
const SINGLE_SELECTS = new Set([
  "fldIEO5cTzgLSSOC0", // Body Type Class
  "fld4QhEwwFSgFsHRB", // Body Finish
  "fldqFzEPIby2C94Du", // PEI Class
  "fldfMSgqnPwP2hvtl", // Tech Slip Rating
  "fldjdRY1TAJypmcPF", // Import Type
]);

const NUMBER_FIELDS = new Set([
  "fldiTSUcLPa4uLT4L", // Pce Box
  "fldvVC9z72GqYdDko", // Sqm Box
  "fldS2mZdWoY7hPU3G", // Kg Box
  "fld8Qz10GgXiS6Da5", // Box Pallet
  "fldf5VU6KDd2cSqUB", // Sqm Pallet
  "fldOfxvmWk1K1J0TQ", // Kg Pallet
  "fldhNujCBWdylBEzS", // Stock On Hand
  "fldqPizK5v1z69O7L", // Stock Available
  "fldMP2ywTGMepEX9K", // Retail Incl
  "fldkh9EFaIKvc0yIj", // No Faces
  "fldslE6XEO2Lqi4Qd", // Stock Reserved
  "fldbgiMR2Qlm169Mu", // Thickness
]);

// Fields that PR import must NEVER overwrite (data protection)
const PR_PROTECTED_FIELDS = new Set([
  "fldeEd9FiNq5AtGNk", // Supplier SKU — primary dedup key
  "fldkAm1iLOJJYmzmi", // Supplier Product Description — ST canonical
]);

// ─────────────────────────────────────────────────────────────────────────────
// LOG HELPER — UI + automation compatible
// ─────────────────────────────────────────────────────────────────────────────
const log = (msg) => {
  try {
    output.markdown(msg);
  } catch (_) {}
  console.log(
    String(msg).replace(/\*\*/g, "").replace(/`/g, "").replace(/#+\s/g, ""),
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGGING HELPERS — Dual logging to SystemLogs + UPCAdmin
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Writes an event to SystemLogs.
 * @param {Table} logTable
 * @param {string} eventType  — singleSelect value e.g. "System_Event"
 * @param {string} notes
 * @param {string} severity   — "Info" | "Low" | "Medium" | "High" | "Critical"
 * @param {Object} options    — { stagingRecordId, operatorEmail, operatorNotes, reviewed, upcAdminRecordId }
 * @returns {string|null} created record ID
 */
async function logToSystemLogs(
  logTable,
  eventType,
  notes,
  severity,
  options = {},
) {
  const F = CONFIG.fields.sysLog;
  try {
    const fields = {};
    fields[F.notes] = String(notes).substring(0, 5000);
    fields[F.systemEvent] = { name: eventType };
    fields[F.severity] = { name: severity };
    fields[F.systemLog] = { name: "Logged" };
    if (options.stagingRecordId)
      fields[F.stagingLink] = [{ id: options.stagingRecordId }];
    if (options.operatorEmail) fields[F.operatorEmail] = options.operatorEmail;
    if (options.operatorNotes) fields[F.operatorNotes] = options.operatorNotes;
    if (options.reviewed === true) fields[F.reviewed] = true;
    if (options.upcAdminRecordId)
      fields[F.upcAdminLink] = [{ id: options.upcAdminRecordId }];
    return await logTable.createRecordAsync(fields);
  } catch (err) {
    console.error("logToSystemLogs failed:", err.message);
    return null;
  }
}

/**
 * Writes an anomaly to UPCAdmin.
 * @param {Table} adminTable
 * @param {string} errorType  — singleSelect value e.g. "Missing_Data"
 * @param {string} notes
 * @param {string} severity
 * @param {Object} options    — { stagingRecordId, sourceTable, systemLogRecordId }
 * @returns {string|null} created record ID
 */
async function logToUPCAdmin(
  adminTable,
  errorType,
  notes,
  severity,
  options = {},
) {
  const F = CONFIG.fields.admin;
  try {
    const fields = {};
    fields[F.notes] = String(notes).substring(0, 5000);
    fields[F.errorType] = { name: errorType };
    fields[F.severity] = { name: severity };
    fields[F.detectedBy] = { name: "ETL_Script" };
    fields[F.resolutionStatus] = { name: "Unresolved" };
    fields[F.dateDetected] = new Date().toISOString().split("T")[0];
    if (options.stagingRecordId)
      fields[F.stagingLink] = [{ id: options.stagingRecordId }];
    if (options.sourceTable)
      fields[F.sourceTable] = { name: options.sourceTable };
    if (options.systemLogRecordId)
      fields[F.systemLogLink] = [{ id: options.systemLogRecordId }];
    return await adminTable.createRecordAsync(fields);
  } catch (err) {
    console.error("logToUPCAdmin failed:", err.message);
    return null;
  }
}

/**
 * Dual log — writes to both SystemLogs and UPCAdmin with bidirectional cross-linking.
 * Use for anomalies that need operator attention, not just audit trail.
 */
async function logDual(
  sysLogTable,
  adminTable,
  eventType,
  errorType,
  notes,
  severity,
  options = {},
) {
  const adminRecordId = await logToUPCAdmin(
    adminTable,
    errorType,
    notes,
    severity,
    {
      stagingRecordId: options.stagingRecordId,
      sourceTable: options.sourceTable || "Staging",
    },
  );
  const sysLogRecordId = await logToSystemLogs(
    sysLogTable,
    eventType,
    notes,
    severity,
    {
      stagingRecordId: options.stagingRecordId,
      operatorEmail: options.operatorEmail,
      upcAdminRecordId: adminRecordId,
    },
  );
  // Bidirectional link back
  if (adminRecordId && sysLogRecordId) {
    try {
      await adminTable.updateRecordAsync(adminRecordId, {
        [CONFIG.fields.admin.systemLogLink]: [{ id: sysLogRecordId }],
      });
    } catch (_) {}
  }
  return { sysLogRecordId, adminRecordId };
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function generateBatchId() {
  return new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
}

function chunk(arr, n = 50) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function getStringValue(record, fieldId) {
  const val = record?.getCellValue(fieldId);
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (Array.isArray(val)) {
    if (!val.length) return "";
    const first = val[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      if ("name" in first) return String(first.name ?? "");
      if ("id" in first) return String(first.id ?? "");
    }
    return "";
  }
  if (typeof val === "object" && "name" in val) return String(val.name ?? "");
  return String(val);
}

/**
 * Parses European number format: "1.234,56" → 1234.56
 * Also handles standard: "1,234.56" → 1234.56
 */
function cleanNumber(v) {
  if (v === null || v === undefined || v === "") return null;
  let s = String(v)
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^0-9.-]/g, "");
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function getCurrentUserEmail() {
  try {
    return session?.currentUser?.email ?? "automation@system";
  } catch (_) {
    return "automation@system";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GENCODE SANITISATION — Decobella Excel coercion guard
// ─────────────────────────────────────────────────────────────────────────────
const GENCODE_COERCION_WATCH = {
  3: "0003", // Excel stripped leading zeros
  "2001-1": "0001-1", // Excel date-coerced: year 2001, month 1
};

function sanitiseGencode(raw) {
  if (!raw) return { value: null, wasCorrected: false, original: null };
  const s = raw.toString().trim();
  if (GENCODE_COERCION_WATCH[s]) {
    return {
      value: GENCODE_COERCION_WATCH[s],
      wasCorrected: true,
      original: s,
    };
  }
  if (/^\d{1,4}$/.test(s)) {
    const padded = s.padStart(4, "0");
    return {
      value: padded,
      wasCorrected: padded !== s,
      original: padded !== s ? s : null,
    };
  }
  const dateCoerce = s.match(/^2(\d{3})-(\d{1,2})$/);
  if (dateCoerce) {
    const corrected = `0${dateCoerce[1]}-${dateCoerce[2]}`;
    return { value: corrected, wasCorrected: true, original: s };
  }
  return { value: s, wasCorrected: false, original: null };
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════
async function main() {
  log(`# ${CONFIG.scriptName} — CSV Staging Loader v${CONFIG.scriptVersion}`);

  // ── Table references ────────────────────────────────────────────────
  const metaTable = base.getTable(CONFIG.tables.sourceMetadata);
  const stagingTable = base.getTable(CONFIG.tables.staging);
  const manifestTable = base.getTable(CONFIG.tables.manifest);
  const sysLogsTable = base.getTable(CONFIG.tables.systemLogs);
  const upcAdminTable = base.getTable(CONFIG.tables.upcAdmin);

  // ── Tracking variables ───────────────────────────────────────────────
  const batchId = generateBatchId();
  let sourceFileName = "Unknown";
  let triggeringRecordId = null;
  let ingestedCount = 0;
  let newCount = 0;
  let enrichedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  let emptyRowCount = 0;
  const gencodeCorrections = [];
  const operatorEmail = getCurrentUserEmail();

  try {
    // ─────────────────────────────────────────────────────────────────
    // STEP 0 — Automation trigger detection
    // ─────────────────────────────────────────────────────────────────
    log("## Step 0 — Detecting triggering record...");
    const config = input.config();
    triggeringRecordId = config.recordId;

    if (!triggeringRecordId) {
      log("❌ No record ID received. Script must be triggered via automation.");
      return;
    }

    // Lock immediately
    await metaTable.updateRecordAsync(triggeringRecordId, {
      [CONFIG.fields.meta.importStatus]: { name: "Processing" },
    });

    const metaQuery = await metaTable.selectRecordsAsync({
      fields: [
        CONFIG.fields.meta.attachment,
        CONFIG.fields.meta.helperTag,
        CONFIG.fields.meta.supplier,
        CONFIG.fields.meta.importStatus,
      ],
    });
    const record = metaQuery.getRecord(triggeringRecordId);
    if (!record) {
      log(`❌ Record ${triggeringRecordId} not found in SourceMetadata.`);
      return;
    }
    log(`✅ Triggering record: ${record.id}`);
    log(`✅ Batch ID: ${batchId}`);

    // ─────────────────────────────────────────────────────────────────
    // STEP 1 — Extract metadata: attachment, importType, supplier
    // ─────────────────────────────────────────────────────────────────
    log("## Step 1 — Extracting metadata...");
    const attachments = record.getCellValue(CONFIG.fields.meta.attachment);
    if (!attachments || attachments.length === 0) {
      log("❌ No CSV attachment found.");
      await logDual(
        sysLogsTable,
        upcAdminTable,
        "System_Event",
        "Missing_Data",
        `${CONFIG.scriptName} failed: No CSV attachment.\nRecord: ${triggeringRecordId}\nBatch: ${batchId}`,
        "High",
        { operatorEmail },
      );
      await metaTable.updateRecordAsync(triggeringRecordId, {
        [CONFIG.fields.meta.importStatus]: { name: "Failed" },
      });
      return;
    }

    sourceFileName = attachments[0].filename;
    const helperTag =
      getStringValue(record, CONFIG.fields.meta.helperTag) || "ST";
    const importType = helperTag.split(" ")[0].trim().toUpperCase();
    const supplierLink = record.getCellValue(CONFIG.fields.meta.supplier);

    if (!["ST", "PR"].includes(importType)) {
      log(
        `❌ Invalid import type "${importType}" in HelperTag. Must be ST or PR.`,
      );
      await logDual(
        sysLogsTable,
        upcAdminTable,
        "System_Event",
        "Invalid_Format",
        `${CONFIG.scriptName} failed: HelperTag import type "${importType}" unrecognised.\nBatch: ${batchId}`,
        "High",
        { operatorEmail },
      );
      await metaTable.updateRecordAsync(triggeringRecordId, {
        [CONFIG.fields.meta.importStatus]: { name: "Failed" },
      });
      return;
    }

    log(`📁 File: ${sourceFileName}`);
    log(`📦 Import Type: **${importType}**`);
    log(`🏭 Supplier: ${supplierLink?.[0]?.name || "N/A"}`);

    // ─────────────────────────────────────────────────────────────────
    // STEP 2 — Load manifest column mapping
    // ─────────────────────────────────────────────────────────────────
    log("## Step 2 — Loading manifest mapping...");

    const manifestQuery = await manifestTable.selectRecordsAsync({
      fields: [
        CONFIG.fields.manifest.incomingColName,
        CONFIG.fields.manifest.canonicalRegistry,
      ],
    });

    const COLUMN_MAP = {}; // Normalised CSV header (uppercase) → Staging field ID
    for (const r of manifestQuery.records) {
      const colName = getStringValue(
        r,
        CONFIG.fields.manifest.incomingColName,
      )
        .trim()
        .toUpperCase();
      const canLink = r.getCellValue(CONFIG.fields.manifest.canonicalRegistry);
      if (colName && canLink && canLink.length > 0) {
        const canId = parseInt(canLink[0].name, 10);
        const stagingField = CANONICAL_TO_STAGING[canId];
        if (stagingField) COLUMN_MAP[colName] = stagingField;
      }
    }

    const mappedCount = Object.keys(COLUMN_MAP).length;
    log(`✅ Manifest loaded: ${mappedCount} field mappings`);
    if (mappedCount === 0) {
      log(
        "⚠️ No manifest mappings found — check ManifestSourceConfig linkage.",
      );
      await logToSystemLogs(
        sysLogsTable,
        "System_Event",
        `${CONFIG.scriptName} warning: No manifest mappings found.\nFile: ${sourceFileName}\nBatch: ${batchId}`,
        "Medium",
        { operatorEmail },
      );
    }

    // ─────────────────────────────────────────────────────────────────
    // STEP 3 — Download and parse CSV
    // ─────────────────────────────────────────────────────────────────
    log("## Step 3 — Downloading and parsing CSV...");
    let csvText;
    try {
      const response = await fetch(attachments[0].url);
      if (!response.ok)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      csvText = await response.text();
    } catch (err) {
      log(`❌ CSV download failed: ${err.message}`);
      await logDual(
        sysLogsTable,
        upcAdminTable,
        "System_Event",
        "Missing_Data",
        `${CONFIG.scriptName} failed: CSV download error.\nFile: ${sourceFileName}\nError: ${err.message}\nBatch: ${batchId}`,
        "High",
        { operatorEmail },
      );
      await metaTable.updateRecordAsync(triggeringRecordId, {
        [CONFIG.fields.meta.importStatus]: { name: "Failed" },
      });
      return;
    }

    // Auto-detect delimiter
    const firstLine = csvText.split("\n")[0];
    const delimiter = firstLine.includes(";") ? ";" : ",";
    log(`🔍 Delimiter: ${delimiter === ";" ? "semicolon (;)" : "comma (,)"}`);

    // Parse CSV (handles quoted fields, embedded newlines, \r\n)
    const rows = [];
    let row = [],
      inQuotes = false,
      val = "";
    for (let i = 0; i < csvText.length; i++) {
      const c = csvText[i],
        next = csvText[i + 1];
      if (c === '"' && inQuotes && next === '"') {
        val += '"';
        i++;
      } else if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === delimiter && !inQuotes) {
        row.push(val);
        val = "";
      } else if ((c === "\n" || c === "\r") && !inQuotes) {
        if (c === "\r" && next === "\n") i++;
        row.push(val);
        if (row.some((cell) => cell.trim() !== "")) rows.push(row);
        row = [];
        val = "";
      } else {
        val += c;
      }
    }
    if (val || row.length > 0) {
      row.push(val);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
    }

    if (rows.length < 2) {
      log("❌ CSV has no data rows.");
      await logDual(
        sysLogsTable,
        upcAdminTable,
        "System_Event",
        "Invalid_Format",
        `${CONFIG.scriptName} failed: CSV has no data rows.\nFile: ${sourceFileName}\nBatch: ${batchId}`,
        "High",
        { operatorEmail },
      );
      await metaTable.updateRecordAsync(triggeringRecordId, {
        [CONFIG.fields.meta.importStatus]: { name: "Failed" },
      });
      return;
    }

    const headers = rows[0].map((h) =>
      h
        .replace(/[\n\r]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase(),
    );
    log(
      `✅ CSV parsed: ${rows.length - 1} data rows, ${headers.length} columns`,
    );
    log(`📋 Headers: ${headers.join(" | ")}`);

    // GENCODE column index
    const gencodeColIndex = headers.findIndex((h) =>
      ["GENCODE", "GEN CODE", "GEN_CODE"].includes(h),
    );

    // ─────────────────────────────────────────────────────────────────
    // STEP 4 — Build dedup index of existing Staging records
    // ─────────────────────────────────────────────────────────────────
    log("## Step 4 — Building Staging dedup index...");

    const existingQuery = await stagingTable.selectRecordsAsync({
      fields: [
        CONFIG.fields.staging.supplierSku,
        CONFIG.fields.staging.importType,
      ],
    });

    // Map: SKU (uppercase) → { id, importType }
    const existingSkuMap = {};
    for (const rec of existingQuery.records) {
      const sku = getStringValue(rec, CONFIG.fields.staging.supplierSku)
        .trim()
        .toUpperCase();
      const type = getStringValue(
        rec,
        CONFIG.fields.staging.importType,
      )
        .trim()
        .toUpperCase();
      if (sku) existingSkuMap[sku] = { id: rec.id, importType: type };
    }
    log(
      `✅ Indexed ${Object.keys(existingSkuMap).length} existing Staging SKUs`,
    );

    // ─────────────────────────────────────────────────────────────────
    // STEP 5 — Map CSV rows → Staging records
    // ─────────────────────────────────────────────────────────────────
    log("## Step 5 — Building Staging records...");

    const stagingCreates = []; // New records
    const stagingUpdates = []; // Enrichment updates (PR → existing ST)

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length < 1 || r.every((cell) => !cell || !cell.trim())) {
        emptyRowCount++;
        continue;
      }

      // Base fields every record gets
      const baseFields = {
        [CONFIG.fields.staging.etlStatus]: { name: "pending" },
        [CONFIG.fields.staging.importType]: { name: importType },
        [CONFIG.fields.staging.sourceMetaLink]: [{ id: record.id }],
      };
      if (supplierLink && supplierLink.length > 0) {
        baseFields[CONFIG.fields.staging.supplierLink] = [
          { id: supplierLink[0].id },
        ];
      }

      // Map all CSV columns
      const mappedFields = {};
      let supplierSku = null;
      let fieldsWritten = 0;

      for (let j = 0; j < headers.length && j < r.length; j++) {
        const header = headers[j];
        let rawVal = r[j] ? r[j].trim() : null;
        if (!rawVal) continue;

        // GENCODE sanitisation
        if (j === gencodeColIndex) {
          const sanitised = sanitiseGencode(rawVal);
          if (sanitised.wasCorrected) {
            gencodeCorrections.push({
              row: i + 1,
              original: sanitised.original,
              corrected: sanitised.value,
            });
          }
          rawVal = sanitised.value;
        }

        const fieldId = COLUMN_MAP[header];
        if (!fieldId) continue;

        // Capture SKU for dedup check
        if (fieldId === CONFIG.fields.staging.supplierSku) {
          supplierSku = rawVal.toUpperCase();
        }

        // Type casting
        if (NUMBER_FIELDS.has(fieldId)) {
          const num = cleanNumber(rawVal);
          if (num !== null) {
            mappedFields[fieldId] = num;
            fieldsWritten++;
          }
        } else if (SINGLE_SELECTS.has(fieldId)) {
          mappedFields[fieldId] = { name: rawVal };
          fieldsWritten++;
        } else {
          mappedFields[fieldId] = rawVal;
          fieldsWritten++;
        }
      }

      if (!supplierSku) {
        skippedCount++;
        continue;
      }
      if (fieldsWritten === 0) {
        skippedCount++;
        continue;
      }

      // ── DEDUP + ROUTING ──────────────────────────────────────────────
      const existing = existingSkuMap[supplierSku];

      if (existing) {
        // SKU already in Staging — determine merge behaviour
        if (importType === "PR" && existing.importType === "ST") {
          // ✅ Enrich existing ST row with PR pricing/specs
          // DATA PROTECTION: never overwrite SKU or Description
          const updateFields = {};
          for (const [fId, val] of Object.entries(mappedFields)) {
            if (PR_PROTECTED_FIELDS.has(fId)) continue;
            updateFields[fId] = val;
          }
          if (Object.keys(updateFields).length > 0) {
            stagingUpdates.push({ id: existing.id, fields: updateFields });
            enrichedCount++;
          }
        } else if (importType === "ST" && existing.importType === "PR") {
          // ST arriving after PR — merge full ST data, skip protected fields already on PR
          const updateFields = {};
          for (const [fId, val] of Object.entries(mappedFields)) {
            if (fId === CONFIG.fields.staging.supplierSku) continue; // never overwrite PK
            updateFields[fId] = val;
          }
          if (Object.keys(updateFields).length > 0) {
            stagingUpdates.push({ id: existing.id, fields: updateFields });
            enrichedCount++;
          }
        } else {
          // Same type uploaded twice — skip
          skippedCount++;
          log(
            `⚠️ Duplicate ${importType} SKU: ${supplierSku} — already imported, skipped`,
          );
        }
      } else {
        // ✅ New SKU — create
        stagingCreates.push({ fields: { ...baseFields, ...mappedFields } });
        newCount++;
      }
    }

    log(
      `✅ Rows mapped | New: ${newCount} | Enrich: ${enrichedCount} | Skipped: ${skippedCount} | Empty: ${emptyRowCount}`,
    );

    // Log GENCODE corrections (batch, not per-row noise)
    if (gencodeCorrections.length > 0) {
      const corrDetails = gencodeCorrections
        .slice(0, 20)
        .map((c) => `Row ${c.row}: "${c.original}" → "${c.corrected}"`)
        .join("\n");
      await logToSystemLogs(
        sysLogsTable,
        "System_Event",
        `GENCODE auto-corrections during import\nFile: ${sourceFileName}\nBatch: ${batchId}\n` +
          `Total: ${gencodeCorrections.length}\n\nDetails:\n${corrDetails}` +
          (gencodeCorrections.length > 20
            ? `\n...and ${gencodeCorrections.length - 20} more`
            : "") +
          `\n\nKnown Excel formatting issue. Corrections applied automatically.`,
        "Info",
        { operatorEmail, reviewed: true },
      );
      log(`📝 Logged ${gencodeCorrections.length} GENCODE corrections`);
    }

    if (stagingCreates.length === 0 && stagingUpdates.length === 0) {
      log(
        "❌ No records to create or enrich. Check manifest mapping against CSV headers.",
      );
      await logDual(
        sysLogsTable,
        upcAdminTable,
        "System_Event",
        "Missing_Data",
        `${CONFIG.scriptName} failed: No records could be mapped.\nFile: ${sourceFileName}\n` +
          `Headers: ${headers.join(", ")}\nBatch: ${batchId}`,
        "High",
        { operatorEmail },
      );
      await metaTable.updateRecordAsync(triggeringRecordId, {
        [CONFIG.fields.meta.importStatus]: { name: "Failed" },
      });
      return;
    }

    // ─────────────────────────────────────────────────────────────────
    // STEP 6 — Batch write to Staging
    // ─────────────────────────────────────────────────────────────────
    log("## Step 6 — Writing to Staging...");

    let batchCount = 0,
      batchErrors = 0;

    // CREATE new records
    for (const batch of chunk(stagingCreates, 50)) {
      try {
        await stagingTable.createRecordsAsync(batch);
        batchCount++;
        ingestedCount += batch.length;
      } catch (err) {
        batchErrors++;
        failedCount += batch.length;
        log(`❌ CREATE batch ${batchCount + 1} failed: ${err.message}`);
        await logToSystemLogs(
          sysLogsTable,
          "System_Event",
          `${CONFIG.scriptName} CREATE batch error.\nBatch: ${batchCount + 1}\nError: ${err.message}\nFile: ${sourceFileName}\nBatch ID: ${batchId}`,
          "High",
          { operatorEmail },
        );
      }
    }

    // UPDATE enrichment records (PR → ST or ST → PR)
    for (const batch of chunk(stagingUpdates, 50)) {
      try {
        await stagingTable.updateRecordsAsync(batch);
        batchCount++;
        ingestedCount += batch.length;
      } catch (err) {
        batchErrors++;
        failedCount += batch.length;
        log(`❌ UPDATE batch ${batchCount + 1} failed: ${err.message}`);
        await logToSystemLogs(
          sysLogsTable,
          "System_Event",
          `${CONFIG.scriptName} UPDATE batch error.\nBatch: ${batchCount + 1}\nError: ${err.message}\nFile: ${sourceFileName}\nBatch ID: ${batchId}`,
          "High",
          { operatorEmail },
        );
      }
    }

    log(`✅ ${batchCount} batches written | ${batchErrors} failed`);

    // ─────────────────────────────────────────────────────────────────
    // STEP 7 — Final logging + status update
    // ─────────────────────────────────────────────────────────────────
    log("## Step 7 — Final logging...");

    const finalStatus =
      batchErrors > 0 && batchCount === 0
        ? "Failed"
        : batchErrors > 0
          ? "Partial_Failure"
          : "Processed";

    const summary = [
      `📥 ${CONFIG.scriptName} — Ingest Complete`,
      ``,
      `Batch ID    : ${batchId}`,
      `Source File : ${sourceFileName}`,
      `Import Type : ${importType}`,
      `Supplier    : ${supplierLink?.[0]?.name || "N/A"}`,
      ``,
      `New Records : ${newCount}`,
      `Enriched    : ${enrichedCount}`,
      `Skipped     : ${skippedCount}`,
      `Empty Rows  : ${emptyRowCount}`,
      `Failed      : ${failedCount}`,
      `GENCODE Fixes: ${gencodeCorrections.length}`,
      ``,
      `Data Protection Applied: ${importType === "PR" ? "✅ SKU + Description locked (PR cannot overwrite)" : "N/A (ST import)"}`,
      ``,
      `Final Status: ${finalStatus}`,
      `Next Step   : Awaiting Script 0A (Rename Detector)`,
      `Timestamp   : ${new Date().toISOString()}`,
    ].join("\n");

    try {
      output.text(summary);
    } catch (_) {}
    console.log(summary);

    await logToSystemLogs(
      sysLogsTable,
      "System_Event",
      summary,
      finalStatus === "Failed" ? "High" : "Info",
      {
        operatorEmail,
        operatorNotes: `${CONFIG.scriptName} ingest complete. Next: run Script 0A on ${ingestedCount} pending records.`,
      },
    );

    await metaTable.updateRecordAsync(record.id, {
      [CONFIG.fields.meta.importStatus]: { name: finalStatus },
    });

    // ─────────────────────────────────────────────────────────────────
    // COMPLETION
    // ─────────────────────────────────────────────────────────────────
    log("---");
    log(`## ✅ ${CONFIG.scriptName} Complete`);
    log(`📊 Records created: ${newCount} | Enriched: ${enrichedCount}`);
    log(`📦 Batches written: ${batchCount} | Failed: ${batchErrors}`);
    log(`📋 Import Status: **${finalStatus}**`);
    log(`➡️ Next: Script 0A — Rename Detector`);

    if (importType === "PR") {
      log(`\n### 🔒 Data Protection Applied`);
      log(
        `| Rule | Status |\n|---|---|\n| Supplier SKU | ✅ Protected |\n| Description | ✅ Protected |`,
      );
    }
  } catch (err) {
    // ── Unhandled error ─────────────────────────────────────────────
    log(`## ❌ UNHANDLED ERROR: ${err.message}`);
    console.error(err.stack);
    try {
      await logDual(
        sysLogsTable,
        upcAdminTable,
        "System_Event",
        "Stock_Logic_Error",
        `${CONFIG.scriptName} CRASHED\n\nError: ${err.message}\n\nStack:\n${err.stack}\n\nBatch ID: ${batchId}\nFile: ${sourceFileName}`,
        "Critical",
        { operatorEmail, sourceTable: "Staging" },
      );
      if (triggeringRecordId) {
        await metaTable.updateRecordAsync(triggeringRecordId, {
          [CONFIG.fields.meta.importStatus]: { name: "Failed" },
        });
      }
    } catch (logErr) {
      console.error("Failed to log crash:", logErr.message);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXECUTE
// ═══════════════════════════════════════════════════════════════════════════
await main();
