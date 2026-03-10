# Power BI Report — README Template

Copy this `README.md` into every Power BI report folder in source control.

---

## Report Name

`<Domain>_<Subject>_Report`

## Description

Describe what this report shows, the business questions it answers, and who uses it.

## Data Sources

| Source | Connection Type | Refresh Mode |
|---|---|---|
| *(e.g., Azure SQL Database — FinanceDB)* | Import | Daily at 06:00 AEST |

## Refresh Schedule

| Environment | Schedule | Contact on failure |
|---|---|---|
| Production | Daily at 06:00 AEST | data-team@example.com |

## Row-Level Security

| Role Name | Filter Logic | Who Is Assigned |
|---|---|---|
| *(e.g., RegionManager)* | `[Region] = USERPRINCIPALNAME()` | Regional managers AD group |

## Workspaces

| Environment | Workspace Name | Workspace ID |
|---|---|---|
| Development | `Finance - Development` | *(guid)* |
| Production | `Finance - Production` | *(guid)* |

## Deployment

Deployed via the `templates/azure/pipelines/powerbi.yml` pipeline using Power BI Deployment Pipelines.

## Change Log

| Date | Author | Change |
|---|---|---|
| YYYY-MM-DD | Name | Initial version |
