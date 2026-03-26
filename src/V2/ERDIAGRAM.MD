erDiagram
    %% =========================================================
    %% ZONE 1: THE INTAKE PIPELINE (Scripts 0, 0A, 0B, 0C)
    %% =========================================================
    SourceMetadata ||--|| ManifestSourceConfig : "Script 0 Mappings"
    SourceMetadata ||--o{ Staging : "Script 0 Ingests"
    Staging ||--o{ SystemLogs : "Script 0A Logs Renames"
    Staging ||--o{ UPCAdmin : "Script 0B Holds Anomalies"
    UPCAdmin ||--o{ Staging : "Script 0C Releases Approved"
    
    %% =========================================================
    %% ZONE 2: GOVERNANCE & SSOT (The Rule Engine)
    %% =========================================================
    CanonicalRegistry ||--|| FieldRegistry : "Script Token Map"
    CanonicalRegistry ||--o{ Standardization : "Script Normalization Rules"
    ManifestSourceConfig }o--|| CanonicalRegistry : "Mapped to IDs"
    Staging }o--|| FieldRegistry : "Logic Target IDs"

    %% =========================================================
    %% ZONE 3: THE MASTER DATA LAYER (Scripts 1, 2B, 3, 4.0)
    %% =========================================================
    Staging ||--o{ SupplierProductData : "Script 1 Routes Stock/Costs"
    Staging ||--o{ ProductMaster : "Script 2B Routes Technical Specs"
    Staging ||--o{ PricingBridge : "Script 2B Routes Cost Data"
    
    SupplierProductData ||--|| ProductMaster : "Linked Ledger (SSOT)"
    SupplierProductData ||--|| PricingBridge : "Cost Source"
    ProductMaster ||--o{ UPCAdmin : "Script 3 Proposes PLUs"
    ProductMaster ||--o{ PricingBridge : "Calculates Margins"
    ProductMaster ||--|| SupplierProductData : "Script 4.0 Reconciles Drift"
    
    %% =========================================================
    %% ZONE 4: REFERENCE & ASSETS
    %% =========================================================
    ProductMaster }o--|| UPCBodyClass : "TT Code Logic"
    ProductMaster }o--|| UPCBodyFinishes : "Finish Logic"
    ProductMaster ||--|| DAM : "Asset Container"
    DAM ||--o{ ImageLibrary : "Visual Storage"

    %% =========================================================
    %% TABLE DEFINITIONS & SCRIPTS (The 'Fix' Logic)
    %% =========================================================

    SourceMetadata {
        string ID "tblz0ZlAJByjkqPbH"
        string ImportStatus "fldtTTRihPTXisag8 (Script 0 Status)"
        attachment SourceUpload "fld9ROntbwWHYGBt9"
    }

    Staging {
        string ID "tblcPSP5NcP0ioUP8"
        string SupplierSKU "fldeEd9FiNq5AtGNk (Script 0 Sanitises)"
        string DimensionsMm "fldvZjLna62iMbj5K (Script 1 Normalises)"
        string ETL_Status "fldbrUDvLv8OEnEqh (Pipeline Gate)"
    }

    ProductMaster {
        string ID "tblgLqMMXX2HcKt9U"
        string SkuMaster "fldMfK3uyPnDbKONn (Script 3 Logic Target)"
        string ZAB_Status "fldSZsiBxKNTHPFel (Script 0A Logic)"
        string Product_Status "flddq6S7409EBM71D"
    }

    UPCAdmin {
        string ID "tbl56i9Rlm2mK6t1w"
        string OriginalValue "fld0wlmRbNFgVpbXS (Script 3 Proposals)"
        string Resolution "fld4li4vcLn43h2N4 (Script 0C Gate)"
        boolean Approve "flddfVzPFP0NjYhVc (Nina's Fix/Approval)"
    }

    SystemLogs {
        string ID "tblk1v5VHPEC2c2u2"
        string EventType "flda8oHUThBc1Kb7I (Script Traceability)"
        string Severity "fldPdoc6JPYHV9gpb"
        string ActivityLink "fldWXFUMjSnBFAGvd (Admin Link)"
    }

    SupplierProductData {
        string ID "tbl7mZpHJCUs1r0cg"
        float Available "fldW44uBVVT9aqrcP (Script 1 Guardrail)"
        currency SRP_ex "flde8qM0wyidVqrsZ (Script 1 Logic)"
    }