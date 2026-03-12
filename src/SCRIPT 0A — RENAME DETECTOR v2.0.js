// ============================================================
// SCRIPT 0A — RENAME DETECTOR v2.0
// Utile Solutions PIM | Revised: March 2026
//
// WHAT THIS SCRIPT DOES:
//   Detects two types of Decobella SKU rename events:
//
//   TYPE 1 — BATCH VARIANT (.A suffix)
//     Decobella appends .A to their own code for a batch variant.
//     e.g. 0517-BLU.A arrives alongside 0517-BLU
//     → Both are real products. Utile's PLU gets A suffix appended.
//
//   TYPE 2 — PLAIN WHAMMY (description match, different SKU)
//     Old supplier code is still in SPD. New unknown SKU arrives
//     in the same file with a description matching an existing
//     SPD record at ≥ 85% similarity.
//     → Old PM gets Z suffix. New PM gets B suffix.
//     → Works even if old code disappears in a later file (checked
//        against SPD, not just the current batch).
//
// NO MANUAL VARIABLES TO TOGGLE. Script is fully automated.
// ============================================================

const FUZZY_THRESHOLD = 0.85; // 85% description match = rename
const ADMIN_LOGS_TABLE_ID  = "tblk1v5VHPEC2c2u2";
const SPD_TABLE_ID         = "tbl7mZpHJCUs1r0cg";
const PM_TABLE_ID          = "tblgLqMMXX2HcKt9U";
const STAGING_TABLE_ID     = "tblcPSP5NcP0ioUP8";
const SUPPLIER_TABLE_ID    = "tblLmsdwd3AGdLgwQ";

// SPD field IDs
const SPD_SKU_FID          = "fldK3FyPA98F3smc9";
const SPD_DESC_FID         = "fldoROoSpEm5FuUnI";
const SPD_PM_LINK_FID      = "fldGxaIlPVor7QEwN";

// PM field IDs
const PM_SKU_MASTER_FID    = "fldMfK3uyPnDbKONn";
const PM_DESC_FID          = "fld7hdhxyu61r5Olm";  // FIX: was fldVN8HH5cJX2SBVH (not in schema)
const PM_STATUS_FID        = "flddq6S7409EBM71D";  // Product_Status
const PM_SPD_LINK_FID      = "fldxZcpnCCCYW5zHx";  // FIX: was fldGxaIlPVor7QEwN (that's SPD→PM, not PM→SPD)
const PM_TRANSITION_FID    = "fldvqYzX3ZVB1UsRi";  // Transition Linked SKU

// Staging field IDs
const STG_SUPPLIER_SKU_FID = "fldeEd9FiNq5AtGNk";  // FIX: was fldOWWLBzngArnoL9 (that's Anomalies.Source Record)
const STG_DESC_FID         = "fldkAm1iLOJJYmzmi";  // FIX: was fldoROoSpEm5FuUnI (that's SPD description, not Staging)
const STG_STATUS_FID       = "fldbrUDvLv8OEnEqh";  // Sys Etl Process Status
const STG_IMPORT_TYPE_FID  = "fldjdRY1TAJypmcPF";

// AdminLogs field IDs — FIX: all were placeholder names, replaced with real schema IDs
const LOG_NOTES_FID        = "fld4l6AJhVNRzIaY8";  // Notes
const LOG_SEVERITY_FID     = "fldPdoc6JPYHV9gpb";  // Severity
const LOG_TYPE_FID         = "flda8oHUThBc1Kb7I";  // Anomaly Type
const LOG_SUPPLIER_FID     = "fldpY3ETXowLbhQDw";  // Link to Supplier
const LOG_DETECTED_FID     = "fldILG5KBZqYIZx2v";  // Detected Value

