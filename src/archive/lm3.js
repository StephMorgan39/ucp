

/**
 *  SCRIPT 3 — PLU GENERATOR v3.2 (Production Ready)
 *  PURPOSE:
 *  Proposes internal PLU codes (163|TT|BBBB|N) for NEW PRODUCTS records
 *  that have complete enrichment data (body type, size, colour).
 *  
 *  ARCHITECTURE:
 *  1. Reverse-lookup body type in UPCBodyClass → extract TT code
 *  2. Resolve BBBB from supplier SKU (old-style or new-style)
 *  3. Sequence N within BBBB group
 *  4. Propose to Anomalies for manual verification
 *
 *  TRIGGER: ProductMaster records with Status = "NEW PRODUCTS" and no PLU
 *  OUTPUT: Creates "PLU_Ready" Anomalies with proposed PLU
 */

// ============================================================
// TABLE IDs
// ============================================================
const PM_TABLE_ID = "tblgLqMMXX2HcKt9U"; 
const SPD_TABLE_ID = "tbl7mZpHJCUs1r0cg"; 
const UPC_BODY_CLASS_TBL_ID = "tblTKGGHdw9pUD0yR"; 
const ANOMALIES_TABLE_ID = "tbl56i9Rlm2mK6t1w";

// ============================================================
// FIELD IDs — ProductMaster
// ============================================================
const PM_SKU_MASTER_FID = "fldMfK3uyPnDbKONn"; // ✅ Product SKU Master (PLU)
const PM_NAME_FID = "fld7hdhxyu61r5Olm";       // ✅ Product Description
const PM_STATUS_FID = "flddq6S7409EBM71D";     // ✅ Status (PM NEW, PM ACTIVE, etc.)
const PM_SPD_LINK_FID = "fldxZcpnCCCYW5zHx";   // ✅ Link to SupplierProductData
const PM_UBC_LINK_FID = "fldyrCQE5L3lQktS3";   // ✅ Link to UPCBodyClass
const PM_COLOUR_LINK_FID = "fldDBJifgrvsMqR9g"; // ✅ Link to UPCColourMaster
const PM_SIZE_LENGTH_FID = "fld0UAx6ANs6ukXmE"; // ✅ Size Length MM (lookup)
const PM_SIZE_WIDTH_FID = "flddQpgGUlSOJlfBk";  // ✅ Size Width MM (lookup)
const PM_TT_EXTRACTOR_FID = "fldqGQUzzlMkHcx0N"; // ✅ Formula: VALUE(MID({SKU}, 4, 2))

// ============================================================
// FIELD IDs — UPCBodyClass
// ============================================================
const UBC_PRODUCT_TYPE_FID = "flddbKj9I5DhNRLsx"; // ✅ Product Type
const UBC_CATEGORY_NO_FID = "fldA2oxWnAijIjrpT";  // ✅ Category No

// ============================================================
// FIELD IDs — SPD (SupplierProductData)
// ============================================================
const SPD_SKU_FID = "fldK3FyPA98F3smc9";       // ✅ Supplier SKU
const SPD_BODY_TYPE_FID = "fldtMpYo9uqtirVW7"; // ✅ Body Type Class

// ============================================================
// FIELD IDs — Anomalies
// ============================================================
const ANOM_ERROR_TYPE_FID = "fldjYiDzJmdYJp6uF";  // Error Type
const ANOM_DETECTED_VAL_FID = "fld0wlmRbNFgVpbXS"; // Detected Value (the PLU)
const ANOM_NOTES_FID = "fldB7o9RtnQPi4goY";        // Notes
const ANOM_SEVERITY_FID = "fld3TPgysD2hLbtvR";     // Severity
const ANOM_DETECTED_BY_FID = "fldbPrkOy6XavA4ef";  // Detected By
const ANOM_RESOLUTION_FID = "fld4li4vcLn43h2N4";   // Resolution Status
const ANOM_DATE_FID = "fldE7JCdKubLvxysd";         // Date Detected

// ============================================================
// CONSTANTS
// ============================================================
const SUPPLIER_CODE = "163";
const PM_STATUS_TRIGGER = "NEW PRODUCTS"; // Exact status value to filter on
const RESOLUTION_OPEN = "Open";

// ============================================================
// DIRTY DATA NORMALIZATION
// ============================================================
/**
 *  Normalize messy body type strings to match UPCBodyClass entries.
 *  Handles: spaces, case, line breaks, variations like "Red Ceramic" → "Ceramic"
 */
