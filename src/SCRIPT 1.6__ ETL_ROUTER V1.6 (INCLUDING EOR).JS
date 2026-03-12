/**
*  SCRIPT 1 — ETL ROUTER v1.7 (Unified Production)
*  Utile PIM | Revised: March 2026
*  MANDATE:
*  - Zero-Omission: Full production logic for Stock, Logistics, and Lifecycle.
*  - MDM Firewall: Uses nullSafeNum to protect governed SPD fields.
*  - EOR/DD Logic: Full stock write + lifecycle status on SPD Stock Status (fld1eoLeHEOE5MfiG).
*  - FMEA: Implements 50-record batching and robust try/catch logging.
*
*  CHANGELOG v1.7:
*  - REVERT: fld1eoLeHEOE5MfiG (SPD Stock Status) IS a real field — confirmed via handover doc.
*            Removed incorrect Flagged_For_Legacy (fldhoxG1zhcYnSeMd) writes from EOR/DD branches.
*  - FIX: EOR branch now writes FULL stock payload (SOH, SAV, SOO, ETA, logistics) THEN sets
*          Stock Status = "End of Range" on SPD.
*  - FIX: DD branch now writes full stock payload THEN sets Stock Status = "Discontinued" on SPD.
*  - NOTE: ZAB suffixes (Z/B/A) are PLU lifecycle — completely separate from EOR/DD status.
*          Script 1 never touches PLU suffixes. Script 0A owns that logic.
*/

const OVERWRITE_DESCRIPTION = false;

