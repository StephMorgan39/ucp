// Airtable Scripting Extension
// SPD ↔ PM Reconciliation Engine v1
// Scope: Finish, Body Type, PEI, Slip Rating, Thickness, Faces, Dimensions, Supplier, Description, Status
// Safe behavior:
// - Auto-append when target writable field is blank
// - Auto-fix only when target value is clearly invalid
// - Flag mismatches to UPCAdmin
// - Log all non-match outcomes to SystemLogs

const SETTINGS = {
  DRY_RUN: true,
  LIMIT: 100,                   // null = all linked SPD records
  ONLY_LINKED_SPD: true,
  CREATE_UPCADMIN: true,
  CREATE_SYSTEMLOGS: true,
  UPDATE_RECORDS: true,
  FLAG_DESCRIPTION_MISMATCH: true,
  FLAG_STATUS_MISMATCH: true,
  STRICT_DIMENSION_COMPARE: true,
};

const IDS = {
  TABLES: {
    SPD: 'tbl7mZpHJCUs1r0cg',
    PM: 'tblgLqMMXX2HcKt9U',
    UPCADMIN: 'tbl56i9Rlm2mK6t1w',
    SYSTEMLOGS: 'tblk1v5VHPEC2c2u2',
    BODY_FINISHES: 'tblC4VR0aTrbwvolE',
    BODY_CLASS: 'tblTKGGHdw9pUD0yR',
  },
  SPD: {
    PM_LINK: 'fldGxaIlPVor7QEwN',
    FINISH: 'fldeiQRu0fp13cMyL',
    BODY_TYPE: 'fldtMpYo9uqtirVW7',
    PEI: 'flds7HQW3Aa7Hvtds',
    SLIP: 'flddamWiApqbHs5ph',
    THICKNESS_RAW: 'fldqkhCrXeaEsmKuQ',
    FACES: 'fldLiNrr1OMuuBex5',
    SIZE_LENGTH: 'fldQns7cT9JDqHy0Z',
    SIZE_WIDTH: 'fldeQy5c79koW7ABQ',
    SUPPLIER: 'fldY9HQ6d42p8uVoY',
    DESCRIPTION: 'fldoROoSpEm5FuUnI',
    STATUS: 'fldK2EV1veOvEkCpu',
    SKU: 'fldK3FyPA98F3smc9',
  },
  PM: {
    SPD_LINK: 'fldxZcpnCCCYW5zHx',
    BODY_FINISH_LINK: 'fldU1VARr6kM7sihI',
    BODY_CLASS_LINK: 'fldyrCQE5L3lQktS3',
    THICK_MM: 'fldEGSqge560gp4OK',
    FACES: 'fldFbjxoAh9sieegL',
    SUPPLIER_LINK: 'fld7IgWNjMiZM1Zat',
    DESCRIPTION: 'fld7hdhxyu61r5Olm',
    STATUS: 'flddq6S7409EBM71D',
    // read-only / derived lookups used for comparison only
    FINISH_LOOKUP: 'fldkXSYQ2Ss4N798J',
    BODY_LOOKUP: 'fldhb30utCH8C1RuI',
    PEI_LOOKUP: 'fld9knkHiVY0Ohn38',
    SLIP_LOOKUP: 'fldWrnmNdEWggIpyT',
    DIMENSION_LOOKUP: 'flduWOX1jgbINJF9L',
    SUPPLIER_LOOKUP: 'fldrabJOxHeAWnCVb',
  },
  UPCADMIN: {
    ERROR_TYPE: 'fldjYiDzJmdYJp6uF',
    SEVERITY: 'fld3TPgysD2hLbtvR',
    DETECTED_BY: 'fldbPrkOy6XavA4ef',
    RESOLUTION_STATUS: 'fld4li4vcLn43h2N4',
    ORIGINAL_VALUE: 'fld0wlmRbNFgVpbXS',
    NOTES: 'fldB7o9RtnQPi4goY',
    DATE_DETECTED: 'fldE7JCdKubLvxysd',
    PM_LINK: 'fldSnlHzlGF1EuBjA',
    OPERATOR_NOTES: 'fldeLLz0FAhiV6Pni',
  },
  SYSTEMLOGS: {
    NOTES: 'fld4l6AJhVNRzIaY8',
    SYSTEM_EVENT: 'flda8oHUThBc1Kb7I',
    SEVERITY: 'fldPdoc6JPYHV9gpb',
    SYSTEM_LOG: 'fldog9l4DwJeE5Qj8',
    UPCADMIN_LINK: 'fldWXFUMjSnBFAGvd',
  },
  OPTIONS: {
    UPCADMIN_ERROR_TYPE: {
      MISSING_DATA: { id: 'selwmu4JmGLwAa0p0', name: 'Missing_Data' },
      DESCRIPTION_DRIFT: { id: 'selli46YgvNl1R1fI', name: 'Description_Drift' },
      STOCK_LOGIC_ERROR: { id: 'sel8uHsKBBYbv75Gw', name: 'Stock_Logic_Error' },
      INVALID_FORMAT: { id: 'selPKuOVRd18UF0AM', name: 'Invalid_Format' },
      MISSING_LINK: { id: 'selI5UgUbUqnjibXL', name: 'Missing Link' },
      DUPLICATE_SKU: { id: 'sel96B3xtj4EI7u7K', name: 'Duplicate_SKU' },
    },
    UPCADMIN_SEVERITY: {
      INFO: { id: 'sel287UoJxEVcDQIx', name: 'Info' },
      LOW: { id: 'sel54V7Lcr5j9qMi4', name: 'Low' },
      MEDIUM: { id: 'selRZs20J5ZUpdVMi', name: 'Medium' },
      HIGH: { id: 'sel3orkypyW6HMVUn', name: 'High' },
      CRITICAL: { id: 'selqosAZ79r8xkuaD', name: 'Critical' },
    },
    UPCADMIN_DETECTED_BY: {
      SYSTEM_SCRIPT: { id: 'selQtU0hSyBg3X9vR', name: 'System Script' },
    },
    UPCADMIN_RESOLUTION_STATUS: {
      UNRESOLVED: { id: 'selG8UbMG6SGG1MIn', name: 'Unresolved' },
    },
    SYSTEMLOGS_EVENT: {
      MISSING_DATA: { id: 'sel9raBTQ0tNwa1cP', name: 'Missing_Data' },
      DESCRIPTION_DRIFT: { id: 'selZgMONxhMBgXRkS', name: 'Description_Drift' },
      STOCK_LOGIC_ERROR: { id: 'selM7B76ZI2u0VRMs', name: 'Stock_Logic_Error' },
      SYSTEM_EVENT: { id: 'selLRpcaRhw9qkXG6', name: 'System_Event' },
      DUPLICATE_SKU: { id: 'selSJzfL6x1NE6vCJ', name: 'Duplicate_SKU' },
      SKU_FORMAT_INVALID: { id: 'selA7BIgJ9IhH8qKr', name: 'SKU_Format_Invalid' },
    },
    SYSTEMLOGS_SEVERITY: {
      INFO: { id: 'selWeRZZbjHGdag4o', name: 'Info' },
      LOW: { id: 'seljT7UjqaDBhyq67', name: 'Low' },
      MEDIUM: { id: 'selRg4ruezqg84kBA', name: 'Medium' },
      HIGH: { id: 'selj6MrC36TFCRMnR', name: 'High' },
      CRITICAL: { id: 'selK3qm7i3dQTWqM4', name: 'Critical' },
    },
    SYSTEMLOGS_STATUS: {
      LOGGED: { id: 'selRQ6jjeliupLNMJ', name: 'Logged' },
      OPEN: { id: 'selnDfeHg2J7QBRjy', name: 'Open' },
      FIXED: { id: 'seltSdFO5v8IK41Bj', name: 'System_Fixed' },
      ERROR: { id: 'selcz9ikI49PBNXOX', name: 'Error' },
    },
    PM_STATUS_BY_SPD: {
      'SPD ACTIVE': 'PM ACTIVE',
      'SPD EOR': 'PM EOR',
      'SPD DD': 'PM DD',
      'SPD NEW': 'PM NEW',
      'CODE RETIRED': 'PM NOTLISTED',
      'SPD BATCH': 'PM NEW',
    },
  },
};

