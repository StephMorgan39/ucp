/**
 * ═════════════════════════════════════════════════════════════════════════════════
 * SCRIPT 2A — TRANSITION COMPLETION v1.6 (REFACTORED)
 * ═════════════════════════════════════════════════════════════════════════════════
 * 
 * REFACTORING CHANGES:
 *   ✅ Centralized CONFIG object with all table and field IDs
 *   ✅ All PM_*, LEGACY_*, LOG_* constants moved into CONFIG
 *   ✅ Standardized field naming and structure
 *   ✅ Consistent with other scripts (0, 0A, 0B, 1, 2B)
 *   ✅ Preserved DRY_RUN mode for safe testing
 * 
 * PURPOSE:
 *   Completes the transition from legacy product codes (.Z) to new codes (.B).
 *   Archives .Z-linked records when .B-flagged products become active.
 *   Updates ProductMaster route from "B" to "ACTIVE" and clears transition link.
 * 
 * EXECUTION MODEL:
 *   • User-triggered via Scripts sidebar (Extension mode)
 *   • Requires explicit confirmation before writing
 *   • Supports DRY_RUN mode for validation without commits
 * 
 * ═════════════════════════════════════════════════════════════════════════════════
 */

// ───────────────────────────────────────────────────────────────────────────────
// CONFIG — Centralized schema for all table and field IDs
// ───────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  scriptName: "Script 2A",
  scriptVersion: "1.6",
  scriptPurpose: "Transition Completion — completes legacy to new code transition",

  config: {
    dryRun: false,
    archiveReasonValue: "Discontinued",
  },

  tables: {
    pm: "tblgLqMMXX2HcKt9U",           // ProductMaster
    legacy: "tbl8c8q0Bd33XCJCG",      // Legacy SKU Archive
    systemLogs: "tblk1v5VHPEC2c2u2",  // System Logs
  },

  fields: {
    pm: {
      route: "fldSZsiBxKNTHPFel",             // Route (singleSelect: B/ACTIVE/etc)
      skuMaster: "fldMfK3uyPnDbKONn",        // SKU Master
      status: "flddq6S7409EBM71D",           // Status (singleSelect)
      spdLink: "fldxZcpnCCCYW5zHx",          // SPD Link
      transitionLink: "fldvqYzX3ZVB1UsRi",  // Transition Link (to legacy .Z records)
      supplier: "fld7IgWNjMiZM1Zat",        // Supplier link
      description: "fld7hdhxyu61r5Olm",     // Description
    },
    legacy: {
      sku: "fldNnAnBbeXqNparf",             // Archived SKU
      description: "fld5OyyRL839QrVLD",     // Description
      reason: "fldwxQevsg4gKlcvm",          // Archive Reason (singleSelect)
      date: "fldj4tGbObMFqeQCF",            // Archive Date
      dataDump: "fldmMsY9JCwgcUSIf",        // JSON Data Dump (long text)
      supplier: "fldPxh7RCLRAKYd1A",        // Supplier link
    },
    systemLogs: {
      notes: "fld4l6AJhVNRzIaY8",           // Notes
      systemEvent: "flda8oHUThBc1Kb7I",    // System Event type
      severity: "fldPdoc6JPYHV9gpb",       // Severity (singleSelect)
      status: "fldog9l4DwJeE5Qj8",         // Log Status (singleSelect: 'Logged')
    },
  },
};

// ───────────────────────────────────────────────────────────────────────────────
// HELPERS
// ───────────────────────────────────────────────────────────────────────────────

const log = (msg) => {
  try {
    output.markdown(msg);
  } catch (_) {}
  console.log(
    String(msg)
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/#+\s/g, "")
  );
};

const chunk = (arr, n) => {
  const o = [];
  for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n));
  return o;
};

const normStatus = (val) => String(val || "").trim().toLowerCase();

function getStringValue(record, fieldId) {
  const val = record?.getCellValue(fieldId);
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (Array.isArray(val)) {
    if (!val.length) return "";
    const first = val[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      if ("name" in first) return String(first.name ?? "");
      if ("id" in first) return String(first.id ?? "");
    }
    return "";
  }
  if (typeof val === "object" && "name" in val) return String(val.name ?? "");
  return String(val);
}

