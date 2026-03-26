# Utile PIM V2 — Complete Analysis & Implementation Guide
## Final Consolidation Report

**Project**: Utile PIM V2 Scripts (0–3B) Audit, Analysis & Onboarding  
**Date**: March 26, 2026  
**Status**: ✅ **COMPLETE** — All deliverables ready for implementation  
**Audience**: Development Team, Operations Team, Business Stakeholders

---

## Executive Summary

This report consolidates a comprehensive analysis of 8 interconnected Airtable automation scripts that manage product data ingestion, validation, and catalog generation for Utile's retail operations.

### What Was Delivered

| Deliverable | File | Purpose | Audience |
|-------------|------|---------|----------|
| **1. Code Audit Report** | [AUDIT_REPORT_V2_Scripts.md](AUDIT_REPORT_V2_Scripts.md) | 500-line compliance review; identifies 3 critical bugs, 5 high-priority issues, 12 medium-priority improvements | Dev Team |
| **2. Dependency Map** | [DEPENDENCY_MAP_and_OVERLAPS.md](DEPENDENCY_MAP_and_OVERLAPS.md) | Execution order diagram, overlap analysis, sequential enforcement rules, troubleshooting flowcharts | Dev + Ops Teams |
| **3. Onboarding Guide** | [ONBOARDING_GUIDE_TO_UPCGIT_V2.md](ONBOARDING_GUIDE_TO_UPCGIT_V2.md) | Tiered personas (Execs / Ops / Analysts); 4-zone architecture, daily workflows, field reference, issue resolution | All users |
| **4. Best Practices** | [AIRTABLE_BEST_PRACTICES_GUIDE.md](AIRTABLE_BEST_PRACTICES_GUIDE.md) | Promise handling, batching, concurrency control, numeric parsing, error recovery, monitoring patterns | Dev Team |

---

## Key Findings Summary

### 🔴 Critical Issues (Blocking Execution)

| Issue | Script | Impact | Fix Effort | Status |
|-------|--------|--------|-----------|--------|
| Undefined `alreadyReleased` variable | 0C | Approved anomalies won't release; stuck pipeline | 5 min | Ready to implement |
| Hardcoded field IDs + typo in logging | 0C | Audit trail incomplete; log system broken | 10 min | Ready to implement |
| Race condition on ETL_STATUS | 1 & 2B | Data duplicated; concurrent scripts interfere | 2 hours | Need sequential enforcement |

**Recommendation**: Fix all 3 before automation triggers go live.

### 🟡 High-Priority Issues

- Missing error handling on async operations (selectRecordsAsync not wrapped in try/catch)
- Unsafe standardization fallback (returns raw value instead of null)
- Silent failures in numeric parsing + dimension validation
- Automation mode bypasses confirmation gates

**Fix Timeline**: Next sprint (1-2 weeks)

### 🟠 Medium-Priority Issues

- No batch update retry logic
- Missing bounds checking on numeric fields
- Template literal injection risks (user input not escaped)
- Incomplete error recovery (partial batch failures)

**Fix Timeline**: Future sprints (accumulate as tech debt reduction)

---

## System Architecture (4-Zone Overview)

```
┌─────────────────────────────────────────────┐
│ ZONE 1: INTAKE PIPELINE                     │
│ (Scripts 0, 0A, 0B, 0C)                     │
│ Sequential: Supplier file → Staging →       │
│ Validation → Release                         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ ZONE 2: GOVERNANCE & STANDARDIZATION        │
│ (Rules Engine: BODY TYPE, FINISH, PRICING)  │
│ Keeps data clean & consistent                │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ ZONE 3: MASTER DATA LAYER                   │
│ (Scripts 1, 2A, 2B)                         │
│ Routes to: SupplierProductData,             │
│ ProductMaster, PricingBridge                 │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ ZONE 4: REFERENCE & PLU GENERATION          │
│ (Scripts 2A, 3, 3B)                         │
│ Finalizes codes, archives old SKUs,         │
│ generates retail product codes               │
└─────────────────────────────────────────────┘
```

---

## Script Execution Flow

### Recommended Sequence (With Parallelization)

```
0 (Manifest) → 0A (Detect) → 0B (Gate) → 0C (Release)
                                             ↓
                              [MANUAL APPROVAL BY NINA]
                                             ↓
              ┌────────────→ 1 (Stock) ──────┐
              │                               │  (Parallel if filters verified)
              └────────────→ 2B (Pricing) ───┘
                                    ↓
                            2A (Transition)
                                    ↓
                            3 (PLU Generator)
                                    ↓
                        [MANUAL APPROVAL BY NINA]
                                    ↓
                            3B (Release PLUs)
```

