// =============================================================
// ROGUE RECORD MIGRATOR (V6 - AUTOMATION BUTTON SAFE ✅)
// Trigger: When a Button is Clicked (Interface)
// Author: Omni Lead System
// =============================================================

// ─────────────────────────────────────────────
// 1. TABLE IDS
// ─────────────────────────────────────────────
const TABLES = {
    PRODUCT_MASTER: "tblgLqMMXX2HcKt9U",
    SUPPLIER_PROD:  "tbl7mZpHJCUs1r0cg",
    LEGACY_CODES:   "tbl8c8q0Bd33XCJCG",
    SYSTEM_LOGS:    "tblk1v5VHPEC2c2u2",
};

// ─────────────────────────────────────────────
// 2. SOURCE FIELD IDS
// ─────────────────────────────────────────────
const SRC_FLD = {
    PM_SKU:             "fldMfK3uyPnDbKONn",
    PM_DESC:            "fld7hdhxyu61r5Olm",
    PM_ARCHIVE_REASON:  "fldkIHrNRkEIsu1rr",   // ⚠️ Replace after schema creation
    SPD_SKU:            "fldK3FyPA98F3smc9",
    SPD_DESC:           "fldoROoSpEm5FuUnI",
    SPD_SUPPLIER:       "fldY9HQ6d42p8uVoY",
    SPD_ARCHIVE_REASON: "fldLyZWqCR50wUmv4",  // ⚠️ Replace after schema creation
};

// ─────────────────────────────────────────────
// 3. LEGACY FIELD IDS
// ─────────────────────────────────────────────
const LEG_FLD = {
    SKU:              "fldNnAnBbeXqNparf",
    DESC:             "fld5OyyRL839QrVLD",
    TYPE:             "fldYN3WKxQFrRfOtF",
    DATE:             "fldj4tGbObMFqeQCF",
    PRODUCT_STATUS:   "fldGtemdGjWoaNiOj",
    REASON:           "fldwxQevsg4gKlcvm",
    DATA_DUMP:        "fldmMsY9JCwgcUSIf",
    SUPPLIER_LINK:    "fldPxh7RCLRAKYd1A",
    NOTES:            "flddAfWERjABYu1Rf",
    SOURCE_RECORD_ID: "fldMpML3d8GyuPbMp",    // ⚠️ Replace after schema creation
};

// ─────────────────────────────────────────────
// 4. LOG FIELD IDS
// ─────────────────────────────────────────────
const LOG_FLD = {
    EVENT:    "flda8oHUThBc1Kb7I",
    NOTES:    "fld4l6AJhVNRzIaY8",
    STATUS:   "fldog9l4DwJeE5Qj8",
    SEVERITY: "fldPdoc6JPYHV9gpb",
};

// ─────────────────────────────────────────────
// 5. HELPERS
// ─────────────────────────────────────────────

function mapArchiveReason(reason) {
    const map = {
        "Discontinued":           "Discontinued",
        "Duplicate Code Internal": "Duplicate Code Internal",
        "Data Error":             "Data Error",
        "SKU Transition":         "SKU Transition",
    };
    return map[reason] || "Data Error";
}

function mapProductStatus(reason) {
    if (reason === "SKU Transition") return "SKU_Transition";
    return "DISCONTINUED";
}

/**
 * Builds a composite identifier from any non-empty string fields.
 * Falls back gracefully if SKU/DESC are both missing.
 * Always includes the native Airtable record ID as the anchor.
 */
function buildCompositeLabel(recordId, fields, record) {
    const parts = [];

    // Native record ID is always the forensic anchor — never missing
    parts.push(`RecID:${recordId}`);

    // Collect any non-empty string values from ALL fields
    for (let field of fields) {
        // Skip linked records, attachments, checkboxes — only readable text values
        const val = record.getCellValueAsString(field.id);
        if (val && val.trim() !== "") {
            // Truncate long values to keep the label readable
            const truncated = val.length > 40 ? val.substring(0, 40) + "…" : val;
            parts.push(`${field.name}:${truncated}`);
            // Stop collecting after 4 additional fields to keep label manageable
            if (parts.length >= 5) break;
        }
    }

    return parts.join(" | ");
}

/**
 * Builds a COMPLETE forensic data dump of ALL fields,
 * including empty ones (marked as [EMPTY]).
 * This is the "nuke everything — lose nothing" snapshot.
 */
function buildFullDataDump(sourceTableName, recordId, fields, record) {
    const timestamp = new Date().toISOString();
    let dump = `## ARCHIVE SNAPSHOT\n`;
    dump += `**Source Table**: ${sourceTableName}\n`;
    dump += `**Source Record ID**: ${recordId}\n`;
    dump += `**Archived At**: ${timestamp}\n\n`;
    dump += `---\n\n`;
    dump += `### Field Values at Time of Archive\n\n`;

    for (let field of fields) {
        const val = record.getCellValueAsString(field.id);
        // Every field is recorded — empty fields get an explicit [EMPTY] marker
        const displayVal = (val && val.trim() !== "") ? val : "[EMPTY]";
        dump += `**${field.name}** *(${field.type})*: ${displayVal}\n`;
    }

    return dump;
}

