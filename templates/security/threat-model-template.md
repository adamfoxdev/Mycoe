# Threat Model — [Feature / Service Name]

**Version:** 1.0
**Date:** YYYY-MM-DD
**Authors:** [Name(s)]
**Reviewer:** [Security Champion name]
**Status:** Draft | Reviewed | Approved

---

## 1. Overview

Briefly describe the feature or service being threat modelled.

> Example: "This document covers the threat model for the User Authentication service, which handles login, token issuance, and session management for the MyApp React frontend and .NET API."

## 2. Scope

What is in scope and out of scope for this threat model.

| In Scope | Out of Scope |
|---|---|
| *(e.g., Login flow, token refresh)* | *(e.g., Azure AD internal implementation)* |

## 3. Architecture Diagram

Include a data flow diagram (DFD) showing:
- **External entities** (users, external systems)
- **Processes** (application components)
- **Data stores** (databases, caches, Key Vault)
- **Data flows** (arrows between components with protocol/data type)
- **Trust boundaries** (dashed boxes around zones of different trust)

```
[User Browser] ──HTTPS──► [React App] ──HTTPS──► [.NET API] ──TCP──► [Azure SQL]
                                │                      │
                              MSAL                  Managed
                           (Azure AD)               Identity
                                                       │
                                                  [Key Vault]
```

*(Replace with a real diagram — tools: draw.io, Mermaid, Microsoft Threat Modeling Tool)*

## 4. Assets to Protect

List the valuable assets this feature handles.

| Asset | Classification | Notes |
|---|---|---|
| User credentials | Restricted | Never stored — delegated to Azure AD |
| JWT access tokens | Confidential | Short-lived; stored in sessionStorage only |
| User PII (name, email) | Confidential | Read from Graph API |
| Application secrets | Restricted | Stored in Key Vault only |

## 5. STRIDE Threat Analysis

For each component or data flow in scope, analyse threats using STRIDE.

### 5.1 [Component / Data Flow Name]

#### Spoofing

| Threat | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|
| *(e.g., Attacker forges a JWT token)* | Low | High | Validate JWT signature with Azure AD JWKS endpoint | ✅ Mitigated |

#### Tampering

| Threat | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|
| *(e.g., Attacker modifies request parameters to access another user's data)* | Medium | High | Server-side authorisation checks on all data access | ✅ Mitigated |

#### Repudiation

| Threat | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|
| *(e.g., User denies performing an action)* | Medium | Medium | Audit log all write operations with user identity and timestamp | ⚠️ In Progress |

#### Information Disclosure

| Threat | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|
| *(e.g., API returns stack traces with internal details)* | High | Medium | Global exception handler returns ProblemDetails only | ✅ Mitigated |

#### Denial of Service

| Threat | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|
| *(e.g., Unauthenticated endpoint flooded with requests)* | Medium | High | Rate limiting middleware on all endpoints | ⚠️ In Progress |

#### Elevation of Privilege

| Threat | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|
| *(e.g., Standard user accesses admin endpoint)* | Low | Critical | Role-based authorisation (`[Authorize(Roles = "Admin")]`) | ✅ Mitigated |

---

## 6. Risk Register

Summary of all identified threats ranked by risk.

| ID | Threat | Likelihood | Impact | Risk Score | Owner | Due Date | Status |
|---|---|---|---|---|---|---|---|
| T-001 | *(e.g., IDOR on /api/users/{id})* | Medium | High | High | Dev Team | YYYY-MM-DD | Open |
| T-002 | *(...)* | | | | | | |

**Risk Scoring:** Likelihood × Impact (Low=1, Medium=2, High=3, Critical=4)

## 7. Out-of-Scope Threats & Assumptions

List threats that were identified but explicitly excluded, and why.

| Threat | Reason Excluded |
|---|---|
| *(e.g., Physical access to Azure data centres)* | Managed by Microsoft; outside our control |

## 8. Review Sign-Off

| Role | Name | Date | Signature |
|---|---|---|---|
| Author | | | |
| Security Champion | | | |
| Engineering Lead | | | |
