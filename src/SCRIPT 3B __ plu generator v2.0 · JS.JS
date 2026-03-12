// =============================================================
// SCRIPT 3 — PLU GENERATOR v2.0  (Proposal Engine)
// Utile Solutions PIM | Revised: March 2026
// =============================================================
//
// WHAT THIS SCRIPT DOES:
//   Queries ProductMaster for records with Status = "NEW PRODUCTS",
//   validates that required enrichment fields are populated,
//   assembles a proposed PLU, and logs it to Anomalies for
//   human review. It NEVER writes to Product_SKU_Master directly.
//
// PLU ANATOMY:  163 | TT | BBBB | N
//   163   — Decobella supplier constant (always)
//   TT    — 2-digit type code from UPCBodyClass link on PM record
//   BBBB  — derived from supplier SKU:
//             Old-style (e.g. 0573-BGE) → extract first 4 digits
//             New-style (e.g. EQP-COCO515-GLS-BLK) → group by
//             range+finish, allocate next sequential after MAX(BBBB)
//   N     — colour sequence within BBBB group (from UPCColourMaster
//             link order). 1-digit for ≤9 colours, 2-digit for ≥10.
//
// TRIGGER:
//   PM.Product_Status = "NEW PRODUCTS"
//
// ENRICHMENT GATE (all four required before PLU can be proposed):
//   ✅ UPCBodyClass link     → provides TT
//   ✅ Size Length MM        → confirms BBBB basis
//   ✅ Size Width MM         → confirms BBBB basis
//   ✅ UPCColourMaster link  → provides N
//
// OUTPUT:
//   Anomalies record per proposed PLU:
//     Anomaly Type  = "PLU_Ready"
//     Detected Value = proposed PLU string
//     Notes          = "Proposed new PLU for [Name]: [PLU]. 
//                       Awaiting manual operator entry into ProductMaster."
//
// NINA'S WORKFLOW AFTER THIS SCRIPT:
//   1. Open Anomalies table, filter by Anomaly Type = PLU_Ready
//   2. Review each proposed PLU
//   3. If correct: manually type PLU into PM.Product_SKU_Master
//                  set Anomaly Resolution = Resolved
//   4. If wrong: add a note and set Resolution = Under_Review
// =============================================================

// =============================================================
// TABLE IDs  — confirm UPC table IDs against your Airtable base
// =============================================================
const PM_TABLE_ID           = "tblgLqMMXX2HcKt9U";
const SPD_TABLE_ID          = "tbl7mZpHJCUs1r0cg";
const UPC_BODY_CLASS_TBL_ID = "tblTKGGHdw9pUD0yR";     // ← replace with real ID
const ANOMALIES_TABLE_ID    = "tbl56i9Rlm2mK6t1w";
const ADMIN_LOGS_TABLE_ID   = "tblk1v5VHPEC2c2u2";

// =============================================================
// PM FIELD IDs
// =============================================================
const PM_SKU_MASTER_FID     = "fldMfK3uyPnDbKONn";   // Product SKU Master (PLU — do not write)
const PM_NAME_FID           = "fldVN8HH5cJX2SBVH";   // Product Description / Name
const PM_STATUS_FID         = "flddq6S7409EBM71D";   // Product_Status
const PM_SPD_LINK_FID       = "fldGxaIlPVor7QEwN";   // SPD link
const PM_UBC_LINK_FID       = "fldzBkUc1dqtsRbvj";   // UPCBodyClass link  ← confirm field ID
const PM_COLOUR_LINK_FID    = "fldDBJifgrvsMqR9g";   // UPCColourMaster link
const PM_SIZE_LENGTH_FID    = "fldQns7cT9JDqHy0Z";   // Size Length MM
const PM_SIZE_WIDTH_FID     = "fldeQy5c79koW7ABQ";   // Size Width MM

// =============================================================
// UPCBodyClass FIELD IDs
// =============================================================
const UBC_CATEGORY_NO_FID   = "fldA2oxWnAijIjrpT";   // Category No (e.g. "01", "04")
const UBC_PROD_CATEGORY_FID = "fldVS7MdpvEAx7jkK";   // Prod Category name

// =============================================================
// SPD FIELD IDs (needed to read supplier SKU for BBBB logic)
// =============================================================
const SPD_SKU_FID           = "fldK3FyPA98F3smc9";   // Supplier SKU

