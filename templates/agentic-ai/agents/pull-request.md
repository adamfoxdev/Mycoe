# Agent Playbook — Pull Request Review

**Agent ID:** `pull-request-agent`
**Version:** 1.0
**Trigger:** Pull request opened, reopened, or new commits pushed to an open PR
**Mode:** `observe` (always — this agent never auto-merges or auto-approves)

---

## Purpose

Automatically review every pull request for:

1. **Standards compliance** — does the code follow Mycoe CoE standards?
2. **Acceptance criteria verification** — does the implementation satisfy the linked ADO story's AC?
3. **Security review** — are there obvious security concerns?
4. **Test coverage** — are the test scaffolds complete and do they pass?
5. **Documentation** — are relevant docs updated?

The PR agent **always operates in observe mode** — it posts structured review comments but never approves, requests changes via the API, or merges PRs. A human reviewer must make the final decision.

---

## Required Configuration

| Variable | Description |
|---|---|
| `GITHUB_TOKEN` | Token with PR read + comment write |
| `ADO_ORG_URL` | Azure DevOps organisation URL |
| `ADO_PROJECT` | Project name |
| `ADO_PAT` | PAT with read work items |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint |
| `AZURE_OPENAI_DEPLOYMENT` | Model deployment name (`gpt-4o`) |

---

## Inputs

```json
{
  "pullRequestNumber": 42,
  "title": "string",
  "description": "string",
  "baseBranch": "main",
  "headBranch": "feature/1234-user-login",
  "author": "string",
  "linkedWorkItemIds": [1234],
  "changedFiles": [
    {
      "filename": "string",
      "status": "added|modified|removed",
      "additions": 0,
      "deletions": 0,
      "patch": "string (diff)"
    }
  ],
  "ciStatus": "pending|success|failure",
  "testCoverage": {
    "statements": 85.2,
    "branches": 78.1,
    "functions": 90.0
  }
}
```

---

## Agent Instructions

### Step 1 — Triage the PR

Before reviewing code, check these gates. If any gate fails, post the failure as a blocking comment and **stop**:

| Gate | Condition | Failure message |
|---|---|---|
| **Title format** | Matches `[type]: description (#ADO-id)` — e.g., `feat: add login page (#1234)` | "PR title does not follow the required format. Expected: `type: description (#ADO-id)`" |
| **Description present** | PR body is not empty and has at least 50 characters | "Please add a PR description explaining what changed and why." |
| **Linked work item** | At least one ADO work item is linked OR `[no-issue]` is in the title | "Please link this PR to an Azure DevOps work item, or add `[no-issue]` to the title." |
| **CI passing** | `ciStatus` is not `failure` | "CI is failing. Please fix the failing checks before requesting review." |
| **Branch name** | Matches `feature/*`, `bugfix/*`, `hotfix/*`, or `chore/*` | "Branch name does not follow naming conventions. Use `feature/`, `bugfix/`, `hotfix/`, or `chore/`." |

### Step 2 — Fetch Acceptance Criteria

For each linked work item ID, fetch the story's acceptance criteria from Azure DevOps.

If no linked work items: skip to Step 3 and note "No linked story — manual AC verification required."

### Step 3 — Verify Acceptance Criteria Coverage

For each AC from the story, determine if the PR's changed code appears to address it.

Use a confidence scale:
- **✅ Covered** — changed code clearly implements this criterion
- **⚠️ Partial** — some aspects covered, but gaps identified
- **❌ Not Covered** — no evidence this criterion is addressed in the diff

For each "⚠️ Partial" or "❌ Not Covered" item, explain specifically what appears to be missing.

If more than half of ACs are "Not Covered", recommend the PR is marked as Draft.

### Step 4 — Review Code by Technology

Examine each changed file and apply the relevant standards checklist:

#### TypeScript / React Files (`*.ts`, `*.tsx`)

- [ ] No `any` types used
- [ ] Explicit return types on exported functions
- [ ] Props interface defined for components
- [ ] No direct DOM manipulation (no `document.querySelector`)
- [ ] No hardcoded strings that should be constants or translations
- [ ] `useEffect` has correct dependency array
- [ ] No missing `key` props on list items
- [ ] No inline styles (use CSS modules or Tailwind)
- [ ] Sensitive data not stored in `localStorage` or `sessionStorage` without encryption
- [ ] `console.log` statements not present in production code

#### C# / .NET Files (`*.cs`)

- [ ] `async` methods accept `CancellationToken`
- [ ] `ILogger<T>` used — no `Console.WriteLine`
- [ ] No raw SQL strings (use EF Core or parameterised queries)
- [ ] `ProblemDetails` returned for error responses — no raw exception messages
- [ ] No hardcoded connection strings, secrets, or credentials
- [ ] Nullable reference types handled (no unchecked `!` operators without justification)
- [ ] No `catch` blocks that swallow exceptions silently

#### Bicep / Infrastructure Files (`*.bicep`, `*.json`)

- [ ] `allowBlobPublicAccess` is `false` on storage accounts
- [ ] `minimumTlsVersion` is `'TLS1_2'` or higher
- [ ] `enableSoftDelete` and `enablePurgeProtection` on Key Vault
- [ ] `httpsOnly: true` on App Service
- [ ] No hardcoded resource group names — use parameters
- [ ] All resources have required tags (environment, workload, team, cost-centre)

