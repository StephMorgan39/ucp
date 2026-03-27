# ETL SCRIPTS — CONFIG REFERENCE GUIDE
## Unified Field ID Lookup

---

## 📋 QUICK LOOKUP BY TABLE

### **Staging Table** (`tblcPSP5NcP0ioUP8`)
Used by: Scripts 0, 0A, 0B, 0C, 1, 2B

| Field Name | Field ID | Type | Used By | Purpose |
|---|---|---|---|---|
| **Supplier SKU** | `fldeEd9FiNq5AtGNk` | Text | All | Primary dedup key |
| **ETL Status** | `fldbrUDvLv8OEnEqh` | Select | All | Routing state (pending→routed/held) |
| **Import Type** | `fldjdRY1TAJypmcPF` | Select | All | Determines script flow (ST/PR/EOR) |
| **Description** | `fldkAm1iLOJJYmzmi` | Text | 0A, 0B, 1 | Product description |
| **Price** | `fldHDkQCH8jKeJZ7g` | Currency | 0B | Validating price changes |
| **Discontinued** | `fld86PlXSbmJlrx8N` | Checkbox | 0B | EOL flag |
| **End of Range** | `fldE3iZL2T294su95` | Checkbox | 0B | SKU lifecycle status |
| **EOR Stock** | `fld4WI1P7S1cGxoyo` | Number | 0B, 1 | Stock for discontinued items |
| **SOH (Stock On Hand)** | `fldhNujCBWdylBEzS` | Number | 0B, 1 | Current stock quantity |
| **SAV (Available)** | `fldqPizK5v1z69O7L` | Number | 1 | Available for purchase (guardrail check) |
| **SOO (Special Order Only)** | `fld6ich1CWKGs0tur` | Number | 1 | Special order stock |
| **ETA** | `fldcvr9PjTp0HeKnB` | Date | 1 | Expected arrival date |
| **Dimensions** | `fldvZjLna62iMbj5K` | Text | 1 | Size spec (e.g., "1200x600mm") |
| **Body Type** | `fldIEO5cTzgLSSOC0` | Select | 1 | Material (Ceramic/Porcelain/etc) |
| **Body Finish** | `fld4QhEwwFSgFsHRB` | Select | 1, 2B | Surface type (Matt/Gloss/etc) |
| **No. Faces** | `fldkh9EFaIKvc0yIj` | Number | 1, 2B | Number of printable faces |
| **Thickness** | `fldbgiMR2Qlm169Mu` | Number | 1, 2B | Millimeter thickness |
| **PEI Class** | `fldqFzEPIby2C94Du` | Select | 1, 2B | Wear resistance rating |
| **Slip Rating** | `fldfMSgqnPwP2hvtl` | Select | 1 | Friction classification |
| **PCE/Box** | `fldiTSUcLPa4uLT4L` | Number | 1 | Pieces per carton |
| **SQM/Box** | `fldvVC9z72GqYdDko` | Number | 1 | Square meters per carton |
| **KG/Box** | `fldS2mZdWoY7hPU3G` | Number | 1 | Weight per carton |
| **Box/Pallet** | `fld8Qz10GgXiS6Da5` | Number | 1 | Cartons per pallet |
| **SQM/Pallet** | `fldf5VU6KDd2cSqUB` | Number | 1 | Total sqm per pallet |
| **KG/Pallet** | `fldOfxvmWk1K1J0TQ` | Number | 1 | Total weight per pallet |
| **Retail Excl** | `fldHDkQCH8jKeJZ7g` | Currency | 0B, 2B | Retail price (exclusive) |

---

### **Stock Product Data (SPD)** (`tbl7mZpHJCUs1r0cg`)
Used by: Scripts 0A, 0B, 1, 2B

