/**
*  SCRIPT 2B + 2BB — UNIFIED PRICING & SPEC ROUTER
*  Version: 2.1 (Full Production Unified)
*  MANDATE:
*    1. Routes Pricing (Staging -> PricingBridge)
*    2. Routes Specs (Staging -> ProductMaster)
*    3. Uses Dynamic Standardization Engine via Canonical Registry IDs
*    4. Numeric Parser handles European commas for Thickness/Faces
*/

// =============================================================
// ⚙️ OPERATOR CONFIG
// =============================================================
const DRY_RUN = false; // Set to false to commit changes to database

// =============================================================
// 🆔 FIELD & TABLE CONSTANTS
// =============================================================
const TABLES = {
    STAGING: "tblcPSP5NcP0ioUP8",
    SPD: "tbl7mZpHJCUs1r0cg",
    PM: "tblgLqMMXX2HcKt9U",
    PB: "tblW85ycReRUr0Ze1",
    ADMIN_LOGS: "tblk1v5VHPEC2c2u2",
    STD: "tblMdVyuaCBG40uQP"
};

// Staging Fields (Source)
const S_SUPPLIER_SKU = "fldeEd9FiNq5AtGNk";
const S_IMPORT_TYPE = "fldjdRY1TAJypmcPF";
const S_ETL_STATUS = "fldbrUDvLv8OEnEqh";
const S_RETAIL_EXCL = "fldHDkQCH8jKeJZ7g";
const S_NO_FACES = "fldkh9EFaIKvc0yIj";
const S_THICKNESS = "fldbgiMR2Qlm169Mu"; 
const S_PEI_CLASS = "fldqFzEPIby2C94Du";
const S_SLIP_RATING = "fldfMSgqnPwP2hvtl";
const S_BODY_TYPE = "fldIEO5cTzgLSSOC0";
const S_BODY_FINISH = "fld4QhEwwFSgFsHRB";

// SPD Fields (Lookup)
const SPD_DATA_ID = "fldmeU6JZIwvGAuRH";
const SPD_RETAIL_EXCL = "flde8qM0wyidVqrsZ";
const SPD_SUPPLIER_LINK = "fldY9HQ6d42p8uVoY";
const SPD_PM_LINK = "fldGxaIlPVor7QEwN";

// PM Fields (Destination)
const PM_PRICING_LINK = "fldmV1417RrodFlVO";
const PM_UOM_LINK = "fldMWdeUtUF8Hgst9";
const PM_NO_FACES = "fldFbjxoAh9sieegL";
const PM_THICKNESS = "fldEGSqge560gp4OK"; 
const PM_PEI_CLASS = "fldpkrVgQCxk6PKx2";
const PM_SLIP_RATING = "fldEWzbqhhyqM5BfF";
const PM_BODY_TYPE = "flddbKj9I5DhNRLsx";
const PM_BODY_FINISH = "fldeiQRu0fp13cMyL";

// PricingBridge Fields (Destination)
const PB_PRODUCT_SKU = "fldAYj8E8RicN1EmL";
const PB_PRICE_TYPE = "fldlCCMJvTDaNin4h";
const PB_COST = "fldxf21wIe7LXyHFz";
const PB_SUPPLIER = "fldpLc5q4X7D7MZ8a";
const PB_UOM = "fldw9ECJYGAB7IJPh";
const PB_SRP_INCL = "flduA8jZLZJW9D5hU";
const PB_PRICE_STATUS = "fldSdokb18nBjXu0D";

// Admin Log Fields
const AL_NOTES = "fld4l6AJhVNRzIaY8";
const AL_ANOMALY_TYPE = "flda8oHUThBc1Kb7I";
const AL_SEVERITY = "fldPdoc6JPYHV9gpb";
const AL_RESOLUTION = "fldog9l4DwJeE5Qj8";
const AL_DETECTED_VALUE = "fldILG5KBZqYIZx2v";

// Standardization Table Fields
const STD_CANONICAL_LINK = "fldRBVwMAViLtK1Lr"; 
const STD_INPUT = "fld9DuMSezOu8000U";
const STD_OUTPUT = "fldHA73RGGr3ERvNp";
const STD_FEASIBLE = "fldid3LYwJeC8bx7e";

// =============================================================
// 🛠️ HELPER FUNCTIONS
// =============================================================

