// ── Storage Account ───────────────────────────────────────────
// Storage account names: 3-24 chars, lowercase letters and numbers only, globally unique

param location string
param workload string
param environment string
param tags object

// Derive a short storage account name (max 24 chars, no hyphens)
var storageNameRaw = toLower(replace('st${workload}${environment}', '-', ''))
var storageName = length(storageNameRaw) > 24 ? substring(storageNameRaw, 0, 24) : storageNameRaw

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageName
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    supportsHttpsTrafficOnly: true
    encryption: {
      services: {
        blob: { enabled: true }
        file: { enabled: true }
      }
      keySource: 'Microsoft.Storage'
    }
  }
}

output name string = storageAccount.name
output id string = storageAccount.id
