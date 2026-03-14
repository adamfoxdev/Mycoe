# Sales Dashboard — Power BI Starter Example

A practical Power BI starter showing how to apply Mycoe CoE standards to a Sales Performance dashboard. Use this as your reference when building new reports.

## What's Included

| File | Contents |
|---|---|
| `sales-dashboard.dax` | All measures for the Sales dashboard — organised by category |
| `dim-date.dax` | Shared date dimension (copy from `templates/powerbi/dim-date.dax`) |
| `REPORT-README.md` | Filled-in report README using the CoE template |

## Data Model Overview

```
Fact_Sales ─┬─ Dim_Customer
            ├─ Dim_Product
            ├─ Dim_Region
            └─ Dim_Date (mark as Date Table on [Date])
```

## Getting Started

1. Create a new Power BI Desktop file.
2. Connect to your data sources and build the data model as shown above.
3. Create a hidden table named `_Measures` (use `{BLANK()}` as the expression).
4. Paste each measure from `sales-dashboard.dax` into `_Measures`.
5. Mark `Dim_Date[Date]` as the Date Table.
6. Build visuals using the measures — see the README for the recommended page layout.

## References

- [CoE Power BI Standards](../../docs/standards/powerbi.md)
- [Power BI DAX Templates](../../templates/powerbi/)
- [Azure Pipeline for Power BI](../../templates/azure/pipelines/powerbi.yml)
