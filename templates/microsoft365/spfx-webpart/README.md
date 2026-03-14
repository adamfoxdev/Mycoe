# SPFx Web Part — Starter Template

This is a minimal SharePoint Framework (SPFx) web part template following Mycoe CoE standards.

## What's Included

- TypeScript web part with React rendering
- Microsoft Graph integration via `@microsoft/sp-http`
- Fluent UI v8 components (native to SPFx)
- Property pane configuration example
- Unit test scaffold

## Setup

```bash
npm install
gulp serve
```

To serve against a live SharePoint workbench:

```bash
# Set the initial page to your SharePoint URL in serve.json
gulp serve --config serve.json
```

## Deployment

```bash
# Build production bundle
gulp bundle --ship

# Package the solution
gulp package-solution --ship

# Upload the .sppkg from sharepoint/solution/ to your App Catalogue
```

## Standards Checklist

- [ ] Azure AD used for identity — `MSGraphClientV3` obtained via `this.context.msGraphClientFactory`
- [ ] Minimum required Graph scopes declared in `config/package-solution.json`
- [ ] No secrets hardcoded — use tenant properties or SharePoint list configuration
- [ ] Component named using PascalCase, files named using camelCase
- [ ] Localisation strings defined in `loc/` folder
- [ ] Unit tests in `__tests__/` with at least Foundation coverage
- [ ] `README.md` updated before deploying to production
