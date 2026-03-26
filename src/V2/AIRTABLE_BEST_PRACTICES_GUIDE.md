# Airtable Automation Best Practices
## Applied to Utile PIM V2 System

---

## 1. Promise & Async/Await Handling

### ❌ BAD: Missing Error Handling
```javascript
const query = await stagingTable.selectRecordsAsync({
  fields: [SKU_FIELD, STATUS_FIELD]
});
// If selectRecordsAsync fails, script crashes with unhandled rejection
```

### ✅ GOOD: With Try/Catch
```javascript
try {
  const query = await stagingTable.selectRecordsAsync({
    fields: [SKU_FIELD, STATUS_FIELD]
  });
  processRecords(query.records);
} catch (err) {
  if (err.message.includes("Unauthorized")) {
    log("❌ Permission denied — contact Airtable admin");
  } else if (err.message.includes("timeout")) {
    log("⚠️ Request timeout — retrying in 5 seconds...");
    await new Promise(r => setTimeout(r, 5000));
    // Optionally: retry logic here
  } else {
    log(`❌ Unexpected error: ${err.message}`);
  }
  throw err; // Re-throw so operator knows
}
```

### ✅ BETTER: With Retry Logic
```javascript
async function selectWithRetry(table, config, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await table.selectRecordsAsync(config);
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const delayMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s exponential backoff
      log(`Attempt ${attempt} failed. Retrying in ${delayMs}ms...`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

// Usage:
const query = await selectWithRetry(stagingTable, { fields: [SKU_FIELD] });
```

**Applied to Utile System**:
- ✅ Scripts 0A, 0B, 1, 2B, 3 should wrap `selectRecordsAsync()` calls in try/catch
- ✅ Large scripts should implement retry logic (Batch > 100 rows)
- ✅ All createRecordsAsync / updateRecordsAsync should have error recovery

---

## 2. Batch Operation Limits & Chunking

### Airtable API Limits
- **Max records per create/update in 1 call**: 100
- **Max fields per request**: 50
- **Rate limit**: 5 requests/second (if scaled, can increase)

### ❌ BAD: Single Massive Batch
```javascript
const updates = [];
for (const row of allPendingRows) { // Could be 1000+ records
  updates.push({
    id: row.id,
    fields: { status: "completed" }
  });
}
await table.updateRecordsAsync(updates); // ❌ May exceed limit if > 100
```

### ✅ GOOD: Chunked Batches
```javascript
const chunk = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const updates = [];
// ... populate updates ...

for (const batch of chunk(updates, 50)) { // 50 at a time = safe + performant
  await table.updateRecordsAsync(batch);
  log(`✅ Batch of ${batch.length} records updated`);
}
```

**Applied to Utile System**:
- ✅ All scripts use `chunk(updates, 50)` before batch operations
- ✅ SystemLogs: Log batch count + success/failure for audit trail
- ✅ Consider: If batch fails, retry individual records from that batch instead of entire batch

---

## 3. Template Literals & String Escaping

