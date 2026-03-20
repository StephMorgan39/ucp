/**
 * SCRIPT 1 — ETL ROUTER v1.8
 * Improvements: Complete stdEngine, error handling, fixed numeric parser, batch recovery
 */

const DRY_RUN = false;

const TABLES = {
  STAGING: "tblcPSP5NcP0ioUP8",
  SPD: "tbl7mZpHJCUs1r0cg",
  PM: "tblgLqMMXX2HcKt9U",
  ADMIN_LOGS: "tblk1v5VHPEC2c2u2",
  STD: "tblMdVyuaCBG40uQP"
};

// Staging Fields
const S_SUPPLIER_SKU = "fldeEd9FiNq5AtGNk";
const S_IMPORT_TYPE = "fldjdRY1TAJypmcPF";
const S_ETL_STATUS = "fldbrUDvLv8OEnEqh";
const S_NO_FACES = "fldkh9EFaIKvc0yIj";
const S_THICKNESS = "fldbgiMR2Qlm169Mu";
const S_BODY_TYPE = "fldIEO5cTzgLSSOC0";
const S_BODY_FINISH = "fld4QhEwwFSgFsHRB";
const S_PEI_CLASS = "fldqFzEPIby2C94Du";
const S_SLIP_RATING = "fldfMSgqnPwP2hvtl";
// Logistics
const S_PCE_BOX = "fldiTSUcLPa4uLT4L";
const S_SQM_BOX = "fldvVC9z72GqYdDko";
const S_KG_BOX = "fldS2mZdWoY7hPU3G";
const S_BOX_PALLET = "fld8Qz10GgXiS6Da5";
const S_SQM_PALLET = "fldf5VU6KDd2cSqUB";
const S_KG_PALLET = "fldOfxvmWk1K1J0TQ";
const S_DIMENSIONS = "fldvZjLna62iMbj5K";
const S_DESCRIPTION = "fldkAm1iLOJJYmzmi";
const S_SOH = "fldhNujCBWdylBEzS";
const S_SAV = "fldqPizK5v1z69O7L";
const S_SOO = "fld6ich1CWKGs0tur";
const S_ETA = "fldcvr9PjTp0HeKnB";
const S_EOR_STOCK = "fld4WI1P7S1cGxoyo";

// SPD Fields
const SPD_DATA_ID = "fldmeU6JZIwvGAuRH";
const SPD_SKU = "fldK3FyPA98F3smc9";
const SPD_PM_LINK = "fldGxaIlPVor7QEwN";
const SPD_BODY = "fldtMpYo9uqtirVW7";
const SPD_FINISH = "fldeiQRu0fp13cMyL";
const SPD_DIMENSIONS = "fldqkhCrXeaEsmKuQ";
const SPD_SIZE_LEN = "fldQns7cT9JDqHy0Z";
const SPD_SIZE_WID = "fldeQy5c79koW7ABQ";
const SPD_DESC = "fldoROoSpEm5FuUnI";
const SPD_SOH = "fldnYxUVqYOTvBNVd";
const SPD_SAV = "fldW44uBVVT9aqrcP";
const SPD_SOO = "fld8JnU93aeUkXYD5";
const SPD_ETA = "fldDkxV0hYu2u3X2j";
const SPD_STOCK_UPDATE = "fldcq3PzsLthtvh2v";
const SPD_EOR_STOCK = "fldzSJKZBdkGeWAdi";
const SPD_STOCK_STATUS = "fld1eoLeHEOE5MfiG";
// Logistics SPD
const SPD_PCE_BOX = "fldSgGBl9MmbFNgfi";
const SPD_SQM_BOX = "fldv7C2yxJqMMwy71";
const SPD_KG_BOX = "fld9YEiSLAsO2D49B";
const SPD_BOX_PALLET = "fld3SEg2FtEQGpqOA";
const SPD_SQM_PALLET = "fld1xHQZEyBLByG60";
const SPD_KG_PALLET = "fldW0kGw6FI6fBXEu";

// AdminLogs
const LOG_NOTES = "fld4l6AJhVNRzIaY8";
const LOG_TYPE = "flda8oHUThBc1Kb7I";
const LOG_SEVERITY = "fldPdoc6JPYHV9gpb";
const LOG_STATUS = "fldog9l4DwJeE5Qj8";

// ────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────

