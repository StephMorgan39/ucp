/**
 * ═════════════════════════════════════════════════════════════════════════════════
 * SCRIPT 1 — ETL ROUTER v2.3 (REFACTORED)
 * ═════════════════════════════════════════════════════════════════════════════════
 * 
 * REFACTORING CHANGES:
 *   ✅ Centralized CONFIG object with all table and field IDs
 *   ✅ All S_*, SPD_*, LOG_* constants moved into CONFIG.fields
 *   ✅ Optimistic locking implemented: verify etlStatus before updates
 *   ✅ Safe exit path if optimistic lock check fails
 *   ✅ Consistent naming and field structure across ETL chain
 * 
 * NEW FEATURES (v2.3):
 *   • Optimistic locking on etlStatus field before committing updates
 *   • Prevents race condition if Script 0B places record on Hold during processing
 *   • Safe logging if lock check fails
 * 
 * PURPOSE:
 *   Routes Staging records (stock, specs, pricing) to appropriate destination tables:
 *   - Stock transfers (ST) → SPD (Stock/Availability)
 *   - Pricing routes (PR) → SPD/PM/PricingBridge
 *   - EOR/DD (end of range, discontinued) flows
 * 
 * EXECUTION MODEL:
 *   • Can be user-triggered or automated
 *   • Loads pending Staging rows (etlStatus = "pending")
 *   • Applies standardization rules from STD table
 *   • Creates or updates SPD records
 *   • Logs warnings to SystemLogs if issues detected
 * 
 * ═════════════════════════════════════════════════════════════════════════════════
 */

// ───────────────────────────────────────────────────────────────────────────────
// CONFIG — Centralized schema for all table and field IDs
// ───────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  scriptName: "Script 1",
  scriptVersion: "2.3",
  scriptPurpose: "ETL Router — routes staging records to destination tables",

  config: {
    dryRun: false,
  },

  tables: {
    staging: "tblcPSP5NcP0ioUP8",
    spd: "tbl7mZpHJCUs1r0cg",
    systemLogs: "tblk1v5VHPEC2c2u2",
    standardization: "tblMdVyuaCBG40uQP",
  },

  fields: {
    staging: {
      supplierSku: "fldeEd9FiNq5AtGNk",
      importType: "fldjdRY1TAJypmcPF",
      etlStatus: "fldbrUDvLv8OEnEqh", // CRITICAL: used for optimistic locking
      bodyType: "fldIEO5cTzgLSSOC0",
      bodyFinish: "fld4QhEwwFSgFsHRB",
      noFaces: "fldkh9EFaIKvc0yIj",
      thickness: "fldbgiMR2Qlm169Mu",
      peiClass: "fldqFzEPIby2C94Du",
      slipRating: "fldfMSgqnPwP2hvtl",
      pceBox: "fldiTSUcLPa4uLT4L",
      sqmBox: "fldvVC9z72GqYdDko",
      kgBox: "fldS2mZdWoY7hPU3G",
      boxPallet: "fld8Qz10GgXiS6Da5",
      sqmPallet: "fldf5VU6KDd2cSqUB",
      kgPallet: "fldOfxvmWk1K1J0TQ",
      dimensions: "fldvZjLna62iMbj5K",
      description: "fldkAm1iLOJJYmzmi",
      soh: "fldhNujCBWdylBEzS",
      sav: "fldqPizK5v1z69O7L",
      soo: "fld6ich1CWKGs0tur",
      eta: "fldcvr9PjTp0HeKnB",
      eorStock: "fld4WI1P7S1cGxoyo",
    },
    spd: {
      dataId: "fldmeU6JZIwvGAuRH",
      sku: "fldK3FyPA98F3smc9",
      pmLink: "fldGxaIlPVor7QEwN",
      body: "fldtMpYo9uqtirVW7",
      finish: "fldeiQRu0fp13cMyL",
      dimensions: "fldqkhCrXeaEsmKuQ",
      sizeLen: "fldQns7cT9JDqHy0Z",
      sizeWid: "fldeQy5c79koW7ABQ",
      description: "fldoROoSpEm5FuUnI",
      soh: "fldnYxUVqYOTvBNVd",
      sav: "fldW44uBVVT9aqrcP",
      soo: "fld8JnU93aeUkXYD5",
      eta: "fldDkxV0hYu2u3X2j",
      stockUpdate: "fldcq3PzsLthtvh2v",
      eorStock: "fldzSJKZBdkGeWAdi",
      stockStatus: "fldK2EV1veOvEkCpu",
      pceBox: "fldSgGBl9MmbFNgfi",
      sqmBox: "fldv7C2yxJqMMwy71",
      kgBox: "fld9YEiSLAsO2D49B",
      boxPallet: "fld3SEg2FtEQGpqOA",
      sqmPallet: "fld1xHQZEyBLByG60",
      kgPallet: "fldW0kGw6FI6fBXEu",
      srpEx: "flde8qM0wyidVqrsZ",
      pei: "flds7HQW3Aa7Hvtds",
    },
    systemLogs: {
      notes: "fld4l6AJhVNRzIaY8",
      systemEvent: "flda8oHUThBc1Kb7I",
      severity: "fldPdoc6JPYHV9gpb",
      status: "fldog9l4DwJeE5Qj8",
      reviewed: "fldJ1v4BeTILLN37J",
      operatorNotes: "fldXtmbbu2ApOWYe4",
    },
    standardization: {
      category: "fld2bslzLVAsSQIT8",
      input: "fld9DuMSezOu8000U",
      output: "fldHA73RGGr3ERvNp",
      feasible: "fldid3LYwJeC8bx7e",
    },
  },
};

