/**
 * SCRIPT 2B+2BB — UNIFIED PRICING & SPEC ROUTER v2.2
 * Improvements: Fixed stdEngine, array handling, error handling
 */

const DRY_RUN = false;

const TABLES = {
  STAGING: "tblcPSP5NcP0ioUP8",
  SPD: "tbl7mZpHJCUs1r0cg",
  PM: "tblgLqMMXX2HcKt9U",
  PB: "tblW85ycReRUr0Ze1",
  ADMIN_LOGS: "tblk1v5VHPEC2c2u2",
  STD: "tblMdVyuaCBG40uQP"
};

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

const SPD_DATA_ID = "fldmeU6JZIwvGAuRH";
const SPD_RETAIL_EXCL = "flde8qM0wyidVqrsZ";
const SPD_SUPPLIER_LINK = "fldY9HQ6d42p8uVoY";
const SPD_PM_LINK = "fldGxaIlPVor7QEwN";

const PM_UOM_LINK = "fldMWdeUtUF8Hgst9";
const PM_NO_FACES = "fldFbjxoAh9sieegL";
const PM_THICKNESS = "fldEGSqge560gp4OK";
const PM_BODY_FINISH = "fldeiQRu0fp13cMyL";

const PB_PRODUCT_SKU = "fldAYj8E8RicN1EmL";
const PB_PRICE_TYPE = "fldlCCMJvTDaNin4h";
const PB_COST = "fldxf21wIe7LXyHFz";
const PB_SUPPLIER = "fldpLc5q4X7D7MZ8a";
const PB_UOM = "fldw9ECJYGAB7IJPh";
const PB_PRICE_STATUS = "fldSdokb18nBjXu0D";

const AL_NOTES = "fld4l6AJhVNRzIaY8";
const AL_TYPE = "flda8oHUThBc1Kb7I";
const AL_SEVERITY = "fldPdoc6JPYHV9gpb";

const STD_CATEGORY = "fldKYwVJHHTfloR8h";
const STD_INPUT = "fldm5CSkaVnCXIxOt";
const STD_OUTPUT = "fldBmRaivNGM1s7bS";