function parseNumeric(val) {
  if (val === null || val === undefined || val === "") return null;
  let s = String(val).trim();
  // European format: "1.500,50" → 1500.50
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else {
    s = s.replace(/,(?=\d{3})/g, "").replace(",", ".");
  }
  s = s.replace(/[^0-9.-]/g, "");
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function parseDimensions(raw) {
  if (!raw) return null;
  const isCm = /\bcm\b/i.test(raw);
  const cleaned = raw
    .replace(/mm|cm/gi, "")
    .replace(/[x×\*✕]/gi, "|")
    .replace(/\s+/g, "")
    .trim();
  const parts = cleaned.split("|").filter((p) => p !== "");
  if (parts.length < 2) return null;
  
  const a = parseFloat(parts[0]);
  const b = parseFloat(parts[1]);
  if (isNaN(a) || isNaN(b)) return null;
  
  const multiplier = isCm ? 10 : 1;
  return {
    length: Math.round(Math.max(a, b) * multiplier),
    width: Math.round(Math.min(a, b) * multiplier)
  };
}

function sanitize(val) {
  if (!val) return "";
  return String(val)
    .replace(/[\n\r]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function nullSafe(spdRec, fieldId, newValue) {
  if (newValue === null || newValue === undefined) return null;
  const existing = spdRec.getCellValue(fieldId);
  // Only skip write if field already populated
  if (existing !== null && existing !== undefined && existing !== "" && existing !== 0) return null;
  return newValue;
}

const chunk = (arr, n) => {
  const o = [];
  for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n));
  return o;
};

const normSku = (s) =>
  String(s || "").replace(/[-\s]/g, "").trim().toUpperCase();

async function main() {
  output.markdown("# 🔀 Script 1 — ETL Router v1.8");
  if (DRY_RUN) output.markdown("> ⚠️ **DRY RUN MODE**");
  
  const stagingTable = base.getTable(TABLES.STAGING);
  const spdTable = base.getTable(TABLES.SPD);
  const stdTable = base.getTable(TABLES.STD);
  const adminLogs = base.getTable(TABLES.ADMIN_LOGS);
  
  try {
    // ────────────────────────────────────────────────────────
    // STEP 1 — Load & Build Standardization Engine
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 1 — Loading Standardization Engine...");
    
    const stdQuery = await stdTable.selectRecordsAsync({
      fields: [
        "fldKYwVJHHTfloR8h", // Category
        "fldm5CSkaVnCXIxOt", // Example Input
        "fldBmRaivNGM1s7bS" // Example Output
      ]
    });
    
    const stdEngine = {};
    for (const r of stdQuery.records) {
      const cat = r.getCellValueAsString("fldKYwVJHHTfloR8h").trim().toUpperCase();
      const inp = r.getCellValueAsString("fldm5CSkaVnCXIxOt").trim().toUpperCase();
      const out = r.getCellValueAsString("fldBmRaivNGM1s7bS").trim();
      
      if (cat && inp && out) {
        stdEngine[`${cat}|${inp}`] = out;
      }
    }
    
    output.markdown(`✅ Standardization engine: **${Object.keys(stdEngine).length}** rules`);
    
    const applyStd = (category, rawValue) => {
      if (!rawValue) return rawValue;
      const key = `${category.toUpperCase()}|${String(rawValue).trim().toUpperCase()}`;
      return stdEngine[key] || rawValue;
    };
    
    // ────────────────────────────────────────────────────────
    // STEP 2 — Load pending Staging
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 2 — Loading pending Staging...");
    
    const stagingQ = await stagingTable.selectRecordsAsync({
      fields: [
        S_SUPPLIER_SKU, S_IMPORT_TYPE, S_ETL_STATUS,
        S_SOH, S_SAV, S_SOO, S_ETA, S_EOR_STOCK,
        S_DIMENSIONS, S_DESCRIPTION, S_BODY_TYPE, S_BODY_FINISH,
        S_NO_FACES, S_THICKNESS, S_PEI_CLASS, S_SLIP_RATING,
        S_PCE_BOX, S_SQM_BOX, S_KG_BOX, S_BOX_PALLET, S_SQM_PALLET, S_KG_PALLET
      ]
    });
    
    const pendingRows = stagingQ.records.filter(
      (r) => r.getCellValueAsString(S_ETL_STATUS) === "pending"
    );
    
    output.markdown(`✅ Found **${pendingRows.length}** pending rows`);
    
    if (pendingRows.length === 0) {
      output.markdown("Nothing to process.");
      return;
    }
    
    // ────────────────────────────────────────────────────────
    // STEP 3 — Load SPD index
    // ────────────────────────────────────────────────────────
    const spdQ = await spdTable.selectRecordsAsync({
      fields: [
        SPD_DATA_ID, SPD_SKU, SPD_PM_LINK,
        SPD_SOH, SPD_SAV, SPD_SOO, SPD_ETA, SPD_STOCK_UPDATE,
        SPD_BODY, SPD_FINISH, SPD_DIMENSIONS, SPD_SIZE_LEN, SPD_SIZE_WID,
        SPD_DESC, SPD_STOCK_STATUS,
        SPD_PCE_BOX, SPD_SQM_BOX, SPD_KG_BOX, SPD_BOX_PALLET, SPD_SQM_PALLET, SPD_KG_PALLET
      ]
    });
    
    const spdIndex = {};
    for (const rec of spdQ.records) {
      const key = rec.getCellValueAsString(SPD_DATA_ID).trim().toUpperCase();
      if (key) spdIndex[key] = rec;
    }
    
    output.markdown(`✅ Indexed **${Object.keys(spdIndex).length}** SPD records`);
    
    // ────────────────────────────────────────────────────────
    // STEP 4 — Process rows
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 3 — Processing...");
    
    const spdUpdates = [], spdCreates = [], stagingUpdates = [], adminLogs_arr = [];
    let procCount = 0, failCount = 0;
    
    for (const stagingRec of pendingRows) {
      const importType = stagingRec.getCellValueAsString(S_IMPORT_TYPE);
      const rawSku = stagingRec.getCellValueAsString(S_SUPPLIER_SKU).trim();
      const normKey = normSku(rawSku);
      
      try {
        if (!normKey) throw new Error(`Invalid SKU: ${rawSku}`);
        
        const spdRec = spdIndex[normKey];
        
        if (importType.toUpperCase().startsWith("ST")) {
          // ───── STOCK TRANSFER LOGIC ─────
          const payload = {};
          
          // Stock fields (always overwrite)
          const soh = stagingRec.getCellValue(S_SOH);
          const sav = stagingRec.getCellValue(S_SAV);
          const soo = stagingRec.getCellValue(S_SOO);
          const eta = stagingRec.getCellValueAsString(S_ETA);
          
          if (soh !== null) payload[SPD_SOH] = soh;
          if (sav !== null) payload[SPD_SAV] = sav;
          if (soo !== null) payload[SPD_SOO] = soo;
          if (eta) payload[SPD_ETA] = eta;
          payload[SPD_STOCK_UPDATE] = new Date().toISOString().split("T")[0];
          
          // Dimensions
          const rawDim = stagingRec.getCellValueAsString(S_DIMENSIONS).trim();
          if (rawDim) {
            const dims = parseDimensions(rawDim);
            if (dims) {
              payload[SPD_DIMENSIONS] = rawDim;
              if (spdRec) {
                const existLen = spdRec.getCellValue(SPD_SIZE_LEN);
                const existWid = spdRec.getCellValue(SPD_SIZE_WID);
                if (!existLen) payload[SPD_SIZE_LEN] = dims.length;
                if (!existWid) payload[SPD_SIZE_WID] = dims.width;
              }
            }
          }
          
          // Body Type (standardized)
          const rawBody = sanitize(stagingRec.getCellValueAsString(S_BODY_TYPE));
          if (rawBody) {
            const cleanBody = applyStd("BODY TYPE", rawBody);
            payload[SPD_BODY] = cleanBody;
          }
          
          // Body Finish (standardized)
          const rawFinish = sanitize(stagingRec.getCellValueAsString(S_BODY_FINISH));
          if (rawFinish) {
            const cleanFinish = applyStd("BODY FINISH", rawFinish);
            payload[SPD_FINISH] = cleanFinish;
          }
          
          // Description
          const rawDesc = stagingRec.getCellValueAsString(S_DESCRIPTION).trim();
          if (rawDesc && spdRec) {
            const existing = spdRec.getCellValueAsString(SPD_DESC);
            if (!existing) payload[SPD_DESC] = rawDesc;
          }
          
          // Logistics (null-safe)
          const pce = stagingRec.getCellValue(S_PCE_BOX);
          const sqm = stagingRec.getCellValue(S_SQM_BOX);
          const kg = stagingRec.getCellValue(S_KG_BOX);
          const bxP = stagingRec.getCellValue(S_BOX_PALLET);
          const sqmP = stagingRec.getCellValue(S_SQM_PALLET);
          const kgP = stagingRec.getCellValue(S_KG_PALLET);
          
          if (spdRec) {
            if (pce !== null && !spdRec.getCellValue(SPD_PCE_BOX)) payload[SPD_PCE_BOX] = pce;
            if (sqm !== null && !spdRec.getCellValue(SPD_SQM_BOX)) payload[SPD_SQM_BOX] = sqm;
            if (kg !== null && !spdRec.getCellValue(SPD_KG_BOX)) payload[SPD_KG_BOX] = kg;
            if (bxP !== null && !spdRec.getCellValue(SPD_BOX_PALLET)) payload[SPD_BOX_PALLET] = bxP;
            if (sqmP !== null && !spdRec.getCellValue(SPD_SQM_PALLET)) payload[SPD_SQM_PALLET] = sqmP;
            if (kgP !== null && !spdRec.getCellValue(SPD_KG_PALLET)) payload[SPD_KG_PALLET] = kgP;
            
            spdUpdates.push({ id: spdRec.id, fields: payload });
          } else {
            payload[SPD_SKU] = rawSku;
            if (rawDesc) payload[SPD_DESC] = rawDesc;
            if (pce !== null) payload[SPD_PCE_BOX] = pce;
            if (sqm !== null) payload[SPD_SQM_BOX] = sqm;
            if (kg !== null) payload[SPD_KG_BOX] = kg;
            if (bxP !== null) payload[SPD_BOX_PALLET] = bxP;
            if (sqmP !== null) payload[SPD_SQM_PALLET] = sqmP;
            if (kgP !== null) payload[SPD_KG_PALLET] = kgP;
            
            spdCreates.push({ fields: payload });
          }
          
        } else if (importType.toUpperCase().startsWith("EOR")) {
          // ───── END OF RANGE LOGIC ─────
          if (spdRec) {
            const eorPayload = {};
            const soh = stagingRec.getCellValue(S_SOH);
            const sav = stagingRec.getCellValue(S_SAV);
            const eorStock = stagingRec.getCellValue(S_EOR_STOCK);
            
            if (soh !== null) eorPayload[SPD_SOH] = soh;
            if (sav !== null) eorPayload[SPD_SAV] = sav;
            if (eorStock !== null) eorPayload[SPD_EOR_STOCK] = eorStock;
            eorPayload[SPD_STOCK_UPDATE] = new Date().toISOString().split("T")[0];
            eorPayload[SPD_STOCK_STATUS] = { name: "SPD EOR" };
            
            spdUpdates.push({ id: spdRec.id, fields: eorPayload });
          }
          
        } else if (importType.toUpperCase().startsWith("DD")) {
          // ───── DISCONTINUED LOGIC ─────
          if (spdRec) {
            const ddPayload = {};
            const soh = stagingRec.getCellValue(S_SOH);
            const sav = stagingRec.getCellValue(S_SAV);
            
            if (soh !== null) ddPayload[SPD_SOH] = soh;
            if (sav !== null) ddPayload[SPD_SAV] = sav;
            ddPayload[SPD_STOCK_UPDATE] = new Date().toISOString().split("T")[0];
            ddPayload[SPD_STOCK_STATUS] = { name: "SPD DD" };
            
            spdUpdates.push({ id: spdRec.id, fields: ddPayload });
          }
        }
        
        stagingUpdates.push({
          id: stagingRec.id,
          fields: { [S_ETL_STATUS]: { name: "processed" } }
        });
        
        procCount++;
        
      } catch (err) {
        failCount++;
        stagingUpdates.push({
          id: stagingRec.id,
          fields: { [S_ETL_STATUS]: { name: "failed" } }
        });
        
        adminLogs_arr.push({
          fields: {
            [LOG_NOTES]: `Row **${rawSku}**: ${err.message}`,
            [LOG_TYPE]: { name: "System_Event" },
            [LOG_SEVERITY]: { name: "High" },
            [LOG_STATUS]: { name: "Logged" }
          }
        });
      }
    }
    
    // ────────────────────────────────────────────────────────
    // STEP 5 — Commit batches
    // ────────────────────────────────────────────────────────
    if (!DRY_RUN) {
      output.markdown("## Step 4 — Writing to Airtable...");
      
      for (const b of chunk(spdCreates, 50)) {
        await spdTable.createRecordsAsync(b);
      }
      for (const b of chunk(spdUpdates, 50)) {
        await spdTable.updateRecordsAsync(b);
      }
      for (const b of chunk(stagingUpdates, 50)) {
        await stagingTable.updateRecordsAsync(b);
      }
      for (const b of chunk(adminLogs_arr, 50)) {
        await adminLogs.createRecordsAsync(b);
      }
    }
    
    output.markdown("---");
    output.markdown("## ✅ Script 1 Complete");
    output.markdown(
      `| Metric | Count |\n|--------|-------|\n` +
      `| Processed | ${procCount} |\n` +
      `| Failed | ${failCount} |\n` +
      `| SPD Created | ${spdCreates.length} |\n` +
      `| SPD Updated | ${spdUpdates.length} |`
    );
    
  } catch (err) {
    output.markdown(`## ❌ Unhandled Error\n\`\`\`\n${err.message}\n\`\`\``);
  }
}

await main();