// ── Levenshtein similarity ──────────────────────────────────
function similarity(a, b) {
    a = a.toLowerCase().trim();
    b = b.toLowerCase().trim();
    if (a === b) return 1.0;
    const la = a.length, lb = b.length;
    if (!la || !lb) return 0;
    const dp = Array.from({ length: la + 1 }, (_, i) =>
        Array.from({ length: lb + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= la; i++)
        for (let j = 1; j <= lb; j++)
            dp[i][j] = a[i-1] === b[j-1]
                ? dp[i-1][j-1]
                : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    const dist = dp[la][lb];
    return 1 - dist / Math.max(la, lb);
}

// ── Normalise description for matching ─────────────────────
function normalise(desc) {
    return desc
        .toLowerCase()
        .replace(/\d+(\.\d+)?\s*mm/g, '')      // strip dimensions
        .replace(/\d+x\d+/g, '')                // strip WxH
        .replace(/[^a-z\s]/g, ' ')             // strip non-alpha
        .replace(/\s+/g, ' ')
        .trim();
}

async function main() {
    console.log("# Script 0A — Rename Detector v2.0");

    const stagingTable = base.getTable(STAGING_TABLE_ID);
    const spdTable     = base.getTable(SPD_TABLE_ID);
    const pmTable      = base.getTable(PM_TABLE_ID);
    const logTable     = base.getTable(ADMIN_LOGS_TABLE_ID);

    // Load pending Staging rows (ST import type only — renames don't apply to PR/DD/EOR)
    const stagingQ = await stagingTable.selectRecordsAsync({
        fields: [STG_SUPPLIER_SKU_FID, STG_DESC_FID, STG_STATUS_FID, STG_IMPORT_TYPE_FID]
    });
    const pendingRows = stagingQ.records.filter(r => {
        const status = r.getCellValueAsString(STG_STATUS_FID).trim().toUpperCase();
        const type   = r.getCellValueAsString(STG_IMPORT_TYPE_FID).trim().toUpperCase();
        return status === "PENDING" && type === "ST";
    });

    console.log(`**Pending ST rows in Staging:** ${pendingRows.length}`);
    if (!pendingRows.length) {
        console.log("✅ Nothing to process.");
        return;
    }

    // Load all SPD records for matching
    const spdQ = await spdTable.selectRecordsAsync({ fields: [SPD_SKU_FID, SPD_DESC_FID, SPD_PM_LINK_FID] });
    const spdRecords = spdQ.records;

    // Build lookup: normalised SPD description → SPD record
    const spdByNormDesc = new Map();
    const spdBySkuUpper = new Map();
    for (const r of spdRecords) {
        const sku  = r.getCellValueAsString(SPD_SKU_FID).trim().toUpperCase();
        const desc = r.getCellValueAsString(SPD_DESC_FID).trim();
        spdBySkuUpper.set(sku, r);
        if (desc.length >= 5) spdByNormDesc.set(normalise(desc), r);
    }

    const logs = [];
    let type1Count = 0, type2Count = 0;

    // ── TYPE 1 — Batch Variant (.A suffix detection) ────────
    console.log("## TYPE 1 — Batch Variant (.A suffix)");

    const dotARows  = pendingRows.filter(r => r.getCellValueAsString(STG_SUPPLIER_SKU_FID).trim().toUpperCase().endsWith(".A"));
    const baseSkuMap = new Map(); // base SKU → staging row
    for (const r of pendingRows) {
        const sku = r.getCellValueAsString(STG_SUPPLIER_SKU_FID).trim().toUpperCase();
        if (!sku.endsWith(".A")) baseSkuMap.set(sku, r);
    }

    for (const dotARow of dotARows) {
        const rawSku  = dotARow.getCellValueAsString(STG_SUPPLIER_SKU_FID).trim().toUpperCase();
        const baseSku = rawSku.slice(0, -2); // strip .A
        const hasPair = baseSkuMap.has(baseSku);

        console.log(`- \`${rawSku}\` → base \`${baseSku}\` ${hasPair ? "✅ pair found in same batch" : "⚠️ no base code in this batch (will be handled on next run)"}`);

        logs.push({
            fields: {
                [LOG_TYPE_FID]:     { name: "Rename_Detected" },
                [LOG_SEVERITY_FID]: { name: "Info" },
                [LOG_NOTES_FID]:    `TYPE 1 Batch Variant detected.\nDot-A SKU: ${rawSku}\nBase SKU: ${baseSku}\nPair in batch: ${hasPair ? "YES" : "NO — will resolve on depletion"}`,
                [LOG_DETECTED_FID]: rawSku,
            }
        });
        type1Count++;
        // Note: PLU A-suffix application happens in Script 1 routing, not here.
        // This script logs the detection; Script 1 reads the log.
    }

    // ── TYPE 2 — Plain Whammy (fuzzy description match) ────
    console.log("## TYPE 2 — Plain Whammy (unknown SKU, matched description)");

    const pmQ = await pmTable.selectRecordsAsync({ fields: [PM_SKU_MASTER_FID, PM_STATUS_FID, PM_SPD_LINK_FID] });
    const activePmSkus = new Set(
        pmQ.records
            .filter(r => ["ACTIVE","NEW PRODUCTS","SKU_Transition"].includes(r.getCellValueAsString(PM_STATUS_FID).trim()))
            .map(r => r.getCellValueAsString(PM_SKU_MASTER_FID).trim().toUpperCase())
    );

    for (const row of pendingRows) {
        const rawSku  = row.getCellValueAsString(STG_SUPPLIER_SKU_FID).trim().toUpperCase();
        const rawDesc = row.getCellValueAsString(STG_DESC_FID).trim();

        // Skip .A rows — handled in TYPE 1
        if (rawSku.endsWith(".A")) continue;

        // Skip if SKU already known in SPD
        if (spdBySkuUpper.has(rawSku)) continue;

        // Unknown SKU — attempt description match against SPD
        const normIncoming = normalise(rawDesc);
        if (normIncoming.length < 5) continue;

        let bestScore = 0, bestSpdRecord = null;
        for (const [normDesc, spdRec] of spdByNormDesc.entries()) {
            const score = similarity(normIncoming, normDesc);
            if (score > bestScore) { bestScore = score; bestSpdRecord = spdRec; }
        }

        if (bestScore >= FUZZY_THRESHOLD && bestSpdRecord) {
            const matchedSku  = bestSpdRecord.getCellValueAsString(SPD_SKU_FID);
            const matchedDesc = bestSpdRecord.getCellValueAsString(SPD_DESC_FID);

            console.log(
                `- **NEW:** \`${rawSku}\` matched to **EXISTING:** \`${matchedSku}\`\n` +
                `  Similarity: ${(bestScore * 100).toFixed(1)}%\n` +
                `  New desc: "${rawDesc.substring(0,80)}"\n` +
                `  Old desc: "${matchedDesc.substring(0,80)}"`
            );

            logs.push({
                fields: {
                    [LOG_TYPE_FID]:     { name: "Rename_Detected" },
                    [LOG_SEVERITY_FID]: { name: "Info" },
                    [LOG_NOTES_FID]:
                        `TYPE 2 Plain Whammy detected.\n` +
                        `NEW supplier SKU: ${rawSku}\n` +
                        `MATCHED existing SPD SKU: ${matchedSku}\n` +
                        `Match score: ${(bestScore * 100).toFixed(1)}%\n` +
                        `ACTION: Old SPD record → Z suffix on PLU. New record → B suffix on PLU.\n` +
                        `Script 1 will handle routing. Script 2 will handle transition.`,
                    [LOG_DETECTED_FID]: `${rawSku} ≈ ${matchedSku} (${(bestScore*100).toFixed(0)}%)`,
                }
            });
            type2Count++;
        }
    }

    // ── Write logs ──────────────────────────────────────────
    if (logs.length) {
        // Get supplier link for log records (use first Decobella record)
        const supplierQ = await base.getTable(SUPPLIER_TABLE_ID).selectRecordsAsync({ fields: ["Field Id"] });
        const supplierRecord = supplierQ.records[0];

        const logsWithSupplier = logs.map(l => ({
            fields: {
                ...l.fields,
                ...(supplierRecord ? { [LOG_SUPPLIER_FID]: [{ id: supplierRecord.id }] } : {})
            }
        }));

        // Batch create in chunks of 50
        for (let i = 0; i < logsWithSupplier.length; i += 50) {
            await logTable.createRecordsAsync(logsWithSupplier.slice(i, i + 50));
        }
    }

    console.log("---");
    console.log(`## Summary`);
    console.log(`- TYPE 1 (Batch .A variants detected): **${type1Count}**`);
    console.log(`- TYPE 2 (Plain whammy renames detected): **${type2Count}**`);
    console.log(`- AdminLogs entries written: **${logs.length}**`);
    console.log(`\n✅ Script 0A complete. Run Script 0B next.`);
}

await main();