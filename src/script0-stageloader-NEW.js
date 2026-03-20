/**
 * SCRIPT 0 — CSV STAGING LOADER v2.2 (Automation Safe)
 * Improvements: Error handling, parameterized record ID, validation logging
 */

async function main() {
  output.markdown("# 📥 Script 0 — CSV Staging Loader v2.2");
  
  const metaTable = base.getTable("tblz0ZlAJByjkqPbH"); // SourceMetadata
  const stagingTable = base.getTable("tblcPSP5NcP0ioUP8"); // Staging
  const manifestTable = base.getTable("tblwPVgm3fLS1WjMo"); // ManifestSourceConfig
  const adminLogs = base.getTable("tblk1v5VHPEC2c2u2"); // AdminLogs
  
  const START_TIME = new Date().toISOString();
  
  try {
    // ────────────────────────────────────────────────────────
    // STEP 0 — Detect triggering record dynamically
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 0 — Detecting triggering record...");
    
    const triggeringRecordId = input.config?.trigger?.record?.id || 
      (await input.textAsync(
        "Enter SourceMetadata Record ID (if triggered manually):"
      ));
    
    if (!triggeringRecordId) {
      output.markdown("❌ No record ID provided. Cannot proceed.");
      return;
    }
    
    const metaQuery = await metaTable.selectRecordsAsync({
      fields: [
        "fld9ROntbwWHYGBt9", // Supplier Source Upload
        "fldznkw7kfCI8sXjn", // Helper Tag Stock Status
        "fldxFveyMk1iCU7xC", // Suppliers
        "fldtTTRihPTXisag8"  // Import Status
      ]
    });
    
    const record = metaQuery.getRecord(triggeringRecordId);
    if (!record) {
      output.markdown(`❌ Record ID **${triggeringRecordId}** not found in SourceMetadata.`);
      return;
    }
    
    output.markdown(`✅ Detected record: **${record.id}**`);
    
    // ────────────────────────────────────────────────────────
    // STEP 1 — Extract metadata
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 1 — Extracting metadata...");
    
    const attachments = record.getCellValue("fld9ROntbwWHYGBt9");
    if (!attachments || attachments.length === 0) {
      output.markdown("❌ No CSV attachment found on this record.");
      return;
    }
    
    const helperTag = record.getCellValueAsString("fldznkw7kfCI8sXjn") || "ST";
    const importType = helperTag.split(" ")[0].trim().toUpperCase(); // Extract first token
    const supplierLink = record.getCellValue("fldxFveyMk1iCU7xC");
    
    output.markdown(`- **File:** ${attachments[0].filename}`);
    output.markdown(`- **Import Type:** ${importType}`);
    output.markdown(`- **Supplier:** ${supplierLink?.[0]?.name || "N/A"}`);
    
    // ────────────────────────────────────────────────────────
    // STEP 2 — Load Dynamic Manifest Mapping
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 2 — Loading Dynamic Manifest Mapping...");
    
    const CANONICAL_TO_STAGING = {
      "424": "fldeEd9FiNq5AtGNk", "356": "fldkAm1iLOJJYmzmi", "292": "fldvZjLna62iMbj5K", 
      "422": "fldbgiMR2Qlm169Mu", "362": "fldIEO5cTzgLSSOC0", "427": "fldslE6XEO2Lqi4Qd",
      "483": "fld4QhEwwFSgFsHRB", "299": "fldkh9EFaIKvc0yIj", "300": "fldqFzEPIby2C94Du", 
      "304": "fldfMSgqnPwP2hvtl", "306": "fldiTSUcLPa4uLT4L", "307": "fldvVC9z72GqYdDko", 
      "479": "fldS2mZdWoY7hPU3G", "480": "fld8Qz10GgXiS6Da5", "481": "fldf5VU6KDd2cSqUB", 
      "390": "fldOfxvmWk1K1J0TQ", "371": "fldhNujCBWdylBEzS", "375": "fldqPizK5v1z69O7L", 
      "376": "fldMP2ywTGMepEX9K"
    };
    
    const manifestQuery = await manifestTable.selectRecordsAsync({
      fields: ["fldHCtuNeJJCEHiO7", "fldRcrppQB3MG5YuV"]
    });
    
    const COLUMN_MAP = {};
    for (const r of manifestQuery.records) {
      const colName = r.getCellValueAsString("fldHCtuNeJJCEHiO7").trim().toUpperCase();
      const canLink = r.getCellValue("fldRcrppQB3MG5YuV");
      if (colName && canLink && canLink.length > 0) {
        const canId = canLink[0].name; // Extract canonical ID from linked record
        const stagingField = CANONICAL_TO_STAGING[canId];
        if (stagingField) {
          COLUMN_MAP[colName] = stagingField;
        }
      }
    }
    
    const mappedFieldCount = Object.keys(COLUMN_MAP).length;
    if (mappedFieldCount === 0) {
      output.markdown("⚠️ **WARNING:** No fields mapped from manifest. CSV will be imported with minimal field mapping.");
    }
    output.markdown(`✅ Manifest loaded: **${mappedFieldCount}** field mappings active`);
    
    // ────────────────────────────────────────────────────────
    // STEP 3 — Download and Parse CSV
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 3 — Downloading and parsing CSV...");
    
    let csvText;
    try {
      const fileUrl = attachments[0].url;
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      csvText = await response.text();
    } catch (err) {
      output.markdown(`❌ **Failed to download CSV:** ${err.message}`);
      await logEvent(adminLogs, "CSV_DOWNLOAD_ERROR", err.message, "High");
      return;
    }
    
    // Parse CSV manually (handles quoted fields, embedded newlines)
    const rows = [];
    let row = [], inQuotes = false, val = '';
    
    for (let i = 0; i < csvText.length; i++) {
      let c = csvText[i], next = csvText[i+1];
      
      if (c === '"' && inQuotes && next === '"') {
        val += '"';
        i++; // Skip next quote
      } else if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        row.push(val);
        val = '';
      } else if ((c === '\n' || c === '\r') && !inQuotes) {
        if (c === '\r' && next === '\n') i++; // Skip \r\n pair
        row.push(val);
        if (row.length > 0 && row.some(cell => cell.trim() !== '')) {
          rows.push(row);
        }
        row = [];
        val = '';
      } else {
        val += c;
      }
    }
    if (val || row.length > 0) {
      row.push(val);
      if (row.some(cell => cell.trim() !== '')) rows.push(row);
    }
    
    if (rows.length < 2) {
      output.markdown("❌ CSV parsing failed or contains no data rows.");
      return;
    }
    
    const headers = rows[0].map(h => h.trim().toUpperCase());
    output.markdown(`✅ CSV parsed: **${rows.length - 1}** data rows, **${headers.length}** columns`);
    
    // ────────────────────────────────────────────────────────
    // STEP 4 — Type Casting Configuration
    // ────────────────────────────────────────────────────────
    const SINGLE_SELECTS = [
      "fldIEO5cTzgLSSOC0", "fld4QhEwwFSgFsHRB", "fldqFzEPIby2C94Du", 
      "fldfMSgqnPwP2hvtl", "fldjdRY1TAJypmcPF"
    ];
    const NUMBER_FIELDS = [
      "fldiTSUcLPa4uLT4L", "fldvVC9z72GqYdDko", "fldS2mZdWoY7hPU3G", 
      "fld8Qz10GgXiS6Da5", "fldf5VU6KDd2cSqUB", "fldOfxvmWk1K1J0TQ", 
      "fldhNujCBWdylBEzS", "fldqPizK5v1z69O7L", "fldMP2ywTGMepEX9K", 
      "fldkh9EFaIKvc0yIj"
    ];
    
    function cleanNumber(v) {
      if (!v && v !== 0) return null;
      let s = String(v)
        .replace(/\./g, '') // Strip European thousands separator
        .replace(',', '.') // Convert European decimal
        .replace(/[^0-9.-]/g, '');
      let n = parseFloat(s);
      return isNaN(n) ? null : n;
    }
    
    // ────────────────────────────────────────────────────────
    // STEP 5 — Build Staging Records
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 4 — Building Staging records...");
    
    let stagingCreates = [];
    let skippedRows = 0, emptyRows = 0;
    
    for (let i = 1; i < rows.length; i++) {
      let r = rows[i];
      if (!r || r.length < 1) {
        emptyRows++;
        continue;
      }
      
      // Check if row is entirely empty
      if (r.every(cell => !cell || !cell.trim())) {
        emptyRows++;
        continue;
      }
      
      let fields = {
        "fldbrUDvLv8OEnEqh": { name: "pending" },
        "fldjdRY1TAJypmcPF": { name: importType },
        "fldbffhLGECRlzSt2": [{ id: record.id }]
      };
      
      if (supplierLink && supplierLink.length > 0) {
        fields["fldhYMKeVijNr36Fs"] = [{ id: supplierLink[0].id }];
      }
      
      let fieldsWritten = 0;
      for (let j = 0; j < headers.length && j < r.length; j++) {
        let header = headers[j];
        let val = r[j] ? r[j].trim() : null;
        if (!val) continue;
        
        let fieldId = COLUMN_MAP[header];
        if (fieldId) {
          if (NUMBER_FIELDS.includes(fieldId)) {
            let num = cleanNumber(val);
            if (num !== null) {
              fields[fieldId] = num;
              fieldsWritten++;
            }
          } else if (SINGLE_SELECTS.includes(fieldId)) {
            fields[fieldId] = { name: val };
            fieldsWritten++;
          } else {
            fields[fieldId] = val;
            fieldsWritten++;
          }
        }
      }
      
      // Only create if at least one field (beyond system fields) was populated
      if (fieldsWritten > 0) {
        stagingCreates.push({ fields });
      } else {
        skippedRows++;
      }
    }
    
    output.markdown(
      `✅ **${stagingCreates.length}** records ready to create | ` +
      `⚠️ **${skippedRows}** skipped (no mapped fields) | ` +
      `**${emptyRows}** empty rows ignored`
    );
    
    if (stagingCreates.length === 0) {
      output.markdown("❌ No records to create. Check your manifest mapping.");
      return;
    }
    
    // ────────────────────────────────────────────────────────
    // STEP 6 — Batch Write to Staging
    // ────────────────────────────────────────────────────────
    output.markdown("## Step 5 — Writing to Staging (batched)...");
    
    const chunk = (arr, n) => {
      const o = [];
      for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n));
      return o;
    };
    
    let batchCount = 0;
    for (const batch of chunk(stagingCreates, 50)) {
      try {
        await stagingTable.createRecordsAsync(batch);
        batchCount++;
      } catch (err) {
        output.markdown(`❌ **Batch ${batchCount} failed:** ${err.message}`);
        await logEvent(adminLogs, "BATCH_WRITE_ERROR", 
          `Batch ${batchCount} of ${Math.ceil(stagingCreates.length / 50)} failed: ${err.message}`, 
          "High");
        // Continue with remaining batches
      }
    }
    
    output.markdown(`✅ Completed **${batchCount}** batches of 50 records`);
    
    // ────────────────────────────────────────────────────────
    // STEP 7 — Update SourceMetadata Status
    // ────────────────────────────────────────────────────────
    await metaTable.updateRecordAsync(record.id, {
      "fldtTTRihPTXisag8": { name: "Processed" }
    });
    
    output.markdown("---");
    output.markdown("## ✅ Script 0 Complete");
    output.markdown(
      `| Metric | Count |\n|--------|-------|\n` +
      `| Staging records created | ${stagingCreates.length} |\n` +
      `| Batches written | ${batchCount} |\n` +
      `| Skipped rows | ${skippedRows} |\n` +
      `| Empty rows | ${emptyRows} |`
    );
    output.markdown("\n**Next:** Run Script 0A (Rename Detector) to identify SKU transitions.");
    
  } catch (err) {
    output.markdown(`## ❌ Unhandled Error\n\`\`\`\n${err.message}\n${err.stack}\n\`\`\``);
    await logEvent(adminLogs, "SCRIPT_0_CRASH", 
      `${err.message}\n${err.stack}`, 
      "Critical");
  }
}

// ────────────────────────────────────────────────────────
// HELPER — Log Event to AdminLogs
// ────────────────────────────────────────────────────────
async function logEvent(logTable, eventType, notes, severity) {
  try {
    await logTable.createRecordAsync({
      fields: {
        "fld4l6AJhVNRzIaY8": notes.substring(0, 5000), // Notes (truncate if needed)
        "flda8oHUThBc1Kb7I": { name: "System_Event" }, // Event Type
        "fldPdoc6JPYHV9gpb": { name: severity }, // Severity
        "fldog9l4DwJeE5Qj8": { name: "Logged" } // Resolution
      }
    });
  } catch (logErr) {
    console.error("Failed to log event:", logErr.message);
  }
}

await main();