async function logBatchError(sysLogTable, notes) {
  try {
    await sysLogTable.createRecordsAsync([
      {
        fields: {
          [CONFIG.fields.systemLogs.notes]: notes,
          [CONFIG.fields.systemLogs.systemEvent]: { name: "System_Event" },
          [CONFIG.fields.systemLogs.severity]: { name: "High" },
          [CONFIG.fields.systemLogs.status]: { name: "Logged" },
        },
      },
    ]);
  } catch (err) {
    console.error("Failed to log batch error:", err.message);
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// MAIN EXECUTION
// ───────────────────────────────────────────────────────────────────────────────

async function main() {
  log("# Script 2A — Transition Completion v1.6");
  if (CONFIG.config.dryRun) log("> DRY RUN MODE");

  const F = CONFIG.fields;
  const T = CONFIG.tables;

  const pmTable = base.getTable(T.pm);
  const legacyTable = base.getTable(T.legacy);
  const sysLogTable = base.getTable(T.systemLogs);

  try {
    // ── Step 1: Validate archive reason option ────────────────────────────────
    log("## Step 1 — Validating archive reason option...");

    const reasonField = legacyTable.getField(F.legacy.reason);
    const validReasons = reasonField.options.choices.map((c) => c.name);

    if (!validReasons.includes(CONFIG.config.archiveReasonValue)) {
      log(
        `❌ ARCHIVE_REASON_VALUE "${CONFIG.config.archiveReasonValue}" is not a valid option.`
      );
      log(`Valid options: ${validReasons.join(", ")}`);
      return;
    }
    log(
      `✅ Archive reason validated: "${CONFIG.config.archiveReasonValue}"`
    );

    // ── Step 2: Load B-flagged PM records ──────────────────────────────────────
    log("## Step 2 — Loading B-suffix ProductMaster records...");

    const pmQ = await pmTable.selectRecordsAsync({
      fields: [
        F.pm.route,
        F.pm.skuMaster,
        F.pm.status,
        F.pm.transitionLink,
        F.pm.supplier,
        F.pm.description,
        F.pm.spdLink,
      ],
    });

    const allFlagged = pmQ.records.filter((r) => {
      const route = getStringValue(r, F.pm.route).trim().toUpperCase();
      return route === "B" || route.includes("(B)") || route === "NEW CODE (B)";
    });

    log(`Found ${allFlagged.length} B-suffix records.`);

    // ── Step 3: Pre-flight validation ──────────────────────────────────────────
    log("## Step 3 — Pre-flight validation...");

    const validRecords = [];
    const rejectedRecords = [];

    for (const rec of allFlagged) {
      const skuMaster = rec
        .getCellValue(F.pm.skuMaster)
        ? getStringValue(rec, F.pm.skuMaster)
        : ""
        .trim()
        .toUpperCase();
      if (skuMaster.endsWith("Z") || skuMaster.endsWith(".Z")) {
        rejectedRecords.push({
          rec,
          reason:
            "SKU ends in Z — this is a legacy record. Flag the .B record instead.",
        });
      } else {
        validRecords.push(rec);
      }
    }

    if (rejectedRecords.length > 0) {
      log(`⚠️ ${rejectedRecords.length} rejected (Z-suffix on B-flagged record):`);
      rejectedRecords.forEach((r) =>
        log(
          `  - ${getStringValue(r.rec, F.pm.skuMaster)}: ${r.reason}`
        )
      );
    }

    if (validRecords.length === 0) {
      log("❌ No valid records to process.");
      return;
    }
    log(`✅ ${validRecords.length} valid record(s) ready for transition.`);

    // ── Step 4: Load linked Z records ──────────────────────────────────────────
    const linkedIds = new Set();
    for (const rec of validRecords) {
      const links = rec.getCellValue(F.pm.transitionLink) || [];
      links.forEach((l) => linkedIds.add(l.id));
    }

    const legacyMap = {};
    if (linkedIds.size > 0) {
      const legacyQ = await pmTable.selectRecordsAsync({
        fields: [
          F.pm.skuMaster,
          F.pm.status,
          F.pm.description,
          F.pm.supplier,
        ],
      });
      for (const rec of legacyQ.records) {
        if (linkedIds.has(rec.id)) legacyMap[rec.id] = rec;
      }
    }
    log(
      `✅ Loaded ${Object.keys(legacyMap).length} linked legacy records.`
    );

    // ── Step 5: Confirm ───────────────────────────────────────────────────────
    const confirm = await input.buttonsAsync(
      `Archive ${linkedIds.size} .Z SKUs and transition ${validRecords.length} active records?`,
      [
        { label: "✅ Confirm", variant: "primary" },
        { label: "❌ Cancel", variant: "danger" },
      ]
    );
    if (confirm !== "✅ Confirm") {
      log("❌ Cancelled.");
      return;
    }

    // ── Step 6: Execute transitions ───────────────────────────────────────────
    log("## Step 4 — Executing transitions...");

    const pmUpdates = [];
    const legacyCreates = [];
    const sysLogCreates = [];
    let countArchived = 0;
    let countTransitioned = 0;
    let countErrors = 0;

    for (const activeRec of validRecords) {
      try {
        const skuMaster = activeRec
          .getCellValue(F.pm.skuMaster)
          ? getStringValue(activeRec, F.pm.skuMaster)
          : ""
          .trim();
        const linkedLegacy = activeRec.getCellValue(F.pm.transitionLink) || [];

        for (const link of linkedLegacy) {
          const legRec = legacyMap[link.id];
          if (!legRec) {
            sysLogCreates.push({
              fields: {
                [F.systemLogs.notes]: `Linked record ${link.id} not found for ${skuMaster}`,
                [F.systemLogs.systemEvent]: { name: "System_Event" },
                [F.systemLogs.severity]: { name: "High" },
                [F.systemLogs.status]: { name: "Logged" },
              },
            });
            continue;
          }

          const legSku = legRec
            .getCellValue(F.pm.skuMaster)
            ? getStringValue(legRec, F.pm.skuMaster)
            : ""
            .trim();
          const legDesc = getStringValue(legRec, F.pm.description).trim();
          const legSupplier = legRec.getCellValue(F.pm.supplier) || [];

          const dataDump = JSON.stringify(
            {
              archived_at: new Date().toISOString(),
              legacy_sku: legSku,
              transitioned_to: skuMaster,
              status_at_archive: getStringValue(legRec, F.pm.status),
            },
            null,
            2
          );

          const legacyFields = {
            [F.legacy.sku]: legSku,
            [F.legacy.description]:
              legDesc || "(no description)",
            [F.legacy.reason]: { name: CONFIG.config.archiveReasonValue },
            [F.legacy.date]: new Date()
              .toISOString()
              .split("T")[0],
            [F.legacy.dataDump]: dataDump,
          };
          if (legSupplier.length > 0) {
            legacyFields[F.legacy.supplier] = [
              { id: legSupplier[0].id },
            ];
          }
          legacyCreates.push({ fields: legacyFields });

          // Mark legacy record as Discontinued in PM
          pmUpdates.push({
            id: legRec.id,
            fields: { [F.pm.status]: { name: "Discontinued" } },
          });
          countArchived++;
        }

        // Update active record: route →ACTIVE, clear transition link
        pmUpdates.push({
          id: activeRec.id,
          fields: {
            [F.pm.route]: { name: "ACTIVE" },
            [F.pm.transitionLink]: [],
          },
        });
        countTransitioned++;
      } catch (err) {
        countErrors++;
        sysLogCreates.push({
          fields: {
            [F.systemLogs.notes]: `Transition error for ${getStringValue(
              activeRec,
              F.pm.skuMaster,
            )}: ${err.message}`,
            [F.systemLogs.systemEvent]: { name: "System_Event" },
            [F.systemLogs.severity]: { name: "High" },
            [F.systemLogs.status]: { name: "Logged" },
          },
        });
      }
    }

    // ── Step 7: Commit writes ─────────────────────────────────────────────────
    if (!CONFIG.config.dryRun) {
      log("## Step 5 — Writing to Airtable...");
      if (legacyCreates.length) {
        for (const batch of chunk(legacyCreates, 50)) {
          try {
            await legacyTable.createRecordsAsync(batch);
          } catch (err) {
            await logBatchError(
              sysLogTable,
              `Script 2A failed creating legacy batch: ${err.message}`,
            );
            throw err;
          }
        }
      }
      if (pmUpdates.length) {
        for (const batch of chunk(pmUpdates, 50)) {
          try {
            await pmTable.updateRecordsAsync(batch);
          } catch (err) {
            await logBatchError(
              sysLogTable,
              `Script 2A failed updating PM batch: ${err.message}`,
            );
            throw err;
          }
        }
      }
      if (sysLogCreates.length) {
        for (const batch of chunk(sysLogCreates, 50)) {
          try {
            await sysLogTable.createRecordsAsync(batch);
          } catch (err) {
            console.error("Failed writing SystemLogs batch:", err.message);
          }
        }
      }
    }

    // ── Step 8: Summary ───────────────────────────────────────────────────────
    log("---");
    log("## Script 2A Complete");
    log(`Records processed: ${validRecords.length}`);
    log(`Rejected (pre-flight): ${rejectedRecords.length}`);
    log(`.Z SKUs archived: ${countArchived}`);
    log(`Active records transitioned: ${countTransitioned}`);
    log(`Errors: ${countErrors}`);
    if (CONFIG.config.dryRun) log("> DRY RUN — no data was written.");
  } catch (err) {
    log(`## ❌ UNHANDLED ERROR: ${err.message}`);
    console.error(err.stack);
  }
}

await main();
