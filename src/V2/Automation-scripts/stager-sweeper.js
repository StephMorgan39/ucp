//Purpose: Pre-flight anomaly check for Friday CSV stock ingestions.
//Logic: Cross-references Staging SKUs against existing SPD SKUs.
// Action: State-based quarantine. It does NOT delete records. It updates duplicate Staging records to 'failed' and routes a Critical alert to the UPCAdmin human-review queue.
// Safeguard: Ignores records already marked 'processed', 'failed', or 'pending_review' to preserve historical batch data.

// UPDATED: Non-Destructive Batch Sweep (State-Based)

// --- 1. TABLE IDs ---
const STAGING_TABLE_ID = "tblcPSP5NcP0ioUP8";
const SPD_TABLE_ID = "tbl7mZpHJCUs1r0cg";
const UPC_ADMIN_TABLE_ID = "tbl56i9Rlm2mK6t1w";

// --- 2. FIELD IDs ---
const STAGING_SKU_FIELD_ID = "fldeEd9FiNq5AtGNk";
const SYS_ETL_STATUS_FIELD_ID = "fldbrUDvLv8OEnEqh"; // NEW: Sys Etl Process Status

const SPD_SKU_FIELD_ID = "fldK3FyPA98F3smc9";
const ERROR_TYPE_FIELD_ID = "fldjYiDzJmdYJp6uF";
const RESOLUTION_STATUS_FIELD_ID = "fld4li4vcLn43h2N4";
const FLAG_SEVERITY_FIELD_ID = "fld3TPgysD2hLbtvR";
const NOTES_FIELD_NAME = "fldB7o9RtnQPi4goY";

const stagingTable = base.getTable(STAGING_TABLE_ID);
const spdTable = base.getTable(SPD_TABLE_ID);
const upcAdminTable = base.getTable(UPC_ADMIN_TABLE_ID);

// 3. Fetch Data (Now pulling the Status field as well)
const stagingQuery = await stagingTable.selectRecordsAsync({
  fields: [STAGING_SKU_FIELD_ID, SYS_ETL_STATUS_FIELD_ID],
});

if (stagingQuery.records.length === 0) {
  console.log("Staging is empty. No records to sweep.");
} else {
  const spdQuery = await spdTable.selectRecordsAsync({
    fields: [SPD_SKU_FIELD_ID],
  });
  const existingSKUs = new Set(
    spdQuery.records.map((r) => r.getCellValueAsString(SPD_SKU_FIELD_ID)),
  );

  let recordsToUpdate = []; // Changed from recordsToDelete
  let logsToCreate = [];

  // 4. Sweep & Build Payload
  for (let record of stagingQuery.records) {
    let currentStatus = record.getCellValueAsString(SYS_ETL_STATUS_FIELD_ID);

    // BEST PRACTICE: Ignore records that are already processed, failed, or pending review
    if (
      currentStatus === "processed" ||
      currentStatus === "failed" ||
      currentStatus === "pending_review"
    ) {
      continue;
    }

    let currentSKU = record.getCellValueAsString(STAGING_SKU_FIELD_ID);

    if (currentSKU && existingSKUs.has(currentSKU)) {
      // Quarantine the record in Staging instead of deleting it
      recordsToUpdate.push({
        id: record.id,
        fields: {
          [SYS_ETL_STATUS_FIELD_ID]: { name: "failed" },
        },
      });

      // Log the anomaly to UPCAdmin
      let payloadFields = {};
      payloadFields[NOTES_FIELD_NAME] =
        `Duplicate SKU detected. Record quarantined in Staging. SKU: ${currentSKU}`;
      payloadFields[ERROR_TYPE_FIELD_ID] = { name: "Duplicate_SKU" };
      payloadFields[RESOLUTION_STATUS_FIELD_ID] = { name: "Open" };
      payloadFields[FLAG_SEVERITY_FIELD_ID] = { name: "Critical" };

      logsToCreate.push({ fields: payloadFields });
    }
  }

  console.log(
    `Found ${recordsToUpdate.length} duplicates. Quarantining and routing to UPCAdmin...`,
  );

  // 5. STRICT CONSTRAINT: Batch processing in groups of 50
  while (logsToCreate.length > 0) {
    let batch = logsToCreate.splice(0, 50);
    await upcAdminTable.createRecordsAsync(batch);
  }

  // UPDATED: Using updateRecordsAsync instead of deleteRecordsAsync
  while (recordsToUpdate.length > 0) {
    let updateBatch = recordsToUpdate.splice(0, 50);
    await stagingTable.updateRecordsAsync(updateBatch);
  }

  console.log(
    "Sweep complete. Duplicates quarantined as 'failed'. Anomalies logged.",
  );
}