function chunk(array, size = 50) {
  const out = [];
  for (let i = 0; i < array.length; i += size) out.push(array.slice(i, i + size));
  return out;
}

function firstValue(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return firstValue(value[0]);
  }
  if (value && typeof value === 'object') {
    if ('name' in value) return value.name;
    if ('id' in value) return value.id;
  }
  return value ?? null;
}

function linkedIds(cellValue) {
  if (!Array.isArray(cellValue)) return [];
  return cellValue.map(v => v.id).filter(Boolean);
}

function normalizeText(value) {
  if (value == null) return null;
  const text = String(value).replace(/\s+/g, ' ').trim();
  return text ? text : null;
}

function normalizeUpper(value) {
  const text = normalizeText(value);
  return text ? text.toUpperCase() : null;
}

function normalizeFinish(value) {
  const raw = normalizeUpper(value);
  if (!raw) return null;
  const map = {
    'MATT': 'MATT',
    'MATTE': 'MATT',
    'GLOSS': 'GLOSS',
    'GLOSSY': 'GLOSS',
    'LAPPATO': 'LAPPATO',
    'LAP': 'LAPPATO',
    'SEMI POLISHED': 'SEMI-POLISHED',
    'SEMI-POLISHED': 'SEMI-POLISHED',
    'SEMIPOLISHED': 'SEMI-POLISHED',
    'S/POL': 'SEMI-POLISHED',
  };
  return map[raw] || raw;
}

function normalizeBodyType(value) {
  const raw = normalizeText(value);
  if (!raw) return null;
  const cleaned = raw.replace(/\s+/g, ' ').trim().toLowerCase();
  if (cleaned.includes('porcelain')) return 'Porcelain';
  if (cleaned.includes('ceramic')) return 'Ceramic';
  return raw.replace(/\b\w/g, c => c.toUpperCase());
}

