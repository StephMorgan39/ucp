// 1. SETUP
output.markdown("# 🔗 Base Relationship & Lineage Map");

const allTables = base.tables;
let connectionData = [];

// 2. PROCESSING LOOP
for (let table of allTables) {
  for (let field of table.fields) {
    let connection = {
      "Source Table": table.name,
      "Field Name": field.name,
      "Connection Type": "—",
      "Target Table": "—",
    };

    const opts = field.options;

    if (field.type === "multipleRecordLinks") {
      try {
        const targetTable = base.getTable(opts?.linkedTableId);
        const cardinality =
          opts &&
          "prefersSingleRecordLink" in opts &&
          opts.prefersSingleRecordLink
            ? "1:1"
            : "1:Many";
        connection["Target Table"] = targetTable.name;
        connection["Connection Type"] = `Link (${cardinality})`;
        connectionData.push(connection);
      } catch (e) {
        /* Orphaned link */
      }
    } else if (
      field.type === "multipleLookupValues" ||
      field.type === "rollup"
    ) {
      try {
        const linkField = table.getField(opts?.recordLinkFieldId);
        const linkedTableId = linkField.options?.linkedTableId;
        const targetTable = base.getTable(linkedTableId);

        connection["Target Table"] = targetTable.name;
        connection["Connection Type"] =
          field.type === "rollup"
            ? `Rollup (via ${linkField.name})`
            : `Lookup (via ${linkField.name})`;
        connectionData.push(connection);
      } catch (e) {
        /* Broken lookup */
      }
    }
  }
}

// 3. OUTPUT GENERATION
output.clear();
output.markdown("### 🗺️ Data Lineage Report");

if (connectionData.length > 0) {
  // This creates a readable, interactive grid in the UI
  output.table(connectionData);
} else {
  output.text("No relationships found in this base.");
}
