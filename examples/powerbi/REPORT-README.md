# Sales Performance Dashboard — README

## Report Name

`Sales_Performance_Dashboard`

## Description

Tracks overall sales performance across products, customers, and regions. Answers the key business questions:

- How is revenue trending month-over-month and year-over-year?
- Which products and customers are driving the most revenue?
- Which regions are under- or over-performing vs. target?

**Audience:** Sales leadership, regional managers, and account executives.

## Pages

| Page | Content |
|---|---|
| Executive Summary | KPI cards (Revenue YTD, Gross Margin %, Revenue YoY %) + revenue trend line |
| Product Performance | Revenue by product with Top 10 ranking table |
| Customer Analysis | Revenue by customer with Top 10 ranking, Revenue per Customer |
| Regional Breakdown | Map visual + table with Region Revenue Share % |

## Data Sources

| Source | Connection Type | Refresh Mode |
|---|---|---|
| Azure SQL Database — SalesDB | Import | Daily at 05:00 UTC |

## Refresh Schedule

| Environment | Schedule | Contact on failure |
|---|---|---|
| Development | Manual | dev-team@example.com |
| Production | Daily at 05:00 UTC | data-team@example.com |

## Row-Level Security

| Role Name | Filter Logic | Who Is Assigned |
|---|---|---|
| RegionManager | `Dim_Region[Region] = USERPRINCIPALNAME()` | Regional manager AD group |
| SalesRep | `Dim_Customer[Owner UPN] = USERPRINCIPALNAME()` | Sales representative AD group |

**Note:** Users without a role see no data. Admins bypass RLS by not being assigned any role.

## Workspaces

| Environment | Workspace Name | Workspace ID |
|---|---|---|
| Development | `Sales - Development` | *(replace with actual guid)* |
| Production | `Sales - Production` | *(replace with actual guid)* |

## Deployment

Deployed via the `templates/azure/pipelines/powerbi.yml` pipeline using Power BI Deployment Pipelines. Promotion from Development → Production requires sign-off from the Data & Analytics Guild lead.

## Naming Conventions

All measures follow the CoE convention: `Metric Noun [Time Qualifier]` (e.g., `Revenue YTD`, `Gross Margin %`).

## Change Log

| Date | Author | Change |
|---|---|---|
| 2024-01-01 | CoE | Initial version — executive summary, product, customer, and regional pages |
