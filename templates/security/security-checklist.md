# Pre-Release Security Checklist

Use this checklist before every production release. The Engineering Lead must sign off that all items are addressed.

**Project:** _______________
**Release Version:** _______________
**Date:** _______________
**Engineering Lead:** _______________
**Security Champion:** _______________

---

## Authentication & Authorisation

- [ ] All endpoints require authentication — no unauthenticated routes without explicit justification
- [ ] Authorisation is enforced (roles, scopes) on all sensitive endpoints
- [ ] Azure AD / Entra ID used for all identity — no local user stores
- [ ] Token validation is performed server-side (not trusting client-supplied identity)
- [ ] Refresh token rotation is enabled in MSAL config

## Secrets & Configuration

- [ ] No secrets, API keys, or connection strings are hardcoded in source code
- [ ] No secrets in `appsettings.json`, `package.json`, or any committed file
- [ ] All secrets stored in Azure Key Vault
- [ ] CI/CD pipeline secrets stored in Azure DevOps Variable Groups linked to Key Vault
- [ ] Secret scanning is enabled on the repository (GitHub Advanced Security)
- [ ] No `.env` files with real values are committed

## Input Validation & Output Encoding

- [ ] All user input is validated server-side (FluentValidation / model binding)
- [ ] SQL queries use parameterised queries or EF Core — no string concatenation
- [ ] API responses do not return internal error details (ProblemDetails used)
- [ ] File uploads (if applicable) are type-checked and size-limited
- [ ] All rendered user-generated content is properly encoded (XSS prevention)

## Transport Security

- [ ] HTTPS is enforced — HTTP redirected to HTTPS
- [ ] TLS 1.2 minimum (`minTlsVersion: '1.2'` in Bicep, `UseHttpsRedirection()` in .NET)
- [ ] FTPS disabled on App Service
- [ ] HSTS headers are set

## Dependency Security

- [ ] `npm audit` run — no Critical or High vulnerabilities without documented exception
- [ ] `dotnet list package --vulnerable` run — no Critical or High vulnerabilities without documented exception
- [ ] Dependabot or Renovate is configured on the repository

## Static Analysis (SAST)

- [ ] GitHub CodeQL scan passed — no Critical or High findings without documented exception
- [ ] ESLint security plugin checks pass (frontend)
- [ ] .NET Roslyn Analysers with `TreatWarningsAsErrors` — build passes

## Infrastructure Security

- [ ] Bicep templates reviewed — `allowBlobPublicAccess: false`, `minimumTlsVersion: 'TLS1_2'`
- [ ] Key Vault has `enableSoftDelete: true` and `enablePurgeProtection: true`
- [ ] Storage Account has `allowBlobPublicAccess: false`
- [ ] App Service has `httpsOnly: true` and `ftpsState: 'Disabled'`
- [ ] Network Security Groups reviewed (if applicable)
- [ ] Private Endpoints configured for PaaS services (UAT and Production)
- [ ] Microsoft Defender for Cloud enabled on the subscription

## Logging & Monitoring

- [ ] Security-relevant events are logged (auth failures, authorisation failures, admin actions)
- [ ] No sensitive data logged (passwords, tokens, PII)
- [ ] Logs forwarded to central Log Analytics Workspace
- [ ] Alerts configured for unusual error rates and authentication failures
- [ ] Application Insights connected

## Data Protection

- [ ] Personal data (PII) not present in development or UAT environments (synthetic data used)
- [ ] Data classification applied to all data stores
- [ ] Sensitivity labels applied to all documents (if applicable)
- [ ] Data retention policy defined and implemented

## Threat Model

- [ ] Threat model completed and reviewed for this feature/service
- [ ] All High and Critical risks mitigated or formally accepted

---

## Sign-Off

| Role | Name | Date |
|---|---|---|
| Engineering Lead | | |
| Security Champion | | |

**Notes / Exceptions:**

*(Document any items marked ❌ with justification and owner)*
