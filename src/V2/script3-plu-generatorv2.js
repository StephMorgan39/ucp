/**
 * SCRIPT 3 — PLU GENERATOR v3.3
 * Utile PIM | Base: appefUQrLFZYN4Y5t
 *
 * CHANGES FROM v3.2:
 *   - output.markdown() → log() helper (automation safe)
 *   - input.buttonsAsync() wrapped in try/catch (automation safe)
 *   - Notes field rewritten to Nina-facing plain English
 *   - alreadyProposed check now also excludes Rejected proposals (bug fix)
 *   - APPROVED BY field constant added
 *   - PM record link written to UPCAdmin so Script 3B knows where to write the PLU
 *
 * FLOW:
 *   Script 3 (this script) — proposes PLUs to UPCAdmin for Nina's review
 *   Nina reviews each record individually, ticks Approved or sets Rejected
 *   When Nina is ready, she triggers Script 3B (batch release)
 *   Script 3B writes all approved PLUs to ProductMaster in one pass
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

// ============================================================
// TABLE IDs
// ============================================================
const PM_TABLE_ID = "tblgLqMMXX2HcKt9U";
const SPD_TABLE_ID = "tbl7mZpHJCUs1r0cg";
const UPC_BODY_CLASS_TBL_ID = "tblTKGGHdw9pUD0yR";
const UPCADMIN_TABLE_ID = "tbl56i9Rlm2mK6t1w"; // UPCAdmin (used as proposal table)

// ============================================================
// FIELD IDs — ProductMaster
// ============================================================
const PM_SKU_MASTER_FID = "fldMfK3uyPnDbKONn"; //✅ Product SKU
const PM_NAME_FID = "fld7hdhxyu61r5Olm"; // ✅ Description field ID
const PM_STATUS_FID = "flddq6S7409EBM71D"; // ✅ Status (PM NEW, PM ACTIVE, etc.
const PM_SPD_LINK_FID = "fldxZcpnCCCYW5zHx"; //✅ Link to SupplierProductData
const PM_UBC_LINK_FID = "fldyrCQE5L3lQktS3"; // ✅ Link to UPCBodyClass
const PM_COLOUR_LINK_FID = "fldDBJifgrvsMqR9g"; // ✅ Link to UPCColourMaster
const PM_SIZE_LENGTH_FID = "fld0UAx6ANs6ukXmE"; // ✅ Size Length MM (lookup)
const PM_SIZE_WIDTH_FID = "flddQpgGUlSOJlfBk"; // ✅ Size Width MM (lookup)

// ============================================================
// FIELD IDs — UPCBodyClass
// ============================================================
const UBC_PRODUCT_TYPE_FID = "flddbKj9I5DhNRLsx";
const UBC_CATEGORY_NO_FID = "fldA2oxWnAijIjrpT";

// ============================================================
// FIELD IDs — SPD
// ============================================================
const SPD_SKU_FID = "fldK3FyPA98F3smc9";

// ============================================================
// FIELD IDs — UPCAdmin
// ============================================================
const ANOM_ERROR_TYPE_FID = "fldjYiDzJmdYJp6uF"; // Error Type
const ANOM_DETECTED_VAL_FID = "fld0wlmRbNFgVpbXS"; // Original Value (stores proposed PLU)
const ANOM_NOTES_FID = "fldB7o9RtnQPi4goY"; // Notes (Nina-facing explanation)
const ANOM_SEVERITY_FID = "fld3TPgysD2hLbtvR"; // Flag Severity
const ANOM_DETECTED_BY_FID = "fldbPrkOy6XavA4ef"; // Detected By
const ANOM_RESOLUTION_FID = "fld4li4vcLn43h2N4"; // Resolution Status
const ANOM_DATE_FID = "fldE7JCdKubLvxysd"; // Date Detected
const ANOM_APPROVED_FID = "flddfVzPFP0NjYhVc"; // Approved (checkbox)
const ANOM_APPROVED_BY_FID = "fld9k8zf6uwWNx9SO"; // APPROVED BY (collaborator)
// NOTE: UPCAdmin does not currently have a PM link field.
// Script 3B uses the Original Value (PLU) to find and update the PM record.
// If a direct PM link field is added to UPCAdmin later, update Script 3B accordingly.

// ============================================================
// CONSTANTS
// ============================================================
const SUPPLIER_CODE = "163";
const PM_STATUS_TRIGGER = "PM NEW"; // Exact status value to filter on

// ============================================================
// HELPERS
// ============================================================
const log2 = (msg) => log(msg); // alias for readability

function zeroPad(n, width) {
  return String(n).padStart(width, "0");
}

function isOldStyleSku(sku) {
  return /^\d{4}-[A-Z0-9./]+$/i.test(sku.trim());
}

function extractBBBB(sku) {
  return sku.trim().substring(0, 4);
}

function extractNewStyleGroupKey(sku) {
  const parts = sku.trim().toUpperCase().split("-");
  const filtered = parts[0] === "EQP" ? parts.slice(1) : parts;
  if (filtered.length < 2) return filtered.join("-");
  return filtered.slice(0, -1).join("-");
}

const chunk = (arr, n) => {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
};

// ============================================================
// MAIN
// ============================================================
async function main() {
  log("# 🏷️ Script 3 — PLU Generator v3.3");
  log(`> Running at: ${new Date().toLocaleString()}`);
  log(
    "> Mode: Soft Proposal — writes to UPCAdmin for Nina's review. Nothing writes to ProductMaster until Script 3B runs.",
  );
  log("---");

  const pmTable = base.getTable(PM_TABLE_ID);
  const spdTable = base.getTable(SPD_TABLE_ID);
  const ubcTable = base.getTable(UPC_BODY_CLASS_TBL_ID);
  const adminTable = base.getTable(UPCADMIN_TABLE_ID);

  try {
    // ── Step 1: Load UPCBodyClass ───────────────────────────
    log("## Step 1 — Loading body type catalogue...");

    const ubcQuery = await ubcTable.selectRecordsAsync({
      fields: [UBC_PRODUCT_TYPE_FID, UBC_CATEGORY_NO_FID],
    });

    const bodyTypeToTT = new Map();
    for (const r of ubcQuery.records) {
      const productType = r.getCellValueAsString(UBC_PRODUCT_TYPE_FID).trim();
      const categoryNo = r.getCellValueAsString(UBC_CATEGORY_NO_FID).trim();
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
      fields: [PM_SKU_MASTER_FID],
    });

    const bbbbIndex = {},
      maxBbbbPerTt = {};

    for (const r of pmAllQuery.records) {
      const plu = r.getCellValueAsString(PM_SKU_MASTER_FID).trim();
      if (!plu.startsWith("163") || plu.length < 10) continue;

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
      fields: [ANOM_ERROR_TYPE_FID, ANOM_DETECTED_VAL_FID, ANOM_RESOLUTION_FID],
    });

    const alreadyProposed = new Set();
    for (const r of adminQuery.records) {
      const type = r.getCellValueAsString(ANOM_ERROR_TYPE_FID);
      const resolution = r.getCellValueAsString(ANOM_RESOLUTION_FID);
      const detVal = r.getCellValueAsString(ANOM_DETECTED_VAL_FID).trim();
      // Skip if already proposed AND not yet resolved (Unresolved or Rejected = still open)
      if (type === "PLU_Ready" && resolution !== "Resolved" && detVal) {
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
        PM_SKU_MASTER_FID,
        PM_NAME_FID,
        PM_STATUS_FID,
        PM_SPD_LINK_FID,
        PM_UBC_LINK_FID,
        PM_COLOUR_LINK_FID,
        PM_SIZE_LENGTH_FID,
        PM_SIZE_WIDTH_FID,
      ],
    });

    const newProducts = newPmQuery.records.filter((r) => {
      const status = r.getCellValueAsString(PM_STATUS_FID).trim();
      const hasPlu = r.getCellValueAsString(PM_SKU_MASTER_FID).trim() !== "";
      return status === PM_STATUS_TRIGGER && !hasPlu;
    });

    log(`✅ Found ${newProducts.length} new products without a code.`);
    if (newProducts.length === 0) {
      log("Nothing to propose. All new products already have codes.");
      return;
    }

    // ──────────────────────────────────────
    // STEP 4 — Load SPD and process enrichment
    // ────────────────────────────────────────────────────────
    const spdQuery = await spdTable.selectRecordsAsync({
      fields: [SPD_SKU_FID],
    });
    const spdById = new Map(spdQuery.records.map((r) => [r.id, r]));

    // ── Step 5: Generate proposals ──────────────────────────
    log("## Step 4 — Generating proposals...");

    const proposals = [],
      gated = [],
      duplicates = [];

    for (const pmRec of newProducts) {
      const name = pmRec.getCellValueAsString(PM_NAME_FID).trim() || pmRec.id;

      // Enrichment gate
      const ubcLinks = pmRec.getCellValue(PM_UBC_LINK_FID) || [];
      const colourLinks = pmRec.getCellValue(PM_COLOUR_LINK_FID) || [];
      const sizeLenVal = pmRec.getCellValue(PM_SIZE_LENGTH_FID) || [];
      const sizeWidVal = pmRec.getCellValue(PM_SIZE_WIDTH_FID) || [];

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
        .getCellValueAsString(UBC_PRODUCT_TYPE_FID)
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
      const spdLinks = pmRec.getCellValue(PM_SPD_LINK_FID) || [];
      let rawSku = "";
      if (spdLinks.length > 0) {
        const spdRec = spdById.get(spdLinks[0].id);
        if (spdRec) rawSku = spdRec.getCellValueAsString(SPD_SKU_FID).trim();
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
      const plu = `${SUPPLIER_CODE}${tt}${bbbb}${nextN}`;

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
        [ANOM_ERROR_TYPE_FID]: { name: "PLU_Ready" },
        [ANOM_DETECTED_VAL_FID]: p.plu,
        [ANOM_SEVERITY_FID]: { name: "Info" },
        [ANOM_DETECTED_BY_FID]: { name: "ETL_Script" },
        [ANOM_RESOLUTION_FID]: { name: "Unresolved" },
        [ANOM_DATE_FID]: today,
        [ANOM_NOTES_FID]:
          `🏷️ Proposed product code: ${p.plu}\n\n` +
          `Product: ${p.name}\n` +
          `Supplier code: ${p.rawSku || "—"}\n` +
          `Body type: ${p.bodyType}\n\n` +
          `HOW THIS CODE WAS BUILT:\n` +
          `  163  = Decobella supplier number (always)\n` +
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
      await adminTable.createRecordsAsync(batch);
      written += batch.length;
      log(`✅ ${written} of ${adminCreates.length} proposals written.`);
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
