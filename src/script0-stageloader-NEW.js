/**
 * SCRIPT 0 — CSV STAGING LOADER v2.3 (Automation Safe)
 * Changes from v2.2:
 *   - output.markdown() replaced with log() helper (works in automation + UI)
 *   - Trigger detection: input.config().recordId (automation-safe)
 *   - Import Status: Processing on start, Processed on success, Failed on crash
 *   - CSV delimiter: auto-detects semicolon vs comma
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

async function main() {
  log("# Script 0 — CSV Staging Loader v2.3");

  const metaTable = base.getTable("tblz0ZlAJByjkqPbH"); // SourceMetadata
  const stagingTable = base.getTable("tblcPSP5NcP0ioUP8"); // Staging
  const manifestTable = base.getTable("tblwPVgm3fLS1WjMo"); // ManifestSourceConfig
  const adminLogs = base.getTable("tblk1v5VHPEC2c2u2"); // SystemLogs

  let triggeringRecordId;

  try {
    // ──────────────────────────────────────────────────────
    // STEP 0 — Automation-safe trigger detection
    // ──────────────────────────────────────────────────────
    log("## Step 0 — Detecting triggering record...");

    const config = input.config();
    triggeringRecordId = config.recordId;

    if (!triggeringRecordId) {
      log("❌ No record ID received. Script must be triggered via automation.");
      return;
    }

    // Set Processing immediately — visible to Nina in SourceMetadata view
    await metaTable.updateRecordAsync(triggeringRecordId, {
      fldtTTRihPTXisag8: { name: "Processing" },
    });

    const metaQuery = await metaTable.selectRecordsAsync({
      fields: [
        "fld9ROntbwWHYGBt9", // Supplier Source Upload (attachment)
        "fldznkw7kfCI8sXjn", // Helper Tag Stock Status
        "fldxFveyMk1iCU7xC", // Suppliers
        "fldtTTRihPTXisag8", // Import Status
      ],
    });

    const record = metaQuery.getRecord(triggeringRecordId);
    if (!record) {
      log(`❌ Record ID ${triggeringRecordId} not found in SourceMetadata.`);
      return;
    }

    log(`✅ Detected record: ${record.id}`);

    // ──────────────────────────────────────────────────────
    // STEP 1 — Extract metadata
    // ──────────────────────────────────────────────────────
    log("## Step 1 — Extracting metadata...");

    const attachments = record.getCellValue("fld9ROntbwWHYGBt9");
    if (!attachments || attachments.length === 0) {
      log("❌ No CSV attachment found on this record.");
      await metaTable.updateRecordAsync(triggeringRecordId, {
        fldtTTRihPTXisag8: { name: "Failed" },
      });
      return;
    }

    const helperTag = record.getCellValueAsString("fldznkw7kfCI8sXjn") || "ST";
    const importType = helperTag.split(" ")[0].trim().toUpperCase();
    const supplierLink = record.getCellValue("fldxFveyMk1iCU7xC");

    log(`File: ${attachments[0].filename}`);
    log(`Import Type: ${importType}`);
    log(`Supplier: ${supplierLink?.[0]?.name || "N/A"}`);

    // ──────────────────────────────────────────────────────
    // STEP 2 — Load Manifest Mapping
    // ──────────────────────────────────────────────────────
    log("## Step 2 — Loading manifest mapping...");

    // Canonical ID → Staging field ID lookup
    const CANONICAL_TO_STAGING = {
      424: "fldeEd9FiNq5AtGNk", // Supplier SKU
      356: "fldkAm1iLOJJYmzmi", // Supplier Product Description
      292: "fldvZjLna62iMbj5K", // Dimensions MM
      422: "fldbgiMR2Qlm169Mu", // Thickness (Raw)
      362: "fldIEO5cTzgLSSOC0", // Body Type Class
      427: "fldslE6XEO2Lqi4Qd", // Stock Reserved
      483: "fld4QhEwwFSgFsHRB", // Body Finish
      299: "fldkh9EFaIKvc0yIj", // No Faces
      300: "fldqFzEPIby2C94Du", // PEI Class
      304: "fldfMSgqnPwP2hvtl", // Tech Slip Rating
      306: "fldiTSUcLPa4uLT4L", // Pce Box
      307: "fldvVC9z72GqYdDko", // Sqm Box
      479: "fldS2mZdWoY7hPU3G", // Kg Box
      480: "fld8Qz10GgXiS6Da5", // Box Pallet
      481: "fldf5VU6KDd2cSqUB", // Sqm Pallet
      390: "fldOfxvmWk1K1J0TQ", // Kg Pallet
      371: "fldhNujCBWdylBEzS", // Stock On Hand
      375: "fldqPizK5v1z69O7L", // Stock Available
      376: "fldMP2ywTGMepEX9K", // Retail Incl
    };

    const manifestQuery = await manifestTable.selectRecordsAsync({
      fields: ["fldHCtuNeJJCEHiO7", "fldRcrppQB3MG5YuV"], // Incoming Column Name, Canonical Registry
    });

    const COLUMN_MAP = {};
    for (const r of manifestQuery.records) {
      const colName = r
        .getCellValueAsString("fldHCtuNeJJCEHiO7")
        .trim()
        .toUpperCase();
      const canLink = r.getCellValue("fldRcrppQB3MG5YuV");
      if (colName && canLink && canLink.length > 0) {
        const canId = canLink[0].name;
        const stagingField = CANONICAL_TO_STAGING[canId];
        if (stagingField) COLUMN_MAP[colName] = stagingField;
      }
    }

    const mappedCount = Object.keys(COLUMN_MAP).length;
    if (mappedCount === 0) {
      log(
        "⚠️ WARNING: No manifest mappings found. Staging rows will have minimal fields.",
      );
    }
    log(`✅ Manifest loaded: ${mappedCount} field mappings`);

    // ──────────────────────────────────────────────────────
    // STEP 3 — Download and parse CSV
    // ──────────────────────────────────────────────────────
    log("## Step 3 — Downloading and parsing CSV...");

    let csvText;
    try {
      const response = await fetch(attachments[0].url);
      if (!response.ok)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      csvText = await response.text();
    } catch (err) {
      log(`❌ Failed to download CSV: ${err.message}`);
      await logEvent(adminLogs, "CSV_DOWNLOAD_ERROR", err.message, "High");
      await metaTable.updateRecordAsync(triggeringRecordId, {
        fldtTTRihPTXisag8: { name: "Failed" },
      });
      return;
    }

    // ── Auto-detect delimiter (semicolon for Decobella, comma for others)
    const firstLine = csvText.split("\n")[0];
    const delimiter = firstLine.includes(";") ? ";" : ",";
    log(
      `Delimiter detected: ${delimiter === ";" ? "semicolon (;)" : "comma (,)"}`,
    );

    // --- GENCODE SANITISATION (Decobella Excel coercion guard) ---
    // Fixes two known Excel type-coercion patterns on Decobella stocklist uploads.
    // Logs to SystemLogs whenever a correction fires so Nina has an audit trail.

    const GENCODE_COERCION_WATCH = {
      3: "0003", // Excel stripped leading zeros
      "2001-1": "0001-1", // Excel date-coerced: year 2001, month 1
    };

    function sanitiseGencode(raw) {
      if (!raw) return null;
      const s = raw.toString().trim();

      // Check known coercion cases first
      if (GENCODE_COERCION_WATCH[s]) return GENCODE_COERCION_WATCH[s];

      // General rule: pure 1-4 digit number → pad to 4 digits
      if (/^\d{1,4}$/.test(s)) return s.padStart(4, "0");

      // General rule: 2XXX-N date coercion pattern → 0XXX-N
      const dateCoerce = s.match(/^2(\d{3})-(\d{1,2})$/);
      if (dateCoerce) return `0${dateCoerce[1]}-${dateCoerce[2]}`;

      return s;
    }

    // ── Parse CSV (handles quoted fields, embedded newlines, \r\n)
    const rows = [];
    let row = [],
      inQuotes = false,
      val = "";

    for (let i = 0; i < csvText.length; i++) {
      const c = csvText[i],
        next = csvText[i + 1];

      if (c === '"' && inQuotes && next === '"') {
        val += '"';
        i++;
      } else if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === delimiter && !inQuotes) {
        row.push(val);
        val = "";
      } else if ((c === "\n" || c === "\r") && !inQuotes) {
        if (c === "\r" && next === "\n") i++;
        row.push(val);
        if (row.some((cell) => cell.trim() !== "")) rows.push(row);
        row = [];
        val = "";
      } else {
        val += c;
      }
    }
    // Flush last row
    if (val || row.length > 0) {
      row.push(val);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
    }

    if (rows.length < 2) {
      log("❌ CSV parsing failed — no data rows found.");
      await metaTable.updateRecordAsync(triggeringRecordId, {
        fldtTTRihPTXisag8: { name: "Failed" },
      });
      return;
    }

    if (GENCODE_COERCION_WATCH[rawGencode]) {
      infoLogBatch.push({
        fields: {
          fld4l6AJhVNRzIaY8:
            `⚠️ GENCODE auto-corrected on import\n\n` +
            `Original value in file: "${rawGencode}"\n` +
            `Corrected to: "${gencode}"\n\n` +
            `This is a known Excel formatting issue with the Decobella stocklist. ` +
            `The correction has been applied automatically. No action required.`,
          flda8oHUThBc1Kb7I: { name: "System_Event" },
          fldPdoc6JPYHV9gpb: { name: "Info" },
          fldog9l4DwJeE5Qj8: { name: "Logged" },
          fldJ1v4BeTILLN37J: true, // auto-reviewed, informational only
        },
      });
    }

    const headers = rows[0].map((h) => h.trim().toUpperCase());
    log(
      `✅ CSV parsed: ${rows.length - 1} data rows, ${headers.length} columns`,
    );
    log(`Headers: ${headers.join(" | ")}`);

    // ──────────────────────────────────────────────────────
    // STEP 4 — Type casting config
    // ──────────────────────────────────────────────────────
    const SINGLE_SELECTS = [
      "fldIEO5cTzgLSSOC0",
      "fld4QhEwwFSgFsHRB",
      "fldqFzEPIby2C94Du",
      "fldfMSgqnPwP2hvtl",
      "fldjdRY1TAJypmcPF",
    ];
    const NUMBER_FIELDS = [
      "fldiTSUcLPa4uLT4L",
      "fldvVC9z72GqYdDko",
      "fldS2mZdWoY7hPU3G",
      "fld8Qz10GgXiS6Da5",
      "fldf5VU6KDd2cSqUB",
      "fldOfxvmWk1K1J0TQ",
      "fldhNujCBWdylBEzS",
      "fldqPizK5v1z69O7L",
      "fldMP2ywTGMepEX9K",
      "fldkh9EFaIKvc0yIj",
    ];

    // Handles European decimals: "125,64" → 125.64
    function cleanNumber(v) {
      if (!v && v !== 0) return null;
      let s = String(v)
        .replace(/\./g, "") // strip European thousands dot
        .replace(",", ".") // convert European decimal comma
        .replace(/[^0-9.-]/g, "");
      const n = parseFloat(s);
      return isNaN(n) ? null : n;
    }

    // ──────────────────────────────────────────────────────
    // STEP 5 — Build Staging records
    // ──────────────────────────────────────────────────────
    log("## Step 4 — Building Staging records...");

    const stagingCreates = [];
    let skippedRows = 0,
      emptyRows = 0;

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length < 1 || r.every((cell) => !cell || !cell.trim())) {
        emptyRows++;
        continue;
      }

      const fields = {
        fldbrUDvLv8OEnEqh: { name: "pending" }, // Sys Etl Process Status
        fldjdRY1TAJypmcPF: { name: importType }, // Import Type
        fldbffhLGECRlzSt2: [{ id: record.id }], // Source Metadata ID link
      };

      if (supplierLink && supplierLink.length > 0) {
        fields["fldhYMKeVijNr36Fs"] = [{ id: supplierLink[0].id }]; // Supplier link
      }

      let fieldsWritten = 0;
      for (let j = 0; j < headers.length && j < r.length; j++) {
        const header = headers[j];
        const rawVal = r[j] ? r[j].trim() : null;
        if (!rawVal) continue;

        const fieldId = COLUMN_MAP[header];
        if (!fieldId) continue;

        if (NUMBER_FIELDS.includes(fieldId)) {
          const num = cleanNumber(rawVal);
          if (num !== null) {
            fields[fieldId] = num;
            fieldsWritten++;
          }
        } else if (SINGLE_SELECTS.includes(fieldId)) {
          fields[fieldId] = { name: rawVal };
          fieldsWritten++;
        } else {
          fields[fieldId] = rawVal;
          fieldsWritten++;
        }
      }

      if (fieldsWritten > 0) {
        stagingCreates.push({ fields });
      } else {
        skippedRows++;
      }
    }

    log(
      `✅ ${stagingCreates.length} records ready | ${skippedRows} skipped (no mapped fields) | ${emptyRows} empty rows`,
    );

    if (stagingCreates.length === 0) {
      log(
        "❌ No records to create. Check manifest mapping against CSV headers.",
      );
      await metaTable.updateRecordAsync(triggeringRecordId, {
        fldtTTRihPTXisag8: { name: "Failed" },
      });
      return;
    }

    // ──────────────────────────────────────────────────────
    // STEP 6 — Batch write to Staging
    // ──────────────────────────────────────────────────────
    log("## Step 5 — Writing to Staging...");

    const chunk = (arr, n) => {
      const o = [];
      for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n));
      return o;
    };

    let batchCount = 0,
      batchErrors = 0;
    for (const batch of chunk(stagingCreates, 50)) {
      try {
        await stagingTable.createRecordsAsync(batch);
        batchCount++;
      } catch (err) {
        batchErrors++;
        log(`❌ Batch ${batchCount + 1} failed: ${err.message}`);
        await logEvent(
          adminLogs,
          "BATCH_WRITE_ERROR",
          `Batch ${batchCount + 1} failed: ${err.message}`,
          "High",
        );
      }
    }

    log(`✅ ${batchCount} batches written, ${batchErrors} failed`);

    // --- SCRIPT 0 — POST-INGEST LOGGING ---
    // Drop this at the END of Script 0, after all Staging records are written.
    // Requires these vars to be tracked during your ingest loop:
    //   ingestedCount, newCount, skippedCount, failedCount, batchId, sourceFileName

    const SYSTEM_LOGS_TBL = "tblk1v5VHPEC2c2u2"; // SystemLogs

    const SL = {
      notes: "fld4l6AJhVNRzIaY8", // Notes          (multilineText)
      systemEvent: "flda8oHUThBc1Kb7I", // System Event   (singleSelect)
      severity: "fldPdoc6JPYHV9gpb", // Severity       (singleSelect)
      systemLog: "fldog9l4DwJeE5Qj8", // System Log     (singleSelect)
      operatorEmail: "fldyYs6l736JsE2iJ", // Operator Email (email)
      operatorNotes: "fldXtmbbu2ApOWYe4", // Operator Notes (multilineText)
    };

    const summary = [
      `📥 Script 0 — Ingest Complete`,
      `Batch ID   : ${batchId}`,
      `Source File: ${sourceFileName}`,
      `Ingested   : ${ingestedCount}`,
      `New Records: ${newCount}`,
      `Skipped    : ${skippedCount}`,
      `Failed     : ${failedCount}`,
      `Status     : Awaiting Script 0A`,
      `Timestamp  : ${new Date().toISOString()}`,
    ].join("\n");

    // 1. Visible in script run panel immediately
    output.text(summary);

    // 2. Persistent record in SystemLogs
    const sysLogsTable = base.getTable(SYSTEM_LOGS_TBL);
    await sysLogsTable.createRecordAsync({
      [SL.notes]: summary,
      [SL.systemEvent]: { name: "System_Event" }, // ✅ valid option
      [SL.severity]: { name: "Info" }, // ✅ valid option
      [SL.systemLog]: { name: "Logged" }, // ✅ valid option
      [SL.operatorEmail]: session.currentUser?.email ?? "unknown",
      [SL.operatorNotes]: `Script 0 ingest run. Next: run Script 0A on ${ingestedCount} pending records.`,
    });

    // ──────────────────────────────────────────────────────
    // STEP 7 — Mark SourceMetadata as Processed
    // ──────────────────────────────────────────────────────
    const finalStatus =
      batchErrors > 0 && batchCount === 0
        ? "Failed"
        : batchErrors > 0
          ? "Partial_Failure"
          : "Processed";

    await metaTable.updateRecordAsync(record.id, {
      fldtTTRihPTXisag8: { name: finalStatus },
    });

    log("---");
    log("## Script 0 Complete");
    log(`Staging records created: ${stagingCreates.length}`);
    log(`Batches written: ${batchCount}`);
    log(`Skipped rows: ${skippedRows}`);
    log(`Import Status: ${finalStatus}`);
    log("Next: Script 0A — Rename Detector");
  } catch (err) {
    log(`## UNHANDLED ERROR: ${err.message}`);
    console.error(err.stack);
    try {
      await logEvent(
        adminLogs,
        "SCRIPT_0_CRASH",
        `${err.message}\n${err.stack}`,
        "Critical",
      );
      if (triggeringRecordId) {
        await metaTable.updateRecordAsync(triggeringRecordId, {
          fldtTTRihPTXisag8: { name: "Failed" },
        });
      }
    } catch (_) {}
  }
}

// ──────────────────────────────────────────────────────────
// HELPER — write to SystemLogs
// ──────────────────────────────────────────────────────────
async function logEvent(logTable, eventType, notes, severity) {
  try {
    await logTable.createRecordAsync({
      fields: {
        fld4l6AJhVNRzIaY8: notes.substring(0, 5000), // Notes
        flda8oHUThBc1Kb7I: { name: "System_Event" }, // System Event
        fldPdoc6JPYHV9gpb: { name: severity }, // Severity
        fldog9l4DwJeE5Qj8: { name: "Logged" }, // System Log status
      },
    });
  } catch (logErr) {
    console.error("logEvent failed:", logErr.message);
  }
}

await main();
