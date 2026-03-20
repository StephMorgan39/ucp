/**
 * 🔀 ETL Router v1.7 (Automation Optimized)
 * Utile PIM | FMEA Applied: Fixed Scoping & Input Mapping
 */

// ============================================================
// 1. TABLE & CONSTANT DEFINITIONS
// ============================================================
const stagingTable = base.getTable("tblcPSP5NcP0ioUP8");
const spdTable = base.getTable("tbl7mZpHJCUs1r0cg");
const adminLogs = base.getTable("tblk1v5VHPEC2c2u2");
const standardizationTbl = base.getTable("tblMdVyuaCBG40uQP");

const OVERWRITE_DESCRIPTION = false;

console.log(`🔀 ETL Router v1.7 — Starting at: ${new Date().toLocaleString()}`);

// ============================================================
// 2. HELPER FUNCTIONS
// ============================================================
const chunk = (arr, n) => {
  const o = [];
  for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n));
  return o;
};

const normSku = (s) =>
  String(s || "")
    .replace(/[-\s]/g, "")
    .trim()
    .toUpperCase();

const parseDimensions = (raw) => {
  if (!raw) return null;
  const isCm = /\bcm\b/i.test(raw);
  const cleaned = raw
    .replace(/mm|cm/gi, "")
    .replace(/[x×*✕]/gi, "|")
    .replace(/\s+/g, "")
    .trim();
  const parts = cleaned.split("|").filter((p) => p !== "");
  if (parts.length < 2) return null;
  const a = parseFloat(parts[0]);
  const b = parseFloat(parts[1]);
  if (isNaN(a) || isNaN(b)) return null;
  const multiplier = isCm ? 10 : 1;
  return {
    length: Math.round(Math.max(a, b) * multiplier),
    width: Math.round(Math.min(a, b) * multiplier),
  };
};

const nullSafe = (spdRec, fieldId, value) => {
  if (!value && value !== 0) return null;
  const existing = spdRec.getCellValue(fieldId);
  if (existing !== null && existing !== undefined && existing !== "")
    return null;
  return value;
};

const nullSafeDim = (spdRec, fieldId, value) => {
  if (!value) return null;
  const existing = spdRec.getCellValue(fieldId);
  if (existing && existing > 0) return null;
  return value;
};

const nullSafeNum = (spdRec, fieldId, newValue) => {
  if (newValue === null || newValue === undefined) return null;
  const existing = spdRec.getCellValue(fieldId);
  if (existing !== null && existing !== undefined && existing !== "")
    return null;
  return newValue;
};

// ============================================================
// 3. LOAD STANDARDIZATION ENGINE
// ============================================================
console.log("Step 1 — Loading Standardization engine...");
const stdQuery = await standardizationTbl.selectRecordsAsync({
  fields: [
    "fld2bslzLVAsSQIT8", // Category
    "fldDUZ6Rgq2AyGFI0", // Field Name
    "fld9DuMSezOu8000U", // Example Input
    "fldHA73RGGr3ERvNp", // Example Output
    "fldid3LYwJeC8bx7e", // Automated Standardization Feasible
  ],
});

const stdEngine = {};
for (const r of stdQuery.records) {
  // Correct ID for 'Automated Standardization Feasible'
  if (r.getCellValueAsString("fldid3LYwJeC8bx7e") === "Yes") {
    // Correct ID for 'Category' and 'Example Input'
    const cat = r
      .getCellValueAsString("fld2bslzLVAsSQIT8")
      .trim()
      .toUpperCase();
    const inputVal = r
      .getCellValueAsString("fld9DuMSezOu8000U")
      .trim()
      .toUpperCase();

    const key = `${cat}|${inputVal}`;
    // Correct ID for 'Example Output'
    stdEngine[key] = r.getCellValueAsString("fldHA73RGGr3ERvNp").trim();
  }
}
console.log(
  `✅ Standardization engine loaded: ${Object.keys(stdEngine).length} rules`,
);

const applyStd = (category, rawValue) => {
  if (!rawValue) return rawValue;
  // Standardizes the incoming data by checking the Category+Value key
  const key = `${category.toUpperCase()}|${String(rawValue).trim().toUpperCase()}`;
  return stdEngine[key] || rawValue;
};

// ============================================================
// 4. LOAD TRIGGERING STAGING RECORD
// ============================================================
const config = input.config();
const recordId = config.stagingRecordId;
const currentStatus = config.importStatus;

console.log(`Step 2 — Processing Triggering Record: ${recordId}`);

const stagingRec = await stagingTable.selectRecordAsync(recordId, {
  fields: [
    "fldeEd9FiNq5AtGNk",
    "fldjdRY1TAJypmcPF",
    "fldbrUDvLv8OEnEqh",
    "fldbffhLGECRlzSt2",
    "fldhNujCBWdylBEzS",
    "fldqPizK5v1z69O7L",
    "fld4WI1P7S1cGxoyo",
    "fld6ich1CWKGs0tur",
    "fldcvr9PjTp0HeKnB",
    "fldiTSUcLPa4uLT4L",
    "fldvVC9z72GqYdDko",
    "fldS2mZdWoY7hPU3G",
    "fld8Qz10GgXiS6Da5",
    "fldf5VU6KDd2cSqUB",
    "fldOfxvmWk1K1J0TQ",
    "fldkAm1iLOJJYmzmi",
    "fldvZjLna62iMbj5K",
    "fld4QhEwwFSgFsHRB",
    "fldIEO5cTzgLSSOC0",
  ],
});

