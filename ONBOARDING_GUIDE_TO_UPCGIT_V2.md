# Utile PIM V2 Onboarding Guide
## For Business Stakeholders, Operations Teams, and Data Analysts

**Version**: 1.0  
**Date**: March 26, 2026  
**Audience**: Non-technical PIM users (buyers, ops managers, data analysts)

---

## Table of Contents
1. [Executive Overview](#1-executive-overview)
2. [How the System Works (The 4 Zones)](#2-how-the-system-works)
3. [Persona-Specific Guides](#3-persona-specific-guides)
   - [For Business Stakeholders](#31-for-business-stakeholders-executive-summary)
   - [For Operations/QA Team](#32-for-operationsqa-team-daily-workflow)
   - [For Data Analysts](#33-for-data-analysts-technical-reference)
4. [Common Issues & Resolution](#4-common-issues--resolution-paths)
5. [Field Reference Guide](#5-field-reference-guide)
6. [Troubleshooting Flowchart](#6-troubleshooting-flowchart)
7. [Best Practices & UI/UX Tips](#7-best-practices--uiux-tips)

---

## 1. Executive Overview

### What is Utile PIM V2?

The Utile Product Information Management (PIM) system is an **automated data pipeline** that ingests supplier data (product details, pricing, stock levels) and transforms it into a standardized master catalog for your retail operations.

**Business Goals**:
- Reduce manual data entry by 80% (eliminate copy-paste errors)
- Accelerate new product launches from weeks to hours
- Eliminate pricing mismatches between supplier files and your store system
- Maintain a single source of truth (SSOT) for all product information

**In Plain English**:
> When a supplier sends a file with 500 product codes, variations, and pricing, our system:
> 1. ✅ Automatically detects renamed/substituted products (did Decobella just rebrand SKU X to Y?)
> 2. ✅ Validates the pricing (is this a realistic price or a data error?)
> 3. ✅ Routes stock, pricing, and specs to separate tables (so your warehouse sees stock, finance sees costs)
> 4. ✅ Flags anything unusual for Nina's review (if needed)
> 5. ✅ Generates product codes for your POS system
> 6. ✅ Creates an audit trail so you know exactly what changed and who approved it

---

## 2. How the System Works

### The 4-Zone Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                    ZONE 1: INTAKE PIPELINE                         │
│      (Supplier File → Staging → Validation → Release)              │
│                                                                    │
│  Your supplier sends:  Decobella_March2026.xlsx                   │
│     ↓ Auto-ingested ↓                                             │
│  Scripts 0→0A→0B→0C: Rename detection, price checks, gate         │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│                    ZONE 2: GOVERNANCE & RULES                      │
│      (Standardization Engine - Think: "Style Guide for Data")     │
│                                                                    │
│  If supplier says: "Porcelain" → We convert to: "Ceramic_Matt"   │
│  If supplier says: "1,234.56" → We convert to: 1234.56 (numeric) │
│  Rules stored in: Standardization table (updatable by ops team)  │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│                    ZONE 3: MASTER DATA LAYER                       │
│      (Routes to: Supplier Data → Product Master → Pricing)        │
│                                                                    │
│  ✓ Stock levels → SupplierProductData                            │
│  ✓ Product specs → ProductMaster                                 │
│  ✓ Pricing info → PricingBridge                                  │
│  ✓ Old products → Legacy archive                                 │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│                    ZONE 4: REFERENCE & ASSETS                      │
│      (Product codes, images, category mappings)                    │
│                                                                    │
│  Zone 3 data enriched with:                                        │
│  □ Material type (Porcelain, Ceramic, Stone)                      │
│  □ Finish type (Matt, Gloss, Lappato)                            │
│  □ Product images (linked from DAM)                               │
│  □ Retail pricing & margin calculations                           │
└────────────────────────────────────────────────────────────────────┘
```

### The 8 Scripts: What They Do

| # | Script Name | Does What | Who Runs It | When |
|---|-------------|-----------|------------|------|
| **0** | Manifest Mapper | Reads supplier file, maps to Staging table | System auto (webhook) | When file arrives |
| **0A** | Rename Detector | Finds if product was rebrand/substituted (.A variants) | System auto | After Script 0 |
| **0B** | Validation Gate | Checks for price errors, inconsistencies → holds for Nina | System auto | After Script 0A |
| **0C** | Release Runner | Nina approves held records → script releases them | Nina manually + auto | After 0B complete |
| **1** | ETL Router | Routes stock levels to Supplier Product Data | System auto | After 0C |
| **2A** | Transition Mgr | Archives old product codes, activates new ones | Nina + auto | After routing done |
| **2B** | Pricing Router | Routes pricing & specs to Product Master & Pricing Bridge | System auto | Same time as Script 1 |
| **3** | PLU Generator | Proposes product codes (163XX format) for Nina review | System auto | After all routing |
| **3B** | PLU Release | Nina approves codes → locks product codes in system | Nina manually | After Script 3 |

---

## 3. Persona-Specific Guides

### 3.1 FOR BUSINESS STAKEHOLDERS (Executive Summary)

**Your Role**: You care about KPIs (how fast products launch, data quality, operational risk)

**Key Metrics You Should Track**:

| Metric | Target | How to Measure | In System |
|--------|--------|-----------------|-----------|
| **Time from supplier file to live product** | < 4 hours | Check SystemLogs timestamps (Script 0 start → Script 3B end) | SystemLogs table, filter by date |
| **% of products requiring manual review** | < 10% | Count of UPCAdmin records / total products ingested | UPCAdmin table, [Approved] ÷ [all records] |
| **Data quality score** | > 95% correct | Check for missing fields, invalid pricing | SystemLogs [Missing_Data] count |
| **Script success rate** | 100% (or auto-retry) | Are all scripts completing without errors? | SystemLogs [System_Event] = "Error" |

**How to Use the System** (Non-technical):

1. **Supplier File Arrives** → Upload to Airtable or FTP folder
2. **System Runs (2-3 hours)** → All 8 scripts execute in order
3. **Check Dashboard** → "Pipeline Flow" shows:
   - ✅ 450 products ingested
   - ⚠️ 12 anomalies flagged for review
   - ✅ 438 live on shelf (ready for POS)

4. **If Anomalies Exist** → Nina reviews in UPC Admin table
   - **Price issue?** → Check Pricing Bridge for recent changes
   - **Renamed product?** → Check file history with supplier
   - **Missing data?** → Supplier needs to re-submit with detail

5. **Track Success** → By end of day, all products should be "Completed" or "Approved"

**Risk Scenarios & Action Items**:

| Scenario | What Happened | Your Action |
|----------|---------------|-------------|
| **"Scripts 1 & 2B both modified same product"** | System concurrency bug | Contact dev team; see Audit Report Section 1.3 |
| **"Prices completely wrong"** | Supplier file in EU format (comma decimal) | Ask supplier for US format; system may need locale fix |
| **"500 anomalies suddenly flagged"** | Usually: new supplier, first batch | Normal. Have Nina review; adjust Standardization rules after |
| **"System took 6 hours instead of 2"** | Large batch OR quota limits hit | Check Airtable API usage; may need to split ingestion |

---

### 3.2 FOR OPERATIONS/QA TEAM (Daily Workflow)

**Your Role**: You monitor the pipeline, resolve data issues, and keep Nina in the loop

**Daily Checklist**:

```
⬜ 9:00 AM:  Check SystemLogs for overnight runs
           → Any errors? → Forward to dev team
           
⬜ 9:15 AM:  Count pending records in Staging table
           → Filter: ETL_STATUS = "pending" or "pending_review"
           
⬜ 9:30 AM:  If count > 0:
             → Notify Nina: "X products ready for review"
             
⬜ 10:00 AM: Check UPC Admin for anomalies
            → Copy count + severity levels
            → Share with Nina: "Pricing issues: 5 | Missing data: 3"
            
⬜ EOD:      Verify all pending records are "completed"
            → If not → Check logs for failures → Retry or escalate
```

**Common Tasks**:

#### Task 1: Investigate a Flagged Product

**Scenario**: Nina flagged product SKU#5678 as "Price too high" in UPC Admin

**Steps**:
1. Open **Staging table** → Search for SKU 5678
2. Note the fields: Supplier SKU, Price, Description
3. Open **SupplierProductData table** → Find same SKU
   - Compare: Current price vs. incoming price
   - If change > 15% → Price spike (flag is correct)
4. Check **PricingBridge table** → Historical pricing
   - Look for pattern: Is this a seasonal change? (March → new season?)
5. **Resolution**:
   - ✅ If reasonable → Approve in UPC Admin (Nina decides)
   - ❌ If error → Mark "Rejected" + note reason → System will re-propose after fix

#### Task 2: Monitor Stock Levels

**Scenario**: Warehouse asks "How much tile stock do we have incoming?"

**Steps**:
1. Open **SupplierProductData table**
2. Filter: Supplier = "Decobella" + Product Type = "Wall Tile"
3. Columns to check: Available, ETA, Stock Status
4. **Interpretation**:
   - Green ✅ = Stock confirmed + ETA within 2 weeks
   - Yellow ⚠️ = Low stock OR no ETA
   - Red ❌ = Discontinued or 0 available

#### Task 3: Handle a "Renamed" Product

**Scenario**: Script 0A detected: Old code 1234 → New code 1234-B (Decobella renamed it)

**What happens automatically**:
1. Script 0A logs to SystemLogs (auto-marked reviewed ✓)
2. Script 1 creates ProductMaster record for both old (1234) & new (1234-B)
3. Script 2A archives old code → marks "Deprecated"

**Your role**:
- ✅ Monitor SystemLogs for [Rename_Detection] entries
- ✅ Verify both products appear in ProductMaster
- ✅ Notify sales: Use new code (1234-B) going forward

**If something goes wrong**:
- Script didn't create new product? → Check Staging table for import errors
- Old product not archived? → Run Script 2A manually

#### Task 4: Approve Bulk Products for PLU Codes

**Scenario**: Script 3 generated 120 product codes (16301234, 16302567, etc.). Nina reviews them.

**Review Checklist** (in UPC Admin table):
- [ ] Product name matches expected description?
- [ ] Material type (TT code, e.g., "01" = Ceramic) correct?
- [ ] Size dimensions in ProductMaster match supplier data?
- [ ] Colour code (final digit) sequential for color products?

**Approval Process**:
1. Open UPC Admin table, filter: [Error Type] = "PLU_Ready" + [Resolution] = "Unresolved"
2. For each record:
   - Read the Note (contains code breakdown)
   - ✅ Tick [Approved] checkbox, or
   - ❌ Set [Resolution] = "Rejected" + explain why
3. When all reviewed → Click "Release Approved Codes" button
4. Script 3B writes codes to ProductMaster
5. ✅ Products now have live codes

---

### 3.3 FOR DATA ANALYSTS (Technical Reference)

**Your Role**: You audit data quality, tune standardization rules, and investigate edge cases

#### Data Quality Audits

**Query 1: Identify Products with Missing Critical Fields**

```
SELECT ProductMaster.*
WHERE 
  (SKU_Master is empty OR
   Description is empty OR
   Size_Length_MM is empty)
AND Status != "Discontinued"
```

**Action**: These products can't be PRO'd. Send list to Nina for re-enrichment.

**Query 2: Detect Pricing Anomalies**

```
SELECT SupplierProductData.*, PricingBridge.*
WHERE 
  (PricingBridge.Cost > 500 AND ProductType = "Floor_Tile") OR
  (PricingBridge.Cost < 1 AND ProductType != "Accessories")
```

**Action**: Investigate — may be data entry errors or currency issues.

#### Standardization Rule Tuning

**Problem**: Supplier sends finish as "Matt" but system expects "Matte"

**Current State**: 
- Standardization rule exists: "MATT" → "Matte"
- But Script 2B drops it (returns raw if not in engine)

**Fix**:
1. Open **Standardization table**
2. Add new row: Category = "BODY_FINISH", Input = "MATT", Output = "Matte", Feasible = "Yes"
3. Re-run Script 2B on test batch
4. Verify: SupplierProductData.Finish field now shows "Matte"

**Testing Standardization Changes**:
```
1. Make change to Standardization table
2. Create test Staging row with raw value (e.g., "MATT")
3. Manually run Script 2B (or subset)
4. Check SystemLogs for: 
   - "Standardization lookup failed" = rule not applied
   - OR field updated correctly = success
5. If success → roll out to production
6. If fail → revert + investigate
```

#### Field ID Cross-Reference

**Why Important?** Scripts reference fields by ID (not name), so if field ID changes, script breaks.

**Current Field IDs**:

| Table | Field Name | Field ID | Script Used | Version |
|-------|-----------|----------|-------------|---------|
| **Staging** | Supplier SKU | fldeEd9FiNq5AtGNk | 0,0A,0B,1,2B,3 | All |
| Staging | ETL Status | fldbrUDvLv8OEnEqh | 0,0A,0B,1,2B,3 | All |
| **ProductMaster** | SKU Master | fldMfK3uyPnDbKONn | 0C,1,3,3B | All |
| ProductMaster | Description | fld7hdhxyu61r5Olm | 0A,1,2A,3 | All |
| **SystemLogs** | Notes | fld4l6AJhVNRzIaY8 | All scripts | All |
| SystemLogs | Event Type | flda8oHUThBc1Kb7I | All scripts | All |
| **UPCAdmin** | Original Value | fld0wlmRbNFgVpbXS | 0A,0B,3,3B | All |
| UPCAdmin | Approved | flddfVzPFP0NjYhVc | 0C,3 | All |

**If Field ID Changes**:
- ⚠️ **Contact dev team immediately** — scripts will break
- Scripts have hard-coded field IDs; can't auto-update
- Typical fix time: 1 hour (update CONFIG blocks in each script)

---

## 4. Common Issues & Resolution Paths

### Issue 1: "Staging Row Stuck in 'Pending Review' Forever"

**Symptom**: 
- Product shows in Staging table with ETL_STATUS = "pending_review"
- It's been 2 hours, status unchanged
- Product isn't flowing to ProductMaster

**Root Cause**:
- Script 0B held this row (found validation issue)
- UPC Admin record created but Nina hasn't touched it yet

**Resolution Flowchart**:
```
Step 1: Check UPC Admin table
  → Search for same SKU in [Detected Value] field
  → Is record there? 
    YES ✅ → Go to Step 2
    NO  ❌ → Script 0B bug; contact dev team

Step 2: Check record details
  → Read [Notes] field — why was it held?
  → Is [Approved] checkbox ticked?
    YES ✅ → Go to Step 3
    NO  ❌ → Nina hasn't reviewed yet; wait or ask Nina

Step 3: Manually trigger Script 0C Release
  → If approved but status not updated → run Script 0C manually
  → Check SystemLogs for release confirmation
  → Staging row should now be "completed"

Step 4: Verify downstream
  → Check ProductMaster — does product now exist?
  → If YES ✅ → Issue resolved
  → If NO ❌ → Scripts 1/2B may not have run; trigger them manually
```

### Issue 2: "Same Product Has TWO Codes (Unexpected Duplicate)"

**Symptom**:
- ProductMaster has 2 records for same supplier SKU (e.g., both 1630xxxx and 1630yyyy)
- When querying, get duplicate results
- Unclear which code is "correct"

**Root Cause**:
- Usually: Script 1 & 2B ran in parallel, both created new records
- OR: Product transition not completed (old .Z code still active)

**Resolution**:
```
Step 1: Open ProductMaster records side-by-side
  → Check Status field
    - ACTIVE = current code (use this one)
    - DEPRECATED or Discontinued = old code
    
Step 2: Check dates
  → Look at [Created] timestamp
  → Newer record usually the "right" one
  
Step 3: If unclear, ask Nina:
  → Which code should POS use?
  → Archive the other one (run Script 2A if needed)
  → Update SystemLogs with decision
  
Step 4: Verify no other products linked to wrong code
  → Check PricingBridge [Product SKU] = {old_code}
  → If linked → update before archiving
```

---

## 5. Field Reference Guide

### Staging Table Fields (Supplier Input)

| Field | Type | Description | Example | Script Used |
|-------|------|-------------|---------|------------|
| **Supplier SKU** | Text | Raw code from supplier file | "5678-A" | 0,0A,0B,1,2B |
| **ETL Status** | Select | Pipeline gate (pending → pending_review → completed) | "pending" | 0,1,2B |
| **Import Type** | Select | "ST" = stock/costs; "PR" = pricing/specs | "ST" | 1,2B |
| **Description** | Text | Product name/title from supplier | "Porcelain Wall Tile 60x60" | 0A,1,2B |
| **Price** | Number | Supplier list price (ex tax) | 45.50 | 0B,2B |
| **Discontinued** | Checkbox | Is product end-of-life? | TRUE | 0B |
| **EOR_Stock** | Number | Warehouse sell-off units if discontinued | 100 | 1 |
| **Dimensions** | Text | Size in mm (parsed by Script 1) | "600x600" or "60cm x 60cm" | 1 |

### ProductMaster Table Fields (Live Master Data)

| Field | Type | Description | Script Sets | Who Updates |
|-------|------|-------------|-------------|-------------|
| **SKU_Master** | Text (CODE) | Final product code (163TTBBBBNN) | 3B | Script 3B (Manual approve) |
| **Description** | Text | Product name (enriched) | 1,2A | Scripts 1 & 2A, manual edit |
| **Status** | Select | ACTIVE / DEPRECATED / Discontinued | 2A | Script 2A, Nina manual |
| **Body Type** | Link | Material: Ceramic, Porcelain, Stone, etc. | Manual | Nina (enrichment) |
| **Size_Length_MM** | Number | Length in mm | 1 (if dims provided) | Supplier data or manual |
| **Colour Link** | Link | Color/finish of product | Manual | Nina (enrichment gate) |
| **Supplier_Link** | Link | Which supplier (Decobella, etc.) | 1 | Supplier ingestion |

### SupplierProductData Table Fields (Stock & Costs)

| Field | Type | Description | Set By | Triggers |
|-------|------|-------------|--------|----------|
| **Data_ID** | Text | Linked to Supplier SKU | Script 1 | Master index |
| **Available** | Number | Current stock level (sqm or units) | Script 1 | Automatic on file upload |
| **ETA** | Date | Expected delivery date | Script 1 | Updated each file |
| **SRP_ex** | Currency | Supplier recommended price | Script 1 | Pricing guardrail (Script 2B) |
| **Stock_Status** | Select | GREEN/YELLOW/RED (status indicator) | Formula | Auto-calculated |
| **Stock_Update** | Date | When this row last changed | Script 1 | "Today" timestamp added |

### UPCAdmin Table Fields (Review Queue)

| Field | Type | Description | Populated By | Nina Action |
|-------|------|-------------|--------------|------------|
| **Error Type** | Select | Price_Spike / PLU_Ready / Rename_Detection | Scripts 0A,0B,3 | Read only |
| **Original Value** | Text | Detected issue / Proposed code | Scripts 0A,0B,3 | Read only |
| **Notes** | Text | Human-readable explanation | Scripts 0A,0B,3 | Read only (educates Nina) |
| **Approved** | Checkbox | Did Nina approve this? | Nina (manual) | ☑ to approve |
| **Resolution Status** | Select | Unresolved / Approved / Rejected | Nina (manual) | Choose action |
| **Approved By** | Collaborator | Record of who approved | Auto-fills when [Approved]=true | Auto-captured |

### SystemLogs Table Fields (Audit Trail)

| Field | Type | Description | Script Writes | Example |
|-------|------|-------------|---------------|---------|
| **Notes** | Text | What happened (plain English) | All | "Available stock figure skipped — matches SRP ex (Decobella price placeholder)" |
| **Event Type** | Select | System_Event / Error / Missing_Data / Rename_Detection | All | "System_Event" |
| **Severity** | Select | Info / Warning / Critical | All | "Info" |
| **Status** | Select | Logged / Reviewed | All | "Logged" |
| **Timestamp** | Date | When event occurred | Auto | "2026-03-26 14:32" |
| **Staging Link** | Link | Which Staging row caused this event | Scripts | (link to Staging row) |

---

## 6. Troubleshooting Flowchart

```
START: "System isn't working or data looks wrong"
   ↓
Q1: Which table has the problem?
   ├─ STAGING → Go to Flowchart A (Intake issues)
   ├─ ProductMaster / SupplierProductData → Go to Flowchart B (Master data issues)
   ├─ UPCAdmin → Go to Flowchart C (Review gate issues)
   └─ SystemLogs → Go to Flowchart D (Logging issues)

═══════════════════════════════════════════════════════════════
FLOWCHART A: STAGING TABLE ISSUES
═══════════════════════════════════════════════════════════════

Q: What's the problem?
   ├─ "Row stuck in 'pending_review'"
   │  ├─ Check: Is UPCAdmin record created for this SKU?
   │  │  ├─ YES → Script 0B did its job. Nina hasn't reviewed. WAIT or ASK NINA.
   │  │  └─ NO → Script 0B failed to create record. RUN SCRIPT 0B MANUALLY.
   │  └─ Check: Is [Approved] ticked in UPCAdmin?
   │     ├─ YES → Run Script 0C manually. Check logs.
   │     └─ NO → Nina must approve first.
   │
   ├─ "Row status shows 'pending' but it's been hours"
   │  ├─ Check: Has Script 1 run today?
   │  │  ├─ YES → Check SystemLogs for errors in Script 1. RUN MANUALLY with fewer rows.
   │  │  └─ NO → Manually trigger Script 1. Monitor logs.
   │  └─ Check: Is [ETL_Status] actually 'pending' (not 'completed')?
   │     ├─ YES → Status is correct. Script may have failed silently. Check SystemLogs.
   │     └─ NO → Status already 'completed'. Look in ProductMaster for completed product.
   │
   └─ "Row shows 'completed' but product never appeared in ProductMaster"
      ├─ Check: Was Import Type 'ST' (stock) or 'PR' (pricing)?
      │  ├─ ST → Should be in SupplierProductData. Is it there?
      │  │  ├─ YES ✅ → Script 1 worked. Product exists.
      │  │  └─ NO ❌ → Script 1 failed. Check logs, re-run.
      │  └─ PR → Should be in ProductMaster. Is it there?
      │     ├─ YES ✅ → Script 2B worked. Product exists.
      │     └─ NO ❌ → Script 2B failed. Check logs, re-run.
      └─ Contact dev team if scripts failed with no recoverable error.

═══════════════════════════════════════════════════════════════
FLOWCHART B: PRODUCTMASTER / SUPPLIER DATA ISSUES
═══════════════════════════════════════════════════════════════

Q: What's the problem?
   ├─ "Product has NO SKU_Master code (blank)"
   │  ├─ Check: Is Status = "PM NEW"?
   │  │  ├─ YES → Script 3 hasn't generated code yet. WAIT or trigger Script 3 manually.
   │  │  └─ NO → Code should exist. Check UPCAdmin for rejected proposals.
   │  └─ Check: Are required fields filled (Body Type, Size, Color)?
   │     ├─ NO → Product is "enrichment blocked". Nina must fill missing fields first.
   │     └─ YES → Should have code. Contact dev team.
   │
   ├─ "Two versions of same product (Duplicate)"
   │  ├─ Check: Status field on both records
   │  │  └─ One says ACTIVE, one says DISCONTINUED?
   │  │     ├─ YES → Correct state. Use ACTIVE code. Old one is archived.
   │  │     └─ NO → Unclear. Ask Nina which to keep. Archive the other via Script 2A.
   │  └─ Check: Timestamps — which was created first?
   │     ├─ Newer → Usually correct version
   │     └─ Older → Check if transition (is this the "old Z code"?)
   │
   └─ "Stock levels don't match what warehouse says"
      ├─ Check: Date on [Stock_Update] field
      │  ├─ TODAY → Data is current. Warehouse may be behind on usage reporting.
      │  └─ PAST → Data is stale. Supplier may not have sent recent stock file.
      └─ Check: Is [Available] field showing raw number or formula?
         ├─ Raw number → Script 1 wrote it; that's what supplier said
         └─ Formula → Stock_Status calculated by Airtable; check calculation

═══════════════════════════════════════════════════════════════
FLOWCHART C: UPCADMIN (REVIEW QUEUE) ISSUES
═══════════════════════════════════════════════════════════════

Q: What's the problem?
   ├─ "Nina doesn't see anomalies that should be there"
   │  ├─ Check: Filter set correctly?
   │  │  ├─ Viewing [Error Type] = All? Try filtering to "PLU_Ready" or "Price_Spike"
   │  │  └─ Viewing [Resolution] = "Unresolved"? These are open items.
   │  └─ Check: Did Script 0B/3 actually run?
   │     └─ Look in SystemLogs: filter by script name, check for errors
   │
   ├─ "Approved checkbox was ticked but Script 0C didn't release it"
   │  ├─ Check: [Resolution Status] field
   │  │  ├─ "Resolved" → 0C already released it. Check Script 0C logs.
   │  │  └─ "Unresolved" → Nina ticked [Approved] but didn't set Resolution. Tell Nina to SET RESOLUTION first.
   │  └─ Check: Did Script 0C run?
   │     └─ Look in SystemLogs: should see "Release Runner" entry
   │
   └─ "Same PLU proposed twice"
      ├─ Check: [Resolution Status] on older proposal
      │  ├─ "Rejected" → Correct. Old one marked wrong, new one should be right.
      │  └─ "Unresolved" → Duplicate. Check notes to see which is correct. Reject the wrong one.
      └─ Contact dev team: This shouldn't happen; suggests Script 3 bug.

═══════════════════════════════════════════════════════════════
FLOWCHART D: SYSTEMLOGS (AUDIT TRAIL) ISSUES
═══════════════════════════════════════════════════════════════

Q: What's the problem?
   ├─ "I don't see any SystemLogs entries today"
   │  ├─ Scripts haven't run; check automation triggers are enabled
   │  ├─ Check: Is Staging table empty? (no pending records → scripts skip silently)
   │  └─ Check: Did scripts error out? (would show in SystemLogs as "Error" severity)
   │
   ├─ "SystemLogs shows 'Error' but I can't understand the message"
   │  ├─ Copy the [Notes] field text
   │  ├─ Search for that message in the Audit Report (Section 2, "HIGH ISSUES")
   │  └─ If not found → Contact dev team with exact error message
   │
   └─ "I want to audit what changed in a product over time"
      └─ Filter SystemLogs:
          ├─ [Staging Link] = that product's Staging record ID, OR
          ├─ [Notes] contains product SKU
          └─ Sort by Timestamp DESC (newest first)
          → Shows full history of what scripts did to this product
```

---

## 7. Best Practices & UI/UX Tips

### For Annotating Data (Nina's Review)

**Good Practice**: Add notes when approving or rejecting

```
✅ GOOD: [Approved] ticked + [Approved_By] auto-filled + note added:
   "Price increase 8% — seasonal demand for spring tiles. Approved."

❌ BAD: [Approved] ticked with no notes
   → 6 months later: Why was this approved? Unclear.
```

**Template Responses for Nina**:
- **Approve (Price Spike)**: "✅ Confirmed with supplier — new material cost. OK to proceed."
- **Reject (Missing Data)**: "❌ Missing size dimensions. Contact supplier for specs before proceeding."
- **Approve (PLU Code)**: "✅ Code structure correct; matches product. Release."
- **Reject (PLU Code)**: "❌ Color code should be 02, not 03 (check inventory system). Propose again."

### For Monitoring the Pipeline (Ops Team)

**Dashboard Setup** (Airtable views):

1. **"Pipeline Status" (Summary View)**
   - Shows counts: staging_pending | pending_review | completed | errors
   - Updated every 5 minutes
   - Alerts if any stage stalls > 2 hours

2. **"Today's Transactions" (Detail View)**
   - Filter: SystemLogs where Date = TODAY
   - Columns: Time | Event_Type | Severity | Notes | Script_Name
   - Scroll through to see what happened today

3. **"Nina's Inbox" (UPCAdmin Review View)**
   - Filter: Resolution = Unresolved | Sort by Severity DESC
   - Shows HIGH severity first
   - Count = "X items waiting for Nina"

### For Exporting Data (Analysts)

**To Calculate Metrics**:
```
METRIC: "How many products fail validation?"

QUERY (Airtable or SQL):
  SELECT COUNT(*) 
  FROM SystemLogs 
  WHERE Event_Type = 'Validation_Gate_Hold' 
    AND Date BETWEEN '2026-03-01' AND '2026-03-31'
    
RESULT: 23 products held / 500 total = 4.6% failure rate ✅ (below 10% target)
```

**Data Export Checklist**:
- [ ] Filter view to date range needed
- [ ] Include: SKU, Description, Status, Timestamp
- [ ] Export as CSV (download link in Airtable UI)
- [ ] Open in Excel for pivot tables
- [ ] Check for duplicates or corrupted rows before reporting

---

## Appendix: Contacts & Escalation

| Issue | Who to Contact | How |
|-------|---------------|-----|
| **Script failed / Error in SystemLogs** | Dev Team | Slack #upc-pilot; forward error message |
| **Product stuck in review** | Nina | Slack @nina_h; share UPCAdmin link |
| **Stock levels wrong** | Supplier Ops | Email to decobella@...; ask for corrected file |
| **Pricing mismatch** | Finance | Slack #finance; share PricingBridge report |
| **Field ID changed / schema error** | Dev Team **URGENT** | Scripts will fail; needs immediate fix |
| **Dashboard not updating** | Airtable Admin | Check automation triggers enabled |

---

## Summary Checklist for Go-Live

- [ ] All ops team trained on daily checklist (Section 3.2)
- [ ] Nina trained on approval workflow (Sections 3.2, 4)
- [ ] Business stakeholders understand 4-zone architecture (Section 2)
- [ ] Data analysts have field reference guide (Section 5)
- [ ] Dashboard "Pipeline Status" view created & bookmarked
- [ ] Troubleshooting flowchart printed & posted at Nina's desk (Section 6)
- [ ] Contacts & escalation list distributed (Appendix)
- [ ] Test run completed: Supplier file → Full pipeline → Live product codes ✅

---

**Questions?** See Section 6 (Troubleshooting) or contact Dev Team.

**Version History**:
- v1.0 (2026-03-26): Initial release; 8 scripts, 4-zone architecture, 3 personas

---

**Prepared by**: GitHub Copilot  
**For**: Utile Solutions PIM Team  
**Status**: ✅ Ready for Distribution
