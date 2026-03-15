// =============================================================
// SCRIPT 2 — TRANSITION COMPLETION (SKU Suffix Drop) v1.3
// Utile PIM | Base: appefUQrLFZYN4Y5t
// Schema verified against live metadata: 2026-03-02
// =============================================================
// CHANGELOG v1.2 (2026-03-03):
//   FIX 1 — Archive Reason select crash:
//            Was using "SKU_Transition" (invalid). Now uses ARCHIVE_REASON_VALUE
//            config constant — set this to match an existing option in your
//            LegacyCodes.Archive Reason field before running.
//   FIX 2 — .Z record guard:
//            Script now detects if a flagged record IS a .Z (legacy) record
//            and rejects it with a clear warning before any writes happen.
//            Only .B records (or records explicitly overriding via ALLOW_NO_SUFFIX)
//            should be flagged for migration.
//   FIX 3 — DRY_RUN now defaults to TRUE for safety.
//            Set to false only when you are ready to commit.
//
// WHAT THIS SCRIPT DOES:
//   Processes ProductMaster records where Product_Route = "B" (or contains "(B)").
//   No manual flag required — the B suffix on Product_Route IS the trigger.
//   Expected input: the NEW (.B) active SKU record, with Transition_Linked_SKU
//   pointing to the OLD (.Z) legacy record.
//
//   v1.3 CHANGE: Removed Manual Flag For Migration (phantom field fldpoE4p3L8V6P4oi).
//   Trigger is now Product_Route field (fldSZsiBxKNTHPFel) containing "B".
//   This is zero-human-touch — B suffix is set automatically by Script 0A.
//
//   For each valid flagged record:
//     1. Validate: reject if SKU ends in Z (wrong record flagged)
//     2. Find the linked .Z record via Transition_Linked_SKU
//     3. Snapshot .Z record → LegacyCodes (archival vault)
//     4. Set .Z Product_Status → "Discontinued"
//     5. Clear flag on .Z record
//     6. Drop suffix from active SKU (e.g. "1630408402B" → "1630408402")
//     7. Unlink Transition_Linked_SKU on active record
//     8. Clear flag on active record
//     9. Log all actions to MigrationLog
//
// FORMULA FIELDS — NEVER WRITE:
//   ProductMaster.Product Sku         (fldmvzTtvWLaKetZZ) — formula
//   ProductMaster.Trigger Suffix Drop (fldAaadyMsI2DVCK0) — formula
//   ProductMaster.sku_valid_base      (fldMWtt1paUu45N6W) — formula
//   ProductMaster.sku_colour_seq      (fldPj5jAysHDiJlKK) — formula
// =============================================================

// =============================================================
// ⚙️  OPERATOR CONFIG — check these before every run
// =============================================================

// Safety: preview mode. Set false only when ready to commit.
const DRY_RUN = true;

// IMPORTANT: Set this to an EXACT existing option name in LegacyCodes.Archive Reason
// Check your LegacyCodes table → Archive Reason field → existing options.
// Common values: "Discontinued", "Superseded", "SKU Transition", "End of Range"
// If unsure, run DRY_RUN = true first, then check LegacyCodes manually.
const ARCHIVE_REASON_VALUE = "DISCONTINUED"; // ← SET THIS to an exact option name from LegacyCodes.Archive Reason
    // IMPORTANT: Must match EXACTLY (case-sensitive). Common values: "Discontinued", "Superseded", "SKU Transition"

// =============================================================

