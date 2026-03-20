/**
 * SCRIPT 3 — PLU GENERATOR v3.2 (Production Ready)
 * 
 * PURPOSE:
 *   Proposes internal PLU codes (163|TT|BBBB|N) for NEW PRODUCTS records
 *   that have complete enrichment data (body type, size, colour).
 * 
 * ARCHITECTURE:
 *   1. Reverse-lookup body type in UPCBodyClass → extract TT code
 *   2. Resolve BBBB from supplier SKU (old-style or new-style)
 *   3. Sequence N within BBBB group
 *   4. Propose to Anomalies for manual verification
 * 
 * TRIGGER: ProductMaster records with Status = "PM NEW" and no PLU
 * 
 * OUTPUT: Creates "PLU_Ready" Anomalies with proposed PLU
 */

// ============================================================
// TABLE IDs
// ============================================================
const PM_TABLE_ID = "tblgLqMMXX2HcKt9U";
const SPD_TABLE_ID = "tbl7mZpHJCUs1r0cg";
const UPC_BODY_CLASS_TBL_ID = "tblTKGGHdw9pUD0yR";
const ANOMALIES_TABLE_ID = "tbl56i9Rlm2mK6t1w";

// ============================================================
// FIELD IDs — ProductMaster
// ============================================================
const PM_SKU_MASTER_FID = "fldMfK3uyPnDbKONn"; // ✅ Product SKU Master (PLU)
const PM_NAME_FID = "?"; // TODO: Replace with actual Product Name/Description field ID
const PM_STATUS_FID = "flddq6S7409EBM71D"; // ✅ Status (PM NEW, PM ACTIVE, etc.)
const PM_SPD_LINK_FID = "fldxZcpnCCCYW5zHx"; // ✅ Link to SupplierProductData
const PM_UBC_LINK_FID = "fldyrCQE5L3lQktS3"; // ✅ Link to UPCBodyClass
const PM_COLOUR_LINK_FID = "fldDBJifgrvsMqR9g"; // ✅ Link to UPCColourMaster
const PM_SIZE_LENGTH_FID = "fld0UAx6ANs6ukXmE"; // ✅ Size Length MM (lookup)
const PM_SIZE_WIDTH_FID = "flddQpgGUlSOJlfBk"; // ✅ Size Width MM (lookup)
const PM_TT_EXTRACTOR_FID = "fldqGQUzzlMkHcx0N"; // Formula: VALUE(MID({SKU}, 4, 2))

// ============================================================
// FIELD IDs — UPCBodyClass
// ============================================================
const UBC_PRODUCT_TYPE_FID = "flddbKj9I5DhNRLsx"; // ✅ Product Type (Ceramic, Porcelain, etc.)
const UBC_CATEGORY_NO_FID = "fldA2oxWnAijIjrpT"; // ✅ Category No ("01", "02", "03", "04")

// ============================================================
// FIELD IDs — SPD (SupplierProductData)
// ============================================================
const SPD_SKU_FID = "fldK3FyPA98F3smc9"; // ✅ Supplier SKU
const SPD_BODY_TYPE_FID = "fldtMpYo9uqtirVW7"; // Body Type (Porcelain, Ceramic) — if standardized

// ============================================================
// FIELD IDs — Anomalies
// ============================================================
const ANOM_ERROR_TYPE_FID = "fldjYiDzJmdYJp6uF"; // Error Type
const ANOM_DETECTED_VAL_FID = "fld0wlmRbNFgVpbXS"; // Detected Value (the PLU)
const ANOM_NOTES_FID = "fldB7o9RtnQPi4goY"; // Notes
const ANOM_SEVERITY_FID = "fld3TPgysD2hLbtvR"; // Severity
const ANOM_DETECTED_BY_FID = "fldbPrkOy6XavA4ef"; // Detected By
const ANOM_RESOLUTION_FID = "fld4li4vcLn43h2N4"; // Resolution Status
const ANOM_DATE_FID = "fldE7JCdKubLvxysd"; // Date Detected