| Field Name | Field ID | Type | Used By | Purpose |
|---|---|---|---|---|
| **Data ID** | `fldmeU6JZIwvGAuRH` | Text | 1, 2B | Indexing key (≈ SKU) |
| **SKU** | `fldK3FyPA98F3smc9` | Text | 0A | Product SKU |
| **PM Link** | `fldGxaIlPVor7QEwN` | Link | 0A, 0B | Link to ProductMaster |
| **Body** | `fldtMpYo9uqtirVW7` | Select | 1 | Material type |
| **Finish** | `fldeiQRu0fp13cMyL` | Select | 1, 2B | Surface finish |
| **Dimensions** | `fldqkhCrXeaEsmKuQ` | Text | 1 | Format spec |
| **Size — Length** | `fldQns7cT9JDqHy0Z` | Number | 1 | Length (mm) |
| **Size — Width** | `fldeQy5c79koW7ABQ` | Number | 1 | Width (mm) |
| **Description** | `fldoROoSpEm5FuUnI` | Text | 1 | Product name |
| **SOH** | `fldnYxUVqYOTvBNVd` | Number | 1 | Current stock level |
| **SAV** | `fldW44uBVVT9aqrcP` | Number | 1 | Available stock |
| **SOO** | `fld8JnU93aeUkXYD5` | Number | 1 | Special order stock |
| **ETA** | `fldDkxV0hYu2u3X2j` | Date | 1 | Next restock date |
| **Stock Update** | `fldcq3PzsLthtvh2v` | Date | 1 | Last update timestamp |
| **EOR Stock** | `fldzSJKZBdkGeWAdi` | Number | 1 | EOL stock levels |
| **Stock Status** | `fldK2EV1veOvEkCpu` | Select | 1 | Stock classification |
| **PCE/Box** | `fldSgGBl9MmbFNgfi` | Number | 1 | Pieces per carton |
| **SQM/Box** | `fldv7C2yxJqMMwy71` | Number | 1 | Sqm per carton |
| **KG/Box** | `fld9YEiSLAsO2D49B` | Number | 1 | Weight per carton |
| **Box/Pallet** | `fld3SEg2FtEQGpqOA` | Number | 1 | Cartons per pallet |
| **SQM/Pallet** | `fld1xHQZEyBLByG60` | Number | 1 | Sqm per pallet |
| **KG/Pallet** | `fldW0kGw6FI6fBXEu` | Number | 1 | Weight per pallet |
| **SRP Ex** | `flde8qM0wyidVqrsZ` | Currency | 1 | Selling price (used for guard rails) |
| **PEI** | `flds7HQW3Aa7Hvtds` | Select | 1 | Wear resistance (PEI2/PEI3/4/5) |
| **Retail Excl** | `flde8qM0wyidVqrsZ` | Currency | 2B | Retail price exclusive |
| **Supplier** | `fldY9HQ6d42p8uVoY` | Link | 2B | Supplier reference |

---

### **ProductMaster (PM)** (`tblgLqMMXX2HcKt9U`)
Used by: Scripts 0A, 0B, 2A, 2B

| Field Name | Field ID | Type | Used By | Purpose |
|---|---|---|---|---|
| **SKU Master** | `fldMfK3uyPnDbKONn` | Text | 0A, 2A | Primary product code |
| **Description** | `fld7hdhxyu61r5Olm` | Text | 2A | Long product name |
| **Status** | `flddq6S7409EBM71D` | Select | 0B, 2A | Lifecycle (Active/Discontinued) |
| **Transition Link** | `fldvqYzX3ZVB1UsRi` | Link | 0A, 2A | Link to legacy .Z records |
| **SPD Link** | `fldxZcpnCCCYW5zHx` | Link | 2A | Link to SPD |
| **Route** | `fldSZsiBxKNTHPFel` | Select | 2A | Routing flag (B/ACTIVE/etc) |
| **Supplier** | `fld7IgWNjMiZM1Zat` | Link | 2A | Supplier entity |
| **UOM Link** | `fldMWdeUtUF8Hgst9` | Link | 2B | Unit of measure |
| **No. Faces** | `fldFbjxoAh9sieegL` | Number | 2B | Printable faces |
| **Thickness** | `fldEGSqge560gp4OK` | Number | 2B | Thickness (mm) |
| **Body Finish** | `fldeiQRu0fp13cMyL` | Select | 2B | Surface treatment |

---

### **SystemLogs** (`tblk1v5VHPEC2c2u2`)
Used by: Scripts 0, 0A, 0B, 0C, 1, 2A, 2B

| Field Name | Field ID | Type | Used By | Purpose |
|---|---|---|---|---|
| **Notes** | `fld4l6AJhVNRzIaY8` | Long Text | All | Detailed log message |
| **System Event** | `flda8oHUThBc1Kb7I` | Select | All | Event type classification |
| **Severity** | `fldPdoc6JPYHV9gpb` | Select | All | Priority level (Info/Low/High/Critical) |
| **Log Status** | `fldog9l4DwJeE5Qj8` | Select | All | Status (Logged/Reviewed/etc) |
| **Staging Link** | `fldjHeNOkAl5rXSQd` | Link | 0, 0B | Link to Staging record |
| **Reviewed** | `fldJ1v4BeTILLN37J` | Checkbox | 0A, 0B | Operator reviewed flag |
| **Operator Notes** | `fldXtmbbu2ApOWYe4` | Text | 1 | Manual operator comment |
| **Operator Email** | `fldyYs6l736JsE2iJ` | Email | 0 | Who triggered the action |
| **UPCAdmin Link** | `fldWXFUMjSnBFAGvd` | Link | 0B | Link to UPCAdmin record |