// =============================================================
// Anomalies FIELD IDs
// =============================================================
const ANOM_ERROR_TYPE_FID   = "fldjYiDzJmdYJp6uF";   // Error Type (singleSelect)
const ANOM_DETECTED_VAL_FID = "fld0wlmRbNFgVpbXS";   // Original Value / Detected Value
const ANOM_NOTES_FID        = "fldB7o9RtnQPi4goY";   // Notes
const ANOM_SEVERITY_FID     = "fld3TPgysD2hLbtvR";   // Error Severity
const ANOM_DETECTED_BY_FID  = "fldbPrkOy6XavA4ef";   // Detected By
const ANOM_RESOLUTION_FID   = "fld4li4vcLn43h2N4";   // Resolution Status
const ANOM_DATE_FID         = "fldE7JCdKubLvxysd";   // Date Detected

// PLU constant
const SUPPLIER_CODE         = "163";

// =============================================================
// HELPERS
// =============================================================

function zeroPad(n, width) {
    return String(n).padStart(width, "0");
}

// Old-style Decobella SKU: NNNN-XXX  e.g. "0573-BGE"
function isOldStyleSku(sku) {
    return /^\d{4}-[A-Z0-9./]+$/i.test(sku.trim());
}

// Extract BBBB from old-style SKU
function extractBBBB(sku) {
    return sku.trim().substring(0, 4);
}

// New-style SKU group key: everything except the colour suffix
// EQP-COCO515-GLS-BLK  →  COCO515-GLS
// EQP-MNC1010-BSLGN    →  MNC1010  (single segment after EQP)
function extractNewStyleGroupKey(sku) {
    const parts = sku.trim().toUpperCase().split("-");
    const filtered = parts[0] === "EQP" ? parts.slice(1) : parts;
    if (filtered.length < 2) return filtered.join("-");
    return filtered.slice(0, -1).join("-");
}

// Parse TT + BBBB + N from an existing PLU string
// 163 + TT(2) + BBBB(4) + N(1-2)
function parsePlu(plu) {
    const s = String(plu).trim();
    if (!s.startsWith("163") || s.length < 10) return null;
    const tt   = s.substring(3, 5);
    const bbbb = s.substring(5, 9);
    const n    = parseInt(s.substring(9), 10) || 0;
    return { tt, bbbb, n };
}