if (!stagingRec) throw new Error("Could not find triggering record data.");

// Define the variable for the entire script scope
const pendingRows = [stagingRec];


// ============================================================
// 5. LOAD SPD INDEX
// ============================================================
console.log("Step 3 — Loading SPD index...");
const spdQuery = await spdTable.selectRecordsAsync({
  fields: [
    "fldmeU6JZIwvGAuRH",
    "fldK3FyPA98F3smc9",
    "fldoROoSpEm5FuUnI",
    "fldhE2dMfNk1rLJ8V",
    "fldeiQRu0fp13cMyL",
    "fldqkhCrXeaEsmKuQ",
    "fldQns7cT9JDqHy0Z",
    "fldeQy5c79koW7ABQ",
    "fldSgGBl9MmbFNgfi",
    "fldv7C2yxJqMMwy71",
    "fld9YEiSLAsO2D49B",
    "fld3SEg2FtEQGpqOA",
    "fld1xHQZEyBLByG60",
    "fldW0kGw6FI6fBXEu",
    "fldtMpYo9uqtirVW7",
  ],
});

const spdIndex = {};
for (const rec of spdQuery.records) {
  const key = rec
    .getCellValueAsString("fldmeU6JZIwvGAuRH")
    .trim()
    .toUpperCase();
  if (key) spdIndex[key] = rec;
}

// ============================================================
// 6. PROCESSING LOOP
// ============================================================
console.log("Step 4 — Processing...");
let countUpdated = 0,
  countCreated = 0,
  countFailed = 0,
  countDimParsed = 0;
const stagingUpdates = [],
  spdUpdates = [],
  spdCreates = [];

for (const stagingRec of pendingRows) {
  const importType = stagingRec.getCellValueAsString("fldjdRY1TAJypmcPF");
  const rawSku = stagingRec.getCellValueAsString("fldeEd9FiNq5AtGNk").trim();
  const normKey = normSku(rawSku);

  if (!normKey) {
    countFailed++;
    stagingUpdates.push({
      id: stagingRec.id,
      fields: { fldbrUDvLv8OEnEqh: { name: "failed" } },
    });
    continue;
  }

  const spdRec = spdIndex[normKey];
  try {
    const payload = {};
    if (
      importType.startsWith("ST") ||
      importType.startsWith("EOR") ||
      importType.startsWith("DD")
    ) {
      // Stock Logic
      const soh = stagingRec.getCellValue("fldhNujCBWdylBEzS");
      const sav = stagingRec.getCellValue("fldqPizK5v1z69O7L");
      if (soh !== null) payload["fldnYxUVqYOTvBNVd"] = soh;
      if (sav !== null) payload["fldW44uBVVT9aqrcP"] = sav;
      payload["fldcq3PzsLthtvh2v"] = new Date().toISOString().split("T")[0];

      // Mapping & Standardisation
      const rawBody = stagingRec
        .getCellValueAsString("fldIEO5cTzgLSSOC0")
        .trim();
      const cleanBody = applyStd("Body Type", rawBody);
      if (cleanBody && spdRec) {
        const nsBody = nullSafe(spdRec, "fldtMpYo9uqtirVW7", cleanBody);
        if (nsBody) payload["fldtMpYo9uqtirVW7"] = nsBody;
      }

      if (spdRec) {
        spdUpdates.push({ id: spdRec.id, fields: payload });
        countUpdated++;
      } else {
        payload["fldK3FyPA98F3smc9"] = rawSku;
        spdCreates.push({ fields: payload });
        countCreated++;
      }
      stagingUpdates.push({
        id: stagingRec.id,
        fields: { fldbrUDvLv8OEnEqh: { name: "processed" } },
      });
    }
  } catch (err) {
    countFailed++;
    stagingUpdates.push({
      id: stagingRec.id,
      fields: { fldbrUDvLv8OEnEqh: { name: "failed" } },
    });
    await adminLogs.createRecordAsync({
      fld4l6AJhVNRzIaY8: `Script 1 failure - SKU ${rawSku}: ${err.message}`,
      flda8oHUThBc1Kb7I: { name: "Missing_Data" },
      fldPdoc6JPYHV9gpb: { name: "High" },
    });
  }
}

// ============================================================
// 7. COMMIT WRITES
// ============================================================
console.log("Step 5 — Writing to Airtable...");
if (spdCreates.length > 0) {
  for (const batch of chunk(spdCreates, 50))
    await spdTable.createRecordsAsync(batch);
}
if (spdUpdates.length > 0) {
  for (const batch of chunk(spdUpdates, 50))
    await spdTable.updateRecordsAsync(batch);
}
if (stagingUpdates.length > 0) {
  for (const batch of chunk(stagingUpdates, 50))
    await stagingTable.updateRecordsAsync(batch);
}

console.log(
  `✅ ETL Router Complete — Updated: ${countUpdated}, Created: ${countCreated}, Failed: ${countFailed}`,
);
