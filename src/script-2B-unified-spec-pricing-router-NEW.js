/**
 * SCRIPT 2B — UNIFIED PRICING & SPEC ROUTER v2.3 (Automation Safe)
 * Changes from v2.2:
 *   - output.markdown() replaced with log() helper (works in automation + UI)
 *   - PricingBridge duplicate check moved outside inner row loop (was causing
 *     a selectRecordsAsync call per row — performance fix)
 */

// ─────────────────────────────────────────────────────────
// LOG HELPER — works in both script UI and automation mode
// ─────────────────────────────────────────────────────────
const log = (msg) => {
  try { output.markdown(msg); } catch(_) {}
  console.log(String(msg).replace(/\*\*/g, '').replace(/`/g, '').replace(/#+\s/g, ''));
};

const DRY_RUN = false;

const TABLES = {
  STAGING:    "tblcPSP5NcP0ioUP8",
  SPD:        "tbl7mZpHJCUs1r0cg",
  PM:         "tblgLqMMXX2HcKt9U",
  PB:         "tblW85ycReRUr0Ze1",
  ADMIN_LOGS: "tblk1v5VHPEC2c2u2",
  STD:        "tblMdVyuaCBG40uQP"
};

const S_SUPPLIER_SKU = "fldeEd9FiNq5AtGNk";
const S_IMPORT_TYPE  = "fldjdRY1TAJypmcPF";
const S_ETL_STATUS   = "fldbrUDvLv8OEnEqh";
const S_RETAIL_EXCL  = "fldHDkQCH8jKeJZ7g";
const S_NO_FACES     = "fldkh9EFaIKvc0yIj";
const S_THICKNESS    = "fldbgiMR2Qlm169Mu";
const S_PEI_CLASS    = "fldqFzEPIby2C94Du";
const S_SLIP_RATING  = "fldfMSgqnPwP2hvtl";
const S_BODY_FINISH  = "fld4QhEwwFSgFsHRB";

const SPD_DATA_ID      = "fldmeU6JZIwvGAuRH";
const SPD_RETAIL_EXCL  = "flde8qM0wyidVqrsZ";
const SPD_SUPPLIER     = "fldY9HQ6d42p8uVoY";
const SPD_PM_LINK      = "fldGxaIlPVor7QEwN";

const PM_UOM_LINK    = "fldMWdeUtUF8Hgst9";
const PM_NO_FACES    = "fldFbjxoAh9sieegL";
const PM_THICKNESS   = "fldEGSqge560gp4OK";
const PM_BODY_FINISH = "fldeiQRu0fp13cMyL";

const PB_PRODUCT_SKU  = "fldAYj8E8RicN1EmL";
const PB_PRICE_TYPE   = "fldlCCMJvTDaNin4h";
const PB_COST         = "fldxf21wIe7LXyHFz";
const PB_SUPPLIER     = "fldpLc5q4X7D7MZ8a";
const PB_UOM          = "fldw9ECJYGAB7IJPh";
const PB_PRICE_STATUS = "fldSdokb18nBjXu0D";

const AL_NOTES    = "fld4l6AJhVNRzIaY8";
const AL_TYPE     = "flda8oHUThBc1Kb7I";
const AL_SEVERITY = "fldPdoc6JPYHV9gpb";
const AL_STATUS   = "fldog9l4DwJeE5Qj8";

const STD_CATEGORY = "fldKYwVJHHTfloR8h";
const STD_INPUT    = "fldm5CSkaVnCXIxOt";
const STD_OUTPUT   = "fldBmRaivNGM1s7bS";

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

const chunk = (arr, n) => {
  const o = [];
  for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n));
  return o;
};

const normSku = s => String(s || "").replace(/[-\s]/g, "").trim().toUpperCase();

async function main() {
  log("# Script 2B — Unified Pricing & Spec Router v2.3");
  if (DRY_RUN) log("> DRY RUN MODE");

  const stagingTable = base.getTable(TABLES.STAGING);
  const spdTable     = base.getTable(TABLES.SPD);
  const pmTable      = base.getTable(TABLES.PM);
  const pbTable      = base.getTable(TABLES.PB);
  const stdTable     = base.getTable(TABLES.STD);
  const adminLogs    = base.getTable(TABLES.ADMIN_LOGS);

  try {
    // ── Step 1: Standardization Engine ─────────────────────
    log("## Step 1 — Loading Standardization Engine...");

    const stdQuery = await stdTable.selectRecordsAsync({
      fields: [STD_CATEGORY, STD_INPUT, STD_OUTPUT]
    });

    const stdEngine = {};
    for (const r of stdQuery.records) {
      const cat = r.getCellValueAsString(STD_CATEGORY).trim().toUpperCase();
      const inp = r.getCellValueAsString(STD_INPUT).trim().toUpperCase();
      const out = r.getCellValueAsString(STD_OUTPUT).trim();
      if (cat && inp && out) stdEngine[`${cat}|${inp}`] = out;
    }

    log(`✅ Loaded ${Object.keys(stdEngine).length} standardization rules.`);

    const applyStd = (category, rawValue) => {
      if (!rawValue) return rawValue;
      const key = `${category.toUpperCase()}|${String(rawValue).trim().toUpperCase()}`;
      return stdEngine[key] || rawValue;
    };

    // ── Step 2: Load PR Staging rows ───────────────────────
    log("## Step 2 — Loading PR Staging rows...");

    const stagingQ = await stagingTable.selectRecordsAsync({
      fields: [
        S_SUPPLIER_SKU, S_IMPORT_TYPE, S_ETL_STATUS,
        S_RETAIL_EXCL, S_NO_FACES, S_THICKNESS,
        S_PEI_CLASS, S_SLIP_RATING, S_BODY_FINISH
      ]
    });

    const prRecords = stagingQ.records.filter(
      r => r.getCellValueAsString(S_ETL_STATUS) === "pending" &&
           r.getCellValueAsString(S_IMPORT_TYPE).toUpperCase().startsWith("PR")
    );

    if (prRecords.length === 0) {
      log("No pending PR records found. This script only processes pricelist imports (Import Type = PR).");
      return;
    }
    log(`✅ Found ${prRecords.length} PR records.`);

    // ── Step 3: Load indexes ────────────────────────────────
    log("## Step 3 — Loading SPD, PM, and PricingBridge indexes...");

    const spdQ = await spdTable.selectRecordsAsync({
      fields: [SPD_DATA_ID, SPD_RETAIL_EXCL, SPD_SUPPLIER, SPD_PM_LINK]
    });
    const spdIndex = {};
    for (const rec of spdQ.records) {
      const key = rec.getCellValueAsString(SPD_DATA_ID).trim().toUpperCase();
      if (key) spdIndex[key] = rec;
    }

    const pmQ = await pmTable.selectRecordsAsync({
      fields: [PM_UOM_LINK, PM_NO_FACES, PM_THICKNESS, PM_BODY_FINISH]
    });
    const pmIndex = {}, pmUomIndex = {};
    for (const rec of pmQ.records) {
      pmIndex[rec.id] = rec;
      const uomLinks = rec.getCellValue(PM_UOM_LINK) || [];
      if (uomLinks.length > 0) pmUomIndex[rec.id] = uomLinks[0].id;
    }

    // FIX v2.3: Load entire PricingBridge ONCE (not per row)
    const pbQ = await pbTable.selectRecordsAsync({
      fields: [PB_PRODUCT_SKU, PB_PRICE_TYPE]
    });
    // Build index: "pmId|priceType" → PB record id
    const pbIndex = {};
    for (const rec of pbQ.records) {
      const pmLinks  = rec.getCellValue(PB_PRODUCT_SKU) || [];
      const pt       = rec.getCellValueAsString(PB_PRICE_TYPE).toLowerCase();
      if (pmLinks.length > 0 && pt) pbIndex[`${pmLinks[0].id}|${pt}`] = rec.id;
    }

    log(`✅ Indexed ${Object.keys(spdIndex).length} SPD | ${Object.keys(pmIndex).length} PM | ${Object.keys(pbIndex).length} PB`);

    // ── Step 4: Process PR rows ─────────────────────────────
    log("## Step 4 — Processing records...");

    const stagingUpdates = [], pbUpdates = [], pbCreates = [], pmUpdates = [], adminNotes = [];
    let cPbUpdates = 0, cPbCreates = 0, cPmUpdates = 0, cErrors = 0;

    for (const stagingRec of prRecords) {
      try {
        const rawSku  = stagingRec.getCellValueAsString(S_SUPPLIER_SKU).trim();
        const normKey = normSku(rawSku);
        const spdRec  = spdIndex[normKey];

        if (!spdRec) {
          stagingUpdates.push({ id: stagingRec.id, fields: { [S_ETL_STATUS]: { name: "failed" } } });
          continue;
        }

        const pmLinks      = spdRec.getCellValue(SPD_PM_LINK) || [];
        if (pmLinks.length === 0) {
          stagingUpdates.push({ id: stagingRec.id, fields: { [S_ETL_STATUS]: { name: "failed" } } });
          continue;
        }

        const pmId          = pmLinks[0].id;
        const pmRec         = pmIndex[pmId];
        const supplierLinks = spdRec.getCellValue(SPD_SUPPLIER) || [];
        const uomId         = pmUomIndex[pmId] || null;
        const priceType     = "Standard";

        // ── Pricing write ───────────────────────────────────
        const pbFields = {};
        const retailExcl = stagingRec.getCellValue(S_RETAIL_EXCL);
        if (retailExcl !== null) pbFields[PB_COST] = retailExcl;
        pbFields[PB_PRICE_TYPE]   = { name: priceType };
        pbFields[PB_PRICE_STATUS] = { name: "Active" };
        pbFields[PB_PRODUCT_SKU]  = [{ id: pmId }];
        if (supplierLinks.length > 0) pbFields[PB_SUPPLIER] = [{ id: supplierLinks[0].id }];
        if (uomId)                    pbFields[PB_UOM]      = [{ id: uomId }];

        const pbKey        = `${pmId}|${priceType.toLowerCase()}`;
        const existingPBId = pbIndex[pbKey];

        if (existingPBId) {
          pbUpdates.push({ id: existingPBId, fields: pbFields });
          cPbUpdates++;
        } else {
          pbCreates.push({ fields: pbFields });
          cPbCreates++;
        }

        // ── Spec writes (null-safe) ─────────────────────────
        if (pmRec) {
          const pmPayload = {};

          const parsedThick = parseNumeric(stagingRec.getCellValueAsString(S_THICKNESS));
          if (parsedThick !== null && !pmRec.getCellValue(PM_THICKNESS)) {
            pmPayload[PM_THICKNESS] = parsedThick;
          }

          const parsedFaces = parseNumeric(stagingRec.getCellValueAsString(S_NO_FACES));
          if (parsedFaces !== null && parsedFaces >= 1 && !pmRec.getCellValue(PM_NO_FACES)) {
            pmPayload[PM_NO_FACES] = parsedFaces;
          }

          const rawFinish = stagingRec.getCellValueAsString(S_BODY_FINISH).trim();
          if (rawFinish && !pmRec.getCellValue(PM_BODY_FINISH)) {
            pmPayload[PM_BODY_FINISH] = { name: applyStd("BODY FINISH", rawFinish) };
          }

          if (Object.keys(pmPayload).length > 0) {
            pmUpdates.push({ id: pmId, fields: pmPayload });
            cPmUpdates++;
          }
        }

        stagingUpdates.push({ id: stagingRec.id, fields: { [S_ETL_STATUS]: { name: "processed" } } });

      } catch (err) {
        cErrors++;
        stagingUpdates.push({ id: stagingRec.id, fields: { [S_ETL_STATUS]: { name: "failed" } } });
        adminNotes.push({ fields: {
          [AL_NOTES]:    `Script 2B error — ${stagingRec.getCellValueAsString(S_SUPPLIER_SKU)}: ${err.message}`,
          [AL_TYPE]:     { name: "System_Event" },
          [AL_SEVERITY]: { name: "High" },
          [AL_STATUS]:   { name: "Logged" }
        }});
      }
    }

    // ── Step 5: Commit writes ───────────────────────────────
    if (!DRY_RUN) {
      log("## Step 5 — Writing to Airtable...");
      if (pbCreates.length)      for (const b of chunk(pbCreates, 50))      await pbTable.createRecordsAsync(b);
      if (pbUpdates.length)      for (const b of chunk(pbUpdates, 50))      await pbTable.updateRecordsAsync(b);
      if (pmUpdates.length)      for (const b of chunk(pmUpdates, 50))      await pmTable.updateRecordsAsync(b);
      if (stagingUpdates.length) for (const b of chunk(stagingUpdates, 50)) await stagingTable.updateRecordsAsync(b);
      if (adminNotes.length)     for (const b of chunk(adminNotes, 50))     await adminLogs.createRecordsAsync(b);
    }

    log("---");
    log("## Script 2B Complete");
    log(`PricingBridge created: ${cPbCreates}`);
    log(`PricingBridge updated: ${cPbUpdates}`);
    log(`PM specs updated: ${cPmUpdates}`);
    log(`Errors: ${cErrors}`);
    if (DRY_RUN) log("DRY RUN — no data was written.");

  } catch (err) {
    log(`## UNHANDLED ERROR: ${err.message}`);
    console.error(err.stack);
  }
}

await main();