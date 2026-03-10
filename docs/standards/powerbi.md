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