function sanitizeRaw(val) {
    if (!val) return "";
    const str = typeof val === 'object' ? (val.name || "") : String(val);
    return str.replace(/[\n\r]/g, " ").replace(/\s+/g, " ").trim();
}

function parseNumeric(raw) {
    if (raw === null || raw === undefined || raw === "") return null;
    const clean = String(raw).replace(',', '.').replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? null : parsed;
}

function translateValue(stdEngine, canonicalId, rawVal, fieldName) {
    const sanitized = sanitizeRaw(rawVal);
    if (!sanitized) return { value: null, warning: null };
    const key = `${canonicalId}|${sanitized.toUpperCase()}`;
    const match = stdEngine[key];
    
    if (match) {
        return { value: match, warning: null };
    } else {
        return { value: sanitized, warning: `Standardization required for ${fieldName}: "${sanitized}"` };
    }
}

// FIX: removed `existing !== 0` check — zero is a legitimate value (e.g. 0 faces, 0 thickness).
// Only skip write if field already has a meaningful non-null, non-empty value.
function pmNullSafe(pmRec, fieldId, newValue) {
    if (!pmRec) return newValue;
    if (newValue === null || newValue === undefined) return null;
    const existing = pmRec.getCellValue(fieldId);
    if (existing !== null && existing !== undefined && existing !== "") {
        return null; // Field already populated — do not overwrite
    }
    return newValue;
}

const chunk = (arr, n) => {
    const out = [];
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
};

const normSku = (s) => String(s || "").replace(/[-\s]/g, "").trim().toUpperCase();

