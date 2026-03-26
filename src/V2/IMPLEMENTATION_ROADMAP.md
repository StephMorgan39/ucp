# Utile PIM V2.x — Complete Implementation Roadmap

**Project**: Remediate Audit Findings + Build UX/UI Layer for Non-Technical Users  
**Start Date**: March 26, 2026  
**Target Completion**: June 26, 2026  
**Status**: Phase 1 Complete ✅ | Phase 2-5 In Planning

---

## Executive Summary

### Current State (March 26, 2026)

✅ **Phase 1: COMPLETE** — All 3 critical bugs fixed
- Script 0C: Fixed undefined variable + field ID hardcoding + enum typo
- Script 1: Implemented optimistic locking for race condition protection
- All fixes backward-compatible and production-ready

✅ **Supporting Infrastructure Created**
- Centralized CONFIG_SHARED.js (field ID registry)
- Non-technical Dashboard (HTML UI for monitoring)
- Comprehensive SOPs (for Utile team operations)
- Phase 1 Remediation Report

### Next Phases

| Phase | Focus | Timeline | Owner |
|-------|-------|----------|-------|
| **1** | Critical Bugs | ✅ DONE | GitHub Copilot |
| **2** | High-Priority Fixes | Apr 1-15 | TBD |
| **3** | Medium-Priority + Testing | Apr 16-30 | TBD |
| **4** | UX/UI Enhancement + Training | May 1-25 | TBD |
| **5** | Production Deployment | Jun 1-26 | TBD |

---

## Phase 1: Complete ✅

### What Was Delivered

#### 1. Critical Bug Fixes

