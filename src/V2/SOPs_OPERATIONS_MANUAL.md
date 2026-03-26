# Utile PIM Operations — Standard Operating Procedures (SOPs)

**Version**: 2.0 (Post-Audit Fixes)  
**Last Updated**: March 26, 2026  
**Owner**: Nina (Approvals + Final Review Gate)  
**Target Audience**: Utile Operations Team (non-technical background OK)

---

## Table of Contents

1. [Overview & Key Principles](#overview--key-principles)
2. [SOP 1: Uploading Supplier Data](#sop-1-uploading-supplier-data)
3. [SOP 2: Reviewing Anomalies (Nina's Gate)](#sop-2-reviewing-anomalies-ninas-gate)
4. [SOP 3: Daily Operational Checks](#sop-3-daily-operational-checks)
5. [SOP 4: Troubleshooting Common Issues](#sop-4-troubleshooting-common-issues)
6. [SOP 5: Emergency Procedures](#sop-5-emergency-procedures)
7. [Appendix: Script Execution Reference](#appendix-script-execution-reference)

---

## Overview & Key Principles

### What Is This System?

Your product information flows through **6 stages** from supplier → your system → live website/specs. Each stage has quality gates to prevent bad data from reaching customers.

```
Supplier List → Staging → Detection → Validation Gate ← YOU REVIEW HERE
                                            ↓
System Approval → Master Data → Live System → Website & Specs
```

### The Golden Rules

⭐ **Rule 1**: Always review anomalies before approving. The system flags them for a reason.

⭐ **Rule 2**: Never manually edit the Staging table. The scripts depend on stage data being "clean"at arrival.

⭐ **Rule 3**: If you're unsure, ask. It's better to slow down for accuracy than rush and corrupt data.

⭐ **Rule 4**: Keep track of what you approve. The SystemLogs table is your audit trail.

---

## SOP 1: Uploading Supplier Data

### When to Do This
- Weekly supplier updates (new products, price changes, stock updates)
- Monthly full inventory reconciliation
- Ad-hoc: urgent stock corrections from suppliers

### Step-by-Step

#### Step 1: Prepare the Supplier File

**What You Need**:
- Supplier's Excel/CSV file with their latest product list
- File should include: SKU, Description, Price, Stock, Dimensions, etc.

**What to Check**:
```
Q: Old format or new format?
A: Ask the supplier for their "standard export"

Q: File already processed?
A: Check the SourceMetadata table — if today's supplier file 
   is already there, you don't need to upload again.
```

#### Step 2: Format Check

Before uploading, ensure the file has these columns (minimum):
- Supplier SKU (unique product code from supplier)
- Product description / name
- Stock on hand (quantity available)
- Available / For Sale (what you can actually sell)
- Price (your cost or their selling price)

**Optional but recommended**:
- Dimensions (L x W)
- Weight
- Finish / Material
- Color

#### Step 3: Upload to Airtable

1. Go to **SourceMetadata** table in Airtab

2. Click **[+]** to add a new record

3. Fill in:
   - Supplier name (e.g., "Ceramica")
   - Upload Date (today's date)
   - File (attach the Excel/CSV file using the attachment field)
   - Import Status (leave blank — system fills this)

4. Click **Save**

#### Step 4: Run Script 0 (Manifest Ingestion)

This script reads your uploaded file and creates temporary "Staging" records.

**How to Run**:
1. Open Extensions → Airtable Scripts (or similar in your version)
2. Find "Script 0 - Manifest Ingestion"
3. Click **[Run]**
4. Wait for completion message

**What to Expect**:
- Green checkmark: ✅ All products staged successfully
- Yellow warning: ⚠️ Some rows skipped (check the log for why)
- Red error: ❌ Something went wrong (skip to SOP 5: Emergency)

---

## SOP 2: Reviewing Anomalies (Nina's Gate)

### Overview

After data processes, the system flags unusual things and holds them for your review. This is YOUR quality gate — don't skip it.

### Anomalies You'll See

| Type | What It Means | Action |
|------|---------------|--------|
| **Duplicate Product** | Same SKU from supplier appears twice | Pick the newer one, archive the old |
| **Missing Data** | No price, dimensions, or stock info | Research supplier catalog; add data if possible |
| **Impossible Value** | Price $50,000 or stock 999,999 units | Contact supplier to verify; likely a typo |
| **Data Mismatch** | Product description doesn't match photo | Verify which is correct; update |
| **Suspicious Placeholder** | Stock = $99.99 (same as price) | Decobella quirk — they use price as placeholder when no stock data. Mark "reviewed" and move on. |

### Step-by-Step Review Process

#### Step 1: Open the Anomalies Queue

1. Open the **UPCAdmin** table (this is your review queue)
2. Filter: `Approved = FALSE` AND `Resolution ≠ Resolved`
3. You should see pending anomalies waiting for your decision

#### Step 2: Review Each Anomaly

For each item:

1. **Read the System Note** (in the NOTES field)

   Explains what was detected and why it need your attention.

2. **Decide**: Is this OK or does it need fixing?

   ```
   ✅ APPROVE: Checkbox the "Approved" field
       (System will auto-release it into Master Data)
   
   ❌ REJECT: Leave unchecked; add notes to "Operator_Notes" field
       (You'll resolve it later or send back to supplier)
   ```

3. **Add Your Comments** (if needed)

   - Why you approved it
   - Or what needs to be fixed before it can be approved

#### Step 3: Batch Approval

Once you've reviewed all anomalies for this upload:

1. Go to **UPCAdmin** table
2. Filter: `Approved = TRUE` AND `Resolution ≠ Resolved`
3. Count how many you approved
4. Run **Script 0C — Release Runner**
   - This automatically releases your approved items back into the pipeline

#### Step 4: Verify Release

Check **Staging** table:
- Your approved rows should now show `ETL Status = Completed`
- If they're still `Pending_Review`, check SystemLogs for error messages

---

## SOP 3: Daily Operational Checks

### Morning Check (5 min)

Every morning, run this checklist:

```
☐ Open DASHBOARD (non-technical UI)
☐ Check "Pipeline Status" card — any red/yellow alerts?
☐ Check "Review Queue" — how many anomalies waiting?
☐ Check "Recent Activity" — anything unusual?
```

### If You Find an Issue

| Finding | Action |
|---------|--------|
| Red alert on Dashboard | Jump to SOP 4: Troubleshooting |
| Review queue > 50 items | Prioritize; spend 30 min reviewing |
| Activity log shows errors | Check SystemLogs table for details |

### Weekly Full Check (30 min)

Every Friday afternoon:

```
☐ SystemLogs table: filter by "HIGH" or "CRITICAL" severity
☐ Review: any reoccurring patterns/problems?
☐ SupplierProductData table: spot-check 10 random products
☐ Pricing Bridge table: verify 5 recent price updates
☐ ProductMaster table: check for orphaned or incomplete records
☐ Document: add notes to OPERATIONAL_LOG.md
```

---

## SOP 4: Troubleshooting Common Issues

### Issue 1: "Script 0C Failed — Cannot Process Anomalies"

**Symptoms**:
- You approved anomalies but Script 0C errors out
- Dashboard shows red alert

**Diagnosis & Fix**:

```
Step 1: Check permissions
   → UtileStaff table: is your email listed?
   → If not, add yourself + your email
   
Step 2: Check UtileStaff table setup
   → Does it have email field?
   → Are emails valid (must contain @)?
   
Step 3: Run Script 0C again
   → Should work now
   
If still fails → SOP 5: Emergency (contact admin)
```

### Issue 2: "Products Stuck in Pending_Review"

**Symptoms**:
- Anomalies approved but not flowing to Master Data
- Staging table shows ETL_Status = `pending_review`

**Diagnosis & Fix**:

```
Check 1: Did you actually run Script 0C?
   → Open Extensions → Scripts → find "Script 0C"
   → Did you see "✅ Release complete" message?
   → If not, run it now
   
Check 2: Are there concurrent scripts running?
   → Go to SystemLogs table
   → Filter by time: last 30 minutes
   → Do you see "Optimistic lock conflict" error?
   → If yes: wait 5 min, try again (other script was running)

Check 3: Verify you have the right records approved
   → UPCAdmin table: filter `Approved = TRUE` and `Resolution ≠ Resolved`
   → Count should match your intention
   → If count = 0: you forgot to check "Approved" box
```

### Issue 3: "Duplicate Products Being Created"

**Symptoms**:
- Same supplier SKU appearing in Master Data twice
- Product gets a second unique code

**Diagnosis & Fix**:

```
Root Cause: Script 0A (Rename Detection) running twice 
on same upload

Solution:
   1. Don't run scripts manually out of order
   2. Always run: 0 → 0A → 0B → 0C → 1+2B
   3. Wait for each to complete (green checkmark)
   4. Then start next one
   
Prevention:
   → Scripts now have sequence checks
   → If you accidentally run out of order, 
      system will warn you
```

### Issue 4: "Missing Products From Supplier"

**Symptoms**:
- Uploaded supplier file with 200 products
- Only 150 show up in Master Data
- Where did the other 50 go?

**Diagnosis & Fix**:

```
Check 1: Did they get flagged as anomalies?
   → SystemLogs table: filter by supplier name
   → Look for "Skipped" entries
   → Reason will be shown (e.g., "Invalid SKU", "Duplicate")
   
Check 2: Check Staging table
   → Filter by Supplier: [your supplier]
   → Status should be "Completed" (not Pending/Failed)
   → Any "Failed" rows? Click them for error details
   
Check 3: Verify script completed successfully
   → Dashboard > Activity Log
   → Look for "Script 1" or "Script 2B" completions
   → Did they finish, or still running?
```

---

## SOP 5: Emergency Procedures

### When to Escalate

Use this if:
- ❌ Script shows RED error (not yellow warning)
- ❌ Products not appearing after 2+ hours
- ❌ Data in Master showing corruption (same product doubled, pricing wrong)
- ❌ You're unsure how to proceed

### Emergency Contact Procedure

1. **STOP** — don't run more scripts

2. **Document**:
   - What were you doing when error happened?
   - What does the error message say?
   - Take screenshots of:
     - Dashboard alerts
     - SystemLogs table (error entries)
     - Staging table (any "Failed" rows)

3. **Report**:
   - Contact: [System Administrator]
   - Provide: Screenshots + timestamp of incident + what you were doing

4. **Wait for Guidance**:
   - Do NOT retry scripts until told it's safe
   - Do NOT manually edit records hoping it helps
   - (This often makes things worse)

### Rollback Procedure (If Needed)

If a run corrupted data:

```
Scenario: 500 products processed but prices look wrong

Action:
1. Do NOT manually edit products
2. Note the Staging filter that was used (Supplier name, date, etc.)
3. Contact admin with info
4. Admin will:
   - Identify affected Master/Pricing records
   - Restore from backup
   - Re-run scripts carefully
```

---

## Appendix: Script Execution Reference

### Full Pipeline Sequence

Run scripts in this order. **DO NOT skip steps or reorder.**

```
1️⃣  SCRIPT 0 — Manifest Ingestion
    ↓ Wait for: ✅ "All rows staged successfully"
    
2️⃣  SCRIPT 0A — Rename Detection  
    ↓ Wait for: ✅ "Detection complete — X anomalies found"
    
3️⃣  SCRIPT 0B — Validation Gate
    ↓ Wait for: ✅ "Validation pass — X rows held for review"
    
4️⃣  [YOU] Review anomalies in UPCAdmin table
    ↓ Check: "Approved" & "Resolution" statuses
    
5️⃣  SCRIPT 0C — Release Runner
    ↓ Wait for: ✅ "Release complete — X anomalies approved"
    
6️⃣  SCRIPT 1 — Stock ETL Router  (parallel with 2B)
    ↓ Creates/updates SupplierProductData (SPD)
    
7️⃣  SCRIPT 2B — Pricing & Specs Router  (parallel with 1)
    ↓ Updates pricing and specifications
    
8️⃣  SCRIPT 2A — Transition Completion
    ↓ Finalizes stock status (Live vs. EOR vs. Discontinued)
    
9️⃣  [Optional] SCRIPT 3 — PLU Generator
    ↓ Proposes Utile product codes for new items
```

### Recovery After Interruption

If scripts were interrupted (power outage, browser crash):

```
Find: Last successful script in SystemLogs
├─ Filter by "System_Event" type
├─ Look for last ✅ in notes
└─ Note which script + timestamp

Resume: Run scripts starting from NEXT step
├─ E.g., if Script 1 finished last
├─ Run Script 2B next
├─ Skip everything before it
```

### Batch Size Reference

Each script processes in batches to avoid API limits:

| Operation | Batch Size | Why |
|-----------|-----------|-----|
| Create records | 50 | Airtable API limit |
| Update records | 50 | Airtable API limit |
| Logging | 50 | Keeps logs grouped |

**If you see "Batch X of Y"**: This is normal. System breaks large uploads into chunks.

---

## Sign-Off & Acknowledgment

### For Internal Use

**Reviewed By**: Nina (Operations Lead)  
**Approved By**: [System Owner]  
**Last Audit**: March 26, 2026  
**Next Review**: June 26, 2026  

**Team Sign-Off** (print & sign):

```
I have read and understand the Utile PIM SOPs.
I will follow these procedures when uploading/reviewing product data.
I will not manually edit Staging or Master Data tables.
I will escalate to the admin for help instead of troubleshooting alone.

Name: ___________________
Date: ___________________
Signature: ___________________
```

---

## Questions?

**For Technical Questions**:
→ Contact [System Administrator]

**For Operational Help**:
→ Contact Nina

**For Training**:
→ Attend weekly operations sync

---

## Document Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial SOPs drafted |
| 1.5 | Feb 2026 | Added Issue 2 (Pending Review) + Emergency procedures |
| 2.0 | Mar 2026 | Post-audit fixes: Race condition + simplified troubleshooting |

---

**END OF SOPs**
