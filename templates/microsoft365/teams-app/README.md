# Teams App — Starter Template

This is a minimal Microsoft Teams app template following Mycoe CoE standards.

## What's Included

- Teams app manifest (`manifest.json`) configured for a personal tab
- Static HTML tab as the simplest starting point (upgrade to React using the SPFx or React templates as needed)
- Placeholder icons (replace before publishing)

## Prerequisites

- [Teams Toolkit for VS Code](https://aka.ms/teams-toolkit) — install this extension before opening the folder
- A Microsoft 365 developer tenant or your organisation's sandbox environment

## Getting Started

1. Open this folder in VS Code
2. Sign in to Teams Toolkit with your Microsoft 365 account
3. Select **Preview in Teams (Edge)** or **Preview in Teams (Chrome)** to sideload the app
4. For local testing, Teams Toolkit handles ngrok tunnelling automatically

## Customisation

1. Replace `manifest.json` → update `id`, `name`, `description`, `developer`, and tab URLs
2. Replace `color.png` (192×192 px) and `outline.png` (32×32 px) with your app icons
3. Add bot, message extension, or connector manifests as needed (see [Teams manifest schema](https://aka.ms/teams-manifest-schema))

## Deploying to Production

```bash
# Package the app
# Teams Toolkit: Provision → Deploy → Publish
```

Or manually:
1. Zip `manifest.json` + `color.png` + `outline.png` into `my-teams-app.zip`
2. Upload to Teams Admin Centre → **Manage apps → Upload** (tenant-wide) or sideload for testing

## Standards Checklist

- [ ] `manifest.json` committed to source control
- [ ] App registered in Azure AD with minimum required Graph scopes
- [ ] Bots respond within 5 seconds (or return an intermediate acknowledgement card)
- [ ] App owned by a service account in production, not an individual
- [ ] DLP policy reviewed — no unapproved external connectors
- [ ] Security Champion sign-off obtained before tenant-wide deployment
