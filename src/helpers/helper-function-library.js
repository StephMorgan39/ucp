// ═════════════════════════════════════════════════════════════════════════════
// UNIFIED LOGGING FRAMEWORK v1.0
// ═════════════════════════════════════════════════════════════════════════════
// Place this block at the top of EVERY script (0, 0A, 0B, 0C)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Safe UI output — works in both Script UI and Automation modes
 */
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

/**
 * Generates unique batch ID for this execution
 */
function generateBatchId() {
  return new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
}

/**
 * Gets current user email safely (works in automation + UI)
 */
function getCurrentUserEmail() {
  try {
    return session?.currentUser?.email ?? "automation@system";
  } catch (_) {
    return "automation@system";
  }
}

/**
 * Chunks array for batch operations (Airtable limit: 50 records per call)
 */
function chunk(arr, n = 50) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) {
    out.push(arr.slice(i, i + n));
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// DUAL LOGGING HELPERS — Write to SystemLogs + UPCAdmin with intelligence
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Log EVENT to SystemLogs only (informational, no action required)
 * Use for: successful processing, warnings, contextual notes
 * 
 * @param {Table} sysLogTable - SystemLogs table object
 * @param {string} eventType - System Event type (e.g., "System_Event", "Batch_Complete")
 * @param {string} notes - Detailed log message
 * @param {string} severity - "Info" | "Low" | "Medium" | "High" | "Critical"
 * @param {Object} options - Optional: { stagingRecordId, operatorEmail, operatorNotes, reviewed }
 * @returns {string|null} - Created record ID or null on failure
 */
async function logEvent(sysLogTable, eventType, notes, severity, options = {}) {
  const F = {
    notes: "fld4l6AJhVNRzIaY8",
    systemEvent: "flda8oHUThBc1Kb7I",
    severity: "fldPdoc6JPYHV9gpb",
    systemLog: "fldog9l4DwJeE5Qj8",
    operatorEmail: "fldyYs6l736JsE2iJ",
    operatorNotes: "fldXtmbbu2ApOWYe4",
    stagingLink: "fldjHeNOkAl5rXSQd",
    reviewed: "fldJ1v4BeTILLN37J",
  };

  try {
    const fields = {};
    fields[F.notes] = String(notes).substring(0, 5000);
    fields[F.systemEvent] = { name: eventType };
    fields[F.severity] = { name: severity };
    fields[F.systemLog] = { name: "Logged" };

    if (options.stagingRecordId) {
      fields[F.stagingLink] = [{ id: options.stagingRecordId }];
    }
    if (options.operatorEmail) {
      fields[F.operatorEmail] = options.operatorEmail;
    }
    if (options.operatorNotes) {
      fields[F.operatorNotes] = options.operatorNotes;
    }
    if (options.reviewed === true) {
      fields[F.reviewed] = true;
    }

    const recordId = await sysLogTable.createRecordAsync(fields);
    return recordId;
  } catch (err) {
    console.error("logEvent failed:", err.message);
    return null;
  }
}

/**
 * Log ANOMALY to UPCAdmin only (requires operator action/approval)
 * Use for: validation failures, data errors, holds that need review
 * 
 * @param {Table} adminTable - UPCAdmin table object
 * @param {string} errorType - Error Type (e.g., "Price_Spike", "Missing_Data", "SKU_Format_Invalid")
 * @param {string} notes - Detailed description of the issue + how to fix it
 * @param {string} severity - "Info" | "Low" | "Medium" | "High" | "Critical"
 * @param {Object} options - Optional: { stagingRecordId, sourceTable, productMasterId }
 * @returns {string|null} - Created record ID or null on failure
 */
async function logAnomaly(adminTable, errorType, notes, severity, options = {}) {
  const F = {
    notes: "fldB7o9RtnQPi4goY",
    errorType: "fldjYiDzJmdYJp6uF",
    severity: "fld3TPgysD2hLbtvR",
    detectedBy: "fldbPrkOy6XavA4ef",
    resolutionStatus: "fld4li4vcLn43h2N4",
    dateDetected: "fldE7JCdKubLvxysd",
    stagingLink: "fldz5hJMgnsZu0T07",
    sourceTable: "fldHEz5b8phNb85jT",
    approved: "flddfVzPFP0NjYhVc",
  };

  try {
    const fields = {};
    fields[F.notes] = String(notes).substring(0, 5000);
    fields[F.errorType] = { name: errorType };
    fields[F.severity] = { name: severity };
    fields[F.detectedBy] = { name: "ETL_Script" };
    fields[F.resolutionStatus] = { name: "Unresolved" };
    fields[F.dateDetected] = new Date().toISOString(); // Full ISO datetime
    fields[F.approved] = false; // Default: not yet approved

    if (options.stagingRecordId) {
      fields[F.stagingLink] = [{ id: options.stagingRecordId }];
    }
    if (options.sourceTable) {
      fields[F.sourceTable] = { name: options.sourceTable };
    }

    const recordId = await adminTable.createRecordAsync(fields);
    return recordId;
  } catch (err) {
    console.error("logAnomaly failed:", err.message);
    return null;
  }
}

/**
 * Log DUAL — anomaly + context (holds that need approval + supporting notes)
 * Creates BOTH UPCAdmin record (action required) AND SystemLog entry (context)
 * Automatically establishes bidirectional cross-link
 * 
 * @param {Table} sysLogTable - SystemLogs table object
 * @param {Table} adminTable - UPCAdmin table object
 * @param {string} eventType - System Event type for SystemLog
 * @param {string} errorType - Error Type for UPCAdmin
 * @param {string} notes - Shared log message (appears in both tables)
 * @param {string} severity - Severity level ("Info" through "Critical")
 * @param {Object} options - Optional: { stagingRecordId, operatorEmail, sourceTable }
 * @returns {{ sysLogRecordId, adminRecordId }} - Created record IDs
 */
async function logDual(
  sysLogTable,
  adminTable,
  eventType,
  errorType,
  notes,
  severity,
  options = {}
) {
  // Step 1: Create UPCAdmin record (the HOLD)
  const adminRecordId = await logAnomaly(
    adminTable,
    errorType,
    notes,
    severity,
    {
      stagingRecordId: options.stagingRecordId,
      sourceTable: options.sourceTable || "Staging",
    }
  );

  // Step 2: Create SystemLog record (the CONTEXT)
  const sysLogRecordId = await logEvent(
    sysLogTable,
    eventType,
    notes,
    severity,
    {
      stagingRecordId: options.stagingRecordId,
      operatorEmail: options.operatorEmail,
    }
  );

  // Step 3: Link them bidirectionally
  if (adminRecordId && sysLogRecordId) {
    try {
      // SystemLog → UPCAdmin
      await sysLogTable.updateRecordAsync(sysLogRecordId, {
        fldWXFUMjSnBFAGvd: [{ id: adminRecordId }],
      });

      // UPCAdmin → SystemLog (if field exists)
      await adminTable.updateRecordAsync(adminRecordId, {
        fldzDXGns8aBwZAxZ: [{ id: sysLogRecordId }],
      });
    } catch (_) {
      // Silent fail — links optional
    }
  }

  return { sysLogRecordId, adminRecordId };
}

// ═════════════════════════════════════════════════════════════════════════════
// END UNIFIED LOGGING FRAMEWORK
// ═════════════════════════════════════════════════════════════════════════════