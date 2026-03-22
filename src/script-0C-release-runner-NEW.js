// ============================================================
// SCRIPT 0C — RELEASE RUNNER v2.0
// Utile Solutions PIM | March 2026
//
// CHANGES FROM v1:
//   ✅ Whitelist loaded dynamically from UtileStaff table
//      (no hardcoded emails — add/remove staff in Airtable UI)
//   ✅ No manual variables to toggle
//   ✅ Aborts cleanly if UtileStaff is empty with clear instruction
//
// WHAT IT DOES:
//   Releases Anomalies records that have been Approved by an
//   authorised operator back into the Staging pipeline.
//   Sets Staging row status back to PENDING so Script 1 can route it.
// ============================================================
const logTable = base.getTable(LOG_TABLE_ID);

const ANOMALIES_TABLE_ID = "tbl56i9Rlm2mK6t1w";
const STAFF_TABLE_ID = "tbliuiXOlUeat2meH";
const STAGING_TABLE_ID = "tblcPSP5NcP0ioUP8";
const LOG_TABLE_ID = "tblk1v5VHPEC2c2u2";
const SUPPLIER_TABLE_ID = "tblLmsdwd3AGdLgwQ";

// Anomalies field IDs — FIX: all were placeholder names, replaced with real schema IDs
const ANOM_APPROVED_FID = "flddfVzPFP0NjYhVc"; // Approved (checkbox)
const ANOM_APPROVED_BY_FID = "fld9k8zf6uwWNx9SO"; // APPROVED BY (singleCollaborator)
const ANOM_RESOLUTION_FID = "fld4li4vcLn43h2N4"; // Resolution Status (singleSelect)
const ANOM_SOURCE_RECORD_FID = "fldOWWLBzngArnoL9"; // Source Record (link to Staging proxy)
const ANOM_ERROR_TYPE_FID = "fldjYiDzJmdYJp6uF";
const ANOM_NOTES_FID = "fldB7o9RtnQPi4goY";

// Staging field IDs
const STG_STATUS_FID = "fldbrUDvLv8OEnEqh"; // Sys Etl Process Status singleSelect

// UtileStaff field IDs — FIX: fldFullName was placeholder
const STAFF_EMAIL_FID = "fldyZXYwrxOcCFCsO";
const STAFF_NAME_FID = "fldGNYm19XawnzbgE"; // FIX: was fldFullName

// AdminLogs field IDs — FIX: all were placeholder names
const LOG_NOTES_FID = "fld4l6AJhVNRzIaY8"; // Notes
const LOG_SEVERITY_FID = "fldPdoc6JPYHV9gpb"; // Severity

const LOG_TYPE_FID = "flda8oHUThBc1Kb7I"; // Anomaly Type

