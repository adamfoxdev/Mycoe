# Security Governance Standards

This document defines the security governance framework for all software built within Mycoe.

## Principles

1. **Shift left** — Address security as early as possible in the development lifecycle
2. **Defence in depth** — Multiple security layers; no single point of failure
3. **Least privilege** — Every identity and process gets only the permissions it needs
4. **Zero trust** — Verify explicitly, never trust implicitly, assume breach

---

## Secure Development Lifecycle (SDL)

Every project must pass through the following security gates:

| Phase | Gate | Owner |
|---|---|---|
| **Design** | Threat model completed and reviewed | Lead Engineer + Security Champion |
| **Development** | SAST scan passes (no High/Critical findings unmitigated) | Developer |
| **Pull Request** | Secret scanning enabled; dependency vulnerabilities reviewed | Developer + Reviewer |
| **Pre-release** | Penetration test or DAST scan completed | Security Champion |
| **Production** | Security review sign-off | Engineering Lead |
| **Ongoing** | Quarterly dependency updates; annual pen test | Team |

---

## Threat Modelling

All new services and significant changes must include a threat model. Use the **STRIDE** framework:

| Threat | Description | Example |
|---|---|---|
| **S**poofing | Impersonating a user or system | Forging a JWT token |
| **T**ampering | Modifying data or code | SQL injection, parameter tampering |
| **R**epudiation | Denying an action occurred | Missing audit logs |
| **I**nformation Disclosure | Exposing data to unauthorised parties | API returning PII to wrong user |
| **D**enial of Service | Making a service unavailable | Unthrottled endpoints |
| **E**levation of Privilege | Gaining higher permissions than intended | IDOR, misconfigured RBAC |

A threat model template is provided at `templates/security/threat-model-template.md`.

---

## Secrets Management

- **Never** commit secrets, passwords, connection strings, or API keys to source control
- Use **Azure Key Vault** for all secrets in Azure-hosted workloads
- Use **Managed Identities** to authenticate to Azure services — avoid client secrets where possible
- Rotate secrets on a schedule — Key Vault rotation policies should be configured
- Use **GitHub Advanced Security secret scanning** to detect accidentally committed secrets
- Pre-commit hook configuration is provided in `templates/security/` to catch secrets before they are committed

### Approved Secret Storage

| Environment | Secret Store |
|---|---|
| Local development | `.env.local` (in `.gitignore`), or `dotnet user-secrets` |
| Azure (all environments) | Azure Key Vault |
| Azure DevOps pipelines | Azure DevOps Variable Groups linked to Key Vault |

---

## Static Analysis (SAST)

All repositories must have SAST configured in CI:

| Technology | Tool | Configuration |
|---|---|---|
| TypeScript / JavaScript | ESLint security plugin + GitHub CodeQL | `.github/workflows/codeql.yml` |
| .NET / C# | Roslyn Analysers (built-in) + GitHub CodeQL | Enabled via `Directory.Build.props` |
| Infrastructure (Bicep) | `az bicep build` lint + Checkov | `templates/security/checkov.yml` |

**Blocking thresholds:** No Critical or High findings may be merged to `main` without a documented exception approved by the Engineering Lead.

---

## Dependency Management

- Use **GitHub Dependabot** or **Renovate** for automated dependency update PRs
- Review and merge security updates within **7 days** of notification for Critical/High CVEs
- Keep `.NET` packages on LTS versions; keep `node` packages on LTS Node.js
- Pin versions in production (`package-lock.json`, `.csproj` explicit versions) — do not use floating ranges in production
- Scan with **npm audit** (React) and **dotnet list package --vulnerable** (.NET) in CI

---

## Authentication & Authorisation

- All applications must use **Azure AD (Entra ID)** — no local account stores
- Use **MSAL** libraries (not raw OAuth flows) — see React and .NET standards
- Apply the **principle of least privilege** to API scopes and app roles
- Use **Conditional Access policies** for sensitive applications (MFA required, compliant device)
- Review app registrations and service principal permissions quarterly

### API Security Checklist

- [ ] All endpoints require authentication (`[Authorize]` on controllers)
- [ ] Authorisation is checked, not just authentication (roles/scopes validated)
- [ ] Input is validated (FluentValidation / model binding)
- [ ] Output does not leak internal implementation details (ProblemDetails, not raw exceptions)
- [ ] Rate limiting is applied to public-facing endpoints
- [ ] CORS is configured to allow only known origins

---

## Data Protection

- Classify all data using the organisation's **information classification policy** (Public, Internal, Confidential, Restricted)
- Apply **Microsoft Purview sensitivity labels** to documents and emails
- Do **not** store Restricted data (PII, financial records) in development environments — use anonymised/synthetic test data
- Encrypt data **at rest** (Azure Storage encryption is on by default; enable TDE for SQL)
- Encrypt data **in transit** — TLS 1.2 minimum, enforce HTTPS everywhere
- Implement data **retention and deletion** policies aligned with legal/compliance requirements

---

## Logging & Monitoring

- **Never** log sensitive data: passwords, tokens, PII, credit card numbers
- Log **security-relevant events**: authentication failures, authorisation failures, admin actions, data exports
- Forward all logs to the central **Log Analytics Workspace**
- Configure **Azure Sentinel** (or equivalent SIEM) alerts for:
  - Multiple failed login attempts
  - Privilege escalation events
  - Unusual data access patterns
  - Resource deletion in production

---

## Incident Response

If you discover or suspect a security incident:

1. **Do not** attempt to fix it silently or hide it
2. **Immediately** notify your Engineering Lead and the Security team (security@example.com)
3. Document what you found, when, and how
4. Preserve evidence — do not modify logs or affected resources
5. Follow the organisation's **Incident Response Plan** (link to be inserted by Security team)

---

## Security Champion Programme

Each team should nominate a **Security Champion** who:
- Attends the monthly Security Champion forum
- Owns the threat model for their team's services
- Ensures security gates are met before each release
- Is the first point of contact for security questions within the team
- Completes the Security Champion training pathway (see `docs/training/security.md`)

---

## Compliance

| Requirement | Applicability | Owner |
|---|---|---|
| **ISO 27001** | All teams | Security Team |
| **GDPR / Privacy Act** | Any system handling personal data | Engineering Lead + Legal |
| **PCI DSS** | Systems handling payment card data | Platform Engineering |
| **SOC 2** | Customer-facing SaaS products | Engineering Lead |

Compliance requirements must be considered during the Design phase threat model.