// =============================================================
// MAIN EXECUTION
// =============================================================

// ─────────────────────────────────────────────
// STEP 1: Get input variables from button trigger
// ─────────────────────────────────────────────
// These are configured in the Interface button's
// "Input variables" section when setting up the automation.
let inputConfig = input.config();
let recordId         = inputConfig.recordId;         // Pass as: Record ID field
let sourceTableName  = inputConfig.sourceTableName;  // Pass as: Static text (exact table name)

// ─────────────────────────────────────────────
// STEP 2: Validate record ID was received
// ─────────────────────────────────────────────
// NOTE: The logic was previously inverted (if recordId → error).
// Corrected: if NO recordId, throw and abort.
if (!recordId) {
    console.error("[MIGRATOR] No record ID received from button trigger. Aborting.");
    throw new Error("No record selected — recordId is missing from input.config()");
}

// ─────────────────────────────────────────────
// STEP 3: Resolve source table
// ─────────────────────────────────────────────
const productMasterTable = base.getTable(TABLES.PRODUCT_MASTER);
const supplierProdTable  = base.getTable(TABLES.SUPPLIER_PROD);
const legacyTable        = base.getTable(TABLES.LEGACY_CODES);
const logsTable          = base.getTable(TABLES.SYSTEM_LOGS);

// Match by name (passed from button config as static text)
// Fallback: if name doesn't match either, abort — never guess which table to nuke from
let sourceTable;
if (sourceTableName === productMasterTable.name) {
    sourceTable = productMasterTable;
} else if (sourceTableName === supplierProdTable.name) {
    sourceTable = supplierProdTable;
} else {
    console.error(`[MIGRATOR] Unknown source table: "${sourceTableName}". Aborting.`);
    throw new Error(`Source table "${sourceTableName}" does not match any known table.`);
}

const isProdMaster  = sourceTable.id === TABLES.PRODUCT_MASTER;
const isSupplierData = sourceTable.id === TABLES.SUPPLIER_PROD;

// ─────────────────────────────────────────────
// STEP 4: Fetch the full record from source table
// ─────────────────────────────────────────────
// selectRecordAsync loads all field values by default
let record = await sourceTable.selectRecordAsync(recordId);

if (!record) {
    console.error(`[MIGRATOR] Record ${recordId} not found in ${sourceTable.name}. May have already been deleted.`);
    throw new Error(`Record ${recordId} not found in ${sourceTable.name}.`);
}

// ─────────────────────────────────────────────
// STEP 5: Read archive reason from the record's staging field
// The user sets this select field on the review page
// BEFORE clicking the Archive button.
// ─────────────────────────────────────────────
const archiveReasonRaw = record.getCellValueAsString(
    isProdMaster ? SRC_FLD.PM_ARCHIVE_REASON : SRC_FLD.SPD_ARCHIVE_REASON
);

// Guard: if no reason is staged, abort — do not silently default to "Data Error"
// when we're about to permanently delete a record.
if (!archiveReasonRaw || archiveReasonRaw.trim() === "") {
    console.error(`[MIGRATOR] Archive Reason field is empty on record ${recordId}. User must select a reason before archiving.`);
    throw new Error(
        "Archive Reason is not set on this record. " +
        "Please select a reason in the 'Archive Reason' field before clicking Archive."
    );
}

const archiveReason = mapArchiveReason(archiveReasonRaw);

// ─────────────────────────────────────────────
// STEP 6: Build identifiers
// ─────────────────────────────────────────────
// Null-safe: SKU and DESC may be empty — composite label never fails
const skuValue  = record.getCellValueAsString(isProdMaster ? SRC_FLD.PM_SKU  : SRC_FLD.SPD_SKU)  || "";
const descValue = record.getCellValueAsString(isProdMaster ? SRC_FLD.PM_DESC : SRC_FLD.SPD_DESC) || "";
const codeType  = isProdMaster ? "Utile" : "Supplier";

// Composite label: uses ALL fields, anchored by native record ID
const compositeLabel = buildCompositeLabel(recordId, sourceTable.fields, record);

// ─────────────────────────────────────────────
// STEP 7: Build COMPLETE forensic data dump
// Every field, including empty ones, is captured.
// "Nuke everything — lose nothing."
// ─────────────────────────────────────────────
const fullDataDump = buildFullDataDump(sourceTable.name, recordId, sourceTable.fields, record);