async function main() {
  output.markdown("# Script 0C — Release Runner v2.0");

  // ── Step 0: Load authorised staff list ──────────────────
  output.markdown("## Loading authorised staff list from UtileStaff...");
  const staffTable = base.getTable(STAFF_TABLE_ID);
  const staffQ = await staffTable.selectRecordsAsync({
    fields: [STAFF_EMAIL_FID, STAFF_NAME_FID],
  });

  const whitelist = staffQ.records
    .map((r) => r.getCellValueAsString(STAFF_EMAIL_FID).trim().toLowerCase())
    .filter((e) => e.length > 4 && e.includes("@"));

  if (!whitelist.length) {
    output.markdown(
      "## ❌ Cannot proceed — UtileStaff table has no email records.",
    );
    output.markdown(
      "**Action required:** Add at least one staff record to the **UtileStaff** table with a valid email address.\n\n" +
        "Go to: UtileStaff table → New record → Fill in `full_name` and `email` → Save.\n\n" +
        "Then re-run this script.",
    );
    return;
  }
  output.markdown(`✅ ${whitelist.length} authorised staff email(s) loaded.`);

  // ── Step 1: Identify current user ───────────────────────
  // Airtable doesn't expose session user email in scripting API.
  // We ask Nina to confirm her email — it's validated against whitelist.
  const operatorEmail = await input.textAsync(
    "Enter your email address to authorise release:",
  );
  const normEmail = operatorEmail.trim().toLowerCase();

  if (!whitelist.includes(normEmail)) {
    output.markdown(`## ❌ Authorisation failed`);
    output.markdown(
      `"${normEmail}" is not on the authorised list.\n\n` +
        `Authorised accounts: ${whitelist.join(", ")}\n\n` +
        `Contact your system administrator to be added to UtileStaff.`,
    );
    return;
  }
  output.markdown(`✅ Authorised: ${normEmail}`);

  // ── Step 2: Load approved Anomalies ─────────────────────
  output.markdown("## Step 2 — Loading approved anomalies...");
  const anomTable = base.getTable(ANOMALIES_TABLE_ID);
  const anomQ = await anomTable.selectRecordsAsync({
    fields: [
      ANOM_APPROVED_FID,
      ANOM_APPROVED_BY_FID,
      ANOM_RESOLUTION_FID,
      ANOM_SOURCE_RECORD_FID,
      ANOM_ERROR_TYPE_FID,
      ANOM_NOTES_FID,
    ],
  });

  const approved = anomQ.records.filter((r) => {
    const isApproved = r.getCellValue(ANOM_APPROVED_FID) === true;
    const resolution = r.getCellValueAsString(ANOM_RESOLUTION_FID).trim();
    return isApproved && resolution !== "Resolved";
  });

  output.markdown(
    `Approved anomalies awaiting release: **${approved.length}**`,
  );
  if (!approved.length) {
    output.markdown(
      "✅ Nothing to release. Check the Anomalies table — tick 'Approved' on records you want to release, then re-run.",
    );
    return;
  }

  // ── Step 3: Preview ─────────────────────────────────────
  output.markdown("## Step 3 — Preview of records to be released:");
  approved.forEach((r) => {
    const errorType = r.getCellValueAsString(ANOM_ERROR_TYPE_FID);
    const notes = r.getCellValueAsString(ANOM_NOTES_FID).substring(0, 120);
    output.markdown(`- **${errorType}** | ${notes}...`);
  });

  const confirm = await input.buttonsAsync(
    `Release ${approved.length} approved anomalies back into the pipeline?`,
    [
      { label: "✅ Release", variant: "primary" },
      { label: "❌ Cancel", variant: "danger" },
    ],
  );
  if (confirm !== "✅ Release") {
    output.markdown("❌ Cancelled. No changes made.");
    return;
  }

  // ── Step 4: Update Anomalies status to Resolved ─────────
  output.markdown("## Step 4 — Marking anomalies as resolved...");
  const anomUpdates = approved.map((r) => ({
    id: r.id,
    fields: { [ANOM_RESOLUTION_FID]: { name: "Resolved" } },
  }));
  for (let i = 0; i < anomUpdates.length; i += 50) {
    await anomTable.updateRecordsAsync(anomUpdates.slice(i, i + 50));
  }
  output.markdown(`✅ ${anomUpdates.length} anomaly records marked Resolved.`);

  // ── Step 5: Auto-Release Linked Staging Rows ─────────────────
  output.markdown("## Step 5 — Automatically Releasing Staging Rows...");

  const stagingTable = base.getTable(STAGING_TABLE_ID);
  const stgQuery = await stagingTable.selectRecordsAsync({
    fields: ["fldeEd9FiNq5AtGNk", "fldbrUDvLv8OEnEqh"], // Supplier SKU and Status
  });

  // Extract the SKUs from the approved Anomalies (Original Value field)
  const approvedSkus = approved
    .map((r) => {
      const val = r.getCellValueAsString("fld0wlmRbNFgVpbXS");
      return val ? val.trim().toUpperCase() : null;
    })
    .filter(Boolean);

  const stagingUpdates = [];
  for (const stgRec of stgQuery.records) {
    const status = stgRec.getCellValueAsString("fldbrUDvLv8OEnEqh");
    const sku = stgRec
      .getCellValueAsString("fldeEd9FiNq5AtGNk")
      .trim()
      .toUpperCase();

    // If the row was held by Script 0B and matches an approved anomaly, release it

    if (
      status === "pending_review" &&
      approvedSkus.includes(sku) &&
      !alreadyReleased.has(sku)
    ) {
      alreadyReleased.add(sku);
      stagingUpdates.push({
        id: stgRec.id,
        fields: { fldbrUDvLv8OEnEqh: { name: "pending" } },
      });
    }
  }

  if (stagingUpdates.length > 0) {
    for (let i = 0; i < stagingUpdates.length; i += 50) {
      await stagingTable.updateRecordsAsync(stagingUpdates.slice(i, i + 50));
    }
    output.markdown(
      `✅ Successfully released **${stagingUpdates.length}** Staging rows back to PENDING.`,
    );
  } else {
    output.markdown(
      `ℹ️ No matching Staging rows found in 'pending_review' state.`,
    );
  }

  // ── Step 6: Log ─────────────────────────────────────────
  // Redundant Supplier table query completely removed to improve script speed
  await logTable.createRecordsAsync([
    {
      fields: {
        [LOG_NOTES_FID]:
          `Script 0C Release Runner executed.\n` +
          `Operator: ${normEmail}\n` +
          `Anomalies released: ${approved.length}\n` +
          `Records marked Resolved: ${anomUpdates.length}`,
        [LOG_SEVERITY_FID]: { name: "System_Event " },
        [LOG_TYPE_FID]: { name: "System_Event" }, // closest available type for release events
        fldog9l4DwJeE5Qj8: { name: "Logged" }, // Setting new System Log status
        fldyYs6l736JsE2iJ: normEmail, // Writing to the new Operator Email field
      },
    },
  ]);

  output.markdown("---");
  output.markdown("## ✅ Release complete");
  output.markdown(`- Operator: **${normEmail}**`);
  output.markdown(`- Anomalies resolved: **${approved.length}**`);
  output.markdown(
    `- Next step: Set released Staging rows back to PENDING, then run Script 1.`,
  );
}

await main();