function normalizePEI(value) {
  const raw = normalizeUpper(value);
  if (!raw) return null;
  const m = raw.match(/([2-5])/);
  return m ? `PEI${m[1]}` : null;
}

function normalizeSlip(value) {
  const raw = normalizeUpper(value);
  if (!raw) return null;
  const compact = raw.replace(/\s+/g, '');
  const allowed = new Set(['R9','R10','R10A+B','R10A+B+C','R11','R11A+B','R11A+B+C','R12']);
  return allowed.has(compact) ? compact : raw;
}

function normalizeNumber(value, precision = null) {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return precision == null ? value : Number(value.toFixed(precision));
  const text = String(value).replace(/,/g, '.').replace(/[^0-9.\-]/g, '').trim();
  if (!text) return null;
  const num = Number(text);
  if (Number.isNaN(num)) return null;
  return precision == null ? num : Number(num.toFixed(precision));
}

function normalizeDimensions(lengthValue, widthValue) {
  const a = normalizeNumber(lengthValue, 0);
  const b = normalizeNumber(widthValue, 0);
  if (a == null && b == null) return null;
  if (a != null && b == null) return `${a}`;
  if (a == null && b != null) return `${b}`;
  let first = a;
  let second = b;
  if (a <= 1000 && b <= 1000) {
    first = Math.min(a, b);
    second = Math.max(a, b);
  } else {
    first = Math.max(a, b);
    second = Math.min(a, b);
  }
  return `${first}x${second}`;
}

function normalizeDimensionLookup(value) {
  const raw = normalizeUpper(value);
  if (!raw) return null;
  const nums = raw.match(/\d+/g);
  if (!nums || nums.length === 0) return null;
  if (nums.length === 1) return nums[0];
  return normalizeDimensions(Number(nums[0]), Number(nums[1]));
}

function normalizeDescription(value) {
  const text = normalizeText(value);
  return text ? text.toUpperCase() : null;
}

function isBlank(value) {
  return value == null || value === '' || (Array.isArray(value) && value.length === 0);
}

function equalValues(a, b) {
  return a === b;
}

function makeNote(lines) {
  return lines.filter(Boolean).join('\n');
}

