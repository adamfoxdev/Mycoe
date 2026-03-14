# Microsoft 365 Templates

This folder contains starter templates for Microsoft 365 integrations following the Mycoe CoE standards.

## Templates

| Template | Folder | Use When |
|---|---|---|
| SPFx Web Part | `spfx-webpart/` | Building a custom SharePoint web part or extension |
| Teams App | `teams-app/` | Building a tab, bot, or message extension for Microsoft Teams |
| Power Automate Flow | `power-automate/` | Bootstrapping an approval or notification flow |

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 18 LTS | Required for SPFx |
| gulp-cli | Latest | `npm install -g gulp-cli` |
| Yeoman | Latest | `npm install -g yo` |
| SPFx Yeoman Generator | 1.18.x | `npm install -g @microsoft/generator-sharepoint` |
| Teams Toolkit | Latest | VS Code extension — [install](https://aka.ms/teams-toolkit) |

## Standards Reference

All templates follow the standards defined in [docs/standards/microsoft365.md](../../docs/standards/microsoft365.md).

Key requirements:
- All apps use **Azure AD (Entra ID)** for authentication — no local accounts
- Use **Microsoft Graph SDK** (not raw HTTP calls)
- Request the **minimum required scopes** (principle of least privilege)
- Store all manifests, flow exports, and SPFx solutions in **source control**
- Production flows must be owned by a **service account**, not an individual

## Getting Started

### SPFx Web Part

```bash
cp -r templates/microsoft365/spfx-webpart ./my-webpart
cd my-webpart
npm install
gulp serve
```

### Teams App

```bash
# Open in VS Code with Teams Toolkit installed
cp -r templates/microsoft365/teams-app ./my-teams-app
code ./my-teams-app
# Use Teams Toolkit: "Preview in Teams" to test locally
```

### Power Automate Flow

1. Open the JSON file in `power-automate/` for the flow type you need
2. Import it into Power Automate via **My Flows → Import → Import Package**
3. Update connection references to use your service account
4. Apply the organisation DLP policy before publishing