// ============================================================
// CONSTANTS
// ============================================================
const SUPPLIER_CODE = "163";
const PM_STATUS_TRIGGER = "PM NEW"; // Exact status value to filter on
const RESOLUTION_UNRESOLVED = "Unresolved"; // Valid: Unresolved, In Progress, Resolved, etc.

// ============================================================
// DIRTY DATA NORMALIZATION
// ============================================================

/**
 * Normalize messy body type strings to match UPCBodyClass entries.
 * Handles: spaces, case, line breaks, variations like "Red Ceramic" → "Ceramic"
 */
const BODY_TYPE_NORMALIZER = {
  // Ceramic variants (all → "Ceramic")
  "ceramic": "Ceramic",
  "ceramicred": "Ceramic",
  "ceramicwhite": "Ceramic",
  "ceramicredhardword": "Ceramic",
  "hardceramic": "Ceramic",
  "ceramic white": "Ceramic",
  "ceramic red": "Ceramic",
  "white ceramic": "Ceramic",
  "red ceramic": "Ceramic",

  // Porcelain variants (all → "Porcelain")
  "porcelain": "Porcelain",
  "porcelainglazed": "Porcelain",
  "glazedporcelain": "Porcelain",
  "porcelainfullword": "Porcelain",
  "fullwordporcelain": "Porcelain",
  "colourwordporcelain": "Porcelain",
  "colorwordporcelain": "Porcelain",
  "porcelain glazed": "Porcelain",
  "glazed porcelain": "Porcelain",
  "porcelain full body": "Porcelain",
  "colour porcelain": "Porcelain",
  "color porcelain": "Porcelain",

  // Gris Porcelain (special type 03)
  "grisporcelain": "Gris Porcelain",
  "gris porcelain": "Gris Porcelain",
  "greyporcelain": "Gris Porcelain",
  "grey porcelain": "Gris Porcelain",

  // Hard Body Ceramic (special type 02)
  "hardbodyceramic": "Hard body Ceramic",
  "hard body ceramic": "Hard body Ceramic",
};