const BODY_TYPE_NORMALIZER = {
    // Ceramic variants (all → "Ceramic")
    "ceramic": "Ceramic",
    "ceramicred": "Ceramic",
    "ceramicwhite": "Ceramic",
    "ceramicredhardword": "Ceramic",
    "hardceramic": "Ceramic",
    "ceramic white": "Ceramic",
    "ceramic red": "Ceramic",
    "white ceramic": "Ceramic",
    "red ceramic": "Ceramic",
    // Porcelain variants (all → "Porcelain")
    "porcelain": "Porcelain",
    "porcelainglazed": "Porcelain",
    "glazedporcelain": "Porcelain",
    "porcelainfullword": "Porcelain",
    "fullwordporcelain": "Porcelain",
    "colourwordporcelain": "Porcelain",
    "colorwordporcelain": "Porcelain",
    "porcelain glazed": "Porcelain",
    "glazed porcelain": "Porcelain",
    "porcelain full body": "Porcelain",
    "colour porcelain": "Porcelain",
    "color porcelain": "Porcelain",
    // Gris Porcelain (special type 03)
    "grisporcelain": "Gris Porcelain",
    "gris porcelain": "Gris Porcelain",
    "greyporcelain": "Gris Porcelain",
    "grey porcelain": "Gris Porcelain",
    // Hard Body Ceramic (special type 02)
    "hardbodyceramic": "Hard body Ceramic",
    "hard body ceramic": "Hard body Ceramic",
};