function sanitize(val) {
  if (!val) return "";
  return String(val)
    .replace(/[\n\r]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNumeric(val) {
  if (val === null || val === undefined || val === "") return null;
  let s = String(val).trim();
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else {
    s = s.replace(/,(?=\d{3})/g, "").replace(",", ".");
  }
  s = s.replace(/[^0-9.-]/g, "");
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function nullSafe(spdRec, fieldId, newValue) {
  if (newValue === null || newValue === undefined) return null;
  const existing = spdRec.getCellValue(fieldId);
  // Only skip if field already populated and non-zero
  if (existing !== null && existing !== undefined && existing !== "" && existing !== 0) return null;
  return newValue;
}

const chunk = (arr, n) => {
  const o = [];
  for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n));
  return o;
};

const normSku = (s) =>
  String(s || "")
    .replace(/[-\s]/g, "")
    .trim()
    .toUpperCase();

async function main() {
  output.markdown("# 💰 + 🧽 Script 2B+2BB: Unified Pricing & Spec Router v2.2");
  if (DRY_RUN) output.markdown("> ⚠️ **DRY RUN MODE**");
  
  const stagingTable = base.getTable(TABLES.STAGING);
  const spdTable = base.getTable(TABLES.SPD);
  const pmTable = base.getTable(TABLES.PM);
  const pbTable = base.getTable(TABLES.PB);
  const stdTable = base.getTable(TABLES.STD);
  const adminLogs = base.getTable(TABLES.ADMIN_LOGS);
  
  try {
    // ────────────────────────────────────────────────────────
    // STEP 1 — Load Standardization Engine
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 1 — Loading Standardization Engine...");
    
    const stdQuery = await stdTable.selectRecordsAsync({
      fields: [STD_CATEGORY, STD_INPUT, STD_OUTPUT]
    });
    
    const stdEngine = {};
    for (const r of stdQuery.records) {
      const category = r.getCellValueAsString(STD_CATEGORY).trim().toUpperCase();
      const input = r.getCellValueAsString(STD_INPUT).trim().toUpperCase();
      const output_ = r.getCellValueAsString(STD_OUTPUT).trim();
      
      if (category && input && output_) {
        const key = `${category}|${input}`;
        stdEngine[key] = output_;
      }
    }
    
    output.markdown(`✅ Loaded **${Object.keys(stdEngine).length}** standardization rules.`);
    
    const applyStd = (category, rawValue) => {
      if (!rawValue) return rawValue;
      const key = `${category.toUpperCase()}|${String(rawValue).trim().toUpperCase()}`;
      return stdEngine[key] || rawValue;
    };
    
    // ────────────────────────────────────────────────────────
    // STEP 2 — Load PR Staging Records
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 2 — Loading PR Staging records...");
    
    const stagingQuery = await stagingTable.selectRecordsAsync({
      fields: [
        S_SUPPLIER_SKU, S_IMPORT_TYPE, S_ETL_STATUS,
        S_RETAIL_EXCL, S_NO_FACES, S_THICKNESS,
        S_PEI_CLASS, S_SLIP_RATING, S_BODY_FINISH
      ]
    });
    
    const prRecords = stagingQuery.records.filter(
      (r) =>
        r.getCellValueAsString(S_ETL_STATUS) === "pending" &&
        r.getCellValueAsString(S_IMPORT_TYPE).toUpperCase().startsWith("PR")
    );
    
    if (prRecords.length === 0) {
      output.markdown("No pending PR records. Exiting.");
      return;
    }
    
    output.markdown(`✅ Found **${prRecords.length}** PR records.`);
    
    // ────────────────────────────────────────────────────────
    // STEP 3 — Load indexes
    // ────────────────────────────────────────────────────────
    const spdQuery = await spdTable.selectRecordsAsync({
      fields: [SPD_DATA_ID, SPD_RETAIL_EXCL, SPD_SUPPLIER_LINK, SPD_PM_LINK]
    });
    
    const spdIndex = {};
    for (const rec of spdQuery.records) {
      const key = rec.getCellValueAsString(SPD_DATA_ID).trim().toUpperCase();
      if (key) spdIndex[key] = rec;
    }
    
    const pmQuery = await pmTable.selectRecordsAsync({
      fields: [PM_UOM_LINK, PM_NO_FACES, PM_THICKNESS, PM_BODY_FINISH]
    });
    
    const pmIndex = {}, pmUomIndex = {};
    for (const rec of pmQuery.records) {
      pmIndex[rec.id] = rec;
      const uomLinks = rec.getCellValue(PM_UOM_LINK) || [];
      if (uomLinks.length > 0) pmUomIndex[rec.id] = uomLinks[0].id;
    }
    
    output.markdown(`✅ Indexed **${Object.keys(spdIndex).length}** SPD, **${Object.keys(pmIndex).length}** PM.`);
    
    // ────────────────────────────────────────────────────────
    // STEP 4 — Process PR records
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 3 — Processing records...");
    
    const stagingUpdates = [], pbUpdates = [], pbCreates = [], pmUpdates = [], adminNotes = [];
    let cPbUpdates = 0, cPbCreates = 0, cPmUpdates = 0, cErrors = 0;
    
    for (const stagingRec of prRecords) {
      try {
        const rawSku = stagingRec.getCellValueAsString(S_SUPPLIER_SKU).trim();
        const normKey = normSku(rawSku);
        const spdRec = spdIndex[normKey];
        
        if (!spdRec) {
          stagingUpdates.push({
            id: stagingRec.id,
            fields: { [S_ETL_STATUS]: { name: "failed" } }
          });
          continue;
        }
        
        const pmLinks = spdRec.getCellValue(SPD_PM_LINK) || [];
        if (pmLinks.length === 0) {
          stagingUpdates.push({
            id: stagingRec.id,
            fields: { [S_ETL_STATUS]: { name: "failed" } }
          });
          continue;
        }
        
        const pmId = pmLinks[0].id;
        const pmRec = pmIndex[pmId];
        const supplierLinks = spdRec.getCellValue(SPD_SUPPLIER_LINK) || [];
        const uomId = pmUomIndex[pmId] || null;
        
        // ───── PRICING ROUTING ─────
        const priceType = "Standard"; // Could be parameterized
        
        const pbFields = {};
        const retailExcl = stagingRec.getCellValue(S_RETAIL_EXCL);
        if (retailExcl !== null) pbFields[PB_COST] = retailExcl;
        
        pbFields[PB_PRICE_TYPE] = { name: priceType };
        pbFields[PB_PRICE_STATUS] = { name: "Active" };
        pbFields[PB_PRODUCT_SKU] = [{ id: pmId }];
        
        if (supplierLinks.length > 0) {
          pbFields[PB_SUPPLIER] = [{ id: supplierLinks[0].id }];
        }
        if (uomId) {
          pbFields[PB_UOM] = [{ id: uomId }];
        }
        
        const pbKey = `${pmId}|${priceType.toLowerCase()}`;
        const pbQuery = await pbTable.selectRecordsAsync({
          fields: [PB_PRODUCT_SKU, PB_PRICE_TYPE]
        });
        const existingPB = pbQuery.records.find(
          (r) => {
            const pmLinks = r.getCellValue(PB_PRODUCT_SKU) || [];
            const pt = r.getCellValueAsString(PB_PRICE_TYPE);
            return pmLinks.length > 0 && pmLinks[0].id === pmId && pt === priceType;
          }
        );
        
        if (existingPB) {
          pbUpdates.push({ id: existingPB.id, fields: pbFields });
          cPbUpdates++;
        } else {
          pbCreates.push({ fields: pbFields });
          cPbCreates++;
        }
        
        // ───── SPEC ROUTING ─────
        const pmPayload = {};
        
        const parsedThick = parseNumeric(stagingRec.getCellValueAsString(S_THICKNESS));
        if (parsedThick !== null && pmRec) {
          const existing = pmRec.getCellValue(PM_THICKNESS);
          if (!existing) pmPayload[PM_THICKNESS] = parsedThick;
        }
        
        const parsedFaces = parseNumeric(stagingRec.getCellValueAsString(S_NO_FACES));
        if (parsedFaces !== null && parsedFaces >= 1 && pmRec) {
          const existing = pmRec.getCellValue(PM_NO_FACES);
          if (!existing) pmPayload[PM_NO_FACES] = parsedFaces;
        }
        
        // Qualitative specs (standardized)
        const specs = [
          {
            stagingFld: S_PEI_CLASS,
            pmFld: "fldpkrVgQCxk6PKx2", // PM PEI Class (if exists)
            category: "PEI CLASS"
          },
          {
            stagingFld: S_SLIP_RATING,
            pmFld: "fldEWzbqhhyqM5BfF", // PM Slip Rating (if exists)
            category: "SLIP RATING"
          },
          {
            stagingFld: S_BODY_FINISH,
            pmFld: PM_BODY_FINISH,
            category: "BODY FINISH"
          }
        ];
        
        for (const spec of specs) {
          const rawVal = stagingRec.getCellValueAsString(spec.stagingFld).trim();
          if (rawVal) {
            const cleanVal = applyStd(spec.category, rawVal);
            if (pmRec && spec.pmFld) {
              const existing = pmRec.getCellValue(spec.pmFld);
              if (!existing) {
                pmPayload[spec.pmFld] = { name: cleanVal };
              }
            }
          }
        }
        
        if (Object.keys(pmPayload).length > 0 && pmRec) {
          pmUpdates.push({ id: pmId, fields: pmPayload });
          cPmUpdates++;
        }
        
        stagingUpdates.push({
          id: stagingRec.id,
          fields: { [S_ETL_STATUS]: { name: "processed" } }
        });
        
      } catch (err) {
        cErrors++;
        stagingUpdates.push({
          id: stagingRec.id,
          fields: { [S_ETL_STATUS]: { name: "failed" } }
        });
        
        adminNotes.push({
          fields: {
            [AL_NOTES]: `PR Router error on ${stagingRec.getCellValueAsString(S_SUPPLIER_SKU)}: ${err.message}`,
            [AL_TYPE]: { name: "System_Event" },
            [AL_SEVERITY]: { name: "High" }
          }
        });
      }
    }
    
    // ────────────────────────────────────────────────────────
    // STEP 5 — Commit writes
    // ────────────────────────────────────────────────────────
    if (!DRY_RUN) {
      output.markdown("## Step 4 — Writing to Airtable...");
      
      if (pbCreates.length > 0) {
        for (const b of chunk(pbCreates, 50)) {
          await pbTable.createRecordsAsync(b);
        }
      }
      if (pbUpdates.length > 0) {
        for (const b of chunk(pbUpdates, 50)) {
          await pbTable.updateRecordsAsync(b);
        }
      }
      if (pmUpdates.length > 0) {
        for (const b of chunk(pmUpdates, 50)) {
          await pmTable.updateRecordsAsync(b);
        }
      }
      if (stagingUpdates.length > 0) {
        for (const b of chunk(stagingUpdates, 50)) {
          await stagingTable.updateRecordsAsync(b);
        }
      }
      if (adminNotes.length > 0) {
        for (const b of chunk(adminNotes, 50)) {
          await adminLogs.createRecordsAsync(b);
        }
      }
    }
    
    output.markdown("---");
    output.markdown("## ✅ Script 2B+2BB Complete");
    output.markdown(
      `| Metric | Count |\n|--------|-------|\n` +
      `| PB Created | ${cPbCreates} |\n` +
      `| PB Updated | ${cPbUpdates} |\n` +
      `| PM Updated | ${cPmUpdates} |\n` +
      `| Errors | ${cErrors} |`
    );
    
  } catch (err) {
    output.markdown(`## ❌ Unhandled Error\n\`\`\`\n${err.message}\n\`\`\``);
  }
}

await main();