function normalizeBodyType(rawBodyType) {
  if (!rawBodyType) return null;

  // Clean: lowercase, remove spaces/newlines, remove special chars
  const cleaned = rawBodyType
    .toLowerCase()
    .replace(/[\s\n\r]+/g, "") // Remove all whitespace
    .replace(/[^a-z0-9]/g, ""); // Remove special characters

  // Exact match in normalizer
  if (BODY_TYPE_NORMALIZER[cleaned]) {
    return BODY_TYPE_NORMALIZER[cleaned];
  }

  // Partial/fuzzy match: check if cleaned contains key substrings
  for (const [key, canonical] of Object.entries(BODY_TYPE_NORMALIZER)) {
    if (cleaned.includes(key)) {
      return canonical;
    }
  }

  return null; // Unable to normalize
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

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

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  output.markdown("# 🏷️ Script 3 — PLU Generator v3.2\n");
  output.markdown(`> **Time:** ${new Date().toLocaleString()}\n`);
  output.markdown("> **Mode:** Soft Proposal (writes to Anomalies only)\n");
  output.markdown("---\n");

  const pmTable = base.getTable(PM_TABLE_ID);
  const spdTable = base.getTable(SPD_TABLE_ID);
  const ubcTable = base.getTable(UPC_BODY_CLASS_TBL_ID);
  const anomTable = base.getTable(ANOMALIES_TABLE_ID);

  try {
    // ────────────────────────────────────────────────────────
    // STEP 1 — Load UPCBodyClass & build reverse-lookup
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 1 — Loading UPCBodyClass...");

    const ubcQuery = await ubcTable.selectRecordsAsync({
      fields: [UBC_PRODUCT_TYPE_FID, UBC_CATEGORY_NO_FID],
    });

    // Map: Canonical Product Type → TT Code
    const bodyTypeToTT = new Map();

    for (const r of ubcQuery.records) {
      const productType = r.getCellValueAsString(UBC_PRODUCT_TYPE_FID).trim();
      const categoryNo = r.getCellValueAsString(UBC_CATEGORY_NO_FID).trim();

      if (productType && categoryNo) {
        const tt = zeroPad(parseInt(categoryNo, 10), 2);
        bodyTypeToTT.set(productType, tt);
      }
    }

    output.markdown(`✅ Loaded ${bodyTypeToTT.size} body type mappings.\n`);

    if (bodyTypeToTT.size === 0) {
      output.markdown(
        "❌ **Error:** No body type mappings found in UPCBodyClass. Cannot proceed."
      );
      return;
    }

    // ────────────────────────────────────────────────────────
    // STEP 2 — Index existing PLUs
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 2 — Indexing existing PLUs...");

    const pmAllQuery = await pmTable.selectRecordsAsync({
      fields: [PM_SKU_MASTER_FID],
    });

    const bbbbIndex = {}, maxBbbbPerTt = {};

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

    // Check for already-proposed PLUs in Anomalies
    const anomQuery = await anomTable.selectRecordsAsync({
      fields: [ANOM_ERROR_TYPE_FID, ANOM_DETECTED_VAL_FID, ANOM_RESOLUTION_FID],
    });

    const alreadyProposed = new Set();
    for (const r of anomQuery.records) {
      const type = r.getCellValueAsString(ANOM_ERROR_TYPE_FID);
      const resolution = r.getCellValueAsString(ANOM_RESOLUTION_FID);
      const detVal = r.getCellValueAsString(ANOM_DETECTED_VAL_FID).trim();
      if (type === "PLU_Ready" && resolution !== "Resolved" && detVal) {
        alreadyProposed.add(detVal);
      }
    }

    output.markdown(
      `✅ Indexed ${pmAllQuery.records.length} PM records | ${alreadyProposed.size} open proposals.\n`
    );

    const wBbbbIndex = JSON.parse(JSON.stringify(bbbbIndex));
    const wMaxBbbb = { ...maxBbbbPerTt };
    const wNewStyleMap = {};

    // ────────────────────────────────────────────────────────
    // STEP 3 — Load NEW PRODUCTS records
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 3 — Loading NEW PRODUCTS records...");

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

    output.markdown(`✅ Found ${newProducts.length} records without PLU.\n`);

    if (newProducts.length === 0) {
      output.markdown("✅ All NEW PRODUCTS have PLUs. Nothing to propose.");
      return;
    }

    // ────────────────────────────────────────────────────────
    // STEP 4 — Load SPD and process enrichment
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 4 — Validating enrichment...\n");

    const spdQuery = await spdTable.selectRecordsAsync({
      fields: [SPD_SKU_FID, SPD_BODY_TYPE_FID],
    });
    const spdById = new Map(spdQuery.records.map((r) => [r.id, r]));

    const proposals = [], gated = [], duplicates = [];

    for (const pmRec of newProducts) {
      const name = pmRec.getCellValueAsString(PM_NAME_FID).trim() || pmRec.id;

      // ── Enrichment gate ─────────────────────────────────────
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
      if (!ubcLinks.length) missing.push("UPCBodyClass link");
      if (!sizeLenArr.length || !sizeLenArr[0]) missing.push("Size Length MM");
      if (!sizeWidArr.length || !sizeWidArr[0]) missing.push("Size Width MM");
      if (!colourLinks.length) missing.push("UPCColourMaster link");

      if (missing.length > 0) {
        gated.push({ name, missing: missing.join(", ") });
        continue;
      }

      // ── Resolve TT from UPCBodyClass link ───────────────────
      const ubcRecId = ubcLinks[0].id;
      const ubcRec = ubcQuery.records.find((r) => r.id === ubcRecId);

      if (!ubcRec) {
        gated.push({
          name,
          missing: `UPCBodyClass record ${ubcRecId} not found in index`,
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
          missing: `Body Type "${bodyTypeName}" has no TT code in UPCBodyClass`,
        });
        continue;
      }

      // ── Resolve BBBB from SPD supplier SKU ──────────────────
      const spdLinks = pmRec.getCellValue(PM_SPD_LINK_FID) || [];
      let rawSku = "";

      if (spdLinks.length > 0) {
        const spdRec = spdById.get(spdLinks[0].id);
        if (spdRec) {
          rawSku = spdRec.getCellValueAsString(SPD_SKU_FID).trim();
        }
      }

      let bbbb, bbbbSource;

      if (rawSku && isOldStyleSku(rawSku)) {
        bbbb = extractBBBB(rawSku);
        bbbbSource = `from supplier SKU "${rawSku}"`;
      } else if (rawSku) {
        const groupKey = extractNewStyleGroupKey(rawSku);
        const indexKey = `${tt}|${groupKey}`;

        if (wNewStyleMap[indexKey]) {
          bbbb = wNewStyleMap[indexKey];
          bbbbSource = `reused for group "${groupKey}"`;
        } else {
          const nextInt = (wMaxBbbb[tt] || 0) + 1;
          bbbb = zeroPad(nextInt, 4);
          wMaxBbbb[tt] = nextInt;
          wNewStyleMap[indexKey] = bbbb;
          bbbbSource = `new sequential (${bbbb}) for group "${groupKey}"`;
        }
      } else {
        const nextInt = (wMaxBbbb[tt] || 0) + 1;
        bbbb = zeroPad(nextInt, 4);
        wMaxBbbb[tt] = nextInt;
        bbbbSource = `sequential (${bbbb}, no supplier SKU)`;
      }

      // ── Resolve N (colour sequence) ─────────────────────────
      if (!wBbbbIndex[tt]) wBbbbIndex[tt] = {};
      if (!wBbbbIndex[tt][bbbb]) wBbbbIndex[tt][bbbb] = 0;

      const nextN = wBbbbIndex[tt][bbbb] + 1;
      wBbbbIndex[tt][bbbb] = nextN;

      // ── Assemble PLU ────────────────────────────────────────
      const plu = `${SUPPLIER_CODE}${tt}${bbbb}${nextN}`;

      if (alreadyProposed.has(plu)) {
        duplicates.push({ name, plu });
        continue;
      }

      proposals.push({
        pmRec,
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
    output.markdown("---\n## Step 5 — Preview\n");
    output.markdown(
      `**${proposals.length}** ready | **${gated.length}** blocked | **${duplicates.length}** duplicate\n`
    );

    if (proposals.length > 0) {
      output.markdown(
        "|#|Product|Body Type|TT|BBBB|N|PLU|\n|---|---|---|---|---|---|---|\n"
      );
      proposals.forEach((p, i) => {
        output.markdown(
          `|${i + 1}|${p.name}|${p.bodyType}|${p.tt}|${p.bbbb}|${p.n}|\`${p.plu}\`|\n`
        );
      });
    }

    if (gated.length > 0) {
      output.markdown("\n### ⛔ Blocked (enrichment incomplete)\n");
      gated.forEach((g) => output.markdown(`- **${g.name}**: ${g.missing}\n`));
    }

    if (duplicates.length > 0) {
      output.markdown("\n### ℹ️ Skipped (already proposed)\n");
      duplicates.forEach((d) =>
        output.markdown(`- \`${d.plu}\` — ${d.name}\n`)
      );
    }

    if (proposals.length === 0) {
      output.markdown("\nNo PLUs to propose.");
      return;
    }

    // ────────────────────────────────────────────────────────
    // STEP 6 — Confirm
    // ────────────────────────────────────────────────────────
    output.markdown("---\n");
    const confirm = await input.buttonsAsync(
      `Propose ${proposals.length} PLU${proposals.length !== 1 ? "s" : ""} to Anomalies?`,
      [
        { label: "✅ Yes, proceed", variant: "primary" },
        { label: "❌ Cancel", variant: "danger" },
      ]
    );

    if (confirm !== "✅ Yes, proceed") {
      output.markdown("❌ Cancelled. No records changed.");
      return;
    }

    // ────────────────────────────────────────────────────────
    // STEP 7 — Write proposals to Anomalies
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 6 — Writing proposals...\n");

    const today = new Date().toISOString().split("T")[0];

    const anomCreates = proposals.map((p) => ({
      fields: {
        [ANOM_ERROR_TYPE_FID]: { name: "PLU_Ready" },
        [ANOM_DETECTED_VAL_FID]: p.plu,
        [ANOM_NOTES_FID]:
          `**Proposed PLU:** \`${p.plu}\`\n\n` +
          `**Product:** ${p.name}\n` +
          `**Body Type:** ${p.bodyType} (TT = ${p.tt})\n` +
          `**Supplier SKU:** ${p.rawSku || "—"}\n\n` +
          `**Assembly Breakdown:**\n` +
          `• **163** = Decobella supplier constant\n` +
          `• **${p.tt}** = Type code (${p.bodyType})\n` +
          `• **${p.bbbb}** = Base code (${p.bbbbSource})\n` +
          `• **${p.n}** = Colour sequence in group\n\n` +
          `**Action Required:** Verify the PLU logic is correct.\n` +
          `✅ **If correct:** Copy PLU → open ProductMaster record → paste into **Product_SKU_Master** → return here → set **Resolution = Resolved**\n` +
          `❌ **If incorrect:** Add notes explaining the issue → set **Resolution = Under_Review** → flag for review`,
        [ANOM_SEVERITY_FID]: { name: "Info" },
        [ANOM_DETECTED_BY_FID]: { name: "ETL_Script" },
        [ANOM_RESOLUTION_FID]: { name: RESOLUTION_UNRESOLVED },
        [ANOM_DATE_FID]: today,
      },
    }));

    let written = 0;
    for (const batch of chunk(anomCreates, 50)) {
      try {
        await anomTable.createRecordsAsync(batch);
        written += batch.length;
        output.markdown(
          `✅ Batch written (${written}/${anomCreates.length})\n`
        );
      } catch (err) {
        output.markdown(`\n❌ **Batch Write Failed:** ${err.message}\n`);
        throw err;
      }
    }

    // ────────────────────────────────────────────────────────
    // STEP 8 — Summary & Next Steps
    // ────────────────────────────────────────────────────────
    output.markdown("---\n## ✅ PLU Generator Complete\n");
    output.markdown(
      `|Metric|Count|\n` +
      `|---|---|\n` +
      `|Proposals logged to Anomalies|${written}|\n` +
      `|Blocked (enrichment incomplete)|${gated.length}|\n` +
      `|Skipped (already proposed)|${duplicates.length}|\n`
    );

    output.markdown(
      `\n### 📋 Nina's Workflow — Resolve Proposed PLUs\n\n` +
      `**Filter Anomalies:**\n` +
      `1. Open **Anomalies** table\n` +
      `2. Apply filter: \`Anomaly Type = PLU_Ready\` AND \`Resolution Status = ${RESOLUTION_UNRESOLVED}\`\n\n` +
      `**Review Each PLU:**\n` +
      `3. Click an anomaly record\n` +
      `4. Review the assembly breakdown (TT, BBBB, N logic)\n` +
      `5. Check against Product Name and Supplier SKU\n\n` +
      `**Resolve (If Correct):**\n` +
      `6. Copy the proposed PLU\n` +
      `7. Open the linked ProductMaster record\n` +
      `8. Paste PLU into \`Product_SKU_Master\` field\n` +
      `9. Return to Anomalies → set \`Resolution Status = Resolved\`\n\n` +
      `**Flag (If Incorrect):**\n` +
      `10. Add a note explaining the issue\n` +
      `11. Set \`Resolution Status = Under_Review\`\n` +
      `12. Escalate to team for investigation\n`
    );
  } catch (err) {
    output.markdown(
      `\n## ❌ Script Error\n\n` +
      `**Message:** ${err.message}\n\n` +
      `**Check:**\n` +
      `- All field IDs are correct\n` +
      `- ProductMaster records are linked to UPCBodyClass\n` +
      `- Airtable connectivity is stable\n\n` +
      `**Stack trace:**\n` +
      `\`\`\`\n${err.stack}\n\`\`\``
    );
  }
}

await main();