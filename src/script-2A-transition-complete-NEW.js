/**
 * SCRIPT 2A — TRANSITION COMPLETION v1.5 (Automation Safe)
 * Changes from v1.4:
 *   - output.markdown() replaced with log() helper (works in automation + UI)
 */

// ─────────────────────────────────────────────────────────
// LOG HELPER — works in both script UI and automation mode
// ─────────────────────────────────────────────────────────
const log = (msg) => {
  try { output.markdown(msg); } catch(_) {}
  console.log(String(msg).replace(/\*\*/g, '').replace(/`/g, '').replace(/#+\s/g, ''));
};

const DRY_RUN = false;

const PM_TABLE_ID       = "tblgLqMMXX2HcKt9U";
const LEGACY_TABLE_ID   = "tbl8c8q0Bd33XCJCG";
const ADMIN_LOGS_ID     = "tblk1v5VHPEC2c2u2";

const PM_ROUTE_FID      = "fldSZsiBxKNTHPFel";
const PM_SKU_MASTER_FID = "fldMfK3uyPnDbKONn";
const PM_STATUS_FID     = "flddq6S7409EBM71D";
const PM_SPD_LINK_FID   = "fldxZcpnCCCYW5zHx";
const PM_TRANSITION_FID = "fldvqYzX3ZVB1UsRi";
const PM_SUPPLIER_FID   = "fld7IgWNjMiZM1Zat";
const PM_DESC_FID       = "fld7hdhxyu61r5Olm";

const LOG_NOTES_FID     = "fld4l6AJhVNRzIaY8";
const LOG_TYPE_FID      = "flda8oHUThBc1Kb7I";
const LOG_SEVERITY_FID  = "fldPdoc6JPYHV9gpb";
const LOG_STATUS_FID    = "fldog9l4DwJeE5Qj8";

const LEGACY_SKU_FID    = "fldNnAnBbeXqNparf";
const LEGACY_DESC_FID   = "fld5OyyRL839QrVLD";
const LEGACY_REASON_FID = "fldwxQevsg4gKlcvm";
const LEGACY_DATE_FID   = "fldj4tGbObMFqeQCF";
const LEGACY_DATA_FID   = "fldmMsY9JCwgcUSIf";
const LEGACY_SUPPLIER_FID = "fldPxh7RCLRAKYd1A";

const ARCHIVE_REASON_VALUE = "Discontinued";

const chunk = (arr, n) => {
  const o = [];
  for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n));
  return o;
};

async function main() {
  log("# Script 2A — Transition Completion v1.5");
  if (DRY_RUN) log("> DRY RUN MODE");

  const pmTable     = base.getTable(PM_TABLE_ID);
  const legacyTable = base.getTable(LEGACY_TABLE_ID);
  const adminLogs   = base.getTable(ADMIN_LOGS_ID);

  try {
    // ── Step 1: Validate archive reason option ──────────────
    log("## Step 1 — Validating archive reason option...");

    const reasonField   = legacyTable.getField(LEGACY_REASON_FID);
    const validReasons  = reasonField.options.choices.map(c => c.name);

    if (!validReasons.includes(ARCHIVE_REASON_VALUE)) {
      log(`❌ ARCHIVE_REASON_VALUE "${ARCHIVE_REASON_VALUE}" is not a valid option.`);
      log(`Valid options: ${validReasons.join(", ")}`);
      return;
    }
    log(`✅ Archive reason validated: "${ARCHIVE_REASON_VALUE}"`);

    // ── Step 2: Load B-flagged PM records ──────────────────
    log("## Step 2 — Loading B-suffix ProductMaster records...");

    const pmQ = await pmTable.selectRecordsAsync({
      fields: [
        PM_ROUTE_FID, PM_SKU_MASTER_FID, PM_STATUS_FID,
        PM_TRANSITION_FID, PM_SUPPLIER_FID, PM_DESC_FID, PM_SPD_LINK_FID
      ]
    });

    const allFlagged = pmQ.records.filter(r => {
      const route = r.getCellValueAsString(PM_ROUTE_FID).trim().toUpperCase();
      return route === "B" || route.includes("(B)") || route === "NEW CODE (B)";
    });

    log(`Found ${allFlagged.length} B-suffix records.`);

    // ── Step 3: Pre-flight validation ──────────────────────
    log("## Step 3 — Pre-flight validation...");

    const validRecords = [], rejectedRecords = [];

    for (const rec of allFlagged) {
      const skuMaster = rec.getCellValueAsString(PM_SKU_MASTER_FID).trim().toUpperCase();
      if (skuMaster.endsWith("Z") || skuMaster.endsWith(".Z")) {
        rejectedRecords.push({ rec, reason: "SKU ends in Z — this is a legacy record. Flag the .B record instead." });
      } else {
        validRecords.push(rec);
      }
    }

    if (rejectedRecords.length > 0) {
      log(`⚠️ ${rejectedRecords.length} rejected (Z-suffix on B-flagged record):`);
      rejectedRecords.forEach(r =>
        log(`  - ${r.rec.getCellValueAsString(PM_SKU_MASTER_FID)}: ${r.reason}`)
      );
    }

    if (validRecords.length === 0) {
      log("❌ No valid records to process.");
      return;
    }
    log(`✅ ${validRecords.length} valid record(s) ready for transition.`);

    // ── Step 4: Load linked Z records ──────────────────────
    const linkedIds = new Set();
    for (const rec of validRecords) {
      const links = rec.getCellValue(PM_TRANSITION_FID) || [];
      links.forEach(l => linkedIds.add(l.id));
    }

    const legacyMap = {};
    if (linkedIds.size > 0) {
      const legacyQ = await pmTable.selectRecordsAsync({
        fields: [PM_SKU_MASTER_FID, PM_STATUS_FID, PM_DESC_FID, PM_SUPPLIER_FID]
      });
      for (const rec of legacyQ.records) {
        if (linkedIds.has(rec.id)) legacyMap[rec.id] = rec;
      }
    }
    log(`✅ Loaded ${Object.keys(legacyMap).length} linked legacy records.`);

    // ── Step 5: Confirm ─────────────────────────────────────
    const confirm = await input.buttonsAsync(
      `Archive ${linkedIds.size} .Z SKUs and transition ${validRecords.length} active records?`,
      [
        { label: "✅ Confirm", variant: "primary" },
        { label: "❌ Cancel",  variant: "danger"  }
      ]
    );
    if (confirm !== "✅ Confirm") {
      log("❌ Cancelled.");
      return;
    }

    // ── Step 6: Execute transitions ─────────────────────────
    log("## Step 4 — Executing transitions...");

    const pmUpdates = [], legacyCreates = [], adminLogCreates = [];
    let countArchived = 0, countTransitioned = 0, countErrors = 0;

    for (const activeRec of validRecords) {
      try {
        const skuMaster    = activeRec.getCellValueAsString(PM_SKU_MASTER_FID).trim();
        const linkedLegacy = activeRec.getCellValue(PM_TRANSITION_FID) || [];

        for (const link of linkedLegacy) {
          const legRec = legacyMap[link.id];
          if (!legRec) {
            adminLogCreates.push({ fields: {
              [LOG_NOTES_FID]:    `Linked record ${link.id} not found for ${skuMaster}`,
              [LOG_TYPE_FID]:     { name: "System_Event" },
              [LOG_SEVERITY_FID]: { name: "High" },
              [LOG_STATUS_FID]:   { name: "Logged" }
            }});
            continue;
          }

          const legSku      = legRec.getCellValueAsString(PM_SKU_MASTER_FID).trim();
          const legDesc     = legRec.getCellValueAsString(PM_DESC_FID).trim();
          const legSupplier = legRec.getCellValue(PM_SUPPLIER_FID) || [];

          const dataDump = JSON.stringify({
            archived_at: new Date().toISOString(),
            legacy_sku: legSku,
            transitioned_to: skuMaster,
            status_at_archive: legRec.getCellValueAsString(PM_STATUS_FID)
          }, null, 2);

          const legacyFields = {
            [LEGACY_SKU_FID]:    legSku,
            [LEGACY_DESC_FID]:   legDesc || "(no description)",
            [LEGACY_REASON_FID]: { name: ARCHIVE_REASON_VALUE },
            [LEGACY_DATE_FID]:   new Date().toISOString().split("T")[0],
            [LEGACY_DATA_FID]:   dataDump
          };
          if (legSupplier.length > 0) {
            legacyFields[LEGACY_SUPPLIER_FID] = [{ id: legSupplier[0].id }];
          }
          legacyCreates.push({ fields: legacyFields });

          pmUpdates.push({
            id: legRec.id,
            fields: { [PM_STATUS_FID]: { name: "Discontinued" } }
          });
          countArchived++;
        }

        pmUpdates.push({
          id: activeRec.id,
          fields: {
            [PM_ROUTE_FID]:      { name: "ACTIVE" },
            [PM_TRANSITION_FID]: []
          }
        });
        countTransitioned++;

      } catch (err) {
        countErrors++;
        adminLogCreates.push({ fields: {
          [LOG_NOTES_FID]:    `Transition error for ${activeRec.getCellValueAsString(PM_SKU_MASTER_FID)}: ${err.message}`,
          [LOG_TYPE_FID]:     { name: "System_Event" },
          [LOG_SEVERITY_FID]: { name: "High" },
          [LOG_STATUS_FID]:   { name: "Logged" }
        }});
      }
    }

    // ── Step 7: Commit writes ───────────────────────────────
    if (!DRY_RUN) {
      log("## Step 5 — Writing to Airtable...");
      if (legacyCreates.length) for (const b of chunk(legacyCreates, 50)) await legacyTable.createRecordsAsync(b);
      if (pmUpdates.length)     for (const b of chunk(pmUpdates, 50))     await pmTable.updateRecordsAsync(b);
      if (adminLogCreates.length) for (const b of chunk(adminLogCreates, 50)) await adminLogs.createRecordsAsync(b);
    }

    log("---");
    log("## Script 2A Complete");
    log(`Records processed: ${validRecords.length}`);
    log(`Rejected (pre-flight): ${rejectedRecords.length}`);
    log(`.Z SKUs archived: ${countArchived}`);
    log(`Errors: ${countErrors}`);
    if (DRY_RUN) log("DRY RUN — no data was written.");

  } catch (err) {
    log(`## UNHANDLED ERROR: ${err.message}`);
    console.error(err.stack);
  }
}

await main();