// =============================================================
// MAIN
// =============================================================
async function main() {

    output.markdown("# 🏷️ Script 3 — PLU Generator v2.0 (Proposal Engine)");
    output.markdown(`> Running at: \`${new Date().toLocaleString()}\``);
    output.markdown("> **Mode: Soft Create** — proposes PLUs to Anomalies. Does NOT write to ProductMaster.");
    output.markdown("---");

    const pmTable    = base.getTable(PM_TABLE_ID);
    const spdTable   = base.getTable(SPD_TABLE_ID);
    const ubcTable   = base.getTable(UPC_BODY_CLASS_TBL_ID);
    const anomTable  = base.getTable(ANOMALIES_TABLE_ID);

    // ============================================================
    // STEP 1 — Load UPCBodyClass lookup: record ID → TT
    // ============================================================
    output.markdown("## Step 1 — Loading UPCBodyClass lookup...");

    const ubcQuery = await ubcTable.selectRecordsAsync({
        fields: [UBC_PROD_CATEGORY_FID, UBC_CATEGORY_NO_FID]
    });

    // Map: UBC record ID → TT (zero-padded 2 digits)
    const ubcIdToTT   = new Map();
    // Map: category name → TT (fallback)
    const ubcNameToTT = new Map();

    for (const r of ubcQuery.records) {
        const no  = r.getCellValueAsString(UBC_CATEGORY_NO_FID).trim();
        const cat = r.getCellValueAsString(UBC_PROD_CATEGORY_FID).trim().toLowerCase();
        if (no) {
            const tt = zeroPad(parseInt(no, 10), 2);
            ubcIdToTT.set(r.id, tt);
            if (cat) ubcNameToTT.set(cat, tt);
        }
    }

    output.markdown(`✅ Loaded **${ubcIdToTT.size}** body class entries.`);

    // ============================================================
    // STEP 2 — Build BBBB index from existing PM PLUs
    // ============================================================
    output.markdown("---");
    output.markdown("## Step 2 — Indexing existing PLUs from ProductMaster...");

    const pmAllQuery = await pmTable.selectRecordsAsync({
        fields: [PM_SKU_MASTER_FID, PM_STATUS_FID, PM_SPD_LINK_FID]
    });

    // bbbbIndex[tt][bbbb] = maxN  (highest N assigned in this group)
    const bbbbIndex        = {};
    const maxBbbbPerTt     = {};   // tt → highest BBBB integer seen
    const newStyleGroupMap = {};   // "tt|groupKey" → bbbb already assigned

    for (const r of pmAllQuery.records) {
        const plu = r.getCellValueAsString(PM_SKU_MASTER_FID).trim();
        if (!plu.startsWith("163") || plu.length < 10) continue;

        const parsed = parsePlu(plu);
        if (!parsed) continue;

        const { tt, bbbb, n } = parsed;

        if (!bbbbIndex[tt])       bbbbIndex[tt] = {};
        if (!bbbbIndex[tt][bbbb]) bbbbIndex[tt][bbbb] = 0;
        if (n > bbbbIndex[tt][bbbb]) bbbbIndex[tt][bbbb] = n;

        const bbbbInt = parseInt(bbbb, 10);
        if (!maxBbbbPerTt[tt] || bbbbInt > maxBbbbPerTt[tt]) {
            maxBbbbPerTt[tt] = bbbbInt;
        }
    }

    // Also check Anomalies for PLU_Ready proposals already logged
    // (prevents duplicate proposals on repeated runs)
    const anomQuery = await anomTable.selectRecordsAsync({
        fields: [ANOM_ERROR_TYPE_FID, ANOM_DETECTED_VAL_FID, ANOM_RESOLUTION_FID]
    });

    const alreadyProposed = new Set();
    for (const r of anomQuery.records) {
        const type       = r.getCellValueAsString(ANOM_ERROR_TYPE_FID);
        const resolution = r.getCellValueAsString(ANOM_RESOLUTION_FID);
        const detVal     = r.getCellValueAsString(ANOM_DETECTED_VAL_FID).trim();
        // Track open (unresolved) PLU proposals so we don't duplicate
        if (type === "PLU_Ready" && resolution !== "Resolved" && detVal) {
            alreadyProposed.add(detVal);
        }
    }

    output.markdown(`✅ Indexed **${pmAllQuery.records.length}** PM records | **${alreadyProposed.size}** open proposals already in Anomalies.`);

    // Working copies for this run's allocations
    const wBbbbIndex    = JSON.parse(JSON.stringify(bbbbIndex));
    const wMaxBbbb      = { ...maxBbbbPerTt };
    const wNewStyleMap  = { ...newStyleGroupMap };

    // ============================================================
    // STEP 3 — Load PM records with Status = "NEW PRODUCTS"
    // ============================================================
    output.markdown("---");
    output.markdown("## Step 3 — Loading NEW PRODUCTS records from ProductMaster...");

    const newPmQuery = await pmTable.selectRecordsAsync({
        fields: [
            PM_SKU_MASTER_FID,
            PM_NAME_FID,
            PM_STATUS_FID,
            PM_SPD_LINK_FID,
            PM_UBC_LINK_FID,
            PM_COLOUR_LINK_FID,
            PM_SIZE_LENGTH_FID,
            PM_SIZE_WIDTH_FID,
        ]
    });

    const newProducts = newPmQuery.records.filter(r => {
        const status = r.getCellValueAsString(PM_STATUS_FID).trim();
        // Only process records with no PLU yet
        const hasPlu = r.getCellValueAsString(PM_SKU_MASTER_FID).trim() !== "";
        return status === "NEW PRODUCTS" && !hasPlu;
    });

    output.markdown(`✅ Found **${newProducts.length}** NEW PRODUCTS records without a PLU.`);

    if (newProducts.length === 0) {
        output.markdown("✅ Nothing to propose. All NEW PRODUCTS records already have PLUs.");
        return;
    }

    // ============================================================
    // STEP 4 — Enrichment gate + PLU assembly
    // ============================================================
    output.markdown("---");
    output.markdown("## Step 4 — Validating enrichment and assembling PLUs...");

    // Load SPD records to get supplier SKU (needed for BBBB logic)
    const spdQuery = await spdTable.selectRecordsAsync({
        fields: [SPD_SKU_FID]
    });
    const spdById = new Map(spdQuery.records.map(r => [r.id, r]));

    const proposals  = [];
    const gated      = [];    // failed enrichment gate
    const duplicates = [];    // already proposed and open

    for (const pmRec of newProducts) {

        const name = pmRec.getCellValueAsString(PM_NAME_FID).trim() || pmRec.id;

        // ── Enrichment gate ──────────────────────────────────────
        const ubcLinks     = pmRec.getCellValue(PM_UBC_LINK_FID)     || [];
        const colourLinks  = pmRec.getCellValue(PM_COLOUR_LINK_FID)  || [];
        const sizeLenVal   = pmRec.getCellValue(PM_SIZE_LENGTH_FID);
        const sizeWidVal   = pmRec.getCellValue(PM_SIZE_WIDTH_FID);

        const missing = [];
        if (!ubcLinks.length)        missing.push("UPCBodyClass");
        if (!sizeLenVal)             missing.push("Size Length MM");
        if (!sizeWidVal)             missing.push("Size Width MM");
        if (!colourLinks.length)     missing.push("UPCColourMaster");

        if (missing.length > 0) {
            gated.push({ name, missing: missing.join(", ") });
            continue;
        }

        // ── Resolve TT from UPCBodyClass link ───────────────────
        const ubcRecId = ubcLinks[0].id;
        const tt = ubcIdToTT.get(ubcRecId) || null;

        if (!tt) {
            gated.push({
                name,
                missing: `UPCBodyClass record ID ${ubcRecId} has no Category No — check UPCBodyClass table.`
            });
            continue;
        }

        // ── Resolve BBBB from SPD supplier SKU ──────────────────
        const spdLinks  = pmRec.getCellValue(PM_SPD_LINK_FID) || [];
        let rawSku      = "";
        if (spdLinks.length > 0) {
            const spdRec = spdById.get(spdLinks[0].id);
            if (spdRec) rawSku = spdRec.getCellValueAsString(SPD_SKU_FID).trim();
        }

        let bbbb;
        let bbbbSource;

        if (rawSku && isOldStyleSku(rawSku)) {
            // Old-style: extract BBBB from supplier SKU directly
            bbbb       = extractBBBB(rawSku);
            bbbbSource = `extracted from supplier SKU "${rawSku}"`;
        } else if (rawSku) {
            // New-style EQP- SKU: group by range+finish
            const groupKey = extractNewStyleGroupKey(rawSku);
            const indexKey = `${tt}|${groupKey}`;

            if (wNewStyleMap[indexKey]) {
                bbbb       = wNewStyleMap[indexKey];
                bbbbSource = `reused BBBB for group "${groupKey}"`;
            } else {
                const currentMax  = wMaxBbbb[tt] || 0;
                const nextBbbbInt = currentMax + 1;
                bbbb              = zeroPad(nextBbbbInt, 4);
                wMaxBbbb[tt]      = nextBbbbInt;
                wNewStyleMap[indexKey] = bbbb;
                bbbbSource = `new sequential BBBB ${bbbb} for group "${groupKey}"`;
            }
        } else {
            // No SPD link or no SKU — fall back to pure sequential
            const currentMax  = wMaxBbbb[tt] || 0;
            const nextBbbbInt = currentMax + 1;
            bbbb              = zeroPad(nextBbbbInt, 4);
            wMaxBbbb[tt]      = nextBbbbInt;
            bbbbSource        = `sequential (no supplier SKU found)`;
        }

        // ── Resolve N from colour position ──────────────────────
        if (!wBbbbIndex[tt])       wBbbbIndex[tt] = {};
        if (!wBbbbIndex[tt][bbbb]) wBbbbIndex[tt][bbbb] = 0;

        const nextN = wBbbbIndex[tt][bbbb] + 1;
        wBbbbIndex[tt][bbbb] = nextN;

        // ── Assemble PLU ─────────────────────────────────────────
        const nStr = String(nextN);   // 1-digit ≤9, 2-digit ≥10
        const plu  = `${SUPPLIER_CODE}${tt}${bbbb}${nStr}`;

        // ── Duplicate check ──────────────────────────────────────
        if (alreadyProposed.has(plu)) {
            duplicates.push({ name, plu });
            continue;
        }

        proposals.push({
            pmRec,
            name,
            plu,
            tt,
            bbbb,
            n: nextN,
            bbbbSource,
            rawSku,
        });
    }

    // ============================================================
    // STEP 5 — Preview
    // ============================================================
    output.markdown("---");
    output.markdown("## Step 5 — Preview (no writes yet)");
    output.markdown(
        `**${proposals.length}** PLUs ready to propose | ` +
        `**${gated.length}** blocked (enrichment incomplete) | ` +
        `**${duplicates.length}** skipped (already proposed)`
    );

    if (proposals.length > 0) {
        output.markdown("\n| # | Product Name | Supplier SKU | TT | BBBB | N | **Proposed PLU** |");
        output.markdown("|---|---|---|---|---|---|---|");
        proposals.forEach((p, i) => {
            output.markdown(
                `| ${i + 1} | ${p.name} | \`${p.rawSku || "—"}\` | ${p.tt} | ${p.bbbb} | ${p.n} | **\`${p.plu}\`** |`
            );
        });
    }

    if (gated.length > 0) {
        output.markdown("\n### ⛔ Blocked — enrichment incomplete");
        output.markdown("| Product Name | Missing fields |");
        output.markdown("|---|---|");
        gated.forEach(g => output.markdown(`| ${g.name} | ${g.missing} |`));
        output.markdown(
            "\n> Complete the missing fields on these PM records and re-run Script 3."
        );
    }

    if (duplicates.length > 0) {
        output.markdown("\n### ℹ️ Already proposed (open in Anomalies)");
        duplicates.forEach(d => output.markdown(`- \`${d.plu}\` — ${d.name}`));
    }

    if (proposals.length === 0) {
        output.markdown("\nNothing to write.");
        return;
    }

    // ============================================================
    // STEP 6 — Confirm
    // ============================================================
    output.markdown("---");
    const confirm = await input.buttonsAsync(
        `Log ${proposals.length} PLU proposals to Anomalies?`,
        [
            { label: "✅ Yes — log proposals", value: "yes", variant: "primary" },
            { label: "❌ Cancel",              value: "no",  variant: "default" },
        ]
    );

    if (confirm !== "yes") {
        output.markdown("❌ Cancelled. No records changed.");
        return;
    }

    // ============================================================
    // STEP 7 — Write proposals to Anomalies
    // ============================================================
    output.markdown("---");
    output.markdown("## Step 6 — Writing proposals to Anomalies...");

    const chunk = (arr, n) => {
        const out = [];
        for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
        return out;
    };

    const today = new Date().toISOString().split("T")[0];

    const anomCreates = proposals.map(p => ({
        fields: {
            [ANOM_ERROR_TYPE_FID]:   { name: "PLU_Ready" },
            [ANOM_DETECTED_VAL_FID]: p.plu,
            [ANOM_NOTES_FID]:
                `Proposed new PLU for "${p.name}": ${p.plu}.\n` +
                `Awaiting manual operator entry into ProductMaster.\n\n` +
                `Assembly breakdown:\n` +
                `  163  = Decobella supplier constant\n` +
                `  ${p.tt}   = TT (body class type code)\n` +
                `  ${p.bbbb} = BBBB (${p.bbbbSource})\n` +
                `  ${p.n}    = N (colour sequence in group)\n\n` +
                `Supplier SKU: ${p.rawSku || "not linked"}\n` +
                `PM Record ID: ${p.pmRec.id}`,
            [ANOM_SEVERITY_FID]:     { name: "Info" },
            [ANOM_DETECTED_BY_FID]:  { name: "ETL_Script" },
            [ANOM_RESOLUTION_FID]:   { name: "Open" },
            [ANOM_DATE_FID]:         today,
        }
    }));

    for (const batch of chunk(anomCreates, 50)) {
        await anomTable.createRecordsAsync(batch);
    }

    output.markdown(`✅ Logged **${anomCreates.length}** PLU proposals to Anomalies.`);

    // ============================================================
    // STEP 8 — Summary
    // ============================================================
    output.markdown("---");
    output.markdown("## ✅ Run Complete");
    output.markdown(
        `| Metric | Count |\n|---|---|\n` +
        `| PLU proposals logged to Anomalies | ${anomCreates.length} |\n` +
        `| Blocked (enrichment incomplete)   | ${gated.length} |\n` +
        `| Skipped (already proposed)        | ${duplicates.length} |`
    );
    output.markdown(
        "\n**Nina's next steps:**\n" +
        "1. Open Anomalies table → filter by **Anomaly Type = PLU_Ready**\n" +
        "2. Review each proposed PLU\n" +
        "3. If correct → type PLU into **ProductMaster.Product_SKU_Master** → set Resolution = **Resolved**\n" +
        "4. If wrong → add a note → set Resolution = **Under_Review**"
    );
}

await main();