# Azure Standards

This document defines standards for all Azure infrastructure and DevOps practices within Mycoe.

## Naming Conventions

All Azure resources must follow the [Microsoft Cloud Adoption Framework naming conventions](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming).

### Pattern

```
<resource-type>-<workload>-<environment>[-<region>][-<instance>]
```

### Abbreviations

| Resource Type | Prefix |
|---|---|
| Resource Group | `rg-` |
| App Service Plan | `plan-` |
| App Service (Web App) | `app-` |
| Function App | `func-` |
| Azure SQL Server | `sql-` |
| Azure SQL Database | `sqldb-` |
| Storage Account | `st` (no hyphen, max 24 chars) |
| Key Vault | `kv-` |
| Container Registry | `cr` (no hyphen) |
| AKS Cluster | `aks-` |
| Service Bus | `sb-` |
| API Management | `apim-` |
| Log Analytics Workspace | `log-` |
| Application Insights | `appi-` |
| Virtual Network | `vnet-` |
| Subnet | `snet-` |
| Network Security Group | `nsg-` |

### Environments

| Environment | Abbreviation |
|---|---|
| Development | `dev` |
| Test / QA | `tst` |
| UAT | `uat` |
| Production | `prd` |

### Example

```
rg-myapp-prd-aue
app-myapp-api-prd-aue
sql-myapp-prd-aue
kv-myapp-prd-aue
```

## Resource Tagging

All resources **must** have the following tags:

| Tag | Description | Example |
|---|---|---|
| `environment` | Environment name | `production` |
| `workload` | Workload/application name | `my-app` |
| `team` | Owning team | `backend-guild` |
| `cost-centre` | Finance cost centre code | `CC-1234` |
| `created-by` | Tool/pipeline that provisioned it | `bicep-pipeline` |

## Infrastructure as Code

- **All** infrastructure must be defined as code using **Bicep**
- No manual resource creation in the Azure Portal (except for ephemeral developer sandboxes)
- Bicep modules live in `templates/azure/bicep/`
- Environments are configured via parameter files: `main.parameters.<env>.json`
- Use `what-if` deployments in CI before applying to UAT/Production

### Module Structure

```
templates/azure/bicep/
├── main.bicep               # Orchestration entry point
├── main.parameters.dev.json
├── main.parameters.uat.json
├── main.parameters.prd.json
└── modules/
    ├── app-service.bicep
    ├── key-vault.bicep
    ├── sql-database.bicep
    └── storage-account.bicep
```

## RBAC (Role-Based Access Control)

- Follow the **principle of least privilege** — assign the minimum role required
- Prefer **built-in roles** over custom roles
- Assign roles to **groups**, not individual users — manage group membership in Entra ID
- Document all non-standard role assignments in the relevant project's `infra/RBAC.md`

| Scenario | Recommended Role |
|---|---|
| CI/CD pipeline deploying resources | `Contributor` on the resource group |
| App reading from Key Vault | `Key Vault Secrets User` |
| App reading from Storage | `Storage Blob Data Reader` |
| App writing to Storage | `Storage Blob Data Contributor` |
| Read-only access for support | `Reader` |

Use **Managed Identities** for applications — never store credentials in configuration.

## Networking

- Deploy workloads into a **Virtual Network** (VNet)
- Use **Private Endpoints** for PaaS services (SQL, Storage, Key Vault) in UAT and Production
- No direct public internet access to databases or internal services
- Use **Azure Front Door** or **API Management** as the entry point for public APIs

## Security

- Enable **Microsoft Defender for Cloud** on all subscriptions — Standard tier minimum
- Enable **diagnostic settings** on all resources to ship logs to the central Log Analytics Workspace
- Rotate secrets and certificates before expiry — use Key Vault rotation policies
- Enable **soft-delete** and **purge protection** on all Key Vaults
- Enable **Azure Policy** guardrails: required tags, allowed locations, no public endpoints on databases

## Cost Management

- Set up **Azure Cost Management budgets** with alerts at 80% and 100%
- Review costs monthly in Azure Cost Management
- Right-size resources — start small and scale up based on monitoring data
- Use **reserved instances** for predictable long-running workloads (>12 months)

## Azure DevOps Pipelines

- Pipeline definitions live in `templates/azure/pipelines/`
- Use **YAML pipelines** — no classic GUI pipelines
- Store pipeline variables (non-secret) in YAML; store secrets in **Azure DevOps Variable Groups** linked to Key Vault
- Require **pull request build validation** before merging to `main`
- Use **environments** with manual approval gates for UAT and Production deployments
- Never use Personal Access Tokens in pipelines — use service connections with Managed Identity or Workload Identity Federation

## Monitoring & Alerting

- Every production workload must have:
  - Application Insights connected (for app telemetry)
  - Log Analytics Workspace for infrastructure logs
  - Alert rules for error rate, response time, and resource health
- Use **Azure Monitor Workbooks** or Power BI for operational dashboards
