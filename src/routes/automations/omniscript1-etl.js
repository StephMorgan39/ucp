/**
 * SCRIPT 1 — ETL ROUTER v2.0 (Template Edition)
 * Standardized for dual logging, error handling, and batch summary.
 * Use this as a template for all future ETL scripts.
 */

// ─────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────
const CONFIG = {
    scriptName: "Script 1 — ETL Router",
    scriptVersion: "2.0",
    tables: {
        staging: "tblcPSP5NcP0ioUP8",
        spd: "tbl7mZpHJCUs1r0cg",
        systemLogs: "tblk1v5VHPEC2c2u2",
        upcAdmin: "tbl56i9Rlm2mK6t1w",
        standardization: "tblMdVyuaCBG40uQP",
    },
    fields: {
        staging: {
            sku: "fldeEd9FiNq5AtGNk",
            importType: "fldjdRY1TAJypmcPF",
            etlStatus: "fldbrUDvLv8OEnEqh",
            supplierLink: "fldhYMKeVijNr36Fs",
            description: "fldkAm1iLOJJYmzmi",
            stockOnHand: "fldhNujCBWdylBEzS",
            stockAvailable: "fldqPizK5v1z69O7L",
        },
        spd: {
            sku: "fldK3FyPA98F3smc9",
            stockOnHand: "fldnYxUVqYOTvBNVd",
            stockAvailable: "fldW44uBVVT9aqrcP",
            stockDate: "fldcq3PzsLthtvh2v",
            bodyType: "fldtMpYo9uqtirVW7",
        },
        standardization: {
            category: "fld2bslzLVAsSQIT8",
            fieldName: "fldDUZ6Rgq2AyGFI0",
            exampleInput: "fld9DuMSezOu8000U",
            exampleOutput: "fldHA73RGGr3ERvNp",
            feasible: "fldid3LYwJeC8bx7e",
        },
        systemLogs: {
            notes: "fld4l6AJhVNRzIaY8",
            systemEvent: "flda8oHUThBc1Kb7I",
            severity: "fldPdoc6JPYHV9gpb",
            systemLog: "fldog9l4DwJeE5Qj8",
            upcAdminLink: "fldWXFUMjSnBFAGvd",
        },
        upcAdmin: {
            errorType: "fldjYiDzJmdYJp6uF",
            severity: "fld3TPgysD2hLbtvR",
            detectedBy: "fldbPrkOy6XavA4ef",
            resolutionStatus: "fld4li4vcLn43h2N4",
            notes: "fldB7o9RtnQPi4goY",
            dateDetected: "fldE7JCdKubLvxysd",
            stagingLink: "fldz5hJMgnsZu0T07",
            systemLogLink: "fldGpOua9oNrOPesT",
        },
    },
};

