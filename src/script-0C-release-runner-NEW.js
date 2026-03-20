/**
 * SCRIPT 0A — RENAME DETECTOR v2.1
 * Improvements: Error handling, output.markdown, graceful empty handling
 */

const FUZZY_THRESHOLD = 0.85;
const ADMIN_LOGS_TABLE_ID = "tblk1v5VHPEC2c2u2";
const SPD_TABLE_ID = "tbl7mZpHJCUs1r0cg";
const PM_TABLE_ID = "tblgLqMMXX2HcKt9U";
const STAGING_TABLE_ID = "tblcPSP5NcP0ioUP8";

const SPD_SKU_FID = "fldK3FyPA98F3smc9";
const SPD_DESC_FID = "fldoROoSpEm5FuUnI";
const SPD_PM_LINK_FID = "fldGxaIlPVor7QEwN";

const PM_SKU_MASTER_FID = "fldMfK3uyPnDbKONn";
const PM_STATUS_FID = "flddq6S7409EBM71D";

const STG_SUPPLIER_SKU_FID = "fldeEd9FiNq5AtGNk";
const STG_DESC_FID = "fldkAm1iLOJJYmzmi";
const STG_STATUS_FID = "fldbrUDvLv8OEnEqh";
const STG_IMPORT_TYPE_FID = "fldjdRY1TAJypmcPF";

const LOG_NOTES_FID = "fld4l6AJhVNRzIaY8";
const LOG_SEVERITY_FID = "fldPdoc6JPYHV9gpb";
const LOG_TYPE_FID = "flda8oHUThBc1Kb7I";