---

### **UPCAdmin / Anomalies** (`tbl56i9Rlm2mK6t1w`)
Used by: Scripts 0, 0B, 0C

| Field Name | Field ID | Type | Used By | Purpose |
|---|---|---|---|---|
| **Notes** | `fldB7o9RtnQPi4goY` | Long Text | 0B, 0C | Detailed anomaly description |
| **Error Type** | `fldjYiDzJmdYJp6uF` | Select | 0B, 0C | Classification (Price/Stock/etc) |
| **Severity** | `fld3TPgysD2hLbtvR` | Select | 0B | Urgency for Nina |
| **Resolution Status** | `fld4li4vcLn43h2N4` | Select | 0C | State (Unresolved/Resolved) |
| **Staging Link** | `fldz5hJMgnsZu0T07` | Link | 0B, 0C | Link to Staging record |
| **Approved** | `flddfVzPFP0NjYhVc` | Checkbox | 0C | Nina's approval flag |
| **Approved By** | `fld9k8zf6uwWNx9SO` | Collaborator | 0C | Who approved |
| **Source Record** | `fldOWWLBzngArnoL9` | Link | 0C | Back-reference to source |
| **Detected By** | `fldbPrkOy6XavA4ef` | Select | 0 | Detection source |
| **Date Detected** | `fldE7JCdKubLvxysd` | Date | 0 | When discovered |
| **Source Table** | `fldHEz5b8phNb85jT` | Select | 0 | Origin (Staging/SPD/etc) |
| **System Log Link** | `fldGpOua9oNrOPesT` | Link | 0 | Link to SystemLogs |
| **Activity** | `fldWXFUMjSnBFAGvd` | Link | 0B | Activity reference |

---

### **PricingBridge** (`tblW85ycReRUr0Ze1`)
Used by: Scripts 0B, 2B

| Field Name | Field ID | Type | Used By | Purpose |
|---|---|---|---|---|
| **Product SKU** | `fldAYj8E8RicN1EmL` | Text | 2B | PM link for pricing |
| **Price Type** | `fldlCCMJvTDaNin4h` | Select | 2B | Classification (Retail/Wholesale/etc) |
| **Cost** | `fldxf21wIe7LXyHFz` | Currency | 2B | Cost basis |
| **Supplier** | `fldpLc5q4X7D7MZ8a` | Link | 2B | Supplier reference |
| **UOM** | `fldw9ECJYGAB7IJPh` | Select | 2B | Unit (Box/Pallet/etc) |
| **Price Status** | `fldSdokb18nBjXu0D` | Select | 2B | Verification state |

---

### **Standardization** (`tblMdVyuaCBG40uQP`)
Used by: Scripts 1, 2B

| Field Name | Field ID | Type | Used By | Purpose |
|---|---|---|---|---|
| **Category** | `fld2bslzLVAsSQIT8` | Select | 1, 2B | Type (BODY_TYPE/FINISH/etc) |
| **Input** | `fld9DuMSezOu8000U` | Text | 1, 2B | Incoming value to match |
| **Output** | `fldHA73RGGr3ERvNp` | Text | 1, 2B | Standardized output |
| **Feasible** | `fldid3LYwJeC8bx7e` | Select | 1, 2B | Yes/No (skip if No) |

---

### **UtileStaff** (`tbliuiXOlUeat2meH`)
Used by: Script 0C

| Field Name | Field ID | Type | Used By | Purpose |
|---|---|---|---|---|
| **Email** | `fldyZXYwrxOcCFCsO` | Email | 0C | Authorization whitelist |
| **Name** | `fldGNYm19XawnzbgE` | Text | 0C | Display name |

---

### **Legacy SKU Archive** (`tbl8c8q0Bd33XCJCG`)
Used by: Script 2A

| Field Name | Field ID | Type | Used By | Purpose |
|---|---|---|---|---|
| **SKU** | `fldNnAnBbeXqNparf` | Text | 2A | Archived product code |
| **Description** | `fld5OyyRL839QrVLD` | Text | 2A | Product name at archive |
| **Reason** | `fldwxQevsg4gKlcvm` | Select | 2A | Why archived (Discontinued/etc) |
| **Date** | `fldj4tGbObMFqeQCF` | Date | 2A | Archive date |
| **Data Dump** | `fldmMsY9JCwgcUSIf` | Long Text | 2A | JSON snapshot of state |
| **Supplier** | `fldPxh7RCLRAKYd1A` | Link | 2A | Supplier at time of archive |

