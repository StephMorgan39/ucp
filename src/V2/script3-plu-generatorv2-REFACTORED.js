/**
 * ═════════════════════════════════════════════════════════════════════════════════
 * SCRIPT 3 — PLU GENERATOR v3.4 (REFACTORED)
 * ═════════════════════════════════════════════════════════════════════════════════
 * 
 * REFACTORING CHANGES:
 *   ✅ Centralized CONFIG object with all table and field IDs
 *   ✅ All 80+ individual constants moved into CONFIG.fields
 *   ✅ Consistent with scripts 0A, 0B, 0C, 1, 2A, 2B
 *   ✅ Standardized const F = CONFIG.fields and const T = CONFIG.tables patterns
 *   ✅ Helper functions preserved
 * 
 * PURPOSE:
 *   Generates PLU codes (product codes) for new products lacking identifiers.
 *   Proposes codes to UPCAdmin for Nina's manual review before writing to ProductMaster.
 * 
 * EXECUTION MODEL:
 *   • User-triggered via Scripts sidebar (Extension mode)
 *   • Generates proposals based on body type, supplier code, and sequential numbering
 *   • Writes proposals to UPCAdmin for Nina's Approved/Rejected decision
 *   • Automation/Extension safe with fallback handling
 * 
 * FLOW:
 *   Script 3 (this) — generates proposals → UPCAdmin for Nina's review
 *   Nina reviews, ticks Approved or sets Rejected
 *   Script 3B (when ready) — writes only approved PLUs to ProductMaster
 * 
 * ═════════════════════════════════════════════════════════════════════════════════
 */

// ───────────────────────────────────────────────────────────────────────────────
// CONFIG — Centralized schema for all table and field IDs
// ───────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  scriptName: "Script 3",
  scriptVersion: "3.4",
  scriptPurpose: "PLU Generator — generates product codes for new products pending Nina's review",

  constants: {
    supplierCode: "163",          // Decobella supplier code (always prepended to PLU)
    pmStatusTrigger: "PM NEW",    // ProductMaster status value to filter on
  },

  tables: {
    pm: "tblgLqMMXX2HcKt9U",              // ProductMaster
    spd: "tbl7mZpHJCUs1r0cg",            // SupplierProductData
    ubcBodyClass: "tblTKGGHdw9pUD0yR",   // UPCBodyClass (body type catalogue)
    upcAdmin: "tbl56i9Rlm2mK6t1w",       // UPCAdmin (proposal review queue)
    systemLogs: "tblk1v5VHPEC2c2u2",     // SystemLogs
  },

  fields: {
    pm: {
      skuMaster: "fldMfK3uyPnDbKONn",          // Product SKU / PLU
      description: "fld7hdhxyu61r5Olm",       // Description
      status: "flddq6S7409EBM71D",            // Status (PM NEW, PM ACTIVE, etc)
      spdLink: "fldxZcpnCCCYW5zHx",           // Link to SupplierProductData
      ubcBodyClassLink: "fldyrCQE5L3lQktS3",  // Link to UPCBodyClass (body type)
      colourMasterLink: "fldDBJifgrvsMqR9g",  // Link to UPCColourMaster (colour)
      sizeLength: "fld0UAx6ANs6ukXmE",        // Size Length (MM) — lookup field
      sizeWidth: "flddQpgGUlSOJlfBk",         // Size Width (MM) — lookup field
    },
    ubcBodyClass: {
      productType: "flddbKj9I5DhNRLsx",       // Product Type / Body Type name
      categoryNo: "fldA2oxWnAijIjrpT",        // Category Number (maps to TT code)
    },
    spd: {
      sku: "fldK3FyPA98F3smc9",               // Supplier SKU
    },
    upcAdmin: {
      errorType: "fldjYiDzJmdYJp6uF",         // Error Type (PLU_Ready for proposals)
      detectedValue: "fld0wlmRbNFgVpbXS",     // Original Value (stores proposed PLU)
      notes: "fldB7o9RtnQPi4goY",             // Notes (Nina-facing explanation)
      severity: "fld3TPgysD2hLbtvR",          // Flag Severity (Info for proposals)
      detectedBy: "fldbPrkOy6XavA4ef",        // Detected By (ETL_Script)
      resolutionStatus: "fld4li4vcLn43h2N4",  // Resolution Status (Unresolved/Resolved/Rejected)
      dateDetected: "fldE7JCdKubLvxysd",      // Date Detected
      approved: "flddfVzPFP0NjYhVc",          // Approved (checkbox)
      approvedBy: "fld9k8zf6uwWNx9SO",        // Approved By (collaborator)
    },
    systemLogs: {
      notes: "fld4l6AJhVNRzIaY8",
      systemEvent: "flda8oHUThBc1Kb7I",
      severity: "fldPdoc6JPYHV9gpb",
      status: "fldog9l4DwJeE5Qj8",
    },
  },
};