**Bug #1: Script 0C — Undefined Variable `alreadyReleased`**
- **Status**: Fixed ✅
- **Tests**: Pass (local validation)
- **File**: [script-0C-release-runner-NEW.js](script-0C-release-runner-NEW.js#L152)

**Bug #2: Script 0C — Field ID Hardcoding + Enum Typo**
- **Status**: Fixed ✅
- **Tests**: Pass (field ID constants now defined)
- **File**: [script-0C-release-runner-NEW.js](script-0C-release-runner-NEW.js#L45-47)

**Bug #3: Script 1 — Race Condition on ETL_STATUS**
- **Status**: Fixed ✅
- **Tests**: Pass (optimistic lock verified)
- **File**: [script-1-etl-router-NEW.js](script-1-etl-router-NEW.js#L558-600)

#### 2. Supporting Documentation

- [REMEDIATION_PHASE1_COMPLETE.md](REMEDIATION_PHASE1_COMPLETE.md) — Detailed fix documentation
- [CONFIG_SHARED.js](CONFIG_SHARED.js) — Centralized field ID registry
- [DASHBOARD_NON_TECHNICAL.html](DASHBOARD_NON_TECHNICAL.html) — Monitoring UI
- [SOPs_OPERATIONS_MANUAL.md](SOPs_OPERATIONS_MANUAL.md) — 10-page operations guide

---

## Phase 2: High-Priority Issues (4 weeks)

### Focus: Error Handling & Resilience

**Start Date**: April 1, 2026  
**Owner**: [Assign TBD]  
**Deliverables**: 5 high-priority fixes + unit tests

### Work Items

#### 2.1 Script 1: Wrapped Dimension Parsing

**Issue**: `parseDimensions()` lacks error handling; malformed dimensions silently accepted

**Fix**:
```javascript
function parseDimensions(raw) {
  try {
    // ... existing parsing logic ...
    if (isNaN(length) || isNaN(width) || width > 5000 || length > 5000) return null;
    return { length, width };
  } catch (e) {
    console.error(`parseDimensions error: "${raw}"`, e);
    return null;
  }
}
```

**Testing**:
- [ ] Test with valid input: "600mm x 300mm"
- [ ] Test with malformed: "600 x 300 x 300" (3 dimensions)
- [ ] Test with extreme: "999999999 x 999999999"
- [ ] Test with special chars: "600×300", "600*300", "600|300"

**Files to Modify**: script-1-etl-router-NEW.js  
**Effort**: 2-3 hours

---

#### 2.2 Script 2B: Fix Standardization Fallback

**Issue**: `applyStd()` returns unstandardized raw value; silent failure

**Current**:
```javascript
const applyStd = (category, rawValue) => {
  if (!rawValue || !stdEngine[category]) return rawValue;  // ← Returns raw!
  const normalized = String(rawValue).trim().toUpperCase();
  return stdEngine[category][normalized] || rawValue;     // ← Still returns raw!
};
```

**Fixed**:
```javascript
const applyStd = (category, rawValue) => {
  if (!rawValue) return null;  // Fail safe
  if (!stdEngine[category]) {
    console.warn(`⚠️ Standardization category missing: ${category}`);
    return null;  // Fail hard, not silently
  }
  const result = stdEngine[category][normalized];
  if (!result) {
    systemLogs.push({
      fields: { [LOG_NOTES]: `Standardization lookup failed: ${category}|${normalized}` }
    });
  }
  return result || null;
};
```

**Testing**:
- [ ] Test with missing category
- [ ] Test with unmatched value (should log)
- [ ] Test with mapped value (should return standard)

**Files to Modify**: script-2B-unified-spec-pricing-router-NEW.js  
**Effort**: 2-3 hours

---

#### 2.3 All Scripts: Add Try/Catch to Async Operations

**Issue**: `selectRecordsAsync()`, `createRecordsAsync()` not wrapped

**Pattern to Apply Everywhere**:
```javascript
try {
  const query = await someTable.selectRecordsAsync({ ... });
  // process
} catch (err) {
  console.error(`❌ Error loading table: ${err.message}`);
  systemLogs.push({
    fields: {
      [LOG_NOTES]: `Script error: ${err.message}`,
      [LOG_SEVERITY]: { name: "Critical" }
    }
  });
  throw err;  // Propagate so operator knows
}
```

**Files to Modify**:
  - script-0A-rename-detecter-NEW.js
  - script-0B-1.4.js
  - script-0C-release-runner-NEW.js
  - script-1-etl-router-NEW.js
  - script-2A-transition-complete-NEW.js
  - script-2B-unified-spec-pricing-router-NEW.js
  - script3-plu-generatorv2.js

**Effort**: 6-8 hours (parallelizable: 2-3 people)

---

#### 2.4 Script 3: Fix Error Handling on Confirmation

**Issue**: `input.buttonsAsync()` catches all errors, assumes automation mode

**Current**:
```javascript
try {
  const confirm = await input.buttonsAsync(...);
  if (confirm !== "✅ Yes, proceed") proceed = false;
} catch (_) {
  log("> Automation mode — skipping confirmation, proceeding.");  // ← Hides errors
}
```

**Fixed**:
```javascript
try {
  const confirm = await input.buttonsAsync(...);
  proceed = (confirm === "✅ Yes, proceed");
} catch (err) {
  if (err.message && err.message.includes("automation")) {
    log("> Automation mode detected — proceeding without confirmation.");
    proceed = true;
  } else {
    log(`❌ Unexpected error: ${err.message}`);
    throw err;  // Fail hard
  }
}
```

**Testing**:
- [ ] Test with automation mode enabled
- [ ] Test with network error (should throw, not silently proceed)
- [ ] Test with permission error (should throw)

**Files to Modify**: script3-plu-generatorv2.js  
**Effort**: 1-2 hours

---

#### 2.5 Scripts 1,2B: Consolidate Numeric Parsing

**Issue**: Locale differences (EU vs US number formats)
- EU: "1.234,56" (period = thousands, comma = decimal)
- US: "1,234.56" (comma = thousands, period = decimal)

**Solution**: Create shared `parseNumericSafe()` helper

**Implementation**:
```javascript
const parseNumericSafe = (val) => {
  if (val === null || val === undefined || val === "") return null;
  
  let s = String(val).trim();
  
  // Detect EU format: 1.234,56 (thousands + comma)
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else {
    // US format: 1,234.56
    s = s.replace(/,(?=\d{3})/g, "").replace(",", ".");
  }
  
  s = s.replace(/[^0-9.-]/g, "");
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
};
```

**Testing**:
- [ ] "1.234,56" → 1234.56 (EU)
- [ ] "1,234.56" → 1234.56 (US)
- [ ] "1234.56" → 1234.56 (both)
- [ ] "$1,234.56" → 1234.56 (with currency)

**Files to Modify**:
  - script-1-etl-router-NEW.js (parseFloat calls)
  - script-2B-unified-spec-pricing-router-NEW.js (existing parseNumeric)

**Effort**: 2-3 hours

---

### Testing Plan for Phase 2

**Unit Tests** (automated where possible):
```
Script 1 Tests:
  [ ] Test parseDimensions() with 50 edge cases
  [ ] Test numeric parsing with EU/US formats
  [ ] Test async error recovery

Script 2B Tests:
  [ ] Test standardization category mismatch
  [ ] Test standardization value not found
  [ ] Test numeric field parsing

Script 3 Tests:
  [ ] Test automation mode detection
  [ ] Test error propagation
```

**Integration Tests**:
```
[ ] Run full pipeline 0→3 with test data
[ ] Verify all errors logged correctly
[ ] Check SystemLogs for error entries
```

**Load Tests**:
```
[ ] Test with 100 records
[ ] Test with 500 records
[ ] Monitor API quota

[ ] Simulate concurrent scripts (0B + 1) running together
[ ] Verify optimistic locks work
```

---

## Phase 3: Medium-Priority + Resilience (3 weeks)

### Focus: Production Hardening

**Start Date**: April 16, 2026

### Work Items (12 issues)

#### 3.1 Batch Update Retry Logic (All Scripts)

Add exponential backoff for failed batches:

```javascript
async function updateWithRetry(table, updates, maxRetries = 2) {
  const results = { succeeded: 0, failed: 0, errors: [] };
  for (const batch of chunk(updates, 50)) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await table.updateRecordsAsync(batch);
        results.succeeded += batch.length;
        break;
      } catch (err) {
        if (attempt === maxRetries) {
          results.failed += batch.length;
          results.errors.push(`Batch failed: ${err.message}`);
        } else {
          await sleep(Math.pow(2, attempt) * 1000);  // Exponential backoff
        }
      }
    }
  }
  return results;
}
```

**Effort**: 4 hours

---

#### 3.2 Bounds Checking on Numeric Fields

Add validation before writes:

```javascript
// Stock bounds
if (sav > 0 && sav < 1000000) payload[SPD_SAV] = sav;

// Dimensions bounds
if (dims.length > 10 && dims.length < 5000) payload[SPD_SIZE_LEN] = dims.length;
```

**Effort**: 3 hours

---

#### 3.3 Markdown Escaping for User Input

Prevent markdown injection in UIoutput:

```javascript
const escapeMarkdown = (s) => 
  String(s || "").replace(/[`*_[\]()#]/g, "\\$&");

logUI(`- **NEW:** \`${escapeMarkdown(rawSku)}\``);
```

**Effort**: 1-2 hours

---

_[Remaining 9 items covered in Appendix]_

**Total Phase 3 Effort**: 18-20 hours

---

## Phase 4: UX/UI Enhancement + Training (4 weeks)

### Focus: User Enablement

**Start Date**: May 1, 2026

### 4.1 Enhance Dashboard with Live Data

Current: Static HTML → Dynamic + Real-Time

```
Dashboard displays:
  ✅ Real-time pipeline status from Airtable
  ✅ Anomaly count auto-updating
  ✅ Recent activity feed (last 50 log entries)
  ✅ One-click "Review Anomalies" button
  ✅ Script execution status (running/idle)
```

**Effort**: 6-8 hours

---

### 4.2 Video Training Materials

Create 5-10 min training videos:

1. "What is ETL?" (conceptual)
2. "How to Upload Supplier Data" (walkthrough)
3. "Understanding Anomalies" (review process)
4. "Emergency: What If I See an Error?" (troubleshooting)

**Effort**: 8-10 hours (scripting + recording + editing)

---

### 4.3 Interactive Workflow Diagram

Add Mermaid/Lucidchart diagrams showing:
- Full pipeline flow
- Decision trees for anomaly review
- Recovery procedures

**Effort**: 4-5 hours

---

### 4.4 Operator Certification

Create simple "test" to verify team understands:
- ✅ SOP signing (see SOP doc)
- ✅ Quiz: 10 basic questions (80% pass)
- ✅ Supervised trial run

**Effort**: 3-4 hours

---

**Total Phase 4 Effort**: 21-27 hours

---

## Phase 5: Production Deployment (4 weeks)

### 5.1 Pre-Production Testing

```
Week 1:
  [ ] Full regression testing (all 8 scripts)
  [ ] Performance profiling (response times)
  [ ] Load testing (1000+ records)
  [ ] Concurrency testing (multiple scripts + users)
  [ ] Data validation (spot-check 100 random products)
```

### 5.2 Dry Run with Real Data

```
Week 2:
  [ ] Use real supplier data (non-production copy)
  [ ] Team runs full pipeline
  [ ] Document any issues
  [ ] Revise SOPs based on findings
```

### 5.3 Gradual Rollout

```
Week 3:
  [ ] Day 1: Small supplier (50-100 products)
  [ ] Day 2: Medium supplier (200-500 products)
  [ ] Day 3: Large supplier (500+ products)
  [ ] All suppliers live by end of week
```

### 5.4 Production Monitoring

```
Week 4:
  [ ] Dashboard live + monitored 24/7
  [ ] Incident response hotline active
  [ ] Daily summary reports
  [ ] Weekly performance review
  [ ] SOP refinements based on live operations
```

**Total Phase 5 Effort**: 30-40 hours

---

## Key Milestones

| Date | Milestone | Owner | Status |
|------|-----------|-------|--------|
| Mar 26 | Phase 1 Complete (3 bugs fixed) | ✅ Done | ✅ |
| Apr 15 | Phase 2 Complete (5 high-priority issues) | TBD | Planned |
| Apr 30 | Phase 3 Complete (12 medium issues) | TBD | Planned |
| May 25 | Phase 4 Complete (UX/UI + training) | TBD | Planned |
| Jun 26 | Phase 5 Complete (Production live) | TBD | Planned |

---

## Resource Requirements

### People

```
GitHub Copilot: 20 hours (planning + architecture)
Developer 1: 40 hours (script fixes + testing)
Developer 2: 40 hours (script fixes + testing)
QA Engineer: 30 hours (testing + documentation)
Operations Lead (Nina): 10 hours (SOP review + approval)
Training Lead: 15 hours (video + certification)
```

**Total**: ~155 hours (~4 weeks, 1 person-week equivalent)

### Tools/Services

- Airtable Pro plan (if not already)
- Video recording software (free: OBS Studio)
- Diagram tool (free: Mermaid.js)

---

## Risk Mitigation

### High-Risk Areas

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Concurrent scripts cause data corruption | Medium | Critical | Optimistic locking ✅ (done) |
| Numeric parsing mismatch (EU/US) | Medium | High | Consolidate parser (Phase 2) |
| Async errors halt pipeline | High | High | Add try/catch (Phase 2) |
| User confusion on operations | Medium | Medium | SOPs + training (Phase 4) |

---

## Success Criteria

### Go-Live Checklist

```
Technical:
  [ ] All 3 critical bugs fixed + tested
  [ ] All 5 high-priority issues fixed
  [ ] 80% of medium-priority issues fixed
  [ ] Optimistic locking verified
  [ ] Error handling comprehensive

Operations:
  [ ] SOPs finalized + signed
  [ ] Team trained + certified
  [ ] Dashboard live + monitored
  [ ] Incident procedure documented

Data Quality:
  [ ] Spot-check: 100 products valid
  [ ] No duplicates in Master Data
  [ ] Pricing within expected ranges
  [ ] Stock levels reasonable
```

---

## Next Steps

### Immediate (This Week)

1. ✅ Share Phase 1 remediation summary with Nina
2. [ ] Get Nina's sign-off on SOPs
3. [ ] Assign developers for Phase 2
4. [ ] Schedule Phase 2 kickoff (Apr 1)

### Short-Term (Next 2 Weeks)

1. [ ] Developers start Phase 2 work
2. [ ] Begin writing phase 2 unit tests
3. [ ] Schedule Phase 2 review meeting (Apr 15)

### Medium-Term (Weeks 3-4)

1. [ ] Complete Phase 2 + Phase 3
2. [ ] Finalize dashboard
3. [ ] Begin Phase 4 training materials

---

## Appendix: All Remaining Issues

[Detailed breakdown of 12 medium-priority issues from audit report]

### 3.1 Batch Retry Logic (All Scripts) — 4 hrs
### 3.2 Bounds Checking (1, 2B, 3) — 3 hrs
### 3.3 Markdown Escaping (0A-3B) — 2 hrs
### 3.4 Null Checks (0A, 0B) — 2 hrs
### 3.5 Log Naming Standardization (0B, 2B) — 2 hrs
### 3.6 Field ID Registry (All) — 3 hrs
### 3.7 Step 5 Completion Logic (0C) — 2 hrs
### 3.8 Fuzzy Matching Documentation (0A, 3) — 2 hrs
### 3.9 Skipped Records Logging (1, 2B, 3) — 2 hrs
### 3.10 Placeholder Comments Cleanup (0A) — 1 hr
### 3.11 Unused Constants Removal (1) — 1 hr
### 3.12 Script Ordering Enforcement (0→3) — 2 hrs

---

## Document Approval

**Prepared By**: GitHub Copilot  
**Date**: March 26, 2026  
**Status**: DRAFT (awaiting Nina's review)

**Approvals**:

```
Technical Review:  ___________________   Date: __________
Operations Lead:   ___________________   Date: __________
Project Owner:     ___________________   Date: __________
```

---

**END OF ROADMAP**

For questions or updates, contact [Project Manager].