// =============================================================
// 🚀 MAIN EXECUTION
// =============================================================
async function main() {
    output.markdown("# 💰 + 🧽 Script 2B+2BB: Unified Pricing & Spec Router");
    if (DRY_RUN) output.markdown("> ⚠️ **DRY RUN MODE** — no records will be written.");

    const stagingTable = base.getTable(TABLES.STAGING);
    const spdTable     = base.getTable(TABLES.SPD);
    const pmTable      = base.getTable(TABLES.PM);
    const pbTable      = base.getTable(TABLES.PB);
    const stdTable     = base.getTable(TABLES.STD);
    const adminLogs    = base.getTable(TABLES.ADMIN_LOGS);

    // ---------------------------------------------------------
    // 1. Load Dynamic Standardization Engine
    // ---------------------------------------------------------
    output.markdown("## Step 1: Loading Standardization Engine...");
    const stdQuery = await stdTable.selectRecordsAsync({
        fields: [STD_CANONICAL_LINK, STD_INPUT, STD_OUTPUT, STD_FEASIBLE]
    });
    
    const stdEngine = {};
    let stdLoaded = 0;
    
    for (const r of stdQuery.records) {
        const feasible = r.getCellValueAsString(STD_FEASIBLE);
        const canLink  = r.getCellValue(STD_CANONICAL_LINK);
        const inputVal = r.getCellValueAsString(STD_INPUT);
        const outputVal= r.getCellValueAsString(STD_OUTPUT);

        if (feasible === "Yes" && canLink && inputVal && outputVal) {
            const canonicalId = canLink[0].name; // FIX: linked record returns array; was canLink.name (undefined)
            const key = `${canonicalId}|${sanitizeRaw(inputVal).toUpperCase()}`;
            stdEngine[key] = outputVal.trim();
            stdLoaded++;
        }
    }
    output.markdown(`✅ Engine loaded: **${stdLoaded}** active rules.`);

    // ---------------------------------------------------------
    // 2. Load PR Staging Records
    // ---------------------------------------------------------
    const stagingQuery = await stagingTable.selectRecordsAsync({
        fields: [
            S_SUPPLIER_SKU, S_IMPORT_TYPE, S_ETL_STATUS, S_RETAIL_EXCL,
            S_NO_FACES, S_THICKNESS, S_PEI_CLASS, S_SLIP_RATING, S_BODY_TYPE, S_BODY_FINISH
        ]
    });
    const prRecords = stagingQuery.records.filter(r => 
        r.getCellValueAsString(S_ETL_STATUS) === "pending" &&
        r.getCellValueAsString(S_IMPORT_TYPE).toUpperCase().startsWith("PR")
    );
    
    if (prRecords.length === 0) {
        output.markdown("No pending PR records found. Exiting.");
        return;
    }

    // ---------------------------------------------------------
    // 3. Load SPD, PM, and PB Indexes
    // ---------------------------------------------------------
    const spdQuery = await spdTable.selectRecordsAsync({ fields: [SPD_DATA_ID, SPD_RETAIL_EXCL, SPD_SUPPLIER_LINK, SPD_PM_LINK] });
    const spdIndex = {};
    for (const rec of spdQuery.records) {
        const key = rec.getCellValueAsString(SPD_DATA_ID).trim().toUpperCase();
        if (key) spdIndex[key] = rec;
    }

    const pmQuery = await pmTable.selectRecordsAsync({
        fields: [PM_UOM_LINK, PM_PRICING_LINK, PM_NO_FACES, PM_THICKNESS, PM_PEI_CLASS, PM_SLIP_RATING, PM_BODY_TYPE, PM_BODY_FINISH]
    });
    const pmIndex = {};
    const pmUomIndex = {};
    for (const rec of pmQuery.records) {
        pmIndex[rec.id] = rec;
        const uomLinks = rec.getCellValue(PM_UOM_LINK) || [];
        if (uomLinks.length > 0) pmUomIndex[rec.id] = uomLinks[0].id; // FIX: was uomLinks.id — array has no .id property
    }

    const pbQuery = await pbTable.selectRecordsAsync({ fields: [PB_PRODUCT_SKU, PB_PRICE_TYPE, PB_SUP_SKU, PB_COST, PB_PRICE_STATUS] });
    const pbIndex = {};
    for (const rec of pbQuery.records) {
        const pmLinks = rec.getCellValue(PB_PRODUCT_SKU) || [];
        const pt = rec.getCellValueAsString(PB_PRICE_TYPE);
        if (pmLinks.length > 0 && pt) pbIndex[`${pmLinks[0].id}|${pt.toLowerCase()}`] = rec; // FIX: was pmLinks.id
    }

    // ---------------------------------------------------------
    // 4. Processing Loop
    // ---------------------------------------------------------
    output.markdown("## Step 2: Processing Pricing & Specs...");
    
    const stagingUpdates = [], pbUpdates = [], pbCreates = [], pmUpdates = [], adminNotes = [];
    let cPbUpdates = 0, cPbCreates = 0, cPmUpdates = 0;

    for (const stagingRec of prRecords) {
        const rawSku = stagingRec.getCellValueAsString(S_SUPPLIER_SKU).trim();
        const normKey = normSku(rawSku);
        const spdRec = spdIndex[normKey];

        if (!spdRec) {
            stagingUpdates.push({ id: stagingRec.id, fields: { [S_ETL_STATUS]: { name: "failed" } } });
            continue;
        }

        const pmLinks = spdRec.getCellValue(SPD_PM_LINK) || [];
        if (pmLinks.length === 0) {
            stagingUpdates.push({ id: stagingRec.id, fields: { [S_ETL_STATUS]: { name: "failed" } } });
            continue;
        }

        const pmId = pmLinks[0].id; // FIX: was pmLinks.id
        const pmRec = pmIndex[pmId];

        // ---- PRICING ROUTING ----
        const rawType = stagingRec.getCellValueAsString(S_IMPORT_TYPE);
        let priceType = "Standard";
        if (rawType.toLowerCase().includes("sample supplier")) priceType = "Sample supplier-charged";
        else if (rawType.toLowerCase().includes("sample")) priceType = "Sample";

        const retailExcl = stagingRec.getCellValue(S_RETAIL_EXCL);
        const supplierLinks = spdRec.getCellValue(SPD_SUPPLIER_LINK) || [];
        const uomId = pmUomIndex[pmId] || null;

        const pbFields = {};
        if (retailExcl !== null) pbFields[PB_COST] = retailExcl;
        pbFields[PB_PRICE_TYPE] = { name: priceType };
        pbFields[PB_PRICE_STATUS] = { name: "Active" };
        pbFields[PB_PRODUCT_SKU] = [{ id: pmId }];
        pbFields[PB_SRP_INCL] = [{ id: spdRec.id }];
        if (supplierLinks.length > 0) pbFields[PB_SUPPLIER] = [{ id: supplierLinks[0].id }]; // FIX: was supplierLinks.id
        if (uomId) pbFields[PB_UOM] = [{ id: uomId }];

        const pbKey = `${pmId}|${priceType.toLowerCase()}`;
        const existingPB = pbIndex[pbKey];

        if (existingPB) {
            pbUpdates.push({ id: existingPB.id, fields: pbFields });
            cPbUpdates++;
        } else {
            pbCreates.push({ fields: pbFields });
            cPbCreates++;
        }

        // ---- SPEC SANITISATION ROUTING ----
        const pmPayload = {};
        const warnings = [];

        // 1. Quantitative fields (Numeric Parser)
        const parsedThick = parseNumeric(stagingRec.getCellValueAsString(S_THICKNESS));
        if (parsedThick !== null) {
            const nsThick = pmNullSafe(pmRec, PM_THICKNESS, parsedThick);
            if (nsThick !== null) pmPayload[PM_THICKNESS] = nsThick;
        }

        const parsedFaces = parseNumeric(stagingRec.getCellValueAsString(S_NO_FACES));
        if (parsedFaces !== null && parsedFaces >= 1) {
            const nsFaces = pmNullSafe(pmRec, PM_NO_FACES, parsedFaces);
            if (nsFaces !== null) pmPayload[PM_NO_FACES] = nsFaces;
        }

        // 2. Qualitative fields (Standardization Engine Lookup)
        const stdSpecs = [
            { fld: S_PEI_CLASS,   pmFld: PM_PEI_CLASS,   canId: "300", name: "PEI Class" },
            { fld: S_SLIP_RATING, pmFld: PM_SLIP_RATING, canId: "304", name: "Slip Rating" },
            { fld: S_BODY_TYPE,   pmFld: PM_BODY_TYPE,   canId: "296", name: "Body Type" },
            { fld: S_BODY_FINISH, pmFld: PM_BODY_FINISH, canId: "362", name: "Body Finish" }
        ];

        for (const spec of stdSpecs) {
            const rawVal = stagingRec.getCellValue(spec.fld);
            if (rawVal) {
                const result = translateValue(stdEngine, spec.canId, rawVal, spec.name);
                if (result.warning) warnings.push(result.warning);
                
                // Only write if matched cleanly in engine
                if (result.value && !result.warning) { 
                    const nsVal = pmNullSafe(pmRec, spec.pmFld, { name: result.value });
                    if (nsVal !== null) pmPayload[spec.pmFld] = nsVal;
                }
            }
        }

        if (Object.keys(pmPayload).length > 0) {
            pmUpdates.push({ id: pmId, fields: pmPayload });
            cPmUpdates++;
        }

        if (warnings.length > 0) {
            adminNotes.push({ fields: {
                [AL_NOTES]: `Script 2B Spec Warnings for ${rawSku}:\n` + warnings.join("\n"),
                [AL_ANOMALY_TYPE]: { name: "Missing_Data" },
                [AL_SEVERITY]: { name: "Info" },
                [AL_DETECTED_VALUE]: rawSku.substring(0, 200),
            }});
        }

        stagingUpdates.push({ id: stagingRec.id, fields: { [S_ETL_STATUS]: { name: "processed" } } });
    }

    // ---------------------------------------------------------
    // 5. Commit Writes
    // ---------------------------------------------------------
    if (!DRY_RUN) {
        output.markdown("## Step 3: Writing to Airtable...");
        if (pbCreates.length > 0) for (const b of chunk(pbCreates, 50)) await pbTable.createRecordsAsync(b);
        if (pbUpdates.length > 0) for (const b of chunk(pbUpdates, 50)) await pbTable.updateRecordsAsync(b);
        if (pmUpdates.length > 0) for (const b of chunk(pmUpdates, 50)) await pmTable.updateRecordsAsync(b);
        if (stagingUpdates.length > 0) for (const b of chunk(stagingUpdates, 50)) await stagingTable.updateRecordsAsync(b);
        if (adminNotes.length > 0) for (const b of chunk(adminNotes, 50)) await adminLogs.createRecordsAsync(b);
    }

    output.markdown("---");
    output.markdown("## ✅ Run Complete");
    output.markdown(`- **PB Created:** ${cPbCreates}`);
    output.markdown(`- **PB Updated:** ${cPbUpdates}`);
    output.markdown(`- **PM Specs Updated:** ${cPmUpdates}`);
    output.markdown(`- **Warnings Logged:** ${adminNotes.length}`);
}

await main();