/**
 * SCRIPT 1 — ETL ROUTER v2.2
 * Utile PIM | Base: appefUQrLFZYN4Y5t
 *
 * CHANGES FROM v2.1:
 *   - AVAILABLE guardrail added (isSuspectAvailable)
 *     For existing products: if the incoming AVAILABLE value is within 0.1%
 *     of the product's current SRP ex, it's a Decobella price placeholder —
 *     skip the write and log a warning.
 *     For new SKUs: write the value through (no SRP ex to compare against yet),
 *     but append a note to the new product SystemLog entry flagging the figure
 *     for Nina's attention when she enriches the product.
 *   - SPD_SRP_EX field constant added (needed for the comparison)
 *   - countAvailableWarnings metric added to summary table
 */

// ─────────────────────────────────────────────────────────
// LOG HELPER — works in both script UI and automation mode
// ─────────────────────────────────────────────────────────
const log = (msg) => {
  try {
    output.markdown(msg);
  } catch (_) {}
  console.log(
    String(msg).replace(/\*\*/g, "").replace(/`/g, "").replace(/#+\s/g, ""),
  );
};

const DRY_RUN = false;

const TABLES = {
  STAGING: "tblcPSP5NcP0ioUP8",
  SPD: "tbl7mZpHJCUs1r0cg",
  ADMIN_LOGS: "tblk1v5VHPEC2c2u2",
  STD: "tblMdVyuaCBG40uQP",
};

// Staging Fields
const S_SUPPLIER_SKU = "fldeEd9FiNq5AtGNk";
const S_IMPORT_TYPE = "fldjdRY1TAJypmcPF";
const S_ETL_STATUS = "fldbrUDvLv8OEnEqh";
const S_BODY_TYPE = "fldIEO5cTzgLSSOC0";
const S_BODY_FINISH = "fld4QhEwwFSgFsHRB";
const S_NO_FACES = "fldkh9EFaIKvc0yIj";
const S_THICKNESS = "fldbgiMR2Qlm169Mu";
const S_PEI_CLASS = "fldqFzEPIby2C94Du";
const S_SLIP_RATING = "fldfMSgqnPwP2hvtl";
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
const SPD_STOCK_STATUS = "fldK2EV1veOvEkCpu";
const SPD_PCE_BOX = "fldSgGBl9MmbFNgfi";
const SPD_SQM_BOX = "fldv7C2yxJqMMwy71";
const SPD_KG_BOX = "fld9YEiSLAsO2D49B";
const SPD_BOX_PALLET = "fld3SEg2FtEQGpqOA";
const SPD_SQM_PALLET = "fld1xHQZEyBLByG60";
const SPD_KG_PALLET = "fldW0kGw6FI6fBXEu";
const SPD_SRP_EX = "flde8qM0wyidVqrsZ"; // ← v2.2: needed for AVAILABLE guardrail
const SPD_PEI = "flds7HQW3Aa7Hvtds"; // PEI (singleSelect: PEI2/PEI3/PEI4/PEI5)

// SystemLogs Fields
const LOG_NOTES = "fld4l6AJhVNRzIaY8";
const LOG_TYPE = "flda8oHUThBc1Kb7I";
const LOG_SEVERITY = "fldPdoc6JPYHV9gpb";
const LOG_STATUS = "fldog9l4DwJeE5Qj8";
const LOG_REVIEWED = "fldJ1v4BeTILLN37J";
const LOG_OP_NOTES = "fldXtmbbu2ApOWYe4";

// ─────────────────────────────────────────────────────────
// AVAILABLE GUARDRAIL (v2.2)
// ─────────────────────────────────────────────────────────
/**
 * isSuspectAvailable
 *
 * Decobella's stocklist sometimes puts the SRP ex price in the Available
 * column as a placeholder when no real stock movement occurred for that SKU.
 * This function detects that pattern by comparing the incoming available
 * value against the product's existing SRP ex.
 *
 * If they match within 0.1%, it's almost certainly a placeholder — skip the write.
 * If there's no existing SRP ex to compare against (new SKU), returns false
 * so the value passes through (and a note is added to the new product log entry).
 *
 * @param {number|null} availableVal  - Incoming available value from stocklist
 * @param {number|null} srpExVal      - Existing SRP ex on the SPD record (null for new SKUs)
 * @returns {boolean} true = suspect, skip write; false = looks real, allow write
 */
function isSuspectAvailable(availableVal, srpExVal) {
  if (availableVal === null || availableVal === undefined) return false;
  if (srpExVal === null || srpExVal === undefined || srpExVal === 0)
    return false;
  const ratio = Math.abs(availableVal - srpExVal) / srpExVal;
  return ratio < 0.001; // within 0.1% — not a coincidence
}

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
function parseDimensions(raw) {
  if (!raw) return null;
  const isCm = /\bcm\b/i.test(raw);
  const cleaned = raw
    .replace(/mm|cm/gi, "")
    .replace(/[x×*✕]/gi, "|")
    .replace(/\s+/g, "")
    .trim();
  const parts = cleaned.split("|").filter((p) => p !== "");
  if (parts.length < 2) return null;
  const a = parseFloat(parts[0]),
    b = parseFloat(parts[1]);
  if (isNaN(a) || isNaN(b)) return null;
  const m = isCm ? 10 : 1;
  return {
    length: Math.round(Math.max(a, b) * m),
    width: Math.round(Math.min(a, b) * m),
  };
}

function sanitize(val) {
  if (!val) return "";
  return String(val)
    .replace(/[\n\r]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
  log("# ⚙️ Script 1 — ETL Router v2.2");
  if (DRY_RUN) log("> ⚠️ DRY RUN MODE — no writes will occur");

  const stagingTable = base.getTable(TABLES.STAGING);
  const spdTable = base.getTable(TABLES.SPD);
  const stdTable = base.getTable(TABLES.STD);
  const adminLogs = base.getTable(TABLES.ADMIN_LOGS);

  try {
    // ── Step 1: Standardization Engine ─────────────────────
    log("## Step 1 — Loading Standardization Engine...");

    const stdQuery = await stdTable.selectRecordsAsync({
      fields: [
        "fld2bslzLVAsSQIT8", // Category
        "fld9DuMSezOu8000U", // Example Input
        "fldHA73RGGr3ERvNp", // Example Output
        "fldid3LYwJeC8bx7e", // Automated Standardization Feasible
      ],
    });

    const stdEngine = {};
    for (const r of stdQuery.records) {
      if (r.getCellValueAsString("fldid3LYwJeC8bx7e") !== "Yes") continue;
      const cat = r
        .getCellValueAsString("fld2bslzLVAsSQIT8")
        .trim()
        .toUpperCase();
      const inp = r
        .getCellValueAsString("fld9DuMSezOu8000U")
        .trim()
        .toUpperCase();
      const out = r.getCellValueAsString("fldHA73RGGr3ERvNp").trim();
      if (cat && inp && out) stdEngine[`${cat}|${inp}`] = out;
    }

    log(`✅ Standardization engine: ${Object.keys(stdEngine).length} rules`);

    const applyStd = (category, rawValue) => {
      if (!rawValue) return null;
      const key = `${category.toUpperCase()}|${String(rawValue).trim().toUpperCase()}`;
      return stdEngine[key] || null;
    };

    // ── Step 2: Load pending Staging ───────────────────────
    log("## Step 2 — Loading pending Staging rows...");

    const stagingQ = await stagingTable.selectRecordsAsync({
      fields: [
        S_SUPPLIER_SKU,
        S_IMPORT_TYPE,
        S_ETL_STATUS,
        S_SOH,
        S_SAV,
        S_SOO,
        S_ETA,
        S_EOR_STOCK,
        S_DIMENSIONS,
        S_DESCRIPTION,
        S_BODY_TYPE,
        S_BODY_FINISH,
        S_NO_FACES,
        S_THICKNESS,
        S_PEI_CLASS,
        S_SLIP_RATING,
        S_PCE_BOX,
        S_SQM_BOX,
        S_KG_BOX,
        S_BOX_PALLET,
        S_SQM_PALLET,
        S_KG_PALLET,
      ],
    });

    const pendingRows = stagingQ.records.filter(
      (r) => r.getCellValueAsString(S_ETL_STATUS) === "pending",
    );

    log(`✅ Found ${pendingRows.length} pending rows`);
    if (pendingRows.length === 0) {
      log(
        "Nothing to process. Run Scripts 0A → 0B → 0C first if records are held.",
      );
      return;
    }

    // ── Step 3: Load SPD index ──────────────────────────────
    log("## Step 3 — Loading SPD index...");

    const spdQ = await spdTable.selectRecordsAsync({
      fields: [
        SPD_DATA_ID,
        SPD_SKU,
        SPD_PM_LINK,
        SPD_SOH,
        SPD_SAV,
        SPD_SOO,
        SPD_ETA,
        SPD_STOCK_UPDATE,
        SPD_BODY,
        SPD_FINISH,
        SPD_DIMENSIONS,
        SPD_SIZE_LEN,
        SPD_SIZE_WID,
        SPD_DESC,
        SPD_STOCK_STATUS,
        SPD_SRP_EX, // ← v2.2: SRP ex loaded for guardrail
        SPD_PCE_BOX,
        SPD_SQM_BOX,
        SPD_KG_BOX,
        SPD_BOX_PALLET,
        SPD_SQM_PALLET,
        SPD_KG_PALLET,
      ],
    });

    const spdIndex = {};
    for (const rec of spdQ.records) {
      const key = rec.getCellValueAsString(SPD_DATA_ID).trim().toUpperCase();
      if (key) spdIndex[key] = rec;
    }

    log(`✅ Indexed ${Object.keys(spdIndex).length} SPD records`);

    // ── Step 4: Process rows ────────────────────────────────
    log("## Step 4 — Processing rows...");

    const spdUpdates = [];
    const spdCreates = [];
    const stagingUpd = [];
    const systemLogs = [];

    let countUpdated = 0,
      countCreated = 0,
      countFailed = 0;
    let countBodyWarnings = 0,
      countFinishWarnings = 0;
    let countAvailableWarnings = 0; // ← v2.2

    for (const stagingRec of pendingRows) {
      const importType = stagingRec.getCellValueAsString(S_IMPORT_TYPE);
      const rawSku = stagingRec.getCellValueAsString(S_SUPPLIER_SKU).trim();
      const normKey = normSku(rawSku);

      try {
        if (!normKey) throw new Error(`Invalid SKU: "${rawSku}"`);

        const spdRec = spdIndex[normKey];
        const today = new Date().toISOString().split("T")[0];

        if (importType.toUpperCase().startsWith("ST")) {
          // ── STOCK TRANSFER ──────────────────────────────
          const payload = {};
          const soh = stagingRec.getCellValue(S_SOH);
          const sav = stagingRec.getCellValue(S_SAV);
          const soo = stagingRec.getCellValue(S_SOO);
          const eta = stagingRec.getCellValueAsString(S_ETA);

          if (soh !== null) payload[SPD_SOH] = soh;

          // ── AVAILABLE GUARDRAIL (v2.2) ──────────────────
          if (sav !== null) {
            if (spdRec) {
              // Existing product: compare against SRP ex
              const srpEx = spdRec.getCellValue(SPD_SRP_EX);
              if (isSuspectAvailable(sav, srpEx)) {
                // Looks like a price placeholder — skip write, log warning
                countAvailableWarnings++;
                systemLogs.push({
                  fields: {
                    [LOG_NOTES]:
                      `⚠️ Available stock figure skipped — SKU: ${rawSku}\n\n` +
                      `What happened: The stock figure in the supplier file (${sav}) ` +
                      `matches this product's selling price (R${srpEx ? srpEx.toFixed(2) : "unknown"}) exactly. ` +
                      `This is a known issue with Decobella's stock file — they use the price as a placeholder ` +
                      `when no real stock movement occurred. The Available field has NOT been updated.\n\n` +
                      `What to do: No action needed unless you believe this product genuinely has ` +
                      `${sav} sqm in stock — in which case update the Available field manually.\n\n` +
                      `Tick "Reviewed" below to clear this from your queue.`,
                    [LOG_TYPE]: { name: "System_Event" },
                    [LOG_SEVERITY]: { name: "Info" },
                    [LOG_STATUS]: { name: "Logged" },
                  },
                });
              } else {
                payload[SPD_SAV] = sav;
              }
            } else {
              // New SKU: no SRP ex to compare — write through, add note to new product log below
              payload[SPD_SAV] = sav;
            }
          }
          // ── END AVAILABLE GUARDRAIL ─────────────────────

          if (soo !== null) payload[SPD_SOO] = soo;
          if (eta) payload[SPD_ETA] = eta;
          payload[SPD_STOCK_UPDATE] = today;

          // Dimensions
          const rawDim = stagingRec.getCellValueAsString(S_DIMENSIONS).trim();
          if (rawDim) {
            const dims = parseDimensions(rawDim);
            if (dims) {
              payload[SPD_DIMENSIONS] = rawDim;
              if (spdRec) {
                if (!spdRec.getCellValue(SPD_SIZE_LEN))
                  payload[SPD_SIZE_LEN] = dims.length;
                if (!spdRec.getCellValue(SPD_SIZE_WID))
                  payload[SPD_SIZE_WID] = dims.width;
              }
            }
          }

          // Body Type
          const rawBody = sanitize(
            stagingRec.getCellValueAsString(S_BODY_TYPE),
          );
          if (rawBody) {
            const cleanBody = applyStd("BODY TYPE", rawBody);
            if (cleanBody) {
              if (spdRec) {
                if (!spdRec.getCellValueAsString(SPD_BODY))
                  payload[SPD_BODY] = cleanBody;
              } else {
                payload[SPD_BODY] = cleanBody;
              }
            } else {
              countBodyWarnings++;
              systemLogs.push({
                fields: {
                  [LOG_NOTES]:
                    `⚠️ Body type needs your attention — SKU: ${rawSku}\n\n` +
                    `What happened: The supplier described this product's material as "${rawBody}". ` +
                    `The system could not match this to a standard material type, so it was left blank rather than saving incorrect data.\n\n` +
                    `What to do: Open the supplier product record for ${rawSku} and set the Body Type Class field manually. ` +
                    `Choose the closest match: Porcelain, Ceramic, or the appropriate material type.\n\n` +
                    `Tick "Reviewed" below once you have confirmed or corrected this.`,
                  [LOG_TYPE]: { name: "Missing_Data" },
                  [LOG_SEVERITY]: { name: "Info" },
                  [LOG_STATUS]: { name: "Logged" },
                },
              });
            }
          }

          // Body Finish
          const rawFinish = sanitize(
            stagingRec.getCellValueAsString(S_BODY_FINISH),
          );
          if (rawFinish) {
            const cleanFinish = applyStd("BODY FINISH", rawFinish);
            if (cleanFinish) {
              if (spdRec) {
                if (!spdRec.getCellValueAsString(SPD_FINISH))
                  payload[SPD_FINISH] = cleanFinish;
              } else {
                payload[SPD_FINISH] = cleanFinish;
              }
            } else {
              countFinishWarnings++;
              systemLogs.push({
                fields: {
                  [LOG_NOTES]:
                    `⚠️ Finish type needs your attention — SKU: ${rawSku}\n\n` +
                    `What happened: The supplier described this product's finish as "${rawFinish}". ` +
                    `The system could not match this to a standard finish, so it was left blank rather than saving incorrect data.\n\n` +
                    `What to do: Open the supplier product record for ${rawSku} and set the Finish field manually. ` +
                    `Choose the closest match: Matt, Gloss, Lappato, Semi-Polished, etc.\n\n` +
                    `Tick "Reviewed" below once you have confirmed or corrected this.`,
                  [LOG_TYPE]: { name: "Missing_Data" },
                  [LOG_SEVERITY]: { name: "Info" },
                  [LOG_STATUS]: { name: "Logged" },
                },
              });
            }
          }

          // PEI Class (null-safe — only write if SPD currently empty)
          const rawPei = stagingRec.getCellValueAsString(S_PEI_CLASS).trim();
          if (rawPei) {
            const cleanPei = applyStd("PEI Ratings", rawPei);
            if (
              cleanPei &&
              cleanPei.startsWith("PEI") &&
              !spdRec?.getCellValueAsString(SPD_PEI)
            ) {
              payload[SPD_PEI] = { name: cleanPei };
            }
          }

          // Description (null-safe — only write if SPD currently empty)
          const rawDesc = stagingRec.getCellValueAsString(S_DESCRIPTION).trim();
          if (rawDesc && spdRec && !spdRec.getCellValueAsString(SPD_DESC)) {
            payload[SPD_DESC] = rawDesc;
          }

          // Logistics (null-safe)
          const logMap = [
            [S_PCE_BOX, SPD_PCE_BOX],
            [S_SQM_BOX, SPD_SQM_BOX],
            [S_KG_BOX, SPD_KG_BOX],
            [S_BOX_PALLET, SPD_BOX_PALLET],
            [S_SQM_PALLET, SPD_SQM_PALLET],
            [S_KG_PALLET, SPD_KG_PALLET],
          ];

          if (spdRec) {
            for (const [sf, df] of logMap) {
              const v = stagingRec.getCellValue(sf);
              if (v !== null && !spdRec.getCellValue(df)) payload[df] = v;
            }
            spdUpdates.push({ id: spdRec.id, fields: payload });
            countUpdated++;
          } else {
            // ── NEW SKU — create SPD record ──────────────────
            payload[SPD_SKU] = rawSku;
            if (rawDesc) payload[SPD_DESC] = rawDesc;
            for (const [sf, df] of logMap) {
              const v = stagingRec.getCellValue(sf);
              if (v !== null) payload[df] = v;
            }
            spdCreates.push({ fields: payload });
            countCreated++;

            // ── NEW SKU SystemLog — v2.2: flag suspicious AVAILABLE if present
            const savForNew = sav !== null ? sav : null;
            const savNote =
              savForNew !== null && savForNew > 200
                ? `\n⚠️ Note: The Available stock figure in the supplier file is ${savForNew} sqm. ` +
                  `For a brand new product this looks unusually high — please verify this is a real ` +
                  `stock figure and not a data error when you enrich this product.`
                : "";

            systemLogs.push({
              fields: {
                [LOG_NOTES]:
                  `✅ New product added — SKU: ${rawSku}\n\n` +
                  `Product: ${rawDesc || "(no description yet)"}\n\n` +
                  `What happened: This product arrived in the latest supplier file and didn't exist in the system yet. ` +
                  `A new supplier product record has been created automatically.\n\n` +
                  `What to do next:\n` +
                  `1. Open the supplier product record for ${rawSku} and check the details look correct.\n` +
                  `2. Add any missing information (body type, finish, dimensions) if not already populated.\n` +
                  `3. Once the product is fully enriched, a Utile product code will be proposed automatically.` +
                  savNote +
                  `\n\nTick "Reviewed" below once you have checked this product.`,
                [LOG_TYPE]: { name: "System_Event" },
                [LOG_SEVERITY]: { name: "Info" },
                [LOG_STATUS]: { name: "Logged" },
              },
            });
          }
        } else if (importType.toUpperCase().startsWith("EOR")) {
          // ── END OF RANGE ─────────────────────────────────
          if (spdRec) {
            const eorPayload = {};
            const soh = stagingRec.getCellValue(S_SOH);
            const sav = stagingRec.getCellValue(S_SAV);
            const eorStock = stagingRec.getCellValue(S_EOR_STOCK);
            if (soh !== null) eorPayload[SPD_SOH] = soh;
            // Apply guardrail to EOR available too
            if (sav !== null) {
              const srpEx = spdRec.getCellValue(SPD_SRP_EX);
              if (!isSuspectAvailable(sav, srpEx)) eorPayload[SPD_SAV] = sav;
            }
            if (eorStock !== null) eorPayload[SPD_EOR_STOCK] = eorStock;
            eorPayload[SPD_STOCK_UPDATE] = today;
            eorPayload[SPD_STOCK_STATUS] = { name: "SPD EOR" };
            spdUpdates.push({ id: spdRec.id, fields: eorPayload });
            countUpdated++;
          }
        } else if (importType.toUpperCase().startsWith("DD")) {
          // ── DISCONTINUED ─────────────────────────────────
          if (spdRec) {
            const ddPayload = {};
            const soh = stagingRec.getCellValue(S_SOH);
            const sav = stagingRec.getCellValue(S_SAV);
            if (soh !== null) ddPayload[SPD_SOH] = soh;
            if (sav !== null) {
              const srpEx = spdRec.getCellValue(SPD_SRP_EX);
              if (!isSuspectAvailable(sav, srpEx)) ddPayload[SPD_SAV] = sav;
            }
            ddPayload[SPD_STOCK_UPDATE] = today;
            ddPayload[SPD_STOCK_STATUS] = { name: "SPD DD" };
            spdUpdates.push({ id: spdRec.id, fields: ddPayload });
            countUpdated++;
          }
        }

        // FIX CRITICAL BUG #3: Store current status for optimistic lock check in Step 5
        const currentStatus = stagingRec.getCellValueAsString(S_ETL_STATUS).trim();
        stagingUpd.push({
          id: stagingRec.id,
          originalStatus: currentStatus,  // Store original status for lock check
          fields: { [S_ETL_STATUS]: { name: "processed" } },
        });
      } catch (err) {
        countFailed++;
        const currentStatus = stagingRec.getCellValueAsString(S_ETL_STATUS).trim();
        stagingUpd.push({
          id: stagingRec.id,
          originalStatus: currentStatus,  // Store original status for lock check
          fields: { [S_ETL_STATUS]: { name: "failed" } },
        });
        systemLogs.push({
          fields: {
            [LOG_NOTES]:
              `🔴 Import error — SKU: "${rawSku}"\n\n` +
              `What happened: This product could not be processed during the import. ` +
              `The system recorded the following technical detail: ${err.message}\n\n` +
              `What to do: Contact your system administrator and quote the SKU and this log entry. ` +
              `Do not attempt to re-run the import for this SKU until the cause has been identified.\n\n` +
              `Tick "Reviewed" below once this has been investigated.`,
            [LOG_TYPE]: { name: "System_Event" },
            [LOG_SEVERITY]: { name: "High" },
            [LOG_STATUS]: { name: "Logged" },
          },
        });
      }
    }

    // ── Step 5: Commit writes ───────────────────────────────
    if (!DRY_RUN) {
      log("## Step 5 — Writing to Airtable...");

      if (spdCreates.length)
        for (const b of chunk(spdCreates, 50))
          await spdTable.createRecordsAsync(b);

      if (spdUpdates.length)
        for (const b of chunk(spdUpdates, 50))
          await spdTable.updateRecordsAsync(b);

      // FIX CRITICAL BUG #3: Add optimistic lock check before Staging updates
      // Verify each record is still in "pending" state (not held by 0B or other script)
      if (stagingUpd.length) {
        let lockConflicts = 0;
        let updatesApplied = 0;
        
        // Reload current Staging statuses to detect concurrent changes
        const stagingCheck = await stagingTable.selectRecordsAsync({
          fields: [S_ETL_STATUS],
          recordIds: stagingUpd.map(u => u.id)
        });
        
        const currentStatusById = {};
        for (const rec of stagingCheck.records) {
          currentStatusById[rec.id] = rec.getCellValueAsString(S_ETL_STATUS).trim();
        }
        
        // Filter: only update records that are still in original state
        const safeUpdates = stagingUpd.filter(upd => {
          const current = currentStatusById[upd.id];
          if (current !== upd.originalStatus && current !== "pending") {
            lockConflicts++;
            log(`⚠️ Optimistic lock conflict detected: Record ${upd.id} status changed from "${upd.originalStatus}" to "${current}" — skipping update to preserve hold status`);
            return false;
          }
          updatesApplied++;
          return true;
        });
        
        if (lockConflicts > 0) {
          log(`⚠️ WARNING: ${lockConflicts} record(s) held by concurrent process (Script 0B validation) — these have been preserved and not marked "processed"`);
        }
        
        for (const b of chunk(safeUpdates, 50)) {
          await stagingTable.updateRecordsAsync(b.map(u => ({ id: u.id, fields: u.fields })));
        }
      }

      if (systemLogs.length)
        for (const b of chunk(systemLogs, 50))
          await adminLogs.createRecordsAsync(b);
    }

    log("---");
    log("## ✅ Script 1 Complete");
    log(
      `| Metric | Count |\n|---|---|\n` +
        `| SPD records updated             | ${countUpdated}             |\n` +
        `| New SPD records created         | ${countCreated}             |\n` +
        `| Failed rows                     | ${countFailed}              |\n` +
        `| Body type warnings (see log)    | ${countBodyWarnings}        |\n` +
        `| Finish warnings (see log)       | ${countFinishWarnings}      |\n` +
        `| Available guardrail skips       | ${countAvailableWarnings}   |\n` +
        `| SystemLog entries written       | ${systemLogs.length}        |`,
    );

    if (countCreated > 0) {
      log(
        `> ℹ️ **${countCreated} new product(s) added.** Check System Activity for details.`,
      );
      log(
        "> Once enrichment is complete, run **Script 3** to propose Utile product codes.",
      );
    }

    if (countAvailableWarnings > 0) {
      log(
        `> ⚠️ **${countAvailableWarnings} Available field(s) skipped** — ` +
          `the stock figure matched the selling price, which means Decobella used the price as a placeholder. ` +
          `Check System Activity for details. No action needed unless real stock exists.`,
      );
    }

    if (countBodyWarnings + countFinishWarnings > 0) {
      log(
        `> ⚠️ **${countBodyWarnings + countFinishWarnings} body type / finish value(s)** ` +
          `could not be resolved and were not written to SPD.\n` +
          `> Check System Activity → filter by Missing_Data to find and fix them.`,
      );
    }

    if (DRY_RUN) log("> DRY RUN — no data was written.");
  } catch (err) {
    log(`## ❌ UNHANDLED ERROR: ${err.message}`);
    console.error(err.stack);
  }
}

await main();
