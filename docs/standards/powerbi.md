# Power BI Standards

This document defines standards for all Power BI content developed within Mycoe.

## Tooling

| Tool | Purpose |
|---|---|
| Power BI Desktop | Report and data model development |
| Power BI Service | Publishing, sharing, and scheduling |
| Tabular Editor 3 | Advanced data model management, scripting |
| ALM Toolkit | Dataset comparison and deployment |
| Power BI Project (PBIP) | Source-control-friendly file format |

## Workspace & Naming Conventions

### Workspaces

Use the following naming pattern for workspaces:

```
<Department> - <Environment>
```

Examples:
- `Finance - Development`
- `Finance - Production`
- `HR Analytics - UAT`

### Datasets (Semantic Models)

```
<Domain>_<Subject>_Dataset
```

Examples: `Finance_Budgets_Dataset`, `HR_Headcount_Dataset`

### Reports

```
<Domain>_<Subject>_Report
```

Examples: `Finance_Budgets_Report`, `HR_Headcount_Report`

### Dataflows

```
<Domain>_<Subject>_Dataflow
```

## Data Model Standards

### Star Schema

Always model data using a **star schema**:
- **Fact tables** contain numeric measures and foreign keys
- **Dimension tables** contain descriptive attributes
- Avoid snowflake schemas unless there is a strong performance reason

### Table Naming

| Object | Convention | Example |
|---|---|---|
| Fact table | `Fact_<Subject>` | `Fact_Sales` |
| Dimension table | `Dim_<Subject>` | `Dim_Customer` |
| Date table | `Dim_Date` | `Dim_Date` |
| Bridge table | `Bridge_<Subject>` | `Bridge_ProductCategory` |

### Column Naming

- Use **Title Case** with spaces: `Customer Name`, `Order Date`
- Prefix foreign key columns: `FK_CustomerID`
- Boolean columns: prefix with `Is` or `Has`: `Is Active`, `Has Discount`
- Hide all foreign key columns from report view — they are for model integrity only

### Measure Naming

- Use **Title Case** with spaces
- Group measures in a dedicated **`_Measures`** table (empty table, measures only)
- Prefix measures with their aggregation type where helpful: `Total Revenue`, `Avg Order Value`, `YTD Sales`
- Always set the **format string** on every measure

### Date Table

Every model must include a **date table** (`Dim_Date`) marked as a date table:
- Contiguous range covering all dates in the data plus at least one future year
- Include: Date, Day, Month, Month Number, Quarter, Year, Week Number, Financial Year, Financial Quarter
- Use a calculated table or import from a shared dataflow

## DAX Standards

```dax
-- ✅ Good: readable, formatted, DIVIDE used for division
Total Revenue =
CALCULATE(
    SUMX(
        Fact_Sales,
        Fact_Sales[Quantity] * Fact_Sales[Unit Price]
    ),
    REMOVEFILTERS(Dim_Date[Year])
)

-- ✅ Use DIVIDE, never /
Profit Margin % =
DIVIDE(
    [Total Profit],
    [Total Revenue],
    0
)
```

- Always use `DIVIDE` instead of `/` to handle divide-by-zero
- Use variables (`VAR`) to avoid repeated expressions
- Avoid FILTER() on large tables — use CALCULATETABLE() with column comparisons
- Never use `IFERROR` to silence errors — fix the root cause

## Row-Level Security (RLS)

- Apply RLS at the **dataset** level, not the report level
- Use **dynamic RLS** where roles are managed via a security mapping table
- Test RLS using the "View as role" feature before publishing
- Document all security roles in the dataset README

```dax
-- Example dynamic RLS filter on Dim_Employee
[Email] = USERPRINCIPALNAME()
```

## Testing and Validation

### Overview

Power BI does not have a traditional unit test runner, but structured validation at each layer prevents errors from reaching production.

| Layer | Tool / Approach | Scope |
|---|---|---|
| DAX measure correctness | Tabular Editor C# scripts | Validate measure outputs against known values |
| Data model integrity | Best Practice Analyser (BPA) | Naming, relationships, hidden columns, unused objects |
| Row-Level Security | Power BI Desktop "View as role" + scripted checks | Confirm correct data visibility per role |
| Report visual testing | Power BI Test — manual checklist + screenshots | Visual layout, filter interactions, tooltip accuracy |
| End-to-end refresh | Pipeline deployment + Power BI REST API | Confirm dataset refreshes without error in each environment |

### DAX Measure Validation with Tabular Editor

**Tabular Editor 3** supports C# scripting that can assert measure values against expected results. Add these scripts to your `model/` folder and run them as part of CI or pre-publication review.