async function main() {

    const pmTable      = base.getTable("tblgLqMMXX2HcKt9U");    // tblgLqMMXX2HcKt9U
    const legacyTable  = base.getTable("tbl8c8q0Bd33XCJCG");      // tbl8c8q0Bd33XCJCG
    const migrationLog = base.getTable("tblfKxRNNBARWenHZ");     // tblfKxRNNBARWenHZ
    const adminLogs    = base.getTable("tblk1v5VHPEC2c2u2");       // tblk1v5VHPEC2c2u2

    const legacyField = legacyTable.getField('Archive Reason'); // FIX: was legacyCodesTable (undefined) — variable is legacyTable
    const validOptions = legacyField.options.choices.map(c => c.name);
    const matchedOption = validOptions.find(o => o.toLowerCase() === ARCHIVE_REASON_VALUE.toLowerCase());
    if (!matchedOption) {
        throw new Error(
            `Invalid ARCHIVE_REASON_VALUE: "${ARCHIVE_REASON_VALUE}"\n` +
            `Valid options are: ${validOptions.join(", ")}//Update the ARCHIVE_REASON_VALUE constant at the top of the script to one of these exact values.`
        );
    }
    // FIX: use the case-correct matched value going forward, not the raw constant
    const ARCHIVE_REASON_EXACT = matchedOption;

    output.markdown("# 🔄 Script 2 — Transition Completion v1.2");
    output.markdown(`> Running at: \`${new Date().toLocaleString()}\``);
    if (DRY_RUN) output.markdown("> ⚠️ **DRY RUN MODE** — no records will be written.");
    output.markdown("---");

    // ============================================================
    // STEP 1 — Load flagged ProductMaster records
    // ============================================================
    output.markdown("## Step 1 — Loading flagged ProductMaster records...");

    const pmQuery = await pmTable.selectRecordsAsync({
        fields: [
            "fldSZsiBxKNTHPFel", // Product_Route (singleSelect) — trigger field: look for "B"
            "fldMfK3uyPnDbKONn", // Product SKU Master (singleLineText — WRITABLE)
            "fldmvzTtvWLaKetZZ", // Product Sku (formula — READ ONLY)
            "flddq6S7409EBM71D", // Product Status (singleSelect)
            "fldvqYzX3ZVB1UsRi", // Transition Linked SKU (multipleRecordLinks → ProductMaster)
            "fld7IgWNjMiZM1Zat", // Supplier (multipleRecordLinks → Supplier)
            "fld7hdhxyu61r5Olm", // Product Description (multilineText)
            "fldxZcpnCCCYW5zHx", // Supplier Product Data (multipleRecordLinks → SPD)
            "fldyrCQE5L3lQktS3", // UPCBodyClass
            "fldU1VARr6kM7sihI", // UPC BodyFinish
            "fld5wEWzTjID4sIAE", // UPCProductLookFinish
            "fldMjjmaeriqqcxiS", // UPCDesignStyle
            "fldDBJifgrvsMqR9g", // UPCColourMaster
            "fldMWdeUtUF8Hgst9", // UPC UnitofMeasure
        ]
    });

    // v1.3: Trigger = Product_Route contains "B" — set by Script 0A automatically. No manual flag.
    const allFlagged = pmQuery.records.filter(r => {
        const route = r.getCellValueAsString("fldSZsiBxKNTHPFel").trim().toUpperCase();
        return route === "B" || route.includes("(B)");
    });

    output.markdown(`Found **${allFlagged.length}** B-suffix records pending transition. Running pre-flight validation...`);
    output.markdown("---");

    // ============================================================
    // PRE-FLIGHT: Separate valid (.B) from invalid (.Z / no suffix)
    // ============================================================
    const validRecords   = [];
    const rejectedRecords = [];

    for (const rec of allFlagged) {
        const skuMaster  = rec.getCellValueAsString("fldMfK3uyPnDbKONn").trim();
        const skuDisplay = rec.getCellValueAsString("fldmvzTtvWLaKetZZ") || skuMaster;
        const upperSKU   = skuMaster.toUpperCase();

        if (upperSKU.endsWith("Z") || upperSKU.endsWith(".Z")) {
            // This is a legacy record — should NOT be flagged
            rejectedRecords.push({ rec, skuDisplay, reason: "SKU ends in Z — this is a legacy record. Unflag it and flag the corresponding .B record instead." });
        } else if (!upperSKU.endsWith("B") && !upperSKU.endsWith(".B")) {
            // No recognised suffix — warn but allow if it has a linked .Z
            const links = rec.getCellValue("fldvqYzX3ZVB1UsRi") || [];
            if (links.length === 0) {
                rejectedRecords.push({ rec, skuDisplay, reason: "No .B suffix and no Transition_Linked_SKU — nothing to do. Unflag this record." });
            } else {
                // Has links but no suffix — will archive linked records but skip suffix drop
                validRecords.push(rec);
            }
        } else {
            validRecords.push(rec);
        }
    }

    // Report rejections
    if (rejectedRecords.length > 0) {
        output.markdown("## ⚠️ Pre-flight Rejections");
        output.markdown("The following records are **flagged incorrectly** and will be **skipped**:");
        for (const { skuDisplay, reason } of rejectedRecords) {
            output.markdown(`- **${skuDisplay}**: ${reason}`);
        }
        output.markdown("---");
        output.markdown //("**Action required:** Check these ProductMaster records — if they have a .B suffix on their SKU but Product_Route is not "B", Script 0A may need to be re-run.");
    }

    if (validRecords.length === 0) {
        output.markdown("## ❌ No valid records to process after pre-flight check.");
        output.markdown("Fix the flagged records above and re-run.");
        return;
    }

    output.markdown(`## ✅ ${validRecords.length} valid record(s) will be processed.`);

    // Preview valid records
    const previewRows = validRecords.map(r => {
        const sku = r.getCellValueAsString("fldmvzTtvWLaKetZZ") || r.getCellValueAsString("fldMfK3uyPnDbKONn");
        const links = r.getCellValue("fldvqYzX3ZVB1UsRi") || [];
        return `| ${sku} | ${links.length} linked .Z SKU(s) |`;
    }).join("\n");
    output.markdown("| Active SKU (.B) | Transition Links |\n|---|---|\n" + previewRows);

    // ============================================================
    // STEP 2 — Load linked .Z records
    // ============================================================
    output.markdown("---");
    output.markdown("## Step 2 — Loading linked legacy (.Z) records...");

    const linkedIds = new Set();
    for (const rec of validRecords) {
        const links = rec.getCellValue("fldvqYzX3ZVB1UsRi") || [];
        links.forEach(l => linkedIds.add(l.id));
    }

    const legacyMap = {};
    if (linkedIds.size > 0) {
        const legacyQuery = await pmTable.selectRecordsAsync({
            fields: [
                "fldMfK3uyPnDbKONn", // Product SKU Master
                "fldmvzTtvWLaKetZZ", // Product Sku (formula)
                "flddq6S7409EBM71D", // Product Status
                "fldSZsiBxKNTHPFel", // Product_Route
                "fld7hdhxyu61r5Olm", // Product Description
                "fld7IgWNjMiZM1Zat", // Supplier
                "fldyrCQE5L3lQktS3", // UPCBodyClass
                "fldU1VARr6kM7sihI", // UPC BodyFinish
                "fld5wEWzTjID4sIAE", // UPCProductLookFinish
                "fldMjjmaeriqqcxiS", // UPCDesignStyle
                "fldDBJifgrvsMqR9g", // UPCColourMaster
            ]
        });
        for (const rec of legacyQuery.records) {
            if (linkedIds.has(rec.id)) legacyMap[rec.id] = rec;
        }
        output.markdown(`✅ Loaded **${Object.keys(legacyMap).length}** linked legacy records.`);
    } else {
        output.markdown("ℹ️ No linked .Z records found — will only perform suffix drops.");
    }

    // ============================================================
    // STEP 3 — Confirm
    // ============================================================
    output.markdown("---");
    output.markdown("## Step 3 — Confirmation");
    output.markdown(
        `This will:\n` +
        `- Archive **${linkedIds.size}** .Z SKU(s) → LegacyCodes (Archive Reason: "${ARCHIVE_REASON_VALUE}")\n` +
        `- Set .Z Product_Status → Discontinued\n` +
        `- Drop suffix from **${validRecords.length}** active SKU(s)\n` +
        `- Unlink Transition_Linked_SKU arrays\n` +
        `- Route already clears automatically when suffix is dropped\n` +
        `- Write MigrationLog entries`
    );

    if (rejectedRecords.length > 0) {
        output.markdown(`> ⚠️ **${rejectedRecords.length} record(s) will be skipped** (see pre-flight warnings above).`);
    }

    if (!DRY_RUN) {
        const confirm = await input.buttonsAsync("Proceed?", [
            { label: "✅ Yes, execute transition", value: "yes", variant: "primary" },
            { label: "❌ Cancel",                  value: "no",  variant: "default" },
        ]);
        if (confirm !== "yes") {
            output.markdown("❌ Cancelled. No records changed.");
            return;
        }
    } else {
        output.markdown("⚠️ DRY RUN — stopping here. Set `DRY_RUN = false` to execute.");
        return;
    }

    // ============================================================
    // STEP 4 — Execute transitions
    // ============================================================
    output.markdown("---");
    output.markdown("## Step 4 — Executing...");

    const chunk = (arr, n) => {
        const out = [];
        for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
        return out;
    };

    const pmUpdates       = [];
    const legacyCreates   = [];
    const migLogCreates   = [];
    const adminLogCreates = [];
    let countArchived = 0, countDropped = 0, countFailed = 0;

    for (const activeRec of validRecords) {
        const skuMaster  = activeRec.getCellValueAsString("fldMfK3uyPnDbKONn").trim();
        const skuDisplay = activeRec.getCellValueAsString("fldmvzTtvWLaKetZZ") || skuMaster;
        const linkedLegacy = activeRec.getCellValue("fldvqYzX3ZVB1UsRi") || [];

        try {
            // 4a — Archive each linked .Z record
            for (const link of linkedLegacy) {
                const legRec = legacyMap[link.id];
                if (!legRec) {
                    adminLogCreates.push({ fields: {
                        "fld4l6AJhVNRzIaY8": `Script 2 — Linked record ${link.id} not found for active SKU ${skuDisplay}`,
                        "flda8oHUThBc1Kb7I": { name: "Missing_Data" },
                        "fldPdoc6JPYHV9gpb": { name: "High" },
                        "fldog9l4DwJeE5Qj8": { name: "Under_Review" },
                        "fldILG5KBZqYIZx2v": skuDisplay.substring(0, 200),
                    }});
                    continue;
                }

                const legSKU  = legRec.getCellValueAsString("fldmvzTtvWLaKetZZ") || legRec.getCellValueAsString("fldMfK3uyPnDbKONn");
                const legDesc = legRec.getCellValueAsString("fld7hdhxyu61r5Olm");
                const legSupplier = legRec.getCellValue("fld7IgWNjMiZM1Zat") || [];

                const dataDump = JSON.stringify({
                    archived_at: new Date().toISOString(),
                    legacy_sku: legSKU,
                    transitioned_to: skuDisplay,
                    status_at_archive: legRec.getCellValueAsString("flddq6S7409EBM71D"),
                    upc_body_class:    (legRec.getCellValue("fldyrCQE5L3lQktS3") || []).map(l => l.id),
                    upc_body_finish:   (legRec.getCellValue("fldU1VARr6kM7sihI") || []).map(l => l.id),
                    upc_look_finish:   (legRec.getCellValue("fld5wEWzTjID4sIAE") || []).map(l => l.id),
                    upc_design_style:  (legRec.getCellValue("fldMjjmaeriqqcxiS") || []).map(l => l.id),
                    upc_colour_master: (legRec.getCellValue("fldDBJifgrvsMqR9g") || []).map(l => l.id),
                }, null, 2);

                const legacyFields = {
                    "fldNnAnBbeXqNparf": legSKU,
                    "fld5OyyRL839QrVLD": legDesc || "(no description)",
                    "fldwxQevsg4gKlcvm": { name: ARCHIVE_REASON_EXACT }, // FIX: uses case-validated value not raw constant
                    "fldj4tGbObMFqeQCF": new Date().toISOString().split("T")[0],
                    "fldmMsY9JCwgcUSIf": dataDump,
                };
                if (legSupplier.length > 0) {
                    legacyFields["fldPxh7RCLRAKYd1A"] = [{ id: legSupplier[0].id }];
                }

                legacyCreates.push({ fields: legacyFields });
                countArchived++;

                // Set .Z → Discontinued, clear its flag
                pmUpdates.push({ id: legRec.id, fields: {
                    "flddq6S7409EBM71D": { name: "Discontinued" },
                    // Route cleared — active record becomes clean (no suffix)
                }});

                migLogCreates.push({ fields: {
                    // FIX: fldZgvJg5zccvcdkz does not exist in MigrationLog schema.
                    // SKU reference moved into Reason field (fldpjl58SimvzBrqI) which is multilineText.
                    "fldBWO6UlXQwGQiB7": { name: "Archive_Legacy" },
                    "fldTJiURPYzL4htPK": { name: "ProductMaster" },
                    "fldpjl58SimvzBrqI": `SKU: ${legSKU} | Archived .Z SKU → LegacyCodes. Active SKU: ${skuDisplay}`,
                }});
            }

            // 4b — Drop suffix from active SKU
            let newSKU = skuMaster;
            const upper = skuMaster.toUpperCase();
            if (upper.endsWith(".B")) {
                newSKU = skuMaster.slice(0, -2);
            } else if (upper.endsWith("B")) {
                newSKU = skuMaster.slice(0, -1);
            }
            // If no suffix, newSKU stays as-is (no-op on the SKU value)

            // 4c — Update active record
            pmUpdates.push({ id: activeRec.id, fields: {
                "fldSZsiBxKNTHPFel": { name: "ACTIVE" },   // Change Route to ACTIVE (No suffix)
                "fldvqYzX3ZVB1UsRi": [],        // Unlink Transition_Linked_SKU
            }});
            countDropped++;

            migLogCreates.push({ fields: {
                // FIX: fldZgvJg5zccvcdkz removed — not in schema. SKU captured in Reason field.
                "fldBWO6UlXQwGQiB7": { name: "Updated" },
                "fldTJiURPYzL4htPK": { name: "ProductMaster" },
                "fldpjl58SimvzBrqI": `SKU: ${newSKU} | Transition Complete: Route changed to ACTIVE. Suffix dropped via formula.`,
            }});

        } catch(e) {
            countFailed++;
            adminLogCreates.push({ fields: {
                "fld4l6AJhVNRzIaY8": `Script 2 error on SKU ${skuDisplay}: ${e.message}`,
                "flda8oHUThBc1Kb7I": { name: "Missing_Data" },
                "fldPdoc6JPYHV9gpb": { name: "High" },
                "fldog9l4DwJeE5Qj8": { name: "Under_Review" },
                "fldILG5KBZqYIZx2v": skuDisplay.substring(0, 200),
            }});
        }
    }

    // ============================================================
    // STEP 5 — Write batches
    // ============================================================
    output.markdown("---");
    output.markdown("## Step 5 — Writing...");

    try {
        if (legacyCreates.length > 0) {
            output.markdown(`Creating ${legacyCreates.length} LegacyCodes records...`);
            for (const batch of chunk(legacyCreates, 50)) {
                await legacyTable.createRecordsAsync(batch);
            }
            output.markdown("✅ LegacyCodes done.");
        }

        if (pmUpdates.length > 0) {
            output.markdown(`Updating ${pmUpdates.length} ProductMaster records...`);
            for (const batch of chunk(pmUpdates, 50)) {
                await pmTable.updateRecordsAsync(batch);
            }
            output.markdown("✅ ProductMaster done.");
        }

        if (migLogCreates.length > 0) {
            output.markdown(`Writing ${migLogCreates.length} MigrationLog entries...`);
            for (const batch of chunk(migLogCreates, 50)) {
                await migrationLog.createRecordsAsync(batch);
            }
            output.markdown("✅ MigrationLog done.");
        }

        if (adminLogCreates.length > 0) {
            for (const batch of chunk(adminLogCreates, 50)) {
                await adminLogs.createRecordsAsync(batch);
            }
            output.markdown(`✅ ${adminLogCreates.length} AdminLog warnings written.`);
        }

    } catch(e) {
        output.markdown("❌ **Write error:** " + e.message);
        try {
            await adminLogs.createRecordsAsync([{ fields: {
                "fld4l6AJhVNRzIaY8": "Script 2 WRITE ERROR: " + e.message,
            }}]);
        } catch(logErr) {
            output.markdown("⚠️ Could not write to Admin Logs: " + logErr.message);
        }
        return;
    }

    // ============================================================
    // STEP 6 — Summary
    // ============================================================
    output.markdown("---");
    output.markdown("## ✅ Transition Complete");
    output.markdown(
        "| Metric | Count |\n|--------|-------|\n" +
        `| Valid records processed        | ${validRecords.length}   |\n` +
        `| Records rejected (pre-flight)  | ${rejectedRecords.length} |\n` +
        `| .Z SKUs archived → LegacyCodes | ${countArchived}         |\n` +
        `| Suffix drops executed          | ${countDropped}          |\n` +
        `| Errors logged                  | ${countFailed}           |`
    );
}

await main();
