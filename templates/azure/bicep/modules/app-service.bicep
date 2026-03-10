// ── App Service Plan + Web App ────────────────────────────────

param location string
param suffix string
param tags object
param sku string
param appInsightsConnectionString string
param keyVaultUri string

resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: 'plan-${suffix}'
  location: location
  tags: tags
  sku: {
    name: sku
  }
  properties: {
    reserved: false // true for Linux
  }
}

resource webApp 'Microsoft.Web/sites@2023-01-01' = {
  name: 'app-${suffix}'
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      appSettings: [
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsightsConnectionString
        }
        {
          name: 'AZURE_KEY_VAULT_URI'
          value: keyVaultUri
        }
        {
          name: 'ASPNETCORE_ENVIRONMENT'
          value: 'Production'
        }
      ]
    }
  }
}

output defaultHostname string = 'https://${webApp.properties.defaultHostName}'
output principalId string = webApp.identity.principalId