// ─────────────────────────────────────────────────────────────
// LOGGING HELPERS
// ─────────────────────────────────────────────────────────────
const log = (msg) => {
    try { output.markdown(msg); } catch (_) {}
    console.log(String(msg).replace(/\*\*/g, "").replace(/`/g, "").replace(/#+\s/g, ""));
};

async function logToSystemLogs(logTable, eventType, notes, severity, options = {}) {
    const F = CONFIG.fields.systemLogs;
    try {
        const fields = {
            [F.notes]: String(notes).substring(0, 5000),
            [F.systemEvent]: { name: eventType },
            [F.severity]: { name: severity },
            [F.systemLog]: { name: "Logged" },
        };
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

async function logToUPCAdmin(adminTable, errorType, notes, severity, options = {}) {
    const F = CONFIG.fields.upcAdmin;
    try {
        const fields = {
            [F.errorType]: { name: errorType },
            [F.severity]: { name: severity },
            [F.detectedBy]: { name: "ETL_Script" },
            [F.resolutionStatus]: { name: "Unresolved" },
            [F.notes]: String(notes).substring(0, 5000),
            [F.dateDetected]: new Date().toISOString().split("T")[0],
        };
        if (options.stagingRecordId) {
            fields[F.stagingLink] = [{ id: options.stagingRecordId }];
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

async function logDual(systemLogsTable, upcAdminTable, eventType, errorType, notes, severity, options = {}) {
    // First, create UPCAdmin record
    const adminRecordId = await logToUPCAdmin(upcAdminTable, errorType, notes, severity, {
        stagingRecordId: options.stagingRecordId,
    });
    // Then create SystemLogs record, linked to UPCAdmin
    const sysLogRecordId = await logToSystemLogs(systemLogsTable, eventType, notes, severity, {
        upcAdminRecordId: adminRecordId,
    });
    // Update UPCAdmin with SystemLog link (bidirectional)
    if (adminRecordId && sysLogRecordId) {
        try {
            await upcAdminTable.updateRecordAsync(adminRecordId, {
                [CONFIG.fields.upcAdmin.systemLogLink]: [{ id: sysLogRecordId }],
            });
        } catch (_) {}
    }
    return { sysLogRecordId, adminRecordId };
}

// ─────────────────────────────────────────────────────────────
// UTILITY HELPERS
// ─────────────────────────────────────────────────────────────
function chunk(arr, n = 50) {
    const out = [];
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
}

// ─────────────────────────────────────────────────────────────
// MAIN FUNCTION
// ─────────────────────────────────────────────────────────────
async function main() {
    log(`# ${CONFIG.scriptName} v${CONFIG.scriptVersion}`);

    // Table references
    const stagingTable = base.getTable(CONFIG.tables.staging);
    const spdTable = base.getTable(CONFIG.tables.spd);
    const systemLogsTable = base.getTable(CONFIG.tables.systemLogs);
    const upcAdminTable = base.getTable(CONFIG.tables.upcAdmin);
    const standardizationTbl = base.getTable(CONFIG.tables.standardization);

    // Tracking variables
    let processedCount = 0, createdCount = 0, failedCount = 0, skippedCount = 0;
    let batchId = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);

    try {
        // STEP 1: Load Standardization Engine
        log("## Step 1 — Loading Standardization engine...");
        const stdQuery = await standardizationTbl.selectRecordsAsync({
            fields: [
                CONFIG.fields.standardization.category,
                CONFIG.fields.standardization.exampleInput,
                CONFIG.fields.standardization.exampleOutput,
                CONFIG.fields.standardization.feasible,
            ],
        });
        const stdEngine = {};
        for (const r of stdQuery.records) {
            if (r.getCellValueAsString(CONFIG.fields.standardization.feasible) === "Yes") {
                const cat = r.getCellValueAsString(CONFIG.fields.standardization.category).trim().toUpperCase();
                const inputVal = r.getCellValueAsString(CONFIG.fields.standardization.exampleInput).trim().toUpperCase();
                const key = `${cat}|${inputVal}`;
                stdEngine[key] = r.getCellValueAsString(CONFIG.fields.standardization.exampleOutput).trim();
            }
        }
        log(`✅ Standardization engine loaded: ${Object.keys(stdEngine).length} rules`);

        const applyStd = (category, rawValue) => {
            if (!rawValue) return rawValue;
            const key = `${category.toUpperCase()}|${String(rawValue).trim().toUpperCase()}`;
            return stdEngine[key] || rawValue;
        };

        // STEP 2: Load Pending Staging Records
        log("## Step 2 — Loading pending Staging records...");
        const stagingQuery = await stagingTable.selectRecordsAsync({
            fields: [
                CONFIG.fields.staging.sku,
                CONFIG.fields.staging.importType,
                CONFIG.fields.staging.etlStatus,
                CONFIG.fields.staging.description,
                CONFIG.fields.staging.stockOnHand,
                CONFIG.fields.staging.stockAvailable,
                CONFIG.fields.staging.supplierLink,
            ],
        });
        const pendingRows = stagingQuery.records.filter(
            r => r.getCellValueAsString(CONFIG.fields.staging.etlStatus) === "pending"
        );
        log(`✅ Found ${pendingRows.length} pending records.`);

        // STEP 3: Load SPD Index
        log("## Step 3 — Loading SPD index...");
        const spdQuery = await spdTable.selectRecordsAsync({
            fields: [
                CONFIG.fields.spd.sku,
                CONFIG.fields.spd.bodyType,
                CONFIG.fields.spd.stockOnHand,
                CONFIG.fields.spd.stockAvailable,
                CONFIG.fields.spd.stockDate,
            ],
        });
        const spdIndex = {};
        for (const rec of spdQuery.records) {
            const key = rec.getCellValueAsString(CONFIG.fields.spd.sku).trim().toUpperCase();
            if (key) spdIndex[key] = rec;
        }

        // STEP 4: Processing Loop
        log("## Step 4 — Processing...");
        const stagingUpdates = [], spdUpdates = [], spdCreates = [];
        for (const stagingRec of pendingRows) {
            const importType = stagingRec.getCellValueAsString(CONFIG.fields.staging.importType);
            const rawSku = stagingRec.getCellValueAsString(CONFIG.fields.staging.sku).trim();
            const normKey = rawSku.toUpperCase();

            if (!normKey) {
                failedCount++;
                stagingUpdates.push({
                    id: stagingRec.id,
                    fields: { [CONFIG.fields.staging.etlStatus]: { name: "failed" } },
                });
                await logDual(
                    systemLogsTable,
                    upcAdminTable,
                    "Missing_Data",
                    "Missing_Data",
                    `Script 1 failed: No SKU found in Staging record.\nRecord ID: ${stagingRec.id}\nBatch ID: ${batchId}`,
                    "High",
                    { stagingRecordId: stagingRec.id }
                );
                continue;
            }

            const spdRec = spdIndex[normKey];
            try {
                const payload = {};
                if (
                    importType.startsWith("ST") ||
                    importType.startsWith("EOR") ||
                    importType.startsWith("DD")
                ) {
                    // Stock Logic
                    const soh = stagingRec.getCellValue(CONFIG.fields.staging.stockOnHand);
                    const sav = stagingRec.getCellValue(CONFIG.fields.staging.stockAvailable);
                    if (soh !== null) payload[CONFIG.fields.spd.stockOnHand] = soh;
                    if (sav !== null) payload[CONFIG.fields.spd.stockAvailable] = sav;
                    payload[CONFIG.fields.spd.stockDate] = new Date().toISOString().split("T")[0];

                    // Mapping & Standardisation
                    const rawBody = stagingRec.getCellValueAsString("fldIEO5cTzgLSSOC0").trim();
                    const cleanBody = applyStd("Body Type", rawBody);
                    if (cleanBody && spdRec) {
                        payload[CONFIG.fields.spd.bodyType] = cleanBody;
                    }

                    if (spdRec) {
                        spdUpdates.push({ id: spdRec.id, fields: payload });
                        processedCount++;
                    } else {
                        payload[CONFIG.fields.spd.sku] = rawSku;
                        spdCreates.push({ fields: payload });
                        createdCount++;
                    }
                    stagingUpdates.push({
                        id: stagingRec.id,
                        fields: { [CONFIG.fields.staging.etlStatus]: { name: "processed" } },
                    });
                }
            } catch (err) {
                failedCount++;
                stagingUpdates.push({
                    id: stagingRec.id,
                    fields: { [CONFIG.fields.staging.etlStatus]: { name: "failed" } },
                });
                await logDual(
                    systemLogsTable,
                    upcAdminTable,
                    "Stock_Logic_Error",
                    "Stock_Logic_Error",
                    `Script 1 failure - SKU ${rawSku}: ${err.message}`,
                    "High",
                    { stagingRecordId: stagingRec.id }
                );
            }
        }

        // STEP 5: Commit Writes
        log("## Step 5 — Writing to Airtable...");
        for (const batch of chunk(spdCreates, 50)) await spdTable.createRecordsAsync(batch);
        for (const batch of chunk(spdUpdates, 50)) await spdTable.updateRecordsAsync(batch);
        for (const batch of chunk(stagingUpdates, 50)) await stagingTable.updateRecordsAsync(batch);

        // STEP 6: Batch Summary Logging
        const summary = [
            `📦 ${CONFIG.scriptName} — Batch Complete`,
            `Batch ID     : ${batchId}`,
            `Processed    : ${processedCount}`,
            `Created      : ${createdCount}`,
            `Failed       : ${failedCount}`,
            `Skipped      : ${skippedCount}`,
            `Timestamp    : ${new Date().toISOString()}`,
        ].join("\n");

        await logToSystemLogs(
            systemLogsTable,
            "System_Event",
            summary,
            "Info"
        );
        log("## ✅ ETL Router Complete");
        log(summary);

    } catch (err) {
        log(`❌ Unhandled error: ${err.message}`);
        await logDual(
            systemLogsTable,
            upcAdminTable,
            "Stock_Logic_Error",
            "Stock_Logic_Error",
            `Script 1 crashed: ${err.message}\n${err.stack}`,
            "Critical"
        );
    }
}

await main();

How to Use This Template
Copy and adapt this structure for all future ETL scripts.
Update the CONFIG object at the top for any new fields or tables.
Use the logging helpers for all anomaly and audit logging.
Wrap all main logic in try/catch and always log errors to both logs.
Track and log batch summaries at the end of each script.