// ─────────────────────────────────────────────
// STEP 8: Build legacy record payload
// ─────────────────────────────────────────────
let legacyPayload = {
    [LEG_FLD.SKU]:              skuValue   || `[NO SKU — ${recordId}]`,
    [LEG_FLD.DESC]:             descValue  || `[NO DESC — ${recordId}]`,
    [LEG_FLD.TYPE]:             { name: codeType },
    [LEG_FLD.DATE]:             new Date().toISOString().split("T")[0],
    [LEG_FLD.REASON]:           { name: archiveReason },
    [LEG_FLD.PRODUCT_STATUS]:   { name: mapProductStatus(archiveReasonRaw) },
    [LEG_FLD.DATA_DUMP]:        fullDataDump,
    [LEG_FLD.SOURCE_RECORD_ID]: recordId,  // Forensic anchor — always available
    [LEG_FLD.NOTES]:            `Archived from ${sourceTable.name} | ${compositeLabel}`,
};

// ─────────────────────────────────────────────
// STEP 9: Supplier link (only for Supplier Product Data records)
// ─────────────────────────────────────────────
if (isSupplierData) {
    const supplierLink = record.getCellValue(SRC_FLD.SPD_SUPPLIER);
    if (supplierLink && supplierLink.length > 0) {
        legacyPayload[LEG_FLD.SUPPLIER_LINK] = supplierLink.map((l) => ({ id: l.id }));
    }
}

// ─────────────────────────────────────────────
// STEP 10: Execute — SEQUENTIAL for safety
//
// Order matters:
//   1. CREATE legacy record first    → if this fails, source is NEVER deleted
//   2. DELETE source record          → only runs if step 1 succeeded
//   3. CREATE log entry (best-effort)→ failure here does NOT roll back steps 1 & 2
//
// This prevents a scenario where the log throws and the source
// record is left alive after being archived.
// ─────────────────────────────────────────────
let legacyRecordId;

try {
    // ── 10a. Archive to Legacy Codes ──────────────────
    legacyRecordId = await legacyTable.createRecordAsync(legacyPayload);
    console.log(`[MIGRATOR] ✅ Legacy record created: ${legacyRecordId}`);

} catch (createError) {
    // Legacy creation failed — source record is UNTOUCHED. Safe to retry.
    console.error(`[MIGRATOR] ❌ Failed to create legacy record. Source record preserved. Error: ${createError.message}`);
    throw new Error(`Archive failed at CREATION step: ${createError.message}`);
}

try {
    // ── 10b. Delete the source record (THE NUKE) ──────
    await sourceTable.deleteRecordAsync(recordId);
    console.log(`[MIGRATOR] 🔥 Source record ${recordId} deleted from ${sourceTable.name}.`);

} catch (deleteError) {
    // Deletion failed — legacy record exists but source wasn't deleted.
    // Log a warning. Operator should manually reconcile.
    console.error(`[MIGRATOR] ⚠️ Legacy record was created (${legacyRecordId}) but source deletion FAILED. Manual cleanup needed. Error: ${deleteError.message}`);
    // Still log this event so Steph can see it in System Logs
    await logsTable.createRecordAsync({
        [LOG_FLD.EVENT]:    { name: "System_Event" },
        [LOG_FLD.STATUS]:   { name: "Logged" },
        [LOG_FLD.SEVERITY]: { name: "High" },
        [LOG_FLD.NOTES]:    `⚠️ PARTIAL ARCHIVE: Legacy created (${legacyRecordId}) but source record ${recordId} was NOT deleted from ${sourceTable.name}. Error: ${deleteError.message}`,
    }).catch(logErr => console.error(`[MIGRATOR] Could not write partial-failure log: ${logErr.message}`));
    throw new Error(`Archive partially completed — deletion failed: ${deleteError.message}`);
}

try {
    // ── 10c. Write success log entry ──────────────────
    await logsTable.createRecordAsync({
        [LOG_FLD.EVENT]:    { name: "System_Event" },
        [LOG_FLD.STATUS]:   { name: "Logged" },
        [LOG_FLD.SEVERITY]: { name: "Info" },
        [LOG_FLD.NOTES]:    `✅ ARCHIVED: ${compositeLabel} | Reason: ${archiveReason} | Legacy ID: ${legacyRecordId}`,
    });
    console.log(`[MIGRATOR] 📋 Log entry created.`);

} catch (logError) {
    // Log failure is non-fatal — archive and delete already succeeded
    console.error(`[MIGRATOR] ⚠️ Archive succeeded but log entry failed: ${logError.message}`);
}

// ─────────────────────────────────────────────
// STEP 11: Pass result to subsequent automation actions (if any)
// ─────────────────────────────────────────────
output.set("status",          "success");
output.set("archivedLabel",   compositeLabel);
output.set("legacyRecordId",  legacyRecordId);
output.set("archiveReason",   archiveReason);