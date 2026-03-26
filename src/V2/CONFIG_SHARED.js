/**
 * CONFIG_SHARED.js — Centralized Field ID Registry
 * Utile PIM | Master Configuration
 *
 * PURPOSE:
 * - Single source of truth for all Airtable table/field IDs across scripts
 * - Prevents hardcoding field IDs throughout codebase
 * - Makes field ID updates easier (change once, applies everywhere)
 * - Improves consistency and auditability
 *
 * USAGE IN SCRIPTS:
 * Include this file in each script (copy-paste at top), then reference CONFIG properties:
 *   const LOG_NOTES = CONFIG.TABLES.ADMIN_LOGS.fields.NOTES;
 *   output.markdown(`Field ID for admin notes: ${LOG_NOTES}`);
 *
 * MAINTENANCE:
 * When Airtable schema changes:
 * 1. Update the affected field ID in this file
 * 2. No need to modify individual scripts
 * 3. Re-run all scripts — they'll auto-pick up new IDs
 */

const CONFIG = {
  // ─────────────────────────────────────────────────────
  // TABLE IDs (Reference for documentation)
  // ─────────────────────────────────────────────────────
  TABLE_IDS: {
    MANIFEST_SOURCE_CONFIG: "tblXXXXXXXXXXXXXX",  // Source metadata
    STAGING: "tblcPSP5NcP0ioUP8",
    PRODUCT_MASTER: "tblgLqMMXX2HcKt9U",
    SUPPLIER_PRODUCT_DATA: "tbl7mZpHJCUs1r0cg",
    PRICING_BRIDGE: "tblXXXXXXXXXXXXXX",
    UPC_ADMIN: "tbl56i9Rlm2mK6t1w",
    SYSTEM_LOGS: "tblk1v5VHPEC2c2u2",
    UTILE_STAFF: "tbliuiXOlUeat2meH",
    STANDARDIZATION: "tblMdVyuaCBG40uQP",
    UPC_BODY_CLASS: "tblXXXXXXXXXXXXXX",
    UPC_COLOUR_MASTER: "tblXXXXXXXXXXXXXX",
    DAM: "tblXXXXXXXXXXXXXX",
  },

  // ─────────────────────────────────────────────────────
  // STAGING TABLE
  // ─────────────────────────────────────────────────────
  STAGING: {
    TABLE_ID: "tblcPSP5NcP0ioUP8",
    fields: {
      ID: "fldIDfieldXXXXXX",  // Primary ID
      SUPPLIER_SKU: "fldeEd9FiNq5AtGNk",
      IMPORT_TYPE: "fldjdRY1TAJypmcPF",  // ST, PR, EOR, DD, etc.
      ETL_STATUS: "fldbrUDvLv8OEnEqh",  // Pipeline gate (pending, pending_review, completed, failed, etc)
      
      // Product attributes
      BODY_TYPE: "fldIEO5cTzgLSSOC0",
      BODY_FINISH: "fld4QhEwwFSgFsHRB",
      NO_FACES: "fldkh9EFaIKvc0yIj",
      THICKNESS: "fldbgiMR2Qlm169Mu",
      PEI_CLASS: "fldqFzEPIby2C94Du",
      SLIP_RATING: "fldfMSgqnPwP2hvtl",
      DIMENSIONS: "fldvZjLna62iMbj5K",
      DESCRIPTION: "fldkAm1iLOJJYmzmi",
      
      // Stock fields
      SOH: "fldhNujCBWdylBEzS",  // Stock on Hand
      SAV: "fldqPizK5v1z69O7L",  // Available (for sale)
      SOO: "fld6ich1CWKGs0tur",  // Stock on Order
      ETA: "fldcvr9PjTp0HeKnB",  // Estimated Time of Arrival
      EOR_STOCK: "fld4WI1P7S1cGxoyo",  // End of Range stock
      
      // Logistics
      PCE_BOX: "fldiTSUcLPa4uLT4L",      // Pieces per box
      SQM_BOX: "fldvVC9z72GqYdDko",      // Sqm per box
      KG_BOX: "fldS2mZdWoY7hPU3G",       // KG per box
      BOX_PALLET: "fld8Qz10GgXiS6Da5",   // Boxes per pallet
      SQM_PALLET: "fldf5VU6KDd2cSqUB",   // Sqm per pallet
      KG_PALLET: "fldOfxvmWk1K1J0TQ",    // KG per pallet
    },
  },

  // ─────────────────────────────────────────────────────
  // SUPPLIER PRODUCT DATA (SPD) TABLE
  // ─────────────────────────────────────────────────────
  SUPPLIER_PRODUCT_DATA: {
    TABLE_ID: "tbl7mZpHJCUs1r0cg",
    fields: {
      ID: "fldIDfieldXXXXXX",
      DATA_ID: "fldmeU6JZIwvGAuRH",  // Internal unique key
      SKU: "fldK3FyPA98F3smc9",
      PM_LINK: "fldGxaIlPVor7QEwN",  // Link to ProductMaster
      
      BODY: "fldtMpYo9uqtirVW7",     // Standardized body type
      FINISH: "fldeiQRu0fp13cMyL",   // Standardized finish
      DIMENSIONS: "fldqkhCrXeaEsmKuQ",
      SIZE_LENGTH: "fldQns7cT9JDqHy0Z",
      SIZE_WIDTH: "fldeQy5c79koW7ABQ",
      DESCRIPTION: "fldoROoSpEm5FuUnI",
      
      // Stock tracking
      SOH: "fldnYxUVqYOTvBNVd",
      SAV: "fldW44uBVVT9aqrcP",  // Available (guardrailed in Script 1)
      SOO: "fld8JnU93aeUkXYD5",
      ETA: "fldDkxV0hYu2u3X2j",
      STOCK_UPDATE: "fldcq3PzsLthtvh2v",
      STOCK_STATUS: "fldK2EV1veOvEkCpu",  // SPD, SPD EOR, SPD DD, etc.
      EOR_STOCK: "fldzSJKZBdkGeWAdi",
      
      // Pricing (guardrailed)
      SRP_EX: "flde8qM0wyidVqrsZ",  // Selling price excl. VAT
      
      // Specs
      PEI: "flds7HQW3Aa7Hvtds",  // PEI rating
      
      // Logistics
      PCE_BOX: "fldSgGBl9MmbFNgfi",
      SQM_BOX: "fldv7C2yxJqMMwy71",
      KG_BOX: "fld9YEiSLAsO2D49B",
      BOX_PALLET: "fld3SEg2FtEQGpqOA",
      SQM_PALLET: "fld1xHQZEyBLByG60",
      KG_PALLET: "fldW0kGw6FI6fBXEu",
    },
  },

  // ─────────────────────────────────────────────────────
  // PRODUCT MASTER (PM) TABLE
  // ─────────────────────────────────────────────────────
  PRODUCT_MASTER: {
    TABLE_ID: "tblgLqMMXX2HcKt9U",
    fields: {
      ID: "fldIDfieldXXXXXX",
      SKU_MASTER: "fldMfK3uyPnDbKONn",  // Unique Utile product code
      ZAB_STATUS: "fldSZsiBxKNTHPFel",  // Product status
      PRODUCT_STATUS: "flddq6S7409EBM71D",
    },
  },

  // ─────────────────────────────────────────────────────
  // UPC ADMIN (ANOMALIES) TABLE
  // ─────────────────────────────────────────────────────
  UPC_ADMIN: {
    TABLE_ID: "tbl56i9Rlm2mK6t1w",
    fields: {
      ID: "fldIDfieldXXXXXX",
      APPROVED: "flddfVzPFP0NjYhVc",        // Checkbox: Nina's approval
      APPROVED_BY: "fld9k8zf6uwWNx9SO",    // Collaborator: who approved
      RESOLUTION: "fld4li4vcLn43h2N4",     // Status (Resolved, Pending, etc.)
      SOURCE_RECORD: "fldOWWLBzngArnoL9",  // Link to Staging record
      ERROR_TYPE: "fldjYiDzJmdYJp6uF",     // Type of anomaly
      NOTES: "fldB7o9RtnQPi4goY",          // Detailed notes
      ORIGINAL_VALUE: "fld0wlmRbNFgVpbXS",  // Script 3 proposals
    },
  },

  // ─────────────────────────────────────────────────────
  // SYSTEM LOGS TABLE
  // ─────────────────────────────────────────────────────
  SYSTEM_LOGS: {
    TABLE_ID: "tblk1v5VHPEC2c2u2",
    fields: {
      ID: "fldIDfieldXXXXXX",
      NOTES: "fld4l6AJhVNRzIaY8",      // Event description
      EVENT_TYPE: "flda8oHUThBc1Kb7I",  // Script_Name, Anomaly_Type, etc.
      SEVERITY: "fldPdoc6JPYHV9gpb",    // Info, Warning, High, Critical
      STATUS: "fldog9l4DwJeE5Qj8",      // Logged, In_Review, Resolved
      OPERATOR_EMAIL: "fldyYs6l736JsE2iJ",  // Who triggered/handled
      REVIEWED: "fldJ1v4BeTILLN37J",    // Checkbox: marked for review
      ACTIVITY_LINK: "fldWXFUMjSnBFAGvd",  // Link to admin record
      OPERATOR_NOTES: "fldXtmbbu2ApOWYe4", // Nina's manual notes
    },
  },

  // ─────────────────────────────────────────────────────
  // UTILE STAFF TABLE
  // ─────────────────────────────────────────────────────
  UTILE_STAFF: {
    TABLE_ID: "tbliuiXOlUeat2meH",
    fields: {
      ID: "fldIDfieldXXXXXX",
      NAME: "fldGNYm19XawnzbgE",
      EMAIL: "fldyZXYwrxOcCFCsO",
      ROLE: "fldXXXXXXXXXXXXXX",  // Optional: role/department
    },
  },

  // ─────────────────────────────────────────────────────
  // STANDARDIZATION TABLE
  // ─────────────────────────────────────────────────────
  STANDARDIZATION: {
    TABLE_ID: "tblMdVyuaCBG40uQP",
    fields: {
      ID: "fldIDfieldXXXXXX",
      CATEGORY: "fldXXXXXXXXXXXXXX",  // Category name (BODY TYPE, FINISH, etc.)
      RAW_VALUE: "fldXXXXXXXXXXXXXX",  // Incoming value from supplier
      STANDARD_VALUE: "fldXXXXXXXXXXXXXX",  // Normalized value to use
    },
  },

  // ─────────────────────────────────────────────────────
  // STANDARD SELECT FIELD VALUES
  // ─────────────────────────────────────────────────────
  ENUM_VALUES: {
    ETL_STATUS: {
      PENDING: "pending",
      PENDING_REVIEW: "pending_review",      // Held by Script 0B for review
      PROCESSED: "processed",
      FAILED: "failed",
      COMPLETED: "completed",
    },
    LOG_SEVERITY: {
      INFO: "Info",
      WARNING: "Warning",
      HIGH: "High",
      CRITICAL: "Critical",
    },
    LOG_STATUS: {
      LOGGED: "Logged",
      IN_REVIEW: "In_Review",
      RESOLVED: "Resolved",
    },
    SYSTEM_EVENT_TYPE: "System_Event",  // NOTE: removed trailing space (was bug)
    PRODUCT_STATUS: {
      SPD: "SPD",      // Supplier Product Data
      SPD_EOR: "SPD EOR",  // End of Range
      SPD_DD: "SPD DD",    // Discontinued
      LIVE: "Live",
      DRAFT: "Draft",
    },
  },

  // ─────────────────────────────────────────────────────
  // SCRIPT EXECUTION SETTINGS
  // ─────────────────────────────────────────────────────
  SCRIPT_CONFIG: {
    BATCH_SIZE: 50,  // Airtable API limit per batch
    DRY_RUN: false,  // Set to true to test without writing
    FUZZY_THRESHOLD: 0.85,  // Fuzzy matching threshold for Script 0A
    NUMERIC_PRECISION: 2,  // Decimal places for price/stock
    AVAILABLE_GUARDRAIL_TOLERANCE: 0.001,  // 0.1% tolerance for price/stock mismatch
  },

  // ─────────────────────────────────────────────────────
  // HELPER FUNCTIONS
  // ─────────────────────────────────────────────────────
  
  /**
   * Get field ID with fallback error handling
   * @param {string} path - dot-notation path (e.g., "STAGING.fields.SKU")
   * @returns {string} field ID or throws error if not found
   */
  getFieldId: function(path) {
    const keys = String(path).split(".");
    let value = this;
    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        throw new Error(`CONFIG path not found: ${path}`);
      }
    }
    return value;
  },

  /**
   * Get table ID by name
   * @param {string} tableName - e.g., "STAGING", "SUPPLIER_PRODUCT_DATA"
   * @returns {string} table ID
   */
  getTableId: function(tableName) {
    const tableConfig = this[tableName];
    if (!tableConfig || !tableConfig.TABLE_ID) {
      throw new Error(`Table CONFIG not found: ${tableName}`);
    }
    return tableConfig.TABLE_ID;
  },

  /**
   * Validate that all required field IDs are defined
   * @returns {object} validation result { isValid: bool, errors: [] }
   */
  validate: function() {
    const errors = [];
    
    // Check for required tables
    const requiredTables = ["STAGING", "SUPPLIER_PRODUCT_DATA", "SYSTEM_LOGS"];
    for (const table of requiredTables) {
      if (!this[table] || !this[table].TABLE_ID) {
        errors.push(`Missing TABLE_ID for ${table}`);
      }
    }

    // Check for hardcoded placeholders (XXX)
    const configStr = JSON.stringify(this);
    if (configStr.includes("fldXXXXXXXXXXXXXX")) {
      errors.push("CONFIG contains placeholder field IDs (fldXXXXXXXXXXXXXX) — update required");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  },
};

// ═══════════════════════════════════════════════════════
// EXPORT (if using modules) or just define globally
// ═══════════════════════════════════════════════════════
// export { CONFIG };  // For module systems
// globalThis.CONFIG = CONFIG;  // For scripts

// For Airtable scripts (copy-paste at top of each script):
// const CONFIG = { /* entire CONFIG object above */ };