**Key Checkpoints**:
- ✅ Scripts 0–0C: Strictly sequential (no parallelization)
- ✅ Scripts 1 & 2B: Can run in parallel IF import types don't overlap
- ✅ Scripts 2A, 3, 3B: Sequential with manual approval gates

---

## Identified Overlaps & Risks

### Overlap 1: Scripts 1 & 2B (Both Read Staging)

| Aspect | Finding | Risk Level | Mitigation |
|--------|---------|-----------|-----------|
| **Both filter on** | `IMPORT_TYPE` (ST vs PR) | Low | If filters are correct, no row overlap |
| **Both modify** | Staging.ETL_STATUS | **HIGH** | Add optimistic locking before update |
| **Recommendation** | Run in parallel with safeguards | | See DEPENDENCY_MAP_and_OVERLAPS.md §4.2 |

### Overlap 2: Scripts 0A & 0B (Both Write UPCAdmin)

| Aspect | Finding | Risk Level | Mitigation |
|--------|---------|-----------|-----------|
| **Both write to** | UPCAdmin table | **MEDIUM** | 0A → 0B must be sequential |
| **Both filter on** | Staging (same rows) | Low | Different anomaly types ([Error Type] field separates) |
| **Recommendation** | Enforce sequential execution | | 0B starts only after 0A completes |

---

## Recommended Fixes (Priority Order)

### Phase 1: Critical (Blockers) — Implement This Week

**1.1 Script 0C: Fix Undefined Variable**
```javascript
// Current (line ~105):
if (...!alreadyReleased.has(sku)) { // ❌ undefined

// Fix:
const alreadyReleased = new Set(); // ← Add this line before loop
if (...!alreadyReleased.has(sku)) { // ✅ Now safe
```
**Effort**: 5 minutes  
**Test**: Run Script 0C with 5 approved anomalies; verify Staging rows released

---

**1.2 Script 0C: Fix Field IDs & Typo**
```javascript
// Current (lines ~135-140):
fields: {
  [LOG_SEVERITY_FID]: { name: "System_Event " }, // ❌ trailing space
  fldog9l4DwJeE5Qj8: { name: "Logged" }  // ❌ hardcoded
}

// Fix:
// Add to CONFIG:
const LOG_STATUS_FID = "fldog9l4DwJeE5Qj8";
const LOG_OPERATOR_EMAIL_FID = "fldyYs6l736JsE2iJ"; // Get real ID from schema

// Use in fields:
fields: {
  [LOG_SEVERITY_FID]: { name: "System_Event" }, // ✅ no trailing space
  [LOG_STATUS_FID]: { name: "Logged" }, // ✅ CONFIG constant
  [LOG_OPERATOR_EMAIL_FID]: normEmail // ✅ operator recorded
}
```
**Effort**: 15 minutes  
**Test**: Run Script 0C; verify SystemLogs record created with correct fields

---

**1.3 Scripts 1 & 2B: Add Optimistic Locking**
```javascript
// Before updating ETL_STATUS, re-check row:
try {
  const stagingRec = await stagingTable.selectRecordAsync(stagingRecId, {
    fields: [S_ETL_STATUS]
  });
  const currentStatus = stagingRec.getCellValueAsString(S_ETL_STATUS);
  
  if (currentStatus !== "pending") {
    log(`⚠️ SKIPPED: Status changed to '${currentStatus}' (was'pending'). Another script claimed this row.`);
    continue; // Skip this row
  }
  
  // NOW safe to proceed with update
  stagingUpdates.push({ id: stagingRecId, fields: { [S_ETL_STATUS]: "completed" } });
} catch (err) {
  log(`⚠️ Lock check failed: ${err.message}`);
  // Optional: skip row or retry
}
```
**Effort**: 1–2 hours (implement + test in both scripts)  
**Test**: Run Scripts 1 & 2B simultaneously on same test batch; verify no duplicate processing

---

### Phase 2: High-Priority — Next Sprint (1–2 weeks)

**2.1 Add Try/Catch to All selectRecordsAsync Calls**
- Files: Scripts 0A, 0B, 1, 2B, 3
- Effort: 2–3 hours
- Pattern: See AIRTABLE_BEST_PRACTICES_GUIDE.md §1

