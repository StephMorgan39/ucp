/**
 * SCRIPT 0 — NATIVE CSV STAGING LOADER v2.1 (Automation Safe)
 */
const recordId = "reco8AXKZedzXR5kH";


async function main() {
    console.log("📥 Script 0 — CSV Staging Loader (Dynamic)");

    const metaTable = base.getTable("tblz0ZlAJByjkqPbH");
    const stagingTable = base.getTable("tblcPSP5NcP0ioUP8");
    const manifestTable = base.getTable("tblwPVgm3fLS1WjMo");

    const metaQuery = await metaTable.selectRecordsAsync({
        fields: ["fld9ROntbwWHYGBt9", "fldznkw7kfCI8sXjn", "fldxFveyMk1iCU7xC", "fldtTTRihPTXisag8"]
    });
    const record = metaQuery.getRecord(recordId);

    if (!record) {
        console.log("❌ Triggering record not found.");
        return;
    }

    const attachments = record.getCellValue("fld9ROntbwWHYGBt9");
    if (!attachments || attachments.length === 0) {
        console.log("❌ No CSV attachment found.");
        return;
    }

    const helperTag = record.getCellValueAsString("fldznkw7kfCI8sXjn");
    const importType = helperTag ? helperTag.split(" ")[0].trim() : "ST"; // FIX: take first token as string, not the array
    const supplierLink = record.getCellValue("fldxFveyMk1iCU7xC");

    console.log("Loading Dynamic Manifest Mapping...");
    
    const CANONICAL_TO_STAGING = {
        "424": "fldeEd9FiNq5AtGNk", "356": "fldkAm1iLOJJYmzmi", "292": "fldvZjLna62iMbj5K", 
        "422": "fldbgiMR2Qlm169Mu", "362": "fldIEO5cTzgLSSOC0", "427": "fldslE6XEO2Lqi4Qd",
        "483": "fld4QhEwwFSgFsHRB", "299": "fldkh9EFaIKvc0yIj", "300": "fldqFzEPIby2C94Du", 
        "304": "fldfMSgqnPwP2hvtl", "306": "fldiTSUcLPa4uLT4L", "307": "fldvVC9z72GqYdDko", 
        "479": "fldS2mZdWoY7hPU3G", "480": "fld8Qz10GgXiS6Da5", "481": "fldf5VU6KDd2cSqUB", 
        "390": "fldOfxvmWk1K1J0TQ", "371": "fldhNujCBWdylBEzS", "375": "fldHDkQCH8jKeJZ7g", 
        "376": "fldMP2ywTGMepEX9K", "427": "fldslE6XEO2Lqi4Qd", 
    };

    const manifestQuery = await manifestTable.selectRecordsAsync({
        fields: ["fldHCtuNeJJCEHiO7", "fldRcrppQB3MG5YuV"] 
    });

    const COLUMN_MAP = {};
    for (const r of manifestQuery.records) {
        const colName = r.getCellValueAsString("fldHCtuNeJJCEHiO7").trim().toUpperCase();
        const canLink = r.getCellValue("fldRcrppQB3MG5YuV");
        if (colName && canLink && canLink.length > 0) {
            const canId = canLink[0].name; // FIX: linked record field returns array; index [0]
            const stagingField = CANONICAL_TO_STAGING[canId];
            if (stagingField) COLUMN_MAP[colName] = stagingField;
        }
    }

    console.log("Downloading and parsing CSV...");
    const fileUrl = attachments[0].url; // FIX: attachments is an array; [0] is required
    const response = await fetch(fileUrl);
    const csvText = await response.text();

    const rows = [];
    let row = [], inQuotes = false, val = '';
    for (let i = 0; i < csvText.length; i++) {
        let c = csvText[i], next = csvText[i+1];
        if (c === '"' && inQuotes && next === '"') { val += '"'; i++; } 
        else if (c === '"') { inQuotes = !inQuotes; } 
        else if (c === ',' && !inQuotes) { row.push(val); val = ''; } 
        else if ((c === '\n' || c === '\r') && !inQuotes) {
            if (c === '\r' && next === '\n') i++;
            row.push(val); rows.push(row); row = []; val = '';
        } else { val += c; }
    }
    if (val || row.length > 0) { row.push(val); rows.push(row); }

    const headers = rows[0].map(h => h.trim().toUpperCase()); // FIX: rows[0] is the header row; rows itself is the 2D array

    const SINGLE_SELECTS = ["fldIEO5cTzgLSSOC0", "fld4QhEwwFSgFsHRB", "fldqFzEPIby2C94Du", "fldfMSgqnPwP2hvtl"];
    const NUMBER_FIELDS = ["fldiTSUcLPa4uLT4L", "fldvVC9z72GqYdDko", "fldS2mZdWoY7hPU3G", "fld8Qz10GgXiS6Da5", "fldf5VU6KDd2cSqUB", "fldOfxvmWk1K1J0TQ", "fldhNujCBWdylBEzS", "fldqPizK5v1z69O7L", "fldHDkQCH8jKeJZ7g", "fldkh9EFaIKvc0yIj"];

    function cleanNumber(v) {
        if (!v) return null;
        let clean = String(v).replace(',', '.').replace(/[^0-9.-]/g, '');
        let num = parseFloat(clean);
        return isNaN(num) ? null : num;
    }

    console.log("Building Staging Records...");
    let stagingCreates = [];
    
    for (let i = 1; i < rows.length; i++) {
        let r = rows[i];
        if (!r || r.length < 2 || r.every(cell => !cell || !cell.trim())) continue; // FIX: proper empty-row guard

        let fields = {
            "fldbrUDvLv8OEnEqh": { name: "pending" }, 
            "fldjdRY1TAJypmcPF": { name: importType }, 
            "fldbffhLGECRlzSt2": [{ id: record.id }]   
        };

        if (supplierLink && supplierLink.length > 0) {
            fields["fldhYMKeVijNr36Fs"] = [{ id: supplierLink[0].id || supplierLink[0] }];
        }

        for (let j = 0; j < headers.length; j++) {
            let header = headers[j];
            let val = r[j] ? r[j].trim() : null;
            if (!val) continue;

            let fieldId = COLUMN_MAP[header];
            if (fieldId) {
                if (NUMBER_FIELDS.includes(fieldId)) {
                    let num = cleanNumber(val);
                    if (num !== null) fields[fieldId] = num;
                } else if (SINGLE_SELECTS.includes(fieldId)) {
                    fields[fieldId] = { name: val };
                } else {
                    fields[fieldId] = val;
                }
            }
        }
        stagingCreates.push({ fields });
    }

    console.log(`Writing ${stagingCreates.length} rows to Staging...`);
    const chunk = (arr, n) => {
        const out = [];
        for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
        return out;
    };

    for (const batch of chunk(stagingCreates, 50)) {
        await stagingTable.createRecordsAsync(batch);
    }

    await metaTable.updateRecordAsync(record.id, {
        "fldtTTRihPTXisag8": { name: "Processed" }
    });

    console.log("✅ Dynamic Mapping Successful. Flowing to Script 0A.");
}

await main();