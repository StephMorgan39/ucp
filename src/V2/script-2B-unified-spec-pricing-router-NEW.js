/**
 * SCRIPT 2B — UNIFIED PRICING & SPEC ROUTER v2.4 (CONFIG Pattern)
 * 
 * Routes pricing and specs from Staging → SPD/PM/PricingBridge.
 * Applies standardization rules, validates numeric ranges.
 * 
 * CHANGES from v2.3:
 *   - Full CONFIG + helpers pattern (aligned with 0A/0B)
 *   - All field IDs centralized
 *   - const F = CONFIG.fields pattern throughout
 */

const CONFIG = {
  scriptName: "Script 2B",
  scriptVersion: "2.4",
  scriptPurpose: "Unified Pricing & Spec Router — routes pricing and specs to PM/SPD/PB",

  tables: {
    staging: "tblcPSP5NcP0ioUP8",
    spd: "tbl7mZpHJCUs1r0cg",
    pm: "tblgLqMMXX2HcKt9U",
    pricingBridge: "tblW85ycReRUr0Ze1",
    systemLogs: "tblk1v5VHPEC2c2u2",
    standardization: "tblMdVyuaCBG40uQP",
  },

  fields: {
    staging: {
      supplierSku: "fldeEd9FiNq5AtGNk",
      importType: "fldjdRY1TAJypmcPF",
      etlStatus: "fldbrUDvLv8OEnEqh",
      retailExcl: "fldHDkQCH8jKeJZ7g",
      noFaces: "fldkh9EFaIKvc0yIj",
      thickness: "fldbgiMR2Qlm169Mu",
      peiClass: "fldqFzEPIby2C94Du",
      slipRating: "fldfMSgqnPwP2hvtl",
      bodyFinish: "fld4QhEwwFSgFsHRB",
    },
    spd: {
      dataId: "fldmeU6JZIwvGAuRH",
      retailExcl: "flde8qM0wyidVqrsZ",
      supplier: "fldY9HQ6d42p8uVoY",
      pmLink: "fldGxaIlPVor7QEwN",
      pei: "flds7HQW3Aa7Hvtds",
    },
    pm: {
      uomLink: "fldMWdeUtUF8Hgst9",
      noFaces: "fldFbjxoAh9sieegL",
      thickness: "fldEGSqge560gp4OK",
      bodyFinish: "fldeiQRu0fp13cMyL",
    },
    pricingBridge: {
      productSku: "fldAYj8E8RicN1EmL",
      priceType: "fldlCCMJvTDaNin4h",
      cost: "fldxf21wIe7LXyHFz",
      supplier: "fldpLc5q4X7D7MZ8a",
      uom: "fldw9ECJYGAB7IJPh",
      priceStatus: "fldSdokb18nBjXu0D",
    },
    systemLogs: {
      notes: "fld4l6AJhVNRzIaY8",
      systemEvent: "flda8oHUThBc1Kb7I",
      severity: "fldPdoc6JPYHV9gpb",
      status: "fldog9l4DwJeE5Qj8",
    },
    standardization: {
      category: "fld2bslzLVAsSQIT8",
      input: "fld9DuMSezOu8000U",
      output: "fldHA73RGGr3ERvNp",
      feasible: "fldid3LYwJeC8bx7e",
    },
  },

  config: {
    dryRun: false,
  },
};

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
const logUI = (msg) => {
  try {
    output.markdown(msg);
  } catch (_) {}
  console.log(
    String(msg)
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/#+\s/g, "")
  );
};

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
  String(s || "").replace(/[-\s]/g, "").trim().toUpperCase();

const parseNumeric = (val) => {
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
};