**2.2 Fix Script 2B Standardization Fallback**
- Current: Returns raw value if lookup fails (silent loss of standardization)
- Fix: Return null + log to SystemLogs for audit
- Effort: 1 hour
- Test: Add row to Staging with unstandardizable value; verify it's logged, not silently passed

**2.3 Add Numeric Parsing to Script 1**
- Use `parseNumericSafe()` function (already in Script 2B)
- Apply to dimensions, stock levels, pricing
- Effort: 30 min
- Test: Feed EU-format numbers (1.234,56); verify correct interpretation

**2.4 Improve Script 3 Automation Mode Detection**
- Current: Silent assumption of automation mode on error
- Fix: Distinguish between real errors and true automation mode
- Effort: 30 min
- Test: Run in both UI and automation contexts; verify correct behavior

---

### Phase 3: Medium-Priority — Future Sprints

**3.1 Implement Batch Update Retry Logic**
- Pattern: Try full batch; if fails, retry individual records
- Effort: 3–4 hours
- See: AIRTABLE_BEST_PRACTICES_GUIDE.md §7

**3.2 Add Bounds Checking on All Numeric Fields**
- Example: Reject dimension > 5000mm, price > $10k
- Effort: 2 hours

**3.3 Standardize Log Helper + Create Shared Utilities**
- Consolidate: `log`, `logUI`, helper functions into module
- Effort: 3 hours

---

## Implementation Checklist

### Before Going Live (Pre-Production)

- [ ] **Code Quality**
  - [ ] Fix all 3 critical issues (Phase 1)
  - [ ] Add error handling to selectRecordsAsync (Phase 2)
  - [ ] Test with 100-record batch
  - [ ] Test with 1,000-record batch
  - [ ] All errors logged to SystemLogs

- [ ] **Integration**
  - [ ] Scripts 0–0C run successfully end-to-end
  - [ ] Scripts 1 & 2B work sequentially first (baseline)
  - [ ] Identify which records use "ST" vs "PR" import types
  - [ ] Verify no records use both types (would break parallelization)
  - [ ] Test Scripts 1 & 2B in parallel (prove no race condition)

- [ ] **Automation Triggers**
  - [ ] Script 0A trigger: "When Script 0 completes"
  - [ ] Script 0B trigger: "When Script 0A completes"
  - [ ] Script 0C trigger: "When Nina approves anomalies"
  - [ ] Scripts 1 & 2B trigger: "When Script 0C completes" (parallel spawn)
  - [ ] Script 2A trigger: "When Scripts 1 & 2B complete"
  - [ ] Script 3 trigger: "When Script 2A completes"
  - [ ] All triggers tested + working

- [ ] **Monitoring & Alerts**
  - [ ] Dashboard created: "Pipeline Status" showing counts at each stage
  - [ ] Alert rule: If script > 10 min, notify admin
  - [ ] Alert rule: If > 0 errors, notify admin
  - [ ] Nina's review queue visible + bookmarked

- [ ] **Documentation & Training**
  - [ ] Ops team trained on daily checklist (ONBOARDING_GUIDE §3.2)
  - [ ] Nina trained on approval workflow
  - [ ] Execs briefed on architecture + KPIs (ONBOARDING_GUIDE §3.1)
  - [ ] Data analysts have field reference + access to dashboards
  - [ ] Troubleshooting guide (Section 6) printed & posted at Nina's desk

---

## Support Runbook

### "System not working" Flowchart

**Q1: Which script failed?**
- → See DEPENDENCY_MAP_and_OVERLAPS.md §6 (Troubleshooting Flowchart)

**Q2: What error do I see in SystemLogs?**
- → Search error message in AUDIT_REPORT_V2_Scripts.md (Section 2–4)
- → If not found → Contact dev team with exact error + script name

**Q3: How do I understand what the system just did?**
- → Read ONBOARDING_GUIDE_TO_UPCGIT_V2.md (Section 2: 4-Zone Architecture)
- → Check SystemLogs [Event Type] entries today (Section 3.3)

**Q4: A product is stuck — what do I do?**
- → Follow flowchart in DEPENDENCY_MAP_and_OVERLAPS.md §6 or ONBOARDING_GUIDE §4

---

## Metrics to Track (Long-Term Success)