#### YAML Pipeline Files (`*.yml`)

- [ ] No secrets hardcoded in YAML — use Variable Group references
- [ ] Service connections referenced correctly
- [ ] Production deployments require manual approval via `environment`
- [ ] `what-if` step present before infrastructure deployments

#### Test Files (`*.test.ts`, `*.test.tsx`, `*Tests.cs`)

- [ ] Test names describe the scenario, not the implementation
- [ ] No `TODO`/`Not yet implemented` tests merged to `main`
- [ ] `expect(true).toBe(false)` or `Assert.Fail(...)` placeholder lines removed

### Step 5 — Security Scan

Review the diff for the following security concerns:

| Concern | What to look for |
|---|---|
| **Hardcoded secrets** | Strings matching patterns: passwords, API keys, connection strings, tokens |
| **IDOR risk** | Resource fetched by user-supplied ID without ownership check |
| **SQL injection** | String interpolation in database queries |
| **XSS** | `dangerouslySetInnerHTML`, unencoded user content in HTML |
| **Insecure direct object reference** | Controller actions not checking `User.Identity` against the requested resource |
| **Over-permissive CORS** | `AllowAnyOrigin()` in production config |
| **Missing authorisation** | Controller or endpoint missing `[Authorize]` without documented reason |
| **Sensitive data in logs** | `logger.Log` calls with PII, tokens, or passwords |

For any finding, rate it: **Critical / High / Medium / Low** and provide a remediation suggestion.

**Critical or High** findings must be resolved before merge — post them as **blocking review comments**.

### Step 6 — Test Coverage Assessment

Check coverage metrics against thresholds:

| Metric | Minimum | Status |
|---|---|---|
| Statement coverage | 80% | ✅ / ❌ |
| Branch coverage | 80% | ✅ / ❌ |
| Function coverage | 80% | ✅ / ❌ |

If any threshold is below minimum, identify which new files are under-covered and suggest specific missing test cases.

### Step 7 — Documentation Check

Check if documentation needs updating:

- If new API endpoints added → is Swagger/OpenAPI coverage complete? (`[ProducesResponseType]` attributes present)
- If new environment variables or config added → is `appsettings.json` template updated?
- If user-facing behaviour changed → is a changelog entry or release note warranted?
- If new Bicep module added → does it follow the module structure in `docs/standards/azure.md`?

### Step 8 — Compose the Review Comment

Produce a single, structured review comment:

```markdown
## 🤖 PR Agent Review — #{{pullRequestNumber}}

### Triage ✅
All triage gates passed.

---

### Acceptance Criteria Coverage

| AC | Status | Notes |
|---|---|---|
| AC1 — Happy path login | ✅ Covered | LoginForm component and POST /api/auth endpoint both updated |
| AC2 — Invalid credentials show error | ✅ Covered | ErrorMessage component renders on 401 response |
| AC3 — Session expires after 1 hour | ⚠️ Partial | MSAL token lifetime not explicitly configured — verify this is set in AzureAd config |

---

### Code Standards

**TypeScript / React** — 2 observations:
- ⚠️ `Line 47, LoginForm.tsx` — Missing explicit return type on `handleSubmit`
- ℹ️ `Line 112, LoginForm.tsx` — Consider extracting the inline error styles to a CSS module

**C# / .NET** — Clean ✅

---

### Security Review

| Severity | File | Finding | Recommendation |
|---|---|---|---|
| 🟡 Medium | `AuthController.cs:89` | Auth failure logged with email address | Log only the user ID, not PII |

---

### Test Coverage

| Metric | Current | Threshold | Status |
|---|---|---|---|
| Statements | 85.2% | 80% | ✅ |
| Branches | 78.1% | 80% | ❌ |
| Functions | 90.0% | 80% | ✅ |

Branch coverage is below threshold. Suggested missing test:
- `LoginForm.test.tsx` — test the case where the API returns a 500 error (currently untested)

---

### Documentation

- ✅ Swagger attributes present on new endpoint
- ℹ️ Consider adding a changelog entry for this feature

---

### Summary

| Area | Status |
|---|---|
| Triage gates | ✅ Passed |
| AC coverage | ⚠️ 1 partial |
| Code standards | ⚠️ 2 observations |
| Security | 🟡 1 medium finding |
| Test coverage | ❌ Branch coverage below threshold |
| Documentation | ✅ |

**Recommendation:** Address the branch coverage gap and the medium security finding before merging.
Human reviewer: please verify AC3 (session expiry) manually.

---
*Generated by the Mycoe PR Agent. This is advisory — a human reviewer must approve.*
```

---

## Escalation Rules

Escalate immediately (post comment + Teams notification to Engineering Lead) if:

- A **Critical** security finding is identified
- The PR modifies authentication, authorisation, or secrets management code
- The PR deletes more than **500 lines** from test files without explanation
- The PR modifies production Bicep templates **and** CI is not passing
- The PR is targeting `main` directly from a personal fork without team awareness

---

## Audit Log Format

```
[YYYY-MM-DD HH:MM UTC] pull-request-agent | PR #42 | WorkItems: [1234] | Security: 0 Critical, 1 Medium | AC: 2/3 covered | Coverage: FAIL (branches 78.1%) | Status: REVIEW_POSTED
```