function normalizeBodyType(rawBodyType) {
    if (!rawBodyType) return null;
    // Clean: lowercase, remove spaces/newlines, remove special chars
    const cleaned = rawBodyType
        .toLowerCase()
        .replace(/[\s\n\r]+/g, "")
        .replace(/[^a-z0-9]/g, "");
    
    // Exact match in normalizer
    if (BODY_TYPE_NORMALIZER[cleaned]) {
        return BODY_TYPE_NORMALIZER[cleaned];
    }
    
    // Partial/fuzzy match: check if cleaned contains key substrings
    for (const [key, canonical] of Object.entries(BODY_TYPE_NORMALIZER)) {
        if (cleaned.includes(key)) {
            return canonical;
        }
    }
    return null;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function zeroPad(n, width) { return String(n).padStart(width, "0"); }

function isOldStyleSku(sku) { return /^\d{4}-[A-Z0-9./]+$/i.test(sku.trim()); }

function extractBBBB(sku) { return sku.trim().substring(0, 4); }

function extractNewStyleGroupKey(sku) {
    const parts = sku.trim().toUpperCase().split("-");
    const filtered = parts === "EQP" ? parts.slice(1) : parts;
    if (filtered.length < 2) return filtered.join("-");
    return filtered.slice(0, -1).join("-");
}

function parsePlu(plu) {
    const s = String(plu).trim();
    if (!s.startsWith(SUPPLIER_CODE) || s.length < 10) return null;
    const tt = s.substring(3, 5);
    const bbbb = s.substring(5, 9);
    const n = parseInt(s.substring(9), 10) || 0;
    return { tt, bbbb, n };
}

function chunk(arr, n) {
    const out = [];
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
}

// ============================================================
// MAIN
// ============================================================
async function main() {
    output.markdown("# 🏷️ Script 3 — PLU Generator v3.2\n");
    output.markdown(`> **Time:** ${new Date().toLocaleString()}\n`);
    output.markdown("> **Mode:** Soft Proposal (writes to Anomalies only)\n");
    output.markdown("---\n");

    const pmTable = base.getTable(PM_TABLE_ID);
    const spdTable = base.getTable(SPD_TABLE_ID);
    const ubcTable = base.getTable(UPC_BODY_CLASS_TBL_ID);
    const anomTable = base.getTable(ANOMALIES_TABLE_ID);

    try {
        // STEP 1 — Load UPCBodyClass
        const ubcQuery = await ubcTable.selectRecordsAsync({
            fields: [UBC_PRODUCT_TYPE_FID, UBC_CATEGORY_NO_FID]
        });
        const typeToTT = new Map();
        ubcQuery.records.forEach(r => {
            const type = r.getCellValueAsString(UBC_PRODUCT_TYPE_FID);
            const tt = r.getCellValueAsString(UBC_CATEGORY_NO_FID);
            if (type && tt) typeToTT.set(type.toLowerCase(), tt);
        });

        // STEP 2 — Index Existing PLUs
        const pmAllQuery = await pmTable.selectRecordsAsync({ fields: [PM_SKU_MASTER_FID] });
        const bbbbIndex = {};
        const maxBbbbPerTt = {};
        
        pmAllQuery.records.forEach(r => {
            const parsed = parsePlu(r.getCellValueAsString(PM_SKU_MASTER_FID));
            if (!parsed) return;
            const { tt, bbbb, n } = parsed;
            if (!bbbbIndex[tt]) bbbbIndex[tt] = {};
            bbbbIndex[tt][bbbb] = Math.max(bbbbIndex[tt][bbbb] || 0, n);
            maxBbbbPerTt[tt] = Math.max(maxBbbbPerTt[tt] || 0, parseInt(bbbb, 10));
        });

        // STEP 3 — Load NEW PRODUCTS
        const pmNewQuery = await pmTable.selectRecordsAsync({
            fields: [PM_SKU_MASTER_FID, PM_NAME_FID, PM_STATUS_FID, PM_SPD_LINK_FID, PM_UBC_LINK_FID, PM_COLOUR_LINK_FID, PM_SIZE_LENGTH_FID, PM_SIZE_WIDTH_FID]
        });
        const newProducts = pmNewQuery.records.filter(r => 
            r.getCellValueAsString(PM_STATUS_FID) === PM_STATUS_TRIGGER && 
            !r.getCellValueAsString(PM_SKU_MASTER_FID)
        );

        if (!newProducts.length) {
            output.markdown("✅ **No new products requiring PLU proposals.**");
            return;
        }

        // STEP 4 — Processing Loop
        const spdQuery = await spdTable.selectRecordsAsync({ fields: [SPD_SKU_FID, SPD_BODY_TYPE_FID] });
        const spdById = new Map(spdQuery.records.map(r => [r.id, r]));
        const proposals = [], gated = [];

        for (const pmRec of newProducts) {
            const name = pmRec.getCellValueAsString(PM_NAME_FID) || "Unknown Product";
            const ubcLinks = pmRec.getCellValue(PM_UBC_LINK_FID) || [];
            const spdLinks = pmRec.getCellValue(PM_SPD_LINK_FID) || [];
            
            if (!ubcLinks.length || !spdLinks.length) {
                gated.push({ name, reason: "Missing Link to Body Class or Supplier Data" });
                continue;
            }

            const spdRec = spdById.get(spdLinks.id);
            const rawBody = spdRec.getCellValueAsString(SPD_BODY_TYPE_FID);
            const normalizedBody = normalizeBodyType(rawBody);
            const tt = typeToTT.get(normalizedBody?.toLowerCase());

            if (!tt) {
                gated.push({ name, reason: `Could not normalize body type: "${rawBody}"` });
                continue;
            }

            const rawSku = spdRec.getCellValueAsString(SPD_SKU_FID);
            let bbbb = isOldStyleSku(rawSku) ? extractBBBB(rawSku) : zeroPad((maxBbbbPerTt[tt] || 0) + 1, 4);
            
            if (!bbbbIndex[tt]) bbbbIndex[tt] = {};
            const n = (bbbbIndex[tt][bbbb] || 0) + 1;
            bbbbIndex[tt][bbbb] = n;
            
            const plu = `${SUPPLIER_CODE}${tt}${bbbb}${n}`;
            proposals.push({ pmRec, name, plu });
        }

        // STEP 5 — Preview & Write
        output.markdown(`### Proposals: ${proposals.length} | Blocked: ${gated.length}`);
        if (proposals.length > 0) {
            const confirm = await input.buttonsAsync("Log proposals to Anomalies?", ["Proceed", "Cancel"]);
            if (confirm === "Proceed") {
                const creates = proposals.map(p => ({
                    fields: {
                        [ANOM_ERROR_TYPE_FID]: { name: "PLU_Ready" },
                        [ANOM_DETECTED_VAL_FID]: p.plu,
                        [ANOM_NOTES_FID]: `Proposed PLU for ${p.name}`,
                        [ANOM_SEVERITY_FID]: { name: "Info" },
                        [ANOM_DETECTED_BY_FID]: { name: "ETL_Script" },
                        [ANOM_RESOLUTION_FID]: { name: RESOLUTION_OPEN },
                        [ANOM_DATE_FID]: new Date().toISOString()
                    }
                }));
                for (const b of chunk(creates, 50)) await anomTable.createRecordsAsync(b);
                output.markdown("✅ **Proposals logged.**");
            }
        }
    } catch (err) {
        output.markdown(`## ❌ Error\n${err.message}`);
    }
}

await main();
