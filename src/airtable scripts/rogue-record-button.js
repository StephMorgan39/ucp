// =============================================================
// ROGUE RECORD MIGRATOR (V2.6 - Type-Safe & Locked Edition)
// Safe Archival & System Logging Protocol
// =============================================================

const SYSTEM_BUILD_LOGS_ID = "tblk1v5VHPEC2c2u2";
const LEGACY_CODES_ID = "tbl8c8q0Bd33XCJCG";

// SystemBuildLogs Fields
const LOG_EVENT_NAME_FLD = "flda8oHUThBc1Kb7I";
const LOG_NOTES_FLD = "fldESMffFnUZNRhd2";
const LOG_STATUS_FLD = "fldt4He3EKXqhfuu2";

async function migrateRogueRecord() {
  let activeId = cursor.activeTableId;

  // SAFETY LOCK: Prevent script from running in the wrong table (like Staging)
  if (activeId !== "tblgLqMMXX2HcKt9U" && activeId !== "tbl7mZpHJCUs1r0cg") {
    output.text(
      "🚫 INVALID TABLE: This button can only be used in the Product Master or Supplier Product Data tables.",
    );
    return;
  }

  // /** @type {any} */ tells the Airtable spellchecker to relax and clear the 'never' errors
  /** @type {any} */
  const sourceTable = base.getTable(activeId);
  let sourceTableId = sourceTable.id;

  const buildLogsTable = base.getTable(SYSTEM_BUILD_LOGS_ID);
  const legacyTable = base.getTable(LEGACY_CODES_ID);

  /** @type {any} */
  const record = await input.recordAsync(
    "Select a record to migrate",
    sourceTable,
  );
  if (!record) return;

  // 1. DYNAMIC DATA SCRAPE (For Rich Text Data Dump)
  let dataDumpStr = "### Original Record Data\n\n";
  for (let field of sourceTable.fields) {
    let val = record.getCellValueAsString(field.id);
    if (val) dataDumpStr += `**${field.name}**: ${val}\n`;
  }

  // 2. IDENTIFY SOURCE & EXACT FIELDS
  let sku = "";
  let desc = "";
  let codeType = "";
  let supplierLinkData = null;

  if (sourceTableId === "tblgLqMMXX2HcKt9U") {
    // ProductMaster Mapping
    sku = record.getCellValueAsString("fldMfK3uyPnDbKONn");
    desc = record.getCellValueAsString("fld7hdhxyu61r5Olm");
    codeType = "Utile";
  } else {
    // SupplierProductData Mapping
    sku = record.getCellValueAsString("fldK3FyPA98F3smc9");
    desc = record.getCellValueAsString("fldoROoSpEm5FuUnI");
    codeType = "Supplier";

    // Grab existing Supplier link (fldY9HQ6d42p8uVoY) to carry over
    supplierLinkData = record.getCellValue("fldY9HQ6d42p8uVoY");
  }

  // 3. EXACT SINGLE-SELECT REASON PROMPT
  let archiveReason = await input.buttonsAsync(
    `Select Reason for Archiving: ${sku}`,
    [
      "Discontinued - Never Listed",
      "Discontinued - With Sales",
      "Duplicate Code Internal",
      "Data Error",
      "SKU Transition",
      "Superceded",
      "Cancel",
    ],
  );

  if (archiveReason === "Cancel") {
    output.text("🚫 Migration cancelled.");
    return;
  }

  output.text(`Archiving ${sku} to Legacy...`);

  // 4. RICH ENRICHMENT CREATION (LegacyCodes)
  let legacyPayload = {
    fldNnAnBbeXqNparf: sku,
    fld5OyyRL839QrVLD: desc,
    fldYN3WKxQFrRfOtF: { name: codeType },
    fldj4tGbObMFqeQCF: new Date().toISOString().split("T")[0],
    fldwxQevsg4gKlcvm: { name: archiveReason },
    fldmMsY9JCwgcUSIf: dataDumpStr,
  };

  if (supplierLinkData) {
    legacyPayload["fldPxh7RCLRAKYd1A"] = supplierLinkData;
  }

  await legacyTable.createRecordAsync(legacyPayload);

  // 5. SYSTEM BUILD LOGS
  output.text(`Logging system event...`);
  await buildLogsTable.createRecordAsync({
    [LOG_EVENT_NAME_FLD]: `Rogue/Archived SKU: ${sku} [${archiveReason}]`,
    [LOG_NOTES_FLD]: `Migrated from ${sourceTable.name}.`,
    [LOG_STATUS_FLD]: { name: "Completed" },
  });

  // 6. SAFE DELETE
  output.text(`Cleaning up source table...`);
  await sourceTable.deleteRecordAsync(record.id);

  output.text(
    `✅ Process Complete. All metadata for ${sku} was securely enriched into LegacyCodes.`,
  );
}

await migrateRogueRecord();