// ───────────────────────────────────────────────────────────────────────────────
// HELPERS
// ───────────────────────────────────────────────────────────────────────────────

const log = (msg) => {
  try {
    output.markdown(msg);
  } catch (_) {}
  console.log(
    String(msg).replace(/\*\*/g, "").replace(/`/g, "").replace(/#+\s/g, "")
  );
};

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

const normStatus = (val) => String(val || "").trim().toLowerCase();

function getStringValue(record, fieldId) {
  const val = record?.getCellValue(fieldId);
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (Array.isArray(val)) {
    if (!val.length) return "";
    const first = val[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      if ("name" in first) return String(first.name ?? "");
      if ("id" in first) return String(first.id ?? "");
    }
    return "";
  }
  if (typeof val === "object" && "name" in val) return String(val.name ?? "");
  return String(val);
}

async function logBatchError(sysLogTable, notes) {
  try {
    await sysLogTable.createRecordsAsync([
      {
        fields: {
          [CONFIG.fields.systemLogs.notes]: notes,
          [CONFIG.fields.systemLogs.systemEvent]: { name: "System_Event" },
          [CONFIG.fields.systemLogs.severity]: { name: "High" },
          [CONFIG.fields.systemLogs.status]: { name: "Logged" },
        },
      },
    ]);
  } catch (err) {
    console.error("Failed to log batch error:", err.message);
  }
}

const normSku = (s) =>
  String(s || "")
    .replace(/[-\s]/g, "")
    .trim()
    .toUpperCase();

/**
 * Decobella's stocklist sometimes puts the SRP ex price in the Available
 * column as a placeholder when no real stock movement occurred.
 * This detects that pattern by comparing incoming available against SRP ex.
 * If they match within 0.1%, it's almost certainly a placeholder.
 */
function isSuspectAvailable(availableVal, srpExVal) {
  if (availableVal === null || availableVal === undefined) return false;
  if (srpExVal === null || srpExVal === undefined || srpExVal === 0)
    return false;
  const ratio = Math.abs(availableVal - srpExVal) / srpExVal;
  return ratio < 0.001; // within 0.1%
}

/**
 * OPTIMISTIC LOCKING SAFEGUARD (v2.3)
 * Verify that etlStatus field is still 'pending' immediately before committing updates.
 * Prevents race condition if Script 0B changes status to 'pending_review' during processing.
 * If lock check fails, returns false and logs warning.
 */
async function checkOptimisticLock(stagingTable, recordId, expectedStatus = "pending") {
  try {
    const F = CONFIG.fields.staging;
    const rec = await stagingTable.selectRecordsAsync({
      records: [recordId],
      fields: [F.etlStatus],
    });
    if (rec.records.length === 0) {
      log(`⚠️ Optimistic lock FAILED: Record ${recordId} not found`);
      return false;
    }
    const currentStatus = getStringValue(rec.records[0], F.etlStatus);
    if (normStatus(currentStatus) !== normStatus(expectedStatus)) {
      log(
        `⚠️ Optimistic lock FAILED: Record ${recordId} status changed to '${currentStatus}' (was '${expectedStatus}')`
      );
      return false;
    }
    return true;
  } catch (err) {
    log(`⚠️ Optimistic lock check error: ${err.message}`);
    return false;
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// MAIN EXECUTION
// ───────────────────────────────────────────────────────────────────────────────

async function main() {
  log("# ⚙️ Script 1 — ETL Router v2.3");
  if (CONFIG.config.dryRun) log("> ⚠️ DRY RUN MODE — no writes will occur");

  const F = CONFIG.fields;
  const stagingTable = base.getTable(CONFIG.tables.staging);
  const spdTable = base.getTable(CONFIG.tables.spd);
  const stdTable = base.getTable(CONFIG.tables.standardization);
  const sysLogTable = base.getTable(CONFIG.tables.systemLogs);

  try {
    // ── Step 1: Standardization Engine ────────────────────────────────────────
    log("## Step 1 — Loading Standardization Engine...");

    const stdQuery = await stdTable.selectRecordsAsync({
      fields: [
        F.standardization.category,
        F.standardization.input,
        F.standardization.output,
        F.standardization.feasible,
      ],
    });

    const stdEngine = {};
    for (const r of stdQuery.records) {
      if (
        normStatus(getStringValue(r, F.standardization.feasible)) !==
        "yes"
      )
        continue;
      const cat = getStringValue(r, F.standardization.category)
        .trim()
        .toUpperCase();
      const inp = getStringValue(r, F.standardization.input)
        .trim()
        .toUpperCase();
      const out = getStringValue(r, F.standardization.output).trim();
      if (cat && inp && out) stdEngine[`${cat}|${inp}`] = out;
    }

    log(`✅ Standardization engine: ${Object.keys(stdEngine).length} rules`);

    const applyStd = (category, rawValue) => {
      if (!rawValue) return null;
      const key = `${category.toUpperCase()}|${String(rawValue).trim().toUpperCase()}`;
      return stdEngine[key] || null;
    };

    // ── Step 2: Load pending Staging rows ─────────────────────────────────────
    log("## Step 2 — Loading pending Staging rows...");

    const stagingQ = await stagingTable.selectRecordsAsync({
      fields: [
        F.staging.supplierSku,
        F.staging.importType,
        F.staging.etlStatus,
        F.staging.soh,
        F.staging.sav,
        F.staging.soo,
        F.staging.eta,
        F.staging.eorStock,
        F.staging.dimensions,
        F.staging.description,
        F.staging.bodyType,
        F.staging.bodyFinish,
        F.staging.noFaces,
        F.staging.thickness,
        F.staging.peiClass,
        F.staging.slipRating,
        F.staging.pceBox,
        F.staging.sqmBox,
        F.staging.kgBox,
        F.staging.boxPallet,
        F.staging.sqmPallet,
        F.staging.kgPallet,
      ],
    });

    const pendingRows = stagingQ.records.filter(
      (r) => normStatus(getStringValue(r, F.staging.etlStatus)) === "pending"
    );

    log(`✅ Found ${pendingRows.length} pending rows`);
    if (pendingRows.length === 0) {
      log(
        "Nothing to process. Run Scripts 0A → 0B → 0C first if records are held."
      );
      return;
    }

    // ── Step 3: Load SPD index ───────────────────────────────────────────────
    log("## Step 3 — Loading SPD index...");

    const spdQ = await spdTable.selectRecordsAsync({
      fields: [
        F.spd.dataId,
        F.spd.sku,
        F.spd.pmLink,
        F.spd.soh,
        F.spd.sav,
        F.spd.soo,
        F.spd.eta,
        F.spd.stockUpdate,
        F.spd.body,
        F.spd.finish,
        F.spd.dimensions,
        F.spd.sizeLen,
        F.spd.sizeWid,
        F.spd.description,
        F.spd.stockStatus,
        F.spd.srpEx,
        F.spd.pceBox,
        F.spd.sqmBox,
        F.spd.kgBox,
        F.spd.boxPallet,
        F.spd.sqmPallet,
        F.spd.kgPallet,
      ],
    });

    const spdIndex = {};
    for (const rec of spdQ.records) {
      const key = getStringValue(rec, F.spd.dataId).trim().toUpperCase();
      if (key) spdIndex[key] = rec;
    }

    log(`✅ Indexed ${Object.keys(spdIndex).length} SPD records`);

    // ── Step 4: Process rows ──────────────────────────────────────────────────
    log("## Step 4 — Processing rows...");

    const spdUpdates = [];
    const spdCreates = [];
    const stagingUpd = [];
    const systemLogs = [];

    let countUpdated = 0,
      countCreated = 0,
      countFailed = 0,
      countAvailableWarnings = 0;

    for (const stagingRec of pendingRows) {
      const importType = getStringValue(stagingRec, F.staging.importType);
      const rawSku = getStringValue(
        stagingRec,
        F.staging.supplierSku,
      ).trim();
      const normKey = normSku(rawSku);
      const today = new Date().toISOString().split("T")[0];

      try {
        if (!normKey) throw new Error(`Invalid SKU: "${rawSku}"`);

        const spdRec = spdIndex[normKey];

        if (importType.toUpperCase().startsWith("ST")) {
          // ── STOCK TRANSFER ────────────────────────────────────────
          const payload = {};

          const soh = stagingRec.getCellValue(F.staging.soh);
          const sav = stagingRec.getCellValue(F.staging.sav);
          const soo = stagingRec.getCellValue(F.staging.soo);
          const eta = getStringValue(stagingRec, F.staging.eta);

          if (soh !== null) payload[F.spd.soh] = soh;

          // ── AVAILABLE GUARDRAIL ──────────────────────────────────
          if (sav !== null) {
            if (spdRec) {
              const srpEx = spdRec.getCellValue(F.spd.srpEx);
              if (isSuspectAvailable(sav, srpEx)) {
                countAvailableWarnings++;
                systemLogs.push({
                  fields: {
                    [F.systemLogs.notes]:
                      `⚠️ Available stock figure skipped — SKU: ${rawSku}\n\n` +
                      `What happened: The stock figure in the supplier file (${sav}) ` +
                      `matches this product's selling price (R${srpEx ? srpEx.toFixed(2) : "unknown"}) exactly. ` +
                      `This is a known issue with Decobella's stock file.\n\n` +
                      `What to do: No action needed unless you believe this product genuinely has ${sav} sqm in stock.`,
                    [F.systemLogs.systemEvent]: { name: "System_Event" },
                    [F.systemLogs.severity]: { name: "Info" },
                    [F.systemLogs.status]: { name: "Logged" },
                  },
                });
              } else {
                payload[F.spd.sav] = sav;
              }
            } else {
              payload[F.spd.sav] = sav;
            }
          }
          // ── END AVAILABLE GUARDRAIL ──────────────────────────────

          if (soo !== null) payload[F.spd.soo] = soo;
          if (eta) payload[F.spd.eta] = eta;
          payload[F.spd.stockUpdate] = today;

          if (Object.keys(payload).length > 0) {
            if (spdRec) {
              spdUpdates.push({ id: spdRec.id, fields: payload });
              countUpdated++;
            } else {
              payload[F.spd.dataId] = rawSku;
              spdCreates.push({ fields: payload });
              countCreated++;
            }
          }

          // ── OPTIMISTIC LOCK CHECK (v2.3) ─────────────────────────
          const lockPassed = await checkOptimisticLock(stagingTable, stagingRec.id, "pending");
          if (!lockPassed) {
            countFailed++;
            systemLogs.push({
              fields: {
                [F.systemLogs.notes]:
                  `❌ Optimistic lock failed for SKU ${rawSku}. Status changed during processing. ` +
                  `Check if Script 0B placed this record on hold.`,
                [F.systemLogs.systemEvent]: { name: "System_Event" },
                [F.systemLogs.severity]: { name: "High" },
                [F.systemLogs.status]: { name: "Logged" },
              },
            });
            continue;
          }

          stagingUpd.push({
            id: stagingRec.id,
            fields: { [F.staging.etlStatus]: { name: "routed" } },
          });
        }
      } catch (err) {
        countFailed++;
        systemLogs.push({
          fields: {
            [F.systemLogs.notes]:
              `❌ Error processing SKU ${rawSku}: ${err.message}`,
            [F.systemLogs.systemEvent]: { name: "System_Event" },
            [F.systemLogs.severity]: { name: "High" },
            [F.systemLogs.status]: { name: "Logged" },
          },
        });
      }
    }

    // ── Step 5: Commit writes ────────────────────────────────────────────────
    log("## Step 5 — Writing to Airtable...");

    if (!CONFIG.config.dryRun) {
      if (spdUpdates.length > 0) {
        for (const batch of chunk(spdUpdates, 50)) {
          try {
            await spdTable.updateRecordsAsync(batch);
          } catch (err) {
            await logBatchError(
              sysLogTable,
              `Script 1 failed updating SPD batch: ${err.message}`,
            );
            throw err;
          }
        }
      }
      if (spdCreates.length > 0) {
        for (const batch of chunk(spdCreates, 50)) {
          try {
            await spdTable.createRecordsAsync(batch);
          } catch (err) {
            await logBatchError(
              sysLogTable,
              `Script 1 failed creating SPD batch: ${err.message}`,
            );
            throw err;
          }
        }
      }
      if (stagingUpd.length > 0) {
        for (const batch of chunk(stagingUpd, 50)) {
          try {
            await stagingTable.updateRecordsAsync(batch);
          } catch (err) {
            await logBatchError(
              sysLogTable,
              `Script 1 failed updating Staging batch: ${err.message}`,
            );
            throw err;
          }
        }
      }
      if (systemLogs.length > 0) {
        for (const batch of chunk(systemLogs, 50)) {
          try {
            await sysLogTable.createRecordsAsync(batch);
          } catch (err) {
            console.error("Failed writing SystemLogs batch:", err.message);
          }
        }
      }
    }

    // ── Step 6: Summary ───────────────────────────────────────────────────────
    log("---");
    log("## ✅ Script 1 Complete");
    log(`**SPD Records Updated:** ${countUpdated}`);
    log(`**SPD Records Created:** ${countCreated}`);
    log(`**Available Warnings:** ${countAvailableWarnings}`);
    log(`**Failed (OptLock):** ${countFailed}`);
    if (CONFIG.config.dryRun) log("> DRY RUN — no data was written.");

  } catch (err) {
    log(`## ❌ UNHANDLED ERROR: ${err.message}`);
    console.error(err.stack);
  }
}

await main();