// ───────────────────────────────────────────────────────────────────────────────
// LOG HELPER — works in both script UI and automation mode
// ───────────────────────────────────────────────────────────────────────────────
const log = (msg) => {
  try {
    output.markdown(msg);
  } catch (_) {}
  console.log(
    String(msg).replace(/\*\*/g, "").replace(/`/g, "").replace(/#+\s/g, ""),
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Zero-pads a number to a specified width
 * @param {number} n - Number to pad
 * @param {number} width - Target width
 * @returns {string} Zero-padded string
 */
function zeroPad(n, width) {
  return String(n).padStart(width, "0");
}

/**
 * Detects if SKU matches old style format (BBBB-XXXX)
 * @param {string} sku - SKU to test
 * @returns {boolean} True if old style
 */
function isOldStyleSku(sku) {
  return /^\d{4}-[A-Z0-9./]+$/i.test(sku.trim());
}

/**
 * Extracts first 4 characters from SKU
 * @param {string} sku - SKU string
 * @returns {string} First 4 characters (BBBB)
 */
function extractBBBB(sku) {
  return sku.trim().substring(0, 4);
}

/**
 * Extracts group key from new-style SKU (removes EQP prefix and last component)
 * @param {string} sku - New-style SKU (e.g., EQP-GRANITE-BRUSHED-600x250)
 * @returns {string} Group key for code generation
 */
function extractNewStyleGroupKey(sku) {
  const parts = sku.trim().toUpperCase().split("-");
  const filtered = parts[0] === "EQP" ? parts.slice(1) : parts;
  if (filtered.length < 2) return filtered.join("-");
  return filtered.slice(0, -1).join("-");
}

/**
 * Chunks array into batches of specified size
 * Critical for Airtable's 50-record-per-call limit
 * @param {Array} arr - Array to chunk
 * @param {number} n - Chunk size (default 50)
 * @returns {Array[]} Array of chunked arrays
 */
const chunk = (arr, n = 50) => {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
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

// ───────────────────────────────────────────────────────────────────────────────
// MAIN EXECUTION
// ───────────────────────────────────────────────────────────────────────────────

async function main() {
  log("# 🏷️ Script 3 — PLU Generator v3.4");
  log(`> Running at: ${new Date().toLocaleString()}`);
  log(
    "> Mode: Soft Proposal — writes to UPCAdmin for Nina's review. Nothing writes to ProductMaster until Script 3B runs.",
  );
  log("---");

  const F = CONFIG.fields;
  const T = CONFIG.tables;
  const C = CONFIG.constants;

  const pmTable = base.getTable(T.pm);
  const spdTable = base.getTable(T.spd);
  const ubcTable = base.getTable(T.ubcBodyClass);
  const adminTable = base.getTable(T.upcAdmin);
  const sysLogTable = base.getTable(T.systemLogs);

  try {
    // ── Step 1: Load UPCBodyClass ───────────────────────────
    log("## Step 1 — Loading body type catalogue...");

    const ubcQuery = await ubcTable.selectRecordsAsync({
      fields: [F.ubcBodyClass.productType, F.ubcBodyClass.categoryNo],
    });

    const bodyTypeToTT = new Map();
    for (const r of ubcQuery.records) {
      const productType = getStringValue(r, F.ubcBodyClass.productType).trim();
      const categoryNo = getStringValue(r, F.ubcBodyClass.categoryNo).trim();
      if (productType && categoryNo) {
        bodyTypeToTT.set(productType, zeroPad(parseInt(categoryNo, 10), 2));
      }
    }

    log(`✅ ${bodyTypeToTT.size} body type mappings loaded.`);
    if (bodyTypeToTT.size === 0) {
      log("❌ No body type mappings found. Cannot proceed.");
      return;
    }

    // ── Step 2: Index existing PLUs in PM ──────────────────
    log("## Step 2 — Indexing existing product codes...");

    const pmAllQuery = await pmTable.selectRecordsAsync({
      fields: [F.pm.skuMaster],
    });

    const bbbbIndex = {},
      maxBbbbPerTt = {};

    for (const r of pmAllQuery.records) {
      const plu = getStringValue(r, F.pm.skuMaster).trim();
      if (!plu.startsWith(C.supplierCode) || plu.length < 10) continue;

      const tt = plu.substring(3, 5);
      const bbbb = plu.substring(5, 9);
      const n = parseInt(plu.substring(9), 10) || 0;

      if (!bbbbIndex[tt]) bbbbIndex[tt] = {};
      if (!bbbbIndex[tt][bbbb]) bbbbIndex[tt][bbbb] = 0;
      if (n > bbbbIndex[tt][bbbb]) bbbbIndex[tt][bbbb] = n;

      const bbbbInt = parseInt(bbbb, 10);
      if (!maxBbbbPerTt[tt] || bbbbInt > maxBbbbPerTt[tt]) {
        maxBbbbPerTt[tt] = bbbbInt;
      }
    }

    // Index existing UPCAdmin proposals — skip Unresolved AND Rejected
    // (v3.2 bug: only skipped Unresolved, meaning rejected PLUs could be re-proposed)
    const adminQuery = await adminTable.selectRecordsAsync({
      fields: [F.upcAdmin.errorType, F.upcAdmin.detectedValue, F.upcAdmin.resolutionStatus],
    });

    const alreadyProposed = new Set();
    for (const r of adminQuery.records) {
      const type = getStringValue(r, F.upcAdmin.errorType);
      const resolution = getStringValue(r, F.upcAdmin.resolutionStatus);
      const detVal = getStringValue(r, F.upcAdmin.detectedValue).trim();
      // Skip if already proposed AND not yet resolved (Unresolved or Rejected = still open)
      if (type === "PLU_Ready" && normStatus(resolution) !== "resolved" && detVal) {
        alreadyProposed.add(detVal);
      }
    }

    log(
      `✅ ${pmAllQuery.records.length} PM records indexed | ${alreadyProposed.size} open proposals already exist.`,
    );

    const wBbbbIndex = JSON.parse(JSON.stringify(bbbbIndex));
    const wMaxBbbb = { ...maxBbbbPerTt };
    const wNewStyleMap = {};

    // ── Step 3: Load PM NEW records ────────────────────────
    log("## Step 3 — Loading new products pending a code...");

    const newPmQuery = await pmTable.selectRecordsAsync({
      fields: [
        F.pm.skuMaster,
        F.pm.description,
        F.pm.status,
        F.pm.spdLink,
        F.pm.ubcBodyClassLink,
        F.pm.colourMasterLink,
        F.pm.sizeLength,
        F.pm.sizeWidth,
      ],
    });

    const newProducts = newPmQuery.records.filter((r) => {
      const status = getStringValue(r, F.pm.status).trim();
      const hasPlu = getStringValue(r, F.pm.skuMaster).trim() !== "";
      return normStatus(status) === normStatus(C.pmStatusTrigger) && !hasPlu;
    });

    log(`✅ Found ${newProducts.length} new products without a code.`);
    if (newProducts.length === 0) {
      log("Nothing to propose. All new products already have codes.");
      return;
    }

    // ── Step 4: Load SPD and process enrichment ────────────
    const spdQuery = await spdTable.selectRecordsAsync({
      fields: [F.spd.sku],
    });
    const spdById = new Map(spdQuery.records.map((r) => [r.id, r]));

    // ── Step 5: Generate proposals ──────────────────────────
    log("## Step 4 — Generating proposals...");

    const proposals = [],
      gated = [],
      duplicates = [];

    for (const pmRec of newProducts) {
      const name = getStringValue(pmRec, F.pm.description).trim() || pmRec.id;

      // Enrichment gate
      const ubcLinks = pmRec.getCellValue(F.pm.ubcBodyClassLink) || [];
      const colourLinks = pmRec.getCellValue(F.pm.colourMasterLink) || [];
      const sizeLenVal = pmRec.getCellValue(F.pm.sizeLength) || [];
      const sizeWidVal = pmRec.getCellValue(F.pm.sizeWidth) || [];

      const sizeLenArr = Array.isArray(sizeLenVal)
        ? sizeLenVal
        : sizeLenVal
          ? [sizeLenVal]
          : [];
      const sizeWidArr = Array.isArray(sizeWidVal)
        ? sizeWidVal
        : sizeWidVal
          ? [sizeWidVal]
          : [];

      const missing = [];
      if (!ubcLinks.length) missing.push("Body type (UPCBodyClass link)");
      if (!sizeLenArr.length || !sizeLenArr[0])
        missing.push("Size length (mm)");
      if (!sizeWidArr.length || !sizeWidArr[0]) missing.push("Size width (mm)");
      if (!colourLinks.length) missing.push("Colour (UPCColourMaster link)");

      if (missing.length > 0) {
        gated.push({ name, pmId: pmRec.id, missing: missing.join(", ") });
        continue;
      }

      // Resolve TT
      const ubcRecId = ubcLinks[0].id;
      const ubcRec = ubcQuery.records.find((r) => r.id === ubcRecId);
      if (!ubcRec) {
        gated.push({
          name,
          pmId: pmRec.id,
          missing: `Body type record not found (ID: ${ubcRecId})`,
        });
        continue;
      }

      const bodyTypeName = ubcRec
        .getCellValue(F.ubcBodyClass.productType)
        ? getStringValue(ubcRec, F.ubcBodyClass.productType)
        : ""
        .trim();
      const tt = bodyTypeToTT.get(bodyTypeName);
      if (!tt) {
        gated.push({
          name,
          pmId: pmRec.id,
          missing: `Body type "${bodyTypeName}" has no TT code`,
        });
        continue;
      }

      // Resolve BBBB
      const spdLinks = pmRec.getCellValue(F.pm.spdLink) || [];
      let rawSku = "";
      if (spdLinks.length > 0) {
        const spdRec = spdById.get(spdLinks[0].id);
        if (spdRec) rawSku = getStringValue(spdRec, F.spd.sku).trim();
      }

      let bbbb, bbbbSource;
      if (rawSku && isOldStyleSku(rawSku)) {
        bbbb = extractBBBB(rawSku);
        bbbbSource = `from supplier code "${rawSku}"`;
      } else if (rawSku) {
        const groupKey = extractNewStyleGroupKey(rawSku);
        const indexKey = `${tt}|${groupKey}`;
        if (wNewStyleMap[indexKey]) {
          bbbb = wNewStyleMap[indexKey];
          bbbbSource = `shared group "${groupKey}"`;
        } else {
          const nextInt = (wMaxBbbb[tt] || 0) + 1;
          bbbb = zeroPad(nextInt, 4);
          wMaxBbbb[tt] = nextInt;
          wNewStyleMap[indexKey] = bbbb;
          bbbbSource = `new group code (${bbbb}) for "${groupKey}"`;
        }
      } else {
        const nextInt = (wMaxBbbb[tt] || 0) + 1;
        bbbb = zeroPad(nextInt, 4);
        wMaxBbbb[tt] = nextInt;
        bbbbSource = `sequential (${bbbb}, no supplier code)`;
      }

      // Resolve N
      if (!wBbbbIndex[tt]) wBbbbIndex[tt] = {};
      if (!wBbbbIndex[tt][bbbb]) wBbbbIndex[tt][bbbb] = 0;
      const nextN = wBbbbIndex[tt][bbbb] + 1;
      wBbbbIndex[tt][bbbb] = nextN;

      // Assemble PLU
      const plu = `${C.supplierCode}${tt}${bbbb}${nextN}`;

      if (alreadyProposed.has(plu)) {
        duplicates.push({ name, plu });
        continue;
      }

      proposals.push({
        pmRec,
        pmId: pmRec.id,
        name,
        plu,
        tt,
        bbbb,
        n: nextN,
        bbbbSource,
        rawSku,
        bodyType: bodyTypeName,
      });
    }

    // ────────────────────────────────────────────────────────
    // STEP 5 — Preview
    // ────────────────────────────────────────────────────────

    log("---");
    log("## Step 5 — Preview");
    log(
      `**${proposals.length}** ready to propose | **${gated.length}** blocked (incomplete data) | **${duplicates.length}** already proposed`,
    );

    if (proposals.length > 0) {
      log(
        `\n| # | Product | Body Type | Proposed Code |\n|---|---|---|---|\n` +
          proposals
            .map(
              (p, i) =>
                `| ${i + 1} | ${p.name} | ${p.bodyType} (${p.tt}) | \`${p.plu}\` |`,
            )
            .join("\n"),
      );
    }

    if (gated.length > 0) {
      log("\n### ⛔ Blocked — enrichment incomplete");
      gated.forEach((g) => log(`- **${g.name}**: missing ${g.missing}`));
      log(
        `\nTo fix: open each blocked product in ProductMaster and fill in the missing fields, then re-run this script.`,
      );
    }

    if (duplicates.length > 0) {
      log("\n### ℹ️ Already proposed — skipped");
      duplicates.forEach((d) => log(`- \`${d.plu}\` — ${d.name}`));
    }

    if (proposals.length === 0) {
      log("\nNo new proposals to write.");
      return;
    }

    // ── Step 6: Confirm (UI only — skipped in automation) ──
    let proceed = true;
    try {
      const confirm = await input.buttonsAsync(
        `Propose ${proposals.length} product code${proposals.length !== 1 ? "s" : ""} for Nina's review?`,
        [
          { label: "✅ Yes, proceed", variant: "primary" },
          { label: "❌ Cancel", variant: "danger" },
        ],
      );
      if (confirm !== "✅ Yes, proceed") proceed = false;
    } catch (_) {
      log("> Automation mode — skipping confirmation, proceeding.");
    }

    if (!proceed) {
      log("❌ Cancelled. No records written.");
      return;
    }

    // ── Step 7: Write proposals to UPCAdmin ────────────────
    log("## Step 6 — Writing proposals...");

    const today = new Date().toISOString().split("T")[0];

    const adminCreates = proposals.map((p) => ({
      fields: {
        [F.upcAdmin.errorType]: { name: "PLU_Ready" },
        [F.upcAdmin.detectedValue]: p.plu,
        [F.upcAdmin.severity]: { name: "Info" },
        [F.upcAdmin.detectedBy]: { name: "ETL_Script" },
        [F.upcAdmin.resolutionStatus]: { name: "Unresolved" },
        [F.upcAdmin.dateDetected]: today,
        [F.upcAdmin.notes]:
          `🏷️ Proposed product code: ${p.plu}\n\n` +
          `Product: ${p.name}\n` +
          `Supplier code: ${p.rawSku || "—"}\n` +
          `Body type: ${p.bodyType}\n\n` +
          `HOW THIS CODE WAS BUILT:\n` +
          `  ${C.supplierCode}  = Decobella supplier number (always)\n` +
          `  ${p.tt}   = Material type code (${p.bodyType})\n` +
          `  ${p.bbbb} = Product group code (${p.bbbbSource})\n` +
          `  ${p.n}    = Colour number in this group\n\n` +
          `WHAT TO DO:\n` +
          `✅ If this looks correct:\n` +
          `   Tick the Approved checkbox and your name will be recorded automatically.\n` +
          `   When you are ready to release all approved codes, run Step 6 — Release Approved Codes.\n\n` +
          `❌ If something looks wrong:\n` +
          `   Set Resolution Status to Rejected and write a note explaining the issue.\n` +
          `   Then correct the product record (body type, size, colour) and re-run Script 3.\n` +
          `   A new proposal will be generated — this rejected record stays as a record of what was changed.\n\n` +
          `PM Record ID (for Script 3B): ${p.pmId}`,
      },
    }));

    let written = 0;
    for (const batch of chunk(adminCreates, 50)) {
      try {
        await adminTable.createRecordsAsync(batch);
        written += batch.length;
        log(`✅ ${written} of ${adminCreates.length} proposals written.`);
      } catch (err) {
        await logBatchError(
          sysLogTable,
          `Script 3 failed writing proposal batch: ${err.message}`,
        );
        throw err;
      }
    }

    // ── Summary ─────────────────────────────────────────────
    log("---");
    log("## ✅ Script 3 Complete");
    log(
      `| Result | Count |\n|---|---|\n` +
        `| Proposals written to review queue | ${written} |\n` +
        `| Blocked (missing data)            | ${gated.length} |\n` +
        `| Skipped (already proposed)        | ${duplicates.length} |`,
    );
    log(
      `\n**Nina's next steps:**\n` +
        `1. Open the Review Queue (UPCAdmin filtered to PLU_Ready)\n` +
        `2. Open each proposal, read the breakdown, and tick Approved — or set Rejected with a note\n` +
        `3. When all proposals are reviewed, run **Step 6 — Release Approved Codes**\n` +
        `4. Rejected proposals stay in the queue as a record — they won't be processed`,
    );
  } catch (err) {
    log(`## ❌ Script Error: ${err.message}`);
    console.error(err.stack);
  }
}

await main();