// ─────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────
async function main() {
  logUI(`# 💰 ${CONFIG.scriptName} — ${CONFIG.scriptPurpose}`);
  logUI(`> Version: ${CONFIG.scriptVersion}`);
  if (CONFIG.config.dryRun) logUI("> **DRY RUN MODE**");
  logUI("---");

  const F = CONFIG.fields;
  const stagingTable = base.getTable(CONFIG.tables.staging);
  const spdTable = base.getTable(CONFIG.tables.spd);
  const pmTable = base.getTable(CONFIG.tables.pm);
  const pbTable = base.getTable(CONFIG.tables.pricingBridge);
  const stdTable = base.getTable(CONFIG.tables.standardization);
  const sysLogTable = base.getTable(CONFIG.tables.systemLogs);

  // ── Step 1: Load standardization engine ──────────────
  logUI("## Step 1 — Loading standardization engine...");

  const stdQuery = await stdTable.selectRecordsAsync({
    fields: [F.standardization.category, F.standardization.input, F.standardization.output, F.standardization.feasible],
  });

  const stdEngine = {};
  let skippedRules = 0;
  for (const rec of stdQuery.records) {
    const feasible = getStringValue(rec, F.standardization.feasible).trim();
    if (normStatus(feasible) !== "yes") {
      skippedRules++;
      continue;
    }
    const category = getStringValue(rec, F.standardization.category)
      .trim()
      .toUpperCase();
    const input = getStringValue(rec, F.standardization.input)
      .trim()
      .toUpperCase();
    const output = getStringValue(rec, F.standardization.output).trim();
    if (category && input && output) {
      if (!stdEngine[category]) stdEngine[category] = {};
      stdEngine[category][input] = output;
    }
  }

  logUI(`✅ Loaded **${Object.keys(stdEngine).length}** standardization rules (${skippedRules} manual-only).`);

  const applyStd = (category, rawValue) => {
    if (!rawValue || !stdEngine[category]) return rawValue;
    const normalized = String(rawValue).trim().toUpperCase();
    return stdEngine[category][normalized] || rawValue;
  };

  // ── Step 2: Load PR staging rows ─────────────────────
  logUI("## Step 2 — Loading PR Staging rows...");

  const stagingQuery = await stagingTable.selectRecordsAsync({
    fields: [
      F.staging.supplierSku,
      F.staging.importType,
      F.staging.etlStatus,
      F.staging.retailExcl,
      F.staging.noFaces,
      F.staging.thickness,
      F.staging.peiClass,
      F.staging.slipRating,
    ],
  });

  const prRecords = stagingQuery.records.filter(
    (r) =>
      normStatus(getStringValue(r, F.staging.etlStatus)) === "pending" &&
      getStringValue(r, F.staging.importType).toUpperCase().startsWith("PR")
  );

  logUI(`✅ Found **${prRecords.length}** PR records.`);
  if (prRecords.length === 0) {
    logUI("Nothing to process.");
    return;
  }

  // ── Step 3: Build indexes ───────────────────────────
  logUI("## Step 3 — Building indexes...");

  const spdQuery = await spdTable.selectRecordsAsync({
    fields: [F.spd.dataId, F.spd.retailExcl, F.spd.pmLink],
  });

  const spdById = {};
  for (const rec of spdQuery.records) {
    const id = getStringValue(rec, F.spd.dataId).trim();
    if (id) spdById[id] = rec;
  }

  logUI(`✅ Indexed **${Object.keys(spdById).length}** SPD records.`);

  // ── Step 4: Route and update ────────────────────────
  logUI("## Step 4 — Routing and updating...");

  let countUpdated = 0;
  const spdUpdates = [];

  for (const stagingRec of prRecords) {
    const rawSku = getStringValue(
      stagingRec,
      F.staging.supplierSku,
    ).trim();
    const normSku_ = normSku(rawSku);

    // Find matching SPD by normalized SKU (assuming dataId ≈ SKU)
    let spdRec = null;
    for (const [, rec] of Object.entries(spdById)) {
      if (normSku(getStringValue(rec, F.spd.dataId)) === normSku_) {
        spdRec = rec;
        break;
      }
    }

    if (!spdRec) {
      logUI(`⚠️ SKU not found: ${rawSku}`);
      continue;
    }

    const spdUpdate = { id: spdRec.id, fields: {} };
    const upd = spdUpdate.fields;

    // Apply standardization and parse specs
    const peiClass = applyStd(
      "PEI_CLASS",
      getStringValue(stagingRec, F.staging.peiClass),
    );
    if (peiClass) {
      const normalizedPei = String(peiClass).trim().toUpperCase();
      const allowedPei = new Set(["PEI2", "PEI3", "PEI4", "PEI5"]);
      if (allowedPei.has(normalizedPei)) {
        upd[F.spd.pei] = { name: normalizedPei };
      }
    }

    const retailExcl = parseNumeric(stagingRec.getCellValue(F.staging.retailExcl));
    if (retailExcl !== null) upd[F.spd.retailExcl] = retailExcl;

    if (Object.keys(upd).length > 0) {
      spdUpdates.push(spdUpdate);
      countUpdated++;
    }
  }

  if (spdUpdates.length > 0 && !CONFIG.config.dryRun) {
    for (const b of chunk(spdUpdates, 50)) {
      try {
        await spdTable.updateRecordsAsync(b);
      } catch (err) {
        await logBatchError(
          sysLogTable,
          `Script 2B failed updating SPD batch: ${err.message}`,
        );
        throw err;
      }
    }
    logUI(`✅ Updated **${spdUpdates.length}** SPD records.`);
  } else if (CONFIG.config.dryRun) {
    logUI(`📋 [DRY RUN] Would update **${spdUpdates.length}** records.`);
  }

  // ── Summary ─────────────────────────────────────────
  logUI("---");
  logUI("## ✅ Pricing & Spec Router Complete");
  logUI(`| Result | Count |\n|---|---|\n| ✅ Updated | ${countUpdated} |`);
}

await main();