async function main() {
  output.markdown(`# SPD ↔ PM Reconciliation Engine v1`);
  output.markdown(`- Dry run: **${SETTINGS.DRY_RUN}**\n- Limit: **${SETTINGS.LIMIT ?? 'ALL'}**`);

  const spdTable = base.getTable(IDS.TABLES.SPD);
  const pmTable = base.getTable(IDS.TABLES.PM);
  const upcAdminTable = base.getTable(IDS.TABLES.UPCADMIN);
  const systemLogsTable = base.getTable(IDS.TABLES.SYSTEMLOGS);
  const bodyFinishesTable = base.getTable(IDS.TABLES.BODY_FINISHES);
  const bodyClassTable = base.getTable(IDS.TABLES.BODY_CLASS);

  const [spdQuery, pmQuery, bodyFinishQuery, bodyClassQuery] = await Promise.all([
    spdTable.selectRecordsAsync(),
    pmTable.selectRecordsAsync(),
    bodyFinishesTable.selectRecordsAsync(),
    bodyClassTable.selectRecordsAsync(),
  ]);

  const pmById = new Map(pmQuery.records.map(r => [r.id, r]));
  const finishRefByName = new Map();
  for (const rec of bodyFinishQuery.records) {
    const name = normalizeFinish(rec.name || rec.getCellValueAsString(bodyFinishesTable.primaryField));
    if (name) finishRefByName.set(name, rec.id);
  }
  const bodyClassRefByName = new Map();
  for (const rec of bodyClassQuery.records) {
    const name = normalizeBodyType(rec.getCellValueAsString('Product Type') || rec.name || rec.getCellValueAsString(bodyClassTable.primaryField));
    if (name) bodyClassRefByName.set(name, rec.id);
  }

  const spdRecords = spdQuery.records.filter(r => {
    const pmLinks = linkedIds(r.getCellValue(IDS.SPD.PM_LINK));
    return SETTINGS.ONLY_LINKED_SPD ? pmLinks.length > 0 : true;
  });
  const scopedSpdRecords = SETTINGS.LIMIT ? spdRecords.slice(0, SETTINGS.LIMIT) : spdRecords;

  const stats = {
    processed: 0,
    matches: 0,
    autoAppend: 0,
    autoFix: 0,
    flagged: 0,
    structural: 0,
    skipped: 0,
    updatedPmRecords: 0,
    upcadminCreated: 0,
    systemlogsCreated: 0,
  };

  const pmUpdatesById = new Map();
  const upcadminPayloads = [];
  const systemLogPayloads = [];

  function queuePmUpdate(recordId, fields) {
    const existing = pmUpdatesById.get(recordId) || {};
    pmUpdatesById.set(recordId, { ...existing, ...fields });
  }

  function queueAnomaly({ pmId, issueType, severity, originalValue, notes, operatorNotes }) {
    if (!SETTINGS.CREATE_UPCADMIN) return;
    upcadminPayloads.push({
      fields: {
        [IDS.UPCADMIN.ERROR_TYPE]: { id: issueType.id },
        [IDS.UPCADMIN.SEVERITY]: { id: severity.id },
        [IDS.UPCADMIN.DETECTED_BY]: { id: IDS.OPTIONS.UPCADMIN_DETECTED_BY.SYSTEM_SCRIPT.id },
        [IDS.UPCADMIN.RESOLUTION_STATUS]: { id: IDS.OPTIONS.UPCADMIN_RESOLUTION_STATUS.UNRESOLVED.id },
        [IDS.UPCADMIN.ORIGINAL_VALUE]: originalValue,
        [IDS.UPCADMIN.NOTES]: notes,
        [IDS.UPCADMIN.DATE_DETECTED]: new Date().toISOString(),
        [IDS.UPCADMIN.PM_LINK]: pmId ? [{ id: pmId }] : [],
        [IDS.UPCADMIN.OPERATOR_NOTES]: operatorNotes || '',
      }
    });
  }

  function queueSystemLog({ eventType, severity, status, notes }) {
    if (!SETTINGS.CREATE_SYSTEMLOGS) return;
    systemLogPayloads.push({
      fields: {
        [IDS.SYSTEMLOGS.SYSTEM_EVENT]: { id: eventType.id },
        [IDS.SYSTEMLOGS.SEVERITY]: { id: severity.id },
        [IDS.SYSTEMLOGS.SYSTEM_LOG]: { id: status.id },
        [IDS.SYSTEMLOGS.NOTES]: notes,
      }
    });
  }

  function processRule({
    fieldName,
    severity,
    eventType,
    issueType,
    spdNorm,
    pmNorm,
    pmIsBlank,
    pmInvalid,
    canAutoAppend,
    canFixInvalid,
    updateFieldFactory,
    pmId,
    spdRecord,
    pmRecord,
    suggestedValue,
    originalValue,
    mismatchOnly = false,
  }) {
    if (!spdNorm) {
      stats.skipped += 1;
      return;
    }

    if (pmIsBlank && canAutoAppend && !mismatchOnly) {
      stats.autoAppend += 1;
      if (!SETTINGS.DRY_RUN && SETTINGS.UPDATE_RECORDS) {
        const patch = updateFieldFactory();
        if (patch) queuePmUpdate(pmId, patch);
      }
      queueSystemLog({
        eventType,
        severity,
        status: IDS.OPTIONS.SYSTEMLOGS_STATUS.FIXED,
        notes: makeNote([
          `AUTO_APPEND | Field: ${fieldName}`,
          `SPD SKU: ${spdRecord.getCellValueAsString(IDS.SPD.SKU)}`,
          `PM Record: ${pmRecord.name}`,
          `Suggested/Appended Value: ${suggestedValue}`,
        ]),
      });
      return;
    }

    if (pmInvalid && canFixInvalid && !mismatchOnly) {
      stats.autoFix += 1;
      if (!SETTINGS.DRY_RUN && SETTINGS.UPDATE_RECORDS) {
        const patch = updateFieldFactory();
        if (patch) queuePmUpdate(pmId, patch);
      }
      queueSystemLog({
        eventType,
        severity,
        status: IDS.OPTIONS.SYSTEMLOGS_STATUS.FIXED,
        notes: makeNote([
          `AUTO_FIX_INVALID | Field: ${fieldName}`,
          `SPD SKU: ${spdRecord.getCellValueAsString(IDS.SPD.SKU)}`,
          `PM Record: ${pmRecord.name}`,
          `Old PM Value: ${originalValue ?? ''}`,
          `New Value: ${suggestedValue}`,
        ]),
      });
      return;
    }

    if (!equalValues(spdNorm, pmNorm)) {
      stats.flagged += 1;
      queueAnomaly({
        pmId,
        issueType,
        severity,
        originalValue: originalValue ?? '',
        notes: makeNote([
          `${fieldName} mismatch detected.`,
          `SPD SKU: ${spdRecord.getCellValueAsString(IDS.SPD.SKU)}`,
          `SPD Normalized Value: ${spdNorm}`,
          `PM Current Value: ${pmNorm ?? '(blank)'}`,
          `Suggested Value: ${suggestedValue}`,
        ]),
      });
      queueSystemLog({
        eventType,
        severity,
        status: IDS.OPTIONS.SYSTEMLOGS_STATUS.OPEN,
        notes: makeNote([
          `MISMATCH_FLAGGED | Field: ${fieldName}`,
          `SPD SKU: ${spdRecord.getCellValueAsString(IDS.SPD.SKU)}`,
          `PM Record: ${pmRecord.name}`,
          `SPD Normalized Value: ${spdNorm}`,
          `PM Current Value: ${pmNorm ?? '(blank)'}`,
          `Suggested Value: ${suggestedValue}`,
        ]),
      });
      return;
    }

    stats.matches += 1;
  }

  const seenSkuToPm = new Map();

  for (const spdRecord of scopedSpdRecords) {
    stats.processed += 1;
    const spdSku = spdRecord.getCellValueAsString(IDS.SPD.SKU);
    const pmLinkIds = linkedIds(spdRecord.getCellValue(IDS.SPD.PM_LINK));
    if (pmLinkIds.length === 0) {
      stats.structural += 1;
      queueAnomaly({
        pmId: null,
        issueType: IDS.OPTIONS.UPCADMIN_ERROR_TYPE.MISSING_LINK,
        severity: IDS.OPTIONS.UPCADMIN_SEVERITY.HIGH,
        originalValue: spdSku,
        notes: `SPD record ${spdSku} has no linked ProductMaster record.`,
      });
      queueSystemLog({
        eventType: IDS.OPTIONS.SYSTEMLOGS_EVENT.MISSING_DATA,
        severity: IDS.OPTIONS.SYSTEMLOGS_SEVERITY.HIGH,
        status: IDS.OPTIONS.SYSTEMLOGS_STATUS.OPEN,
        notes: `MISSING_LINK | SPD SKU: ${spdSku} has no linked PM record.`,
      });
      continue;
    }
    const pmId = pmLinkIds[0];
    const pmRecord = pmById.get(pmId);
    if (!pmRecord) continue;

    const skuKey = normalizeUpper(spdSku);
    if (skuKey) {
      const prior = seenSkuToPm.get(skuKey);
      if (prior && prior !== pmId) {
        stats.structural += 1;
        queueAnomaly({
          pmId,
          issueType: IDS.OPTIONS.UPCADMIN_ERROR_TYPE.DUPLICATE_SKU,
          severity: IDS.OPTIONS.UPCADMIN_SEVERITY.CRITICAL,
          originalValue: spdSku,
          notes: `Duplicate normalized SPD SKU detected across multiple PM records. SKU=${spdSku}`,
        });
        queueSystemLog({
          eventType: IDS.OPTIONS.SYSTEMLOGS_EVENT.DUPLICATE_SKU,
          severity: IDS.OPTIONS.SYSTEMLOGS_SEVERITY.CRITICAL,
          status: IDS.OPTIONS.SYSTEMLOGS_STATUS.OPEN,
          notes: `STRUCTURAL_ALERT | Duplicate normalized SPD SKU across PM records. SKU=${spdSku}`,
        });
      } else {
        seenSkuToPm.set(skuKey, pmId);
      }
    }

    // 1. Finish
    const spdFinishNorm = normalizeFinish(spdRecord.getCellValueAsString(IDS.SPD.FINISH));
    const pmFinishNorm = normalizeFinish(pmRecord.getCellValueAsString(IDS.PM.FINISH_LOOKUP));
    const finishRefId = spdFinishNorm ? finishRefByName.get(spdFinishNorm) : null;
    processRule({
      fieldName: 'Finish',
      severity: IDS.OPTIONS.UPCADMIN_SEVERITY.MEDIUM,
      eventType: IDS.OPTIONS.SYSTEMLOGS_EVENT.MISSING_DATA,
      issueType: IDS.OPTIONS.UPCADMIN_ERROR_TYPE.MISSING_DATA,
      spdNorm: spdFinishNorm,
      pmNorm: pmFinishNorm,
      pmIsBlank: isBlank(pmRecord.getCellValue(IDS.PM.BODY_FINISH_LINK)) || !pmFinishNorm,
      pmInvalid: !pmFinishNorm && !isBlank(pmRecord.getCellValue(IDS.PM.BODY_FINISH_LINK)),
      canAutoAppend: Boolean(finishRefId),
      canFixInvalid: Boolean(finishRefId),
      updateFieldFactory: () => finishRefId ? { [IDS.PM.BODY_FINISH_LINK]: [{ id: finishRefId }] } : null,
      pmId,
      spdRecord,
      pmRecord,
      suggestedValue: spdFinishNorm,
      originalValue: pmRecord.getCellValueAsString(IDS.PM.FINISH_LOOKUP),
    });

    // 2. Body Type
    const spdBodyNorm = normalizeBodyType(spdRecord.getCellValueAsString(IDS.SPD.BODY_TYPE));
    const pmBodyNorm = normalizeBodyType(pmRecord.getCellValueAsString(IDS.PM.BODY_LOOKUP));
    const bodyClassRefId = spdBodyNorm ? bodyClassRefByName.get(spdBodyNorm) : null;
    processRule({
      fieldName: 'Body Type',
      severity: IDS.OPTIONS.UPCADMIN_SEVERITY.HIGH,
      eventType: IDS.OPTIONS.SYSTEMLOGS_EVENT.MISSING_DATA,
      issueType: IDS.OPTIONS.UPCADMIN_ERROR_TYPE.INVALID_FORMAT,
      spdNorm: spdBodyNorm,
      pmNorm: pmBodyNorm,
      pmIsBlank: isBlank(pmRecord.getCellValue(IDS.PM.BODY_CLASS_LINK)) || !pmBodyNorm,
      pmInvalid: !pmBodyNorm && !isBlank(pmRecord.getCellValue(IDS.PM.BODY_CLASS_LINK)),
      canAutoAppend: Boolean(bodyClassRefId),
      canFixInvalid: Boolean(bodyClassRefId),
      updateFieldFactory: () => bodyClassRefId ? { [IDS.PM.BODY_CLASS_LINK]: [{ id: bodyClassRefId }] } : null,
      pmId,
      spdRecord,
      pmRecord,
      suggestedValue: spdBodyNorm,
      originalValue: pmRecord.getCellValueAsString(IDS.PM.BODY_LOOKUP),
    });

    // 3. PEI - compare only, usually derived from linked SPD
    const spdPeiNorm = normalizePEI(spdRecord.getCellValueAsString(IDS.SPD.PEI));
    const pmPeiNorm = normalizePEI(pmRecord.getCellValueAsString(IDS.PM.PEI_LOOKUP));
    processRule({
      fieldName: 'PEI',
      severity: IDS.OPTIONS.UPCADMIN_SEVERITY.HIGH,
      eventType: IDS.OPTIONS.SYSTEMLOGS_EVENT.MISSING_DATA,
      issueType: IDS.OPTIONS.UPCADMIN_ERROR_TYPE.INVALID_FORMAT,
      spdNorm: spdPeiNorm,
      pmNorm: pmPeiNorm,
      pmIsBlank: !pmPeiNorm,
      pmInvalid: false,
      canAutoAppend: false,
      canFixInvalid: false,
      updateFieldFactory: () => null,
      pmId,
      spdRecord,
      pmRecord,
      suggestedValue: spdPeiNorm,
      originalValue: pmRecord.getCellValueAsString(IDS.PM.PEI_LOOKUP),
      mismatchOnly: true,
    });

    // 4. Slip Rating - compare only, usually derived from linked SPD
    const spdSlipNorm = normalizeSlip(spdRecord.getCellValueAsString(IDS.SPD.SLIP));
    const pmSlipNorm = normalizeSlip(pmRecord.getCellValueAsString(IDS.PM.SLIP_LOOKUP));
    processRule({
      fieldName: 'Slip Rating',
      severity: IDS.OPTIONS.UPCADMIN_SEVERITY.HIGH,
      eventType: IDS.OPTIONS.SYSTEMLOGS_EVENT.MISSING_DATA,
      issueType: IDS.OPTIONS.UPCADMIN_ERROR_TYPE.INVALID_FORMAT,
      spdNorm: spdSlipNorm,
      pmNorm: pmSlipNorm,
      pmIsBlank: !pmSlipNorm,
      pmInvalid: false,
      canAutoAppend: false,
      canFixInvalid: false,
      updateFieldFactory: () => null,
      pmId,
      spdRecord,
      pmRecord,
      suggestedValue: spdSlipNorm,
      originalValue: pmRecord.getCellValueAsString(IDS.PM.SLIP_LOOKUP),
      mismatchOnly: true,
    });

    // 5. Thickness
    const spdThicknessNorm = normalizeNumber(spdRecord.getCellValue(IDS.SPD.THICKNESS_RAW), 1);
    const pmThicknessNorm = normalizeNumber(pmRecord.getCellValue(IDS.PM.THICK_MM), 1);
    processRule({
      fieldName: 'Thickness',
      severity: IDS.OPTIONS.UPCADMIN_SEVERITY.MEDIUM,
      eventType: IDS.OPTIONS.SYSTEMLOGS_EVENT.MISSING_DATA,
      issueType: IDS.OPTIONS.UPCADMIN_ERROR_TYPE.INVALID_FORMAT,
      spdNorm: spdThicknessNorm,
      pmNorm: pmThicknessNorm,
      pmIsBlank: isBlank(pmRecord.getCellValue(IDS.PM.THICK_MM)),
      pmInvalid: pmThicknessNorm == null && !isBlank(pmRecord.getCellValue(IDS.PM.THICK_MM)),
      canAutoAppend: true,
      canFixInvalid: true,
      updateFieldFactory: () => ({ [IDS.PM.THICK_MM]: spdThicknessNorm }),
      pmId,
      spdRecord,
      pmRecord,
      suggestedValue: String(spdThicknessNorm),
      originalValue: pmRecord.getCellValueAsString(IDS.PM.THICK_MM),
    });

    // 6. Faces
    const spdFacesNorm = normalizeNumber(spdRecord.getCellValue(IDS.SPD.FACES), 0);
    const pmFacesNorm = normalizeNumber(pmRecord.getCellValue(IDS.PM.FACES), 0);
    processRule({
      fieldName: 'Faces',
      severity: IDS.OPTIONS.UPCADMIN_SEVERITY.LOW,
      eventType: IDS.OPTIONS.SYSTEMLOGS_EVENT.MISSING_DATA,
      issueType: IDS.OPTIONS.UPCADMIN_ERROR_TYPE.INVALID_FORMAT,
      spdNorm: spdFacesNorm,
      pmNorm: pmFacesNorm,
      pmIsBlank: isBlank(pmRecord.getCellValue(IDS.PM.FACES)),
      pmInvalid: pmFacesNorm == null && !isBlank(pmRecord.getCellValue(IDS.PM.FACES)),
      canAutoAppend: true,
      canFixInvalid: true,
      updateFieldFactory: () => ({ [IDS.PM.FACES]: spdFacesNorm }),
      pmId,
      spdRecord,
      pmRecord,
      suggestedValue: String(spdFacesNorm),
      originalValue: pmRecord.getCellValueAsString(IDS.PM.FACES),
    });

    // 7. Dimensions - compare only, currently lookup/formula driven from SPD
    const spdDimNorm = normalizeDimensions(
      spdRecord.getCellValue(IDS.SPD.SIZE_LENGTH),
      spdRecord.getCellValue(IDS.SPD.SIZE_WIDTH)
    );
    const pmDimNorm = normalizeDimensionLookup(pmRecord.getCellValueAsString(IDS.PM.DIMENSION_LOOKUP));
    processRule({
      fieldName: 'Dimensions',
      severity: IDS.OPTIONS.UPCADMIN_SEVERITY.HIGH,
      eventType: IDS.OPTIONS.SYSTEMLOGS_EVENT.MISSING_DATA,
      issueType: IDS.OPTIONS.UPCADMIN_ERROR_TYPE.INVALID_FORMAT,
      spdNorm: spdDimNorm,
      pmNorm: pmDimNorm,
      pmIsBlank: !pmDimNorm,
      pmInvalid: false,
      canAutoAppend: false,
      canFixInvalid: false,
      updateFieldFactory: () => null,
      pmId,
      spdRecord,
      pmRecord,
      suggestedValue: spdDimNorm,
      originalValue: pmRecord.getCellValueAsString(IDS.PM.DIMENSION_LOOKUP),
      mismatchOnly: true,
    });

    // 8. Supplier link
    const spdSupplierIds = linkedIds(spdRecord.getCellValue(IDS.SPD.SUPPLIER));
    const pmSupplierIds = linkedIds(pmRecord.getCellValue(IDS.PM.SUPPLIER_LINK));
    const missingAnySupplier = spdSupplierIds.length > 0 && pmSupplierIds.length === 0;
    if (missingAnySupplier) {
      stats.autoAppend += 1;
      if (!SETTINGS.DRY_RUN && SETTINGS.UPDATE_RECORDS) {
        queuePmUpdate(pmId, { [IDS.PM.SUPPLIER_LINK]: spdSupplierIds.map(id => ({ id })) });
      }
      queueSystemLog({
        eventType: IDS.OPTIONS.SYSTEMLOGS_EVENT.MISSING_DATA,
        severity: IDS.OPTIONS.SYSTEMLOGS_SEVERITY.MEDIUM,
        status: IDS.OPTIONS.SYSTEMLOGS_STATUS.FIXED,
        notes: `AUTO_APPEND | Field: Supplier Link | SPD SKU: ${spdSku} | Appended supplier link(s) to PM.`,
      });
    } else if (spdSupplierIds.length > 0) {
      const same = JSON.stringify([...spdSupplierIds].sort()) === JSON.stringify([...pmSupplierIds].sort());
      if (!same) {
        stats.flagged += 1;
        queueAnomaly({
          pmId,
          issueType: IDS.OPTIONS.UPCADMIN_ERROR_TYPE.MISSING_LINK,
          severity: IDS.OPTIONS.UPCADMIN_SEVERITY.HIGH,
          originalValue: pmSupplierIds.join(','),
          notes: `Supplier link mismatch. SPD supplier link(s) differ from PM supplier link(s). SPD SKU=${spdSku}`,
        });
        queueSystemLog({
          eventType: IDS.OPTIONS.SYSTEMLOGS_EVENT.MISSING_DATA,
          severity: IDS.OPTIONS.SYSTEMLOGS_SEVERITY.HIGH,
          status: IDS.OPTIONS.SYSTEMLOGS_STATUS.OPEN,
          notes: `MISMATCH_FLAGGED | Field: Supplier Link | SPD SKU: ${spdSku} | SPD suppliers=${spdSupplierIds.join(',')} | PM suppliers=${pmSupplierIds.join(',')}`,
        });
      } else {
        stats.matches += 1;
      }
    }

    // 9. Description mismatch (flag only)
    if (SETTINGS.FLAG_DESCRIPTION_MISMATCH) {
      const spdDescNorm = normalizeDescription(spdRecord.getCellValueAsString(IDS.SPD.DESCRIPTION));
      const pmDescNorm = normalizeDescription(pmRecord.getCellValueAsString(IDS.PM.DESCRIPTION));
      if (spdDescNorm && pmDescNorm && spdDescNorm !== pmDescNorm) {
        stats.flagged += 1;
        queueAnomaly({
          pmId,
          issueType: IDS.OPTIONS.UPCADMIN_ERROR_TYPE.DESCRIPTION_DRIFT,
          severity: IDS.OPTIONS.UPCADMIN_SEVERITY.MEDIUM,
          originalValue: pmRecord.getCellValueAsString(IDS.PM.DESCRIPTION),
          notes: makeNote([
            `Description drift detected.`,
            `SPD SKU: ${spdSku}`,
            `SPD Description: ${spdRecord.getCellValueAsString(IDS.SPD.DESCRIPTION)}`,
            `PM Description: ${pmRecord.getCellValueAsString(IDS.PM.DESCRIPTION)}`,
          ]),
        });
        queueSystemLog({
          eventType: IDS.OPTIONS.SYSTEMLOGS_EVENT.DESCRIPTION_DRIFT,
          severity: IDS.OPTIONS.SYSTEMLOGS_SEVERITY.MEDIUM,
          status: IDS.OPTIONS.SYSTEMLOGS_STATUS.OPEN,
          notes: `MISMATCH_FLAGGED | Field: Description | SPD SKU: ${spdSku}`,
        });
      }
    }

    // 10. Status mismatch (flag only)
    if (SETTINGS.FLAG_STATUS_MISMATCH) {
      const spdStatus = normalizeText(spdRecord.getCellValueAsString(IDS.SPD.STATUS));
      const pmStatus = normalizeText(pmRecord.getCellValueAsString(IDS.PM.STATUS));
      const expectedPmStatus = spdStatus ? IDS.OPTIONS.PM_STATUS_BY_SPD[spdStatus] : null;
      if (expectedPmStatus && pmStatus && expectedPmStatus !== pmStatus) {
        stats.flagged += 1;
        queueAnomaly({
          pmId,
          issueType: IDS.OPTIONS.UPCADMIN_ERROR_TYPE.STOCK_LOGIC_ERROR,
          severity: IDS.OPTIONS.UPCADMIN_SEVERITY.HIGH,
          originalValue: pmStatus,
          notes: `Status mismatch. SPD status='${spdStatus}' expects PM status='${expectedPmStatus}', current PM='${pmStatus}'. SPD SKU=${spdSku}`,
        });
        queueSystemLog({
          eventType: IDS.OPTIONS.SYSTEMLOGS_EVENT.STOCK_LOGIC_ERROR,
          severity: IDS.OPTIONS.SYSTEMLOGS_SEVERITY.HIGH,
          status: IDS.OPTIONS.SYSTEMLOGS_STATUS.OPEN,
          notes: `MISMATCH_FLAGGED | Field: Status | SPD SKU: ${spdSku} | SPD='${spdStatus}' | PM='${pmStatus}' | Expected PM='${expectedPmStatus}'`,
        });
      }
    }
  }

  const pmUpdates = [...pmUpdatesById.entries()].map(([id, fields]) => ({ id, fields }));

  output.markdown(`## Summary`);
  output.table([
    { Metric: 'Processed SPD records', Value: stats.processed },
    { Metric: 'Matches', Value: stats.matches },
    { Metric: 'Auto-append', Value: stats.autoAppend },
    { Metric: 'Auto-fix invalid', Value: stats.autoFix },
    { Metric: 'Flagged mismatches', Value: stats.flagged },
    { Metric: 'Structural alerts', Value: stats.structural },
    { Metric: 'Skipped (no source value)', Value: stats.skipped },
    { Metric: 'Queued PM updates', Value: pmUpdates.length },
    { Metric: 'Queued UPCAdmin records', Value: upcadminPayloads.length },
    { Metric: 'Queued SystemLogs records', Value: systemLogPayloads.length },
  ]);

  if (SETTINGS.DRY_RUN) {
    output.markdown(`### Dry run only`);
    output.markdown(`No records were written. Set \`DRY_RUN\` to \`false\` to execute writes.`);
    return;
  }

  if (SETTINGS.UPDATE_RECORDS && pmUpdates.length > 0) {
    for (const batch of chunk(pmUpdates, 50)) {
      await pmTable.updateRecordsAsync(batch);
    }
    stats.updatedPmRecords = pmUpdates.length;
  }

  if (SETTINGS.CREATE_UPCADMIN && upcadminPayloads.length > 0) {
    for (const batch of chunk(upcadminPayloads, 50)) {
      const created = await upcAdminTable.createRecordsAsync(batch);
      stats.upcadminCreated += created.length;
    }
  }

  if (SETTINGS.CREATE_SYSTEMLOGS && systemLogPayloads.length > 0) {
    for (const batch of chunk(systemLogPayloads, 50)) {
      const created = await systemLogsTable.createRecordsAsync(batch);
      stats.systemlogsCreated += created.length;
    }
  }

  output.markdown(`### Write complete`);
  output.table([
    { Metric: 'Updated PM records', Value: stats.updatedPmRecords },
    { Metric: 'Created UPCAdmin records', Value: stats.upcadminCreated },
    { Metric: 'Created SystemLogs records', Value: stats.systemlogsCreated },
  ]);
}

await main();