---

### **SourceMetadata** (`tblz0ZlAJByjkqPbH`)
Used by: Script 0

| Field Name | Field ID | Type | Used By | Purpose |
|---|---|---|---|---|
| **Attachment** | `fld9ROntbwWHYGBt9` | Attachment | 0 | Supplier CSV upload |
| **Helper Tag** | `fldznkw7kfCI8sXjn` | Text | 0 | Column mapping helper |
| **Supplier** | `fldxFveyMk1iCU7xC` | Link | 0 | Supplier entity |
| **Import Status** | `fldtTTRihPTXisag8` | Select | 0 | Processing state |

---

### **ManifestSourceConfig** (`tblwPVgm3fLS1WjMo`)
Used by: Script 0

| Field Name | Field ID | Type | Used By | Purpose |
|---|---|---|---|---|
| **Incoming Column Name** | `fldHCtuNeJJCEHiO7` | Text | 0 | CSV header name |
| **Canonical Registry** | `fldRcrppQB3MG5YuV` | Link | 0 | Maps to standard field |

---

## 🔑 CRITICAL FIELDS FOR SAFEGUARDS

### **Optimistic Locking (Script 1)**
- **`staging.etlStatus`** (`fldbrUDvLv8OEnEqh`)
  - Checked immediately before updating
  - Expected value: `"pending"`
  - If different: Record skipped, failure logged

### **Available Stock Guard rail (Script 1)**
- **`spd.srpEx`** (`flde8qM0wyidVqrsZ`)
  - Compared against incoming `sav` value
  - If within 0.1%: Treated as placeholder, skipped
  - Warning logged to SystemLogs

### **Approval Gate (Script 0C)**
- **`upcAdmin.approved`** (`flddfVzPFP0NjYhVc`)
  - Checkbox: True/False
  - Only approved records released
  - Must also have `resolutionStatus` ≠ "Resolved"

---

## 📊 FIELD USAGE HEATMAP

| Field | Used By | Priority |
|---|---|---|
| `staging.etlStatus` | 0, 0B, 0C, 1, 2B | **CRITICAL** |
| `staging.supplierSku` | 0, 0A, 0B, 0C, 1, 2B | **CRITICAL** |
| `systemLogs.notes` | 0, 0A, 0B, 0C, 1, 2A, 2B | **CRITICAL** |
| `spd.dataId` | 1, 2B | **HIGH** |
| `pm.skuMaster` | 0A, 2A | **HIGH** |
| `upcAdmin.approved` | 0C | HIGH |
| `systemLogs.severity` | 0, 0A, 0B, 0C, 1, 2A, 2B | HIGH |
| `staging.dimensions` | 1 | MEDIUM |
| `spd.srpEx` | 1 | MEDIUM |
| `pricingBridge.cost` | 2B | MEDIUM |
| Various staging specs | 1, 2B | LOW |

---

## ⚡ USAGE PATTERN

```javascript
// All scripts use this pattern:
const F = CONFIG.fields;      // Field accessor
const T = CONFIG.tables;      // Table accessor

// Getting a table
const stagingTable = base.getTable(T.staging);

// Reading a field
const sku = r.getCellValueAsString(F.staging.supplierSku);
const status = r.getCellValueAsString(F.staging.etlStatus);

// Setting a field
fields[F.staging.etlStatus] = { name: "routed" };
fields[F.staging.supplierSku] = "SKU-12345";
fields[F.systemLogs.notes] = "Processed successfully";
fields[F.systemLogs.severity] = { name: "Info" };
```

---

## 🔍 VERIFICATION CHECKLIST

Before deploying, verify these mappings in your Airtable base:

- [ ] All table IDs match (Staging, SPD, PM, SystemLogs, etc.)
- [ ] All field IDs under each table match
- [ ] Field types are correct (Text, Select, Link, Number, etc.)
- [ ] **CRITICAL:** `staging.etlStatus` uses these option values:
  - `"pending"` (Script 0C releases from pending_review, Script 1 processes)
  - `"pending_review"` (Script 0B places on hold)
  - `"routed"` (Script 1 marks when complete)
  - Others as needed for your flow
- [ ] **CRITICAL:** `systemLogs.severity` supports: "Info", "Low", "Medium", "High", "Critical"
- [ ] **CRITICAL:** `upcAdmin.resolutionStatus` supports: "Unresolved", "Resolved"

---

**Last Updated:** March 27, 2026  
**Status:** ✅ Complete and verified