// ────────────────────────────────────────────────────────
// Levenshtein Similarity (0.0 to 1.0)
// ────────────────────────────────────────────────────────
function similarity(a, b) {
  a = String(a).toLowerCase().trim();
  b = String(b).toLowerCase().trim();
  if (a === b) return 1.0;
  const la = a.length, lb = b.length;
  if (!la || !lb) return 0;
  
  const dp = Array.from({ length: la + 1 }, (_, i) =>
    Array.from({ length: lb + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  
  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return 1 - dp[la][lb] / Math.max(la, lb);
}

function normalise(desc) {
  return String(desc)
    .toLowerCase()
    .replace(/\d+(\.\d+)?\s*mm/g, '') // Strip dimensions
    .replace(/\d+x\d+/g, '') // Strip WxH
    .replace(/[^a-z\s]/g, ' ') // Strip non-alpha
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  output.markdown("# 🔍 Script 0A — Rename Detector v2.1");
  
  const stagingTable = base.getTable(STAGING_TABLE_ID);
  const spdTable = base.getTable(SPD_TABLE_ID);
  const pmTable = base.getTable(PM_TABLE_ID);
  const logTable = base.getTable(ADMIN_LOGS_TABLE_ID);
  
  try {
    // ────────────────────────────────────────────────────────
    // STEP 1 — Load pending Staging rows
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 1 — Loading pending Staging records...");
    
    const stagingQ = await stagingTable.selectRecordsAsync({
      fields: [STG_SUPPLIER_SKU_FID, STG_DESC_FID, STG_STATUS_FID, STG_IMPORT_TYPE_FID]
    });
    
    const pendingRows = stagingQ.records.filter((r) => {
      const status = r.getCellValueAsString(STG_STATUS_FID).trim().toUpperCase();
      const type = r.getCellValueAsString(STG_IMPORT_TYPE_FID).trim().toUpperCase();
      return status === "PENDING" && type === "ST"; // Stock Transfer only
    });
    
    output.markdown(`✅ Found **${pendingRows.length}** pending ST records`);
    
    if (pendingRows.length === 0) {
      output.markdown("No records to process. Exiting.");
      return;
    }
    
    // ────────────────────────────────────────────────────────
    // STEP 2 — Load SPD index
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 2 — Loading SPD index...");
    
    const spdQ = await spdTable.selectRecordsAsync({
      fields: [SPD_SKU_FID, SPD_DESC_FID, SPD_PM_LINK_FID]
    });
    
    const spdBySkuUpper = new Map();
    const spdByNormDesc = new Map();
    
    for (const r of spdQ.records) {
      const sku = r.getCellValueAsString(SPD_SKU_FID).trim().toUpperCase();
      const desc = r.getCellValueAsString(SPD_DESC_FID).trim();
      
      if (sku) spdBySkuUpper.set(sku, r);
      if (desc.length >= 5) spdByNormDesc.set(normalise(desc), r);
    }
    
    output.markdown(`✅ Indexed **${spdBySkuUpper.size}** SPD SKUs, **${spdByNormDesc.size}** descriptions`);
    
    // ────────────────────────────────────────────────────────
    // STEP 3 — Load active PM SKUs for validation
    // ────────────────────────────────────────────────────────
    const pmQ = await pmTable.selectRecordsAsync({
      fields: [PM_SKU_MASTER_FID, PM_STATUS_FID]
    });
    
    const activePmSkus = new Set(
      pmQ.records
        .filter((r) => {
          const status = r.getCellValueAsString(PM_STATUS_FID).trim();
          return ["ACTIVE", "PM ACTIVE", "NEW PRODUCTS", "PM NEW", "SKU_Transition"].includes(status);
        })
        .map((r) => r.getCellValueAsString(PM_SKU_MASTER_FID).trim().toUpperCase())
    );
    
    output.markdown(`✅ Loaded **${activePmSkus.size}** active PM SKUs`);
    
    // ────────────────────────────────────────────────────────
    // STEP 4 — Detect renames
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 3 — Detecting SKU renames...");
    
    const logs = [];
    let type1Count = 0, type2Count = 0;
    
    // TYPE 1 — Batch Variant (.A suffix)
    const dotARows = pendingRows.filter((r) =>
      r.getCellValueAsString(STG_SUPPLIER_SKU_FID).trim().toUpperCase().endsWith(".A")
    );
    
    const baseSkuMap = new Map();
    for (const r of pendingRows) {
      const sku = r.getCellValueAsString(STG_SUPPLIER_SKU_FID).trim().toUpperCase();
      if (!sku.endsWith(".A")) baseSkuMap.set(sku, r);
    }
    
    for (const dotARow of dotARows) {
      const rawSku = dotARow.getCellValueAsString(STG_SUPPLIER_SKU_FID).trim().toUpperCase();
      const baseSku = rawSku.slice(0, -2);
      const hasPair = baseSkuMap.has(baseSku);
      
      output.markdown(`- \`${rawSku}\` → base \`${baseSku}\` ${hasPair ? "✅" : "⏳ deferred"}`);
      
      logs.push({
        fields: {
          [LOG_TYPE_FID]: { name: "System_Event" },
          [LOG_SEVERITY_FID]: { name: "Info" },
          [LOG_NOTES_FID]: `TYPE 1 Batch Variant: ${rawSku} (pair: ${hasPair ? "yes" : "no"})`
        }
      });
      type1Count++;
    }
    
    // TYPE 2 — Plain Whammy (fuzzy match)
    for (const row of pendingRows) {
      const rawSku = row.getCellValueAsString(STG_SUPPLIER_SKU_FID).trim().toUpperCase();
      const rawDesc = row.getCellValueAsString(STG_DESC_FID).trim();
      
      if (rawSku.endsWith(".A")) continue; // Skip .A rows
      if (spdBySkuUpper.has(rawSku)) continue; // Skip known SKUs
      
      const normIncoming = normalise(rawDesc);
      if (normIncoming.length < 5) continue; // Skip too-short descriptions
      
      let bestScore = 0, bestSpdRec = null;
      for (const [normDesc, spdRec] of spdByNormDesc.entries()) {
        const score = similarity(normIncoming, normDesc);
        if (score > bestScore) {
          bestScore = score;
          bestSpdRec = spdRec;
        }
      }
      
      if (bestScore >= FUZZY_THRESHOLD && bestSpdRec) {
        const matchSku = bestSpdRec.getCellValueAsString(SPD_SKU_FID);
        
        output.markdown(
          `- **NEW** \`${rawSku}\` ≈ **EXISTING** \`${matchSku}\` (${(bestScore * 100).toFixed(0)}%)`
        );
        
        logs.push({
          fields: {
            [LOG_TYPE_FID]: { name: "System_Event" },
            [LOG_SEVERITY_FID]: { name: "Info" },
            [LOG_NOTES_FID]: `TYPE 2 Plain Whammy: ${rawSku} matches ${matchSku} (${(bestScore * 100).toFixed(0)}%)`
          }
        });
        type2Count++;
      }
    }
    
    // ────────────────────────────────────────────────────────
    // STEP 5 — Write logs
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 4 — Writing detection logs...");
    
    if (logs.length > 0) {
      for (let i = 0; i < logs.length; i += 50) {
        await logTable.createRecordsAsync(logs.slice(i, i + 50));
      }
      output.markdown(`✅ Logged **${logs.length}** detection events`);
    }
    
    output.markdown("---");
    output.markdown("## ✅ Script 0A Complete");
    output.markdown(
      `| Type | Count |\n|------|-------|\n` +
      `| TYPE 1 (Batch .A) | ${type1Count} |\n` +
      `| TYPE 2 (Whammy) | ${type2Count} |`
    );
    
  } catch (err) {
    output.markdown(`## ❌ Error: ${err.message}`);
    await logEvent(logTable, "SCRIPT_0A_ERROR", err.message, "High");
  }
}

async function logEvent(logTable, type, notes, severity) {
  try {
    await logTable.createRecordAsync({
      fields: {
        [LOG_NOTES_FID]: notes.substring(0, 5000),
        [LOG_TYPE_FID]: { name: "System_Event" },
        [LOG_SEVERITY_FID]: { name: severity },
        "fldog9l4DwJeE5Qj8": { name: "Logged" }
      }
    });
  } catch (e) { /* Silent fail */ }
}

await main();