### ❌ BAD: User Input Not Escaped
```javascript
const rawSku = row.getCellValueAsString("field_id"); // "162`3[456" (contains markdown chars)
log(`🏷️ SKU: ${rawSku}`); // Renders as 🏷️ SKU: 162`3[456 (markdown broken)
```

### ✅ GOOD: Escaped Input
```javascript
function escapeMarkdown(str) {
  // Escape markdown special characters
  return String(str || "")
    .replace(/[`*_\[\]()#]/g, "\\$&") // Escape special chars
    .replace(/</g, "&lt;") // Prevent HTML injection
    .replace(/>/g, "&gt;");
}

const rawSku = row.getCellValueAsString("field_id");
log(`🏷️ SKU: ${escapeMarkdown(rawSku)}`);
// Renders as 🏷️ SKU: 162\`3\[456 (safe)
```

**Applied to Utile System**:
- ✅ Scripts 0A, 0C: Wrap all user-supplied fields in `escapeMarkdown()`
- ✅ Store raw data separately; only escape for display
- ✅ Test with special characters before production

---

## 4. Numeric Parsing Edge Cases

### ❌ BAD: Locale-Unaware Parsing
```javascript
const price = parseFloat("1.234,56"); // EU format → parseFloat returns 1.234 (wrong!)
// Developer expected: 1234.56
```

### ✅ GOOD: Locale-Aware Parsing
```javascript
function parseNumericSafe(val, locale = "detect") {
  if (val === null || val === undefined || val === "") return null;
  
  let s = String(val).trim();
  
  // Detect format if auto
  if (locale === "detect") {
    // EU format: 1.234,56 (has both . and ,)
    if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
      s = s.replace(/\./g, "").replace(",", "."); // Remove dots, convert , to .
    }
    // US format: 1,234.56 (has both , and .)
    else if (/\d{1,3}(,\d{3})*\.\d+/.test(s)) {
      s = s.replace(/,/g, ""); // Remove commas
    } else {
      // Single separator or none
      s = s.replace(/,/g, "."); // Assume comma = decimal
    }
  }
  
  // Remove non-numeric characters
  s = s.replace(/[^0-9.-]/g, "");
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

// Test cases:
console.log(parseNumericSafe("1.234,56"));  // 1234.56 ✅
console.log(parseNumericSafe("1,234.56"));  // 1234.56 ✅
console.log(parseNumericSafe("1234.5"));    // 1234.5 ✅
```

**Applied to Utile System**:
- ✅ Script 2B has `parseNumeric()` — use it consistently in Scripts 1, 2A
- ✅ Add bounds checking: `if (n < 0 || n > 999999999) return null` (reject outliers)
- ✅ Log parse failures to SystemLogs for audit

---

## 5. Input Validation & Null-Safety

### ❌ BAD: No Null Checks
```javascript
const desc = row.getCellValueAsString("field_id"); // Could be ""
const similarity = calculateSimilarity(desc, template);
// If desc is empty, similarity may return NaN or 0 (unclear behavior)
```

### ✅ GOOD: Explicit Validation
```javascript
const desc = row.getCellValueAsString("field_id")?.trim() || "";
if (desc.length < 3) {
  log(`⚠️ Skipping: description too short or empty (SKU: ${sku})`);
  continue;
}
const normalized = normalizeText(desc);
const similarity = calculateSimilarity(normalized, template);
if (similarity < 0 || similarity > 1) {
  throw new Error(`Invalid similarity score: ${similarity}`);
}
```

**Applied to Utile System**:
- ✅ Script 0A: Add check `if (!rawDesc || rawDesc.length < 5) continue`
- ✅ Script 1: Add bounds checking on dimensions (reject if > 10000mm)
- ✅ Script 2B: Validate numeric fields before writing to PricingBridge

---

## 6. Concurrency & Locking

### ❌ BAD: Race Condition (Script 1 & Script 2B)
```javascript
// Both scripts read Staging row with status='pending'
// Both think they own this row
// Both write to ETL_STATUS = 'completed'
// Row processed twice, data duplicated
```

### ✅ GOOD: Optimistic Locking
```javascript
async function processWithLock(table, recordId, expectedStatus = "pending") {
  // Step 1: Read current status
  const record = await table.selectRecordsAsync({
    fields: ["field_id_status"]
  });
  const current = record.records.find(r => r.id === recordId);
  
  // Step 2: Check-before-write
  if (current.getCellValueAsString("field_id_status") !== expectedStatus) {
    log(`⚠️ LOCK FAILED: Status changed from '${expectedStatus}' to '${current.getCellValueAsString("field_id_status")}'`);
    return false; // Another script got here first
  }
  
  // Step 3: Write with confidence
  await table.updateRecordAsync(recordId, {
    "field_id_status": "in_progress"
  });
  return true;
}

// Usage:
if (await processWithLock(staging, rowId, "pending")) {
  // Safe to proceed — we own this row now
  // Process...
  await table.updateRecordAsync(rowId, { status: "completed" });
} else {
  log("Skipped — another script claimed this row");
}
```

**Applied to Utile System**:
- ✅ Script 1: Before updating Staging.ETL_STATUS, re-check it's still "pending"
- ✅ Script 2B: Same pattern
- ✅ Add sequential enforcement: Only Script 1 "owns" ST rows; only Script 2B "owns" PR rows

---

## 7. Error Recovery & Rollback

### ❌ BAD: Partial Batch Failure → No Recovery
```javascript
const updates = [record1, record2, record3, record4, record5]; // 5 records
await table.updateRecordsAsync(updates);
// If fails at record 3, records 1-2 may be updated but 3-5 not
// State is now inconsistent; manual cleanup needed
```

### ✅ GOOD: Error Recovery with Granular Retry
```javascript
async function updateWithRecovery(table, updates) {
  const results = { succeeded: [], failed: [], errors: [] };
  
  // Strategy 1: Try full batch first (fast path)
  try {
    await table.updateRecordsAsync(updates);
    results.succeeded = updates;
    return results;
  } catch (err) {
    log(`⚠️ Batch failed: ${err.message}. Attempting individual records...`);
  }
  
  // Strategy 2: Fall back to individual records (slow but recoverable)
  for (const update of updates) {
    try {
      await table.updateRecordAsync(update.id, update.fields);
      results.succeeded.push(update);
    } catch (err) {
      results.failed.push(update);
      results.errors.push(`Record ${update.id}: ${err.message}`);
      log(`❌ Failed to update ${update.id}: ${err.message}`);
    }
  }
  
  // Summary
  log(`Results: ${results.succeeded.length} OK, ${results.failed.length} FAILED`);
  if (results.failed.length > 0) {
    log("Failed records (will retry next run):");
    results.failed.forEach(r => log(`  - ${r.id}`));
  }
  
  return results;
}
```

**Applied to Utile System**:
- ✅ Scripts 1, 2B: Implement `updateWithRecovery()` pattern
- ✅ Log failed records + retry on next script run
- ✅ Create "Retry Queue" view in Staging table to track failed records

---

## 8. Partial Updates: Only Write Changed Fields

### ❌ BAD: Overwrite Everything
```javascript
payload[BODY_TEMP_FID] = cleanBody;
payload[FINISH_FID] = undefined; // Accidentally overwrites existing finish
await table.updateRecordAsync(id, payload);
```

### ✅ GOOD: Only Write Non-Empty Fields
```javascript
const payload = {};
const cleanBody = applyStd("BODY_TYPE", rawBody);
if (cleanBody) {
  payload[BODY_FID] = cleanBody;
}
const cleanFinish = applyStd("BODY_FINISH", rawFinish);
if (cleanFinish) {
  payload[FINISH_FID] = cleanFinish;
}
// Only fields with values are in payload
await table.updateRecordAsync(id, payload);
```

**Applied to Utile System**:
- ✅ All scripts: Check field exists non-null before adding to payload
- ✅ Script 1 & 2B: Never overwrite lookup fields or links unintentionally

---

## 9. Logging Strategy

### ❌ BAD: Silent Failures
```javascript
if (!normKey) return; // Silent skip, no indication anything happened
```

### ✅ GOOD: Explicit Logging
```javascript
if (!normKey) {
  countSkipped++;
  await logEvent(sysLogTable, "Skipped_Invalid_SKU", 
    `SKU format invalid: "${rawSku}". Skipped this row.`,
    "Info");
  continue;
}
```

**Logging Checklist**:
- [ ] Script start time + parameters
- [ ] Count of records processed (success + failure)
- [ ] Each skipped record with reason
- [ ] Each error with stack trace
- [ ] Script end time + total duration
- [ ] Summary metrics (created / updated / failed counts)

---

## 10. Automation Mode Compatibility

### ❌ BAD: UI-Only Features (Script Fails in Automation)
```javascript
const response = await input.buttonsAsync("Proceed?", [
  { label: "Yes"},
  { label: "No" }
]); // Automation mode has no UI → script hangs/fails
```

### ✅ GOOD: UI + Automation Support
```javascript
const response;
try {
  response = await input.buttonsAsync("Proceed?", [
    { label: "Yes" },
    { label: "No" }
  ]);
} catch (err) {
  if (err.message && err.message.includes("automation")) {
    log("> Automation mode detected — proceeding without confirmation");
    response = "Yes";
  } else {
    throw err;
  }
}

if (response === "Yes") {
  // Proceed...
}
```

**Applied to Utile System**:
- ✅ Scripts 0C & 3B: Both use try/catch on `input.buttonsAsync()`
- ✅ Automation triggers should pass `--automation` flag or detect mode
- ✅ Log: "Automation mode used — confirmation skipped" for audit trail

---

## 11. Performance Optimization

### SELECT Only Needed Fields
```javascript
// ❌ BAD: Select all fields (slow)
const query = await table.selectRecordsAsync();

// ✅ GOOD: Select only what you need
const query = await table.selectRecordsAsync({
  fields: [SKU_FID, STATUS_FID, DESCRIPTION_FID] // 3 fields only
});
// Faster network transfer + fewer API charges
```

### Test on Large Tables
```javascript
// Unit test with realistic data size
const largeQuery = await productMaster.selectRecordsAsync({
  fields: [SKU_FID],
  // Add: recordMetadata.pageSize if > 100k records
  maxRecords: 1000 // Limit for testing
});

console.time("Processing");
for (const record of largeQuery.records) {
  // Process...
}
console.timeEnd("Processing");
// Log durations for optimization tracking
```

---

## 12. Configuration Pattern (Example from Utile System)

### ❌ BAD: Fields Scattered Throughout Script
```javascript
const SKU_FID = "field123";
const STATUS_FID = "field456";
// ... 20 more ...

// Deep in a function:
const desc = row.getCellValueAsString("field_xyz"); // Which field?
```

### ✅ GOOD: Centralized CONFIG
```javascript
const CONFIG = {
  scriptName: "Script 1",
  scriptVersion: "2.2",
  
  tables: {
    staging: "tblcPSP5NcP0ioUP8",
    spd: "tbl7mZpHJCUs1r0cg",
    logs: "tblk1v5VHPEC2c2u2"
  },
  
  fields: {
    staging: {
      supplierSku: "fldeEd9FiNq5AtGNk",
      etlStatus: "fldbrUDvLv8OEnEqh",
      description: "fldkAm1iLOJJYmzmi"
    },
    spd: {
      sku: "fldK3FyPA98F3smc9",
      description: "fldoROoSpEm5FuUnI"
    }
  },
  
  tuning: {
    dryRun: false,
    batchSize: 50,
    maxRetries: 2
  }
};

// Usage throughout script:
const F = CONFIG.fields;
const desc = row.getCellValueAsString(F.staging.description);
```

**Benefits**:
- All field IDs in one place (easy to update if Airtable schema changes)
- Easy to enable/disable features (dryRun, batch size)
- Version tracking
- Self-documenting code

---

## 13. Testing & Validation Checklist

### Before Production Deployment

- [ ] **Unit Tests**
  - Empty input (null, "", 0)
  - Large input (10k+ characters, 999999)
  - Special characters (`"test\n<script>alert(1)</script>"`)
  - Mixed locale numbers (1.234,56 and 1,234.56)

- [ ] **Integration Tests**
  - Scripts run in order (0A → 0B → 0C → 1 → 2B → 2A → 3)
  - Data flows correctly Staging → SupplierProductData → ProductMaster
  - Cross-table links maintain integrity

- [ ] **Load Tests**
  - 100 records (baseline)
  - 1,000 records (realistic batch)
  - 10,000 records (stress test)
  - Monitor: Duration + API quota usage

- [ ] **Error Path Tests**
  - Network timeout → retries work?
  - Permission denied → error message clear?
  - Partial batch failure → records recoverable next run?

---

## 14. Monitoring & Alerting

### Recommended Metrics to Track

| Metric | Target | Alert If | Tool |
|--------|--------|----------|------|
| Script runtime | < 5 min | > 10 min | SystemLogs timestamp comparison |
| Error count | 0 | > 0 | SystemLogs [Severity] = "Error" |
| Success rate | > 95% | < 90% | Count completed / total ingested |
| Staging backlog | < 50 rows | > 100 rows | Staging [ETL_Status] = "pending" count |
| Nina's review queue | < 20 items | > 50 items | UPCAdmin [Resolution] = "Unresolved" count |

---

## 15. Documentation Standards

### For Each Script: Include

```
# SCRIPT NAME — Purpose v{VERSION}

## What It Does
[1-2 sentences in plain English]

## Trigger
[When does it run? Automation? Manual?]

## Input
[Which table? What fields?]

## Output
[Which tables updated? What fields set?]

## Error Cases
[What can go wrong? How does it fail gracefully?]

## Dependencies
[Must run after Script X?]

## Config
[Tunable variables: DRY_RUN, batchSize, etc.]
```

---

## Summary: Apply These to Utile System

**Immediate Fixes** (This Sprint):
1. Add try/catch to `selectRecordsAsync()` in Scripts 1, 2B, 3
2. Fix Script 2B `applyStd()` to fail-hard not fail-silent
3. Add optimistic locking to Scripts 1 & 2B before ETL_STATUS update
4. Implement `updateWithRecovery()` in all batch update operations

**Short Term** (Next Sprint):
5. Standardize log helper naming (`log` everywhere)
6. Create shared utility module for numeric parsing + escaping
7. Add comprehensive bounds checking on numeric fields
8. Implement batch update retry with exponential backoff

**Long Term** (Future):
9. Create monitoring dashboard (runtime, error counts, success rate)
10. Add load testing suite (1k, 10k record batches)
11. Investigate database transaction logging (Airtable API vs. custom)
12. Consider queue system for high-volume scaling

---

**Version**: 1.0  
**Date**: March 26, 2026  
**Status**: ✅ Ready for implementation