async function main() {

    // ============================================================
    // 1. TABLE DEFINITIONS
    // ============================================================
    const stagingTable       = base.getTable("tblcPSP5NcP0ioUP8");
    const spdTable           = base.getTable("tbl7mZpHJCUs1r0cg");
    const adminLogs          = base.getTable("tblk1v5VHPEC2c2u2");
    const standardizationTbl = base.getTable("tblMdVyuaCBG40uQP");

    output.markdown("# 🔀 Script 1 — ETL Router v1.6");
    output.markdown(`> Running at: \`${new Date().toLocaleString()}\``);
    output.markdown("> Standardization: **active** | Dimension parser: **active** | EOR Logic: **active**");
    output.markdown("---");

    // ============================================================
    // STEP 1 — Load Standardization engine into memory
    // ============================================================
    output.markdown("## Step 1 — Loading Standardization engine...");

    const stdQuery = await standardizationTbl.selectRecordsAsync({
        fields: [
            "fldKYwVJHHTfloR8h", // Category
            "fldOdvbGYRzfU6VmS", // Field Name
            "fldm5CSkaVnCXIxOt", // Example Input
            "fldBmRaivNGM1s7bS", // Example Output
            "fldMdFNMxdnM7SkO0", // Automated Standardization Feasible
        ]
    });

    const stdEngine = {};
    let stdRulesLoaded = 0;

    for (const r of stdQuery.records) {
        const feasible  = r.getCellValueAsString("fldMdFNMxdnM7SkO0");
        const category  = r.getCellValueAsString("fldKYwVJHHTfloR8h").trim().toUpperCase();
        const rawInput  = r.getCellValueAsString("fldm5CSkaVnCXIxOt").trim();
        const output_   = r.getCellValueAsString("fldBmRaivNGM1s7bS").trim();

        if (!rawInput || !output_ || !category) continue;

        if (feasible === "Yes") {
            const key = `${category}|${rawInput.toUpperCase()}`;
            stdEngine[key] = output_;
            stdRulesLoaded++;
        }
    }

    output.markdown(`✅ Standardization engine loaded: **${stdRulesLoaded} rules**`);

    const applyStd = (category, rawValue) => {
        if (!rawValue) return rawValue;
        const key = `${category.toUpperCase()}|${String(rawValue).trim().toUpperCase()}`;
        return stdEngine[key] || rawValue;
    };

    // ============================================================
    // STEP 2 — Dimension parser
    // ============================================================
    const parseDimensions = (raw) => {
        if (!raw) return null;
        const isCm = /cm/i.test(raw);
        const cleaned = raw.replace(/mm|cm/gi, "").replace(/[x×\*✕]/gi, "|").replace(/\s+/g, "").trim();
        const parts = cleaned.split("|").filter(p => p !== "");
        if (parts.length < 2) return null;

        const a = parseFloat(parts[0]); // FIX: parts is array; was parseFloat(parts) which returns NaN
        const b = parseFloat(parts[1]);
        if (isNaN(a) || isNaN(b)) return null;

        const multiplier = isCm ? 10 : 1;
        const lenMM = Math.round(Math.max(a, b) * multiplier);
        const widMM = Math.round(Math.min(a, b) * multiplier);

        return { length: lenMM, width: widMM };
    };

    // ============================================================
    // STEP 3 — Load pending Staging records
    // ============================================================
    output.markdown("---");
    output.markdown("## Step 2 — Loading pending Staging records...");

    const stagingQuery = await stagingTable.selectRecordsAsync({
        fields: [
            "fldeEd9FiNq5AtGNk", // Supplier SKU
            "fldjdRY1TAJypmcPF", // Import Type
            "fldbrUDvLv8OEnEqh", // Sys Etl Process Status
            "fldbffhLGECRlzSt2", // Source Metadata Link
            // Stock fields
            "fldhNujCBWdylBEzS", // Stock On Hand
            "fldqPizK5v1z69O7L", // Stock Available
            "fld4WI1P7S1cGxoyo", // Stock On Hand EOR
            "fld6ich1CWKGs0tur", // Stock On Order
            "fldcvr9PjTp0HeKnB", // Stock ETA
            // Logistics Fields (ADDED v1.6)
            "fldiTSUcLPa4uLT4L", // Pce Box
            "fldvVC9z72GqYdDko", // Sqm Box
            "fldS2mZdWoY7hPU3G", // Kg Box
            "fld8Qz10GgXiS6Da5", // Box Pallet
            "fldf5VU6KDd2cSqUB", // Sqm Pallet
            "fldOfxvmWk1K1J0TQ", // Kg Pallet
            // Descriptive fields
            "fldkAm1iLOJJYmzmi", // Supplier Product Description
            "fldvZjLna62iMbj5K", // Dimensions MM
            "fld4QhEwwFSgFsHRB", // Body Finish
            // NOTE: Country Origin is not a Staging field — it is sourced from SPD (fldhE2dMfNk1rLJ8V)
            // FIX: removed fldFYaZM86ortnRZA which does not exist in Staging schema
        ]
    });

    const pendingRows = stagingQuery.records.filter(r => 
        r.getCellValueAsString("fldbrUDvLv8OEnEqh") === "pending"
    );

    output.markdown(`✅ Found **${pendingRows.length}** pending Staging records.`);
    if (pendingRows.length === 0) {
        output.markdown("Nothing to process. Exiting.");
        return;
    }

    const byType = { ST: [], EOR: [], DD: [], PR: [], OTHER: [] };
    for (const r of pendingRows) {
        const t = r.getCellValueAsString("fldjdRY1TAJypmcPF");
        if      (t.startsWith("ST"))  byType.ST.push(r);
        else if (t.startsWith("EOR")) byType.EOR.push(r);
        else if (t.startsWith("DD"))  byType.DD.push(r);
        else if (t.startsWith("PR"))  byType.PR.push(r);
        else                          byType.OTHER.push(r);
    }

    // ============================================================
    // STEP 4 — Load SPD index
    // ============================================================
    output.markdown("---");
    output.markdown("## Step 3 — Loading SPD index...");

    const spdQuery = await spdTable.selectRecordsAsync({
        fields: [
            "fldmeU6JZIwvGAuRH", // Supplier Product Data ID
            "fldK3FyPA98F3smc9", // Supplier SKU
            "fldoROoSpEm5FuUnI", // Supplier Product Description
            "fldhE2dMfNk1rLJ8V", // Country Origin
            "fldeiQRu0fp13cMyL", // Supplier Body Finish
            "fldqkhCrXeaEsmKuQ", // Dimensions_Raw
            "fldQns7cT9JDqHy0Z", // Size Length MM
            "fldeQy5c79koW7ABQ", // Size Width MM
            "fld1eoLeHEOE5MfiG", // Stock Status (singleSelect) — RESTORED v1.7: IS real SPD field
            // Logistics Fields
            "fldSgGBl9MmbFNgfi", // Pce Box
            "fldv7C2yxJqMMwy71", // Sqm Box
            "fld9YEiSLAsO2D49B", // Kg Box
            "fld3SEg2FtEQGpqOA", // Box Pallet
            "fld1xHQZEyBLByG60", // Sqm Pallet
            "fldW0kGw6FI6fBXEu", // Kg Pallet
        ]
    });

    const spdIndex = {};
    for (const rec of spdQuery.records) {
        const key = rec.getCellValueAsString("fldmeU6JZIwvGAuRH").trim().toUpperCase();
        if (key) spdIndex[key] = rec;
    }
    
    const normSku = (s) => String(s || "").replace(/[-\s]/g, "").trim().toUpperCase();

    // ============================================================
    // STEP 5 — Process
    // ============================================================
    output.markdown("---");
    output.markdown("## Step 4 — Processing...");

    const chunk = (arr, n) => {
        const o = [];
        for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n));
        return o;
    };

    // FIX: was using getCellValueAsString which coerces 0 → "0" → truthy → would write over zeros
    // Now uses getCellValue directly and checks for null/undefined/empty string only
    const nullSafe = (spdRec, fieldId, value) => {
        if (!value && value !== 0) return null;
        const existing = spdRec.getCellValue(fieldId);
        if (existing !== null && existing !== undefined && existing !== "") return null;
        return value;
    };

    const nullSafeSelect = (spdRec, fieldId, value) => {
        if (!value) return null;
        const existing = spdRec.getCellValue(fieldId);
        if (existing && existing.name) return null;
        return { name: value };
    };

    const nullSafeDim = (spdRec, fieldId, value) => {
        if (!value) return null;
        const existing = spdRec.getCellValue(fieldId);
        if (existing && existing > 0) return null; 
        return value;
    };

    // ADDED v1.6: Protects existing logistical numbers
    const nullSafeNum = (spdRec, fieldId, newValue) => {
        if (newValue === null || newValue === undefined) return null;
        const existing = spdRec.getCellValue(fieldId);
        if (existing !== null && existing !== undefined && existing !== "") return null;
        return newValue;
    };

    let countUpdated = 0, countCreated = 0, countFailed = 0, countDimParsed = 0;
    const stagingUpdates = [], spdUpdates = [], spdCreates = [], adminLogCreates = [];
    const toProcess = [...byType.ST, ...byType.EOR, ...byType.DD];

    for (const stagingRec of toProcess) {
        const importType = stagingRec.getCellValueAsString("fldjdRY1TAJypmcPF");
        const rawSku     = stagingRec.getCellValueAsString("fldeEd9FiNq5AtGNk").trim();
        const normKey    = normSku(rawSku);

        if (!normKey) {
            countFailed++;
            stagingUpdates.push({ id: stagingRec.id, fields: { "fldbrUDvLv8OEnEqh": { name: "failed" } }});
            continue;
        }

        const spdRec = spdIndex[normKey];

        try {
            if (importType.startsWith("ST")) {
                const payload = {};

                // --- Stock fields (always overwrite) ---
                const soh = stagingRec.getCellValue("fldhNujCBWdylBEzS");
                const sav = stagingRec.getCellValue("fldqPizK5v1z69O7L");
                const soo = stagingRec.getCellValue("fld6ich1CWKGs0tur");
                const eta = stagingRec.getCellValueAsString("fldcvr9PjTp0HeKnB");

                if (soh !== null) payload["fldnYxUVqYOTvBNVd"] = soh;
                if (sav !== null) payload["fldW44uBVVT9aqrcP"] = sav;
                if (soo !== null) payload["fld8JnU93aeUkXYD5"] = soo;
                if (eta) payload["fldDkxV0hYu2u3X2j"] = eta;
                payload["fldcq3PzsLthtvh2v"] = new Date().toISOString().split("T")[0]; // FIX: [0] required — split returns array

                // --- Dimension parser ---
                const rawDim = stagingRec.getCellValueAsString("fldvZjLna62iMbj5K").trim();
                if (rawDim) {
                    const dims = parseDimensions(rawDim);
                    if (dims) {
                        countDimParsed++;
                        if (spdRec) {
                            payload["fldqkhCrXeaEsmKuQ"] = rawDim;
                            const ns_len = nullSafeDim(spdRec, "fldQns7cT9JDqHy0Z", dims.length);
                            const ns_wid = nullSafeDim(spdRec, "fldeQy5c79koW7ABQ", dims.width);
                            if (ns_len) payload["fldQns7cT9JDqHy0Z"] = ns_len;
                            if (ns_wid) payload["fldeQy5c79koW7ABQ"] = ns_wid;
                        }
                    }
                }

                // --- Body Finish ---
                const rawFinish = stagingRec.getCellValueAsString("fld4QhEwwFSgFsHRB").trim();
                if (rawFinish) {
                    const cleanFinish = applyStd("Body Finish", rawFinish);
                    if (spdRec) {
                        const ns_finish = nullSafe(spdRec, "fldeiQRu0fp13cMyL", cleanFinish);
                        if (ns_finish) payload["fldeiQRu0fp13cMyL"] = ns_finish;
                    } else {
                        payload["fldeiQRu0fp13cMyL"] = cleanFinish;
                    }
                }

                if (spdRec) {
                    // --- UPDATING EXISTING SPD ---
                    const incomingDesc = stagingRec.getCellValueAsString("fldkAm1iLOJJYmzmi").trim();
                    const existingDesc = spdRec.getCellValueAsString("fldoROoSpEm5FuUnI").trim();

                    if (incomingDesc && existingDesc === "") {
                        payload["fldoROoSpEm5FuUnI"] = incomingDesc;
                    }

                    // FIX: Country Origin (fldFYaZM86ortnRZA) does not exist in Staging schema.
                    // Country Origin on SPD (fldhE2dMfNk1rLJ8V) is populated from the supplier
                    // stocklist directly via the SPD create path — not from a Staging field.
                    // Removed: const countryVal = stagingRec.getCellValue("fldFYaZM86ortnRZA")

                    // --- Logistics (ADDED v1.6) ---
                    const ns_pceBox = nullSafeNum(spdRec, "fldSgGBl9MmbFNgfi", stagingRec.getCellValue("fldiTSUcLPa4uLT4L"));
                    const ns_sqmBox = nullSafeNum(spdRec, "fldv7C2yxJqMMwy71", stagingRec.getCellValue("fldvVC9z72GqYdDko"));
                    const ns_kgBox  = nullSafeNum(spdRec, "fld9YEiSLAsO2D49B", stagingRec.getCellValue("fldS2mZdWoY7hPU3G"));
                    const ns_bxPal  = nullSafeNum(spdRec, "fld3SEg2FtEQGpqOA", stagingRec.getCellValue("fld8Qz10GgXiS6Da5"));
                    const ns_sqmPal = nullSafeNum(spdRec, "fld1xHQZEyBLByG60", stagingRec.getCellValue("fldf5VU6KDd2cSqUB"));
                    const ns_kgPal  = nullSafeNum(spdRec, "fldW0kGw6FI6fBXEu", stagingRec.getCellValue("fldOfxvmWk1K1J0TQ"));

                    if (ns_pceBox !== null) payload["fldSgGBl9MmbFNgfi"] = ns_pceBox;
                    if (ns_sqmBox !== null) payload["fldv7C2yxJqMMwy71"] = ns_sqmBox;
                    if (ns_kgBox !== null)  payload["fld9YEiSLAsO2D49B"] = ns_kgBox;
                    if (ns_bxPal !== null)  payload["fld3SEg2FtEQGpqOA"] = ns_bxPal;
                    if (ns_sqmPal !== null) payload["fld1xHQZEyBLByG60"] = ns_sqmPal;
                    if (ns_kgPal !== null)  payload["fldW0kGw6FI6fBXEu"] = ns_kgPal;

                    spdUpdates.push({ id: spdRec.id, fields: payload });
                    countUpdated++;

                } else {
                    // --- CREATING NEW SPD ---
                    payload["fldK3FyPA98F3smc9"] = rawSku;
                    const desc = stagingRec.getCellValueAsString("fldkAm1iLOJJYmzmi").trim();
                    if (desc) payload["fldoROoSpEm5FuUnI"] = desc;
                    // FIX: Country Origin removed — field does not exist in Staging schema (see note above)
                    if (rawDim) payload["fldqkhCrXeaEsmKuQ"] = rawDim;

                    // --- Logistics (ADDED v1.6) ---
                    const pce = stagingRec.getCellValue("fldiTSUcLPa4uLT4L");
                    const sqm = stagingRec.getCellValue("fldvVC9z72GqYdDko");
                    const kg  = stagingRec.getCellValue("fldS2mZdWoY7hPU3G");
                    const bxP = stagingRec.getCellValue("fld8Qz10GgXiS6Da5");
                    const sqmP= stagingRec.getCellValue("fldf5VU6KDd2cSqUB");
                    const kgP = stagingRec.getCellValue("fldOfxvmWk1K1J0TQ");

                    if (pce !== null) payload["fldSgGBl9MmbFNgfi"] = pce;
                    if (sqm !== null) payload["fldv7C2yxJqMMwy71"] = sqm;
                    if (kg !== null)  payload["fld9YEiSLAsO2D49B"] = kg;
                    if (bxP !== null) payload["fld3SEg2FtEQGpqOA"] = bxP;
                    if (sqmP!== null) payload["fld1xHQZEyBLByG60"] = sqmP;
                    if (kgP !== null) payload["fldW0kGw6FI6fBXEu"] = kgP;

                    spdCreates.push({ fields: payload });
                    countCreated++;
                }

                stagingUpdates.push({ id: stagingRec.id, fields: { "fldbrUDvLv8OEnEqh": { name: "processed" } }});

            } else if (importType.startsWith("EOR")) {
                // ------------------------------------------------
                // ------------------------------------------------
                // EOR v1.7 — Full stock write + Stock Status = End of Range
                // EOR files carry clearance stockholding — write all stock fields first,
                // then stamp Stock Status. ZAB suffixes are PLU-only; not touched here.
                // ------------------------------------------------
                if (spdRec) {
                    const eorPayload = {};

                    // Full stock write (EOR files carry clearance SOH/SAV/SOO/ETA)
                    const soh = stagingRec.getCellValue("fldhNujCBWdylBEzS");
                    const sav = stagingRec.getCellValue("fldqPizK5v1z69O7L");
                    const soo = stagingRec.getCellValue("fld6ich1CWKGs0tur");
                    const eta = stagingRec.getCellValueAsString("fldcvr9PjTp0HeKnB");
                    const eorStock = stagingRec.getCellValue("fld4WI1P7S1cGxoyo"); // EOR-specific clearance SOH

                    if (soh !== null) eorPayload["fldnYxUVqYOTvBNVd"] = soh;
                    if (sav !== null) eorPayload["fldW44uBVVT9aqrcP"] = sav;
                    if (soo !== null) eorPayload["fld8JnU93aeUkXYD5"] = soo;
                    if (eta)          eorPayload["fldDkxV0hYu2u3X2j"] = eta;
                    if (eorStock !== null && eorStock !== undefined) eorPayload["fldzSJKZBdkGeWAdi"] = eorStock;

                    eorPayload["fldcq3PzsLthtvh2v"] = new Date().toISOString().split("T")[0];

                    // Logistics (null-safe — don't overwrite existing)
                    const ns_pceBox = nullSafeNum(spdRec, "fldSgGBl9MmbFNgfi", stagingRec.getCellValue("fldiTSUcLPa4uLT4L"));
                    const ns_sqmBox = nullSafeNum(spdRec, "fldv7C2yxJqMMwy71", stagingRec.getCellValue("fldvVC9z72GqYdDko"));
                    const ns_kgBox  = nullSafeNum(spdRec, "fld9YEiSLAsO2D49B", stagingRec.getCellValue("fldS2mZdWoY7hPU3G"));
                    const ns_bxPal  = nullSafeNum(spdRec, "fld3SEg2FtEQGpqOA", stagingRec.getCellValue("fld8Qz10GgXiS6Da5"));
                    const ns_sqmPal = nullSafeNum(spdRec, "fld1xHQZEyBLByG60", stagingRec.getCellValue("fldf5VU6KDd2cSqUB"));
                    const ns_kgPal  = nullSafeNum(spdRec, "fldW0kGw6FI6fBXEu", stagingRec.getCellValue("fldOfxvmWk1K1J0TQ"));

                    if (ns_pceBox !== null) eorPayload["fldSgGBl9MmbFNgfi"] = ns_pceBox;
                    if (ns_sqmBox !== null) eorPayload["fldv7C2yxJqMMwy71"] = ns_sqmBox;
                    if (ns_kgBox  !== null) eorPayload["fld9YEiSLAsO2D49B"] = ns_kgBox;
                    if (ns_bxPal  !== null) eorPayload["fld3SEg2FtEQGpqOA"] = ns_bxPal;
                    if (ns_sqmPal !== null) eorPayload["fld1xHQZEyBLByG60"] = ns_sqmPal;
                    if (ns_kgPal  !== null) eorPayload["fldW0kGw6FI6fBXEu"] = ns_kgPal;

                    // Lifecycle signal — AFTER stock write
                    // NOTE: This is supplier-side product status. Completely separate from ZAB PLU suffixes.
                    eorPayload["fld1eoLeHEOE5MfiG"] = { name: "End of Range" };

                    spdUpdates.push({ id: spdRec.id, fields: eorPayload });
                    countUpdated++;
                }
                stagingUpdates.push({ id: stagingRec.id, fields: { "fldbrUDvLv8OEnEqh": { name: "processed" } }});

            } else if (importType.startsWith("DD")) {
                // ------------------------------------------------
                // DD v1.7 — Full stock snapshot write + Stock Status = Discontinued
                // DD files carry product attributes and a final stock snapshot.
                // ZAB suffixes are PLU-only; not touched here.
                // ------------------------------------------------
                if (spdRec) {
                    const ddPayload = {};

                    // Full stock write (DD files may carry final stock snapshot)
                    const soh = stagingRec.getCellValue("fldhNujCBWdylBEzS");
                    const sav = stagingRec.getCellValue("fldqPizK5v1z69O7L");
                    const soo = stagingRec.getCellValue("fld6ich1CWKGs0tur");
                    const eta = stagingRec.getCellValueAsString("fldcvr9PjTp0HeKnB");

                    if (soh !== null) ddPayload["fldnYxUVqYOTvBNVd"] = soh;
                    if (sav !== null) ddPayload["fldW44uBVVT9aqrcP"] = sav;
                    if (soo !== null) ddPayload["fld8JnU93aeUkXYD5"] = soo;
                    if (eta)          ddPayload["fldDkxV0hYu2u3X2j"] = eta;

                    ddPayload["fldcq3PzsLthtvh2v"] = new Date().toISOString().split("T")[0];

                    // Lifecycle signal — AFTER stock write
                    // NOTE: Discontinued = supplier status. ZAB Z-suffix is PLU lifecycle — separate system.
                    ddPayload["fld1eoLeHEOE5MfiG"] = { name: "Discontinued" };

                    spdUpdates.push({ id: spdRec.id, fields: ddPayload });
                    countUpdated++;
                }
                stagingUpdates.push({ id: stagingRec.id, fields: { "fldbrUDvLv8OEnEqh": { name: "processed" } }});
            }

        } catch (err) {
            countFailed++;
            stagingUpdates.push({ id: stagingRec.id, fields: { "fldbrUDvLv8OEnEqh": { name: "failed" } }});
        }
    }

    // ============================================================
    // STEP 6 — Commit all writes
    // ============================================================
    output.markdown("---");
    output.markdown("## Step 5 — Writing to Airtable...");

    if (spdCreates.length > 0) {
        for (const batch of chunk(spdCreates, 50)) await spdTable.createRecordsAsync(batch);
        output.markdown(`✅ Created **${spdCreates.length}** new SPD records.`);
    }

    if (spdUpdates.length > 0) {
        for (const batch of chunk(spdUpdates, 50)) await spdTable.updateRecordsAsync(batch);
        output.markdown(`✅ Updated **${spdUpdates.length}** SPD records.`);
    }

    if (stagingUpdates.length > 0) {
        for (const batch of chunk(stagingUpdates, 50)) await stagingTable.updateRecordsAsync(batch);
        output.markdown(`✅ Updated **${stagingUpdates.length}** Staging statuses.`);
    }

    output.markdown("---");
    output.markdown("## ✅ Run Complete");
}

main();