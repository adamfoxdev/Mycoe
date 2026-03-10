// ============================================================
// main.bicep — Orchestration entry point
// Deploy with:
//   az deployment group create \
//     --resource-group rg-myapp-dev \
//     --template-file main.bicep \
//     --parameters @main.parameters.dev.json
// ============================================================

targetScope = 'resourceGroup'

@description('Environment name (dev | tst | uat | prd)')
@allowed(['dev', 'tst', 'uat', 'prd'])
param environment string

@description('Workload / application name (lowercase, no spaces)')
param workload string

@description('Azure region short code used in resource names')
param locationCode string = 'aue'

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Team owning this workload')
param team string

@description('Finance cost centre code')
param costCentre string

@description('App Service SKU')
param appServiceSku string = 'B1'

@description('Whether to enable Application Insights')
param enableAppInsights bool = true

// ── Shared tags ──────────────────────────────────────────────
var tags = {
  environment: environment
  workload: workload
  team: team
  'cost-centre': costCentre
  'created-by': 'bicep-pipeline'
}

var suffix = '${workload}-${environment}-${locationCode}'

// ── Log Analytics & App Insights ─────────────────────────────
module monitoring 'modules/monitoring.bicep' = if (enableAppInsights) {
  name: 'monitoring'
  params: {
    location: location
    suffix: suffix
    tags: tags
  }
}

// ── Key Vault ─────────────────────────────────────────────────
module keyVault 'modules/key-vault.bicep' = {
  name: 'keyVault'
  params: {
    location: location
    suffix: suffix
    tags: tags
  }
}

// ── App Service (API) ─────────────────────────────────────────
module appService 'modules/app-service.bicep' = {
  name: 'appService'
  params: {
    location: location
    suffix: suffix
    tags: tags
    sku: appServiceSku
    appInsightsConnectionString: enableAppInsights ? monitoring.outputs.connectionString : ''
    keyVaultUri: keyVault.outputs.uri
  }
}

// ── Storage Account ───────────────────────────────────────────
module storage 'modules/storage-account.bicep' = {
  name: 'storage'
  params: {
    location: location
    workload: workload
    environment: environment
    tags: tags
  }
}

// ── Outputs ───────────────────────────────────────────────────
output appServiceUrl string = appService.outputs.defaultHostname
output keyVaultUri string = keyVault.outputs.uri
output storageAccountName string = storage.outputs.name
