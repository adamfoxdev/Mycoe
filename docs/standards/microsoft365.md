# Microsoft 365 Standards

This document defines standards for Microsoft 365 integrations and customisations within Mycoe.

## Identity & Authentication

- All applications must use **Azure AD (Entra ID)** for authentication — no local accounts
- Follow the **principle of least privilege** when requesting Microsoft Graph scopes
- Use **delegated permissions** where possible; use application permissions only when a user context is not available
- All app registrations must be documented in the Azure App Registration Register (see Azure standards)
- Rotate client secrets on a schedule — prefer **Managed Identities** over secrets

## Microsoft Graph API

### SDK Usage

Always use the **Microsoft Graph SDK** rather than raw HTTP calls:

```csharp
// .NET
using Microsoft.Graph;
using Azure.Identity;

var credential = new DefaultAzureCredential();
var graphClient = new GraphServiceClient(credential);
```

```ts
// TypeScript (browser)
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
```

### Throttling & Resilience

- Honour `Retry-After` headers — Graph throttles at 10,000 requests per 10 minutes per app per tenant
- Use **batch requests** (`/$batch`) when fetching multiple independent resources
- Cache Graph responses where data changes infrequently (e.g., user profiles)

### Scopes (Principle of Least Privilege)

| Scenario | Minimum Scope |
|---|---|
| Read signed-in user profile | `User.Read` |
| Read other users' profiles | `User.ReadBasic.All` |
| Send email as signed-in user | `Mail.Send` |
| Read SharePoint files | `Files.Read` |
| Write SharePoint files | `Files.ReadWrite` |
| Create Teams meetings | `OnlineMeetings.ReadWrite` |

Always request scopes **incrementally** — only ask for what is needed at the time.

## SharePoint

- Store all team files in **SharePoint document libraries**, not personal OneDrive
- Use **SharePoint Framework (SPFx)** for custom web parts and extensions — avoid legacy add-ins
- Version-control SPFx solutions in Git — build and deploy via CI/CD
- Apply **column-level permissions** sparingly; use separate libraries for highly sensitive content
- Every SharePoint site must have a named owner and at least one backup owner

## Microsoft Teams

- Use **Teams Apps** (tabs, bots, message extensions) to surface tooling inside Teams
- Build Teams apps using **Teams Toolkit** for VS Code
- Bots must respond within 5 seconds or return an intermediate acknowledgment
- Store Teams app manifests in source control

## Power Automate

- Use Power Automate for **low-complexity automations** (approval flows, notification triggers)
- Complex business logic belongs in .NET services, not multi-hundred-step flows
- All production flows must be owned by a service account, not an individual's account
- Export flows to JSON and store in source control
- Apply **DLP (Data Loss Prevention) policies** — no connectors to unapproved external services

## Microsoft Forms & Lists

- Microsoft Forms: suitable for simple surveys and feedback collection
- Microsoft Lists: suitable for lightweight tracking (no database required)
- For anything requiring complex business rules or integrations, use a .NET backend + React frontend

## Licensing Guidance

| Feature | Required Licence |
|---|---|
| Microsoft 365 apps (Word, Excel, Teams) | Microsoft 365 E3/E5 |
| Power Automate (premium connectors) | Power Automate Premium |
| Power Apps (custom apps) | Power Apps Premium |
| Power BI Pro (shared reports) | Power BI Pro or Premium Per User |
| Copilot for Microsoft 365 | Microsoft 365 Copilot add-on |

Contact the Microsoft 365 Admin team before starting work that may require additional licences.
