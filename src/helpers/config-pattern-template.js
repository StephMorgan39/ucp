// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION — Customize per script
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  // Script Metadata
  scriptName: "Script 0B",
  scriptVersion: "2.0",
  scriptPurpose: "Validation Gate — holds records that need Nina approval",

  // Table IDs (same for all scripts in this base)
  tables: {
    staging: "tblcPSP5NcP0ioUP8",      // Staging
    systemLogs: "tblk1v5VHPEC2c2u2",   // SystemLogs
    upcAdmin: "tbl56i9Rlm2mK6t1w",     // UPCAdmin
    // Add table IDs as needed for THIS script
    spd: "tbl7mZpHJCUs1r0cg",          // SPD (if needed)
    pm: "tblgLqMMXX2HcKt9U",           // ProductMaster (if needed)
  },

  // Field IDs (grouped by table)
  fields: {
    staging: {
      supplierSku: "fldeEd9FiNq5AtGNk",
      etlStatus: "fldbrUDvLv8OEnEqh",
      importType: "fldjdRY1TAJypmcPF",
      description: "fldkAm1iLOJJYmzmi",
      // Add other Staging fields as needed
    },
    systemLogs: {
      notes: "fld4l6AJhVNRzIaY8",
      systemEvent: "flda8oHUThBc1Kb7I",
      severity: "fldPdoc6JPYHV9gpb",
      systemLog: "fldog9l4DwJeE5Qj8",
      stagingLink: "fldjHeNOkAl5rXSQd",
      operatorEmail: "fldyYs6l736JsE2iJ",
      reviewed: "fldJ1v4BeTILLN37J",
      upcAdminLink: "fldWXFUMjSnBFAGvd",
    },
    upcAdmin: {
      notes: "fldB7o9RtnQPi4goY",
      errorType: "fldjYiDzJmdYJp6uF",
      severity: "fld3TPgysD2hLbtvR",
      resolutionStatus: "fld4li4vcLn43h2N4",
      dateDetected: "fldE7JCdKubLvxysd",
      stagingLink: "fldz5hJMgnsZu0T07",
      approved: "flddfVzPFP0NjYhVc",
      detectedBy: "fldbPrkOy6XavA4ef",
    },
    // Add script-specific fields below as needed
  },
};