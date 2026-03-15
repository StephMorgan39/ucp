### Record Inspection: CanonicalRegistry

|Record ID|Primary|Field|Value|Link Status|
|---|---|---|---|---|
|recX2yWSaOQEV7rnc|272|Field Name|Country Origin|—|
|recX2yWSaOQEV7rnc|272|Normalization Fn|PROPER(TRIM({country_origin}))|—|
|recX2yWSaOQEV7rnc|272|Validation Rule|controlled country list|—|
|recX2yWSaOQEV7rnc|272|Is Required|—|—|
|recX2yWSaOQEV7rnc|272|Example Input|Spain|—|
|recX2yWSaOQEV7rnc|272|Example Output|Spain|—|
|recX2yWSaOQEV7rnc|272|Last Modified|2026-03-01T11:27:03.000Z|—|
|recX2yWSaOQEV7rnc|272|Field Type|[object Object]|—|
|recX2yWSaOQEV7rnc|272|Canonical_Registry_ID|272|—|
|recX2yWSaOQEV7rnc|272|Description Detail|—|—|
|recX2yWSaOQEV7rnc|272|Table Name|[object Object]|—|
|recX2yWSaOQEV7rnc|272|Standardization|—|OK|
|recX2yWSaOQEV7rnc|272|Anomalies|—|OK|
|recX2yWSaOQEV7rnc|272|Field Registry|fldFYaZM86ortnRZA|OK|
|recX2yWSaOQEV7rnc|272|Manifest Source Config|—|OK|
|recX2yWSaOQEV7rnc|272|Staging|—|OK|
|recX2yWSaOQEV7rnc|272|Category ID Prefix|—|—|
|recX2yWSaOQEV7rnc|272|CanonicalRegistry|272|OK|
|recX2yWSaOQEV7rnc|272|From field: CanonicalRegistry|272|OK|
|recX2yWSaOQEV7rnc|272|Canonical_Registry_ID (from CanonicalRegistry)||—|
|reciL24FNi0oUCcmZ|283|Field Name|Product SKU|—|
|reciL24FNi0oUCcmZ|283|Normalization Fn|N/A (Script Ingested)|—|
|reciL24FNi0oUCcmZ|283|Validation Rule|LEN >= 10 AND <= 11; LEFT(3) = "163". Canonical string representing the product.|—|
|reciL24FNi0oUCcmZ|283|Is Required|—|—|
|reciL24FNi0oUCcmZ|283|Example Input|1630408402|—|
|reciL24FNi0oUCcmZ|283|Example Output|1630408402|—|
|reciL24FNi0oUCcmZ|283|Last Modified|2026-03-05T15:11:45.000Z|—|
|reciL24FNi0oUCcmZ|283|Field Type|[object Object]|—|
|reciL24FNi0oUCcmZ|283|Canonical_Registry_ID|283|—|
|reciL24FNi0oUCcmZ|283|Description Detail|Structure: 163 (Supplier) + TT (Type Code) + BBBB (Base) + N/NN (Colour Seq)|—|
|reciL24FNi0oUCcmZ|283|Table Name|[object Object]|—|
|reciL24FNi0oUCcmZ|283|Standardization|—|OK|
|reciL24FNi0oUCcmZ|283|Anomalies|—|OK|
|reciL24FNi0oUCcmZ|283|Field Registry|—|OK|
|reciL24FNi0oUCcmZ|283|Manifest Source Config|—|OK|
|reciL24FNi0oUCcmZ|283|Staging|—|OK|
|reciL24FNi0oUCcmZ|283|Category ID Prefix|—|—|
|reciL24FNi0oUCcmZ|283|CanonicalRegistry|283|OK|
|reciL24FNi0oUCcmZ|283|From field: CanonicalRegistry|283, 801|OK|
|reciL24FNi0oUCcmZ|283|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recxj3w7GFUWHilMN|290|Field Name|Supplier Series|—|
|recxj3w7GFUWHilMN|290|Normalization Fn|TRIM({supplier_series_name})|—|
|recxj3w7GFUWHilMN|290|Validation Rule|optional|—|
|recxj3w7GFUWHilMN|290|Is Required|—|—|
|recxj3w7GFUWHilMN|290|Example Input|Agadir|—|
|recxj3w7GFUWHilMN|290|Example Output|Agadir|—|
|recxj3w7GFUWHilMN|290|Last Modified|2026-03-01T11:27:03.000Z|—|
|recxj3w7GFUWHilMN|290|Field Type|[object Object]|—|
|recxj3w7GFUWHilMN|290|Canonical_Registry_ID|290|—|
|recxj3w7GFUWHilMN|290|Description Detail|—|—|
|recxj3w7GFUWHilMN|290|Table Name|[object Object]|—|
|recxj3w7GFUWHilMN|290|Standardization|—|OK|
|recxj3w7GFUWHilMN|290|Anomalies|—|OK|
|recxj3w7GFUWHilMN|290|Field Registry|fld7tJJ96gNsz7rA1|OK|
|recxj3w7GFUWHilMN|290|Manifest Source Config|—|OK|
|recxj3w7GFUWHilMN|290|Staging|—|OK|
|recxj3w7GFUWHilMN|290|Category ID Prefix|—|—|
|recxj3w7GFUWHilMN|290|CanonicalRegistry|290|OK|
|recxj3w7GFUWHilMN|290|From field: CanonicalRegistry|290|OK|
|recxj3w7GFUWHilMN|290|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recM6hVEpEvzcnrdM|292|Field Name|Dimensions MM|—|
|recM6hVEpEvzcnrdM|292|Normalization Fn|Delegated to JS parseDimensions()|—|
|recM6hVEpEvzcnrdM|292|Validation Rule|Format: [L]x[W]|—|
|recM6hVEpEvzcnrdM|292|Is Required|—|—|
|recM6hVEpEvzcnrdM|292|Example Input|147x147mm|—|
|recM6hVEpEvzcnrdM|292|Example Output|147x147mm|—|
|recM6hVEpEvzcnrdM|292|Last Modified|2026-03-12T02:29:22.000Z|—|
|recM6hVEpEvzcnrdM|292|Field Type|[object Object]|—|
|recM6hVEpEvzcnrdM|292|Canonical_Registry_ID|292|—|
|recM6hVEpEvzcnrdM|292|Description Detail|Native JS string split & match|—|
|recM6hVEpEvzcnrdM|292|Table Name|[object Object]|—|
|recM6hVEpEvzcnrdM|292|Standardization|—|OK|
|recM6hVEpEvzcnrdM|292|Anomalies|—|OK|
|recM6hVEpEvzcnrdM|292|Field Registry|fldvZjLna62iMbj5K, fldGwP2VaoCjGaXGH, recso6fqGObM0WrJL|OK|
|recM6hVEpEvzcnrdM|292|Manifest Source Config|483|OK|
|recM6hVEpEvzcnrdM|292|Staging|—|OK|
|recM6hVEpEvzcnrdM|292|Category ID Prefix|—|—|
|recM6hVEpEvzcnrdM|292|CanonicalRegistry|292|OK|
|recM6hVEpEvzcnrdM|292|From field: CanonicalRegistry|292|OK|
|recM6hVEpEvzcnrdM|292|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rechPkmkQUgx4B1ma|293|Field Name|Dimensions Formulated|—|
|rechPkmkQUgx4B1ma|293|Normalization Fn|CONCATENATE({Size Length MM}, "×", {Size Width MM}, "mm")|—|
|rechPkmkQUgx4B1ma|293|Validation Rule|derived; normalized string|—|
|rechPkmkQUgx4B1ma|293|Is Required|—|—|
|rechPkmkQUgx4B1ma|293|Example Input|147x147mm|—|
|rechPkmkQUgx4B1ma|293|Example Output|147x147mm|—|
|rechPkmkQUgx4B1ma|293|Last Modified|2026-03-02T23:36:58.000Z|—|
|rechPkmkQUgx4B1ma|293|Field Type|[object Object]|—|
|rechPkmkQUgx4B1ma|293|Canonical_Registry_ID|293|—|
|rechPkmkQUgx4B1ma|293|Description Detail|—|—|
|rechPkmkQUgx4B1ma|293|Table Name|[object Object]|—|
|rechPkmkQUgx4B1ma|293|Standardization|—|OK|
|rechPkmkQUgx4B1ma|293|Anomalies|—|OK|
|rechPkmkQUgx4B1ma|293|Field Registry|—|OK|
|rechPkmkQUgx4B1ma|293|Manifest Source Config|—|OK|
|rechPkmkQUgx4B1ma|293|Staging|—|OK|
|rechPkmkQUgx4B1ma|293|Category ID Prefix|—|—|
|rechPkmkQUgx4B1ma|293|CanonicalRegistry|293|OK|
|rechPkmkQUgx4B1ma|293|From field: CanonicalRegistry|293|OK|
|rechPkmkQUgx4B1ma|293|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recjHWDxzxFKzNsYE|296|Field Name|UPCBodyClass|—|
|recjHWDxzxFKzNsYE|296|Normalization Fn|Derived via lookup from UCP_types.product_type through tech_Type_Link|—|
|recjHWDxzxFKzNsYE|296|Validation Rule|Must be one of controlled list in UCP_types.product_type (Ceramic, Porcelain, Mosaic, etc.)|—|
|recjHWDxzxFKzNsYE|296|Is Required|—|—|
|recjHWDxzxFKzNsYE|296|Example Input|(auto-derived)|—|
|recjHWDxzxFKzNsYE|296|Example Output|Porcelain|—|
|recjHWDxzxFKzNsYE|296|Last Modified|2026-02-28T15:30:14.000Z|—|
|recjHWDxzxFKzNsYE|296|Field Type|[object Object]|—|
|recjHWDxzxFKzNsYE|296|Canonical_Registry_ID|296|—|
|recjHWDxzxFKzNsYE|296|Description Detail|Human-readable product type derived from sys\_TT\_Extractor → UCP\_types lookup|—|
|recjHWDxzxFKzNsYE|296|Table Name|[object Object]|—|
|recjHWDxzxFKzNsYE|296|Standardization|4, 10, 11, 12, 13, 14, 15, 16|OK|
|recjHWDxzxFKzNsYE|296|Anomalies|—|OK|
|recjHWDxzxFKzNsYE|296|Field Registry|—|OK|
|recjHWDxzxFKzNsYE|296|Manifest Source Config|—|OK|
|recjHWDxzxFKzNsYE|296|Staging|—|OK|
|recjHWDxzxFKzNsYE|296|Category ID Prefix|—|—|
|recjHWDxzxFKzNsYE|296|CanonicalRegistry|296|OK|
|recjHWDxzxFKzNsYE|296|From field: CanonicalRegistry|296|OK|
|recjHWDxzxFKzNsYE|296|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recD0fzjANwZktbxA|299|Field Name|No Faces|—|
|recD0fzjANwZktbxA|299|Normalization Fn|Delegated to JS parseNumeric()|—|
|recD0fzjANwZktbxA|299|Validation Rule|Integer >= 1|—|
|recD0fzjANwZktbxA|299|Is Required|—|—|
|recD0fzjANwZktbxA|299|Example Input|2|—|
|recD0fzjANwZktbxA|299|Example Output|2|—|
|recD0fzjANwZktbxA|299|Last Modified|2026-03-12T02:29:22.000Z|—|
|recD0fzjANwZktbxA|299|Field Type|[object Object]|—|
|recD0fzjANwZktbxA|299|Canonical_Registry_ID|299|—|
|recD0fzjANwZktbxA|299|Description Detail|Native JS integer extraction|—|
|recD0fzjANwZktbxA|299|Table Name|[object Object]|—|
|recD0fzjANwZktbxA|299|Standardization|—|OK|
|recD0fzjANwZktbxA|299|Anomalies|—|OK|
|recD0fzjANwZktbxA|299|Field Registry|fldkh9EFaIKvc0yIj|OK|
|recD0fzjANwZktbxA|299|Manifest Source Config|487|OK|
|recD0fzjANwZktbxA|299|Staging|—|OK|
|recD0fzjANwZktbxA|299|Category ID Prefix|—|—|
|recD0fzjANwZktbxA|299|CanonicalRegistry|299|OK|
|recD0fzjANwZktbxA|299|From field: CanonicalRegistry|299, 771|OK|
|recD0fzjANwZktbxA|299|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recIdLvlzbFpi9e0A|300|Field Name|PEI Class|—|
|recIdLvlzbFpi9e0A|300|Normalization Fn|Delegated to Dynamic Standardization Engine|—|
|recIdLvlzbFpi9e0A|300|Validation Rule|Must be Integer 1-5|—|
|recIdLvlzbFpi9e0A|300|Is Required|—|—|
|recIdLvlzbFpi9e0A|300|Example Input|5|—|
|recIdLvlzbFpi9e0A|300|Example Output|5|—|
|recIdLvlzbFpi9e0A|300|Last Modified|2026-03-12T02:29:22.000Z|—|
|recIdLvlzbFpi9e0A|300|Field Type|[object Object]|—|
|recIdLvlzbFpi9e0A|300|Canonical_Registry_ID|300|—|
|recIdLvlzbFpi9e0A|300|Description Detail|Governed by exact match Dictionary|—|
|recIdLvlzbFpi9e0A|300|Table Name|[object Object]|—|
|recIdLvlzbFpi9e0A|300|Standardization|1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 63, 64, 65, 66, 67|OK|
|recIdLvlzbFpi9e0A|300|Anomalies|—|OK|
|recIdLvlzbFpi9e0A|300|Field Registry|fldqFzEPIby2C94Du|OK|
|recIdLvlzbFpi9e0A|300|Manifest Source Config|488|OK|
|recIdLvlzbFpi9e0A|300|Staging|—|OK|
|recIdLvlzbFpi9e0A|300|Category ID Prefix|—|—|
|recIdLvlzbFpi9e0A|300|CanonicalRegistry|300|OK|
|recIdLvlzbFpi9e0A|300|From field: CanonicalRegistry|300, 772|OK|
|recIdLvlzbFpi9e0A|300|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recwOEqyNi2IYTqi7|304|Field Name|Tech Slip Rating|—|
|recwOEqyNi2IYTqi7|304|Normalization Fn|Delegated to Dynamic Standardization Engine|—|
|recwOEqyNi2IYTqi7|304|Validation Rule|Must match Standardization Table|—|
|recwOEqyNi2IYTqi7|304|Is Required|—|—|
|recwOEqyNi2IYTqi7|304|Example Input|R10|—|
|recwOEqyNi2IYTqi7|304|Example Output|R10|—|
|recwOEqyNi2IYTqi7|304|Last Modified|2026-03-12T02:29:22.000Z|—|
|recwOEqyNi2IYTqi7|304|Field Type|[object Object]|—|
|recwOEqyNi2IYTqi7|304|Canonical_Registry_ID|304|—|
|recwOEqyNi2IYTqi7|304|Description Detail|Governed by exact match Dictionary|—|
|recwOEqyNi2IYTqi7|304|Table Name|[object Object]|—|
|recwOEqyNi2IYTqi7|304|Standardization|9, 35, 36, 37, 38, 39, 40, 42|OK|
|recwOEqyNi2IYTqi7|304|Anomalies|—|OK|
|recwOEqyNi2IYTqi7|304|Field Registry|fldfMSgqnPwP2hvtl|OK|
|recwOEqyNi2IYTqi7|304|Manifest Source Config|489|OK|
|recwOEqyNi2IYTqi7|304|Staging|—|OK|
|recwOEqyNi2IYTqi7|304|Category ID Prefix|—|—|
|recwOEqyNi2IYTqi7|304|CanonicalRegistry|304|OK|
|recwOEqyNi2IYTqi7|304|From field: CanonicalRegistry|304, 773|OK|
|recwOEqyNi2IYTqi7|304|Canonical_Registry_ID (from CanonicalRegistry)||—|
|reclHjJ0jIG1774wG|306|Field Name|Pce Box|—|
|reclHjJ0jIG1774wG|306|Normalization Fn|Delegated to JS parseNumeric()|—|
|reclHjJ0jIG1774wG|306|Validation Rule|Integer >= 0|—|
|reclHjJ0jIG1774wG|306|Is Required|—|—|
|reclHjJ0jIG1774wG|306|Example Input|12|—|
|reclHjJ0jIG1774wG|306|Example Output|12|—|
|reclHjJ0jIG1774wG|306|Last Modified|2026-03-12T02:29:22.000Z|—|
|reclHjJ0jIG1774wG|306|Field Type|[object Object]|—|
|reclHjJ0jIG1774wG|306|Canonical_Registry_ID|306|—|
|reclHjJ0jIG1774wG|306|Description Detail|Native JS float extraction|—|
|reclHjJ0jIG1774wG|306|Table Name|[object Object]|—|
|reclHjJ0jIG1774wG|306|Standardization|—|OK|
|reclHjJ0jIG1774wG|306|Anomalies|—|OK|
|reclHjJ0jIG1774wG|306|Field Registry|fldiTSUcLPa4uLT4L|OK|
|reclHjJ0jIG1774wG|306|Manifest Source Config|490|OK|
|reclHjJ0jIG1774wG|306|Staging|—|OK|
|reclHjJ0jIG1774wG|306|Category ID Prefix|—|—|
|reclHjJ0jIG1774wG|306|CanonicalRegistry|306|OK|
|reclHjJ0jIG1774wG|306|From field: CanonicalRegistry|306|OK|
|reclHjJ0jIG1774wG|306|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recCTC5kZqn2bsdu3|307|Field Name|Sqm Box|—|
|recCTC5kZqn2bsdu3|307|Normalization Fn|Delegated to JS parseNumeric()|—|
|recCTC5kZqn2bsdu3|307|Validation Rule|Numeric >= 0|—|
|recCTC5kZqn2bsdu3|307|Is Required|—|—|
|recCTC5kZqn2bsdu3|307|Example Input|1.44|—|
|recCTC5kZqn2bsdu3|307|Example Output|1.44|—|
|recCTC5kZqn2bsdu3|307|Last Modified|2026-03-12T02:29:22.000Z|—|
|recCTC5kZqn2bsdu3|307|Field Type|[object Object]|—|
|recCTC5kZqn2bsdu3|307|Canonical_Registry_ID|307|—|
|recCTC5kZqn2bsdu3|307|Description Detail|Native JS float extraction|—|
|recCTC5kZqn2bsdu3|307|Table Name|[object Object]|—|
|recCTC5kZqn2bsdu3|307|Standardization|—|OK|
|recCTC5kZqn2bsdu3|307|Anomalies|—|OK|
|recCTC5kZqn2bsdu3|307|Field Registry|fldvVC9z72GqYdDko|OK|
|recCTC5kZqn2bsdu3|307|Manifest Source Config|498|OK|
|recCTC5kZqn2bsdu3|307|Staging|—|OK|
|recCTC5kZqn2bsdu3|307|Category ID Prefix|—|—|
|recCTC5kZqn2bsdu3|307|CanonicalRegistry|307|OK|
|recCTC5kZqn2bsdu3|307|From field: CanonicalRegistry|307|OK|
|recCTC5kZqn2bsdu3|307|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recW0nvnvqhSNATun|316|Field Name|Stock ETA|—|
|recW0nvnvqhSNATun|316|Normalization Fn|PARSE_DATE({stock_Eta})|—|
|recW0nvnvqhSNATun|316|Validation Rule|ISO date preferred|—|
|recW0nvnvqhSNATun|316|Is Required|—|—|
|recW0nvnvqhSNATun|316|Example Input|2025-11-05|—|
|recW0nvnvqhSNATun|316|Example Output|2025-11-05|—|
|recW0nvnvqhSNATun|316|Last Modified|2026-03-01T11:27:03.000Z|—|
|recW0nvnvqhSNATun|316|Field Type|[object Object]|—|
|recW0nvnvqhSNATun|316|Canonical_Registry_ID|316|—|
|recW0nvnvqhSNATun|316|Description Detail|—|—|
|recW0nvnvqhSNATun|316|Table Name|[object Object]|—|
|recW0nvnvqhSNATun|316|Standardization|—|OK|
|recW0nvnvqhSNATun|316|Anomalies|—|OK|
|recW0nvnvqhSNATun|316|Field Registry|—|OK|
|recW0nvnvqhSNATun|316|Manifest Source Config|—|OK|
|recW0nvnvqhSNATun|316|Staging|—|OK|
|recW0nvnvqhSNATun|316|Category ID Prefix|—|—|
|recW0nvnvqhSNATun|316|CanonicalRegistry|316|OK|
|recW0nvnvqhSNATun|316|From field: CanonicalRegistry|316|OK|
|recW0nvnvqhSNATun|316|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recItRS3Ucr7xa46K|317|Field Name|stock_status|—|
|recItRS3Ucr7xa46K|317|Normalization Fn|TRIM({Stock_Status})|—|
|recItRS3Ucr7xa46K|317|Validation Rule|One of: Active, Pending, Discontinued, End of Range|—|
|recItRS3Ucr7xa46K|317|Is Required|—|—|
|recItRS3Ucr7xa46K|317|Example Input|active|—|
|recItRS3Ucr7xa46K|317|Example Output|Active|—|
|recItRS3Ucr7xa46K|317|Last Modified|2026-02-28T11:21:39.000Z|—|
|recItRS3Ucr7xa46K|317|Field Type|[object Object]|—|
|recItRS3Ucr7xa46K|317|Canonical_Registry_ID|317|—|
|recItRS3Ucr7xa46K|317|Description Detail|—|—|
|recItRS3Ucr7xa46K|317|Table Name|[object Object]|—|
|recItRS3Ucr7xa46K|317|Standardization|—|OK|
|recItRS3Ucr7xa46K|317|Anomalies|—|OK|
|recItRS3Ucr7xa46K|317|Field Registry|—|OK|
|recItRS3Ucr7xa46K|317|Manifest Source Config|—|OK|
|recItRS3Ucr7xa46K|317|Staging|—|OK|
|recItRS3Ucr7xa46K|317|Category ID Prefix|—|—|
|recItRS3Ucr7xa46K|317|CanonicalRegistry|317|OK|
|recItRS3Ucr7xa46K|317|From field: CanonicalRegistry|317|OK|
|recItRS3Ucr7xa46K|317|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec7biKObYm8zUxQa|323|Field Name|V Rating|—|
|rec7biKObYm8zUxQa|323|Normalization Fn|IF({V_Rating_Status} = "Confirmed", {V_Rating_Value}, BLANK())|—|
|rec7biKObYm8zUxQa|323|Validation Rule|Must be one of: V1, V2, V3, V4, V5|—|
|rec7biKObYm8zUxQa|323|Is Required|—|—|
|rec7biKObYm8zUxQa|323|Example Input|—|—|
|rec7biKObYm8zUxQa|323|Example Output|—|—|
|rec7biKObYm8zUxQa|323|Last Modified|2026-03-01T11:27:03.000Z|—|
|rec7biKObYm8zUxQa|323|Field Type|[object Object]|—|
|rec7biKObYm8zUxQa|323|Canonical_Registry_ID|323|—|
|rec7biKObYm8zUxQa|323|Description Detail|—|—|
|rec7biKObYm8zUxQa|323|Table Name|[object Object]|—|
|rec7biKObYm8zUxQa|323|Standardization|—|OK|
|rec7biKObYm8zUxQa|323|Anomalies|—|OK|
|rec7biKObYm8zUxQa|323|Field Registry|fldg1yVUHzrYOTylE|OK|
|rec7biKObYm8zUxQa|323|Manifest Source Config|—|OK|
|rec7biKObYm8zUxQa|323|Staging|—|OK|
|rec7biKObYm8zUxQa|323|Category ID Prefix|—|—|
|rec7biKObYm8zUxQa|323|CanonicalRegistry|323|OK|
|rec7biKObYm8zUxQa|323|From field: CanonicalRegistry|323, 779|OK|
|rec7biKObYm8zUxQa|323|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec8zpsckCMglgDRk|324|Field Name|V Rating Status|—|
|rec8zpsckCMglgDRk|324|Normalization Fn|PROPER(TRIM({V_Rating_Status}))|—|
|rec8zpsckCMglgDRk|324|Validation Rule|Must be one of: Confirmed, N/A, Unknown|—|
|rec8zpsckCMglgDRk|324|Is Required|—|—|
|rec8zpsckCMglgDRk|324|Example Input|—|—|
|rec8zpsckCMglgDRk|324|Example Output|—|—|
|rec8zpsckCMglgDRk|324|Last Modified|2026-03-01T11:27:03.000Z|—|
|rec8zpsckCMglgDRk|324|Field Type|[object Object]|—|
|rec8zpsckCMglgDRk|324|Canonical_Registry_ID|324|—|
|rec8zpsckCMglgDRk|324|Description Detail|—|—|
|rec8zpsckCMglgDRk|324|Table Name|[object Object]|—|
|rec8zpsckCMglgDRk|324|Standardization|—|OK|
|rec8zpsckCMglgDRk|324|Anomalies|—|OK|
|rec8zpsckCMglgDRk|324|Field Registry|—|OK|
|rec8zpsckCMglgDRk|324|Manifest Source Config|—|OK|
|rec8zpsckCMglgDRk|324|Staging|—|OK|
|rec8zpsckCMglgDRk|324|Category ID Prefix|—|—|
|rec8zpsckCMglgDRk|324|CanonicalRegistry|324|OK|
|rec8zpsckCMglgDRk|324|From field: CanonicalRegistry|324, 780|OK|
|rec8zpsckCMglgDRk|324|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec8siNtC3IwHfQPO|338|Field Name|Water Absorption|—|
|rec8siNtC3IwHfQPO|338|Normalization Fn|IF(FIND("%",{Water_Absorption})>0, PARSE_NUMBER({Water_Absorption})/100, PARSE_NUMBER({Water_Absorption}))|—|
|rec8siNtC3IwHfQPO|338|Validation Rule|>= 0|—|
|rec8siNtC3IwHfQPO|338|Is Required|—|—|
|rec8siNtC3IwHfQPO|338|Example Input|5%|—|
|rec8siNtC3IwHfQPO|338|Example Output|0.05|—|
|rec8siNtC3IwHfQPO|338|Last Modified|2026-03-01T11:27:03.000Z|—|
|rec8siNtC3IwHfQPO|338|Field Type|[object Object]|—|
|rec8siNtC3IwHfQPO|338|Canonical_Registry_ID|338|—|
|rec8siNtC3IwHfQPO|338|Description Detail|—|—|
|rec8siNtC3IwHfQPO|338|Table Name|[object Object]|—|
|rec8siNtC3IwHfQPO|338|Standardization|—|OK|
|rec8siNtC3IwHfQPO|338|Anomalies|—|OK|
|rec8siNtC3IwHfQPO|338|Field Registry|fldKUtg4Yq6WtnErL|OK|
|rec8siNtC3IwHfQPO|338|Manifest Source Config|—|OK|
|rec8siNtC3IwHfQPO|338|Staging|—|OK|
|rec8siNtC3IwHfQPO|338|Category ID Prefix|—|—|
|rec8siNtC3IwHfQPO|338|CanonicalRegistry|338|OK|
|rec8siNtC3IwHfQPO|338|From field: CanonicalRegistry|338, 775|OK|
|rec8siNtC3IwHfQPO|338|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recR5L63pseKoLE8i|339|Field Name|Factory Source|—|
|recR5L63pseKoLE8i|339|Normalization Fn|PROPER(TRIM({Factory}))|—|
|recR5L63pseKoLE8i|339|Validation Rule|optional; single select from known factory list|—|
|recR5L63pseKoLE8i|339|Is Required|—|—|
|recR5L63pseKoLE8i|339|Example Input|Pamesa|—|
|recR5L63pseKoLE8i|339|Example Output|Pamesa|—|
|recR5L63pseKoLE8i|339|Last Modified|2026-03-01T11:27:03.000Z|—|
|recR5L63pseKoLE8i|339|Field Type|[object Object]|—|
|recR5L63pseKoLE8i|339|Canonical_Registry_ID|339|—|
|recR5L63pseKoLE8i|339|Description Detail|Manufacturing factory or brand sourced from supplier feed. Single select controlled list.|—|
|recR5L63pseKoLE8i|339|Table Name|[object Object]|—|
|recR5L63pseKoLE8i|339|Standardization|—|OK|
|recR5L63pseKoLE8i|339|Anomalies|—|OK|
|recR5L63pseKoLE8i|339|Field Registry|—|OK|
|recR5L63pseKoLE8i|339|Manifest Source Config|—|OK|
|recR5L63pseKoLE8i|339|Staging|—|OK|
|recR5L63pseKoLE8i|339|Category ID Prefix|—|—|
|recR5L63pseKoLE8i|339|CanonicalRegistry|339|OK|
|recR5L63pseKoLE8i|339|From field: CanonicalRegistry|339|OK|
|recR5L63pseKoLE8i|339|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recP8DYSEy4ccSJh5|345|Field Name|stock_on_hand_eor|—|
|recP8DYSEy4ccSJh5|345|Normalization Fn|PARSE_NUMBER({Qnt_OnHand_EOR})|—|
|recP8DYSEy4ccSJh5|345|Validation Rule|>= 0, 2 decimals|—|
|recP8DYSEy4ccSJh5|345|Is Required|—|—|
|recP8DYSEy4ccSJh5|345|Example Input|5.8|—|
|recP8DYSEy4ccSJh5|345|Example Output|5.8|—|
|recP8DYSEy4ccSJh5|345|Last Modified|2026-02-28T11:21:39.000Z|—|
|recP8DYSEy4ccSJh5|345|Field Type|[object Object]|—|
|recP8DYSEy4ccSJh5|345|Canonical_Registry_ID|345|—|
|recP8DYSEy4ccSJh5|345|Description Detail|—|—|
|recP8DYSEy4ccSJh5|345|Table Name|[object Object]|—|
|recP8DYSEy4ccSJh5|345|Standardization|—|OK|
|recP8DYSEy4ccSJh5|345|Anomalies|—|OK|
|recP8DYSEy4ccSJh5|345|Field Registry|fld4WI1P7S1cGxoyo|OK|
|recP8DYSEy4ccSJh5|345|Manifest Source Config|—|OK|
|recP8DYSEy4ccSJh5|345|Staging|—|OK|
|recP8DYSEy4ccSJh5|345|Category ID Prefix|—|—|
|recP8DYSEy4ccSJh5|345|CanonicalRegistry|345|OK|
|recP8DYSEy4ccSJh5|345|From field: CanonicalRegistry|345|OK|
|recP8DYSEy4ccSJh5|345|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recJ0qBV8LZyzKx8R|356|Field Name|Supplier Prod Description|—|
|recJ0qBV8LZyzKx8R|356|Normalization Fn|TRIM(), PROPER({supplier_prod_descrip})|—|
|recJ0qBV8LZyzKx8R|356|Validation Rule|LEN(TRIM({supplier_prod_descrip})) >= 5|—|
|recJ0qBV8LZyzKx8R|356|Is Required|true|—|
|recJ0qBV8LZyzKx8R|356|Example Input|Citadel Cotto Oscuro Matt Porc|—|
|recJ0qBV8LZyzKx8R|356|Example Output|Citadel Cotto Oscuro Matt Porc|—|
|recJ0qBV8LZyzKx8R|356|Last Modified|2026-03-03T11:06:20.000Z|—|
|recJ0qBV8LZyzKx8R|356|Field Type|[object Object]|—|
|recJ0qBV8LZyzKx8R|356|Canonical_Registry_ID|356|—|
|recJ0qBV8LZyzKx8R|356|Description Detail|—|—|
|recJ0qBV8LZyzKx8R|356|Table Name|[object Object]|—|
|recJ0qBV8LZyzKx8R|356|Standardization|—|OK|
|recJ0qBV8LZyzKx8R|356|Anomalies|—|OK|
|recJ0qBV8LZyzKx8R|356|Field Registry|fldkAm1iLOJJYmzmi|OK|
|recJ0qBV8LZyzKx8R|356|Manifest Source Config|477|OK|
|recJ0qBV8LZyzKx8R|356|Staging|—|OK|
|recJ0qBV8LZyzKx8R|356|Category ID Prefix|—|—|
|recJ0qBV8LZyzKx8R|356|CanonicalRegistry|356|OK|
|recJ0qBV8LZyzKx8R|356|From field: CanonicalRegistry|356|OK|
|recJ0qBV8LZyzKx8R|356|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec62Wc8B2W2jDCGD|362|Field Name|Body Type|—|
|rec62Wc8B2W2jDCGD|362|Normalization Fn|Delegated to Dynamic Standardization Engine|—|
|rec62Wc8B2W2jDCGD|362|Validation Rule|Must match Standardization Table|—|
|rec62Wc8B2W2jDCGD|362|Is Required|—|—|
|rec62Wc8B2W2jDCGD|362|Example Input|MATT|—|
|rec62Wc8B2W2jDCGD|362|Example Output|Matt|—|
|rec62Wc8B2W2jDCGD|362|Last Modified|2026-03-12T02:16:07.000Z|—|
|rec62Wc8B2W2jDCGD|362|Field Type|[object Object]|—|
|rec62Wc8B2W2jDCGD|362|Canonical_Registry_ID|362|—|
|rec62Wc8B2W2jDCGD|362|Description Detail|Governed by exact match Dictionary|—|
|rec62Wc8B2W2jDCGD|362|Table Name|[object Object]|—|
|rec62Wc8B2W2jDCGD|362|Standardization|—|OK|
|rec62Wc8B2W2jDCGD|362|Anomalies|—|OK|
|rec62Wc8B2W2jDCGD|362|Field Registry|fldIEO5cTzgLSSOC0|OK|
|rec62Wc8B2W2jDCGD|362|Manifest Source Config|485|OK|
|rec62Wc8B2W2jDCGD|362|Staging|—|OK|
|rec62Wc8B2W2jDCGD|362|Category ID Prefix|—|—|
|rec62Wc8B2W2jDCGD|362|CanonicalRegistry|362|OK|
|rec62Wc8B2W2jDCGD|362|From field: CanonicalRegistry|362|OK|
|rec62Wc8B2W2jDCGD|362|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recpZmWJGNFgguLDC|368|Field Name|Tech Slip Rating Status|—|
|recpZmWJGNFgguLDC|368|Normalization Fn|PROPER(TRIM({R_Slip_Status}))|—|
|recpZmWJGNFgguLDC|368|Validation Rule|Must be one of: Confirmed, Not Applicable, Unknown|—|
|recpZmWJGNFgguLDC|368|Is Required|—|—|
|recpZmWJGNFgguLDC|368|Example Input|Yes|—|
|recpZmWJGNFgguLDC|368|Example Output|Confirmed|—|
|recpZmWJGNFgguLDC|368|Last Modified|2026-03-12T02:15:33.000Z|—|
|recpZmWJGNFgguLDC|368|Field Type|[object Object]|—|
|recpZmWJGNFgguLDC|368|Canonical_Registry_ID|368|—|
|recpZmWJGNFgguLDC|368|Description Detail|—|—|
|recpZmWJGNFgguLDC|368|Table Name|[object Object]|—|
|recpZmWJGNFgguLDC|368|Standardization|—|OK|
|recpZmWJGNFgguLDC|368|Anomalies|—|OK|
|recpZmWJGNFgguLDC|368|Field Registry|fldfMSgqnPwP2hvtl|OK|
|recpZmWJGNFgguLDC|368|Manifest Source Config|—|OK|
|recpZmWJGNFgguLDC|368|Staging|—|OK|
|recpZmWJGNFgguLDC|368|Category ID Prefix|—|—|
|recpZmWJGNFgguLDC|368|CanonicalRegistry|368|OK|
|recpZmWJGNFgguLDC|368|From field: CanonicalRegistry|368|OK|
|recpZmWJGNFgguLDC|368|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec5Z4ju6gvhtuek6|371|Field Name|Stock On Hand|—|
|rec5Z4ju6gvhtuek6|371|Normalization Fn|Delegated to JS parseNumeric()|—|
|rec5Z4ju6gvhtuek6|371|Validation Rule|Numeric >= 0|—|
|rec5Z4ju6gvhtuek6|371|Is Required|—|—|
|rec5Z4ju6gvhtuek6|371|Example Input|89.82 - 5|—|
|rec5Z4ju6gvhtuek6|371|Example Output|84.82|—|
|rec5Z4ju6gvhtuek6|371|Last Modified|2026-03-12T02:29:22.000Z|—|
|rec5Z4ju6gvhtuek6|371|Field Type|[object Object]|—|
|rec5Z4ju6gvhtuek6|371|Canonical_Registry_ID|371|—|
|rec5Z4ju6gvhtuek6|371|Description Detail|Native JS float extraction|—|
|rec5Z4ju6gvhtuek6|371|Table Name|[object Object]|—|
|rec5Z4ju6gvhtuek6|371|Standardization|—|OK|
|rec5Z4ju6gvhtuek6|371|Anomalies|—|OK|
|rec5Z4ju6gvhtuek6|371|Field Registry|fldhNujCBWdylBEzS|OK|
|rec5Z4ju6gvhtuek6|371|Manifest Source Config|478, 491|OK|
|rec5Z4ju6gvhtuek6|371|Staging|—|OK|
|rec5Z4ju6gvhtuek6|371|Category ID Prefix|—|—|
|rec5Z4ju6gvhtuek6|371|CanonicalRegistry|371|OK|
|rec5Z4ju6gvhtuek6|371|From field: CanonicalRegistry|371|OK|
|rec5Z4ju6gvhtuek6|371|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recPj7RSxSSu3XM8w|372|Field Name|Stock On Order|—|
|recPj7RSxSSu3XM8w|372|Normalization Fn|PARSE_NUMBER({Sqm_on_order})|—|
|recPj7RSxSSu3XM8w|372|Validation Rule|>= 0, allow 2 decimals|—|
|recPj7RSxSSu3XM8w|372|Is Required|—|—|
|recPj7RSxSSu3XM8w|372|Example Input|0|—|
|recPj7RSxSSu3XM8w|372|Example Output|0|—|
|recPj7RSxSSu3XM8w|372|Last Modified|2026-03-01T11:27:03.000Z|—|
|recPj7RSxSSu3XM8w|372|Field Type|[object Object]|—|
|recPj7RSxSSu3XM8w|372|Canonical_Registry_ID|372|—|
|recPj7RSxSSu3XM8w|372|Description Detail|—|—|
|recPj7RSxSSu3XM8w|372|Table Name|[object Object]|—|
|recPj7RSxSSu3XM8w|372|Standardization|—|OK|
|recPj7RSxSSu3XM8w|372|Anomalies|—|OK|
|recPj7RSxSSu3XM8w|372|Field Registry|—|OK|
|recPj7RSxSSu3XM8w|372|Manifest Source Config|—|OK|
|recPj7RSxSSu3XM8w|372|Staging|—|OK|
|recPj7RSxSSu3XM8w|372|Category ID Prefix|—|—|
|recPj7RSxSSu3XM8w|372|CanonicalRegistry|372|OK|
|recPj7RSxSSu3XM8w|372|From field: CanonicalRegistry|372|OK|
|recPj7RSxSSu3XM8w|372|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recPxnbZHo3GH6BFz|373|Field Name|stock_date_last_update|—|
|recPxnbZHo3GH6BFz|373|Normalization Fn|PARSE_DATE({stock_Eta})|—|
|recPxnbZHo3GH6BFz|373|Validation Rule|ISO date|—|
|recPxnbZHo3GH6BFz|373|Is Required|—|—|
|recPxnbZHo3GH6BFz|373|Example Input|2025-11-05|—|
|recPxnbZHo3GH6BFz|373|Example Output|2025-11-05|—|
|recPxnbZHo3GH6BFz|373|Last Modified|2026-02-28T11:21:39.000Z|—|
|recPxnbZHo3GH6BFz|373|Field Type|[object Object]|—|
|recPxnbZHo3GH6BFz|373|Canonical_Registry_ID|373|—|
|recPxnbZHo3GH6BFz|373|Description Detail|—|—|
|recPxnbZHo3GH6BFz|373|Table Name|[object Object]|—|
|recPxnbZHo3GH6BFz|373|Standardization|—|OK|
|recPxnbZHo3GH6BFz|373|Anomalies|—|OK|
|recPxnbZHo3GH6BFz|373|Field Registry|—|OK|
|recPxnbZHo3GH6BFz|373|Manifest Source Config|—|OK|
|recPxnbZHo3GH6BFz|373|Staging|—|OK|
|recPxnbZHo3GH6BFz|373|Category ID Prefix|—|—|
|recPxnbZHo3GH6BFz|373|CanonicalRegistry|373|OK|
|recPxnbZHo3GH6BFz|373|From field: CanonicalRegistry|373|OK|
|recPxnbZHo3GH6BFz|373|Canonical_Registry_ID (from CanonicalRegistry)||—|
|reca39sKzOmkKFu1N|375|Field Name|Retail Excl|—|
|reca39sKzOmkKFu1N|375|Normalization Fn|Delegated to JS parseNumeric()|—|
|reca39sKzOmkKFu1N|375|Validation Rule|Currency / Decimal|—|
|reca39sKzOmkKFu1N|375|Is Required|—|—|
|reca39sKzOmkKFu1N|375|Example Input|R693.91|—|
|reca39sKzOmkKFu1N|375|Example Output|693.91|—|
|reca39sKzOmkKFu1N|375|Last Modified|2026-03-12T02:29:22.000Z|—|
|reca39sKzOmkKFu1N|375|Field Type|[object Object]|—|
|reca39sKzOmkKFu1N|375|Canonical_Registry_ID|375|—|
|reca39sKzOmkKFu1N|375|Description Detail|Native JS float extraction|—|
|reca39sKzOmkKFu1N|375|Table Name|[object Object]|—|
|reca39sKzOmkKFu1N|375|Standardization|—|OK|
|reca39sKzOmkKFu1N|375|Anomalies|—|OK|
|reca39sKzOmkKFu1N|375|Field Registry|fldHDkQCH8jKeJZ7g, fld44fJf1KxjwozXC, fldC2cYQBZmvAOFdy|OK|
|reca39sKzOmkKFu1N|375|Manifest Source Config|480, 495, 503, 482|OK|
|reca39sKzOmkKFu1N|375|Staging|—|OK|
|reca39sKzOmkKFu1N|375|Category ID Prefix|—|—|
|reca39sKzOmkKFu1N|375|CanonicalRegistry|375|OK|
|reca39sKzOmkKFu1N|375|From field: CanonicalRegistry|375|OK|
|reca39sKzOmkKFu1N|375|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recupnH2DeMzaSlFu|376|Field Name|Retail Incl|—|
|recupnH2DeMzaSlFu|376|Normalization Fn|COMPUTE: {retail_excl} * 1.15|—|
|recupnH2DeMzaSlFu|376|Validation Rule|>= 0, 2 decimals. VAT-inclusive version of retail_excl.|—|
|recupnH2DeMzaSlFu|376|Is Required|—|—|
|recupnH2DeMzaSlFu|376|Example Input|693.91|—|
|recupnH2DeMzaSlFu|376|Example Output|798.00|—|
|recupnH2DeMzaSlFu|376|Last Modified|2026-03-01T11:27:03.000Z|—|
|recupnH2DeMzaSlFu|376|Field Type|[object Object]|—|
|recupnH2DeMzaSlFu|376|Canonical_Registry_ID|376|—|
|recupnH2DeMzaSlFu|376|Description Detail|Retail price including 15% VAT. Computed from retail_excl. Unit-agnostic — matches whatever unit_of\_sale is set to.|—|
|recupnH2DeMzaSlFu|376|Table Name|[object Object]|—|
|recupnH2DeMzaSlFu|376|Standardization|—|OK|
|recupnH2DeMzaSlFu|376|Anomalies|—|OK|
|recupnH2DeMzaSlFu|376|Field Registry|fldMP2ywTGMepEX9K|OK|
|recupnH2DeMzaSlFu|376|Manifest Source Config|496|OK|
|recupnH2DeMzaSlFu|376|Staging|—|OK|
|recupnH2DeMzaSlFu|376|Category ID Prefix|—|—|
|recupnH2DeMzaSlFu|376|CanonicalRegistry|376|OK|
|recupnH2DeMzaSlFu|376|From field: CanonicalRegistry|376|OK|
|recupnH2DeMzaSlFu|376|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rectqZJ8rAfCLiXmr|390|Field Name|Kg Pallet|—|
|rectqZJ8rAfCLiXmr|390|Normalization Fn|Delegated to JS parseNumeric()|—|
|rectqZJ8rAfCLiXmr|390|Validation Rule|Numeric >= 0|—|
|rectqZJ8rAfCLiXmr|390|Is Required|—|—|
|rectqZJ8rAfCLiXmr|390|Example Input|1098|—|
|rectqZJ8rAfCLiXmr|390|Example Output|1098|—|
|rectqZJ8rAfCLiXmr|390|Last Modified|2026-03-12T02:29:22.000Z|—|
|rectqZJ8rAfCLiXmr|390|Field Type|[object Object]|—|
|rectqZJ8rAfCLiXmr|390|Canonical_Registry_ID|390|—|
|rectqZJ8rAfCLiXmr|390|Description Detail|Native JS float extraction|—|
|rectqZJ8rAfCLiXmr|390|Table Name|[object Object]|—|
|rectqZJ8rAfCLiXmr|390|Standardization|—|OK|
|rectqZJ8rAfCLiXmr|390|Anomalies|—|OK|
|rectqZJ8rAfCLiXmr|390|Field Registry|fldOfxvmWk1K1J0TQ|OK|
|rectqZJ8rAfCLiXmr|390|Manifest Source Config|502|OK|
|rectqZJ8rAfCLiXmr|390|Staging|—|OK|
|rectqZJ8rAfCLiXmr|390|Category ID Prefix|—|—|
|rectqZJ8rAfCLiXmr|390|CanonicalRegistry|390|OK|
|rectqZJ8rAfCLiXmr|390|From field: CanonicalRegistry|390|OK|
|rectqZJ8rAfCLiXmr|390|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recQUVyGqwAo2cfM1|397|Field Name|Product Look Finish|—|
|recQUVyGqwAo2cfM1|397|Normalization Fn|Must match a governed ID from the UPC lookup|—|
|recQUVyGqwAo2cfM1|397|Validation Rule|Must be one of: Crackle Distressed Natural Encaustic Zellige Pattern Stone Concrete, Cement Slate Timber Plank Metallic Monotone Brick Effect Striated Terracotta Undulated|—|
|recQUVyGqwAo2cfM1|397|Is Required|—|—|
|recQUVyGqwAo2cfM1|397|Example Input|stone look|—|
|recQUVyGqwAo2cfM1|397|Example Output|Stone|—|
|recQUVyGqwAo2cfM1|397|Last Modified|2026-03-02T14:25:01.000Z|—|
|recQUVyGqwAo2cfM1|397|Field Type|[object Object]|—|
|recQUVyGqwAo2cfM1|397|Canonical_Registry_ID|397|—|
|recQUVyGqwAo2cfM1|397|Description Detail|—|—|
|recQUVyGqwAo2cfM1|397|Table Name|[object Object]|—|
|recQUVyGqwAo2cfM1|397|Standardization|5|OK|
|recQUVyGqwAo2cfM1|397|Anomalies|—|OK|
|recQUVyGqwAo2cfM1|397|Field Registry|fldpPJtcgHQgxRU0v, recthPOj3zwzoGAa8|OK|
|recQUVyGqwAo2cfM1|397|Manifest Source Config|—|OK|
|recQUVyGqwAo2cfM1|397|Staging|—|OK|
|recQUVyGqwAo2cfM1|397|Category ID Prefix|—|—|
|recQUVyGqwAo2cfM1|397|CanonicalRegistry|397|OK|
|recQUVyGqwAo2cfM1|397|From field: CanonicalRegistry|397|OK|
|recQUVyGqwAo2cfM1|397|Canonical_Registry_ID (from CanonicalRegistry)||—|
|receOzDvu2mAuVBO1|402|Field Name|source metadata link|—|
|receOzDvu2mAuVBO1|402|Normalization Fn|n/a|—|
|receOzDvu2mAuVBO1|402|Validation Rule|Link to Source_Metadata table|—|
|receOzDvu2mAuVBO1|402|Is Required|—|—|
|receOzDvu2mAuVBO1|402|Example Input|—|—|
|receOzDvu2mAuVBO1|402|Example Output|—|—|
|receOzDvu2mAuVBO1|402|Last Modified|2026-03-02T22:00:49.000Z|—|
|receOzDvu2mAuVBO1|402|Field Type|[object Object]|—|
|receOzDvu2mAuVBO1|402|Canonical_Registry_ID|402|—|
|receOzDvu2mAuVBO1|402|Description Detail|Links staging record to its source feed in Source\_Metadata.|—|
|receOzDvu2mAuVBO1|402|Table Name|[object Object]|—|
|receOzDvu2mAuVBO1|402|Standardization|—|OK|
|receOzDvu2mAuVBO1|402|Anomalies|—|OK|
|receOzDvu2mAuVBO1|402|Field Registry|fldbffhLGECRlzSt2|OK|
|receOzDvu2mAuVBO1|402|Manifest Source Config|—|OK|
|receOzDvu2mAuVBO1|402|Staging|—|OK|
|receOzDvu2mAuVBO1|402|Category ID Prefix|—|—|
|receOzDvu2mAuVBO1|402|CanonicalRegistry|402|OK|
|receOzDvu2mAuVBO1|402|From field: CanonicalRegistry|402|OK|
|receOzDvu2mAuVBO1|402|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recJYPDbxvARqn7cL|404|Field Name|Mohs Rating|—|
|recJYPDbxvARqn7cL|404|Normalization Fn|IF({Mohs_Status}="Confirmed", CLAMP(PARSE_INTEGER({Mohs_Rating}),6,10), NULL)|—|
|recJYPDbxvARqn7cL|404|Validation Rule|Integer 6-10|—|
|recJYPDbxvARqn7cL|404|Is Required|—|—|
|recJYPDbxvARqn7cL|404|Example Input|7|—|
|recJYPDbxvARqn7cL|404|Example Output|7|—|
|recJYPDbxvARqn7cL|404|Last Modified|2026-03-01T11:27:03.000Z|—|
|recJYPDbxvARqn7cL|404|Field Type|[object Object]|—|
|recJYPDbxvARqn7cL|404|Canonical_Registry_ID|404|—|
|recJYPDbxvARqn7cL|404|Description Detail|—|—|
|recJYPDbxvARqn7cL|404|Table Name|[object Object]|—|
|recJYPDbxvARqn7cL|404|Standardization|—|OK|
|recJYPDbxvARqn7cL|404|Anomalies|—|OK|
|recJYPDbxvARqn7cL|404|Field Registry|fldpN2Q3aK95THc2U|OK|
|recJYPDbxvARqn7cL|404|Manifest Source Config|—|OK|
|recJYPDbxvARqn7cL|404|Staging|—|OK|
|recJYPDbxvARqn7cL|404|Category ID Prefix|—|—|
|recJYPDbxvARqn7cL|404|CanonicalRegistry|404|OK|
|recJYPDbxvARqn7cL|404|From field: CanonicalRegistry|404, 777|OK|
|recJYPDbxvARqn7cL|404|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recFxFi3sHUua513T|405|Field Name|Mohs Status|—|
|recFxFi3sHUua513T|405|Normalization Fn|SWITCH(LOWER(TRIM({Mohs_Status_RAW})), "yes","Confirmed", "no","Not Applicable", "n/a","Not Applicable", "unknown","Unknown", PROPER(TRIM({Mohs_Status_RAW})))|—|
|recFxFi3sHUua513T|405|Validation Rule|Must be one of: Confirmed, Not Applicable, Unknown|—|
|recFxFi3sHUua513T|405|Is Required|—|—|
|recFxFi3sHUua513T|405|Example Input|no|—|
|recFxFi3sHUua513T|405|Example Output|Not Applicable|—|
|recFxFi3sHUua513T|405|Last Modified|2026-03-01T11:27:03.000Z|—|
|recFxFi3sHUua513T|405|Field Type|[object Object]|—|
|recFxFi3sHUua513T|405|Canonical_Registry_ID|405|—|
|recFxFi3sHUua513T|405|Description Detail|—|—|
|recFxFi3sHUua513T|405|Table Name|[object Object]|—|
|recFxFi3sHUua513T|405|Standardization|—|OK|
|recFxFi3sHUua513T|405|Anomalies|—|OK|
|recFxFi3sHUua513T|405|Field Registry|flduKAKkqT0LGefFm|OK|
|recFxFi3sHUua513T|405|Manifest Source Config|—|OK|
|recFxFi3sHUua513T|405|Staging|—|OK|
|recFxFi3sHUua513T|405|Category ID Prefix|—|—|
|recFxFi3sHUua513T|405|CanonicalRegistry|405|OK|
|recFxFi3sHUua513T|405|From field: CanonicalRegistry|405, 778|OK|
|recFxFi3sHUua513T|405|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recXhtziopiBcQFyt|407|Field Name|Product Series About|—|
|recXhtziopiBcQFyt|407|Normalization Fn|TRIM({Product_Series_About})|—|
|recXhtziopiBcQFyt|407|Validation Rule|optional|—|
|recXhtziopiBcQFyt|407|Is Required|—|—|
|recXhtziopiBcQFyt|407|Example Input|—|—|
|recXhtziopiBcQFyt|407|Example Output|—|—|
|recXhtziopiBcQFyt|407|Last Modified|2026-03-01T11:27:03.000Z|—|
|recXhtziopiBcQFyt|407|Field Type|[object Object]|—|
|recXhtziopiBcQFyt|407|Canonical_Registry_ID|407|—|
|recXhtziopiBcQFyt|407|Description Detail|Supplier-provided description of the product series. Marketing copy context.|—|
|recXhtziopiBcQFyt|407|Table Name|[object Object]|—|
|recXhtziopiBcQFyt|407|Standardization|—|OK|
|recXhtziopiBcQFyt|407|Anomalies|—|OK|
|recXhtziopiBcQFyt|407|Field Registry|fldSb1WHoeT6CKpS1|OK|
|recXhtziopiBcQFyt|407|Manifest Source Config|—|OK|
|recXhtziopiBcQFyt|407|Staging|—|OK|
|recXhtziopiBcQFyt|407|Category ID Prefix|—|—|
|recXhtziopiBcQFyt|407|CanonicalRegistry|407|OK|
|recXhtziopiBcQFyt|407|From field: CanonicalRegistry|407|OK|
|recXhtziopiBcQFyt|407|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recC3i9liW0bcmoaq|408|Field Name|Source Notes|—|
|recC3i9liW0bcmoaq|408|Normalization Fn|TRIM({source_notes})|—|
|recC3i9liW0bcmoaq|408|Validation Rule|optional|—|
|recC3i9liW0bcmoaq|408|Is Required|—|—|
|recC3i9liW0bcmoaq|408|Example Input|notes|—|
|recC3i9liW0bcmoaq|408|Example Output|notes|—|
|recC3i9liW0bcmoaq|408|Last Modified|2026-03-01T11:27:03.000Z|—|
|recC3i9liW0bcmoaq|408|Field Type|[object Object]|—|
|recC3i9liW0bcmoaq|408|Canonical_Registry_ID|408|—|
|recC3i9liW0bcmoaq|408|Description Detail|—|—|
|recC3i9liW0bcmoaq|408|Table Name|[object Object]|—|
|recC3i9liW0bcmoaq|408|Standardization|—|OK|
|recC3i9liW0bcmoaq|408|Anomalies|—|OK|
|recC3i9liW0bcmoaq|408|Field Registry|—|OK|
|recC3i9liW0bcmoaq|408|Manifest Source Config|—|OK|
|recC3i9liW0bcmoaq|408|Staging|—|OK|
|recC3i9liW0bcmoaq|408|Category ID Prefix|—|—|
|recC3i9liW0bcmoaq|408|CanonicalRegistry|408|OK|
|recC3i9liW0bcmoaq|408|From field: CanonicalRegistry|408|OK|
|recC3i9liW0bcmoaq|408|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recBsoVVV5ZLHcD2H|409|Field Name|product_status|—|
|recBsoVVV5ZLHcD2H|409|Normalization Fn|TRIM({Product_Status})|—|
|recBsoVVV5ZLHcD2H|409|Validation Rule|Must be one of: ACTIVE, END OF RANGE, DISCONTINUED, UNLISTED, PENDING REVIEW|—|
|recBsoVVV5ZLHcD2H|409|Is Required|—|—|
|recBsoVVV5ZLHcD2H|409|Example Input|—|—|
|recBsoVVV5ZLHcD2H|409|Example Output|—|—|
|recBsoVVV5ZLHcD2H|409|Last Modified|2026-02-28T11:21:39.000Z|—|
|recBsoVVV5ZLHcD2H|409|Field Type|[object Object]|—|
|recBsoVVV5ZLHcD2H|409|Canonical_Registry_ID|409|—|
|recBsoVVV5ZLHcD2H|409|Description Detail|—|—|
|recBsoVVV5ZLHcD2H|409|Table Name|[object Object]|—|
|recBsoVVV5ZLHcD2H|409|Standardization|—|OK|
|recBsoVVV5ZLHcD2H|409|Anomalies|—|OK|
|recBsoVVV5ZLHcD2H|409|Field Registry|fldA6XW6HKOD9ks3Q|OK|
|recBsoVVV5ZLHcD2H|409|Manifest Source Config|—|OK|
|recBsoVVV5ZLHcD2H|409|Staging|—|OK|
|recBsoVVV5ZLHcD2H|409|Category ID Prefix|—|—|
|recBsoVVV5ZLHcD2H|409|CanonicalRegistry|409|OK|
|recBsoVVV5ZLHcD2H|409|From field: CanonicalRegistry|409|OK|
|recBsoVVV5ZLHcD2H|409|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recZKxxb1pn9H0HJJ|412|Field Name|sys_tt_extractor|—|
|recZKxxb1pn9H0HJJ|412|Normalization Fn|VALUE(MID({Product_SKU}, 4, 2))|—|
|recZKxxb1pn9H0HJJ|412|Validation Rule|Result must be integer between 1-28; must match valid Code in UCP_types table|—|
|recZKxxb1pn9H0HJJ|412|Is Required|—|—|
|recZKxxb1pn9H0HJJ|412|Example Input|1630406241|—|
|recZKxxb1pn9H0HJJ|412|Example Output|4|—|
|recZKxxb1pn9H0HJJ|412|Last Modified|2026-02-28T11:21:39.000Z|—|
|recZKxxb1pn9H0HJJ|412|Field Type|[object Object]|—|
|recZKxxb1pn9H0HJJ|412|Canonical_Registry_ID|412|—|
|recZKxxb1pn9H0HJJ|412|Description Detail|Extracts 2-digit Type Code from positions 4-5 of Product\_SKU and converts to integer for linking to UCP\_types|—|
|recZKxxb1pn9H0HJJ|412|Table Name|[object Object]|—|
|recZKxxb1pn9H0HJJ|412|Standardization|—|OK|
|recZKxxb1pn9H0HJJ|412|Anomalies|—|OK|
|recZKxxb1pn9H0HJJ|412|Field Registry|recYngeNtSnVLCysX|OK|
|recZKxxb1pn9H0HJJ|412|Manifest Source Config|—|OK|
|recZKxxb1pn9H0HJJ|412|Staging|—|OK|
|recZKxxb1pn9H0HJJ|412|Category ID Prefix|—|—|
|recZKxxb1pn9H0HJJ|412|CanonicalRegistry|412|OK|
|recZKxxb1pn9H0HJJ|412|From field: CanonicalRegistry|412|OK|
|recZKxxb1pn9H0HJJ|412|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recorYI7A87IiXzxB|418|Field Name|_SKU_col_SEQ (UPCSKU)|—|
|recorYI7A87IiXzxB|418|Normalization Fn|RIGHT({Product SKU Master}, LEN({Product SKU Master})-9)|—|
|recorYI7A87IiXzxB|418|Validation Rule|ISNUMBER(VALUE(...)) AND LEN(...) <= 2|—|
|recorYI7A87IiXzxB|418|Is Required|—|—|
|recorYI7A87IiXzxB|418|Example Input|—|—|
|recorYI7A87IiXzxB|418|Example Output|—|—|
|recorYI7A87IiXzxB|418|Last Modified|2026-03-05T12:25:34.000Z|—|
|recorYI7A87IiXzxB|418|Field Type|[object Object]|—|
|recorYI7A87IiXzxB|418|Canonical_Registry_ID|418|—|
|recorYI7A87IiXzxB|418|Description Detail|—|—|
|recorYI7A87IiXzxB|418|Table Name|[object Object]|—|
|recorYI7A87IiXzxB|418|Standardization|—|OK|
|recorYI7A87IiXzxB|418|Anomalies|—|OK|
|recorYI7A87IiXzxB|418|Field Registry|—|OK|
|recorYI7A87IiXzxB|418|Manifest Source Config|—|OK|
|recorYI7A87IiXzxB|418|Staging|—|OK|
|recorYI7A87IiXzxB|418|Category ID Prefix|—|—|
|recorYI7A87IiXzxB|418|CanonicalRegistry|418|OK|
|recorYI7A87IiXzxB|418|From field: CanonicalRegistry|418|OK|
|recorYI7A87IiXzxB|418|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recDwmGDyCLDLxC3O|419|Field Name|sku_type_code|—|
|recDwmGDyCLDLxC3O|419|Normalization Fn|VALUE(MID({Product_SKU}, 4, 2))|—|
|recDwmGDyCLDLxC3O|419|Validation Rule|Must exist in UCP_types.Code|—|
|recDwmGDyCLDLxC3O|419|Is Required|—|—|
|recDwmGDyCLDLxC3O|419|Example Input|—|—|
|recDwmGDyCLDLxC3O|419|Example Output|—|—|
|recDwmGDyCLDLxC3O|419|Last Modified|2026-02-28T11:21:39.000Z|—|
|recDwmGDyCLDLxC3O|419|Field Type|[object Object]|—|
|recDwmGDyCLDLxC3O|419|Canonical_Registry_ID|419|—|
|recDwmGDyCLDLxC3O|419|Description Detail|—|—|
|recDwmGDyCLDLxC3O|419|Table Name|[object Object]|—|
|recDwmGDyCLDLxC3O|419|Standardization|—|OK|
|recDwmGDyCLDLxC3O|419|Anomalies|—|OK|
|recDwmGDyCLDLxC3O|419|Field Registry|—|OK|
|recDwmGDyCLDLxC3O|419|Manifest Source Config|—|OK|
|recDwmGDyCLDLxC3O|419|Staging|—|OK|
|recDwmGDyCLDLxC3O|419|Category ID Prefix|—|—|
|recDwmGDyCLDLxC3O|419|CanonicalRegistry|419|OK|
|recDwmGDyCLDLxC3O|419|From field: CanonicalRegistry|419|OK|
|recDwmGDyCLDLxC3O|419|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recUiLEIDUBTFbcq5|422|Field Name|Thickness MM|—|
|recUiLEIDUBTFbcq5|422|Normalization Fn|Delegated to JS parseNumeric()|—|
|recUiLEIDUBTFbcq5|422|Validation Rule|Numeric > 0|—|
|recUiLEIDUBTFbcq5|422|Is Required|—|—|
|recUiLEIDUBTFbcq5|422|Example Input|"8mm" or "10.5 mm"|—|
|recUiLEIDUBTFbcq5|422|Example Output|8 or 10.5|—|
|recUiLEIDUBTFbcq5|422|Last Modified|2026-03-12T02:29:22.000Z|—|
|recUiLEIDUBTFbcq5|422|Field Type|[object Object]|—|
|recUiLEIDUBTFbcq5|422|Canonical_Registry_ID|422|—|
|recUiLEIDUBTFbcq5|422|Description Detail|Native JS float extraction|—|
|recUiLEIDUBTFbcq5|422|Table Name|[object Object]|—|
|recUiLEIDUBTFbcq5|422|Standardization|—|OK|
|recUiLEIDUBTFbcq5|422|Anomalies|—|OK|
|recUiLEIDUBTFbcq5|422|Field Registry|UNDEFINED|OK|
|recUiLEIDUBTFbcq5|422|Manifest Source Config|484|OK|
|recUiLEIDUBTFbcq5|422|Staging|—|OK|
|recUiLEIDUBTFbcq5|422|Category ID Prefix|—|—|
|recUiLEIDUBTFbcq5|422|CanonicalRegistry|422|OK|
|recUiLEIDUBTFbcq5|422|From field: CanonicalRegistry|422|OK|
|recUiLEIDUBTFbcq5|422|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recJyz4BX1VvbmQb8|424|Field Name|Supplier SKU|—|
|recJyz4BX1VvbmQb8|424|Normalization Fn|TRIM({Supplier_SKU})|—|
|recJyz4BX1VvbmQb8|424|Validation Rule|Not Empty|—|
|recJyz4BX1VvbmQb8|424|Is Required|true|—|
|recJyz4BX1VvbmQb8|424|Example Input|—|—|
|recJyz4BX1VvbmQb8|424|Example Output|—|—|
|recJyz4BX1VvbmQb8|424|Last Modified|2026-03-01T11:27:03.000Z|—|
|recJyz4BX1VvbmQb8|424|Field Type|[object Object]|—|
|recJyz4BX1VvbmQb8|424|Canonical_Registry_ID|424|—|
|recJyz4BX1VvbmQb8|424|Description Detail|The raw, unique alphanumeric identifier provided by the supplier.|—|
|recJyz4BX1VvbmQb8|424|Table Name|[object Object]|—|
|recJyz4BX1VvbmQb8|424|Standardization|—|OK|
|recJyz4BX1VvbmQb8|424|Anomalies|—|OK|
|recJyz4BX1VvbmQb8|424|Field Registry|fldeEd9FiNq5AtGNk, fldK3FyPA98F3smc9|OK|
|recJyz4BX1VvbmQb8|424|Manifest Source Config|476, 492|OK|
|recJyz4BX1VvbmQb8|424|Staging|—|OK|
|recJyz4BX1VvbmQb8|424|Category ID Prefix|—|—|
|recJyz4BX1VvbmQb8|424|CanonicalRegistry|424|OK|
|recJyz4BX1VvbmQb8|424|From field: CanonicalRegistry|424|OK|
|recJyz4BX1VvbmQb8|424|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recaR18eCS2uW6TD5|426|Field Name|Stock Available|—|
|recaR18eCS2uW6TD5|426|Normalization Fn|PARSE_NUMBER({stock_available})|—|
|recaR18eCS2uW6TD5|426|Validation Rule|>= 0, allow 2 decimals|—|
|recaR18eCS2uW6TD5|426|Is Required|—|—|
|recaR18eCS2uW6TD5|426|Example Input|—|—|
|recaR18eCS2uW6TD5|426|Example Output|—|—|
|recaR18eCS2uW6TD5|426|Last Modified|2026-03-01T11:27:03.000Z|—|
|recaR18eCS2uW6TD5|426|Field Type|[object Object]|—|
|recaR18eCS2uW6TD5|426|Canonical_Registry_ID|426|—|
|recaR18eCS2uW6TD5|426|Description Detail|The actual usable inventory on hand at the supplier warehouse.|—|
|recaR18eCS2uW6TD5|426|Table Name|[object Object]|—|
|recaR18eCS2uW6TD5|426|Standardization|—|OK|
|recaR18eCS2uW6TD5|426|Anomalies|—|OK|
|recaR18eCS2uW6TD5|426|Field Registry|fldqPizK5v1z69O7L|OK|
|recaR18eCS2uW6TD5|426|Manifest Source Config|—|OK|
|recaR18eCS2uW6TD5|426|Staging|—|OK|
|recaR18eCS2uW6TD5|426|Category ID Prefix|—|—|
|recaR18eCS2uW6TD5|426|CanonicalRegistry|426|OK|
|recaR18eCS2uW6TD5|426|From field: CanonicalRegistry|426|OK|
|recaR18eCS2uW6TD5|426|Canonical_Registry_ID (from CanonicalRegistry)||—|
|reciEBiaX24gR7hzU|427|Field Name|Stock Reserved|—|
|reciEBiaX24gR7hzU|427|Normalization Fn|PARSE_NUMBER({Stock_Reserved})|—|
|reciEBiaX24gR7hzU|427|Validation Rule|>= 0, allow 2 decimals|—|
|reciEBiaX24gR7hzU|427|Is Required|—|—|
|reciEBiaX24gR7hzU|427|Example Input|—|—|
|reciEBiaX24gR7hzU|427|Example Output|—|—|
|reciEBiaX24gR7hzU|427|Last Modified|2026-03-01T11:27:03.000Z|—|
|reciEBiaX24gR7hzU|427|Field Type|[object Object]|—|
|reciEBiaX24gR7hzU|427|Canonical_Registry_ID|427|—|
|reciEBiaX24gR7hzU|427|Description Detail|Description Detail (Optional): Stock physically in the warehouse but allocated/held for other orders.|—|
|reciEBiaX24gR7hzU|427|Table Name|[object Object]|—|
|reciEBiaX24gR7hzU|427|Standardization|—|OK|
|reciEBiaX24gR7hzU|427|Anomalies|—|OK|
|reciEBiaX24gR7hzU|427|Field Registry|fldslE6XEO2Lqi4Qd|OK|
|reciEBiaX24gR7hzU|427|Manifest Source Config|—|OK|
|reciEBiaX24gR7hzU|427|Staging|—|OK|
|reciEBiaX24gR7hzU|427|Category ID Prefix|—|—|
|reciEBiaX24gR7hzU|427|CanonicalRegistry|427|OK|
|reciEBiaX24gR7hzU|427|From field: CanonicalRegistry|427|OK|
|reciEBiaX24gR7hzU|427|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recnJWOedQLnUiXHs|430|Field Name|Colour Hue Name|—|
|recnJWOedQLnUiXHs|430|Normalization Fn|TRIM({Hue Name})|—|
|recnJWOedQLnUiXHs|430|Validation Rule|Must be a recognizable hue name.|—|
|recnJWOedQLnUiXHs|430|Is Required|—|—|
|recnJWOedQLnUiXHs|430|Example Input|navy-blue|—|
|recnJWOedQLnUiXHs|430|Example Output|Navy Blue|—|
|recnJWOedQLnUiXHs|430|Last Modified|2026-03-05T12:22:41.000Z|—|
|recnJWOedQLnUiXHs|430|Field Type|[object Object]|—|
|recnJWOedQLnUiXHs|430|Canonical_Registry_ID|430|—|
|recnJWOedQLnUiXHs|430|Description Detail|Specific descriptive internal color name for the product.|—|
|recnJWOedQLnUiXHs|430|Table Name|[object Object]|—|
|recnJWOedQLnUiXHs|430|Standardization|60|OK|
|recnJWOedQLnUiXHs|430|Anomalies|—|OK|
|recnJWOedQLnUiXHs|430|Field Registry|recoVExmVGE7WesTj|OK|
|recnJWOedQLnUiXHs|430|Manifest Source Config|—|OK|
|recnJWOedQLnUiXHs|430|Staging|—|OK|
|recnJWOedQLnUiXHs|430|Category ID Prefix|—|—|
|recnJWOedQLnUiXHs|430|CanonicalRegistry|430|OK|
|recnJWOedQLnUiXHs|430|From field: CanonicalRegistry|430|OK|
|recnJWOedQLnUiXHs|430|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recpDeyP4hYCwgszK|431|Field Name|Unit Of Sale|—|
|recpDeyP4hYCwgszK|431|Normalization Fn|SWITCH(UPPER(TRIM({unit_of_sale})), "SQM", "sqm", "M2", "sqm", "PCE", "pce", "PIECE", "pce", "LM", "lm", "BOX", "box", "UNIT", "unit", "Unknown")|—|
|recpDeyP4hYCwgszK|431|Validation Rule|Must be one of: sqm, pce, lm, box, unit|—|
|recpDeyP4hYCwgszK|431|Is Required|—|—|
|recpDeyP4hYCwgszK|431|Example Input|Box|—|
|recpDeyP4hYCwgszK|431|Example Output|box|—|
|recpDeyP4hYCwgszK|431|Last Modified|2026-03-01T11:27:03.000Z|—|
|recpDeyP4hYCwgszK|431|Field Type|[object Object]|—|
|recpDeyP4hYCwgszK|431|Canonical_Registry_ID|431|—|
|recpDeyP4hYCwgszK|431|Description Detail|How this product is sold. Decobella products are typically sold per sqm. Field is a controlled single-select — not derived from price fields. Currency fields (retail_excl, retail_incl, cost\_excl) are now unit-agnostic and always stored as the per-unit price regardless of UOM.|—|
|recpDeyP4hYCwgszK|431|Table Name|[object Object]|—|
|recpDeyP4hYCwgszK|431|Standardization|—|OK|
|recpDeyP4hYCwgszK|431|Anomalies|—|OK|
|recpDeyP4hYCwgszK|431|Field Registry|—|OK|
|recpDeyP4hYCwgszK|431|Manifest Source Config|—|OK|
|recpDeyP4hYCwgszK|431|Staging|—|OK|
|recpDeyP4hYCwgszK|431|Category ID Prefix|—|—|
|recpDeyP4hYCwgszK|431|CanonicalRegistry|431|OK|
|recpDeyP4hYCwgszK|431|From field: CanonicalRegistry|431|OK|
|recpDeyP4hYCwgszK|431|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recVBwlTdTYO7QCrh|432|Field Name|Product Description|—|
|recVBwlTdTYO7QCrh|432|Normalization Fn|TRIM({product_description})|—|
|recVBwlTdTYO7QCrh|432|Validation Rule|LEN(TRIM({product_description})) > 5|—|
|recVBwlTdTYO7QCrh|432|Is Required|—|—|
|recVBwlTdTYO7QCrh|432|Example Input|Agadir Cotto Oscuro 147X147X8.1Mm|—|
|recVBwlTdTYO7QCrh|432|Example Output|Agadir Cotto Oscuro 147X147X8.1Mm|—|
|recVBwlTdTYO7QCrh|432|Last Modified|2026-03-01T11:27:03.000Z|—|
|recVBwlTdTYO7QCrh|432|Field Type|[object Object]|—|
|recVBwlTdTYO7QCrh|432|Canonical_Registry_ID|432|—|
|recVBwlTdTYO7QCrh|432|Description Detail|Utile's own product description. Not supplier-derived. Used for customer-facing display.|—|
|recVBwlTdTYO7QCrh|432|Table Name|[object Object]|—|
|recVBwlTdTYO7QCrh|432|Standardization|—|OK|
|recVBwlTdTYO7QCrh|432|Anomalies|—|OK|
|recVBwlTdTYO7QCrh|432|Field Registry|—|OK|
|recVBwlTdTYO7QCrh|432|Manifest Source Config|494|OK|
|recVBwlTdTYO7QCrh|432|Staging|—|OK|
|recVBwlTdTYO7QCrh|432|Category ID Prefix|—|—|
|recVBwlTdTYO7QCrh|432|CanonicalRegistry|432|OK|
|recVBwlTdTYO7QCrh|432|From field: CanonicalRegistry|432, 768, 796|OK|
|recVBwlTdTYO7QCrh|432|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec0n57n5h2JwsMcJ|433|Field Name|sku_with_route_suffix|—|
|rec0n57n5h2JwsMcJ|433|Normalization Fn|{product_sku} & IF(REGEX_MATCH({ProductRoute}, "\\([A-Z]\\)"), REGEX_EXTRACT({ProductRoute}, "\\(([A-Z])\\)"), "")|—|
|rec0n57n5h2JwsMcJ|433|Validation Rule|System-computed operational SKU. API MUST IGNORE.|—|
|rec0n57n5h2JwsMcJ|433|Is Required|—|—|
|rec0n57n5h2JwsMcJ|433|Example Input|—|—|
|rec0n57n5h2JwsMcJ|433|Example Output|—|—|
|rec0n57n5h2JwsMcJ|433|Last Modified|2026-02-28T11:21:39.000Z|—|
|rec0n57n5h2JwsMcJ|433|Field Type|[object Object]|—|
|rec0n57n5h2JwsMcJ|433|Canonical_Registry_ID|433|—|
|rec0n57n5h2JwsMcJ|433|Description Detail|Full operational SKU including route suffix where applicable. E.g. 1630408402(B). Used for operational PLU generation.|—|
|rec0n57n5h2JwsMcJ|433|Table Name|[object Object]|—|
|rec0n57n5h2JwsMcJ|433|Standardization|—|OK|
|rec0n57n5h2JwsMcJ|433|Anomalies|—|OK|
|rec0n57n5h2JwsMcJ|433|Field Registry|—|OK|
|rec0n57n5h2JwsMcJ|433|Manifest Source Config|—|OK|
|rec0n57n5h2JwsMcJ|433|Staging|—|OK|
|rec0n57n5h2JwsMcJ|433|Category ID Prefix|—|—|
|rec0n57n5h2JwsMcJ|433|CanonicalRegistry|433|OK|
|rec0n57n5h2JwsMcJ|433|From field: CanonicalRegistry|433|OK|
|rec0n57n5h2JwsMcJ|433|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recEwwHHtFChZoKP6|434|Field Name|product_route|—|
|recEwwHHtFChZoKP6|434|Normalization Fn|TRIM({ProductRoute})|—|
|recEwwHHtFChZoKP6|434|Validation Rule|One of: Old Code (Z), New Code (B), Batch (A), Anomaly (2DIG)|—|
|recEwwHHtFChZoKP6|434|Is Required|—|—|
|recEwwHHtFChZoKP6|434|Example Input|—|—|
|recEwwHHtFChZoKP6|434|Example Output|—|—|
|recEwwHHtFChZoKP6|434|Last Modified|2026-02-28T11:21:39.000Z|—|
|recEwwHHtFChZoKP6|434|Field Type|[object Object]|—|
|recEwwHHtFChZoKP6|434|Canonical_Registry_ID|434|—|
|recEwwHHtFChZoKP6|434|Description Detail|Routing flag for PLU logic. Determines suffix appended to SKU. Accepted values align with plu\_suffix in LegacyCodes.|—|
|recEwwHHtFChZoKP6|434|Table Name|[object Object]|—|
|recEwwHHtFChZoKP6|434|Standardization|—|OK|
|recEwwHHtFChZoKP6|434|Anomalies|—|OK|
|recEwwHHtFChZoKP6|434|Field Registry|—|OK|
|recEwwHHtFChZoKP6|434|Manifest Source Config|—|OK|
|recEwwHHtFChZoKP6|434|Staging|—|OK|
|recEwwHHtFChZoKP6|434|Category ID Prefix|—|—|
|recEwwHHtFChZoKP6|434|CanonicalRegistry|434|OK|
|recEwwHHtFChZoKP6|434|From field: CanonicalRegistry|434|OK|
|recEwwHHtFChZoKP6|434|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recyzg7vqKZ8h8MCG|435|Field Name|Supplier Product Data|—|
|recyzg7vqKZ8h8MCG|435|Normalization Fn|—|—|
|recyzg7vqKZ8h8MCG|435|Validation Rule|Many-to-one link to SupplierProductData|—|
|recyzg7vqKZ8h8MCG|435|Is Required|—|—|
|recyzg7vqKZ8h8MCG|435|Example Input|—|—|
|recyzg7vqKZ8h8MCG|435|Example Output|—|—|
|recyzg7vqKZ8h8MCG|435|Last Modified|2026-03-03T19:41:39.000Z|—|
|recyzg7vqKZ8h8MCG|435|Field Type|[object Object]|—|
|recyzg7vqKZ8h8MCG|435|Canonical_Registry_ID|435|—|
|recyzg7vqKZ8h8MCG|435|Description Detail|Links ProductMaster record to its corresponding SupplierProductData record. Field name in table: (to) SupplierProductData.|—|
|recyzg7vqKZ8h8MCG|435|Table Name|[object Object]|—|
|recyzg7vqKZ8h8MCG|435|Standardization|—|OK|
|recyzg7vqKZ8h8MCG|435|Anomalies|—|OK|
|recyzg7vqKZ8h8MCG|435|Field Registry|—|OK|
|recyzg7vqKZ8h8MCG|435|Manifest Source Config|—|OK|
|recyzg7vqKZ8h8MCG|435|Staging|—|OK|
|recyzg7vqKZ8h8MCG|435|Category ID Prefix|—|—|
|recyzg7vqKZ8h8MCG|435|CanonicalRegistry|435|OK|
|recyzg7vqKZ8h8MCG|435|From field: CanonicalRegistry|435, 785, 798|OK|
|recyzg7vqKZ8h8MCG|435|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recsOC4pnBpbu0pcD|436|Field Name|supplier_prod_description_lookup|—|
|recsOC4pnBpbu0pcD|436|Normalization Fn|— looked up from SPD via spd_link|—|
|recsOC4pnBpbu0pcD|436|Validation Rule|Read-only lookup|—|
|recsOC4pnBpbu0pcD|436|Is Required|—|—|
|recsOC4pnBpbu0pcD|436|Example Input|—|—|
|recsOC4pnBpbu0pcD|436|Example Output|—|—|
|recsOC4pnBpbu0pcD|436|Last Modified|2026-02-28T11:21:39.000Z|—|
|recsOC4pnBpbu0pcD|436|Field Type|[object Object]|—|
|recsOC4pnBpbu0pcD|436|Canonical_Registry_ID|436|—|
|recsOC4pnBpbu0pcD|436|Description Detail|Supplier product description pulled from linked SupplierProductData record. For display/comparison only. Field name in table: supplier_prod_description (from product supplier sku).|—|
|recsOC4pnBpbu0pcD|436|Table Name|[object Object]|—|
|recsOC4pnBpbu0pcD|436|Standardization|—|OK|
|recsOC4pnBpbu0pcD|436|Anomalies|—|OK|
|recsOC4pnBpbu0pcD|436|Field Registry|—|OK|
|recsOC4pnBpbu0pcD|436|Manifest Source Config|—|OK|
|recsOC4pnBpbu0pcD|436|Staging|—|OK|
|recsOC4pnBpbu0pcD|436|Category ID Prefix|—|—|
|recsOC4pnBpbu0pcD|436|CanonicalRegistry|436|OK|
|recsOC4pnBpbu0pcD|436|From field: CanonicalRegistry|436|OK|
|recsOC4pnBpbu0pcD|436|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recpNmLzW6FRhNjwP|437|Field Name|unlisted_or_not_found|—|
|recpNmLzW6FRhNjwP|437|Normalization Fn|Boolean|—|
|recpNmLzW6FRhNjwP|437|Validation Rule|true/false|—|
|recpNmLzW6FRhNjwP|437|Is Required|—|—|
|recpNmLzW6FRhNjwP|437|Example Input|—|—|
|recpNmLzW6FRhNjwP|437|Example Output|—|—|
|recpNmLzW6FRhNjwP|437|Last Modified|2026-02-28T11:21:39.000Z|—|
|recpNmLzW6FRhNjwP|437|Field Type|[object Object]|—|
|recpNmLzW6FRhNjwP|437|Canonical_Registry_ID|437|—|
|recpNmLzW6FRhNjwP|437|Description Detail|Flag set when a product SKU cannot be matched to a supplier code or is not listed in any active pricelist. Triggers review workflow.|—|
|recpNmLzW6FRhNjwP|437|Table Name|[object Object]|—|
|recpNmLzW6FRhNjwP|437|Standardization|—|OK|
|recpNmLzW6FRhNjwP|437|Anomalies|—|OK|
|recpNmLzW6FRhNjwP|437|Field Registry|—|OK|
|recpNmLzW6FRhNjwP|437|Manifest Source Config|—|OK|
|recpNmLzW6FRhNjwP|437|Staging|—|OK|
|recpNmLzW6FRhNjwP|437|Category ID Prefix|—|—|
|recpNmLzW6FRhNjwP|437|CanonicalRegistry|437|OK|
|recpNmLzW6FRhNjwP|437|From field: CanonicalRegistry|437|OK|
|recpNmLzW6FRhNjwP|437|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recNwDFsC5rQLIQwx|441|Field Name|last_modified_date|—|
|recNwDFsC5rQLIQwx|441|Normalization Fn|AUTO — system-managed lastModifiedTime|—|
|recNwDFsC5rQLIQwx|441|Validation Rule|Read-only|—|
|recNwDFsC5rQLIQwx|441|Is Required|—|—|
|recNwDFsC5rQLIQwx|441|Example Input|—|—|
|recNwDFsC5rQLIQwx|441|Example Output|—|—|
|recNwDFsC5rQLIQwx|441|Last Modified|2026-02-28T11:21:39.000Z|—|
|recNwDFsC5rQLIQwx|441|Field Type|[object Object]|—|
|recNwDFsC5rQLIQwx|441|Canonical_Registry_ID|441|—|
|recNwDFsC5rQLIQwx|441|Description Detail|System-managed timestamp. Auto-updates whenever any field on the record is edited. Used for audit and sync tracking.|—|
|recNwDFsC5rQLIQwx|441|Table Name|[object Object]|—|
|recNwDFsC5rQLIQwx|441|Standardization|—|OK|
|recNwDFsC5rQLIQwx|441|Anomalies|—|OK|
|recNwDFsC5rQLIQwx|441|Field Registry|—|OK|
|recNwDFsC5rQLIQwx|441|Manifest Source Config|—|OK|
|recNwDFsC5rQLIQwx|441|Staging|—|OK|
|recNwDFsC5rQLIQwx|441|Category ID Prefix|—|—|
|recNwDFsC5rQLIQwx|441|CanonicalRegistry|441|OK|
|recNwDFsC5rQLIQwx|441|From field: CanonicalRegistry|441|OK|
|recNwDFsC5rQLIQwx|441|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recM4dQKvsNbJhb2w|442|Field Name|updated_status_or_commented_last|—|
|recM4dQKvsNbJhb2w|442|Normalization Fn|AUTO — lastModifiedTime scoped to status/comments fields|—|
|recM4dQKvsNbJhb2w|442|Validation Rule|Read-only|—|
|recM4dQKvsNbJhb2w|442|Is Required|—|—|
|recM4dQKvsNbJhb2w|442|Example Input|—|—|
|recM4dQKvsNbJhb2w|442|Example Output|—|—|
|recM4dQKvsNbJhb2w|442|Last Modified|2026-02-28T11:21:39.000Z|—|
|recM4dQKvsNbJhb2w|442|Field Type|[object Object]|—|
|recM4dQKvsNbJhb2w|442|Canonical_Registry_ID|442|—|
|recM4dQKvsNbJhb2w|442|Description Detail|Tracks when product\_status or comments was last changed. Useful for identifying stale records needing review.|—|
|recM4dQKvsNbJhb2w|442|Table Name|[object Object]|—|
|recM4dQKvsNbJhb2w|442|Standardization|—|OK|
|recM4dQKvsNbJhb2w|442|Anomalies|—|OK|
|recM4dQKvsNbJhb2w|442|Field Registry|—|OK|
|recM4dQKvsNbJhb2w|442|Manifest Source Config|—|OK|
|recM4dQKvsNbJhb2w|442|Staging|—|OK|
|recM4dQKvsNbJhb2w|442|Category ID Prefix|—|—|
|recM4dQKvsNbJhb2w|442|CanonicalRegistry|442|OK|
|recM4dQKvsNbJhb2w|442|From field: CanonicalRegistry|442|OK|
|recM4dQKvsNbJhb2w|442|Canonical_Registry_ID (from CanonicalRegistry)||—|
|reclI7Q5V5WxLnxbX|447|Field Name|supplier_lookup|—|
|reclI7Q5V5WxLnxbX|447|Normalization Fn|looked up via supplierlink|—|
|reclI7Q5V5WxLnxbX|447|Validation Rule|Read-only|—|
|reclI7Q5V5WxLnxbX|447|Is Required|—|—|
|reclI7Q5V5WxLnxbX|447|Example Input|—|—|
|reclI7Q5V5WxLnxbX|447|Example Output|—|—|
|reclI7Q5V5WxLnxbX|447|Last Modified|2026-02-28T11:21:39.000Z|—|
|reclI7Q5V5WxLnxbX|447|Field Type|[object Object]|—|
|reclI7Q5V5WxLnxbX|447|Canonical_Registry_ID|447|—|
|reclI7Q5V5WxLnxbX|447|Description Detail|Supplier name looked up from Supplier table via supplierlink. Display only.|—|
|reclI7Q5V5WxLnxbX|447|Table Name|[object Object]|—|
|reclI7Q5V5WxLnxbX|447|Standardization|—|OK|
|reclI7Q5V5WxLnxbX|447|Anomalies|—|OK|
|reclI7Q5V5WxLnxbX|447|Field Registry|—|OK|
|reclI7Q5V5WxLnxbX|447|Manifest Source Config|—|OK|
|reclI7Q5V5WxLnxbX|447|Staging|—|OK|
|reclI7Q5V5WxLnxbX|447|Category ID Prefix|—|—|
|reclI7Q5V5WxLnxbX|447|CanonicalRegistry|447|OK|
|reclI7Q5V5WxLnxbX|447|From field: CanonicalRegistry|447|OK|
|reclI7Q5V5WxLnxbX|447|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recQCkC0N5C4OLkBi|448|Field Name|supplierlink|—|
|recQCkC0N5C4OLkBi|448|Normalization Fn|n/a|—|
|recQCkC0N5C4OLkBi|448|Validation Rule|Many-to-one link to Supplier table|—|
|recQCkC0N5C4OLkBi|448|Is Required|—|—|
|recQCkC0N5C4OLkBi|448|Example Input|—|—|
|recQCkC0N5C4OLkBi|448|Example Output|—|—|
|recQCkC0N5C4OLkBi|448|Last Modified|2026-02-28T11:21:39.000Z|—|
|recQCkC0N5C4OLkBi|448|Field Type|[object Object]|—|
|recQCkC0N5C4OLkBi|448|Canonical_Registry_ID|448|—|
|recQCkC0N5C4OLkBi|448|Description Detail|Direct link from ProductMaster to the Supplier table. Source of truth for supplier identity on the product record.|—|
|recQCkC0N5C4OLkBi|448|Table Name|[object Object]|—|
|recQCkC0N5C4OLkBi|448|Standardization|—|OK|
|recQCkC0N5C4OLkBi|448|Anomalies|—|OK|
|recQCkC0N5C4OLkBi|448|Field Registry|fldhYMKeVijNr36Fs|OK|
|recQCkC0N5C4OLkBi|448|Manifest Source Config|—|OK|
|recQCkC0N5C4OLkBi|448|Staging|—|OK|
|recQCkC0N5C4OLkBi|448|Category ID Prefix|—|—|
|recQCkC0N5C4OLkBi|448|CanonicalRegistry|448|OK|
|recQCkC0N5C4OLkBi|448|From field: CanonicalRegistry|448|OK|
|recQCkC0N5C4OLkBi|448|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recHfuIhgiEiB8tem|449|Field Name|comments|—|
|recHfuIhgiEiB8tem|449|Normalization Fn|TRIM({comments})|—|
|recHfuIhgiEiB8tem|449|Validation Rule|optional|—|
|recHfuIhgiEiB8tem|449|Is Required|—|—|
|recHfuIhgiEiB8tem|449|Example Input|—|—|
|recHfuIhgiEiB8tem|449|Example Output|—|—|
|recHfuIhgiEiB8tem|449|Last Modified|2026-02-28T11:21:39.000Z|—|
|recHfuIhgiEiB8tem|449|Field Type|[object Object]|—|
|recHfuIhgiEiB8tem|449|Canonical_Registry_ID|449|—|
|recHfuIhgiEiB8tem|449|Description Detail|Internal notes on the product. Not customer-facing. Used for operational context, sourcing notes, or known issues.|—|
|recHfuIhgiEiB8tem|449|Table Name|[object Object]|—|
|recHfuIhgiEiB8tem|449|Standardization|—|OK|
|recHfuIhgiEiB8tem|449|Anomalies|—|OK|
|recHfuIhgiEiB8tem|449|Field Registry|—|OK|
|recHfuIhgiEiB8tem|449|Manifest Source Config|—|OK|
|recHfuIhgiEiB8tem|449|Staging|—|OK|
|recHfuIhgiEiB8tem|449|Category ID Prefix|—|—|
|recHfuIhgiEiB8tem|449|CanonicalRegistry|449|OK|
|recHfuIhgiEiB8tem|449|From field: CanonicalRegistry|449|OK|
|recHfuIhgiEiB8tem|449|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recAq2kEOxRRIzVF5|453|Field Name|use_pool_suitable|—|
|recAq2kEOxRRIzVF5|453|Normalization Fn|PROPER(TRIM({use_pool_suitable}))|—|
|recAq2kEOxRRIzVF5|453|Validation Rule|Must be one of: Not Pool Suitable, Pool Suitable Below Scumline, Pool Suitable Anti Slip, Unknown|—|
|recAq2kEOxRRIzVF5|453|Is Required|—|—|
|recAq2kEOxRRIzVF5|453|Example Input|—|—|
|recAq2kEOxRRIzVF5|453|Example Output|—|—|
|recAq2kEOxRRIzVF5|453|Last Modified|2026-02-28T11:21:39.000Z|—|
|recAq2kEOxRRIzVF5|453|Field Type|[object Object]|—|
|recAq2kEOxRRIzVF5|453|Canonical_Registry_ID|453|—|
|recAq2kEOxRRIzVF5|453|Description Detail|Pool suitability rating. Required for any product marketed for wet/outdoor use.|—|
|recAq2kEOxRRIzVF5|453|Table Name|[object Object]|—|
|recAq2kEOxRRIzVF5|453|Standardization|—|OK|
|recAq2kEOxRRIzVF5|453|Anomalies|—|OK|
|recAq2kEOxRRIzVF5|453|Field Registry|—|OK|
|recAq2kEOxRRIzVF5|453|Manifest Source Config|—|OK|
|recAq2kEOxRRIzVF5|453|Staging|—|OK|
|recAq2kEOxRRIzVF5|453|Category ID Prefix|—|—|
|recAq2kEOxRRIzVF5|453|CanonicalRegistry|453|OK|
|recAq2kEOxRRIzVF5|453|From field: CanonicalRegistry|453|OK|
|recAq2kEOxRRIzVF5|453|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recRZXIhiwti4TgNU|454|Field Name|product_ref_image|—|
|recRZXIhiwti4TgNU|454|Normalization Fn|n/a|—|
|recRZXIhiwti4TgNU|454|Validation Rule|Many-to-many link to DAM table|—|
|recRZXIhiwti4TgNU|454|Is Required|—|—|
|recRZXIhiwti4TgNU|454|Example Input|—|—|
|recRZXIhiwti4TgNU|454|Example Output|—|—|
|recRZXIhiwti4TgNU|454|Last Modified|2026-02-28T11:21:39.000Z|—|
|recRZXIhiwti4TgNU|454|Field Type|[object Object]|—|
|recRZXIhiwti4TgNU|454|Canonical_Registry_ID|454|—|
|recRZXIhiwti4TgNU|454|Description Detail|Links to the DAM (Digital Asset Management) table for the product's reference image. Source for img_product_cutouts_from_product_ref_image lookup.|—|
|recRZXIhiwti4TgNU|454|Table Name|[object Object]|—|
|recRZXIhiwti4TgNU|454|Standardization|—|OK|
|recRZXIhiwti4TgNU|454|Anomalies|—|OK|
|recRZXIhiwti4TgNU|454|Field Registry|—|OK|
|recRZXIhiwti4TgNU|454|Manifest Source Config|—|OK|
|recRZXIhiwti4TgNU|454|Staging|—|OK|
|recRZXIhiwti4TgNU|454|Category ID Prefix|MED_Ref_Image|—|
|recRZXIhiwti4TgNU|454|CanonicalRegistry|454|OK|
|recRZXIhiwti4TgNU|454|From field: CanonicalRegistry|454|OK|
|recRZXIhiwti4TgNU|454|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recXM8j4O11iLZZ3w|455|Field Name|img_product_cutouts|—|
|recXM8j4O11iLZZ3w|455|Normalization Fn|n/a — looked up via product_ref_image → DAM|—|
|recXM8j4O11iLZZ3w|455|Validation Rule|Read-only attachment lookup|—|
|recXM8j4O11iLZZ3w|455|Is Required|—|—|
|recXM8j4O11iLZZ3w|455|Example Input|—|—|
|recXM8j4O11iLZZ3w|455|Example Output|—|—|
|recXM8j4O11iLZZ3w|455|Last Modified|2026-02-28T11:21:39.000Z|—|
|recXM8j4O11iLZZ3w|455|Field Type|[object Object]|—|
|recXM8j4O11iLZZ3w|455|Canonical_Registry_ID|455|—|
|recXM8j4O11iLZZ3w|455|Description Detail|Product cutout images pulled from the DAM via product_ref_image link. Used for catalogue and e-commerce display.|—|
|recXM8j4O11iLZZ3w|455|Table Name|[object Object]|—|
|recXM8j4O11iLZZ3w|455|Standardization|—|OK|
|recXM8j4O11iLZZ3w|455|Anomalies|—|OK|
|recXM8j4O11iLZZ3w|455|Field Registry|—|OK|
|recXM8j4O11iLZZ3w|455|Manifest Source Config|—|OK|
|recXM8j4O11iLZZ3w|455|Staging|—|OK|
|recXM8j4O11iLZZ3w|455|Category ID Prefix|MED_Product_Cutout|—|
|recXM8j4O11iLZZ3w|455|CanonicalRegistry|455|OK|
|recXM8j4O11iLZZ3w|455|From field: CanonicalRegistry|455|OK|
|recXM8j4O11iLZZ3w|455|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recaq9GOsx5ac12PN|458|Field Name|supplier_product_data_ref|—|
|recaq9GOsx5ac12PN|458|Normalization Fn|TRIM({SUPPLIER_PRODUCT_DATA})|—|
|recaq9GOsx5ac12PN|458|Validation Rule|optional; internal cross-reference text|—|
|recaq9GOsx5ac12PN|458|Is Required|—|—|
|recaq9GOsx5ac12PN|458|Example Input|—|—|
|recaq9GOsx5ac12PN|458|Example Output|—|—|
|recaq9GOsx5ac12PN|458|Last Modified|2026-02-28T11:21:39.000Z|—|
|recaq9GOsx5ac12PN|458|Field Type|[object Object]|—|
|recaq9GOsx5ac12PN|458|Canonical_Registry_ID|458|—|
|recaq9GOsx5ac12PN|458|Description Detail|Text reference field on ProductMaster pointing to a SPD identifier. Separate from the (to) SupplierProductData link field. Used for manual cross-reference or import tracing.|—|
|recaq9GOsx5ac12PN|458|Table Name|[object Object]|—|
|recaq9GOsx5ac12PN|458|Standardization|—|OK|
|recaq9GOsx5ac12PN|458|Anomalies|—|OK|
|recaq9GOsx5ac12PN|458|Field Registry|—|OK|
|recaq9GOsx5ac12PN|458|Manifest Source Config|—|OK|
|recaq9GOsx5ac12PN|458|Staging|—|OK|
|recaq9GOsx5ac12PN|458|Category ID Prefix|—|—|
|recaq9GOsx5ac12PN|458|CanonicalRegistry|458|OK|
|recaq9GOsx5ac12PN|458|From field: CanonicalRegistry|458|OK|
|recaq9GOsx5ac12PN|458|Canonical_Registry_ID (from CanonicalRegistry)||—|
|reca59asyus13vTrh|460|Field Name|pm_anomalies|—|
|reca59asyus13vTrh|460|Normalization Fn|n/a|—|
|reca59asyus13vTrh|460|Validation Rule|Many-to-many link to Anomalies table|—|
|reca59asyus13vTrh|460|Is Required|—|—|
|reca59asyus13vTrh|460|Example Input|—|—|
|reca59asyus13vTrh|460|Example Output|—|—|
|reca59asyus13vTrh|460|Last Modified|2026-02-28T11:21:39.000Z|—|
|reca59asyus13vTrh|460|Field Type|[object Object]|—|
|reca59asyus13vTrh|460|Canonical_Registry_ID|460|—|
|reca59asyus13vTrh|460|Description Detail|Links ProductMaster record to any logged anomalies. Used by QA and error tracking workflows.|—|
|reca59asyus13vTrh|460|Table Name|[object Object]|—|
|reca59asyus13vTrh|460|Standardization|—|OK|
|reca59asyus13vTrh|460|Anomalies|—|OK|
|reca59asyus13vTrh|460|Field Registry|—|OK|
|reca59asyus13vTrh|460|Manifest Source Config|—|OK|
|reca59asyus13vTrh|460|Staging|—|OK|
|reca59asyus13vTrh|460|Category ID Prefix|—|—|
|reca59asyus13vTrh|460|CanonicalRegistry|460|OK|
|reca59asyus13vTrh|460|From field: CanonicalRegistry|460|OK|
|reca59asyus13vTrh|460|Canonical_Registry_ID (from CanonicalRegistry)||—|
|receveZoVO5kuzRNQ|463|Field Name|spd_link_from_pm|—|
|receveZoVO5kuzRNQ|463|Normalization Fn|n/a|—|
|receveZoVO5kuzRNQ|463|Validation Rule|Many-to-one link to SupplierProductData. Field name in table: (to) SupplierProductData.|—|
|receveZoVO5kuzRNQ|463|Is Required|—|—|
|receveZoVO5kuzRNQ|463|Example Input|—|—|
|receveZoVO5kuzRNQ|463|Example Output|—|—|
|receveZoVO5kuzRNQ|463|Last Modified|2026-02-28T11:21:39.000Z|—|
|receveZoVO5kuzRNQ|463|Field Type|[object Object]|—|
|receveZoVO5kuzRNQ|463|Canonical_Registry_ID|463|—|
|receveZoVO5kuzRNQ|463|Description Detail|Links a ProductMaster record to its SupplierProductData record. Core relationship field. Drives all SPD lookups on PM.|—|
|receveZoVO5kuzRNQ|463|Table Name|[object Object]|—|
|receveZoVO5kuzRNQ|463|Standardization|—|OK|
|receveZoVO5kuzRNQ|463|Anomalies|—|OK|
|receveZoVO5kuzRNQ|463|Field Registry|—|OK|
|receveZoVO5kuzRNQ|463|Manifest Source Config|—|OK|
|receveZoVO5kuzRNQ|463|Staging|—|OK|
|receveZoVO5kuzRNQ|463|Category ID Prefix|—|—|
|receveZoVO5kuzRNQ|463|CanonicalRegistry|463|OK|
|receveZoVO5kuzRNQ|463|From field: CanonicalRegistry|463|OK|
|receveZoVO5kuzRNQ|463|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recndQm2THAlNgibk|464|Field Name|pm_unlisted_flag|—|
|recndQm2THAlNgibk|464|Normalization Fn|Boolean|—|
|recndQm2THAlNgibk|464|Validation Rule|true/false|—|
|recndQm2THAlNgibk|464|Is Required|—|—|
|recndQm2THAlNgibk|464|Example Input|—|—|
|recndQm2THAlNgibk|464|Example Output|—|—|
|recndQm2THAlNgibk|464|Last Modified|2026-02-28T11:21:39.000Z|—|
|recndQm2THAlNgibk|464|Field Type|[object Object]|—|
|recndQm2THAlNgibk|464|Canonical_Registry_ID|464|—|
|recndQm2THAlNgibk|464|Description Detail|Field name in table: UNLISTED OR CODE NOT FOUND. Checked when a product cannot be matched to any active supplier pricelist entry. Triggers manual review.|—|
|recndQm2THAlNgibk|464|Table Name|[object Object]|—|
|recndQm2THAlNgibk|464|Standardization|—|OK|
|recndQm2THAlNgibk|464|Anomalies|—|OK|
|recndQm2THAlNgibk|464|Field Registry|—|OK|
|recndQm2THAlNgibk|464|Manifest Source Config|—|OK|
|recndQm2THAlNgibk|464|Staging|—|OK|
|recndQm2THAlNgibk|464|Category ID Prefix|—|—|
|recndQm2THAlNgibk|464|CanonicalRegistry|464|OK|
|recndQm2THAlNgibk|464|From field: CanonicalRegistry|464|OK|
|recndQm2THAlNgibk|464|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recFtT0RcmT0MK2Jp|468|Field Name|spd_anomalies_link|—|
|recFtT0RcmT0MK2Jp|468|Normalization Fn|n/a|—|
|recFtT0RcmT0MK2Jp|468|Validation Rule|Many-to-many link to Anomalies table|—|
|recFtT0RcmT0MK2Jp|468|Is Required|—|—|
|recFtT0RcmT0MK2Jp|468|Example Input|—|—|
|recFtT0RcmT0MK2Jp|468|Example Output|—|—|
|recFtT0RcmT0MK2Jp|468|Last Modified|2026-02-28T11:21:39.000Z|—|
|recFtT0RcmT0MK2Jp|468|Field Type|[object Object]|—|
|recFtT0RcmT0MK2Jp|468|Canonical_Registry_ID|468|—|
|recFtT0RcmT0MK2Jp|468|Description Detail|Field name in table: anomalies. Links SPD record to any logged anomalies. Mirrors the same relationship on ProductMaster.|—|
|recFtT0RcmT0MK2Jp|468|Table Name|[object Object]|—|
|recFtT0RcmT0MK2Jp|468|Standardization|—|OK|
|recFtT0RcmT0MK2Jp|468|Anomalies|—|OK|
|recFtT0RcmT0MK2Jp|468|Field Registry|—|OK|
|recFtT0RcmT0MK2Jp|468|Manifest Source Config|—|OK|
|recFtT0RcmT0MK2Jp|468|Staging|—|OK|
|recFtT0RcmT0MK2Jp|468|Category ID Prefix|—|—|
|recFtT0RcmT0MK2Jp|468|CanonicalRegistry|468|OK|
|recFtT0RcmT0MK2Jp|468|From field: CanonicalRegistry|468|OK|
|recFtT0RcmT0MK2Jp|468|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recT48ohL8mvBjICG|479|Field Name|Kg Box|—|
|recT48ohL8mvBjICG|479|Normalization Fn|Delegated to JS parseNumeric()|—|
|recT48ohL8mvBjICG|479|Validation Rule|Numeric >= 0|—|
|recT48ohL8mvBjICG|479|Is Required|—|—|
|recT48ohL8mvBjICG|479|Example Input|—|—|
|recT48ohL8mvBjICG|479|Example Output|—|—|
|recT48ohL8mvBjICG|479|Last Modified|2026-03-12T02:29:22.000Z|—|
|recT48ohL8mvBjICG|479|Field Type|[object Object]|—|
|recT48ohL8mvBjICG|479|Canonical_Registry_ID|479|—|
|recT48ohL8mvBjICG|479|Description Detail|Native JS float extraction|—|
|recT48ohL8mvBjICG|479|Table Name|[object Object]|—|
|recT48ohL8mvBjICG|479|Standardization|—|OK|
|recT48ohL8mvBjICG|479|Anomalies|—|OK|
|recT48ohL8mvBjICG|479|Field Registry|fldS2mZdWoY7hPU3G|OK|
|recT48ohL8mvBjICG|479|Manifest Source Config|499|OK|
|recT48ohL8mvBjICG|479|Staging|—|OK|
|recT48ohL8mvBjICG|479|Category ID Prefix|—|—|
|recT48ohL8mvBjICG|479|CanonicalRegistry|479|OK|
|recT48ohL8mvBjICG|479|From field: CanonicalRegistry|479|OK|
|recT48ohL8mvBjICG|479|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recMGJLP182ov49Jh|480|Field Name|Box Pallet|—|
|recMGJLP182ov49Jh|480|Normalization Fn|Delegated to JS parseNumeric()|—|
|recMGJLP182ov49Jh|480|Validation Rule|Integer >= 0|—|
|recMGJLP182ov49Jh|480|Is Required|—|—|
|recMGJLP182ov49Jh|480|Example Input|—|—|
|recMGJLP182ov49Jh|480|Example Output|—|—|
|recMGJLP182ov49Jh|480|Last Modified|2026-03-12T02:29:22.000Z|—|
|recMGJLP182ov49Jh|480|Field Type|[object Object]|—|
|recMGJLP182ov49Jh|480|Canonical_Registry_ID|480|—|
|recMGJLP182ov49Jh|480|Description Detail|Native JS float extraction|—|
|recMGJLP182ov49Jh|480|Table Name|[object Object]|—|
|recMGJLP182ov49Jh|480|Standardization|—|OK|
|recMGJLP182ov49Jh|480|Anomalies|—|OK|
|recMGJLP182ov49Jh|480|Field Registry|fld8Qz10GgXiS6Da5|OK|
|recMGJLP182ov49Jh|480|Manifest Source Config|500|OK|
|recMGJLP182ov49Jh|480|Staging|—|OK|
|recMGJLP182ov49Jh|480|Category ID Prefix|—|—|
|recMGJLP182ov49Jh|480|CanonicalRegistry|480|OK|
|recMGJLP182ov49Jh|480|From field: CanonicalRegistry|480|OK|
|recMGJLP182ov49Jh|480|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recgRrGArp9aUat3z|481|Field Name|Sqm Pallet|—|
|recgRrGArp9aUat3z|481|Normalization Fn|Delegated to JS parseNumeric()|—|
|recgRrGArp9aUat3z|481|Validation Rule|Numeric >= 0|—|
|recgRrGArp9aUat3z|481|Is Required|—|—|
|recgRrGArp9aUat3z|481|Example Input|—|—|
|recgRrGArp9aUat3z|481|Example Output|—|—|
|recgRrGArp9aUat3z|481|Last Modified|2026-03-12T02:29:22.000Z|—|
|recgRrGArp9aUat3z|481|Field Type|[object Object]|—|
|recgRrGArp9aUat3z|481|Canonical_Registry_ID|481|—|
|recgRrGArp9aUat3z|481|Description Detail|Native JS float extraction|—|
|recgRrGArp9aUat3z|481|Table Name|[object Object]|—|
|recgRrGArp9aUat3z|481|Standardization|—|OK|
|recgRrGArp9aUat3z|481|Anomalies|—|OK|
|recgRrGArp9aUat3z|481|Field Registry|fldf5VU6KDd2cSqUB|OK|
|recgRrGArp9aUat3z|481|Manifest Source Config|501|OK|
|recgRrGArp9aUat3z|481|Staging|—|OK|
|recgRrGArp9aUat3z|481|Category ID Prefix|—|—|
|recgRrGArp9aUat3z|481|CanonicalRegistry|481|OK|
|recgRrGArp9aUat3z|481|From field: CanonicalRegistry|481|OK|
|recgRrGArp9aUat3z|481|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recEwN99nOywrH9Dv|483|Field Name|Supplier Body Finish|—|
|recEwN99nOywrH9Dv|483|Normalization Fn|Delegated to Dynamic Standardization Engine|—|
|recEwN99nOywrH9Dv|483|Validation Rule|Must match Standardization Table|—|
|recEwN99nOywrH9Dv|483|Is Required|—|—|
|recEwN99nOywrH9Dv|483|Example Input|8,6Mm|—|
|recEwN99nOywrH9Dv|483|Example Output|8.6mm|—|
|recEwN99nOywrH9Dv|483|Last Modified|2026-03-12T02:29:22.000Z|—|
|recEwN99nOywrH9Dv|483|Field Type|[object Object]|—|
|recEwN99nOywrH9Dv|483|Canonical_Registry_ID|483|—|
|recEwN99nOywrH9Dv|483|Description Detail|Governed by exact match Dictionary|—|
|recEwN99nOywrH9Dv|483|Table Name|[object Object]|—|
|recEwN99nOywrH9Dv|483|Standardization|—|OK|
|recEwN99nOywrH9Dv|483|Anomalies|—|OK|
|recEwN99nOywrH9Dv|483|Field Registry|fld4QhEwwFSgFsHRB, recTtIpziWyBMQgbo|OK|
|recEwN99nOywrH9Dv|483|Manifest Source Config|486|OK|
|recEwN99nOywrH9Dv|483|Staging|—|OK|
|recEwN99nOywrH9Dv|483|Category ID Prefix|—|—|
|recEwN99nOywrH9Dv|483|CanonicalRegistry|483|OK|
|recEwN99nOywrH9Dv|483|From field: CanonicalRegistry|483|OK|
|recEwN99nOywrH9Dv|483|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recvwB57c5wIMOrc5|494|Field Name|Actual Selling Price|—|
|recvwB57c5wIMOrc5|494|Normalization Fn|Calculated based on Cost + Margin, or Manual Override.|—|
|recvwB57c5wIMOrc5|494|Validation Rule|>= 0, 2 decimals.|—|
|recvwB57c5wIMOrc5|494|Is Required|—|—|
|recvwB57c5wIMOrc5|494|Example Input|—|—|
|recvwB57c5wIMOrc5|494|Example Output|—|—|
|recvwB57c5wIMOrc5|494|Last Modified|2026-03-02T13:58:14.000Z|—|
|recvwB57c5wIMOrc5|494|Field Type|[object Object]|—|
|recvwB57c5wIMOrc5|494|Canonical_Registry_ID|494|—|
|recvwB57c5wIMOrc5|494|Description Detail|Finalized price Utile sells for.|—|
|recvwB57c5wIMOrc5|494|Table Name|[object Object]|—|
|recvwB57c5wIMOrc5|494|Standardization|—|OK|
|recvwB57c5wIMOrc5|494|Anomalies|—|OK|
|recvwB57c5wIMOrc5|494|Field Registry|—|OK|
|recvwB57c5wIMOrc5|494|Manifest Source Config|—|OK|
|recvwB57c5wIMOrc5|494|Staging|—|OK|
|recvwB57c5wIMOrc5|494|Category ID Prefix|—|—|
|recvwB57c5wIMOrc5|494|CanonicalRegistry|494|OK|
|recvwB57c5wIMOrc5|494|From field: CanonicalRegistry|494|OK|
|recvwB57c5wIMOrc5|494|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recgbXCjcl3H3amQP|495|Field Name|Cost|—|
|recgbXCjcl3H3amQP|495|Normalization Fn|Manual input or formula (SRP - Trade Discount).|—|
|recgbXCjcl3H3amQP|495|Validation Rule|>= 0, 2 decimals.|—|
|recgbXCjcl3H3amQP|495|Is Required|—|—|
|recgbXCjcl3H3amQP|495|Example Input|—|—|
|recgbXCjcl3H3amQP|495|Example Output|—|—|
|recgbXCjcl3H3amQP|495|Last Modified|2026-03-02T13:58:14.000Z|—|
|recgbXCjcl3H3amQP|495|Field Type|[object Object]|—|
|recgbXCjcl3H3amQP|495|Canonical_Registry_ID|495|—|
|recgbXCjcl3H3amQP|495|Description Detail|Utile's actual cost for the item.|—|
|recgbXCjcl3H3amQP|495|Table Name|[object Object]|—|
|recgbXCjcl3H3amQP|495|Standardization|—|OK|
|recgbXCjcl3H3amQP|495|Anomalies|—|OK|
|recgbXCjcl3H3amQP|495|Field Registry|—|OK|
|recgbXCjcl3H3amQP|495|Manifest Source Config|—|OK|
|recgbXCjcl3H3amQP|495|Staging|—|OK|
|recgbXCjcl3H3amQP|495|Category ID Prefix|—|—|
|recgbXCjcl3H3amQP|495|CanonicalRegistry|495|OK|
|recgbXCjcl3H3amQP|495|From field: CanonicalRegistry|495|OK|
|recgbXCjcl3H3amQP|495|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recbGXelM1sElDKyg|496|Field Name|Margin|—|
|recbGXelM1sElDKyg|496|Normalization Fn|Manual input.|—|
|recbGXelM1sElDKyg|496|Validation Rule|>= 0%. Margin Max >= Margin Min.|—|
|recbGXelM1sElDKyg|496|Is Required|—|—|
|recbGXelM1sElDKyg|496|Example Input|—|—|
|recbGXelM1sElDKyg|496|Example Output|—|—|
|recbGXelM1sElDKyg|496|Last Modified|2026-03-03T21:10:10.000Z|—|
|recbGXelM1sElDKyg|496|Field Type|[object Object]|—|
|recbGXelM1sElDKyg|496|Canonical_Registry_ID|496|—|
|recbGXelM1sElDKyg|496|Description Detail|Minimum and maximum acceptable profit margins for pricing guardrails.|—|
|recbGXelM1sElDKyg|496|Table Name|[object Object]|—|
|recbGXelM1sElDKyg|496|Standardization|—|OK|
|recbGXelM1sElDKyg|496|Anomalies|—|OK|
|recbGXelM1sElDKyg|496|Field Registry|—|OK|
|recbGXelM1sElDKyg|496|Manifest Source Config|—|OK|
|recbGXelM1sElDKyg|496|Staging|—|OK|
|recbGXelM1sElDKyg|496|Category ID Prefix|—|—|
|recbGXelM1sElDKyg|496|CanonicalRegistry|496|OK|
|recbGXelM1sElDKyg|496|From field: CanonicalRegistry|496|OK|
|recbGXelM1sElDKyg|496|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recBVoSIlwNsV8t71|497|Field Name|price_type|—|
|recBVoSIlwNsV8t71|497|Normalization Fn|INTERNAL SELECTION — Value must match one of the approved options. No transformation from source.|—|
|recBVoSIlwNsV8t71|497|Validation Rule|Must be one of: Standard, Sample, Sample supplier-charged.|—|
|recBVoSIlwNsV8t71|497|Is Required|—|—|
|recBVoSIlwNsV8t71|497|Example Input|—|—|
|recBVoSIlwNsV8t71|497|Example Output|—|—|
|recBVoSIlwNsV8t71|497|Last Modified|2026-03-02T13:58:14.000Z|—|
|recBVoSIlwNsV8t71|497|Field Type|[object Object]|—|
|recBVoSIlwNsV8t71|497|Canonical_Registry_ID|497|—|
|recBVoSIlwNsV8t71|497|Description Detail|Governs if this price applies to standard stock or individual samples.|—|
|recBVoSIlwNsV8t71|497|Table Name|[object Object]|—|
|recBVoSIlwNsV8t71|497|Standardization|—|OK|
|recBVoSIlwNsV8t71|497|Anomalies|—|OK|
|recBVoSIlwNsV8t71|497|Field Registry|—|OK|
|recBVoSIlwNsV8t71|497|Manifest Source Config|—|OK|
|recBVoSIlwNsV8t71|497|Staging|—|OK|
|recBVoSIlwNsV8t71|497|Category ID Prefix|—|—|
|recBVoSIlwNsV8t71|497|CanonicalRegistry|497|OK|
|recBVoSIlwNsV8t71|497|From field: CanonicalRegistry|497|OK|
|recBVoSIlwNsV8t71|497|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec5XcrCIwDnhWFnC|498|Field Name|Effective_Date|—|
|rec5XcrCIwDnhWFnC|498|Normalization Fn|AUTO — system-managed.|—|
|rec5XcrCIwDnhWFnC|498|Validation Rule|Valid date.|—|
|rec5XcrCIwDnhWFnC|498|Is Required|—|—|
|rec5XcrCIwDnhWFnC|498|Example Input|—|—|
|rec5XcrCIwDnhWFnC|498|Example Output|—|—|
|rec5XcrCIwDnhWFnC|498|Last Modified|2026-03-02T13:58:14.000Z|—|
|rec5XcrCIwDnhWFnC|498|Field Type|[object Object]|—|
|rec5XcrCIwDnhWFnC|498|Canonical_Registry_ID|498|—|
|rec5XcrCIwDnhWFnC|498|Description Detail|Used for historical time-series tracking of Utile's prices and margins.|—|
|rec5XcrCIwDnhWFnC|498|Table Name|[object Object]|—|
|rec5XcrCIwDnhWFnC|498|Standardization|—|OK|
|rec5XcrCIwDnhWFnC|498|Anomalies|—|OK|
|rec5XcrCIwDnhWFnC|498|Field Registry|—|OK|
|rec5XcrCIwDnhWFnC|498|Manifest Source Config|—|OK|
|rec5XcrCIwDnhWFnC|498|Staging|—|OK|
|rec5XcrCIwDnhWFnC|498|Category ID Prefix|—|—|
|rec5XcrCIwDnhWFnC|498|CanonicalRegistry|498|OK|
|rec5XcrCIwDnhWFnC|498|From field: CanonicalRegistry|498|OK|
|rec5XcrCIwDnhWFnC|498|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recaKoVSVYjMmxCd0|499|Field Name|Procurement_Surcharge|—|
|recaKoVSVYjMmxCd0|499|Normalization Fn|Manual input.|—|
|recaKoVSVYjMmxCd0|499|Validation Rule|>= 0%.|—|
|recaKoVSVYjMmxCd0|499|Is Required|—|—|
|recaKoVSVYjMmxCd0|499|Example Input|—|—|
|recaKoVSVYjMmxCd0|499|Example Output|—|—|
|recaKoVSVYjMmxCd0|499|Last Modified|2026-03-02T13:58:14.000Z|—|
|recaKoVSVYjMmxCd0|499|Field Type|[object Object]|—|
|recaKoVSVYjMmxCd0|499|Canonical_Registry_ID|499|—|
|recaKoVSVYjMmxCd0|499|Description Detail|Percentage buffer for shipping, duties, or breakage allowances.|—|
|recaKoVSVYjMmxCd0|499|Table Name|[object Object]|—|
|recaKoVSVYjMmxCd0|499|Standardization|—|OK|
|recaKoVSVYjMmxCd0|499|Anomalies|—|OK|
|recaKoVSVYjMmxCd0|499|Field Registry|—|OK|
|recaKoVSVYjMmxCd0|499|Manifest Source Config|—|OK|
|recaKoVSVYjMmxCd0|499|Staging|—|OK|
|recaKoVSVYjMmxCd0|499|Category ID Prefix|—|—|
|recaKoVSVYjMmxCd0|499|CanonicalRegistry|499|OK|
|recaKoVSVYjMmxCd0|499|From field: CanonicalRegistry|499|OK|
|recaKoVSVYjMmxCd0|499|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recEZ7deYygKnacrN|500|Field Name|Category|—|
|recEZ7deYygKnacrN|500|Normalization Fn|INTERNAL SELECTION — Value must match one of the approved options. No transformation from source.|—|
|recEZ7deYygKnacrN|500|Validation Rule|Must be one of: Material, Consumable, Accessory, Service.|—|
|recEZ7deYygKnacrN|500|Is Required|—|—|
|recEZ7deYygKnacrN|500|Example Input|—|—|
|recEZ7deYygKnacrN|500|Example Output|—|—|
|recEZ7deYygKnacrN|500|Last Modified|2026-03-02T13:58:14.000Z|—|
|recEZ7deYygKnacrN|500|Field Type|[object Object]|—|
|recEZ7deYygKnacrN|500|Canonical_Registry_ID|500|—|
|recEZ7deYygKnacrN|500|Description Detail|Classifies the item being priced.|—|
|recEZ7deYygKnacrN|500|Table Name|[object Object]|—|
|recEZ7deYygKnacrN|500|Standardization|—|OK|
|recEZ7deYygKnacrN|500|Anomalies|—|OK|
|recEZ7deYygKnacrN|500|Field Registry|—|OK|
|recEZ7deYygKnacrN|500|Manifest Source Config|—|OK|
|recEZ7deYygKnacrN|500|Staging|—|OK|
|recEZ7deYygKnacrN|500|Category ID Prefix|—|—|
|recEZ7deYygKnacrN|500|CanonicalRegistry|500|OK|
|recEZ7deYygKnacrN|500|From field: CanonicalRegistry|500|OK|
|recEZ7deYygKnacrN|500|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recAduiuxU8wz9xgz|501|Field Name|Is_Service|—|
|recAduiuxU8wz9xgz|501|Normalization Fn|Boolean.|—|
|recAduiuxU8wz9xgz|501|Validation Rule|true/false.|—|
|recAduiuxU8wz9xgz|501|Is Required|—|—|
|recAduiuxU8wz9xgz|501|Example Input|—|—|
|recAduiuxU8wz9xgz|501|Example Output|—|—|
|recAduiuxU8wz9xgz|501|Last Modified|2026-03-02T13:58:14.000Z|—|
|recAduiuxU8wz9xgz|501|Field Type|[object Object]|—|
|recAduiuxU8wz9xgz|501|Canonical_Registry_ID|501|—|
|recAduiuxU8wz9xgz|501|Description Detail|Flag to identify non-physical items like labour or delivery fees.|—|
|recAduiuxU8wz9xgz|501|Table Name|[object Object]|—|
|recAduiuxU8wz9xgz|501|Standardization|—|OK|
|recAduiuxU8wz9xgz|501|Anomalies|—|OK|
|recAduiuxU8wz9xgz|501|Field Registry|—|OK|
|recAduiuxU8wz9xgz|501|Manifest Source Config|—|OK|
|recAduiuxU8wz9xgz|501|Staging|—|OK|
|recAduiuxU8wz9xgz|501|Category ID Prefix|—|—|
|recAduiuxU8wz9xgz|501|CanonicalRegistry|501|OK|
|recAduiuxU8wz9xgz|501|From field: CanonicalRegistry|501|OK|
|recAduiuxU8wz9xgz|501|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recEhVagEESQeamFV|503|Field Name|Area W/F|—|
|recEhVagEESQeamFV|503|Normalization Fn|PROPER(TRIM({Area W/F}))|—|
|recEhVagEESQeamFV|503|Validation Rule|Must match surface applicability (e.g., Walls Only, Floors & Walls).|—|
|recEhVagEESQeamFV|503|Is Required|—|—|
|recEhVagEESQeamFV|503|Example Input|—|—|
|recEhVagEESQeamFV|503|Example Output|—|—|
|recEhVagEESQeamFV|503|Last Modified|2026-03-05T10:34:04.000Z|—|
|recEhVagEESQeamFV|503|Field Type|[object Object]|—|
|recEhVagEESQeamFV|503|Canonical_Registry_ID|503|—|
|recEhVagEESQeamFV|503|Description Detail|Modular governance for wall vs. floor applicability.|—|
|recEhVagEESQeamFV|503|Table Name|[object Object]|—|
|recEhVagEESQeamFV|503|Standardization|—|OK|
|recEhVagEESQeamFV|503|Anomalies|—|OK|
|recEhVagEESQeamFV|503|Field Registry|—|OK|
|recEhVagEESQeamFV|503|Manifest Source Config|—|OK|
|recEhVagEESQeamFV|503|Staging|—|OK|
|recEhVagEESQeamFV|503|Category ID Prefix|—|—|
|recEhVagEESQeamFV|503|CanonicalRegistry|503|OK|
|recEhVagEESQeamFV|503|From field: CanonicalRegistry|503|OK|
|recEhVagEESQeamFV|503|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recsuaxuaYcnpJBaT|504|Field Name|Area ENV|—|
|recsuaxuaYcnpJBaT|504|Normalization Fn|PROPER(TRIM({Area ENV}))|—|
|recsuaxuaYcnpJBaT|504|Validation Rule|Must match internal environmental exposure list (e.g., Indoor, In/Out).|—|
|recsuaxuaYcnpJBaT|504|Is Required|—|—|
|recsuaxuaYcnpJBaT|504|Example Input|—|—|
|recsuaxuaYcnpJBaT|504|Example Output|—|—|
|recsuaxuaYcnpJBaT|504|Last Modified|2026-03-05T10:34:04.000Z|—|
|recsuaxuaYcnpJBaT|504|Field Type|[object Object]|—|
|recsuaxuaYcnpJBaT|504|Canonical_Registry_ID|504|—|
|recsuaxuaYcnpJBaT|504|Description Detail|Modular governance for environmental exposure.|—|
|recsuaxuaYcnpJBaT|504|Table Name|[object Object]|—|
|recsuaxuaYcnpJBaT|504|Standardization|—|OK|
|recsuaxuaYcnpJBaT|504|Anomalies|—|OK|
|recsuaxuaYcnpJBaT|504|Field Registry|—|OK|
|recsuaxuaYcnpJBaT|504|Manifest Source Config|—|OK|
|recsuaxuaYcnpJBaT|504|Staging|—|OK|
|recsuaxuaYcnpJBaT|504|Category ID Prefix|—|—|
|recsuaxuaYcnpJBaT|504|CanonicalRegistry|504|OK|
|recsuaxuaYcnpJBaT|504|From field: CanonicalRegistry|504|OK|
|recsuaxuaYcnpJBaT|504|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recGN3F8bUmFORGEa|505|Field Name|Area Type|—|
|recGN3F8bUmFORGEa|505|Normalization Fn|PROPER(TRIM({Area Type}))|—|
|recGN3F8bUmFORGEa|505|Validation Rule|Must match commercial intensity levels (e.g., Residential, Light Commercial).|—|
|recGN3F8bUmFORGEa|505|Is Required|—|—|
|recGN3F8bUmFORGEa|505|Example Input|—|—|
|recGN3F8bUmFORGEa|505|Example Output|—|—|
|recGN3F8bUmFORGEa|505|Last Modified|2026-03-05T10:34:04.000Z|—|
|recGN3F8bUmFORGEa|505|Field Type|[object Object]|—|
|recGN3F8bUmFORGEa|505|Canonical_Registry_ID|505|—|
|recGN3F8bUmFORGEa|505|Description Detail|Modular governance for commercial intensity and specific use cases.|—|
|recGN3F8bUmFORGEa|505|Table Name|[object Object]|—|
|recGN3F8bUmFORGEa|505|Standardization|—|OK|
|recGN3F8bUmFORGEa|505|Anomalies|—|OK|
|recGN3F8bUmFORGEa|505|Field Registry|—|OK|
|recGN3F8bUmFORGEa|505|Manifest Source Config|—|OK|
|recGN3F8bUmFORGEa|505|Staging|—|OK|
|recGN3F8bUmFORGEa|505|Category ID Prefix|—|—|
|recGN3F8bUmFORGEa|505|CanonicalRegistry|505|OK|
|recGN3F8bUmFORGEa|505|From field: CanonicalRegistry|505|OK|
|recGN3F8bUmFORGEa|505|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recZnPMkMyX3WJLKP|510|Field Name|Shape Name|—|
|recZnPMkMyX3WJLKP|510|Normalization Fn|PROPER(TRIM({Shape Name}))|—|
|recZnPMkMyX3WJLKP|510|Validation Rule|Must be one of: Square, Oblong, Metro, Hexagon, Octagon, Triangle, Modular, Arabesque, Lantern, Scallop, Listello, Subway.|—|
|recZnPMkMyX3WJLKP|510|Is Required|—|—|
|recZnPMkMyX3WJLKP|510|Example Input|—|—|
|recZnPMkMyX3WJLKP|510|Example Output|—|—|
|recZnPMkMyX3WJLKP|510|Last Modified|2026-03-05T11:47:23.000Z|—|
|recZnPMkMyX3WJLKP|510|Field Type|[object Object]|—|
|recZnPMkMyX3WJLKP|510|Canonical_Registry_ID|510|—|
|recZnPMkMyX3WJLKP|510|Description Detail|Governs pure geometric product shapes.|—|
|recZnPMkMyX3WJLKP|510|Table Name|[object Object]|—|
|recZnPMkMyX3WJLKP|510|Standardization|6, 51|OK|
|recZnPMkMyX3WJLKP|510|Anomalies|—|OK|
|recZnPMkMyX3WJLKP|510|Field Registry|recr9VE7rvrAQIGCV|OK|
|recZnPMkMyX3WJLKP|510|Manifest Source Config|—|OK|
|recZnPMkMyX3WJLKP|510|Staging|—|OK|
|recZnPMkMyX3WJLKP|510|Category ID Prefix|—|—|
|recZnPMkMyX3WJLKP|510|CanonicalRegistry|510|OK|
|recZnPMkMyX3WJLKP|510|From field: CanonicalRegistry|510|OK|
|recZnPMkMyX3WJLKP|510|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recdcPUAV9ut7jwTY|515|Field Name|Colour Family|—|
|recdcPUAV9ut7jwTY|515|Normalization Fn|PROPER(TRIM({Colour Family}))|—|
|recdcPUAV9ut7jwTY|515|Validation Rule|Must be one of: Red, Black, Grey, White, Brown, Pink, Purple, Blue, Green, Orange , Yellow, Beige|—|
|recdcPUAV9ut7jwTY|515|Is Required|—|—|
|recdcPUAV9ut7jwTY|515|Example Input|—|—|
|recdcPUAV9ut7jwTY|515|Example Output|—|—|
|recdcPUAV9ut7jwTY|515|Last Modified|2026-03-05T12:15:33.000Z|—|
|recdcPUAV9ut7jwTY|515|Field Type|[object Object]|—|
|recdcPUAV9ut7jwTY|515|Canonical_Registry_ID|515|—|
|recdcPUAV9ut7jwTY|515|Description Detail|Standardized parent color category for broad filtering.|—|
|recdcPUAV9ut7jwTY|515|Table Name|[object Object]|—|
|recdcPUAV9ut7jwTY|515|Standardization|43|OK|
|recdcPUAV9ut7jwTY|515|Anomalies|—|OK|
|recdcPUAV9ut7jwTY|515|Field Registry|recwZl4gJx236MRTX|OK|
|recdcPUAV9ut7jwTY|515|Manifest Source Config|—|OK|
|recdcPUAV9ut7jwTY|515|Staging|—|OK|
|recdcPUAV9ut7jwTY|515|Category ID Prefix|—|—|
|recdcPUAV9ut7jwTY|515|CanonicalRegistry|515|OK|
|recdcPUAV9ut7jwTY|515|From field: CanonicalRegistry|515|OK|
|recdcPUAV9ut7jwTY|515|Canonical_Registry_ID (from CanonicalRegistry)||—|
|receOtorvJRudNjS5|516|Field Name|Colour Intensity|—|
|receOtorvJRudNjS5|516|Normalization Fn|PROPER(TRIM({Intensity}))|—|
|receOtorvJRudNjS5|516|Validation Rule|Must be one of: Vivid, Moderate, Muted|—|
|receOtorvJRudNjS5|516|Is Required|—|—|
|receOtorvJRudNjS5|516|Example Input|—|—|
|receOtorvJRudNjS5|516|Example Output|—|—|
|receOtorvJRudNjS5|516|Last Modified|2026-03-05T12:24:42.000Z|—|
|receOtorvJRudNjS5|516|Field Type|[object Object]|—|
|receOtorvJRudNjS5|516|Canonical_Registry_ID|516|—|
|receOtorvJRudNjS5|516|Description Detail|Standardized scale for color saturation categorization.|—|
|receOtorvJRudNjS5|516|Table Name|[object Object]|—|
|receOtorvJRudNjS5|516|Standardization|44|OK|
|receOtorvJRudNjS5|516|Anomalies|—|OK|
|receOtorvJRudNjS5|516|Field Registry|recUnghHsmvokjwlD|OK|
|receOtorvJRudNjS5|516|Manifest Source Config|—|OK|
|receOtorvJRudNjS5|516|Staging|—|OK|
|receOtorvJRudNjS5|516|Category ID Prefix|—|—|
|receOtorvJRudNjS5|516|CanonicalRegistry|516|OK|
|receOtorvJRudNjS5|516|From field: CanonicalRegistry|516|OK|
|receOtorvJRudNjS5|516|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec1M4AuNW7gwLqFI|517|Field Name|Colour Lightness|—|
|rec1M4AuNW7gwLqFI|517|Normalization Fn|PROPER(TRIM({Lightness}))|—|
|rec1M4AuNW7gwLqFI|517|Validation Rule|Must be one of: Very Light, Light, Medium, Dark,, Very Dark|—|
|rec1M4AuNW7gwLqFI|517|Is Required|—|—|
|rec1M4AuNW7gwLqFI|517|Example Input|—|—|
|rec1M4AuNW7gwLqFI|517|Example Output|—|—|
|rec1M4AuNW7gwLqFI|517|Last Modified|2026-03-05T12:23:36.000Z|—|
|rec1M4AuNW7gwLqFI|517|Field Type|[object Object]|—|
|rec1M4AuNW7gwLqFI|517|Canonical_Registry_ID|517|—|
|rec1M4AuNW7gwLqFI|517|Description Detail|Standardized scale for color brightness categorization.|—|
|rec1M4AuNW7gwLqFI|517|Table Name|[object Object]|—|
|rec1M4AuNW7gwLqFI|517|Standardization|62|OK|
|rec1M4AuNW7gwLqFI|517|Anomalies|—|OK|
|rec1M4AuNW7gwLqFI|517|Field Registry|recRcnhmkbtqVTyuM|OK|
|rec1M4AuNW7gwLqFI|517|Manifest Source Config|—|OK|
|rec1M4AuNW7gwLqFI|517|Staging|—|OK|
|rec1M4AuNW7gwLqFI|517|Category ID Prefix|—|—|
|rec1M4AuNW7gwLqFI|517|CanonicalRegistry|517|OK|
|rec1M4AuNW7gwLqFI|517|From field: CanonicalRegistry|517|OK|
|rec1M4AuNW7gwLqFI|517|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recavVqhdSm8Zzyou|524|Field Name|Size Category|—|
|recavVqhdSm8Zzyou|524|Normalization Fn|IF({Size Length Mm} < 300, "Small", IF({Size Length Mm} <= 600, "Medium", "Large"))|—|
|recavVqhdSm8Zzyou|524|Validation Rule|Must output: "Small", "Medium", or "Large"|—|
|recavVqhdSm8Zzyou|524|Is Required|—|—|
|recavVqhdSm8Zzyou|524|Example Input|—|—|
|recavVqhdSm8Zzyou|524|Example Output|—|—|
|recavVqhdSm8Zzyou|524|Last Modified|2026-03-02T14:30:42.000Z|—|
|recavVqhdSm8Zzyou|524|Field Type|[object Object]|—|
|recavVqhdSm8Zzyou|524|Canonical_Registry_ID|524|—|
|recavVqhdSm8Zzyou|524|Description Detail|Automated threshold categorisation based dynamically on the extracted Size Length MM.|—|
|recavVqhdSm8Zzyou|524|Table Name|[object Object]|—|
|recavVqhdSm8Zzyou|524|Standardization|—|OK|
|recavVqhdSm8Zzyou|524|Anomalies|—|OK|
|recavVqhdSm8Zzyou|524|Field Registry|—|OK|
|recavVqhdSm8Zzyou|524|Manifest Source Config|—|OK|
|recavVqhdSm8Zzyou|524|Staging|—|OK|
|recavVqhdSm8Zzyou|524|Category ID Prefix|—|—|
|recavVqhdSm8Zzyou|524|CanonicalRegistry|524|OK|
|recavVqhdSm8Zzyou|524|From field: CanonicalRegistry|524|OK|
|recavVqhdSm8Zzyou|524|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec3s7K4CW9lmZ64c|525|Field Name|UPC BodyFinish|—|
|rec3s7K4CW9lmZ64c|525|Normalization Fn|Derived via lookup from UPCBodyFinishes|—|
|rec3s7K4CW9lmZ64c|525|Validation Rule|Must match one of the governed list (Expanded: Matt, Gloss, Textured without slip resistance, Textured with slip resistance, GRIP - Ultra Slip Resistance, Lappato, Polished, Gloss/Matt, Matt with Gloss).|—|
|rec3s7K4CW9lmZ64c|525|Is Required|—|—|
|rec3s7K4CW9lmZ64c|525|Example Input|—|—|
|rec3s7K4CW9lmZ64c|525|Example Output|—|—|
|rec3s7K4CW9lmZ64c|525|Last Modified|2026-03-02T14:30:42.000Z|—|
|rec3s7K4CW9lmZ64c|525|Field Type|[object Object]|—|
|rec3s7K4CW9lmZ64c|525|Canonical_Registry_ID|525|—|
|rec3s7K4CW9lmZ64c|525|Description Detail|Internally managed finish classification. Amended: Added explicit canonical options for missing slip resistance and hybrid finishes.|—|
|rec3s7K4CW9lmZ64c|525|Table Name|[object Object]|—|
|rec3s7K4CW9lmZ64c|525|Standardization|—|OK|
|rec3s7K4CW9lmZ64c|525|Anomalies|—|OK|
|rec3s7K4CW9lmZ64c|525|Field Registry|—|OK|
|rec3s7K4CW9lmZ64c|525|Manifest Source Config|—|OK|
|rec3s7K4CW9lmZ64c|525|Staging|—|OK|
|rec3s7K4CW9lmZ64c|525|Category ID Prefix|—|—|
|rec3s7K4CW9lmZ64c|525|CanonicalRegistry|525|OK|
|rec3s7K4CW9lmZ64c|525|From field: CanonicalRegistry|525|OK|
|rec3s7K4CW9lmZ64c|525|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recBFXN2D1nXaaOTN|526|Field Name|supplier_uom_raw|—|
|recBFXN2D1nXaaOTN|526|Normalization Fn|TRIM({supplier_uom_raw})|—|
|recBFXN2D1nXaaOTN|526|Validation Rule|Optional|—|
|recBFXN2D1nXaaOTN|526|Is Required|—|—|
|recBFXN2D1nXaaOTN|526|Example Input|—|—|
|recBFXN2D1nXaaOTN|526|Example Output|—|—|
|recBFXN2D1nXaaOTN|526|Last Modified|2026-03-02T14:30:42.000Z|—|
|recBFXN2D1nXaaOTN|526|Field Type|[object Object]|—|
|recBFXN2D1nXaaOTN|526|Canonical_Registry_ID|526|—|
|recBFXN2D1nXaaOTN|526|Description Detail|Captures the supplier's embedded UoM text directly from the manifest (e.g., "sold per a piece") to preserve context missed by norm.currency.|—|
|recBFXN2D1nXaaOTN|526|Table Name|[object Object]|—|
|recBFXN2D1nXaaOTN|526|Standardization|—|OK|
|recBFXN2D1nXaaOTN|526|Anomalies|—|OK|
|recBFXN2D1nXaaOTN|526|Field Registry|—|OK|
|recBFXN2D1nXaaOTN|526|Manifest Source Config|—|OK|
|recBFXN2D1nXaaOTN|526|Staging|—|OK|
|recBFXN2D1nXaaOTN|526|Category ID Prefix|—|—|
|recBFXN2D1nXaaOTN|526|CanonicalRegistry|526|OK|
|recBFXN2D1nXaaOTN|526|From field: CanonicalRegistry|526|OK|
|recBFXN2D1nXaaOTN|526|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recS1lqf2xF5NoScM|527|Field Name|UoM Code|—|
|recS1lqf2xF5NoScM|527|Normalization Fn|INTERNAL SELECTION — No transformation from source|—|
|recS1lqf2xF5NoScM|527|Validation Rule|Must be selected from governed UPC_UoM table|—|
|recS1lqf2xF5NoScM|527|Is Required|—|—|
|recS1lqf2xF5NoScM|527|Example Input|—|—|
|recS1lqf2xF5NoScM|527|Example Output|—|—|
|recS1lqf2xF5NoScM|527|Last Modified|2026-03-02T14:30:42.000Z|—|
|recS1lqf2xF5NoScM|527|Field Type|[object Object]|—|
|recS1lqf2xF5NoScM|527|Canonical_Registry_ID|527|—|
|recS1lqf2xF5NoScM|527|Description Detail|New UoM codes governed by explicit normalization/validation rules.|—|
|recS1lqf2xF5NoScM|527|Table Name|[object Object]|—|
|recS1lqf2xF5NoScM|527|Standardization|45, 54, 55, 56|OK|
|recS1lqf2xF5NoScM|527|Anomalies|—|OK|
|recS1lqf2xF5NoScM|527|Field Registry|—|OK|
|recS1lqf2xF5NoScM|527|Manifest Source Config|—|OK|
|recS1lqf2xF5NoScM|527|Staging|—|OK|
|recS1lqf2xF5NoScM|527|Category ID Prefix|—|—|
|recS1lqf2xF5NoScM|527|CanonicalRegistry|527|OK|
|recS1lqf2xF5NoScM|527|From field: CanonicalRegistry|527, 609|OK|
|recS1lqf2xF5NoScM|527|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recMRTqH3NExguMb0|542|Field Name|Description|—|
|recMRTqH3NExguMb0|542|Normalization Fn|TRIM({Description})|—|
|recMRTqH3NExguMb0|542|Validation Rule|Optional|—|
|recMRTqH3NExguMb0|542|Is Required|—|—|
|recMRTqH3NExguMb0|542|Example Input|Suitable for wet areas|—|
|recMRTqH3NExguMb0|542|Example Output|Suitable for wet areas|—|
|recMRTqH3NExguMb0|542|Last Modified|2026-03-02T15:32:55.000Z|—|
|recMRTqH3NExguMb0|542|Field Type|[object Object]|—|
|recMRTqH3NExguMb0|542|Canonical_Registry_ID|542|—|
|recMRTqH3NExguMb0|542|Description Detail|Detailed explanation of where this product can be safely installed.|—|
|recMRTqH3NExguMb0|542|Table Name|[object Object]|—|
|recMRTqH3NExguMb0|542|Standardization|—|OK|
|recMRTqH3NExguMb0|542|Anomalies|—|OK|
|recMRTqH3NExguMb0|542|Field Registry|—|OK|
|recMRTqH3NExguMb0|542|Manifest Source Config|—|OK|
|recMRTqH3NExguMb0|542|Staging|—|OK|
|recMRTqH3NExguMb0|542|Category ID Prefix|—|—|
|recMRTqH3NExguMb0|542|CanonicalRegistry|542|OK|
|recMRTqH3NExguMb0|542|From field: CanonicalRegistry|542, 546, 558, 587, 596, 600, 605, 611|OK|
|recMRTqH3NExguMb0|542|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recz9WuDJc6kumKQC|543|Field Name|AreaOfUseID-UPC|—|
|recz9WuDJc6kumKQC|543|Normalization Fn|N/A|—|
|recz9WuDJc6kumKQC|543|Validation Rule|System-generated unique integer; acts as the immutable Primary Key (PK)|—|
|recz9WuDJc6kumKQC|543|Is Required|true|—|
|recz9WuDJc6kumKQC|543|Example Input|—|—|
|recz9WuDJc6kumKQC|543|Example Output|104|—|
|recz9WuDJc6kumKQC|543|Last Modified|2026-03-05T10:47:12.000Z|—|
|recz9WuDJc6kumKQC|543|Field Type|[object Object]|—|
|recz9WuDJc6kumKQC|543|Canonical_Registry_ID|543|—|
|recz9WuDJc6kumKQC|543|Description Detail|Unique system identifier for the Area of Use record.|—|
|recz9WuDJc6kumKQC|543|Table Name|[object Object]|—|
|recz9WuDJc6kumKQC|543|Standardization|—|OK|
|recz9WuDJc6kumKQC|543|Anomalies|—|OK|
|recz9WuDJc6kumKQC|543|Field Registry|recQWXMGbxDTK7dvj|OK|
|recz9WuDJc6kumKQC|543|Manifest Source Config|—|OK|
|recz9WuDJc6kumKQC|543|Staging|—|OK|
|recz9WuDJc6kumKQC|543|Category ID Prefix|—|—|
|recz9WuDJc6kumKQC|543|CanonicalRegistry|543|OK|
|recz9WuDJc6kumKQC|543|From field: CanonicalRegistry|543|OK|
|recz9WuDJc6kumKQC|543|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recJTcZsPJIRFy63Q|544|Field Name|Area combined|—|
|recJTcZsPJIRFy63Q|544|Normalization Fn|TRIM({Area W/F} & "" & IF(AND({Area ENV}, {Area ENV} != "Not Applicable"), " " & {Area ENV} & "", "") & IF(AND({Area Type}, {Area Type} != "Not Applicable"), " " & {Area Type} & "", ""))|—|
|recJTcZsPJIRFy63Q|544|Validation Rule|Create a human-readable usage summary by joining Area W/F, Environment, and Type, skipping 'Not Applicable' values|—|
|recJTcZsPJIRFy63Q|544|Is Required|true|—|
|recJTcZsPJIRFy63Q|544|Example Input|AOU-WET|—|
|recJTcZsPJIRFy63Q|544|Example Output|AOU-WET|—|
|recJTcZsPJIRFy63Q|544|Last Modified|2026-03-05T10:31:37.000Z|—|
|recJTcZsPJIRFy63Q|544|Field Type|[object Object]|—|
|recJTcZsPJIRFy63Q|544|Canonical_Registry_ID|544|—|
|recJTcZsPJIRFy63Q|544|Description Detail|Consolidated human-readable Area of Use string|—|
|recJTcZsPJIRFy63Q|544|Table Name|[object Object]|—|
|recJTcZsPJIRFy63Q|544|Standardization|—|OK|
|recJTcZsPJIRFy63Q|544|Anomalies|—|OK|
|recJTcZsPJIRFy63Q|544|Field Registry|fldMEwc4dzeaLaHbo|OK|
|recJTcZsPJIRFy63Q|544|Manifest Source Config|—|OK|
|recJTcZsPJIRFy63Q|544|Staging|—|OK|
|recJTcZsPJIRFy63Q|544|Category ID Prefix|—|—|
|recJTcZsPJIRFy63Q|544|CanonicalRegistry|544|OK|
|recJTcZsPJIRFy63Q|544|From field: CanonicalRegistry|544|OK|
|recJTcZsPJIRFy63Q|544|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recPfOHJAmk4u9u4P|545|Field Name|Prod Category|—|
|recPfOHJAmk4u9u4P|545|Normalization Fn|INTERNAL SELECTION|—|
|recPfOHJAmk4u9u4P|545|Validation Rule|Must be one of: Tile, Mosaic, Accessory, Material.|—|
|recPfOHJAmk4u9u4P|545|Is Required|—|—|
|recPfOHJAmk4u9u4P|545|Example Input|—|—|
|recPfOHJAmk4u9u4P|545|Example Output|—|—|
|recPfOHJAmk4u9u4P|545|Last Modified|2026-03-02T15:32:55.000Z|—|
|recPfOHJAmk4u9u4P|545|Field Type|[object Object]|—|
|recPfOHJAmk4u9u4P|545|Canonical_Registry_ID|545|—|
|recPfOHJAmk4u9u4P|545|Description Detail|High-level product category classification.|—|
|recPfOHJAmk4u9u4P|545|Table Name|[object Object]|—|
|recPfOHJAmk4u9u4P|545|Standardization|—|OK|
|recPfOHJAmk4u9u4P|545|Anomalies|—|OK|
|recPfOHJAmk4u9u4P|545|Field Registry|fldVS7MdpvEAx7jkK|OK|
|recPfOHJAmk4u9u4P|545|Manifest Source Config|—|OK|
|recPfOHJAmk4u9u4P|545|Staging|—|OK|
|recPfOHJAmk4u9u4P|545|Category ID Prefix|—|—|
|recPfOHJAmk4u9u4P|545|CanonicalRegistry|545|OK|
|recPfOHJAmk4u9u4P|545|From field: CanonicalRegistry|545|OK|
|recPfOHJAmk4u9u4P|545|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recbYBtpPQc9z7ko9|546|Field Name|Description|—|
|recbYBtpPQc9z7ko9|546|Normalization Fn|TRIM({Description})|—|
|recbYBtpPQc9z7ko9|546|Validation Rule|Optional.|—|
|recbYBtpPQc9z7ko9|546|Is Required|—|—|
|recbYBtpPQc9z7ko9|546|Example Input|—|—|
|recbYBtpPQc9z7ko9|546|Example Output|—|—|
|recbYBtpPQc9z7ko9|546|Last Modified|2026-03-05T14:16:36.000Z|—|
|recbYBtpPQc9z7ko9|546|Field Type|[object Object]|—|
|recbYBtpPQc9z7ko9|546|Canonical_Registry_ID|546|—|
|recbYBtpPQc9z7ko9|546|Description Detail|Detailed explanation of the body category.|—|
|recbYBtpPQc9z7ko9|546|Table Name|[object Object]|—|
|recbYBtpPQc9z7ko9|546|Standardization|—|OK|
|recbYBtpPQc9z7ko9|546|Anomalies|—|OK|
|recbYBtpPQc9z7ko9|546|Field Registry|recftMWkJNKJtwr6I|OK|
|recbYBtpPQc9z7ko9|546|Manifest Source Config|—|OK|
|recbYBtpPQc9z7ko9|546|Staging|—|OK|
|recbYBtpPQc9z7ko9|546|Category ID Prefix|—|—|
|recbYBtpPQc9z7ko9|546|CanonicalRegistry|542|OK|
|recbYBtpPQc9z7ko9|546|From field: CanonicalRegistry|—|OK|
|recbYBtpPQc9z7ko9|546|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rechFxqV4hZSqsMd1|547|Field Name|Upcbody Class Code|—|
|rechFxqV4hZSqsMd1|547|Normalization Fn|UPPER(TRIM({Upcbody Class Code}))|—|
|rechFxqV4hZSqsMd1|547|Validation Rule|Must be unique.|—|
|rechFxqV4hZSqsMd1|547|Is Required|—|—|
|rechFxqV4hZSqsMd1|547|Example Input|—|—|
|rechFxqV4hZSqsMd1|547|Example Output|—|—|
|rechFxqV4hZSqsMd1|547|Last Modified|2026-03-05T14:16:36.000Z|—|
|rechFxqV4hZSqsMd1|547|Field Type|[object Object]|—|
|rechFxqV4hZSqsMd1|547|Canonical_Registry_ID|547|—|
|rechFxqV4hZSqsMd1|547|Description Detail|Code representing the body class.|—|
|rechFxqV4hZSqsMd1|547|Table Name|[object Object]|—|
|rechFxqV4hZSqsMd1|547|Standardization|—|OK|
|rechFxqV4hZSqsMd1|547|Anomalies|—|OK|
|rechFxqV4hZSqsMd1|547|Field Registry|recfY0V1lhFuanavp|OK|
|rechFxqV4hZSqsMd1|547|Manifest Source Config|—|OK|
|rechFxqV4hZSqsMd1|547|Staging|—|OK|
|rechFxqV4hZSqsMd1|547|Category ID Prefix|—|—|
|rechFxqV4hZSqsMd1|547|CanonicalRegistry|547|OK|
|rechFxqV4hZSqsMd1|547|From field: CanonicalRegistry|547|OK|
|rechFxqV4hZSqsMd1|547|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec99Thz6vjYdmnUe|548|Field Name|Product Type|—|
|rec99Thz6vjYdmnUe|548|Normalization Fn|PROPER(TRIM({Product Type}))|—|
|rec99Thz6vjYdmnUe|548|Validation Rule|Not empty.|—|
|rec99Thz6vjYdmnUe|548|Is Required|—|—|
|rec99Thz6vjYdmnUe|548|Example Input|—|—|
|rec99Thz6vjYdmnUe|548|Example Output|—|—|
|rec99Thz6vjYdmnUe|548|Last Modified|2026-03-05T14:16:36.000Z|—|
|rec99Thz6vjYdmnUe|548|Field Type|[object Object]|—|
|rec99Thz6vjYdmnUe|548|Canonical_Registry_ID|548|—|
|rec99Thz6vjYdmnUe|548|Description Detail|Specific product type (e.g., Ceramic, Porcelain).|—|
|rec99Thz6vjYdmnUe|548|Table Name|[object Object]|—|
|rec99Thz6vjYdmnUe|548|Standardization|—|OK|
|rec99Thz6vjYdmnUe|548|Anomalies|—|OK|
|rec99Thz6vjYdmnUe|548|Field Registry|flddbKj9I5DhNRLsx|OK|
|rec99Thz6vjYdmnUe|548|Manifest Source Config|—|OK|
|rec99Thz6vjYdmnUe|548|Staging|—|OK|
|rec99Thz6vjYdmnUe|548|Category ID Prefix|—|—|
|rec99Thz6vjYdmnUe|548|CanonicalRegistry|548|OK|
|rec99Thz6vjYdmnUe|548|From field: CanonicalRegistry|548|OK|
|rec99Thz6vjYdmnUe|548|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec3FsznVgUBlqsEE|549|Field Name|Category No|—|
|rec3FsznVgUBlqsEE|549|Normalization Fn|PARSE_INTEGER({Category No})|—|
|rec3FsznVgUBlqsEE|549|Validation Rule|Integer > 0.|—|
|rec3FsznVgUBlqsEE|549|Is Required|—|—|
|rec3FsznVgUBlqsEE|549|Example Input|—|—|
|rec3FsznVgUBlqsEE|549|Example Output|—|—|
|rec3FsznVgUBlqsEE|549|Last Modified|2026-03-05T14:16:36.000Z|—|
|rec3FsznVgUBlqsEE|549|Field Type|[object Object]|—|
|rec3FsznVgUBlqsEE|549|Canonical_Registry_ID|549|—|
|rec3FsznVgUBlqsEE|549|Description Detail|Numeric identifier used for sorting or legacy system mapping.|—|
|rec3FsznVgUBlqsEE|549|Table Name|[object Object]|—|
|rec3FsznVgUBlqsEE|549|Standardization|—|OK|
|rec3FsznVgUBlqsEE|549|Anomalies|—|OK|
|rec3FsznVgUBlqsEE|549|Field Registry|fldA2oxWnAijIjrpT|OK|
|rec3FsznVgUBlqsEE|549|Manifest Source Config|—|OK|
|rec3FsznVgUBlqsEE|549|Staging|—|OK|
|rec3FsznVgUBlqsEE|549|Category ID Prefix|—|—|
|rec3FsznVgUBlqsEE|549|CanonicalRegistry|549|OK|
|rec3FsznVgUBlqsEE|549|From field: CanonicalRegistry|549|OK|
|rec3FsznVgUBlqsEE|549|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rectII1bwwdEIhuEo|553|Field Name|UPCColourMaster|—|
|rectII1bwwdEIhuEo|553|Normalization Fn|N/A (Manual/System Link)|—|
|rectII1bwwdEIhuEo|553|Validation Rule|Must link to an active standardized color record in the UPCColourMaster reference table.|—|
|rectII1bwwdEIhuEo|553|Is Required|—|—|
|rectII1bwwdEIhuEo|553|Example Input|—|—|
|rectII1bwwdEIhuEo|553|Example Output|—|—|
|rectII1bwwdEIhuEo|553|Last Modified|2026-03-05T12:21:33.000Z|—|
|rectII1bwwdEIhuEo|553|Field Type|[object Object]|—|
|rectII1bwwdEIhuEo|553|Canonical_Registry_ID|553|—|
|rectII1bwwdEIhuEo|553|Description Detail|Links a tile directly to its standardized color profile.|—|
|rectII1bwwdEIhuEo|553|Table Name|[object Object]|—|
|rectII1bwwdEIhuEo|553|Standardization|—|OK|
|rectII1bwwdEIhuEo|553|Anomalies|—|OK|
|rectII1bwwdEIhuEo|553|Field Registry|recCL0PrxSXqjvtVq|OK|
|rectII1bwwdEIhuEo|553|Manifest Source Config|—|OK|
|rectII1bwwdEIhuEo|553|Staging|—|OK|
|rectII1bwwdEIhuEo|553|Category ID Prefix|—|—|
|rectII1bwwdEIhuEo|553|CanonicalRegistry|553|OK|
|rectII1bwwdEIhuEo|553|From field: CanonicalRegistry|553, 603, 791, 810|OK|
|rectII1bwwdEIhuEo|553|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recErZFKZniN3R3JW|554|Field Name|Display Name|—|
|recErZFKZniN3R3JW|554|Normalization Fn|PROPER(TRIM({Display Name}))|—|
|recErZFKZniN3R3JW|554|Validation Rule|Not empty|—|
|recErZFKZniN3R3JW|554|Is Required|true|—|
|recErZFKZniN3R3JW|554|Example Input|square meters|—|
|recErZFKZniN3R3JW|554|Example Output|Square Meters|—|
|recErZFKZniN3R3JW|554|Last Modified|2026-03-02T15:32:55.000Z|—|
|recErZFKZniN3R3JW|554|Field Type|[object Object]|—|
|recErZFKZniN3R3JW|554|Canonical_Registry_ID|554|—|
|recErZFKZniN3R3JW|554|Description Detail|Human-readable Unit of Measure name.|—|
|recErZFKZniN3R3JW|554|Table Name|[object Object]|—|
|recErZFKZniN3R3JW|554|Standardization|—|OK|
|recErZFKZniN3R3JW|554|Anomalies|—|OK|
|recErZFKZniN3R3JW|554|Field Registry|reczyNlabQ9mNbCnm|OK|
|recErZFKZniN3R3JW|554|Manifest Source Config|—|OK|
|recErZFKZniN3R3JW|554|Staging|—|OK|
|recErZFKZniN3R3JW|554|Category ID Prefix|—|—|
|recErZFKZniN3R3JW|554|CanonicalRegistry|554|OK|
|recErZFKZniN3R3JW|554|From field: CanonicalRegistry|554|OK|
|recErZFKZniN3R3JW|554|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec1Wpe1MCK6UTJYw|555|Field Name|Is Primary Reference|—|
|rec1Wpe1MCK6UTJYw|555|Normalization Fn|Boolean|—|
|rec1Wpe1MCK6UTJYw|555|Validation Rule|true/false|—|
|rec1Wpe1MCK6UTJYw|555|Is Required|—|—|
|rec1Wpe1MCK6UTJYw|555|Example Input|TRUE|—|
|rec1Wpe1MCK6UTJYw|555|Example Output|TRUE|—|
|rec1Wpe1MCK6UTJYw|555|Last Modified|2026-03-02T15:32:55.000Z|—|
|rec1Wpe1MCK6UTJYw|555|Field Type|[object Object]|—|
|rec1Wpe1MCK6UTJYw|555|Canonical_Registry_ID|555|—|
|rec1Wpe1MCK6UTJYw|555|Description Detail|Indicates if this is the primary default UoM for the system.|—|
|rec1Wpe1MCK6UTJYw|555|Table Name|[object Object]|—|
|rec1Wpe1MCK6UTJYw|555|Standardization|—|OK|
|rec1Wpe1MCK6UTJYw|555|Anomalies|—|OK|
|rec1Wpe1MCK6UTJYw|555|Field Registry|recjdjxDvvPcaJuuS|OK|
|rec1Wpe1MCK6UTJYw|555|Manifest Source Config|—|OK|
|rec1Wpe1MCK6UTJYw|555|Staging|—|OK|
|rec1Wpe1MCK6UTJYw|555|Category ID Prefix|—|—|
|rec1Wpe1MCK6UTJYw|555|CanonicalRegistry|555|OK|
|rec1Wpe1MCK6UTJYw|555|From field: CanonicalRegistry|555, 560|OK|
|rec1Wpe1MCK6UTJYw|555|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recwRQp9LtcCgIDcW|556|Field Name|UoM_Last Reviewed|—|
|recwRQp9LtcCgIDcW|556|Normalization Fn|AUTO - System Managed|—|
|recwRQp9LtcCgIDcW|556|Validation Rule|Valid Date|—|
|recwRQp9LtcCgIDcW|556|Is Required|—|—|
|recwRQp9LtcCgIDcW|556|Example Input|—|—|
|recwRQp9LtcCgIDcW|556|Example Output|2026-03-02|—|
|recwRQp9LtcCgIDcW|556|Last Modified|2026-03-06T03:31:16.000Z|—|
|recwRQp9LtcCgIDcW|556|Field Type|[object Object]|—|
|recwRQp9LtcCgIDcW|556|Canonical_Registry_ID|556|—|
|recwRQp9LtcCgIDcW|556|Description Detail|Date the UoM governance was last audited.|—|
|recwRQp9LtcCgIDcW|556|Table Name|[object Object]|—|
|recwRQp9LtcCgIDcW|556|Standardization|—|OK|
|recwRQp9LtcCgIDcW|556|Anomalies|—|OK|
|recwRQp9LtcCgIDcW|556|Field Registry|—|OK|
|recwRQp9LtcCgIDcW|556|Manifest Source Config|—|OK|
|recwRQp9LtcCgIDcW|556|Staging|—|OK|
|recwRQp9LtcCgIDcW|556|Category ID Prefix|SYS_UiM_Last Reviewed|—|
|recwRQp9LtcCgIDcW|556|CanonicalRegistry|556|OK|
|recwRQp9LtcCgIDcW|556|From field: CanonicalRegistry|556|OK|
|recwRQp9LtcCgIDcW|556|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recnOiik81x6G2qhi|558|Field Name|Description|—|
|recnOiik81x6G2qhi|558|Normalization Fn|TRIM({Description})|—|
|recnOiik81x6G2qhi|558|Validation Rule|Optional|—|
|recnOiik81x6G2qhi|558|Is Required|—|—|
|recnOiik81x6G2qhi|558|Example Input|—|—|
|recnOiik81x6G2qhi|558|Example Output|—|—|
|recnOiik81x6G2qhi|558|Last Modified|2026-03-02T15:32:55.000Z|—|
|recnOiik81x6G2qhi|558|Field Type|[object Object]|—|
|recnOiik81x6G2qhi|558|Canonical_Registry_ID|558|—|
|recnOiik81x6G2qhi|558|Description Detail|Definition and conversion notes for the unit of measure.|—|
|recnOiik81x6G2qhi|558|Table Name|[object Object]|—|
|recnOiik81x6G2qhi|558|Standardization|—|OK|
|recnOiik81x6G2qhi|558|Anomalies|—|OK|
|recnOiik81x6G2qhi|558|Field Registry|—|OK|
|recnOiik81x6G2qhi|558|Manifest Source Config|—|OK|
|recnOiik81x6G2qhi|558|Staging|—|OK|
|recnOiik81x6G2qhi|558|Category ID Prefix|—|—|
|recnOiik81x6G2qhi|558|CanonicalRegistry|542|OK|
|recnOiik81x6G2qhi|558|From field: CanonicalRegistry|—|OK|
|recnOiik81x6G2qhi|558|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recGSI4KlmmGRx264|559|Field Name|SKU Value|—|
|recGSI4KlmmGRx264|559|Normalization Fn|UPPER(TRIM({SKU Value}))|—|
|recGSI4KlmmGRx264|559|Validation Rule|Must be unique; No spaces|—|
|recGSI4KlmmGRx264|559|Is Required|true|—|
|recGSI4KlmmGRx264|559|Example Input|sku-123|—|
|recGSI4KlmmGRx264|559|Example Output|SKU-123|—|
|recGSI4KlmmGRx264|559|Last Modified|2026-03-02T15:32:55.000Z|—|
|recGSI4KlmmGRx264|559|Field Type|[object Object]|—|
|recGSI4KlmmGRx264|559|Canonical_Registry_ID|559|—|
|recGSI4KlmmGRx264|559|Description Detail|The actual canonical SKU string.|—|
|recGSI4KlmmGRx264|559|Table Name|[object Object]|—|
|recGSI4KlmmGRx264|559|Standardization|—|OK|
|recGSI4KlmmGRx264|559|Anomalies|—|OK|
|recGSI4KlmmGRx264|559|Field Registry|—|OK|
|recGSI4KlmmGRx264|559|Manifest Source Config|—|OK|
|recGSI4KlmmGRx264|559|Staging|—|OK|
|recGSI4KlmmGRx264|559|Category ID Prefix|—|—|
|recGSI4KlmmGRx264|559|CanonicalRegistry|559|OK|
|recGSI4KlmmGRx264|559|From field: CanonicalRegistry|559|OK|
|recGSI4KlmmGRx264|559|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recntHFAku9MyTy7I|560|Field Name|Is Primary Reference|—|
|recntHFAku9MyTy7I|560|Normalization Fn|Boolean|—|
|recntHFAku9MyTy7I|560|Validation Rule|true/false|—|
|recntHFAku9MyTy7I|560|Is Required|—|—|
|recntHFAku9MyTy7I|560|Example Input|TRUE|—|
|recntHFAku9MyTy7I|560|Example Output|TRUE|—|
|recntHFAku9MyTy7I|560|Last Modified|2026-03-02T15:32:55.000Z|—|
|recntHFAku9MyTy7I|560|Field Type|[object Object]|—|
|recntHFAku9MyTy7I|560|Canonical_Registry_ID|560|—|
|recntHFAku9MyTy7I|560|Description Detail|Flag indicating if this is the primary SKU vs an alias.|—|
|recntHFAku9MyTy7I|560|Table Name|[object Object]|—|
|recntHFAku9MyTy7I|560|Standardization|—|OK|
|recntHFAku9MyTy7I|560|Anomalies|—|OK|
|recntHFAku9MyTy7I|560|Field Registry|—|OK|
|recntHFAku9MyTy7I|560|Manifest Source Config|—|OK|
|recntHFAku9MyTy7I|560|Staging|—|OK|
|recntHFAku9MyTy7I|560|Category ID Prefix|—|—|
|recntHFAku9MyTy7I|560|CanonicalRegistry|555|OK|
|recntHFAku9MyTy7I|560|From field: CanonicalRegistry|—|OK|
|recntHFAku9MyTy7I|560|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recTBhWOODuVarW6x|561|Field Name|Governance Status|—|
|recTBhWOODuVarW6x|561|Normalization Fn|INTERNAL SELECTION|—|
|recTBhWOODuVarW6x|561|Validation Rule|Must be one of: Approved, Pending, Rejected|—|
|recTBhWOODuVarW6x|561|Is Required|true|—|
|recTBhWOODuVarW6x|561|Example Input|Approved|—|
|recTBhWOODuVarW6x|561|Example Output|Approved|—|
|recTBhWOODuVarW6x|561|Last Modified|2026-03-02T15:32:55.000Z|—|
|recTBhWOODuVarW6x|561|Field Type|[object Object]|—|
|recTBhWOODuVarW6x|561|Canonical_Registry_ID|561|—|
|recTBhWOODuVarW6x|561|Description Detail|MDM approval status of the SKU.|—|
|recTBhWOODuVarW6x|561|Table Name|[object Object]|—|
|recTBhWOODuVarW6x|561|Standardization|—|OK|
|recTBhWOODuVarW6x|561|Anomalies|—|OK|
|recTBhWOODuVarW6x|561|Field Registry|—|OK|
|recTBhWOODuVarW6x|561|Manifest Source Config|—|OK|
|recTBhWOODuVarW6x|561|Staging|—|OK|
|recTBhWOODuVarW6x|561|Category ID Prefix|—|—|
|recTBhWOODuVarW6x|561|CanonicalRegistry|561|OK|
|recTBhWOODuVarW6x|561|From field: CanonicalRegistry|561|OK|
|recTBhWOODuVarW6x|561|Canonical_Registry_ID (from CanonicalRegistry)||—|
|reckieRHUQU0388zn|562|Field Name|Last Reviewed|—|
|reckieRHUQU0388zn|562|Normalization Fn|AUTO - System Managed|—|
|reckieRHUQU0388zn|562|Validation Rule|Valid Date|—|
|reckieRHUQU0388zn|562|Is Required|—|—|
|reckieRHUQU0388zn|562|Example Input|—|—|
|reckieRHUQU0388zn|562|Example Output|2026-03-02|—|
|reckieRHUQU0388zn|562|Last Modified|2026-03-02T15:32:55.000Z|—|
|reckieRHUQU0388zn|562|Field Type|[object Object]|—|
|reckieRHUQU0388zn|562|Canonical_Registry_ID|562|—|
|reckieRHUQU0388zn|562|Description Detail|Date of last governance review.|—|
|reckieRHUQU0388zn|562|Table Name|[object Object]|—|
|reckieRHUQU0388zn|562|Standardization|—|OK|
|reckieRHUQU0388zn|562|Anomalies|—|OK|
|reckieRHUQU0388zn|562|Field Registry|—|OK|
|reckieRHUQU0388zn|562|Manifest Source Config|—|OK|
|reckieRHUQU0388zn|562|Staging|—|OK|
|reckieRHUQU0388zn|562|Category ID Prefix|SYS_Last_Reviewed|—|
|reckieRHUQU0388zn|562|CanonicalRegistry|562|OK|
|reckieRHUQU0388zn|562|From field: CanonicalRegistry|562|OK|
|reckieRHUQU0388zn|562|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recA4JMQXEE85iuE4|563|Field Name|Reviewer|—|
|recA4JMQXEE85iuE4|563|Normalization Fn|N/A|—|
|recA4JMQXEE85iuE4|563|Validation Rule|Must be a valid Airtable User|—|
|recA4JMQXEE85iuE4|563|Is Required|—|—|
|recA4JMQXEE85iuE4|563|Example Input|—|—|
|recA4JMQXEE85iuE4|563|Example Output|Jane Smith|—|
|recA4JMQXEE85iuE4|563|Last Modified|2026-03-02T15:32:55.000Z|—|
|recA4JMQXEE85iuE4|563|Field Type|[object Object]|—|
|recA4JMQXEE85iuE4|563|Canonical_Registry_ID|563|—|
|recA4JMQXEE85iuE4|563|Description Detail|User who performed the governance review.|—|
|recA4JMQXEE85iuE4|563|Table Name|[object Object]|—|
|recA4JMQXEE85iuE4|563|Standardization|—|OK|
|recA4JMQXEE85iuE4|563|Anomalies|—|OK|
|recA4JMQXEE85iuE4|563|Field Registry|—|OK|
|recA4JMQXEE85iuE4|563|Manifest Source Config|—|OK|
|recA4JMQXEE85iuE4|563|Staging|—|OK|
|recA4JMQXEE85iuE4|563|Category ID Prefix|SYS_Ref_SKU_Reviewer|—|
|recA4JMQXEE85iuE4|563|CanonicalRegistry|563|OK|
|recA4JMQXEE85iuE4|563|From field: CanonicalRegistry|563, 614|OK|
|recA4JMQXEE85iuE4|563|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec5HbxiOGieztMon|564|Field Name|Related Products|—|
|rec5HbxiOGieztMon|564|Normalization Fn|N/A|—|
|rec5HbxiOGieztMon|564|Validation Rule|Must link to valid Product Master ID|—|
|rec5HbxiOGieztMon|564|Is Required|—|—|
|rec5HbxiOGieztMon|564|Example Input|—|—|
|rec5HbxiOGieztMon|564|Example Output|—|—|
|rec5HbxiOGieztMon|564|Last Modified|2026-03-02T15:32:55.000Z|—|
|rec5HbxiOGieztMon|564|Field Type|[object Object]|—|
|rec5HbxiOGieztMon|564|Canonical_Registry_ID|564|—|
|rec5HbxiOGieztMon|564|Description Detail|Links the master colour to all products available in this colour.|—|
|rec5HbxiOGieztMon|564|Table Name|[object Object]|—|
|rec5HbxiOGieztMon|564|Standardization|—|OK|
|rec5HbxiOGieztMon|564|Anomalies|—|OK|
|rec5HbxiOGieztMon|564|Field Registry|recNIJyTUsDM0xUAI|OK|
|rec5HbxiOGieztMon|564|Manifest Source Config|—|OK|
|rec5HbxiOGieztMon|564|Staging|—|OK|
|rec5HbxiOGieztMon|564|Category ID Prefix|—|—|
|rec5HbxiOGieztMon|564|CanonicalRegistry|564|OK|
|rec5HbxiOGieztMon|564|From field: CanonicalRegistry|564, 602, 608, 809, 811, 813|OK|
|rec5HbxiOGieztMon|564|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recRKCPEGeLSQ8LUC|574|Field Name|Clean Body Finish|—|
|recRKCPEGeLSQ8LUC|574|Normalization Fn|Points to {Finish Name} from the UPCBodyFinishes table.|—|
|recRKCPEGeLSQ8LUC|574|Validation Rule|—|—|
|recRKCPEGeLSQ8LUC|574|Is Required|—|—|
|recRKCPEGeLSQ8LUC|574|Example Input|—|—|
|recRKCPEGeLSQ8LUC|574|Example Output|—|—|
|recRKCPEGeLSQ8LUC|574|Last Modified|2026-03-03T12:01:53.000Z|—|
|recRKCPEGeLSQ8LUC|574|Field Type|[object Object]|—|
|recRKCPEGeLSQ8LUC|574|Canonical_Registry_ID|574|—|
|recRKCPEGeLSQ8LUC|574|Description Detail|—|—|
|recRKCPEGeLSQ8LUC|574|Table Name|[object Object]|—|
|recRKCPEGeLSQ8LUC|574|Standardization|—|OK|
|recRKCPEGeLSQ8LUC|574|Anomalies|—|OK|
|recRKCPEGeLSQ8LUC|574|Field Registry|—|OK|
|recRKCPEGeLSQ8LUC|574|Manifest Source Config|—|OK|
|recRKCPEGeLSQ8LUC|574|Staging|—|OK|
|recRKCPEGeLSQ8LUC|574|Category ID Prefix|—|—|
|recRKCPEGeLSQ8LUC|574|CanonicalRegistry|574|OK|
|recRKCPEGeLSQ8LUC|574|From field: CanonicalRegistry|574|OK|
|recRKCPEGeLSQ8LUC|574|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recGYFDAwemKaYSzc|576|Field Name|Thickness Raw|—|
|recGYFDAwemKaYSzc|576|Normalization Fn|—|—|
|recGYFDAwemKaYSzc|576|Validation Rule|—|—|
|recGYFDAwemKaYSzc|576|Is Required|—|—|
|recGYFDAwemKaYSzc|576|Example Input|—|—|
|recGYFDAwemKaYSzc|576|Example Output|—|—|
|recGYFDAwemKaYSzc|576|Last Modified|2026-03-05T07:39:17.000Z|—|
|recGYFDAwemKaYSzc|576|Field Type|[object Object]|—|
|recGYFDAwemKaYSzc|576|Canonical_Registry_ID|576|—|
|recGYFDAwemKaYSzc|576|Description Detail|—|—|
|recGYFDAwemKaYSzc|576|Table Name|[object Object]|—|
|recGYFDAwemKaYSzc|576|Standardization|—|OK|
|recGYFDAwemKaYSzc|576|Anomalies|—|OK|
|recGYFDAwemKaYSzc|576|Field Registry|fldbgiMR2Qlm169Mu|OK|
|recGYFDAwemKaYSzc|576|Manifest Source Config|—|OK|
|recGYFDAwemKaYSzc|576|Staging|—|OK|
|recGYFDAwemKaYSzc|576|Category ID Prefix|—|—|
|recGYFDAwemKaYSzc|576|CanonicalRegistry|576|OK|
|recGYFDAwemKaYSzc|576|From field: CanonicalRegistry|576|OK|
|recGYFDAwemKaYSzc|576|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recUqo7IvTgJYy870|578|Field Name|UPCShapeType|—|
|recUqo7IvTgJYy870|578|Normalization Fn|N/A (Manual/System Link)|—|
|recUqo7IvTgJYy870|578|Validation Rule|Must link to an active geometric shape record in the UPCShapeType reference table.|—|
|recUqo7IvTgJYy870|578|Is Required|—|—|
|recUqo7IvTgJYy870|578|Example Input|—|—|
|recUqo7IvTgJYy870|578|Example Output|—|—|
|recUqo7IvTgJYy870|578|Last Modified|2026-03-05T11:56:26.000Z|—|
|recUqo7IvTgJYy870|578|Field Type|[object Object]|—|
|recUqo7IvTgJYy870|578|Canonical_Registry_ID|578|—|
|recUqo7IvTgJYy870|578|Description Detail|Links a tile directly to its standardized geometric shape.|—|
|recUqo7IvTgJYy870|578|Table Name|[object Object]|—|
|recUqo7IvTgJYy870|578|Standardization|—|OK|
|recUqo7IvTgJYy870|578|Anomalies|—|OK|
|recUqo7IvTgJYy870|578|Field Registry|fldvFuyvmbSLu7rKP|OK|
|recUqo7IvTgJYy870|578|Manifest Source Config|—|OK|
|recUqo7IvTgJYy870|578|Staging|—|OK|
|recUqo7IvTgJYy870|578|Category ID Prefix|—|—|
|recUqo7IvTgJYy870|578|CanonicalRegistry|578|OK|
|recUqo7IvTgJYy870|578|From field: CanonicalRegistry|578, 792, 812|OK|
|recUqo7IvTgJYy870|578|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recnEPs91ceRT1Oz7|579|Field Name|shape description|—|
|recnEPs91ceRT1Oz7|579|Normalization Fn|TRIM({Description})|—|
|recnEPs91ceRT1Oz7|579|Validation Rule|—|—|
|recnEPs91ceRT1Oz7|579|Is Required|—|—|
|recnEPs91ceRT1Oz7|579|Example Input|—|—|
|recnEPs91ceRT1Oz7|579|Example Output|—|—|
|recnEPs91ceRT1Oz7|579|Last Modified|2026-03-05T11:48:57.000Z|—|
|recnEPs91ceRT1Oz7|579|Field Type|[object Object]|—|
|recnEPs91ceRT1Oz7|579|Canonical_Registry_ID|579|—|
|recnEPs91ceRT1Oz7|579|Description Detail|Internal description defining the geometric shape characteristics.|—|
|recnEPs91ceRT1Oz7|579|Table Name|[object Object]|—|
|recnEPs91ceRT1Oz7|579|Standardization|—|OK|
|recnEPs91ceRT1Oz7|579|Anomalies|—|OK|
|recnEPs91ceRT1Oz7|579|Field Registry|—|OK|
|recnEPs91ceRT1Oz7|579|Manifest Source Config|—|OK|
|recnEPs91ceRT1Oz7|579|Staging|—|OK|
|recnEPs91ceRT1Oz7|579|Category ID Prefix|—|—|
|recnEPs91ceRT1Oz7|579|CanonicalRegistry|579|OK|
|recnEPs91ceRT1Oz7|579|From field: CanonicalRegistry|579|OK|
|recnEPs91ceRT1Oz7|579|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recX8o1OCLlENzyqp|584|Field Name|Materials Name ID|—|
|recX8o1OCLlENzyqp|584|Normalization Fn|{fld4tPlgokwIqLRhB} & " (" & {fldUGV9iR60g0P4SH} & ")"|—|
|recX8o1OCLlENzyqp|584|Validation Rule|None|—|
|recX8o1OCLlENzyqp|584|Is Required|—|—|
|recX8o1OCLlENzyqp|584|Example Input|—|—|
|recX8o1OCLlENzyqp|584|Example Output|—|—|
|recX8o1OCLlENzyqp|584|Last Modified|2026-03-05T13:09:14.000Z|—|
|recX8o1OCLlENzyqp|584|Field Type|[object Object]|—|
|recX8o1OCLlENzyqp|584|Canonical_Registry_ID|584|—|
|recX8o1OCLlENzyqp|584|Description Detail|Computed string dynamically combining the material name and its type.|—|
|recX8o1OCLlENzyqp|584|Table Name|[object Object]|—|
|recX8o1OCLlENzyqp|584|Standardization|—|OK|
|recX8o1OCLlENzyqp|584|Anomalies|—|OK|
|recX8o1OCLlENzyqp|584|Field Registry|recVBEncrW9J4YUDV|OK|
|recX8o1OCLlENzyqp|584|Manifest Source Config|—|OK|
|recX8o1OCLlENzyqp|584|Staging|—|OK|
|recX8o1OCLlENzyqp|584|Category ID Prefix|MAT_MaterialsName_ID|—|
|recX8o1OCLlENzyqp|584|CanonicalRegistry|584|OK|
|recX8o1OCLlENzyqp|584|From field: CanonicalRegistry|584|OK|
|recX8o1OCLlENzyqp|584|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recubltX3ciDpZo8b|585|Field Name|Name (materials)|—|
|recubltX3ciDpZo8b|585|Normalization Fn|TRIM({Name})|—|
|recubltX3ciDpZo8b|585|Validation Rule|None|—|
|recubltX3ciDpZo8b|585|Is Required|—|—|
|recubltX3ciDpZo8b|585|Example Input|—|—|
|recubltX3ciDpZo8b|585|Example Output|—|—|
|recubltX3ciDpZo8b|585|Last Modified|2026-03-05T13:09:27.000Z|—|
|recubltX3ciDpZo8b|585|Field Type|[object Object]|—|
|recubltX3ciDpZo8b|585|Canonical_Registry_ID|585|—|
|recubltX3ciDpZo8b|585|Description Detail|Specific descriptive internal name for the companion material.|—|
|recubltX3ciDpZo8b|585|Table Name|[object Object]|—|
|recubltX3ciDpZo8b|585|Standardization|—|OK|
|recubltX3ciDpZo8b|585|Anomalies|—|OK|
|recubltX3ciDpZo8b|585|Field Registry|recSE7Kmo5BJPClXL|OK|
|recubltX3ciDpZo8b|585|Manifest Source Config|—|OK|
|recubltX3ciDpZo8b|585|Staging|—|OK|
|recubltX3ciDpZo8b|585|Category ID Prefix|MAT_Name(Materials)|—|
|recubltX3ciDpZo8b|585|CanonicalRegistry|585|OK|
|recubltX3ciDpZo8b|585|From field: CanonicalRegistry|585|OK|
|recubltX3ciDpZo8b|585|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recYbEfXe4GYq9ynu|587|Field Name|Description|—|
|recYbEfXe4GYq9ynu|587|Normalization Fn|TRIM({Description})|—|
|recYbEfXe4GYq9ynu|587|Validation Rule|None|—|
|recYbEfXe4GYq9ynu|587|Is Required|—|—|
|recYbEfXe4GYq9ynu|587|Example Input|—|—|
|recYbEfXe4GYq9ynu|587|Example Output|—|—|
|recYbEfXe4GYq9ynu|587|Last Modified|2026-03-05T13:08:06.000Z|—|
|recYbEfXe4GYq9ynu|587|Field Type|[object Object]|—|
|recYbEfXe4GYq9ynu|587|Canonical_Registry_ID|587|—|
|recYbEfXe4GYq9ynu|587|Description Detail|Internal description defining the material characteristics and application.|—|
|recYbEfXe4GYq9ynu|587|Table Name|[object Object]|—|
|recYbEfXe4GYq9ynu|587|Standardization|—|OK|
|recYbEfXe4GYq9ynu|587|Anomalies|—|OK|
|recYbEfXe4GYq9ynu|587|Field Registry|—|OK|
|recYbEfXe4GYq9ynu|587|Manifest Source Config|—|OK|
|recYbEfXe4GYq9ynu|587|Staging|—|OK|
|recYbEfXe4GYq9ynu|587|Category ID Prefix|—|—|
|recYbEfXe4GYq9ynu|587|CanonicalRegistry|542|OK|
|recYbEfXe4GYq9ynu|587|From field: CanonicalRegistry|—|OK|
|recYbEfXe4GYq9ynu|587|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recPOWr7THjQgTV3Y|588|Field Name|Setting Time|—|
|recPOWr7THjQgTV3Y|588|Normalization Fn|N/A|—|
|recPOWr7THjQgTV3Y|588|Validation Rule|Must be one of: Rapid (6-12h), Standard (24h):, Standard (24), Full Cure (48-72h), Final Cure (7-14 Days, Industrial / Rapid Strength 90min|—|
|recPOWr7THjQgTV3Y|588|Is Required|—|—|
|recPOWr7THjQgTV3Y|588|Example Input|—|—|
|recPOWr7THjQgTV3Y|588|Example Output|—|—|
|recPOWr7THjQgTV3Y|588|Last Modified|2026-03-05T13:08:06.000Z|—|
|recPOWr7THjQgTV3Y|588|Field Type|[object Object]|—|
|recPOWr7THjQgTV3Y|588|Canonical_Registry_ID|588|—|
|recPOWr7THjQgTV3Y|588|Description Detail|Standardized selection for material curing and setting times.|—|
|recPOWr7THjQgTV3Y|588|Table Name|[object Object]|—|
|recPOWr7THjQgTV3Y|588|Standardization|—|OK|
|recPOWr7THjQgTV3Y|588|Anomalies|—|OK|
|recPOWr7THjQgTV3Y|588|Field Registry|—|OK|
|recPOWr7THjQgTV3Y|588|Manifest Source Config|—|OK|
|recPOWr7THjQgTV3Y|588|Staging|—|OK|
|recPOWr7THjQgTV3Y|588|Category ID Prefix|—|—|
|recPOWr7THjQgTV3Y|588|CanonicalRegistry|588|OK|
|recPOWr7THjQgTV3Y|588|From field: CanonicalRegistry|588|OK|
|recPOWr7THjQgTV3Y|588|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recCy6cWPvAG0PRyA|589|Field Name|Brands|—|
|recCy6cWPvAG0PRyA|589|Normalization Fn|N/A|—|
|recCy6cWPvAG0PRyA|589|Validation Rule|Must be one of: Tylon, Tal, Douglas Jones, EZEE Tile, MAPEI, TFC|—|
|recCy6cWPvAG0PRyA|589|Is Required|—|—|
|recCy6cWPvAG0PRyA|589|Example Input|—|—|
|recCy6cWPvAG0PRyA|589|Example Output|—|—|
|recCy6cWPvAG0PRyA|589|Last Modified|2026-03-05T13:08:06.000Z|—|
|recCy6cWPvAG0PRyA|589|Field Type|[object Object]|—|
|recCy6cWPvAG0PRyA|589|Canonical_Registry_ID|589|—|
|recCy6cWPvAG0PRyA|589|Description Detail|Standardized selection for approved material brands.|—|
|recCy6cWPvAG0PRyA|589|Table Name|[object Object]|—|
|recCy6cWPvAG0PRyA|589|Standardization|—|OK|
|recCy6cWPvAG0PRyA|589|Anomalies|—|OK|
|recCy6cWPvAG0PRyA|589|Field Registry|—|OK|
|recCy6cWPvAG0PRyA|589|Manifest Source Config|—|OK|
|recCy6cWPvAG0PRyA|589|Staging|—|OK|
|recCy6cWPvAG0PRyA|589|Category ID Prefix|—|—|
|recCy6cWPvAG0PRyA|589|CanonicalRegistry|589|OK|
|recCy6cWPvAG0PRyA|589|From field: CanonicalRegistry|589|OK|
|recCy6cWPvAG0PRyA|589|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recAgVM3tKi5M93l1|591|Field Name|Required Grout|—|
|recAgVM3tKi5M93l1|591|Normalization Fn|N/A (Manual/System Link)|—|
|recAgVM3tKi5M93l1|591|Validation Rule|Must link to an active material record in the UPCMaterials reference table.|—|
|recAgVM3tKi5M93l1|591|Is Required|—|—|
|recAgVM3tKi5M93l1|591|Example Input|—|—|
|recAgVM3tKi5M93l1|591|Example Output|—|—|
|recAgVM3tKi5M93l1|591|Last Modified|2026-03-05T13:08:06.000Z|—|
|recAgVM3tKi5M93l1|591|Field Type|[object Object]|—|
|recAgVM3tKi5M93l1|591|Canonical_Registry_ID|591|—|
|recAgVM3tKi5M93l1|591|Description Detail|Links a tile directly to its recommended grout.|—|
|recAgVM3tKi5M93l1|591|Table Name|[object Object]|—|
|recAgVM3tKi5M93l1|591|Standardization|47, 50|OK|
|recAgVM3tKi5M93l1|591|Anomalies|—|OK|
|recAgVM3tKi5M93l1|591|Field Registry|reciBNEe4caj61JEU|OK|
|recAgVM3tKi5M93l1|591|Manifest Source Config|—|OK|
|recAgVM3tKi5M93l1|591|Staging|—|OK|
|recAgVM3tKi5M93l1|591|Category ID Prefix|—|—|
|recAgVM3tKi5M93l1|591|CanonicalRegistry|591|OK|
|recAgVM3tKi5M93l1|591|From field: CanonicalRegistry|591, 788, 804|OK|
|recAgVM3tKi5M93l1|591|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recFftGg2HEouIBeB|592|Field Name|Required Sealant|—|
|recFftGg2HEouIBeB|592|Normalization Fn|N/A (Manual/System Link)|—|
|recFftGg2HEouIBeB|592|Validation Rule|Must link to an active material record in the UPCMaterials reference table.|—|
|recFftGg2HEouIBeB|592|Is Required|—|—|
|recFftGg2HEouIBeB|592|Example Input|—|—|
|recFftGg2HEouIBeB|592|Example Output|—|—|
|recFftGg2HEouIBeB|592|Last Modified|2026-03-05T13:08:06.000Z|—|
|recFftGg2HEouIBeB|592|Field Type|[object Object]|—|
|recFftGg2HEouIBeB|592|Canonical_Registry_ID|592|—|
|recFftGg2HEouIBeB|592|Description Detail|Links a tile directly to its recommended sealant.|—|
|recFftGg2HEouIBeB|592|Table Name|[object Object]|—|
|recFftGg2HEouIBeB|592|Standardization|—|OK|
|recFftGg2HEouIBeB|592|Anomalies|—|OK|
|recFftGg2HEouIBeB|592|Field Registry|recr2HpZtbU5jPuJm|OK|
|recFftGg2HEouIBeB|592|Manifest Source Config|—|OK|
|recFftGg2HEouIBeB|592|Staging|—|OK|
|recFftGg2HEouIBeB|592|Category ID Prefix|—|—|
|recFftGg2HEouIBeB|592|CanonicalRegistry|592|OK|
|recFftGg2HEouIBeB|592|From field: CanonicalRegistry|592, 789, 806|OK|
|recFftGg2HEouIBeB|592|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recYxkvfPsZXogR1F|593|Field Name|Attachment Summary|—|
|recYxkvfPsZXogR1F|593|Normalization Fn|N/A|—|
|recYxkvfPsZXogR1F|593|Validation Rule|Optional.|—|
|recYxkvfPsZXogR1F|593|Is Required|—|—|
|recYxkvfPsZXogR1F|593|Example Input|—|—|
|recYxkvfPsZXogR1F|593|Example Output|—|—|
|recYxkvfPsZXogR1F|593|Last Modified|2026-03-05T14:16:36.000Z|—|
|recYxkvfPsZXogR1F|593|Field Type|[object Object]|—|
|recYxkvfPsZXogR1F|593|Canonical_Registry_ID|593|—|
|recYxkvfPsZXogR1F|593|Description Detail|AI generated summary of technical documents attached to this body class.|—|
|recYxkvfPsZXogR1F|593|Table Name|[object Object]|—|
|recYxkvfPsZXogR1F|593|Standardization|—|OK|
|recYxkvfPsZXogR1F|593|Anomalies|—|OK|
|recYxkvfPsZXogR1F|593|Field Registry|recDAHvEpjR0QrkV6|OK|
|recYxkvfPsZXogR1F|593|Manifest Source Config|—|OK|
|recYxkvfPsZXogR1F|593|Staging|—|OK|
|recYxkvfPsZXogR1F|593|Category ID Prefix|—|—|
|recYxkvfPsZXogR1F|593|CanonicalRegistry|593|OK|
|recYxkvfPsZXogR1F|593|From field: CanonicalRegistry|593|OK|
|recYxkvfPsZXogR1F|593|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recDboLs23xlFWDL6|594|Field Name|Product Master|—|
|recDboLs23xlFWDL6|594|Normalization Fn|N/A (Manual/System Link)|—|
|recDboLs23xlFWDL6|594|Validation Rule|Must link to an active record in Product Master.|—|
|recDboLs23xlFWDL6|594|Is Required|—|—|
|recDboLs23xlFWDL6|594|Example Input|—|—|
|recDboLs23xlFWDL6|594|Example Output|—|—|
|recDboLs23xlFWDL6|594|Last Modified|2026-03-05T14:16:36.000Z|—|
|recDboLs23xlFWDL6|594|Field Type|[object Object]|—|
|recDboLs23xlFWDL6|594|Canonical_Registry_ID|594|—|
|recDboLs23xlFWDL6|594|Description Detail|A reference connecting the body class to the primary product catalog.|—|
|recDboLs23xlFWDL6|594|Table Name|[object Object]|—|
|recDboLs23xlFWDL6|594|Standardization|—|OK|
|recDboLs23xlFWDL6|594|Anomalies|—|OK|
|recDboLs23xlFWDL6|594|Field Registry|—|OK|
|recDboLs23xlFWDL6|594|Manifest Source Config|—|OK|
|recDboLs23xlFWDL6|594|Staging|—|OK|
|recDboLs23xlFWDL6|594|Category ID Prefix|—|—|
|recDboLs23xlFWDL6|594|CanonicalRegistry|594|OK|
|recDboLs23xlFWDL6|594|From field: CanonicalRegistry|594, 598, 797|OK|
|recDboLs23xlFWDL6|594|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recK15cMLMfh8wZr0|595|Field Name|Finish Name|—|
|recK15cMLMfh8wZr0|595|Normalization Fn|PROPER(TRIM({Finish Name}))|—|
|recK15cMLMfh8wZr0|595|Validation Rule|Must be unique; Not empty.|—|
|recK15cMLMfh8wZr0|595|Is Required|—|—|
|recK15cMLMfh8wZr0|595|Example Input|—|—|
|recK15cMLMfh8wZr0|595|Example Output|—|—|
|recK15cMLMfh8wZr0|595|Last Modified|2026-03-05T14:20:46.000Z|—|
|recK15cMLMfh8wZr0|595|Field Type|[object Object]|—|
|recK15cMLMfh8wZr0|595|Canonical_Registry_ID|595|—|
|recK15cMLMfh8wZr0|595|Description Detail|Primary canonical name of the finish.|—|
|recK15cMLMfh8wZr0|595|Table Name|[object Object]|—|
|recK15cMLMfh8wZr0|595|Standardization|—|OK|
|recK15cMLMfh8wZr0|595|Anomalies|—|OK|
|recK15cMLMfh8wZr0|595|Field Registry|—|OK|
|recK15cMLMfh8wZr0|595|Manifest Source Config|—|OK|
|recK15cMLMfh8wZr0|595|Staging|—|OK|
|recK15cMLMfh8wZr0|595|Category ID Prefix|—|—|
|recK15cMLMfh8wZr0|595|CanonicalRegistry|595|OK|
|recK15cMLMfh8wZr0|595|From field: CanonicalRegistry|595|OK|
|recK15cMLMfh8wZr0|595|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec5JF819etsde1Ny|596|Field Name|Description|—|
|rec5JF819etsde1Ny|596|Normalization Fn|TRIM({Description})|—|
|rec5JF819etsde1Ny|596|Validation Rule|Optional.|—|
|rec5JF819etsde1Ny|596|Is Required|—|—|
|rec5JF819etsde1Ny|596|Example Input|—|—|
|rec5JF819etsde1Ny|596|Example Output|—|—|
|rec5JF819etsde1Ny|596|Last Modified|2026-03-05T14:20:46.000Z|—|
|rec5JF819etsde1Ny|596|Field Type|[object Object]|—|
|rec5JF819etsde1Ny|596|Canonical_Registry_ID|596|—|
|rec5JF819etsde1Ny|596|Description Detail|Detailed description of the finish characteristics and tactile feel.|—|
|rec5JF819etsde1Ny|596|Table Name|[object Object]|—|
|rec5JF819etsde1Ny|596|Standardization|—|OK|
|rec5JF819etsde1Ny|596|Anomalies|—|OK|
|rec5JF819etsde1Ny|596|Field Registry|—|OK|
|rec5JF819etsde1Ny|596|Manifest Source Config|—|OK|
|rec5JF819etsde1Ny|596|Staging|—|OK|
|rec5JF819etsde1Ny|596|Category ID Prefix|—|—|
|rec5JF819etsde1Ny|596|CanonicalRegistry|542|OK|
|rec5JF819etsde1Ny|596|From field: CanonicalRegistry|—|OK|
|rec5JF819etsde1Ny|596|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recOCRxnzdEszSvtK|597|Field Name|Finish Category|—|
|recOCRxnzdEszSvtK|597|Normalization Fn|INTERNAL SELECTION|—|
|recOCRxnzdEszSvtK|597|Validation Rule|Must be one of: Matt, Gloss, Textured without slip resistance, Textured with slip resistance, GRIP - Ultra Slip Resistance, Lappato, Polished, Matt with Gloss, Gloss/Matt.|—|
|recOCRxnzdEszSvtK|597|Is Required|—|—|
|recOCRxnzdEszSvtK|597|Example Input|—|—|
|recOCRxnzdEszSvtK|597|Example Output|—|—|
|recOCRxnzdEszSvtK|597|Last Modified|2026-03-05T14:20:46.000Z|—|
|recOCRxnzdEszSvtK|597|Field Type|[object Object]|—|
|recOCRxnzdEszSvtK|597|Canonical_Registry_ID|597|—|
|recOCRxnzdEszSvtK|597|Description Detail|High-level grouping of finishes for filtering.|—|
|recOCRxnzdEszSvtK|597|Table Name|[object Object]|—|
|recOCRxnzdEszSvtK|597|Standardization|—|OK|
|recOCRxnzdEszSvtK|597|Anomalies|—|OK|
|recOCRxnzdEszSvtK|597|Field Registry|fldkUQKSN3hOjMzMV|OK|
|recOCRxnzdEszSvtK|597|Manifest Source Config|—|OK|
|recOCRxnzdEszSvtK|597|Staging|—|OK|
|recOCRxnzdEszSvtK|597|Category ID Prefix|—|—|
|recOCRxnzdEszSvtK|597|CanonicalRegistry|597|OK|
|recOCRxnzdEszSvtK|597|From field: CanonicalRegistry|597|OK|
|recOCRxnzdEszSvtK|597|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recsv1UlvURBPi0Yz|598|Field Name|Product Master|—|
|recsv1UlvURBPi0Yz|598|Normalization Fn|N/A (Manual/System Link)|—|
|recsv1UlvURBPi0Yz|598|Validation Rule|Must link to an active record in Product Master.|—|
|recsv1UlvURBPi0Yz|598|Is Required|—|—|
|recsv1UlvURBPi0Yz|598|Example Input|—|—|
|recsv1UlvURBPi0Yz|598|Example Output|—|—|
|recsv1UlvURBPi0Yz|598|Last Modified|2026-03-05T14:20:46.000Z|—|
|recsv1UlvURBPi0Yz|598|Field Type|[object Object]|—|
|recsv1UlvURBPi0Yz|598|Canonical_Registry_ID|598|—|
|recsv1UlvURBPi0Yz|598|Description Detail|Links the canonical finish back to all products utilizing it.|—|
|recsv1UlvURBPi0Yz|598|Table Name|[object Object]|—|
|recsv1UlvURBPi0Yz|598|Standardization|—|OK|
|recsv1UlvURBPi0Yz|598|Anomalies|—|OK|
|recsv1UlvURBPi0Yz|598|Field Registry|—|OK|
|recsv1UlvURBPi0Yz|598|Manifest Source Config|—|OK|
|recsv1UlvURBPi0Yz|598|Staging|—|OK|
|recsv1UlvURBPi0Yz|598|Category ID Prefix|—|—|
|recsv1UlvURBPi0Yz|598|CanonicalRegistry|594|OK|
|recsv1UlvURBPi0Yz|598|From field: CanonicalRegistry|—|OK|
|recsv1UlvURBPi0Yz|598|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recX5lLuonB37FPhP|599|Field Name|Design Style Name|—|
|recX5lLuonB37FPhP|599|Normalization Fn|PROPER(TRIM({Design Style Name}))|—|
|recX5lLuonB37FPhP|599|Validation Rule|Must be unique; Not empty.|—|
|recX5lLuonB37FPhP|599|Is Required|—|—|
|recX5lLuonB37FPhP|599|Example Input|—|—|
|recX5lLuonB37FPhP|599|Example Output|—|—|
|recX5lLuonB37FPhP|599|Last Modified|2026-03-05T14:24:08.000Z|—|
|recX5lLuonB37FPhP|599|Field Type|[object Object]|—|
|recX5lLuonB37FPhP|599|Canonical_Registry_ID|599|—|
|recX5lLuonB37FPhP|599|Description Detail|Governs design styles (e.g., Classic, Modern, Biophilic).|—|
|recX5lLuonB37FPhP|599|Table Name|[object Object]|—|
|recX5lLuonB37FPhP|599|Standardization|—|OK|
|recX5lLuonB37FPhP|599|Anomalies|—|OK|
|recX5lLuonB37FPhP|599|Field Registry|—|OK|
|recX5lLuonB37FPhP|599|Manifest Source Config|—|OK|
|recX5lLuonB37FPhP|599|Staging|—|OK|
|recX5lLuonB37FPhP|599|Category ID Prefix|—|—|
|recX5lLuonB37FPhP|599|CanonicalRegistry|599|OK|
|recX5lLuonB37FPhP|599|From field: CanonicalRegistry|599|OK|
|recX5lLuonB37FPhP|599|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recXbDnZlUYpqjbrF|600|Field Name|Description|—|
|recXbDnZlUYpqjbrF|600|Normalization Fn|TRIM({Description})|—|
|recXbDnZlUYpqjbrF|600|Validation Rule|Optional.|—|
|recXbDnZlUYpqjbrF|600|Is Required|—|—|
|recXbDnZlUYpqjbrF|600|Example Input|—|—|
|recXbDnZlUYpqjbrF|600|Example Output|—|—|
|recXbDnZlUYpqjbrF|600|Last Modified|2026-03-05T14:24:08.000Z|—|
|recXbDnZlUYpqjbrF|600|Field Type|[object Object]|—|
|recXbDnZlUYpqjbrF|600|Canonical_Registry_ID|600|—|
|recXbDnZlUYpqjbrF|600|Description Detail|Internal description defining the design style.|—|
|recXbDnZlUYpqjbrF|600|Table Name|[object Object]|—|
|recXbDnZlUYpqjbrF|600|Standardization|—|OK|
|recXbDnZlUYpqjbrF|600|Anomalies|—|OK|
|recXbDnZlUYpqjbrF|600|Field Registry|—|OK|
|recXbDnZlUYpqjbrF|600|Manifest Source Config|—|OK|
|recXbDnZlUYpqjbrF|600|Staging|—|OK|
|recXbDnZlUYpqjbrF|600|Category ID Prefix|—|—|
|recXbDnZlUYpqjbrF|600|CanonicalRegistry|542|OK|
|recXbDnZlUYpqjbrF|600|From field: CanonicalRegistry|—|OK|
|recXbDnZlUYpqjbrF|600|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recl1yYceM8eQE1Bp|601|Field Name|Status|—|
|recl1yYceM8eQE1Bp|601|Normalization Fn|INTERNAL SELECTION|—|
|recl1yYceM8eQE1Bp|601|Validation Rule|Must be one of: Active, Obsolete.|—|
|recl1yYceM8eQE1Bp|601|Is Required|—|—|
|recl1yYceM8eQE1Bp|601|Example Input|—|—|
|recl1yYceM8eQE1Bp|601|Example Output|—|—|
|recl1yYceM8eQE1Bp|601|Last Modified|2026-03-05T14:24:08.000Z|—|
|recl1yYceM8eQE1Bp|601|Field Type|[object Object]|—|
|recl1yYceM8eQE1Bp|601|Canonical_Registry_ID|601|—|
|recl1yYceM8eQE1Bp|601|Description Detail|Lifecycle status of this design style in the MDM.|—|
|recl1yYceM8eQE1Bp|601|Table Name|[object Object]|—|
|recl1yYceM8eQE1Bp|601|Standardization|—|OK|
|recl1yYceM8eQE1Bp|601|Anomalies|—|OK|
|recl1yYceM8eQE1Bp|601|Field Registry|—|OK|
|recl1yYceM8eQE1Bp|601|Manifest Source Config|—|OK|
|recl1yYceM8eQE1Bp|601|Staging|—|OK|
|recl1yYceM8eQE1Bp|601|Category ID Prefix|—|—|
|recl1yYceM8eQE1Bp|601|CanonicalRegistry|601|OK|
|recl1yYceM8eQE1Bp|601|From field: CanonicalRegistry|601, 607|OK|
|recl1yYceM8eQE1Bp|601|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recRewGFAgFqaNtfr|602|Field Name|Related Products|—|
|recRewGFAgFqaNtfr|602|Normalization Fn|N/A (Manual/System Link)|—|
|recRewGFAgFqaNtfr|602|Validation Rule|Must link to an active record in Product Master.|—|
|recRewGFAgFqaNtfr|602|Is Required|—|—|
|recRewGFAgFqaNtfr|602|Example Input|—|—|
|recRewGFAgFqaNtfr|602|Example Output|—|—|
|recRewGFAgFqaNtfr|602|Last Modified|2026-03-05T14:24:08.000Z|—|
|recRewGFAgFqaNtfr|602|Field Type|[object Object]|—|
|recRewGFAgFqaNtfr|602|Canonical_Registry_ID|602|—|
|recRewGFAgFqaNtfr|602|Description Detail|Links the design style back to all products utilizing it.|—|
|recRewGFAgFqaNtfr|602|Table Name|[object Object]|—|
|recRewGFAgFqaNtfr|602|Standardization|—|OK|
|recRewGFAgFqaNtfr|602|Anomalies|—|OK|
|recRewGFAgFqaNtfr|602|Field Registry|—|OK|
|recRewGFAgFqaNtfr|602|Manifest Source Config|—|OK|
|recRewGFAgFqaNtfr|602|Staging|—|OK|
|recRewGFAgFqaNtfr|602|Category ID Prefix|—|—|
|recRewGFAgFqaNtfr|602|CanonicalRegistry|564|OK|
|recRewGFAgFqaNtfr|602|From field: CanonicalRegistry|—|OK|
|recRewGFAgFqaNtfr|602|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec9bE3eXAHRWlGIl|603|Field Name|UPCColourMaster|—|
|rec9bE3eXAHRWlGIl|603|Normalization Fn|N/A (Manual/System Link)|—|
|rec9bE3eXAHRWlGIl|603|Validation Rule|Must link to an active record in UPCColourMaster.|—|
|rec9bE3eXAHRWlGIl|603|Is Required|—|—|
|rec9bE3eXAHRWlGIl|603|Example Input|—|—|
|rec9bE3eXAHRWlGIl|603|Example Output|—|—|
|rec9bE3eXAHRWlGIl|603|Last Modified|2026-03-05T14:24:08.000Z|—|
|rec9bE3eXAHRWlGIl|603|Field Type|[object Object]|—|
|rec9bE3eXAHRWlGIl|603|Canonical_Registry_ID|603|—|
|rec9bE3eXAHRWlGIl|603|Description Detail|Links the design style to a specific color profile.|—|
|rec9bE3eXAHRWlGIl|603|Table Name|[object Object]|—|
|rec9bE3eXAHRWlGIl|603|Standardization|—|OK|
|rec9bE3eXAHRWlGIl|603|Anomalies|—|OK|
|rec9bE3eXAHRWlGIl|603|Field Registry|—|OK|
|rec9bE3eXAHRWlGIl|603|Manifest Source Config|—|OK|
|rec9bE3eXAHRWlGIl|603|Staging|—|OK|
|rec9bE3eXAHRWlGIl|603|Category ID Prefix|—|—|
|rec9bE3eXAHRWlGIl|603|CanonicalRegistry|553|OK|
|rec9bE3eXAHRWlGIl|603|From field: CanonicalRegistry|—|OK|
|rec9bE3eXAHRWlGIl|603|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recB2B3adjfgMqBnz|604|Field Name|Look Name|—|
|recB2B3adjfgMqBnz|604|Normalization Fn|PROPER(TRIM({Look Name}))|—|
|recB2B3adjfgMqBnz|604|Validation Rule|Must be unique; Not empty.|—|
|recB2B3adjfgMqBnz|604|Is Required|—|—|
|recB2B3adjfgMqBnz|604|Example Input|—|—|
|recB2B3adjfgMqBnz|604|Example Output|—|—|
|recB2B3adjfgMqBnz|604|Last Modified|2026-03-05T14:26:30.000Z|—|
|recB2B3adjfgMqBnz|604|Field Type|[object Object]|—|
|recB2B3adjfgMqBnz|604|Canonical_Registry_ID|604|—|
|recB2B3adjfgMqBnz|604|Description Detail|Governs look and finish descriptors (e.g., Crackle, Zellige).|—|
|recB2B3adjfgMqBnz|604|Table Name|[object Object]|—|
|recB2B3adjfgMqBnz|604|Standardization|—|OK|
|recB2B3adjfgMqBnz|604|Anomalies|—|OK|
|recB2B3adjfgMqBnz|604|Field Registry|—|OK|
|recB2B3adjfgMqBnz|604|Manifest Source Config|—|OK|
|recB2B3adjfgMqBnz|604|Staging|—|OK|
|recB2B3adjfgMqBnz|604|Category ID Prefix|—|—|
|recB2B3adjfgMqBnz|604|CanonicalRegistry|604|OK|
|recB2B3adjfgMqBnz|604|From field: CanonicalRegistry|604|OK|
|recB2B3adjfgMqBnz|604|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recj45yEKQ19je7va|605|Field Name|Description|—|
|recj45yEKQ19je7va|605|Normalization Fn|TRIM({Description})|—|
|recj45yEKQ19je7va|605|Validation Rule|Optional.|—|
|recj45yEKQ19je7va|605|Is Required|—|—|
|recj45yEKQ19je7va|605|Example Input|—|—|
|recj45yEKQ19je7va|605|Example Output|—|—|
|recj45yEKQ19je7va|605|Last Modified|2026-03-05T14:26:30.000Z|—|
|recj45yEKQ19je7va|605|Field Type|[object Object]|—|
|recj45yEKQ19je7va|605|Canonical_Registry_ID|605|—|
|recj45yEKQ19je7va|605|Description Detail|Detailed description of the visual look.|—|
|recj45yEKQ19je7va|605|Table Name|[object Object]|—|
|recj45yEKQ19je7va|605|Standardization|—|OK|
|recj45yEKQ19je7va|605|Anomalies|—|OK|
|recj45yEKQ19je7va|605|Field Registry|—|OK|
|recj45yEKQ19je7va|605|Manifest Source Config|—|OK|
|recj45yEKQ19je7va|605|Staging|—|OK|
|recj45yEKQ19je7va|605|Category ID Prefix|—|—|
|recj45yEKQ19je7va|605|CanonicalRegistry|542|OK|
|recj45yEKQ19je7va|605|From field: CanonicalRegistry|—|OK|
|recj45yEKQ19je7va|605|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recwnRSqb574XJs8u|606|Field Name|Look Code|—|
|recwnRSqb574XJs8u|606|Normalization Fn|UPPER(TRIM({Look Code}))|—|
|recwnRSqb574XJs8u|606|Validation Rule|Must be unique.|—|
|recwnRSqb574XJs8u|606|Is Required|—|—|
|recwnRSqb574XJs8u|606|Example Input|—|—|
|recwnRSqb574XJs8u|606|Example Output|—|—|
|recwnRSqb574XJs8u|606|Last Modified|2026-03-05T14:26:30.000Z|—|
|recwnRSqb574XJs8u|606|Field Type|[object Object]|—|
|recwnRSqb574XJs8u|606|Canonical_Registry_ID|606|—|
|recwnRSqb574XJs8u|606|Description Detail|Unique alphanumeric code for the look.|—|
|recwnRSqb574XJs8u|606|Table Name|[object Object]|—|
|recwnRSqb574XJs8u|606|Standardization|—|OK|
|recwnRSqb574XJs8u|606|Anomalies|—|OK|
|recwnRSqb574XJs8u|606|Field Registry|—|OK|
|recwnRSqb574XJs8u|606|Manifest Source Config|—|OK|
|recwnRSqb574XJs8u|606|Staging|—|OK|
|recwnRSqb574XJs8u|606|Category ID Prefix|—|—|
|recwnRSqb574XJs8u|606|CanonicalRegistry|606|OK|
|recwnRSqb574XJs8u|606|From field: CanonicalRegistry|606|OK|
|recwnRSqb574XJs8u|606|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rechXkvE3ilUwFgnR|607|Field Name|Status|—|
|rechXkvE3ilUwFgnR|607|Normalization Fn|INTERNAL SELECTION|—|
|rechXkvE3ilUwFgnR|607|Validation Rule|Must be one of: Active, Obsolete, Inactive, Pending.|—|
|rechXkvE3ilUwFgnR|607|Is Required|—|—|
|rechXkvE3ilUwFgnR|607|Example Input|—|—|
|rechXkvE3ilUwFgnR|607|Example Output|—|—|
|rechXkvE3ilUwFgnR|607|Last Modified|2026-03-05T14:26:30.000Z|—|
|rechXkvE3ilUwFgnR|607|Field Type|[object Object]|—|
|rechXkvE3ilUwFgnR|607|Canonical_Registry_ID|607|—|
|rechXkvE3ilUwFgnR|607|Description Detail|Lifecycle status of this look/finish in the MDM.|—|
|rechXkvE3ilUwFgnR|607|Table Name|[object Object]|—|
|rechXkvE3ilUwFgnR|607|Standardization|—|OK|
|rechXkvE3ilUwFgnR|607|Anomalies|—|OK|
|rechXkvE3ilUwFgnR|607|Field Registry|—|OK|
|rechXkvE3ilUwFgnR|607|Manifest Source Config|—|OK|
|rechXkvE3ilUwFgnR|607|Staging|—|OK|
|rechXkvE3ilUwFgnR|607|Category ID Prefix|—|—|
|rechXkvE3ilUwFgnR|607|CanonicalRegistry|601|OK|
|rechXkvE3ilUwFgnR|607|From field: CanonicalRegistry|—|OK|
|rechXkvE3ilUwFgnR|607|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recYZi3s3B0tvWhbZ|608|Field Name|Related Products|—|
|recYZi3s3B0tvWhbZ|608|Normalization Fn|N/A (Manual/System Link)|—|
|recYZi3s3B0tvWhbZ|608|Validation Rule|Must link to an active record in Product Master.|—|
|recYZi3s3B0tvWhbZ|608|Is Required|—|—|
|recYZi3s3B0tvWhbZ|608|Example Input|—|—|
|recYZi3s3B0tvWhbZ|608|Example Output|—|—|
|recYZi3s3B0tvWhbZ|608|Last Modified|2026-03-05T14:26:30.000Z|—|
|recYZi3s3B0tvWhbZ|608|Field Type|[object Object]|—|
|recYZi3s3B0tvWhbZ|608|Canonical_Registry_ID|608|—|
|recYZi3s3B0tvWhbZ|608|Description Detail|Links the look back to all products utilizing it.|—|
|recYZi3s3B0tvWhbZ|608|Table Name|[object Object]|—|
|recYZi3s3B0tvWhbZ|608|Standardization|—|OK|
|recYZi3s3B0tvWhbZ|608|Anomalies|—|OK|
|recYZi3s3B0tvWhbZ|608|Field Registry|recAsPW4dyt1nk27D|OK|
|recYZi3s3B0tvWhbZ|608|Manifest Source Config|—|OK|
|recYZi3s3B0tvWhbZ|608|Staging|—|OK|
|recYZi3s3B0tvWhbZ|608|Category ID Prefix|—|—|
|recYZi3s3B0tvWhbZ|608|CanonicalRegistry|564|OK|
|recYZi3s3B0tvWhbZ|608|From field: CanonicalRegistry|—|OK|
|recYZi3s3B0tvWhbZ|608|Canonical_Registry_ID (from CanonicalRegistry)||—|
|reckIw6NtouoAzp5y|609|Field Name|UoM Code|—|
|reckIw6NtouoAzp5y|609|Normalization Fn|UPPER(TRIM({UoM Code}))|—|
|reckIw6NtouoAzp5y|609|Validation Rule|Must be unique; No spaces.|—|
|reckIw6NtouoAzp5y|609|Is Required|—|—|
|reckIw6NtouoAzp5y|609|Example Input|—|—|
|reckIw6NtouoAzp5y|609|Example Output|—|—|
|reckIw6NtouoAzp5y|609|Last Modified|2026-03-05T14:28:19.000Z|—|
|reckIw6NtouoAzp5y|609|Field Type|[object Object]|—|
|reckIw6NtouoAzp5y|609|Canonical_Registry_ID|609|—|
|reckIw6NtouoAzp5y|609|Description Detail|New UoM codes governed by explicit normalization/validation rules.|—|
|reckIw6NtouoAzp5y|609|Table Name|[object Object]|—|
|reckIw6NtouoAzp5y|609|Standardization|—|OK|
|reckIw6NtouoAzp5y|609|Anomalies|—|OK|
|reckIw6NtouoAzp5y|609|Field Registry|—|OK|
|reckIw6NtouoAzp5y|609|Manifest Source Config|—|OK|
|reckIw6NtouoAzp5y|609|Staging|—|OK|
|reckIw6NtouoAzp5y|609|Category ID Prefix|—|—|
|reckIw6NtouoAzp5y|609|CanonicalRegistry|527|OK|
|reckIw6NtouoAzp5y|609|From field: CanonicalRegistry|—|OK|
|reckIw6NtouoAzp5y|609|Canonical_Registry_ID (from CanonicalRegistry)||—|
|reczXzyQtB7gmSMj7|611|Field Name|Description|—|
|reczXzyQtB7gmSMj7|611|Normalization Fn|TRIM({Description})|—|
|reczXzyQtB7gmSMj7|611|Validation Rule|Optional.|—|
|reczXzyQtB7gmSMj7|611|Is Required|—|—|
|reczXzyQtB7gmSMj7|611|Example Input|—|—|
|reczXzyQtB7gmSMj7|611|Example Output|—|—|
|reczXzyQtB7gmSMj7|611|Last Modified|2026-03-05T14:28:19.000Z|—|
|reczXzyQtB7gmSMj7|611|Field Type|[object Object]|—|
|reczXzyQtB7gmSMj7|611|Canonical_Registry_ID|611|—|
|reczXzyQtB7gmSMj7|611|Description Detail|Definition and conversion notes for the unit of measure.|—|
|reczXzyQtB7gmSMj7|611|Table Name|[object Object]|—|
|reczXzyQtB7gmSMj7|611|Standardization|—|OK|
|reczXzyQtB7gmSMj7|611|Anomalies|—|OK|
|reczXzyQtB7gmSMj7|611|Field Registry|reckMkOYHbv48yHKV|OK|
|reczXzyQtB7gmSMj7|611|Manifest Source Config|—|OK|
|reczXzyQtB7gmSMj7|611|Staging|—|OK|
|reczXzyQtB7gmSMj7|611|Category ID Prefix|—|—|
|reczXzyQtB7gmSMj7|611|CanonicalRegistry|542|OK|
|reczXzyQtB7gmSMj7|611|From field: CanonicalRegistry|—|OK|
|reczXzyQtB7gmSMj7|611|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recECDdoNPRvHkCPn|614|Field Name|Reviewer|—|
|recECDdoNPRvHkCPn|614|Normalization Fn|N/A|—|
|recECDdoNPRvHkCPn|614|Validation Rule|Must be a valid Airtable User.|—|
|recECDdoNPRvHkCPn|614|Is Required|—|—|
|recECDdoNPRvHkCPn|614|Example Input|—|—|
|recECDdoNPRvHkCPn|614|Example Output|—|—|
|recECDdoNPRvHkCPn|614|Last Modified|2026-03-06T03:29:45.000Z|—|
|recECDdoNPRvHkCPn|614|Field Type|[object Object]|—|
|recECDdoNPRvHkCPn|614|Canonical_Registry_ID|614|—|
|recECDdoNPRvHkCPn|614|Description Detail|Team member who last reviewed the UoM record.|—|
|recECDdoNPRvHkCPn|614|Table Name|[object Object]|—|
|recECDdoNPRvHkCPn|614|Standardization|—|OK|
|recECDdoNPRvHkCPn|614|Anomalies|—|OK|
|recECDdoNPRvHkCPn|614|Field Registry|—|OK|
|recECDdoNPRvHkCPn|614|Manifest Source Config|—|OK|
|recECDdoNPRvHkCPn|614|Staging|—|OK|
|recECDdoNPRvHkCPn|614|Category ID Prefix|SYS_UoM_Reviewer|—|
|recECDdoNPRvHkCPn|614|CanonicalRegistry|563|OK|
|recECDdoNPRvHkCPn|614|From field: CanonicalRegistry|—|OK|
|recECDdoNPRvHkCPn|614|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec5HBSKIzPBxqGsG|615|Field Name|ProductMaster Link|—|
|rec5HBSKIzPBxqGsG|615|Normalization Fn|N/A (Manual/System Link)|—|
|rec5HBSKIzPBxqGsG|615|Validation Rule|Must link to an active record in Product Master.|—|
|rec5HBSKIzPBxqGsG|615|Is Required|—|—|
|rec5HBSKIzPBxqGsG|615|Example Input|—|—|
|rec5HBSKIzPBxqGsG|615|Example Output|—|—|
|rec5HBSKIzPBxqGsG|615|Last Modified|2026-03-05T14:28:19.000Z|—|
|rec5HBSKIzPBxqGsG|615|Field Type|[object Object]|—|
|rec5HBSKIzPBxqGsG|615|Canonical_Registry_ID|615|—|
|rec5HBSKIzPBxqGsG|615|Description Detail|Links the UoM back to all products utilizing it.|—|
|rec5HBSKIzPBxqGsG|615|Table Name|[object Object]|—|
|rec5HBSKIzPBxqGsG|615|Standardization|—|OK|
|rec5HBSKIzPBxqGsG|615|Anomalies|—|OK|
|rec5HBSKIzPBxqGsG|615|Field Registry|—|OK|
|rec5HBSKIzPBxqGsG|615|Manifest Source Config|—|OK|
|rec5HBSKIzPBxqGsG|615|Staging|—|OK|
|rec5HBSKIzPBxqGsG|615|Category ID Prefix|—|—|
|rec5HBSKIzPBxqGsG|615|CanonicalRegistry|615|OK|
|rec5HBSKIzPBxqGsG|615|From field: CanonicalRegistry|615|OK|
|rec5HBSKIzPBxqGsG|615|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recMLZoMPlafNfhBi|616|Field Name|PricingBridge|—|
|recMLZoMPlafNfhBi|616|Normalization Fn|N/A (Manual/System Link)|—|
|recMLZoMPlafNfhBi|616|Validation Rule|Must link to an active record in PricingBridge.|—|
|recMLZoMPlafNfhBi|616|Is Required|—|—|
|recMLZoMPlafNfhBi|616|Example Input|—|—|
|recMLZoMPlafNfhBi|616|Example Output|—|—|
|recMLZoMPlafNfhBi|616|Last Modified|2026-03-05T14:28:19.000Z|—|
|recMLZoMPlafNfhBi|616|Field Type|[object Object]|—|
|recMLZoMPlafNfhBi|616|Canonical_Registry_ID|616|—|
|recMLZoMPlafNfhBi|616|Description Detail|Links the UoM to a specific pricing strategy.|—|
|recMLZoMPlafNfhBi|616|Table Name|[object Object]|—|
|recMLZoMPlafNfhBi|616|Standardization|—|OK|
|recMLZoMPlafNfhBi|616|Anomalies|—|OK|
|recMLZoMPlafNfhBi|616|Field Registry|—|OK|
|recMLZoMPlafNfhBi|616|Manifest Source Config|—|OK|
|recMLZoMPlafNfhBi|616|Staging|—|OK|
|recMLZoMPlafNfhBi|616|Category ID Prefix|—|—|
|recMLZoMPlafNfhBi|616|CanonicalRegistry|616|OK|
|recMLZoMPlafNfhBi|616|From field: CanonicalRegistry|616, 786|OK|
|recMLZoMPlafNfhBi|616|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recTTU6D2ec1MCZqo|692|Field Name|Error Type|—|
|recTTU6D2ec1MCZqo|692|Normalization Fn|Scripts must write exact string.|—|
|recTTU6D2ec1MCZqo|692|Validation Rule|Categorises the nature of each anomaly. Script 0B and Script 1 write via field ID fldjYiDzJmdYJp6uF. Do NOT rename. Adding values requires script update.|—|
|recTTU6D2ec1MCZqo|692|Is Required|true|—|
|recTTU6D2ec1MCZqo|692|Example Input|Missing Link|—|
|recTTU6D2ec1MCZqo|692|Example Output|Missing Link|—|
|recTTU6D2ec1MCZqo|692|Last Modified|2026-03-06T10:59:07.000Z|—|
|recTTU6D2ec1MCZqo|692|Field Type|[object Object]|—|
|recTTU6D2ec1MCZqo|692|Canonical_Registry_ID|692|—|
|recTTU6D2ec1MCZqo|692|Description Detail|—|—|
|recTTU6D2ec1MCZqo|692|Table Name|[object Object]|—|
|recTTU6D2ec1MCZqo|692|Standardization|—|OK|
|recTTU6D2ec1MCZqo|692|Anomalies|—|OK|
|recTTU6D2ec1MCZqo|692|Field Registry|—|OK|
|recTTU6D2ec1MCZqo|692|Manifest Source Config|—|OK|
|recTTU6D2ec1MCZqo|692|Staging|—|OK|
|recTTU6D2ec1MCZqo|692|Category ID Prefix|—|—|
|recTTU6D2ec1MCZqo|692|CanonicalRegistry|692|OK|
|recTTU6D2ec1MCZqo|692|From field: CanonicalRegistry|692|OK|
|recTTU6D2ec1MCZqo|692|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recyerSrXgJOJH5JX|693|Field Name|Product Route|—|
|recyerSrXgJOJH5JX|693|Normalization Fn|TRIM({ProductRoute})|—|
|recyerSrXgJOJH5JX|693|Validation Rule|Must be one of: Old Code (Z), New Code (B), Batch (A), Anomaly (2DIG).|—|
|recyerSrXgJOJH5JX|693|Is Required|—|—|
|recyerSrXgJOJH5JX|693|Example Input|—|—|
|recyerSrXgJOJH5JX|693|Example Output|—|—|
|recyerSrXgJOJH5JX|693|Last Modified|2026-03-05T15:28:04.000Z|—|
|recyerSrXgJOJH5JX|693|Field Type|[object Object]|—|
|recyerSrXgJOJH5JX|693|Canonical_Registry_ID|693|—|
|recyerSrXgJOJH5JX|693|Description Detail|Routing flag for PLU logic determining suffix.|—|
|recyerSrXgJOJH5JX|693|Table Name|[object Object]|—|
|recyerSrXgJOJH5JX|693|Standardization|—|OK|
|recyerSrXgJOJH5JX|693|Anomalies|—|OK|
|recyerSrXgJOJH5JX|693|Field Registry|—|OK|
|recyerSrXgJOJH5JX|693|Manifest Source Config|—|OK|
|recyerSrXgJOJH5JX|693|Staging|—|OK|
|recyerSrXgJOJH5JX|693|Category ID Prefix|—|—|
|recyerSrXgJOJH5JX|693|CanonicalRegistry|693|OK|
|recyerSrXgJOJH5JX|693|From field: CanonicalRegistry|693, 794|OK|
|recyerSrXgJOJH5JX|693|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recP6w0aUUDiobKBw|767|Field Name|Product Sku|—|
|recP6w0aUUDiobKBw|767|Normalization Fn|{Product SKU Master} & IF(REGEX_MATCH({ProductRoute}, "\([A-Z]\)"), REGEX_EXTRACT({ProductRoute}, "\(([A-Z])\)"), ")|—|
|recP6w0aUUDiobKBw|767|Validation Rule|Inherits product_sku validation + optional single uppercase letter suffix.|—|
|recP6w0aUUDiobKBw|767|Is Required|—|—|
|recP6w0aUUDiobKBw|767|Example Input|—|—|
|recP6w0aUUDiobKBw|767|Example Output|—|—|
|recP6w0aUUDiobKBw|767|Last Modified|2026-03-05T15:28:04.000Z|—|
|recP6w0aUUDiobKBw|767|Field Type|[object Object]|—|
|recP6w0aUUDiobKBw|767|Canonical_Registry_ID|767|—|
|recP6w0aUUDiobKBw|767|Description Detail|Full operational SKU including route suffix.|—|
|recP6w0aUUDiobKBw|767|Table Name|[object Object]|—|
|recP6w0aUUDiobKBw|767|Standardization|—|OK|
|recP6w0aUUDiobKBw|767|Anomalies|—|OK|
|recP6w0aUUDiobKBw|767|Field Registry|—|OK|
|recP6w0aUUDiobKBw|767|Manifest Source Config|—|OK|
|recP6w0aUUDiobKBw|767|Staging|—|OK|
|recP6w0aUUDiobKBw|767|Category ID Prefix|—|—|
|recP6w0aUUDiobKBw|767|CanonicalRegistry|767|OK|
|recP6w0aUUDiobKBw|767|From field: CanonicalRegistry|767, 795|OK|
|recP6w0aUUDiobKBw|767|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec0FXDXmIkSFnHrf|768|Field Name|Product Description|—|
|rec0FXDXmIkSFnHrf|768|Normalization Fn|TRIM({product_description})|—|
|rec0FXDXmIkSFnHrf|768|Validation Rule|LEN(TRIM({product_description})) > 5.|—|
|rec0FXDXmIkSFnHrf|768|Is Required|—|—|
|rec0FXDXmIkSFnHrf|768|Example Input|—|—|
|rec0FXDXmIkSFnHrf|768|Example Output|—|—|
|rec0FXDXmIkSFnHrf|768|Last Modified|2026-03-05T15:28:04.000Z|—|
|rec0FXDXmIkSFnHrf|768|Field Type|[object Object]|—|
|rec0FXDXmIkSFnHrf|768|Canonical_Registry_ID|768|—|
|rec0FXDXmIkSFnHrf|768|Description Detail|Utile's own product description; customer-facing.|—|
|rec0FXDXmIkSFnHrf|768|Table Name|[object Object]|—|
|rec0FXDXmIkSFnHrf|768|Standardization|—|OK|
|rec0FXDXmIkSFnHrf|768|Anomalies|—|OK|
|rec0FXDXmIkSFnHrf|768|Field Registry|—|OK|
|rec0FXDXmIkSFnHrf|768|Manifest Source Config|—|OK|
|rec0FXDXmIkSFnHrf|768|Staging|—|OK|
|rec0FXDXmIkSFnHrf|768|Category ID Prefix|—|—|
|rec0FXDXmIkSFnHrf|768|CanonicalRegistry|432|OK|
|rec0FXDXmIkSFnHrf|768|From field: CanonicalRegistry|—|OK|
|rec0FXDXmIkSFnHrf|768|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recoId1f2HkzbQbbr|769|Field Name|Sys Tt Extractor|—|
|recoId1f2HkzbQbbr|769|Normalization Fn|VALUE(MID({Product SKU Master}, 4, 2))|—|
|recoId1f2HkzbQbbr|769|Validation Rule|Result must be integer between 1-28.|—|
|recoId1f2HkzbQbbr|769|Is Required|—|—|
|recoId1f2HkzbQbbr|769|Example Input|—|—|
|recoId1f2HkzbQbbr|769|Example Output|—|—|
|recoId1f2HkzbQbbr|769|Last Modified|2026-03-05T15:28:04.000Z|—|
|recoId1f2HkzbQbbr|769|Field Type|[object Object]|—|
|recoId1f2HkzbQbbr|769|Canonical_Registry_ID|769|—|
|recoId1f2HkzbQbbr|769|Description Detail|Extracts 2-digit Type Code from SKU for mapping.|—|
|recoId1f2HkzbQbbr|769|Table Name|[object Object]|—|
|recoId1f2HkzbQbbr|769|Standardization|—|OK|
|recoId1f2HkzbQbbr|769|Anomalies|—|OK|
|recoId1f2HkzbQbbr|769|Field Registry|—|OK|
|recoId1f2HkzbQbbr|769|Manifest Source Config|—|OK|
|recoId1f2HkzbQbbr|769|Staging|—|OK|
|recoId1f2HkzbQbbr|769|Category ID Prefix|—|—|
|recoId1f2HkzbQbbr|769|CanonicalRegistry|769|OK|
|recoId1f2HkzbQbbr|769|From field: CanonicalRegistry|769|OK|
|recoId1f2HkzbQbbr|769|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recAxGTCdMJFSUCpJ|771|Field Name|No Faces|—|
|recAxGTCdMJFSUCpJ|771|Normalization Fn|PARSE_NUMBER({no_faces})|—|
|recAxGTCdMJFSUCpJ|771|Validation Rule|Integer >= 1.|—|
|recAxGTCdMJFSUCpJ|771|Is Required|—|—|
|recAxGTCdMJFSUCpJ|771|Example Input|—|—|
|recAxGTCdMJFSUCpJ|771|Example Output|—|—|
|recAxGTCdMJFSUCpJ|771|Last Modified|2026-03-05T15:28:04.000Z|—|
|recAxGTCdMJFSUCpJ|771|Field Type|[object Object]|—|
|recAxGTCdMJFSUCpJ|771|Canonical_Registry_ID|771|—|
|recAxGTCdMJFSUCpJ|771|Description Detail|Number of Faces the tile offers (variance).|—|
|recAxGTCdMJFSUCpJ|771|Table Name|[object Object]|—|
|recAxGTCdMJFSUCpJ|771|Standardization|—|OK|
|recAxGTCdMJFSUCpJ|771|Anomalies|—|OK|
|recAxGTCdMJFSUCpJ|771|Field Registry|—|OK|
|recAxGTCdMJFSUCpJ|771|Manifest Source Config|—|OK|
|recAxGTCdMJFSUCpJ|771|Staging|—|OK|
|recAxGTCdMJFSUCpJ|771|Category ID Prefix|—|—|
|recAxGTCdMJFSUCpJ|771|CanonicalRegistry|299|OK|
|recAxGTCdMJFSUCpJ|771|From field: CanonicalRegistry|—|OK|
|recAxGTCdMJFSUCpJ|771|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recl7BzMFIWBo413x|772|Field Name|PEI Class|—|
|recl7BzMFIWBo413x|772|Normalization Fn|INTERNAL SELECTION|—|
|recl7BzMFIWBo413x|772|Validation Rule|Must be one of: 1, 2, 3, 4, 5, unknown, N/A.|—|
|recl7BzMFIWBo413x|772|Is Required|—|—|
|recl7BzMFIWBo413x|772|Example Input|—|—|
|recl7BzMFIWBo413x|772|Example Output|—|—|
|recl7BzMFIWBo413x|772|Last Modified|2026-03-05T15:28:04.000Z|—|
|recl7BzMFIWBo413x|772|Field Type|[object Object]|—|
|recl7BzMFIWBo413x|772|Canonical_Registry_ID|772|—|
|recl7BzMFIWBo413x|772|Description Detail|Tile traffic durability rating.|—|
|recl7BzMFIWBo413x|772|Table Name|[object Object]|—|
|recl7BzMFIWBo413x|772|Standardization|—|OK|
|recl7BzMFIWBo413x|772|Anomalies|—|OK|
|recl7BzMFIWBo413x|772|Field Registry|—|OK|
|recl7BzMFIWBo413x|772|Manifest Source Config|—|OK|
|recl7BzMFIWBo413x|772|Staging|—|OK|
|recl7BzMFIWBo413x|772|Category ID Prefix|—|—|
|recl7BzMFIWBo413x|772|CanonicalRegistry|300|OK|
|recl7BzMFIWBo413x|772|From field: CanonicalRegistry|—|OK|
|recl7BzMFIWBo413x|772|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec7VMR9jAtekHiZU|773|Field Name|Tech Slip Rating|—|
|rec7VMR9jAtekHiZU|773|Normalization Fn|INTERNAL SELECTION|—|
|rec7VMR9jAtekHiZU|773|Validation Rule|Must be one of: R9, R10, R11, R12, R10A+B, R11A+B+C, R9A+B+C.|—|
|rec7VMR9jAtekHiZU|773|Is Required|—|—|
|rec7VMR9jAtekHiZU|773|Example Input|—|—|
|rec7VMR9jAtekHiZU|773|Example Output|—|—|
|rec7VMR9jAtekHiZU|773|Last Modified|2026-03-05T15:28:04.000Z|—|
|rec7VMR9jAtekHiZU|773|Field Type|[object Object]|—|
|rec7VMR9jAtekHiZU|773|Canonical_Registry_ID|773|—|
|rec7VMR9jAtekHiZU|773|Description Detail|Technical slip resistance standard.|—|
|rec7VMR9jAtekHiZU|773|Table Name|[object Object]|—|
|rec7VMR9jAtekHiZU|773|Standardization|—|OK|
|rec7VMR9jAtekHiZU|773|Anomalies|—|OK|
|rec7VMR9jAtekHiZU|773|Field Registry|—|OK|
|rec7VMR9jAtekHiZU|773|Manifest Source Config|—|OK|
|rec7VMR9jAtekHiZU|773|Staging|—|OK|
|rec7VMR9jAtekHiZU|773|Category ID Prefix|—|—|
|rec7VMR9jAtekHiZU|773|CanonicalRegistry|304|OK|
|rec7VMR9jAtekHiZU|773|From field: CanonicalRegistry|—|OK|
|rec7VMR9jAtekHiZU|773|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recpifhVrVyrRgMez|774|Field Name|Is Rectified|—|
|recpifhVrVyrRgMez|774|Normalization Fn|TRIM({Is_Rectified})|—|
|recpifhVrVyrRgMez|774|Validation Rule|Must be one of: Is Rectified, not_rectified, unknown.|—|
|recpifhVrVyrRgMez|774|Is Required|—|—|
|recpifhVrVyrRgMez|774|Example Input|—|—|
|recpifhVrVyrRgMez|774|Example Output|—|—|
|recpifhVrVyrRgMez|774|Last Modified|2026-03-05T15:28:04.000Z|—|
|recpifhVrVyrRgMez|774|Field Type|[object Object]|—|
|recpifhVrVyrRgMez|774|Canonical_Registry_ID|774|—|
|recpifhVrVyrRgMez|774|Description Detail|Indicates if tile edges are mechanically cut.|—|
|recpifhVrVyrRgMez|774|Table Name|[object Object]|—|
|recpifhVrVyrRgMez|774|Standardization|—|OK|
|recpifhVrVyrRgMez|774|Anomalies|—|OK|
|recpifhVrVyrRgMez|774|Field Registry|—|OK|
|recpifhVrVyrRgMez|774|Manifest Source Config|—|OK|
|recpifhVrVyrRgMez|774|Staging|—|OK|
|recpifhVrVyrRgMez|774|Category ID Prefix|—|—|
|recpifhVrVyrRgMez|774|CanonicalRegistry|774|OK|
|recpifhVrVyrRgMez|774|From field: CanonicalRegistry|774|OK|
|recpifhVrVyrRgMez|774|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recZUFsa1d421uiL6|775|Field Name|Water Absorption|—|
|recZUFsa1d421uiL6|775|Normalization Fn|INTERNAL SELECTION|—|
|recZUFsa1d421uiL6|775|Validation Rule|Must be one of: < 0,5%, 0,5%>, Unknown.|—|
|recZUFsa1d421uiL6|775|Is Required|—|—|
|recZUFsa1d421uiL6|775|Example Input|—|—|
|recZUFsa1d421uiL6|775|Example Output|—|—|
|recZUFsa1d421uiL6|775|Last Modified|2026-03-05T15:28:04.000Z|—|
|recZUFsa1d421uiL6|775|Field Type|[object Object]|—|
|recZUFsa1d421uiL6|775|Canonical_Registry_ID|775|—|
|recZUFsa1d421uiL6|775|Description Detail|Percentage of water weight absorbed.|—|
|recZUFsa1d421uiL6|775|Table Name|[object Object]|—|
|recZUFsa1d421uiL6|775|Standardization|—|OK|
|recZUFsa1d421uiL6|775|Anomalies|—|OK|
|recZUFsa1d421uiL6|775|Field Registry|—|OK|
|recZUFsa1d421uiL6|775|Manifest Source Config|—|OK|
|recZUFsa1d421uiL6|775|Staging|—|OK|
|recZUFsa1d421uiL6|775|Category ID Prefix|—|—|
|recZUFsa1d421uiL6|775|CanonicalRegistry|338|OK|
|recZUFsa1d421uiL6|775|From field: CanonicalRegistry|—|OK|
|recZUFsa1d421uiL6|775|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recre0GQ8AifyBZwk|777|Field Name|Mohs Rating|—|
|recre0GQ8AifyBZwk|777|Normalization Fn|CLAMP(PARSE_INTEGER({Mohs_Rating}),6,10)|—|
|recre0GQ8AifyBZwk|777|Validation Rule|Integer 6-10.|—|
|recre0GQ8AifyBZwk|777|Is Required|—|—|
|recre0GQ8AifyBZwk|777|Example Input|—|—|
|recre0GQ8AifyBZwk|777|Example Output|—|—|
|recre0GQ8AifyBZwk|777|Last Modified|2026-03-05T15:28:04.000Z|—|
|recre0GQ8AifyBZwk|777|Field Type|[object Object]|—|
|recre0GQ8AifyBZwk|777|Canonical_Registry_ID|777|—|
|recre0GQ8AifyBZwk|777|Description Detail|Scratch resistance rating.|—|
|recre0GQ8AifyBZwk|777|Table Name|[object Object]|—|
|recre0GQ8AifyBZwk|777|Standardization|—|OK|
|recre0GQ8AifyBZwk|777|Anomalies|—|OK|
|recre0GQ8AifyBZwk|777|Field Registry|—|OK|
|recre0GQ8AifyBZwk|777|Manifest Source Config|—|OK|
|recre0GQ8AifyBZwk|777|Staging|—|OK|
|recre0GQ8AifyBZwk|777|Category ID Prefix|—|—|
|recre0GQ8AifyBZwk|777|CanonicalRegistry|404|OK|
|recre0GQ8AifyBZwk|777|From field: CanonicalRegistry|—|OK|
|recre0GQ8AifyBZwk|777|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec6Qpo7gaIUfs3bQ|778|Field Name|Mohs Status|—|
|rec6Qpo7gaIUfs3bQ|778|Normalization Fn|SWITCH(LOWER(TRIM({Mohs_Status_RAW})), "yes","Confirmed", "no","Not Applicable", "n/a","Not Applicable", "unknown","Unknown", PROPER(TRIM({Mohs_Status_RAW})))|—|
|rec6Qpo7gaIUfs3bQ|778|Validation Rule|Must be one of: Confirmed, Not Applicable, Unknown.|—|
|rec6Qpo7gaIUfs3bQ|778|Is Required|—|—|
|rec6Qpo7gaIUfs3bQ|778|Example Input|—|—|
|rec6Qpo7gaIUfs3bQ|778|Example Output|—|—|
|rec6Qpo7gaIUfs3bQ|778|Last Modified|2026-03-05T15:28:04.000Z|—|
|rec6Qpo7gaIUfs3bQ|778|Field Type|[object Object]|—|
|rec6Qpo7gaIUfs3bQ|778|Canonical_Registry_ID|778|—|
|rec6Qpo7gaIUfs3bQ|778|Description Detail|Scratch resistance status.|—|
|rec6Qpo7gaIUfs3bQ|778|Table Name|[object Object]|—|
|rec6Qpo7gaIUfs3bQ|778|Standardization|—|OK|
|rec6Qpo7gaIUfs3bQ|778|Anomalies|—|OK|
|rec6Qpo7gaIUfs3bQ|778|Field Registry|—|OK|
|rec6Qpo7gaIUfs3bQ|778|Manifest Source Config|—|OK|
|rec6Qpo7gaIUfs3bQ|778|Staging|—|OK|
|rec6Qpo7gaIUfs3bQ|778|Category ID Prefix|—|—|
|rec6Qpo7gaIUfs3bQ|778|CanonicalRegistry|405|OK|
|rec6Qpo7gaIUfs3bQ|778|From field: CanonicalRegistry|—|OK|
|rec6Qpo7gaIUfs3bQ|778|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recNtwe04Qw2y51zN|779|Field Name|V Rating|—|
|recNtwe04Qw2y51zN|779|Normalization Fn|INTERNAL SELECTION|—|
|recNtwe04Qw2y51zN|779|Validation Rule|Must be one of: V1, V2, V3, V4, V5, Unknown.|—|
|recNtwe04Qw2y51zN|779|Is Required|—|—|
|recNtwe04Qw2y51zN|779|Example Input|—|—|
|recNtwe04Qw2y51zN|779|Example Output|—|—|
|recNtwe04Qw2y51zN|779|Last Modified|2026-03-05T15:28:04.000Z|—|
|recNtwe04Qw2y51zN|779|Field Type|[object Object]|—|
|recNtwe04Qw2y51zN|779|Canonical_Registry_ID|779|—|
|recNtwe04Qw2y51zN|779|Description Detail|Visual variance rating of the tile print.|—|
|recNtwe04Qw2y51zN|779|Table Name|[object Object]|—|
|recNtwe04Qw2y51zN|779|Standardization|—|OK|
|recNtwe04Qw2y51zN|779|Anomalies|—|OK|
|recNtwe04Qw2y51zN|779|Field Registry|—|OK|
|recNtwe04Qw2y51zN|779|Manifest Source Config|—|OK|
|recNtwe04Qw2y51zN|779|Staging|—|OK|
|recNtwe04Qw2y51zN|779|Category ID Prefix|—|—|
|recNtwe04Qw2y51zN|779|CanonicalRegistry|323|OK|
|recNtwe04Qw2y51zN|779|From field: CanonicalRegistry|—|OK|
|recNtwe04Qw2y51zN|779|Canonical_Registry_ID (from CanonicalRegistry)||—|
|reca3UkouMYxzGvQt|780|Field Name|V Rating Status|—|
|reca3UkouMYxzGvQt|780|Normalization Fn|PROPER(TRIM({V_Rating_Status}))|—|
|reca3UkouMYxzGvQt|780|Validation Rule|Must be one of: Confirmed, N/A, Unknown.|—|
|reca3UkouMYxzGvQt|780|Is Required|—|—|
|reca3UkouMYxzGvQt|780|Example Input|—|—|
|reca3UkouMYxzGvQt|780|Example Output|—|—|
|reca3UkouMYxzGvQt|780|Last Modified|2026-03-05T15:28:04.000Z|—|
|reca3UkouMYxzGvQt|780|Field Type|[object Object]|—|
|reca3UkouMYxzGvQt|780|Canonical_Registry_ID|780|—|
|reca3UkouMYxzGvQt|780|Description Detail|Visual variance rating status.|—|
|reca3UkouMYxzGvQt|780|Table Name|[object Object]|—|
|reca3UkouMYxzGvQt|780|Standardization|—|OK|
|reca3UkouMYxzGvQt|780|Anomalies|—|OK|
|reca3UkouMYxzGvQt|780|Field Registry|—|OK|
|reca3UkouMYxzGvQt|780|Manifest Source Config|—|OK|
|reca3UkouMYxzGvQt|780|Staging|—|OK|
|reca3UkouMYxzGvQt|780|Category ID Prefix|—|—|
|reca3UkouMYxzGvQt|780|CanonicalRegistry|324|OK|
|reca3UkouMYxzGvQt|780|From field: CanonicalRegistry|—|OK|
|reca3UkouMYxzGvQt|780|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recwnqQNrmQRJQJyX|781|Field Name|Product_Status|—|
|recwnqQNrmQRJQJyX|781|Normalization Fn|TRIM({Product_Status})|—|
|recwnqQNrmQRJQJyX|781|Validation Rule|Must be one of: ACTIVE, END-OF-RANGE, DISCONTINUED, UNLISTED, NEW PRODUCTS, SKU_Transition.|—|
|recwnqQNrmQRJQJyX|781|Is Required|—|—|
|recwnqQNrmQRJQJyX|781|Example Input|—|—|
|recwnqQNrmQRJQJyX|781|Example Output|—|—|
|recwnqQNrmQRJQJyX|781|Last Modified|2026-03-05T15:28:04.000Z|—|
|recwnqQNrmQRJQJyX|781|Field Type|[object Object]|—|
|recwnqQNrmQRJQJyX|781|Canonical_Registry_ID|781|—|
|recwnqQNrmQRJQJyX|781|Description Detail|Lifecycle status of the product.|—|
|recwnqQNrmQRJQJyX|781|Table Name|[object Object]|—|
|recwnqQNrmQRJQJyX|781|Standardization|—|OK|
|recwnqQNrmQRJQJyX|781|Anomalies|—|OK|
|recwnqQNrmQRJQJyX|781|Field Registry|—|OK|
|recwnqQNrmQRJQJyX|781|Manifest Source Config|—|OK|
|recwnqQNrmQRJQJyX|781|Staging|—|OK|
|recwnqQNrmQRJQJyX|781|Category ID Prefix|—|—|
|recwnqQNrmQRJQJyX|781|CanonicalRegistry|781|OK|
|recwnqQNrmQRJQJyX|781|From field: CanonicalRegistry|781|OK|
|recwnqQNrmQRJQJyX|781|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recn1TCsGq7Uky7Ay|782|Field Name|is_Pool Suitable|—|
|recn1TCsGq7Uky7Ay|782|Normalization Fn|PROPER(TRIM({use_pool_suitable}))|—|
|recn1TCsGq7Uky7Ay|782|Validation Rule|Must be one of: Not Suitable, Suitable inside and scumline, Suitable - Inside and Around, Unknown.|—|
|recn1TCsGq7Uky7Ay|782|Is Required|—|—|
|recn1TCsGq7Uky7Ay|782|Example Input|—|—|
|recn1TCsGq7Uky7Ay|782|Example Output|—|—|
|recn1TCsGq7Uky7Ay|782|Last Modified|2026-03-05T15:28:04.000Z|—|
|recn1TCsGq7Uky7Ay|782|Field Type|[object Object]|—|
|recn1TCsGq7Uky7Ay|782|Canonical_Registry_ID|782|—|
|recn1TCsGq7Uky7Ay|782|Description Detail|Pool suitability rating.|—|
|recn1TCsGq7Uky7Ay|782|Table Name|[object Object]|—|
|recn1TCsGq7Uky7Ay|782|Standardization|—|OK|
|recn1TCsGq7Uky7Ay|782|Anomalies|—|OK|
|recn1TCsGq7Uky7Ay|782|Field Registry|—|OK|
|recn1TCsGq7Uky7Ay|782|Manifest Source Config|—|OK|
|recn1TCsGq7Uky7Ay|782|Staging|—|OK|
|recn1TCsGq7Uky7Ay|782|Category ID Prefix|—|—|
|recn1TCsGq7Uky7Ay|782|CanonicalRegistry|782|OK|
|recn1TCsGq7Uky7Ay|782|From field: CanonicalRegistry|782|OK|
|recn1TCsGq7Uky7Ay|782|Canonical_Registry_ID (from CanonicalRegistry)||—|
|reciWBdx9nxqpB4G5|783|Field Name|Comments|—|
|reciWBdx9nxqpB4G5|783|Normalization Fn|TRIM({comments})|—|
|reciWBdx9nxqpB4G5|783|Validation Rule|Optional.|—|
|reciWBdx9nxqpB4G5|783|Is Required|—|—|
|reciWBdx9nxqpB4G5|783|Example Input|—|—|
|reciWBdx9nxqpB4G5|783|Example Output|—|—|
|reciWBdx9nxqpB4G5|783|Last Modified|2026-03-05T15:28:04.000Z|—|
|reciWBdx9nxqpB4G5|783|Field Type|[object Object]|—|
|reciWBdx9nxqpB4G5|783|Canonical_Registry_ID|783|—|
|reciWBdx9nxqpB4G5|783|Description Detail|Internal operational notes on the product.|—|
|reciWBdx9nxqpB4G5|783|Table Name|[object Object]|—|
|reciWBdx9nxqpB4G5|783|Standardization|—|OK|
|reciWBdx9nxqpB4G5|783|Anomalies|—|OK|
|reciWBdx9nxqpB4G5|783|Field Registry|—|OK|
|reciWBdx9nxqpB4G5|783|Manifest Source Config|—|OK|
|reciWBdx9nxqpB4G5|783|Staging|—|OK|
|reciWBdx9nxqpB4G5|783|Category ID Prefix|—|—|
|reciWBdx9nxqpB4G5|783|CanonicalRegistry|783|OK|
|reciWBdx9nxqpB4G5|783|From field: CanonicalRegistry|783|OK|
|reciWBdx9nxqpB4G5|783|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recypRVQpIQ7YTUSW|784|Field Name|Supplier|—|
|recypRVQpIQ7YTUSW|784|Normalization Fn|N/A (Manual/System Link)|—|
|recypRVQpIQ7YTUSW|784|Validation Rule|Must link to an active record in Supplier table.|—|
|recypRVQpIQ7YTUSW|784|Is Required|—|—|
|recypRVQpIQ7YTUSW|784|Example Input|—|—|
|recypRVQpIQ7YTUSW|784|Example Output|—|—|
|recypRVQpIQ7YTUSW|784|Last Modified|2026-03-05T15:28:04.000Z|—|
|recypRVQpIQ7YTUSW|784|Field Type|[object Object]|—|
|recypRVQpIQ7YTUSW|784|Canonical_Registry_ID|784|—|
|recypRVQpIQ7YTUSW|784|Description Detail|Source of truth for supplier identity.|—|
|recypRVQpIQ7YTUSW|784|Table Name|[object Object]|—|
|recypRVQpIQ7YTUSW|784|Standardization|—|OK|
|recypRVQpIQ7YTUSW|784|Anomalies|—|OK|
|recypRVQpIQ7YTUSW|784|Field Registry|—|OK|
|recypRVQpIQ7YTUSW|784|Manifest Source Config|—|OK|
|recypRVQpIQ7YTUSW|784|Staging|—|OK|
|recypRVQpIQ7YTUSW|784|Category ID Prefix|—|—|
|recypRVQpIQ7YTUSW|784|CanonicalRegistry|784|OK|
|recypRVQpIQ7YTUSW|784|From field: CanonicalRegistry|784|OK|
|recypRVQpIQ7YTUSW|784|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recB4ED4uq1qpRtDT|785|Field Name|Supplier Product Data|—|
|recB4ED4uq1qpRtDT|785|Normalization Fn|N/A (Manual/System Link)|—|
|recB4ED4uq1qpRtDT|785|Validation Rule|Must link to an active record in SupplierProductData.|—|
|recB4ED4uq1qpRtDT|785|Is Required|—|—|
|recB4ED4uq1qpRtDT|785|Example Input|—|—|
|recB4ED4uq1qpRtDT|785|Example Output|—|—|
|recB4ED4uq1qpRtDT|785|Last Modified|2026-03-05T15:28:04.000Z|—|
|recB4ED4uq1qpRtDT|785|Field Type|[object Object]|—|
|recB4ED4uq1qpRtDT|785|Canonical_Registry_ID|785|—|
|recB4ED4uq1qpRtDT|785|Description Detail|Links to the immutable supplier ledger.|—|
|recB4ED4uq1qpRtDT|785|Table Name|[object Object]|—|
|recB4ED4uq1qpRtDT|785|Standardization|—|OK|
|recB4ED4uq1qpRtDT|785|Anomalies|—|OK|
|recB4ED4uq1qpRtDT|785|Field Registry|—|OK|
|recB4ED4uq1qpRtDT|785|Manifest Source Config|—|OK|
|recB4ED4uq1qpRtDT|785|Staging|—|OK|
|recB4ED4uq1qpRtDT|785|Category ID Prefix|—|—|
|recB4ED4uq1qpRtDT|785|CanonicalRegistry|435|OK|
|recB4ED4uq1qpRtDT|785|From field: CanonicalRegistry|—|OK|
|recB4ED4uq1qpRtDT|785|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recZB1UkGDlxITiFE|786|Field Name|PricingBridge|—|
|recZB1UkGDlxITiFE|786|Normalization Fn|N/A (Manual/System Link)|—|
|recZB1UkGDlxITiFE|786|Validation Rule|Must link to an active record in PricingBridge.|—|
|recZB1UkGDlxITiFE|786|Is Required|—|—|
|recZB1UkGDlxITiFE|786|Example Input|—|—|
|recZB1UkGDlxITiFE|786|Example Output|—|—|
|recZB1UkGDlxITiFE|786|Last Modified|2026-03-05T15:28:04.000Z|—|
|recZB1UkGDlxITiFE|786|Field Type|[object Object]|—|
|recZB1UkGDlxITiFE|786|Canonical_Registry_ID|786|—|
|recZB1UkGDlxITiFE|786|Description Detail|Links product to its financial markups.|—|
|recZB1UkGDlxITiFE|786|Table Name|[object Object]|—|
|recZB1UkGDlxITiFE|786|Standardization|—|OK|
|recZB1UkGDlxITiFE|786|Anomalies|—|OK|
|recZB1UkGDlxITiFE|786|Field Registry|—|OK|
|recZB1UkGDlxITiFE|786|Manifest Source Config|—|OK|
|recZB1UkGDlxITiFE|786|Staging|—|OK|
|recZB1UkGDlxITiFE|786|Category ID Prefix|—|—|
|recZB1UkGDlxITiFE|786|CanonicalRegistry|616|OK|
|recZB1UkGDlxITiFE|786|From field: CanonicalRegistry|—|OK|
|recZB1UkGDlxITiFE|786|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec21Bh7IchnSWItV|788|Field Name|Required Grout|—|
|rec21Bh7IchnSWItV|788|Normalization Fn|N/A (Manual/System Link)|—|
|rec21Bh7IchnSWItV|788|Validation Rule|Must link to active material record in UPCMaterials.|—|
|rec21Bh7IchnSWItV|788|Is Required|—|—|
|rec21Bh7IchnSWItV|788|Example Input|—|—|
|rec21Bh7IchnSWItV|788|Example Output|—|—|
|rec21Bh7IchnSWItV|788|Last Modified|2026-03-05T15:28:04.000Z|—|
|rec21Bh7IchnSWItV|788|Field Type|[object Object]|—|
|rec21Bh7IchnSWItV|788|Canonical_Registry_ID|788|—|
|rec21Bh7IchnSWItV|788|Description Detail|Links tile to required companion grout.|—|
|rec21Bh7IchnSWItV|788|Table Name|[object Object]|—|
|rec21Bh7IchnSWItV|788|Standardization|—|OK|
|rec21Bh7IchnSWItV|788|Anomalies|—|OK|
|rec21Bh7IchnSWItV|788|Field Registry|—|OK|
|rec21Bh7IchnSWItV|788|Manifest Source Config|—|OK|
|rec21Bh7IchnSWItV|788|Staging|—|OK|
|rec21Bh7IchnSWItV|788|Category ID Prefix|—|—|
|rec21Bh7IchnSWItV|788|CanonicalRegistry|591|OK|
|rec21Bh7IchnSWItV|788|From field: CanonicalRegistry|—|OK|
|rec21Bh7IchnSWItV|788|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recgmmWYv6Ox0P7wn|789|Field Name|Required Sealant|—|
|recgmmWYv6Ox0P7wn|789|Normalization Fn|N/A (Manual/System Link)|—|
|recgmmWYv6Ox0P7wn|789|Validation Rule|Must link to active material record in UPCMaterials.|—|
|recgmmWYv6Ox0P7wn|789|Is Required|—|—|
|recgmmWYv6Ox0P7wn|789|Example Input|—|—|
|recgmmWYv6Ox0P7wn|789|Example Output|—|—|
|recgmmWYv6Ox0P7wn|789|Last Modified|2026-03-05T15:28:04.000Z|—|
|recgmmWYv6Ox0P7wn|789|Field Type|[object Object]|—|
|recgmmWYv6Ox0P7wn|789|Canonical_Registry_ID|789|—|
|recgmmWYv6Ox0P7wn|789|Description Detail|Links tile to required companion sealant.|—|
|recgmmWYv6Ox0P7wn|789|Table Name|[object Object]|—|
|recgmmWYv6Ox0P7wn|789|Standardization|—|OK|
|recgmmWYv6Ox0P7wn|789|Anomalies|—|OK|
|recgmmWYv6Ox0P7wn|789|Field Registry|—|OK|
|recgmmWYv6Ox0P7wn|789|Manifest Source Config|—|OK|
|recgmmWYv6Ox0P7wn|789|Staging|—|OK|
|recgmmWYv6Ox0P7wn|789|Category ID Prefix|—|—|
|recgmmWYv6Ox0P7wn|789|CanonicalRegistry|592|OK|
|recgmmWYv6Ox0P7wn|789|From field: CanonicalRegistry|—|OK|
|recgmmWYv6Ox0P7wn|789|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recTybhe2JClmK5tx|790|Field Name|Area of Use (UPC)|—|
|recTybhe2JClmK5tx|790|Normalization Fn|N/A (Manual/System Link)|—|
|recTybhe2JClmK5tx|790|Validation Rule|Must link to active UPCAreaOfUse profile.|—|
|recTybhe2JClmK5tx|790|Is Required|—|—|
|recTybhe2JClmK5tx|790|Example Input|—|—|
|recTybhe2JClmK5tx|790|Example Output|—|—|
|recTybhe2JClmK5tx|790|Last Modified|2026-03-05T15:28:04.000Z|—|
|recTybhe2JClmK5tx|790|Field Type|[object Object]|—|
|recTybhe2JClmK5tx|790|Canonical_Registry_ID|790|—|
|recTybhe2JClmK5tx|790|Description Detail|Connects tile to its standardized application profile.|—|
|recTybhe2JClmK5tx|790|Table Name|[object Object]|—|
|recTybhe2JClmK5tx|790|Standardization|—|OK|
|recTybhe2JClmK5tx|790|Anomalies|—|OK|
|recTybhe2JClmK5tx|790|Field Registry|—|OK|
|recTybhe2JClmK5tx|790|Manifest Source Config|—|OK|
|recTybhe2JClmK5tx|790|Staging|—|OK|
|recTybhe2JClmK5tx|790|Category ID Prefix|—|—|
|recTybhe2JClmK5tx|790|CanonicalRegistry|790|OK|
|recTybhe2JClmK5tx|790|From field: CanonicalRegistry|790, 808|OK|
|recTybhe2JClmK5tx|790|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recd46fAuAJyMmvtQ|791|Field Name|UPCColourMaster|—|
|recd46fAuAJyMmvtQ|791|Normalization Fn|N/A (Manual/System Link)|—|
|recd46fAuAJyMmvtQ|791|Validation Rule|Must link to active UPCColourMaster profile.|—|
|recd46fAuAJyMmvtQ|791|Is Required|—|—|
|recd46fAuAJyMmvtQ|791|Example Input|—|—|
|recd46fAuAJyMmvtQ|791|Example Output|—|—|
|recd46fAuAJyMmvtQ|791|Last Modified|2026-03-05T15:28:04.000Z|—|
|recd46fAuAJyMmvtQ|791|Field Type|[object Object]|—|
|recd46fAuAJyMmvtQ|791|Canonical_Registry_ID|791|—|
|recd46fAuAJyMmvtQ|791|Description Detail|Links tile directly to its standardized color profile.|—|
|recd46fAuAJyMmvtQ|791|Table Name|[object Object]|—|
|recd46fAuAJyMmvtQ|791|Standardization|—|OK|
|recd46fAuAJyMmvtQ|791|Anomalies|—|OK|
|recd46fAuAJyMmvtQ|791|Field Registry|—|OK|
|recd46fAuAJyMmvtQ|791|Manifest Source Config|—|OK|
|recd46fAuAJyMmvtQ|791|Staging|—|OK|
|recd46fAuAJyMmvtQ|791|Category ID Prefix|—|—|
|recd46fAuAJyMmvtQ|791|CanonicalRegistry|553|OK|
|recd46fAuAJyMmvtQ|791|From field: CanonicalRegistry|—|OK|
|recd46fAuAJyMmvtQ|791|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec81XEiKtP7p0zNC|792|Field Name|UPCShapeType|—|
|rec81XEiKtP7p0zNC|792|Normalization Fn|N/A (Manual/System Link)|—|
|rec81XEiKtP7p0zNC|792|Validation Rule|Must link to active UPCShapeType profile.|—|
|rec81XEiKtP7p0zNC|792|Is Required|—|—|
|rec81XEiKtP7p0zNC|792|Example Input|—|—|
|rec81XEiKtP7p0zNC|792|Example Output|—|—|
|rec81XEiKtP7p0zNC|792|Last Modified|2026-03-05T15:28:04.000Z|—|
|rec81XEiKtP7p0zNC|792|Field Type|[object Object]|—|
|rec81XEiKtP7p0zNC|792|Canonical_Registry_ID|792|—|
|rec81XEiKtP7p0zNC|792|Description Detail|Links tile to its geometric shape descriptor.|—|
|rec81XEiKtP7p0zNC|792|Table Name|[object Object]|—|
|rec81XEiKtP7p0zNC|792|Standardization|—|OK|
|rec81XEiKtP7p0zNC|792|Anomalies|—|OK|
|rec81XEiKtP7p0zNC|792|Field Registry|—|OK|
|rec81XEiKtP7p0zNC|792|Manifest Source Config|—|OK|
|rec81XEiKtP7p0zNC|792|Staging|—|OK|
|rec81XEiKtP7p0zNC|792|Category ID Prefix|—|—|
|rec81XEiKtP7p0zNC|792|CanonicalRegistry|578|OK|
|rec81XEiKtP7p0zNC|792|From field: CanonicalRegistry|—|OK|
|rec81XEiKtP7p0zNC|792|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec1RquGChcXavsoj|793|Field Name|Product SKU Master|—|
|rec1RquGChcXavsoj|793|Normalization Fn|UPPER(TRIM({Product_SKU}))|—|
|rec1RquGChcXavsoj|793|Validation Rule|LEN >= 10 AND <= 11; LEFT(3) = "163"...|—|
|rec1RquGChcXavsoj|793|Is Required|—|—|
|rec1RquGChcXavsoj|793|Example Input|—|—|
|rec1RquGChcXavsoj|793|Example Output|—|—|
|rec1RquGChcXavsoj|793|Last Modified|2026-03-05T15:28:04.000Z|—|
|rec1RquGChcXavsoj|793|Field Type|[object Object]|—|
|rec1RquGChcXavsoj|793|Canonical_Registry_ID|793|—|
|rec1RquGChcXavsoj|793|Description Detail|Canonical string representing the product.|—|
|rec1RquGChcXavsoj|793|Table Name|[object Object]|—|
|rec1RquGChcXavsoj|793|Standardization|—|OK|
|rec1RquGChcXavsoj|793|Anomalies|—|OK|
|rec1RquGChcXavsoj|793|Field Registry|—|OK|
|rec1RquGChcXavsoj|793|Manifest Source Config|—|OK|
|rec1RquGChcXavsoj|793|Staging|—|OK|
|rec1RquGChcXavsoj|793|Category ID Prefix|—|—|
|rec1RquGChcXavsoj|793|CanonicalRegistry|793|OK|
|rec1RquGChcXavsoj|793|From field: CanonicalRegistry|793|OK|
|rec1RquGChcXavsoj|793|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recSHveZjx93SNazv|794|Field Name|Product Route|—|
|recSHveZjx93SNazv|794|Normalization Fn|TRIM({ProductRoute})|—|
|recSHveZjx93SNazv|794|Validation Rule|Must be one of: Old Code (Z), New Code (B)...|—|
|recSHveZjx93SNazv|794|Is Required|—|—|
|recSHveZjx93SNazv|794|Example Input|—|—|
|recSHveZjx93SNazv|794|Example Output|—|—|
|recSHveZjx93SNazv|794|Last Modified|2026-03-05T15:28:04.000Z|—|
|recSHveZjx93SNazv|794|Field Type|[object Object]|—|
|recSHveZjx93SNazv|794|Canonical_Registry_ID|794|—|
|recSHveZjx93SNazv|794|Description Detail|Routing flag for PLU logic determining suffix.|—|
|recSHveZjx93SNazv|794|Table Name|[object Object]|—|
|recSHveZjx93SNazv|794|Standardization|—|OK|
|recSHveZjx93SNazv|794|Anomalies|—|OK|
|recSHveZjx93SNazv|794|Field Registry|—|OK|
|recSHveZjx93SNazv|794|Manifest Source Config|—|OK|
|recSHveZjx93SNazv|794|Staging|—|OK|
|recSHveZjx93SNazv|794|Category ID Prefix|—|—|
|recSHveZjx93SNazv|794|CanonicalRegistry|693|OK|
|recSHveZjx93SNazv|794|From field: CanonicalRegistry|—|OK|
|recSHveZjx93SNazv|794|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recbKmu4WCB6dCiDr|795|Field Name|Product Sku|—|
|recbKmu4WCB6dCiDr|795|Normalization Fn|{Product SKU Master} & IF(REGEX_MATCH...|—|
|recbKmu4WCB6dCiDr|795|Validation Rule|Inherits product_sku validation...|—|
|recbKmu4WCB6dCiDr|795|Is Required|—|—|
|recbKmu4WCB6dCiDr|795|Example Input|—|—|
|recbKmu4WCB6dCiDr|795|Example Output|—|—|
|recbKmu4WCB6dCiDr|795|Last Modified|2026-03-05T15:28:04.000Z|—|
|recbKmu4WCB6dCiDr|795|Field Type|[object Object]|—|
|recbKmu4WCB6dCiDr|795|Canonical_Registry_ID|795|—|
|recbKmu4WCB6dCiDr|795|Description Detail|Full operational SKU including route suffix.|—|
|recbKmu4WCB6dCiDr|795|Table Name|[object Object]|—|
|recbKmu4WCB6dCiDr|795|Standardization|—|OK|
|recbKmu4WCB6dCiDr|795|Anomalies|—|OK|
|recbKmu4WCB6dCiDr|795|Field Registry|—|OK|
|recbKmu4WCB6dCiDr|795|Manifest Source Config|—|OK|
|recbKmu4WCB6dCiDr|795|Staging|—|OK|
|recbKmu4WCB6dCiDr|795|Category ID Prefix|—|—|
|recbKmu4WCB6dCiDr|795|CanonicalRegistry|767|OK|
|recbKmu4WCB6dCiDr|795|From field: CanonicalRegistry|—|OK|
|recbKmu4WCB6dCiDr|795|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recsUX8oyW20UOWga|796|Field Name|Product Description|—|
|recsUX8oyW20UOWga|796|Normalization Fn|TRIM({product_description})|—|
|recsUX8oyW20UOWga|796|Validation Rule|LEN(TRIM({product_description})) > 5.|—|
|recsUX8oyW20UOWga|796|Is Required|—|—|
|recsUX8oyW20UOWga|796|Example Input|—|—|
|recsUX8oyW20UOWga|796|Example Output|—|—|
|recsUX8oyW20UOWga|796|Last Modified|2026-03-05T15:28:04.000Z|—|
|recsUX8oyW20UOWga|796|Field Type|[object Object]|—|
|recsUX8oyW20UOWga|796|Canonical_Registry_ID|796|—|
|recsUX8oyW20UOWga|796|Description Detail|Utile's own product description.|—|
|recsUX8oyW20UOWga|796|Table Name|[object Object]|—|
|recsUX8oyW20UOWga|796|Standardization|—|OK|
|recsUX8oyW20UOWga|796|Anomalies|—|OK|
|recsUX8oyW20UOWga|796|Field Registry|—|OK|
|recsUX8oyW20UOWga|796|Manifest Source Config|—|OK|
|recsUX8oyW20UOWga|796|Staging|—|OK|
|recsUX8oyW20UOWga|796|Category ID Prefix|—|—|
|recsUX8oyW20UOWga|796|CanonicalRegistry|432|OK|
|recsUX8oyW20UOWga|796|From field: CanonicalRegistry|—|OK|
|recsUX8oyW20UOWga|796|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recYjb07rUFMwtFgW|797|Field Name|Product Master|—|
|recYjb07rUFMwtFgW|797|Normalization Fn|N/A (System Link)|—|
|recYjb07rUFMwtFgW|797|Validation Rule|Must link to valid ProductMaster ID.|—|
|recYjb07rUFMwtFgW|797|Is Required|—|—|
|recYjb07rUFMwtFgW|797|Example Input|—|—|
|recYjb07rUFMwtFgW|797|Example Output|—|—|
|recYjb07rUFMwtFgW|797|Last Modified|2026-03-05T15:28:04.000Z|—|
|recYjb07rUFMwtFgW|797|Field Type|[object Object]|—|
|recYjb07rUFMwtFgW|797|Canonical_Registry_ID|797|—|
|recYjb07rUFMwtFgW|797|Description Detail|Reciprocal link mapping the vendor back to the catalog.|—|
|recYjb07rUFMwtFgW|797|Table Name|[object Object]|—|
|recYjb07rUFMwtFgW|797|Standardization|—|OK|
|recYjb07rUFMwtFgW|797|Anomalies|—|OK|
|recYjb07rUFMwtFgW|797|Field Registry|—|OK|
|recYjb07rUFMwtFgW|797|Manifest Source Config|—|OK|
|recYjb07rUFMwtFgW|797|Staging|—|OK|
|recYjb07rUFMwtFgW|797|Category ID Prefix|—|—|
|recYjb07rUFMwtFgW|797|CanonicalRegistry|594|OK|
|recYjb07rUFMwtFgW|797|From field: CanonicalRegistry|—|OK|
|recYjb07rUFMwtFgW|797|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recRPYAG3nF5reKNy|798|Field Name|Supplier Product Data|—|
|recRPYAG3nF5reKNy|798|Normalization Fn|N/A (Manual Link)|—|
|recRPYAG3nF5reKNy|798|Validation Rule|Must link to an active record in SupplierProductData.|—|
|recRPYAG3nF5reKNy|798|Is Required|—|—|
|recRPYAG3nF5reKNy|798|Example Input|—|—|
|recRPYAG3nF5reKNy|798|Example Output|—|—|
|recRPYAG3nF5reKNy|798|Last Modified|2026-03-05T15:28:04.000Z|—|
|recRPYAG3nF5reKNy|798|Field Type|[object Object]|—|
|recRPYAG3nF5reKNy|798|Canonical_Registry_ID|798|—|
|recRPYAG3nF5reKNy|798|Description Detail|Links to the immutable supplier ledger.|—|
|recRPYAG3nF5reKNy|798|Table Name|[object Object]|—|
|recRPYAG3nF5reKNy|798|Standardization|—|OK|
|recRPYAG3nF5reKNy|798|Anomalies|—|OK|
|recRPYAG3nF5reKNy|798|Field Registry|—|OK|
|recRPYAG3nF5reKNy|798|Manifest Source Config|—|OK|
|recRPYAG3nF5reKNy|798|Staging|—|OK|
|recRPYAG3nF5reKNy|798|Category ID Prefix|—|—|
|recRPYAG3nF5reKNy|798|CanonicalRegistry|435|OK|
|recRPYAG3nF5reKNy|798|From field: CanonicalRegistry|—|OK|
|recRPYAG3nF5reKNy|798|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec6eqIFpUJTBk7lX|799|Field Name|ProductMaster|—|
|rec6eqIFpUJTBk7lX|799|Normalization Fn|N/A (System Link)|—|
|rec6eqIFpUJTBk7lX|799|Validation Rule|Must link to valid ProductMaster ID.|—|
|rec6eqIFpUJTBk7lX|799|Is Required|—|—|
|rec6eqIFpUJTBk7lX|799|Example Input|—|—|
|rec6eqIFpUJTBk7lX|799|Example Output|—|—|
|rec6eqIFpUJTBk7lX|799|Last Modified|2026-03-05T15:28:04.000Z|—|
|rec6eqIFpUJTBk7lX|799|Field Type|[object Object]|—|
|rec6eqIFpUJTBk7lX|799|Canonical_Registry_ID|799|—|
|rec6eqIFpUJTBk7lX|799|Description Detail|Reciprocal link mapping the raw data to the clean catalog.|—|
|rec6eqIFpUJTBk7lX|799|Table Name|[object Object]|—|
|rec6eqIFpUJTBk7lX|799|Standardization|—|OK|
|rec6eqIFpUJTBk7lX|799|Anomalies|—|OK|
|rec6eqIFpUJTBk7lX|799|Field Registry|—|OK|
|rec6eqIFpUJTBk7lX|799|Manifest Source Config|—|OK|
|rec6eqIFpUJTBk7lX|799|Staging|—|OK|
|rec6eqIFpUJTBk7lX|799|Category ID Prefix|—|—|
|rec6eqIFpUJTBk7lX|799|CanonicalRegistry|799|OK|
|rec6eqIFpUJTBk7lX|799|From field: CanonicalRegistry|799|OK|
|rec6eqIFpUJTBk7lX|799|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recHQVYwoioaLh2Lu|800|Field Name|PricingBridge (Product SKU)|—|
|recHQVYwoioaLh2Lu|800|Normalization Fn|N/A (Manual Link)|—|
|recHQVYwoioaLh2Lu|800|Validation Rule|Must link to an active record in PricingBridge.|—|
|recHQVYwoioaLh2Lu|800|Is Required|—|—|
|recHQVYwoioaLh2Lu|800|Example Input|—|—|
|recHQVYwoioaLh2Lu|800|Example Output|—|—|
|recHQVYwoioaLh2Lu|800|Last Modified|2026-03-05T15:28:04.000Z|—|
|recHQVYwoioaLh2Lu|800|Field Type|[object Object]|—|
|recHQVYwoioaLh2Lu|800|Canonical_Registry_ID|800|—|
|recHQVYwoioaLh2Lu|800|Description Detail|Links product to its financial markups.|—|
|recHQVYwoioaLh2Lu|800|Table Name|[object Object]|—|
|recHQVYwoioaLh2Lu|800|Standardization|—|OK|
|recHQVYwoioaLh2Lu|800|Anomalies|—|OK|
|recHQVYwoioaLh2Lu|800|Field Registry|—|OK|
|recHQVYwoioaLh2Lu|800|Manifest Source Config|—|OK|
|recHQVYwoioaLh2Lu|800|Staging|—|OK|
|recHQVYwoioaLh2Lu|800|Category ID Prefix|—|—|
|recHQVYwoioaLh2Lu|800|CanonicalRegistry|800|OK|
|recHQVYwoioaLh2Lu|800|From field: CanonicalRegistry|800|OK|
|recHQVYwoioaLh2Lu|800|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec9uzDAM53Xn8LVF|801|Field Name|Product SKU|—|
|rec9uzDAM53Xn8LVF|801|Normalization Fn|N/A (System Link)|—|
|rec9uzDAM53Xn8LVF|801|Validation Rule|Must link to valid ProductMaster ID.|—|
|rec9uzDAM53Xn8LVF|801|Is Required|—|—|
|rec9uzDAM53Xn8LVF|801|Example Input|—|—|
|rec9uzDAM53Xn8LVF|801|Example Output|—|—|
|rec9uzDAM53Xn8LVF|801|Last Modified|2026-03-05T15:28:04.000Z|—|
|rec9uzDAM53Xn8LVF|801|Field Type|[object Object]|—|
|rec9uzDAM53Xn8LVF|801|Canonical_Registry_ID|801|—|
|rec9uzDAM53Xn8LVF|801|Description Detail|Reciprocal link mapping the strategy to the physical tile.|—|
|rec9uzDAM53Xn8LVF|801|Table Name|[object Object]|—|
|rec9uzDAM53Xn8LVF|801|Standardization|—|OK|
|rec9uzDAM53Xn8LVF|801|Anomalies|—|OK|
|rec9uzDAM53Xn8LVF|801|Field Registry|—|OK|
|rec9uzDAM53Xn8LVF|801|Manifest Source Config|—|OK|
|rec9uzDAM53Xn8LVF|801|Staging|—|OK|
|rec9uzDAM53Xn8LVF|801|Category ID Prefix|—|—|
|rec9uzDAM53Xn8LVF|801|CanonicalRegistry|283|OK|
|rec9uzDAM53Xn8LVF|801|From field: CanonicalRegistry|—|OK|
|rec9uzDAM53Xn8LVF|801|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recwj4NtZd2Eey9nN|803|Field Name|ProductMaster (Required Adhesive)|—|
|recwj4NtZd2Eey9nN|803|Normalization Fn|N/A (System Link)|—|
|recwj4NtZd2Eey9nN|803|Validation Rule|Must link to valid ProductMaster ID.|—|
|recwj4NtZd2Eey9nN|803|Is Required|—|—|
|recwj4NtZd2Eey9nN|803|Example Input|—|—|
|recwj4NtZd2Eey9nN|803|Example Output|—|—|
|recwj4NtZd2Eey9nN|803|Last Modified|2026-03-05T15:28:04.000Z|—|
|recwj4NtZd2Eey9nN|803|Field Type|[object Object]|—|
|recwj4NtZd2Eey9nN|803|Canonical_Registry_ID|803|—|
|recwj4NtZd2Eey9nN|803|Description Detail|Reciprocal link mapping the adhesive back to tiles.|—|
|recwj4NtZd2Eey9nN|803|Table Name|[object Object]|—|
|recwj4NtZd2Eey9nN|803|Standardization|—|OK|
|recwj4NtZd2Eey9nN|803|Anomalies|—|OK|
|recwj4NtZd2Eey9nN|803|Field Registry|—|OK|
|recwj4NtZd2Eey9nN|803|Manifest Source Config|—|OK|
|recwj4NtZd2Eey9nN|803|Staging|—|OK|
|recwj4NtZd2Eey9nN|803|Category ID Prefix|MAT_UPCMaterials|—|
|recwj4NtZd2Eey9nN|803|CanonicalRegistry|803|OK|
|recwj4NtZd2Eey9nN|803|From field: CanonicalRegistry|803|OK|
|recwj4NtZd2Eey9nN|803|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec1ZQhjZyxgdF0no|804|Field Name|Required Grout|—|
|rec1ZQhjZyxgdF0no|804|Normalization Fn|N/A (Manual Link)|—|
|rec1ZQhjZyxgdF0no|804|Validation Rule|Must link to UPCMaterials reference table.|—|
|rec1ZQhjZyxgdF0no|804|Is Required|—|—|
|rec1ZQhjZyxgdF0no|804|Example Input|—|—|
|rec1ZQhjZyxgdF0no|804|Example Output|—|—|
|rec1ZQhjZyxgdF0no|804|Last Modified|2026-03-05T15:28:04.000Z|—|
|rec1ZQhjZyxgdF0no|804|Field Type|[object Object]|—|
|rec1ZQhjZyxgdF0no|804|Canonical_Registry_ID|804|—|
|rec1ZQhjZyxgdF0no|804|Description Detail|Links tile to required companion grout.|—|
|rec1ZQhjZyxgdF0no|804|Table Name|[object Object]|—|
|rec1ZQhjZyxgdF0no|804|Standardization|46|OK|
|rec1ZQhjZyxgdF0no|804|Anomalies|—|OK|
|rec1ZQhjZyxgdF0no|804|Field Registry|—|OK|
|rec1ZQhjZyxgdF0no|804|Manifest Source Config|—|OK|
|rec1ZQhjZyxgdF0no|804|Staging|—|OK|
|rec1ZQhjZyxgdF0no|804|Category ID Prefix|—|—|
|rec1ZQhjZyxgdF0no|804|CanonicalRegistry|591|OK|
|rec1ZQhjZyxgdF0no|804|From field: CanonicalRegistry|—|OK|
|rec1ZQhjZyxgdF0no|804|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec7ScwlWu9ae4JNv|805|Field Name|ProductMaster (Required Grout)|—|
|rec7ScwlWu9ae4JNv|805|Normalization Fn|N/A (System Link)|—|
|rec7ScwlWu9ae4JNv|805|Validation Rule|Must link to valid ProductMaster ID.|—|
|rec7ScwlWu9ae4JNv|805|Is Required|—|—|
|rec7ScwlWu9ae4JNv|805|Example Input|—|—|
|rec7ScwlWu9ae4JNv|805|Example Output|—|—|
|rec7ScwlWu9ae4JNv|805|Last Modified|2026-03-05T15:28:04.000Z|—|
|rec7ScwlWu9ae4JNv|805|Field Type|[object Object]|—|
|rec7ScwlWu9ae4JNv|805|Canonical_Registry_ID|805|—|
|rec7ScwlWu9ae4JNv|805|Description Detail|Reciprocal link mapping the grout back to tiles.|—|
|rec7ScwlWu9ae4JNv|805|Table Name|[object Object]|—|
|rec7ScwlWu9ae4JNv|805|Standardization|—|OK|
|rec7ScwlWu9ae4JNv|805|Anomalies|—|OK|
|rec7ScwlWu9ae4JNv|805|Field Registry|—|OK|
|rec7ScwlWu9ae4JNv|805|Manifest Source Config|—|OK|
|rec7ScwlWu9ae4JNv|805|Staging|—|OK|
|rec7ScwlWu9ae4JNv|805|Category ID Prefix|—|—|
|rec7ScwlWu9ae4JNv|805|CanonicalRegistry|805|OK|
|rec7ScwlWu9ae4JNv|805|From field: CanonicalRegistry|805|OK|
|rec7ScwlWu9ae4JNv|805|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recVAMLsGk68Jii8T|806|Field Name|Required Sealant|—|
|recVAMLsGk68Jii8T|806|Normalization Fn|N/A (Manual Link)|—|
|recVAMLsGk68Jii8T|806|Validation Rule|Must link to UPCMaterials reference table.|—|
|recVAMLsGk68Jii8T|806|Is Required|—|—|
|recVAMLsGk68Jii8T|806|Example Input|—|—|
|recVAMLsGk68Jii8T|806|Example Output|—|—|
|recVAMLsGk68Jii8T|806|Last Modified|2026-03-05T15:28:04.000Z|—|
|recVAMLsGk68Jii8T|806|Field Type|[object Object]|—|
|recVAMLsGk68Jii8T|806|Canonical_Registry_ID|806|—|
|recVAMLsGk68Jii8T|806|Description Detail|Links tile to required companion sealant.|—|
|recVAMLsGk68Jii8T|806|Table Name|[object Object]|—|
|recVAMLsGk68Jii8T|806|Standardization|—|OK|
|recVAMLsGk68Jii8T|806|Anomalies|—|OK|
|recVAMLsGk68Jii8T|806|Field Registry|—|OK|
|recVAMLsGk68Jii8T|806|Manifest Source Config|—|OK|
|recVAMLsGk68Jii8T|806|Staging|—|OK|
|recVAMLsGk68Jii8T|806|Category ID Prefix|—|—|
|recVAMLsGk68Jii8T|806|CanonicalRegistry|592|OK|
|recVAMLsGk68Jii8T|806|From field: CanonicalRegistry|—|OK|
|recVAMLsGk68Jii8T|806|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recFhBx5xynUydmTG|807|Field Name|ProductMaster (Required Sealant)|—|
|recFhBx5xynUydmTG|807|Normalization Fn|N/A (System Link)|—|
|recFhBx5xynUydmTG|807|Validation Rule|Must link to valid ProductMaster ID.|—|
|recFhBx5xynUydmTG|807|Is Required|—|—|
|recFhBx5xynUydmTG|807|Example Input|—|—|
|recFhBx5xynUydmTG|807|Example Output|—|—|
|recFhBx5xynUydmTG|807|Last Modified|2026-03-05T15:28:04.000Z|—|
|recFhBx5xynUydmTG|807|Field Type|[object Object]|—|
|recFhBx5xynUydmTG|807|Canonical_Registry_ID|807|—|
|recFhBx5xynUydmTG|807|Description Detail|Reciprocal link mapping the sealant back to tiles.|—|
|recFhBx5xynUydmTG|807|Table Name|[object Object]|—|
|recFhBx5xynUydmTG|807|Standardization|—|OK|
|recFhBx5xynUydmTG|807|Anomalies|—|OK|
|recFhBx5xynUydmTG|807|Field Registry|—|OK|
|recFhBx5xynUydmTG|807|Manifest Source Config|—|OK|
|recFhBx5xynUydmTG|807|Staging|—|OK|
|recFhBx5xynUydmTG|807|Category ID Prefix|—|—|
|recFhBx5xynUydmTG|807|CanonicalRegistry|807|OK|
|recFhBx5xynUydmTG|807|From field: CanonicalRegistry|807|OK|
|recFhBx5xynUydmTG|807|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec7poJeymAu5jX8I|808|Field Name|Area of Use (UPC)|—|
|rec7poJeymAu5jX8I|808|Normalization Fn|N/A (Manual Link)|—|
|rec7poJeymAu5jX8I|808|Validation Rule|Must link to UPCAreaOfUse profile.|—|
|rec7poJeymAu5jX8I|808|Is Required|—|—|
|rec7poJeymAu5jX8I|808|Example Input|—|—|
|rec7poJeymAu5jX8I|808|Example Output|—|—|
|rec7poJeymAu5jX8I|808|Last Modified|2026-03-05T15:28:04.000Z|—|
|rec7poJeymAu5jX8I|808|Field Type|[object Object]|—|
|rec7poJeymAu5jX8I|808|Canonical_Registry_ID|808|—|
|rec7poJeymAu5jX8I|808|Description Detail|Connects tile to standardized application profile.|—|
|rec7poJeymAu5jX8I|808|Table Name|[object Object]|—|
|rec7poJeymAu5jX8I|808|Standardization|—|OK|
|rec7poJeymAu5jX8I|808|Anomalies|—|OK|
|rec7poJeymAu5jX8I|808|Field Registry|—|OK|
|rec7poJeymAu5jX8I|808|Manifest Source Config|—|OK|
|rec7poJeymAu5jX8I|808|Staging|—|OK|
|rec7poJeymAu5jX8I|808|Category ID Prefix|—|—|
|rec7poJeymAu5jX8I|808|CanonicalRegistry|790|OK|
|rec7poJeymAu5jX8I|808|From field: CanonicalRegistry|—|OK|
|rec7poJeymAu5jX8I|808|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec8pWghSdlDeo2po|809|Field Name|Related Products|—|
|rec8pWghSdlDeo2po|809|Normalization Fn|N/A (System Link)|—|
|rec8pWghSdlDeo2po|809|Validation Rule|Must link to valid ProductMaster ID.|—|
|rec8pWghSdlDeo2po|809|Is Required|—|—|
|rec8pWghSdlDeo2po|809|Example Input|—|—|
|rec8pWghSdlDeo2po|809|Example Output|—|—|
|rec8pWghSdlDeo2po|809|Last Modified|2026-03-05T15:28:04.000Z|—|
|rec8pWghSdlDeo2po|809|Field Type|[object Object]|—|
|rec8pWghSdlDeo2po|809|Canonical_Registry_ID|809|—|
|rec8pWghSdlDeo2po|809|Description Detail|Reciprocal link mapping the profile back to tiles.|—|
|rec8pWghSdlDeo2po|809|Table Name|[object Object]|—|
|rec8pWghSdlDeo2po|809|Standardization|—|OK|
|rec8pWghSdlDeo2po|809|Anomalies|—|OK|
|rec8pWghSdlDeo2po|809|Field Registry|—|OK|
|rec8pWghSdlDeo2po|809|Manifest Source Config|—|OK|
|rec8pWghSdlDeo2po|809|Staging|—|OK|
|rec8pWghSdlDeo2po|809|Category ID Prefix|—|—|
|rec8pWghSdlDeo2po|809|CanonicalRegistry|564|OK|
|rec8pWghSdlDeo2po|809|From field: CanonicalRegistry|—|OK|
|rec8pWghSdlDeo2po|809|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recqB7C0BZbJ9Vj1Y|810|Field Name|UPCColourMaster|—|
|recqB7C0BZbJ9Vj1Y|810|Normalization Fn|N/A (Manual Link)|—|
|recqB7C0BZbJ9Vj1Y|810|Validation Rule|Must link to UPCColourMaster profile.|—|
|recqB7C0BZbJ9Vj1Y|810|Is Required|—|—|
|recqB7C0BZbJ9Vj1Y|810|Example Input|—|—|
|recqB7C0BZbJ9Vj1Y|810|Example Output|—|—|
|recqB7C0BZbJ9Vj1Y|810|Last Modified|2026-03-05T15:28:04.000Z|—|
|recqB7C0BZbJ9Vj1Y|810|Field Type|[object Object]|—|
|recqB7C0BZbJ9Vj1Y|810|Canonical_Registry_ID|810|—|
|recqB7C0BZbJ9Vj1Y|810|Description Detail|Links tile to standardized color profile.|—|
|recqB7C0BZbJ9Vj1Y|810|Table Name|[object Object]|—|
|recqB7C0BZbJ9Vj1Y|810|Standardization|—|OK|
|recqB7C0BZbJ9Vj1Y|810|Anomalies|—|OK|
|recqB7C0BZbJ9Vj1Y|810|Field Registry|—|OK|
|recqB7C0BZbJ9Vj1Y|810|Manifest Source Config|—|OK|
|recqB7C0BZbJ9Vj1Y|810|Staging|—|OK|
|recqB7C0BZbJ9Vj1Y|810|Category ID Prefix|—|—|
|recqB7C0BZbJ9Vj1Y|810|CanonicalRegistry|553|OK|
|recqB7C0BZbJ9Vj1Y|810|From field: CanonicalRegistry|—|OK|
|recqB7C0BZbJ9Vj1Y|810|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recZ8PIxSU7kdZR4b|811|Field Name|Related Products|—|
|recZ8PIxSU7kdZR4b|811|Normalization Fn|N/A (System Link)|—|
|recZ8PIxSU7kdZR4b|811|Validation Rule|Must link to valid ProductMaster ID.|—|
|recZ8PIxSU7kdZR4b|811|Is Required|—|—|
|recZ8PIxSU7kdZR4b|811|Example Input|—|—|
|recZ8PIxSU7kdZR4b|811|Example Output|—|—|
|recZ8PIxSU7kdZR4b|811|Last Modified|2026-03-05T15:28:04.000Z|—|
|recZ8PIxSU7kdZR4b|811|Field Type|[object Object]|—|
|recZ8PIxSU7kdZR4b|811|Canonical_Registry_ID|811|—|
|recZ8PIxSU7kdZR4b|811|Description Detail|Reciprocal link mapping the color back to tiles.|—|
|recZ8PIxSU7kdZR4b|811|Table Name|[object Object]|—|
|recZ8PIxSU7kdZR4b|811|Standardization|—|OK|
|recZ8PIxSU7kdZR4b|811|Anomalies|—|OK|
|recZ8PIxSU7kdZR4b|811|Field Registry|—|OK|
|recZ8PIxSU7kdZR4b|811|Manifest Source Config|—|OK|
|recZ8PIxSU7kdZR4b|811|Staging|—|OK|
|recZ8PIxSU7kdZR4b|811|Category ID Prefix|—|—|
|recZ8PIxSU7kdZR4b|811|CanonicalRegistry|564|OK|
|recZ8PIxSU7kdZR4b|811|From field: CanonicalRegistry|—|OK|
|recZ8PIxSU7kdZR4b|811|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recT3gLaVIYejAweh|812|Field Name|UPCShapeType|—|
|recT3gLaVIYejAweh|812|Normalization Fn|N/A (Manual Link)|—|
|recT3gLaVIYejAweh|812|Validation Rule|Must link to UPCShapeType profile.|—|
|recT3gLaVIYejAweh|812|Is Required|—|—|
|recT3gLaVIYejAweh|812|Example Input|—|—|
|recT3gLaVIYejAweh|812|Example Output|—|—|
|recT3gLaVIYejAweh|812|Last Modified|2026-03-05T15:28:04.000Z|—|
|recT3gLaVIYejAweh|812|Field Type|[object Object]|—|
|recT3gLaVIYejAweh|812|Canonical_Registry_ID|812|—|
|recT3gLaVIYejAweh|812|Description Detail|Links tile to geometric shape descriptor.|—|
|recT3gLaVIYejAweh|812|Table Name|[object Object]|—|
|recT3gLaVIYejAweh|812|Standardization|—|OK|
|recT3gLaVIYejAweh|812|Anomalies|—|OK|
|recT3gLaVIYejAweh|812|Field Registry|—|OK|
|recT3gLaVIYejAweh|812|Manifest Source Config|—|OK|
|recT3gLaVIYejAweh|812|Staging|—|OK|
|recT3gLaVIYejAweh|812|Category ID Prefix|—|—|
|recT3gLaVIYejAweh|812|CanonicalRegistry|578|OK|
|recT3gLaVIYejAweh|812|From field: CanonicalRegistry|—|OK|
|recT3gLaVIYejAweh|812|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recPcsuLpt2G5Fzqk|813|Field Name|Related Products|—|
|recPcsuLpt2G5Fzqk|813|Normalization Fn|N/A (System Link)|—|
|recPcsuLpt2G5Fzqk|813|Validation Rule|Must link to valid ProductMaster ID.|—|
|recPcsuLpt2G5Fzqk|813|Is Required|—|—|
|recPcsuLpt2G5Fzqk|813|Example Input|—|—|
|recPcsuLpt2G5Fzqk|813|Example Output|—|—|
|recPcsuLpt2G5Fzqk|813|Last Modified|2026-03-05T15:28:04.000Z|—|
|recPcsuLpt2G5Fzqk|813|Field Type|[object Object]|—|
|recPcsuLpt2G5Fzqk|813|Canonical_Registry_ID|813|—|
|recPcsuLpt2G5Fzqk|813|Description Detail|Reciprocal link mapping the shape back to tiles.|—|
|recPcsuLpt2G5Fzqk|813|Table Name|[object Object]|—|
|recPcsuLpt2G5Fzqk|813|Standardization|—|OK|
|recPcsuLpt2G5Fzqk|813|Anomalies|—|OK|
|recPcsuLpt2G5Fzqk|813|Field Registry|—|OK|
|recPcsuLpt2G5Fzqk|813|Manifest Source Config|—|OK|
|recPcsuLpt2G5Fzqk|813|Staging|—|OK|
|recPcsuLpt2G5Fzqk|813|Category ID Prefix|—|—|
|recPcsuLpt2G5Fzqk|813|CanonicalRegistry|564|OK|
|recPcsuLpt2G5Fzqk|813|From field: CanonicalRegistry|—|OK|
|recPcsuLpt2G5Fzqk|813|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rec9mINM5rb5EiMRk|814|Field Name|CODE|—|
|rec9mINM5rb5EiMRk|814|Normalization Fn|TRIM(UPPER({CODE}))|—|
|rec9mINM5rb5EiMRk|814|Validation Rule|Not Empty|—|
|rec9mINM5rb5EiMRk|814|Is Required|true|—|
|rec9mINM5rb5EiMRk|814|Example Input|—|—|
|rec9mINM5rb5EiMRk|814|Example Output|—|—|
|rec9mINM5rb5EiMRk|814|Last Modified|2026-03-06T00:52:46.000Z|—|
|rec9mINM5rb5EiMRk|814|Field Type|[object Object]|—|
|rec9mINM5rb5EiMRk|814|Canonical_Registry_ID|814|—|
|rec9mINM5rb5EiMRk|814|Description Detail|—|—|
|rec9mINM5rb5EiMRk|814|Table Name|[object Object]|—|
|rec9mINM5rb5EiMRk|814|Standardization|—|OK|
|rec9mINM5rb5EiMRk|814|Anomalies|—|OK|
|rec9mINM5rb5EiMRk|814|Field Registry|—|OK|
|rec9mINM5rb5EiMRk|814|Manifest Source Config|—|OK|
|rec9mINM5rb5EiMRk|814|Staging|—|OK|
|rec9mINM5rb5EiMRk|814|Category ID Prefix|—|—|
|rec9mINM5rb5EiMRk|814|CanonicalRegistry|814|OK|
|rec9mINM5rb5EiMRk|814|From field: CanonicalRegistry|814|OK|
|rec9mINM5rb5EiMRk|814|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recgNl4DdqKfhspEs|815|Field Name|Setting Time (materials)|—|
|recgNl4DdqKfhspEs|815|Normalization Fn|—|—|
|recgNl4DdqKfhspEs|815|Validation Rule|—|—|
|recgNl4DdqKfhspEs|815|Is Required|—|—|
|recgNl4DdqKfhspEs|815|Example Input|—|—|
|recgNl4DdqKfhspEs|815|Example Output|—|—|
|recgNl4DdqKfhspEs|815|Last Modified|2026-03-06T03:53:13.000Z|—|
|recgNl4DdqKfhspEs|815|Field Type|[object Object]|—|
|recgNl4DdqKfhspEs|815|Canonical_Registry_ID|815|—|
|recgNl4DdqKfhspEs|815|Description Detail|—|—|
|recgNl4DdqKfhspEs|815|Table Name|[object Object]|—|
|recgNl4DdqKfhspEs|815|Standardization|—|OK|
|recgNl4DdqKfhspEs|815|Anomalies|—|OK|
|recgNl4DdqKfhspEs|815|Field Registry|—|OK|
|recgNl4DdqKfhspEs|815|Manifest Source Config|—|OK|
|recgNl4DdqKfhspEs|815|Staging|—|OK|
|recgNl4DdqKfhspEs|815|Category ID Prefix|Mat_Setting Time (materials)|—|
|recgNl4DdqKfhspEs|815|CanonicalRegistry|815|OK|
|recgNl4DdqKfhspEs|815|From field: CanonicalRegistry|815|OK|
|recgNl4DdqKfhspEs|815|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recdtMTaYLBJdxJ5Z|816|Field Name|Grout Gap|—|
|recdtMTaYLBJdxJ5Z|816|Normalization Fn|—|—|
|recdtMTaYLBJdxJ5Z|816|Validation Rule|—|—|
|recdtMTaYLBJdxJ5Z|816|Is Required|—|—|
|recdtMTaYLBJdxJ5Z|816|Example Input|—|—|
|recdtMTaYLBJdxJ5Z|816|Example Output|—|—|
|recdtMTaYLBJdxJ5Z|816|Last Modified|2026-03-06T03:26:00.000Z|—|
|recdtMTaYLBJdxJ5Z|816|Field Type|[object Object]|—|
|recdtMTaYLBJdxJ5Z|816|Canonical_Registry_ID|816|—|
|recdtMTaYLBJdxJ5Z|816|Description Detail|—|—|
|recdtMTaYLBJdxJ5Z|816|Table Name|[object Object]|—|
|recdtMTaYLBJdxJ5Z|816|Standardization|—|OK|
|recdtMTaYLBJdxJ5Z|816|Anomalies|—|OK|
|recdtMTaYLBJdxJ5Z|816|Field Registry|rec81Ii0mvAUevEtk|OK|
|recdtMTaYLBJdxJ5Z|816|Manifest Source Config|—|OK|
|recdtMTaYLBJdxJ5Z|816|Staging|—|OK|
|recdtMTaYLBJdxJ5Z|816|Category ID Prefix|SPEC_Grout_Gap|—|
|recdtMTaYLBJdxJ5Z|816|CanonicalRegistry|816|OK|
|recdtMTaYLBJdxJ5Z|816|From field: CanonicalRegistry|816|OK|
|recdtMTaYLBJdxJ5Z|816|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recmXGuXLYh2AkelF|818|Field Name|Dimension|—|
|recmXGuXLYh2AkelF|818|Normalization Fn|—|—|
|recmXGuXLYh2AkelF|818|Validation Rule|—|—|
|recmXGuXLYh2AkelF|818|Is Required|—|—|
|recmXGuXLYh2AkelF|818|Example Input|—|—|
|recmXGuXLYh2AkelF|818|Example Output|—|—|
|recmXGuXLYh2AkelF|818|Last Modified|2026-03-06T05:04:09.000Z|—|
|recmXGuXLYh2AkelF|818|Field Type|[object Object]|—|
|recmXGuXLYh2AkelF|818|Canonical_Registry_ID|818|—|
|recmXGuXLYh2AkelF|818|Description Detail|—|—|
|recmXGuXLYh2AkelF|818|Table Name|[object Object]|—|
|recmXGuXLYh2AkelF|818|Standardization|—|OK|
|recmXGuXLYh2AkelF|818|Anomalies|—|OK|
|recmXGuXLYh2AkelF|818|Field Registry|—|OK|
|recmXGuXLYh2AkelF|818|Manifest Source Config|—|OK|
|recmXGuXLYh2AkelF|818|Staging|—|OK|
|recmXGuXLYh2AkelF|818|Category ID Prefix|SPEC_Dimension|—|
|recmXGuXLYh2AkelF|818|CanonicalRegistry|818|OK|
|recmXGuXLYh2AkelF|818|From field: CanonicalRegistry|818|OK|
|recmXGuXLYh2AkelF|818|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recPFsN9Npl2Rr5Z5|819|Field Name|Severity|—|
|recPFsN9Npl2Rr5Z5|819|Normalization Fn|Scripts must write exact string. No transformation applied.|—|
|recPFsN9Npl2Rr5Z5|819|Validation Rule|Must be one of: Critical ¦ High ¦ Medium ¦ Low ¦ Info|—|
|recPFsN9Npl2Rr5Z5|819|Is Required|true|—|
|recPFsN9Npl2Rr5Z5|819|Example Input|High|—|
|recPFsN9Npl2Rr5Z5|819|Example Output|High|—|
|recPFsN9Npl2Rr5Z5|819|Last Modified|2026-03-06T10:56:34.000Z|—|
|recPFsN9Npl2Rr5Z5|819|Field Type|[object Object]|—|
|recPFsN9Npl2Rr5Z5|819|Canonical_Registry_ID|819|—|
|recPFsN9Npl2Rr5Z5|819|Description Detail|Controls alerting priority. Scripts write via field ID fldPdoc6JPYHV9gpb. Note: there are two “Medium” options in the current select (duplicate). Consolidate to one before next schema review.|—|
|recPFsN9Npl2Rr5Z5|819|Table Name|[object Object]|—|
|recPFsN9Npl2Rr5Z5|819|Standardization|—|OK|
|recPFsN9Npl2Rr5Z5|819|Anomalies|—|OK|
|recPFsN9Npl2Rr5Z5|819|Field Registry|—|OK|
|recPFsN9Npl2Rr5Z5|819|Manifest Source Config|—|OK|
|recPFsN9Npl2Rr5Z5|819|Staging|—|OK|
|recPFsN9Npl2Rr5Z5|819|Category ID Prefix|—|—|
|recPFsN9Npl2Rr5Z5|819|CanonicalRegistry|819|OK|
|recPFsN9Npl2Rr5Z5|819|From field: CanonicalRegistry|819|OK|
|recPFsN9Npl2Rr5Z5|819|Canonical_Registry_ID (from CanonicalRegistry)||—|
|reccoksHTMhItAFc7|824|Field Name|Anomaly Type|—|
|reccoksHTMhItAFc7|824|Normalization Fn|Scripts must write exact string. No transformation applied.|—|
|reccoksHTMhItAFc7|824|Validation Rule|Must be one of the controlled values below.|—|
|reccoksHTMhItAFc7|824|Is Required|true|—|
|reccoksHTMhItAFc7|824|Example Input|Missing_Data|—|
|reccoksHTMhItAFc7|824|Example Output|Missing_Data|—|
|reccoksHTMhItAFc7|824|Last Modified|2026-03-06T10:54:23.000Z|—|
|reccoksHTMhItAFc7|824|Field Type|[object Object]|—|
|reccoksHTMhItAFc7|824|Canonical_Registry_ID|824|—|
|reccoksHTMhItAFc7|824|Description Detail|Controlled vocabulary used by all ETL scripts to categorise log entries. Scripts reference these exact strings via field ID \`flda8oHUThBc1Kb7I\`. \*\*Do NOT rename or delete options.\*\* Adding new options requires updating all script constants AND this registry entry.|—|
|reccoksHTMhItAFc7|824|Table Name|[object Object]|—|
|reccoksHTMhItAFc7|824|Standardization|—|OK|
|reccoksHTMhItAFc7|824|Anomalies|—|OK|
|reccoksHTMhItAFc7|824|Field Registry|—|OK|
|reccoksHTMhItAFc7|824|Manifest Source Config|—|OK|
|reccoksHTMhItAFc7|824|Staging|—|OK|
|reccoksHTMhItAFc7|824|Category ID Prefix|—|—|
|reccoksHTMhItAFc7|824|CanonicalRegistry|824|OK|
|reccoksHTMhItAFc7|824|From field: CanonicalRegistry|824|OK|
|reccoksHTMhItAFc7|824|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recmmYTYRsUdixbmi|825|Field Name|Error Severity|—|
|recmmYTYRsUdixbmi|825|Normalization Fn|Scripts must write exact string.|—|
|recmmYTYRsUdixbmi|825|Validation Rule|Must be one of: 🔴 Critical (Stops Import) ¦ Important ¦ 🟡 Warning (Check Data) ¦ 🔵 Info|—|
|recmmYTYRsUdixbmi|825|Is Required|true|—|
|recmmYTYRsUdixbmi|825|Example Input|🟡 Warning (Check Data)|—|
|recmmYTYRsUdixbmi|825|Example Output|🟡 Warning (Check Data)|—|
|recmmYTYRsUdixbmi|825|Last Modified|2026-03-06T11:00:08.000Z|—|
|recmmYTYRsUdixbmi|825|Field Type|[object Object]|—|
|recmmYTYRsUdixbmi|825|Canonical_Registry_ID|825|—|
|recmmYTYRsUdixbmi|825|Description Detail|Controls operator alert priority. Field ID fld3TPgysD2hLbtvR.|—|
|recmmYTYRsUdixbmi|825|Table Name|[object Object]|—|
|recmmYTYRsUdixbmi|825|Standardization|—|OK|
|recmmYTYRsUdixbmi|825|Anomalies|—|OK|
|recmmYTYRsUdixbmi|825|Field Registry|—|OK|
|recmmYTYRsUdixbmi|825|Manifest Source Config|—|OK|
|recmmYTYRsUdixbmi|825|Staging|—|OK|
|recmmYTYRsUdixbmi|825|Category ID Prefix|—|—|
|recmmYTYRsUdixbmi|825|CanonicalRegistry|825|OK|
|recmmYTYRsUdixbmi|825|From field: CanonicalRegistry|825|OK|
|recmmYTYRsUdixbmi|825|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recR64eGmoEOCpzNo|826|Field Name|Resolution Status|—|
|recR64eGmoEOCpzNo|826|Normalization Fn|Must be one of: Open ¦ In Progress ¦ Resolved ¦ Ignored (Valid Exception)|—|
|recR64eGmoEOCpzNo|826|Validation Rule|Tracks fix state of each anomaly. Field ID fld4li4vcLn43h2N4. Script 0C reads this field to determine release eligibility.|—|
|recR64eGmoEOCpzNo|826|Is Required|true|—|
|recR64eGmoEOCpzNo|826|Example Input|Open|—|
|recR64eGmoEOCpzNo|826|Example Output|Open|—|
|recR64eGmoEOCpzNo|826|Last Modified|2026-03-06T11:01:02.000Z|—|
|recR64eGmoEOCpzNo|826|Field Type|[object Object]|—|
|recR64eGmoEOCpzNo|826|Canonical_Registry_ID|826|—|
|recR64eGmoEOCpzNo|826|Description Detail|Tracks fix state of each anomaly. Field ID `fld4li4vcLn43h2N4`. Script 0C reads this field to determine release eligibility.|—|
|recR64eGmoEOCpzNo|826|Table Name|[object Object]|—|
|recR64eGmoEOCpzNo|826|Standardization|—|OK|
|recR64eGmoEOCpzNo|826|Anomalies|—|OK|
|recR64eGmoEOCpzNo|826|Field Registry|—|OK|
|recR64eGmoEOCpzNo|826|Manifest Source Config|—|OK|
|recR64eGmoEOCpzNo|826|Staging|—|OK|
|recR64eGmoEOCpzNo|826|Category ID Prefix|—|—|
|recR64eGmoEOCpzNo|826|CanonicalRegistry|826|OK|
|recR64eGmoEOCpzNo|826|From field: CanonicalRegistry|826|OK|
|recR64eGmoEOCpzNo|826|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recijdxwACKjxB5Pr|827|Field Name|Import Status|—|
|recijdxwACKjxB5Pr|827|Normalization Fn|Scripts must write exact string.|—|
|recijdxwACKjxB5Pr|827|Validation Rule|Must be one of controlled values below.|—|
|recijdxwACKjxB5Pr|827|Is Required|true|—|
|recijdxwACKjxB5Pr|827|Example Input|New|—|
|recijdxwACKjxB5Pr|827|Example Output|New|—|
|recijdxwACKjxB5Pr|827|Last Modified|2026-03-06T11:02:50.000Z|—|
|recijdxwACKjxB5Pr|827|Field Type|[object Object]|—|
|recijdxwACKjxB5Pr|827|Canonical_Registry_ID|827|—|
|recijdxwACKjxB5Pr|827|Description Detail|Controls ETL routing. Script 0 sets this to Processing on start and Processed or Failed on completion. Field ID fldtTTRihPTXisag8. Changing option names here breaks Script 0’s status updates silently.|—|
|recijdxwACKjxB5Pr|827|Table Name|[object Object]|—|
|recijdxwACKjxB5Pr|827|Standardization|—|OK|
|recijdxwACKjxB5Pr|827|Anomalies|—|OK|
|recijdxwACKjxB5Pr|827|Field Registry|—|OK|
|recijdxwACKjxB5Pr|827|Manifest Source Config|—|OK|
|recijdxwACKjxB5Pr|827|Staging|—|OK|
|recijdxwACKjxB5Pr|827|Category ID Prefix|—|—|
|recijdxwACKjxB5Pr|827|CanonicalRegistry|827|OK|
|recijdxwACKjxB5Pr|827|From field: CanonicalRegistry|827|OK|
|recijdxwACKjxB5Pr|827|Canonical_Registry_ID (from CanonicalRegistry)||—|
|rechOaNX49tS5kaXO|828|Field Name|Helper Tag Stock Status|—|
|rechOaNX49tS5kaXO|828|Normalization Fn|Scripts must write exact string.|—|
|rechOaNX49tS5kaXO|828|Validation Rule|Must be one of: ST (Stock) ¦ PR (Price) ¦ DD (Discontinued) ¦ EOR|—|
|rechOaNX49tS5kaXO|828|Is Required|true|—|
|rechOaNX49tS5kaXO|828|Example Input|ST (Stock)|—|
|rechOaNX49tS5kaXO|828|Example Output|ST (Stock)|—|
|rechOaNX49tS5kaXO|828|Last Modified|2026-03-06T11:03:49.000Z|—|
|rechOaNX49tS5kaXO|828|Field Type|[object Object]|—|
|rechOaNX49tS5kaXO|828|Canonical_Registry_ID|828|—|
|rechOaNX49tS5kaXO|828|Description Detail|Tags each source file with its import type. Script 1 reads this via field ID `fldznkw7kfCI8sXjn` to route records to the correct SPD handler. This is the most fragile field in the pipeline — renaming any option here causes Script 1 to silently misroute ALL records from that feed type.|—|
|rechOaNX49tS5kaXO|828|Table Name|[object Object]|—|
|rechOaNX49tS5kaXO|828|Standardization|—|OK|
|rechOaNX49tS5kaXO|828|Anomalies|—|OK|
|rechOaNX49tS5kaXO|828|Field Registry|—|OK|
|rechOaNX49tS5kaXO|828|Manifest Source Config|—|OK|
|rechOaNX49tS5kaXO|828|Staging|—|OK|
|rechOaNX49tS5kaXO|828|Category ID Prefix|—|—|
|rechOaNX49tS5kaXO|828|CanonicalRegistry|828|OK|
|rechOaNX49tS5kaXO|828|From field: CanonicalRegistry|828|OK|
|rechOaNX49tS5kaXO|828|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recybLe9dFbHowVEd|830|Field Name|Supplier Body Finish Raw|—|
|recybLe9dFbHowVEd|830|Normalization Fn|Delegated to Dynamic Standardization Engine|—|
|recybLe9dFbHowVEd|830|Validation Rule|must match source doc rules in standardization|—|
|recybLe9dFbHowVEd|830|Is Required|—|—|
|recybLe9dFbHowVEd|830|Example Input|—|—|
|recybLe9dFbHowVEd|830|Example Output|—|—|
|recybLe9dFbHowVEd|830|Last Modified|2026-03-12T00:00:44.000Z|—|
|recybLe9dFbHowVEd|830|Field Type|[object Object]|—|
|recybLe9dFbHowVEd|830|Canonical_Registry_ID|830|—|
|recybLe9dFbHowVEd|830|Description Detail|Must match Standardization Table (ID 830)|—|
|recybLe9dFbHowVEd|830|Table Name|[object Object]|—|
|recybLe9dFbHowVEd|830|Standardization|57, 20, 21, 22, 23, 24, 59, 58, 25, 2|OK|
|recybLe9dFbHowVEd|830|Anomalies|—|OK|
|recybLe9dFbHowVEd|830|Field Registry|—|OK|
|recybLe9dFbHowVEd|830|Manifest Source Config|—|OK|
|recybLe9dFbHowVEd|830|Staging|—|OK|
|recybLe9dFbHowVEd|830|Category ID Prefix|—|—|
|recybLe9dFbHowVEd|830|CanonicalRegistry|830|OK|
|recybLe9dFbHowVEd|830|From field: CanonicalRegistry|830|OK|
|recybLe9dFbHowVEd|830|Canonical_Registry_ID (from CanonicalRegistry)||—|
|recZdUBI3QMozTqE7|834|Field Name|colour supplier ref|—|
|recZdUBI3QMozTqE7|834|Normalization Fn|Must be a string,|—|
|recZdUBI3QMozTqE7|834|Validation Rule|Subjective colour depiction matching the supplier listing|—|
|recZdUBI3QMozTqE7|834|Is Required|—|—|
|recZdUBI3QMozTqE7|834|Example Input|—|—|
|recZdUBI3QMozTqE7|834|Example Output|—|—|
|recZdUBI3QMozTqE7|834|Last Modified|2026-03-12T01:17:32.000Z|—|
|recZdUBI3QMozTqE7|834|Field Type|[object Object]|—|
|recZdUBI3QMozTqE7|834|Canonical_Registry_ID|834|—|
|recZdUBI3QMozTqE7|834|Description Detail|—|—|
|recZdUBI3QMozTqE7|834|Table Name|[object Object]|—|
|recZdUBI3QMozTqE7|834|Standardization|—|OK|
|recZdUBI3QMozTqE7|834|Anomalies|—|OK|
|recZdUBI3QMozTqE7|834|Field Registry|—|OK|
|recZdUBI3QMozTqE7|834|Manifest Source Config|—|OK|
|recZdUBI3QMozTqE7|834|Staging|—|OK|
|recZdUBI3QMozTqE7|834|Category ID Prefix|—|—|
|recZdUBI3QMozTqE7|834|CanonicalRegistry|834|OK|
|recZdUBI3QMozTqE7|834|From field: CanonicalRegistry|834|OK|
|recZdUBI3QMozTqE7|834|Canonical_Registry_ID (from CanonicalRegistry)||—|
