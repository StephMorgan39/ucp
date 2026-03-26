/**
 * SCRIPT 0 — CSV STAGING LOADER v2.4 (Template Edition)
 * ═══════════════════════════════════════════════════════════════════════════
 * Changes from v2.3:
 *   - Fixed undefined variables (batchId, sourceFileName, counts)
 *   - Fixed logEvent helper (removed incorrect fields wrapper)
 *   - Added logToAdmin helper for UPCAdmin logging
 *   - Relocated GENCODE coercion logging into parsing loop
 *   - Added dual logging to SystemLogs + UPCAdmin
 *   - Added linkage between SystemLogs and UPCAdmin for traceability
 *   - Standardised error handling pattern for reuse across scripts
 * 
 * TEMPLATE USAGE:
 *   Copy this script and modify STEP 2-5 for each ETL stage.
 *   Keep the logging helpers and error handling pattern consistent.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION — Update table IDs here if base structure changes
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
    tables: {
        sourceMetadata: "tblz0ZlAJByjkqPbH",   // SourceMetadata
        staging: "tblcPSP5NcP0ioUP8",           // Staging
        manifest: "tblwPVgm3fLS1WjMo",         // ManifestSourceConfig
        systemLogs: "tblk1v5VHPEC2c2u2",         // SystemLogs
        upcAdmin: "tbl56i9Rlm2mK6t1w",          // UPCAdmin
    },
    fields: {
        // SourceMetadata fields
        meta: {
            attachment: "fld9ROntbwWHYGBt9",       // Supplier Source Upload
            helperTag: "fldznkw7kfCI8sXjn",        // Helper Tag Stock Status
            supplier: "fldxFveyMk1iCU7xC",         // Suppliers
            importStatus: "fldtTTRihPTXisag8",     // Import Status
        },
        // Staging fields
        staging: {
            etlStatus: "fldbrUDvLv8OEnEqh",        // ETL Staging Import Status
            importType: "fldjdRY1TAJypmcPF",       // SPD Import class Type
            sourceMetaLink: "fldbffhLGECRlzSt2",   // Source Metadata ID
            supplierLink: "fldhYMKeVijNr36Fs",     // Supplier
            supplierSku: "fldeEd9FiNq5AtGNk",      // Supplier SKU
            systemLogsLink: "fldLRRurxuTiCI9wV",   // SYSTEMLOGS LINK
            upcAdminLink: "fldRihOoeHZFzv7jP",     // UPCAdmin link
        },
        // SystemLogs fields
        sysLog: {
            notes: "fld4l6AJhVNRzIaY8",              // Notes
            systemEvent: "flda8oHUThBc1Kb7I",        // System Event
            severity: "fldPdoc6JPYHV9gpb",           // Severity
            systemLog: "fldog9l4DwJeE5Qj8",         // System Log status
            operatorEmail: "fldyYs6l736JsE2iJ",    // Operator Email
            operatorNotes: "fldXtmbbu2ApOWYe4",    // Operator Notes
            stagingLink: "fldjHeNOkAl5rXSQd",      // Staging link
            upcAdminLink: "fldWXFUMjSnBFAGvd",     // UPCAdmin link
            reviewed: "fldJ1v4BeTILLN37J",         // Reviewed checkbox
            skuExtractor: "fldPFqSMXvq05N6PR",       // SKU Extractor (AI field - read only)
        },
        // UPCAdmin fields
        admin: {
            errorType: "fldjYiDzJmdYJp6uF",         // Error Type
            severity: "fld3TPgysD2hLbtvR",          // Flag Severity
            detectedBy: "fldbPrkOy6XavA4ef",        // Detected By
            resolutionStatus: "fld4li4vcLn43h2N4",  // Resolution Status
            notes: "fldB7o9RtnQPi4goY",             // Notes
            dateDetected: "fldE7JCdKubLvxysd",      // Date Detected
            stagingLink: "fldz5hJMgnsZu0T07",       // Staging link
            sourceTable: "fldHEz5b8phNb85jT",       // Source Table
            systemLogLink: "fldGpOua9oNrOPesT",    // SystemLog Links
        },
        // Manifest fields
        manifest: {
            incomingColName: "fldHCtuNeJJCEHiO7",  // Incoming Column Name
            canonicalRegistry: "fldRcrppQB3MG5YuV", // Canonical Registry
        },
    },
    scriptName: "Script 0",
    scriptVersion: "2.4",
};

// ─────────────────────────────────────────────────────────────────────────────
// LOG HELPER — Works in both script UI and automation mode
// ─────────────────────────────────────────────────────────────────────────────
const log = (msg) => {
    try {
        output.markdown(msg);
    } catch (_) {}
    console.log(
        String(msg).replace(/\*\*/g, "").replace(/`/g, "").replace(/#+\s/g, "")
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGGING HELPERS — Dual logging to SystemLogs and UPCAdmin
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Writes an event to SystemLogs table
 * @param {Table} logTable - The SystemLogs table object
 * @param {string} eventType - System Event type (e.g., "System_Event", "Price_Update")
 * @param {string} notes - Detailed log message
 * @param {string} severity - "Info" | "Low" | "Medium" | "High" | "Critical"
 * @param {Object} options - Optional: { stagingRecordId, operatorEmail, operatorNotes, reviewed, upcAdminRecordId }
 * @returns {string|null} - Created record ID or null on failure
 */
async function logToSystemLogs(logTable, eventType, notes, severity, options = {}) {
    const F = CONFIG.fields.sysLog;
    try {
        const fields = {};
        fields[F.notes] = String(notes).substring(0, 5000);
        fields[F.systemEvent] = { name: eventType };
        fields[F.severity] = { name: severity };
        fields[F.systemLog] = { name: "Logged" };

        if (options.stagingRecordId) {
            fields[F.stagingLink] = [{ id: options.stagingRecordId }];
        }
        if (options.operatorEmail) {
            fields[F.operatorEmail] = options.operatorEmail;
        }
        if (options.operatorNotes) {
            fields[F.operatorNotes] = options.operatorNotes;
        }
        if (options.reviewed === true) {
            fields[F.reviewed] = true;
        }
        if (options.upcAdminRecordId) {
            fields[F.upcAdminLink] = [{ id: options.upcAdminRecordId }];
        }

        const recordId = await logTable.createRecordAsync(fields);
        return recordId;
    } catch (err) {
        console.error("logToSystemLogs failed:", err.message);
        return null;
    }
}
/**
 * Writes an anomaly/error to UPCAdmin table
 * @param {Table} adminTable - The UPCAdmin table object
 * @param {string} errorType - Error Type (e.g., "Missing_Data", "SKU_Format_Invalid")
 * @param {string} notes - Detailed description of the issue
 * @param {string} severity - "Info" | "Low" | "Medium" | "High" | "Critical"
 * @param {Object} options - Optional: { stagingRecordId, sourceTable, systemLogRecordId }
 * @returns {string|null} - Created record ID or null on failure
 */
async function logToUPCAdmin(adminTable, errorType, notes, severity, options = {}) {
    const F = CONFIG.fields.admin;
    try {
        const fields = {};
        fields[F.notes] = String(notes).substring(0, 5000);
        fields[F.errorType] = { name: errorType };
        fields[F.severity] = { name: severity };
        fields[F.detectedBy] = { name: "ETL_Script" };
        fields[F.resolutionStatus] = { name: "Unresolved" };
        fields[F.dateDetected] = new Date().toISOString().split("T")[0];

        // Optional fields
        if (options.stagingRecordId) {
            fields[F.stagingLink] = [{ id: options.stagingRecordId }];
        }
        if (options.sourceTable) {
            fields[F.sourceTable] = { name: options.sourceTable };
        }
        if (options.systemLogRecordId) {
            fields[F.systemLogLink] = [{ id: options.systemLogRecordId }];
        }

        const recordId = await adminTable.createRecordAsync(fields);
        return recordId;
    } catch (err) {
        console.error("logToUPCAdmin failed:", err.message);
        return null;
    }
}

/**
 * Dual log — writes to both SystemLogs and UPCAdmin with cross-linking
 * Use for issues that need operator attention (not just audit trail)
 * @param {Table} sysLogTable - SystemLogs table object
 * @param {Table} adminTable - UPCAdmin table object
 * @param {string} eventType - System Event type for SystemLogs
 * @param {string} errorType - Error Type for UPCAdmin
 * @param {string} notes - Shared log message
 * @param {string} severity - Severity level
 * @param {Object} options - Optional: { stagingRecordId, operatorEmail, sourceTable }
 */
async function logDual(sysLogTable, adminTable, eventType, errorType, notes, severity, options = {}) {
    // First, create UPCAdmin record
    const adminRecordId = await logToUPCAdmin(adminTable, errorType, notes, severity, {
        stagingRecordId: options.stagingRecordId,
        sourceTable: options.sourceTable || "Staging",
    });

    // Then create SystemLogs record, linked to UPCAdmin
    const sysLogRecordId = await logToSystemLogs(sysLogTable, eventType, notes, severity, {
        stagingRecordId: options.stagingRecordId,
        operatorEmail: options.operatorEmail,
        upcAdminRecordId: adminRecordId,
    });

    // Update UPCAdmin with SystemLog link (bidirectional)
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

/**
 * Generates a unique batch ID for this run
 */
function generateBatchId() {
    return new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
}

/**
 * Chunks an array into batches of size n (Airtable limit: 50)
 */
function chunk(arr, n = 50) {
    const out = [];
    for (let i = 0; i < arr.length; i += n) {
        out.push(arr.slice(i, i + n));
    }
    return out;
}

/**
 * Cleans and parses European number format: "1.234,56" → 1234.56
 */
function cleanNumber(v) {
    if (v === null || v === undefined || v === "") return null;
    let s = String(v)
        .replace(/\s/g, "")       // remove spaces
        .replace(/\./g, "")       // strip European thousands dot
        .replace(",", ".")        // convert European decimal comma
        .replace(/[^0-9.-]/g, ""); // remove non-numeric chars
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
}

/**
 * Gets current user email safely (works in automation + UI)
 */
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
    "3": "0003",      // Excel stripped leading zeros
    "2001-1": "0001-1", // Excel date-coerced: year 2001, month 1
};

/**
 * Sanitises GENCODE values corrupted by Excel auto-formatting
 * @param {string} raw - Raw value from CSV
 * @returns {{ value: string|null, wasCorrected: boolean, original: string|null }}
 */
function sanitiseGencode(raw) {
    if (!raw) return { value: null, wasCorrected: false, original: null };
    const s = raw.toString().trim();

    // Check known coercion cases first
    if (GENCODE_COERCION_WATCH[s]) {
        return {
            value: GENCODE_COERCION_WATCH[s],
            wasCorrected: true,
            original: s,
        };
    }

    // General rule: pure 1-4 digit number → pad to 4 digits
    if (/^\d{1,4}$/.test(s)) {
        const padded = s.padStart(4, "0");
        return {
            value: padded,
            wasCorrected: padded !== s,
            original: padded !== s ? s : null,
        };
    }

    // General rule: 2XXX-N date coercion pattern → 0XXX-N
    const dateCoerce = s.match(/^2(\d{3})-(\d{1,2})$/);
    if (dateCoerce) {
        const corrected = `0${dateCoerce[1]}-${dateCoerce[2]}`;
        return {
            value: corrected,
            wasCorrected: true,
            original: s,
        };
    }

    return { value: s, wasCorrected: false, original: null };
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════
async function main() {
    log(`# ${CONFIG.scriptName} — CSV Staging Loader v${CONFIG.scriptVersion}`);

    // ─────────────────────────────────────────────────────────────────────────
    // TABLE REFERENCES
    // ─────────────────────────────────────────────────────────────────────────
    const metaTable = base.getTable(CONFIG.tables.sourceMetadata);
    const stagingTable = base.getTable(CONFIG.tables.staging);
    const manifestTable = base.getTable(CONFIG.tables.manifest);
    const systemLogsTable = base.getTable(CONFIG.tables.systemLogs);
    const upcAdminTable = base.getTable(CONFIG.tables.upcAdmin);

    // ─────────────────────────────────────────────────────────────────────────
    // TRACKING VARIABLES — Initialise all counters and metadata
    // ─────────────────────────────────────────────────────────────────────────
    const batchId = generateBatchId();
    let sourceFileName = "Unknown";
    let triggeringRecordId = null;
    let ingestedCount = 0;
    let newCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    let emptyRowCount = 0;
    let gencodeCorrections = [];
    const operatorEmail = getCurrentUserEmail();

    try {
        // ─────────────────────────────────────────────────────────────────────
        // STEP 0 — Automation-safe trigger detection
        // ─────────────────────────────────────────────────────────────────────
        log("## Step 0 — Detecting triggering record...");

        const config = input.config();
        triggeringRecordId = config.recordId;

        if (!triggeringRecordId) {
            log("❌ No record ID received. Script must be triggered via automation.");
            return;
        }

        // Set Processing immediately — visible in SourceMetadata view
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
            log(`❌ Record ID ${triggeringRecordId} not found in SourceMetadata.`);
            return;
        }

        log(`✅ Detected record: ${record.id}`);
        log(`✅ Batch ID: ${batchId}`);

        // ─────────────────────────────────────────────────────────────────────
        // STEP 1 — Extract metadata
        // ─────────────────────────────────────────────────────────────────────
        log("## Step 1 — Extracting metadata...");

        const attachments = record.getCellValue(CONFIG.fields.meta.attachment);
        if (!attachments || attachments.length === 0) {
            log("❌ No CSV attachment found on this record.");
            await logDual(
                systemLogsTable,
                upcAdminTable,
                "System_Event",
                "Missing_Data",
                `${CONFIG.scriptName} failed: No CSV attachment found.\nRecord ID: ${triggeringRecordId}\nBatch ID: ${batchId}`,
                "High",
                { operatorEmail }
            );
            await metaTable.updateRecordAsync(triggeringRecordId, {
                [CONFIG.fields.meta.importStatus]: { name: "Failed" },
            });
            return;
        }

        sourceFileName = attachments[0].filename;
        const helperTag = record.getCellValueAsString(CONFIG.fields.meta.helperTag) || "ST";
        const importType = helperTag.split(" ")[0].trim().toUpperCase();
        const supplierLink = record.getCellValue(CONFIG.fields.meta.supplier);

        log(`📁 File: ${sourceFileName}`);
        log(`📦 Import Type: ${importType}`);
        log(`🏭 Supplier: ${supplierLink?.[0]?.name || "N/A"}`);

        // ─────────────────────────────────────────────────────────────────────
        // STEP 2 — Load Manifest Mapping
        // ─────────────────────────────────────────────────────────────────────
        log("## Step 2 — Loading manifest mapping...");

        // Canonical ID → Staging field ID lookup
        const CANONICAL_TO_STAGING = {
            424: "fldeEd9FiNq5AtGNk",  // Supplier SKU
            356: "fldkAm1iLOJJYmzmi",  // Supplier Product Description
            292: "fldvZjLna62iMbj5K",  // Dimensions MM
            422: "fldbgiMR2Qlm169Mu",  // Thickness (Raw)
            362: "fldIEO5cTzgLSSOC0",  // Body Type Class
            427: "fldslE6XEO2Lqi4Qd",  // Stock Reserved
            483: "fld4QhEwwFSgFsHRB",  // Body Finish
            299: "fldkh9EFaIKvc0yIj",  // No Faces
            300: "fldqFzEPIby2C94Du",  // PEI Class
            304: "fldfMSgqnPwP2hvtl",  // Tech Slip Rating
            306: "fldiTSUcLPa4uLT4L",  // Pce Box
            307: "fldvVC9z72GqYdDko",  // Sqm Box
            479: "fldS2mZdWoY7hPU3G",  // Kg Box
            480: "fld8Qz10GgXiS6Da5",  // Box Pallet
            481: "fldf5VU6KDd2cSqUB",  // Sqm Pallet
            390: "fldOfxvmWk1K1J0TQ",  // Kg Pallet
            371: "fldhNujCBWdylBEzS",  // Stock On Hand
            375: "fldqPizK5v1z69O7L",  // Stock Available
            376: "fldMP2ywTGMepEX9K",  // Retail Incl
        };

        const manifestQuery = await manifestTable.selectRecordsAsync({
            fields: [
                CONFIG.fields.manifest.incomingColName,
                CONFIG.fields.manifest.canonicalRegistry,
            ],
        });

        const COLUMN_MAP = {};
        for (const r of manifestQuery.records) {
            const colName = r
                .getCellValueAsString(CONFIG.fields.manifest.incomingColName)
                .trim()
                .toUpperCase();
            const canLink = r.getCellValue(CONFIG.fields.manifest.canonicalRegistry);
            if (colName && canLink && canLink.length > 0) {
                const canId = canLink[0].name;
                const stagingField = CANONICAL_TO_STAGING[canId];
                if (stagingField) COLUMN_MAP[colName] = stagingField;
            }
        }

        const mappedCount = Object.keys(COLUMN_MAP).length;
        if (mappedCount === 0) {
            log("⚠️ WARNING: No manifest mappings found. Staging rows will have minimal fields.");
            await logToSystemLogs(
                systemLogsTable,
                "System_Event",
                `${CONFIG.scriptName} warning: No manifest mappings found.\nFile: ${sourceFileName}\nBatch ID: ${batchId}`,
                "Medium",
                { operatorEmail }
            );
        }
        log(`✅ Manifest loaded: ${mappedCount} field mappings`);

        // ─────────────────────────────────────────────────────────────────────
        // STEP 3 — Download and parse CSV
        // ─────────────────────────────────────────────────────────────────────
        log("## Step 3 — Downloading and parsing CSV...");

        let csvText;
        try {
            const response = await fetch(attachments[0].url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            csvText = await response.text();
        } catch (err) {
            log(`❌ Failed to download CSV: ${err.message}`);
            await logDual(
                systemLogsTable,
                upcAdminTable,
                "System_Event",
                "Missing_Data",
                `${CONFIG.scriptName} failed: CSV download error.\nFile: ${sourceFileName}\nError: ${err.message}\nBatch ID: ${batchId}`,
                "High",
                { operatorEmail }
            );
            await metaTable.updateRecordAsync(triggeringRecordId, {
                [CONFIG.fields.meta.importStatus]: { name: "Failed" },
            });
            return;
        }

        // Auto-detect delimiter (semicolon for Decobella, comma for others)
        const firstLine = csvText.split("\n")[0];
        const delimiter = firstLine.includes(";") ? ";" : ",";
        log(`🔍 Delimiter detected: ${delimiter === ";" ? "semicolon (;)" : "comma (,)"}`);

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
        // Flush last row
        if (val || row.length > 0) {
            row.push(val);
            if (row.some((cell) => cell.trim() !== "")) rows.push(row);
        }

        if (rows.length < 2) {
            log("❌ CSV parsing failed — no data rows found.");
            await logDual(
                systemLogsTable,
                upcAdminTable,
                "System_Event",
                "Invalid_Format",
                `${CONFIG.scriptName} failed: CSV has no data rows.\nFile: ${sourceFileName}\nBatch ID: ${batchId}`,
                "High",
                { operatorEmail }
            );
            await metaTable.updateRecordAsync(triggeringRecordId, {
                [CONFIG.fields.meta.importStatus]: { name: "Failed" },
            });
            return;
        }

        const headers = rows[0].map((h) => h.trim().toUpperCase());
        log(`✅ CSV parsed: ${rows.length - 1} data rows, ${headers.length} columns`);
        log(`📋 Headers: ${headers.join(" | ")}`);

        // ─────────────────────────────────────────────────────────────────────
        // STEP 4 — Type casting configuration
        // ─────────────────────────────────────────────────────────────────────
        const SINGLE_SELECTS = ["fldIEO5cTzgLSSOC0", "fld4QhEwwFSgFsHRB", "fldqFzEPIby2C94Du", "fldfMSgqnPwP2hvtl", "fldjdRY1TAJypmcPF"];
        const NUMBER_FIELDS = [
            "fldiTSUcLPa4uLT4L", "fldvVC9z72GqYdDko", "fldS2mZdWoY7hPU3G", "fld8Qz10GgXiS6Da5", "fldf5VU6KDd2cSqUB",
            "fldOfxvmWk1K1J0TQ", "fldhNujCBWdylBEzS", "fldqPizK5v1z69O7L", "fldMP2ywTGMepEX9K", "fldkh9EFaIKvc0yIj", "fldslE6XEO2Lqi4Qd",
        ];

        // Find GENCODE column index if present
        const gencodeColIndex = headers.findIndex(
            (h) => h === "GENCODE" || h === "GEN CODE" || h === "GEN_CODE"
        );

        // ─────────────────────────────────────────────────────────────────────
        // STEP 5 — Build Staging records
        // ─────────────────────────────────────────────────────────────────────
        log("## Step 4 — Building Staging records...");

        const stagingCreates = [];

        for (let i = 1; i < rows.length; i++) {
            const r = rows[i];
            if (!r || r.length < 1 || r.every((cell) => !cell || !cell.trim())) {
                emptyRowCount++;
                continue;
            }

            const fields = {
                [CONFIG.fields.staging.etlStatus]: { name: "pending" },
                [CONFIG.fields.staging.importType]: { name: importType },
                [CONFIG.fields.staging.sourceMetaLink]: [{ id: record.id }],
            };

            if (supplierLink && supplierLink.length > 0) {
                fields[CONFIG.fields.staging.supplierLink] = [{ id: supplierLink[0].id }];
            }

            let fieldsWritten = 0;

            for (let j = 0; j < headers.length && j < r.length; j++) {
                const header = headers[j];
                let rawVal = r[j] ? r[j].trim() : null;
                if (!rawVal) continue;

                // GENCODE sanitisation with logging
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

                if (NUMBER_FIELDS.includes(fieldId)) {
                    const num = cleanNumber(rawVal);
                    if (num !== null) {
                        fields[fieldId] = num;
                        fieldsWritten++;
                    }
                } else if (SINGLE_SELECTS.includes(fieldId)) {
                    fields[fieldId] = { name: rawVal };
                    fieldsWritten++;
                } else {
                    fields[fieldId] = rawVal;
                    fieldsWritten++;
                }
            }

            if (fieldsWritten > 0) {
                stagingCreates.push({ fields });
            } else {
                skippedCount++;
            }
        }

        newCount = stagingCreates.length;
        log(`✅ ${newCount} records ready | ${skippedCount} skipped (no mapped fields) | ${emptyRowCount} empty rows`);

        // Log GENCODE corrections if any occurred
        if (gencodeCorrections.length > 0) {
            const correctionDetails = gencodeCorrections
                .slice(0, 20) // Limit to first 20 to avoid huge logs
                .map((c) => `Row ${c.row}: "${c.original}" → "${c.corrected}"`)
                .join("\n");

            const correctionNote =
                `⚠️ GENCODE auto-corrections applied during import\n\n` +
                `File: ${sourceFileName}\n` +
                `Batch ID: ${batchId}\n` +
                `Total corrections: ${gencodeCorrections.length}\n\n` +
                `Details:\n${correctionDetails}` +
                (gencodeCorrections.length > 20 ? `\n... and ${gencodeCorrections.length - 20} more` : "") +
                `\n\nThis is a known Excel formatting issue. Corrections applied automatically.`;

            await logToSystemLogs(
                systemLogsTable,
                "System_Event",
                correctionNote,
                "Info",
                { operatorEmail, reviewed: true }
            );
            log(`📝 Logged ${gencodeCorrections.length} GENCODE corrections`);
        }

        if (stagingCreates.length === 0) {
            log("❌ No records to create. Check manifest mapping against CSV headers.");
            await logDual(
                systemLogsTable,
                upcAdminTable,
                "System_Event",
                "Missing_Data",
                `${CONFIG.scriptName} failed: No records could be mapped.\nFile: ${sourceFileName}\nHeaders: ${headers.join(", ")}\nBatch ID: ${batchId}`,
                "High",
                { operatorEmail }
            );
            await metaTable.updateRecordAsync(triggeringRecordId, {
                [CONFIG.fields.meta.importStatus]: { name: "Failed" },
            });
            return;
        }

        // ─────────────────────────────────────────────────────────────────────
        // STEP 6 — Batch write to Staging
        // ─────────────────────────────────────────────────────────────────────
        log("## Step 5 — Writing to Staging...");

        let batchCount = 0,
            batchErrors = 0;

        for (const batch of chunk(stagingCreates, 50)) {
            try {
                await stagingTable.createRecordsAsync(batch);
                batchCount++;
                ingestedCount += batch.length;
            } catch (err) {
                batchErrors++;
                failedCount += batch.length;
                log(`❌ Batch ${batchCount + 1} failed: ${err.message}`);
                await logToSystemLogs(
                    systemLogsTable,
                    "System_Event",
                    `${CONFIG.scriptName} batch write error.\nBatch: ${batchCount + 1}\nError: ${err.message}\nFile: ${sourceFileName}\nBatch ID: ${batchId}`,
                    "High",
                    { operatorEmail }
                );
            }
        }

        log(`✅ ${batchCount} batches written, ${batchErrors} failed`);

        // ─────────────────────────────────────────────────────────────────────
        // STEP 7 — Final logging and status update
        // ─────────────────────────────────────────────────────────────────────
        log("## Step 6 — Final logging...");

        const finalStatus =
            batchErrors > 0 && batchCount === 0
                ? "Failed"
                : batchErrors > 0
                    ? "Partial_Failure"
                    : "Processed";

        // Build summary
        const summary = [
            `📥 ${CONFIG.scriptName} — Ingest Complete`,
            ``,
            `Batch ID     : ${batchId}`,
            `Source File  : ${sourceFileName}`,
            `Import Type  : ${importType}`,
            `Supplier     : ${supplierLink?.[0]?.name || "N/A"}`,
            ``,
            `Ingested     : ${ingestedCount}`,
            `New Records  : ${newCount}`,
            `Skipped      : ${skippedCount}`,
            `Empty Rows   : ${emptyRowCount}`,
            `Failed       : ${failedCount}`,
            `GENCODE Fixes: ${gencodeCorrections.length}`,
            ``,
            `Final Status : ${finalStatus}`,
            `Next Step    : Awaiting Script 0A (Rename Detector)`,
            `Timestamp    : ${new Date().toISOString()}`,
        ].join("\n");

        // Log to console/UI
        try {
            output.text(summary);
        } catch (_) {}
        console.log(summary);

        // Persistent record in SystemLogs
        await logToSystemLogs(
            systemLogsTable,
            "System_Event",
            summary,
            finalStatus === "Failed" ? "High" : "Info",
            {
                operatorEmail,
                operatorNotes: `${CONFIG.scriptName} ingest complete. Next: run Script 0A on ${ingestedCount} pending records.`,
            }
        );

        // Update SourceMetadata status
        await metaTable.updateRecordAsync(record.id, {
            [CONFIG.fields.meta.importStatus]: { name: finalStatus },
        });

        // ─────────────────────────────────────────────────────────────────────
        // COMPLETION SUMMARY
        // ─────────────────────────────────────────────────────────────────────
        log("---");
        log(`## ${CONFIG.scriptName} Complete`);
        log(`📊 Staging records created: ${ingestedCount}`);
        log(`📦 Batches written: ${batchCount}`);
        log(`⏭️ Skipped rows: ${skippedCount}`);
        log(`📋 Import Status: ${finalStatus}`);
        log(`➡️ Next: Script 0A — Rename Detector`);

    } catch (err) {
        // ─────────────────────────────────────────────────────────────────────
        // UNHANDLED ERROR HANDLER
        // ─────────────────────────────────────────────────────────────────────
        log(`## ❌ UNHANDLED ERROR: ${err.message}`);
        console.error(err.stack);

        try {
            await logDual(
                systemLogsTable,
                upcAdminTable,
                "System_Event",
                "Stock_Logic_Error",
                `${CONFIG.scriptName} CRASHED\n\nError: ${err.message}\n\nStack:\n${err.stack}\n\nBatch ID: ${batchId}\nFile: ${sourceFileName}`,
                "Critical",
                { operatorEmail, sourceTable: "Staging" }
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