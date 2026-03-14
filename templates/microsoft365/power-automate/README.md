# Power Automate — Approval Flow Template

This folder contains a reference approval flow that can be imported into Power Automate as a starting point.

## Flows Included

| File | Description |
|---|---|
| `approval-flow.json` | Generic multi-stage approval flow — request → approver → requester notification |

## How to Import

1. In Power Automate, go to **My Flows → Import → Import Package (Legacy)**
2. Upload `approval-flow.json`
3. Configure the connection references (SharePoint, Outlook, Teams) to use the **service account**
4. Update the following parameters in the flow before enabling:
   - `ApproverEmail` — replace `approver@example.com` with your approver's address or a distribution list
   - `SharePointSiteUrl` — replace `https://contoso.sharepoint.com/sites/approvals` with your site URL
   - `SharePointListName` — replace `Approval Requests` with the name of your SharePoint list
5. Test with a non-production list before enabling in production

## Standards Checklist

- [ ] Flow owned by a **service account** (not an individual's account)
- [ ] Flow exported to JSON and committed to source control
- [ ] DLP (Data Loss Prevention) policy applied — no unapproved external connectors
- [ ] Error handling included — all actions have "Configure run after" set for failure paths
- [ ] Flow description and display name are meaningful (not "Copy of Flow 1")
- [ ] Sensitive data (passwords, tokens) not stored in flow variables — use Key Vault or named credentials

## Conventions

Follow the standards in [docs/standards/microsoft365.md](../../../docs/standards/microsoft365.md):

- Complex logic belongs in **.NET services** — keep flows simple (approval routing, notifications)
- Use **batch requests** in HTTP actions where multiple Graph calls are needed
- Honour Graph `Retry-After` headers — add a Delay action after throttling responses