| KPI | Target | How to Measure | Baseline |
|-----|--------|-----------------|----------|
| **Time to live** | < 4 hours | SystemLogs[Script 0 start] → [Script 3B end] | TBD |
| **Manual review rate** | < 10% | UPCAdmin records / total products | TBD |
| **Success rate** | > 95% | Completed ÷ Ingested | TBD |
| **Error count** | 0 | SystemLogs[Severity]="Error" | TBD |
| **Batch size** | 500+ | Monitor large file processing | TBD |

---

## Files Included in This Analysis

```
e:\projects\upcgit\
├── AUDIT_REPORT_V2_Scripts.md         ← Code quality; 3 critical + 5 high + 12 medium issues
├── DEPENDENCY_MAP_and_OVERLAPS.md     ← Execution order; overlaps; troubleshooting
├── ONBOARDING_GUIDE_TO_UPCGIT_V2.md   ← For non-devs (Execs, Ops, Analysts)
├── AIRTABLE_BEST_PRACTICES_GUIDE.md   ← For dev team (patterns, validation, monitoring)
└── CONSOLIDATION_REPORT.md            ← THIS FILE (summary + checklist)

Original Scripts Analyzed:
├── ERDIAGRAM.MD                        ← System architecture viewed
├── script-0A-rename-detecter-NEW.js
├── script- 0B-1.4.js
├── script-0C-release-runner-NEW.js
├── script-1-etl-router-NEW.js
├── script-2A-transition-complete-NEW.js
├── script-2B-unified-spec-pricing-router-NEW.js
└── script3-plu-generatorv2.js
```

---

## Next Steps

### For Development Team
1. Read AUDIT_REPORT_V2_Scripts.md — prioritize Phase 1 fixes
2. Review AIRTABLE_BEST_PRACTICES_GUIDE.md — refactor with patterns shown
3. Implement fixes in this order:
   - Critical (1 day)
   - High-priority (1 sprint)
   - Medium-priority (backlog)
4. Add unit + integration tests from AIRTABLE_BEST_PRACTICES_GUIDE.md §13

### For Operations Team
1. Read ONBOARDING_GUIDE_TO_UPCGIT_V2.md Section 3.2 (Daily Checklist)
2. Bookmark dashboard views (pipeline status, Nina's review queue)
3. Keep troubleshooting flowchart (Section 6) at desk
4. Train Nina on approval workflow before go-live

### For Business Stakeholders
1. Review ONBOARDING_GUIDE_TO_UPCGIT_V2.md Section 3.1 (Exec Summary)
2. Understand 4-Zone architecture + KPI tracking
3. Plan go-live: Schedule fixes → testing → automation triggers → training
4. Set expectations on % of products requiring Nina's review (~10%)

---

## Q&A

**Q: When can we go live?**  
A: After Phase 1 critical fixes (1 week) + basic integration testing. Recommend staged rollout: test mode first, then 100 products, then production.

**Q: Will this handle 1000+ products per file?**  
A: Yes, if chunked properly + timeout extended. See AIRTABLE_BEST_PRACTICES_GUIDE.md §11 (performance optimization).

**Q: What if a script fails mid-batch?**  
A: Partial records may be written. Implement AIRTABLE_BEST_PRACTICES_GUIDE.md §7 (error recovery) to retry failed records.

**Q: Can I run Scripts 1 & 2B in parallel today?**  
A: Not safely until Phase 1.3 (optimistic locking) is implemented. Run sequentially until then.

**Q: Who maintains these documents?**  
A: Dev team owns technical docs (Audit, Best Practices). Ops owns operational docs (Onboarding, Troubleshooting). Update when schema changes.

---

## Conclusion

The Utile PIM V2 system is **well-architected** with clear 4-zone separation and established patterns (CONFIG, log helpers, batch chunking). However, **3 critical bugs** and **missing error handling** prevent safe production deployment.

**Recommended path forward**:
1. ✅ Fix 3 critical issues (1 day)
2. ✅ Implement error handling + optimistic locking (3–5 days)
3. ✅ Integration testing (2–3 days)
4. ✅ Train teams (1 day)
5. ✅ Staged go-live (100 → 1000 products)
6. ✅ Monitor KPIs (2–4 weeks)

**Timeline to production**: 2–3 weeks (with daily dev work)

---

**Prepared by**: GitHub Copilot  
**Date**: March 26, 2026  
**Classification**: Internal — Utile Development & Operations Teams  
**Status**: ✅ **COMPLETE** — Ready for implementation planning meeting