```csharp
// scripts/validate-measures.csx
// Run via: TabularEditor.exe Model.bim -S scripts/validate-measures.csx

var errors = new System.Collections.Generic.List<string>();

// Check every visible measure has a format string set
foreach (var measure in Model.AllMeasures.Where(m => !m.IsHidden))
{
    if (string.IsNullOrWhiteSpace(measure.FormatString))
        errors.Add($"Measure '{measure.Name}' has no format string.");
}

// Check no measure uses unprotected division
foreach (var measure in Model.AllMeasures)
{
    if (System.Text.RegularExpressions.Regex.IsMatch(measure.Expression, @"[^/]/[^/]"))
        errors.Add($"Measure '{measure.Name}' uses bare division — use DIVIDE() instead.");
}

if (errors.Count > 0)
{
    foreach (var e in errors) Error(e);
    throw new Exception($"{errors.Count} measure validation error(s) found.");
}

Info("All measure validations passed.");
```

**Tabular Editor CLI in CI (Azure DevOps):**

```yaml
- script: |
    TabularEditor.exe "$(Build.SourcesDirectory)/model/Model.bim" \
      -A "$(Build.SourcesDirectory)/scripts/BestPracticeRules.json" \
      -S "$(Build.SourcesDirectory)/scripts/validate-measures.csx"
  displayName: 'Validate Power BI data model'
  failOnStderr: true
```

### Best Practice Analyser (BPA)

The **Best Practice Analyser** is built into Tabular Editor and enforces naming conventions and model quality rules automatically.

Commit a `BestPracticeRules.json` file to the `model/` folder containing the team's rules. At minimum, include rules for:

- All measures must have a description
- Measure format strings are set
- No columns are both visible and have `IsKey = true` in the report view
- Date table is marked as a date table
- No relationships with inactive filter direction unless explicitly justified

Run BPA in CI with:

```bash
TabularEditor.exe Model.bim -A BestPracticeRules.json
```

Exit code is non-zero when any rule at `Error` severity fails, causing the pipeline to break.

### Row-Level Security Testing

1. Define all RLS roles in the semantic model and document them in `model/README.md`
2. Test each role using **"View as role"** in Power BI Desktop before publishing
3. For dynamic RLS (`USERPRINCIPALNAME()`), create test accounts for each persona and verify row counts match expectations
4. After publishing, use the Power BI REST API to verify RLS definitions are present:

```bash
# Check RLS roles exist on a published dataset
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.powerbi.com/v1.0/myorg/datasets/$DATASET_ID/roles" | jq '.value[].name'
```

### Report Validation Checklist

Before publishing a report to UAT or Production, complete this checklist:

- [ ] All slicers and filters produce correct results on known data
- [ ] Cross-filtering between visuals works as expected
- [ ] Tooltips show the correct measure values
- [ ] Report renders correctly on target screen resolutions (1280×720 minimum)
- [ ] Mobile layout is configured for any report distributed to mobile users
- [ ] Performance Analyzer shows no single visual exceeding 2 seconds on typical data volumes
- [ ] No hardcoded dates in measures or filters (use `TODAY()` / relative date filters)
- [ ] Bookmarks and drillthrough pages behave as documented

### Testing Gotchas and Recommendations

| Gotcha | Recommendation |
|---|---|
| DAX `BLANK()` vs `0` | Many aggregations return `BLANK()` when there is no data; test edge cases with empty filter contexts |
| Bi-directional relationships masking RLS | Test RLS with bi-directional relationships explicitly — filters may propagate in unexpected directions |
| Measure totals are not sums of rows | Row context vs filter context — write explicit tests for totals using known data |
| `USERELATIONSHIP` in CI models | Inactive relationships used in measures must be tested with the specific filter context they activate in |
| Incremental refresh and test data | Do not rely on incremental refresh in development; always test with a full refresh first |
| Gateway data source changes | Re-test all measures after a gateway or data source credential change — cached data may hide errors |

## Source Control

- Use **Power BI Project (PBIP)** format for source control
- Commit `.pbip`, `report/`, and `model/` folders — do **not** commit `.pbix` files (binary)
- Add a `README.md` to each report folder describing its purpose, data sources, and refresh schedule
- Use feature branches and pull requests — same process as code

## Deployment

- Use **deployment pipelines** (Development → UAT → Production)
- Never publish directly to Production — always promote through the pipeline
- Use **dataset parameters** for environment-specific connection strings
- Schedule refreshes via the Power BI Service — document refresh times in the workspace README

## Performance Guidelines

- Limit report pages to **~20 visuals** per page
- Avoid bi-directional relationships unless necessary
- Use **Import mode** for datasets under ~1GB; use **DirectQuery** or **Composite** for larger datasets with agreed latency trade-offs
- Profile slow queries with **Performance Analyzer** before publishing
