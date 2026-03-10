# Agent Playbook — Deployment Orchestration

**Agent ID:** `deployment-agent`
**Version:** 1.0
**Trigger:** PR merged to `main` OR manual dispatch with `targetEnvironment` parameter
**Mode:** `observe` | `act`
**⚠️ Production deployments always require human approval regardless of mode**

---

## Purpose

Orchestrate the complete deployment lifecycle:

1. **Pre-deployment gates** — verify all conditions are safe to deploy
2. **Infrastructure deployment** — apply Bicep changes via Azure CLI
3. **Application deployment** — deploy via Azure DevOps pipeline or GitHub Actions
4. **Post-deployment verification** — smoke test, health checks, telemetry baseline
5. **Rollback decision** — automatically roll back if verification fails

---

## Required Configuration

| Variable | Description |
|---|---|
| `ADO_ORG_URL` | Azure DevOps organisation URL |
| `ADO_PROJECT` | Project name |
| `ADO_PAT` | PAT with build read/write + environment write |
| `AZURE_SUBSCRIPTION_ID` | Target Azure subscription |
| `AZURE_RESOURCE_GROUP_DEV` | Dev resource group name |
| `AZURE_RESOURCE_GROUP_PRD` | Production resource group name |
| `AZURE_SERVICE_CONNECTION` | Azure DevOps service connection name |
| `APP_SERVICE_NAME_DEV` | Dev App Service name |
| `APP_SERVICE_NAME_PRD` | Production App Service name |
| `HEALTH_CHECK_URL_DEV` | Dev health endpoint (e.g., `https://app-myapp-dev-aue.azurewebsites.net/health`) |
| `HEALTH_CHECK_URL_PRD` | Production health endpoint |
| `TEAMS_WEBHOOK_URL` | Teams channel webhook for deployment notifications |
| `AGENT_MODE` | `observe` or `act` |

---

## Inputs

```json
{
  "trigger": "pr_merged | manual",
  "mergedPRNumber": 42,
  "commitSha": "string",
  "changedPaths": ["string"],
  "targetEnvironment": "dev | uat | prd",
  "requestedBy": "string",
  "linkedWorkItemIds": [1234],
  "buildId": "string (ADO build ID)",
  "artifactName": "string"
}
```

---

## Agent Instructions

### Phase 1 — Pre-Deployment Gates

Run all gates **before** touching any infrastructure or application. If any gate fails, abort and post a notification.

#### Gate 1 — Build Artifact Exists

Verify that the CI build for `commitSha` completed successfully and a published artifact (`dotnet-api` or `react-app-dist`) is available.

- **Pass:** Build status is `succeeded` and artifact exists
- **Fail:** Post notification "Deployment aborted — CI build not succeeded for commit `{{commitSha}}`"

#### Gate 2 — Test Coverage Thresholds Met

Read the test coverage report from the CI build artifact.

- **Pass:** Statements ≥ 80%, Branches ≥ 80%, Functions ≥ 80%
- **Fail:** Post notification with specific failing metrics

#### Gate 3 — No Open Critical/High Security Alerts

Check GitHub Advanced Security for Critical or High severity code scanning alerts on the commit.

- **Pass:** Zero Critical or High open alerts
- **Fail:** List each finding and abort — "Deployment blocked by open security alerts"

#### Gate 4 — Change Window (Production Only)

For `prd` deployments, verify the current time falls within the approved change window.

Default window: **Tuesday–Thursday, 10:00–15:00 AEST** (configurable via `CHANGE_WINDOW_CRON`).

- **Pass:** Current time is within the change window, OR the deployment is tagged `[emergency]`
- **Fail:** "Production deployments are only permitted during the change window (Tue–Thu 10:00–15:00 AEST). Tag this deployment `[emergency]` and notify the Engineering Lead if this must proceed."

#### Gate 5 — No Other Deployment In Progress

Check Azure DevOps for other active deployments targeting the same environment.

- **Pass:** No other in-progress deployments to `{{targetEnvironment}}`
- **Fail:** "Another deployment is in progress to `{{targetEnvironment}}`. Wait for it to complete."

#### Gate 6 — Human Approval (Production Only)

For `prd` deployments, this gate is **always manual**. The agent:
1. Posts a deployment summary to the designated Teams channel
2. Creates an Azure DevOps environment approval request
3. Waits up to **2 hours** for approval
4. If no approval received, abandons and posts notification

The approval request must include:
- What is being deployed (PR title + linked work items)
- What changed (summary of changed paths)
- Deployment plan (which Bicep resources will change, from `what-if` output)
- Rollback plan
- Post-deployment verification steps

---

### Phase 2 — Infrastructure Deployment

Only runs if Bicep files were modified in the merged changes.

#### Step 2.1 — Run What-If

```bash
az deployment group what-if \
  --resource-group {{AZURE_RESOURCE_GROUP}} \
  --template-file templates/azure/bicep/main.bicep \
  --parameters @templates/azure/bicep/main.parameters.{{env}}.json
```

Parse the what-if output:
- If any **deletions** of resources are proposed, escalate to a human — resource deletions require explicit approval
- If changes are additions or modifications only, proceed

#### Step 2.2 — Apply Infrastructure

```bash
az deployment group create \
  --resource-group {{AZURE_RESOURCE_GROUP}} \
  --template-file templates/azure/bicep/main.bicep \
  --parameters @templates/azure/bicep/main.parameters.{{env}}.json \
  --name "deploy-{{env}}-{{timestamp}}"
```

- Capture the deployment output (App Service URL, Key Vault URI, etc.)
- If deployment fails, post detailed error and abort — do not proceed to application deployment

---

### Phase 3 — Application Deployment

#### Step 3.1 — Identify Changed Application

Determine which applications changed based on `changedPaths`:

| Paths changed | Application | Pipeline |
|---|---|---|
| `src/**` (React) or `templates/react-app/**` | React frontend | `react-app.yml` |
| `src/**` (C#) or `templates/dotnet-api/**` | .NET API | `dotnet-api.yml` |
| `templates/powerbi/**` | Power BI reports | `powerbi.yml` |

Only deploy applications with changed paths — do not redeploy unchanged applications.

#### Step 3.2 — Trigger Azure DevOps Pipeline

Trigger the relevant pipeline via the ADO REST API:

```
POST https://dev.azure.com/{{org}}/{{project}}/_apis/pipelines/{{pipelineId}}/runs
{
  "stagesToSkip": [],
  "templateParameters": {
    "environment": "{{targetEnvironment}}",
    "commitSha": "{{commitSha}}",
    "buildId": "{{buildId}}"
  }
}
```

Monitor the pipeline run until it reaches a terminal state (`succeeded`, `failed`, `canceled`).
Poll every 30 seconds; time out after 30 minutes.

---

### Phase 4 — Post-Deployment Verification

#### Step 4.1 — Health Check

Poll the health endpoint until it returns `HTTP 200` with status `healthy`:

```
GET {{HEALTH_CHECK_URL}}/health/ready
```

- Retry up to **10 times** with **15-second intervals**
- If health check does not pass within 2.5 minutes → trigger Phase 5 (Rollback)

#### Step 4.2 — Smoke Tests

Run the following lightweight checks:

| Check | Method | Expected |
|---|---|---|
| API root responds | `GET /` | HTTP 200 or 301 |
| Health liveness | `GET /health` | HTTP 200, `{"status":"Healthy"}` |
| Health readiness | `GET /health/ready` | HTTP 200, `{"status":"Healthy"}` |
| Authentication endpoint reachable | `GET /api/examples` | HTTP 401 (unauthenticated — expected) |
| Static assets load (React) | `GET /` (frontend URL) | HTTP 200, `<html` in body |

Any unexpected response → trigger Phase 5 (Rollback).

#### Step 4.3 — Telemetry Baseline

Wait **5 minutes** post-deployment and query Application Insights for:

- **Exception rate** — should not exceed pre-deployment baseline by more than 10%
- **HTTP 5xx rate** — should be < 1% of all requests
- **Average response time** — should not increase by more than 20% vs baseline

If telemetry thresholds are exceeded → post alert and escalate to a human for rollback decision (do not auto-rollback based on telemetry alone).

---

### Phase 5 — Rollback

Triggered automatically if Phase 4 health checks or smoke tests fail.
Triggered manually if Engineering Lead approves a rollback request.

#### Step 5.1 — Identify Previous Good Deployment

Query ADO deployment history to find the last `succeeded` deployment to `{{targetEnvironment}}`.

#### Step 5.2 — Re-deploy Previous Artifact

Re-trigger the Azure DevOps pipeline using the previous build's artifact.

#### Step 5.3 — Re-verify

Run Phase 4 verification against the rolled-back deployment.

If rollback verification also fails → **escalate immediately** to Engineering Lead — do not attempt further automated rollbacks.

#### Step 5.4 — Post-Rollback Notification

Post to Teams and ADO:
- What failed
- What was rolled back to
- Which work items are affected
- Next steps required

---

## Outputs — Deployment Summary

After each run, post a summary to the configured Teams channel:

```markdown
## 🚀 Deployment Summary — {{targetEnvironment}} | {{timestamp}}

**Status:** ✅ SUCCESS | ❌ FAILED | ⚠️ ROLLED BACK

**Deployed:**
- Commit: `{{commitSha[:8]}}`
- PR: #{{pullRequestNumber}} — {{prTitle}}
- Work Items: #1234 — Add login page

**Phases:**
| Phase | Status | Duration |
|---|---|---|
| Pre-deployment gates | ✅ Passed (6/6) | 45s |
| Infrastructure (Bicep) | ✅ No changes | — |
| Application deploy | ✅ Succeeded | 3m 12s |
| Health checks | ✅ Passed | 30s |
| Smoke tests | ✅ All passed | 15s |
| Telemetry baseline | ✅ Within thresholds | 5m |

**App URL:** https://app-myapp-{{env}}-aue.azurewebsites.net

---
*Deployed by the Mycoe Deployment Agent*
```

---

## Escalation Rules

Escalate (Teams notification to Engineering Lead + on-call) if:

- Any gate fails for a production deployment during business hours
- Rollback is triggered
- Rollback verification also fails
- Infrastructure deployment proposes resource **deletions**
- Health checks fail after rollback
- Telemetry thresholds exceeded post-deployment

---

## Audit Log Format

```
[YYYY-MM-DD HH:MM UTC] deployment-agent | PR #42 | Target: prd | Gates: 6/6 passed | Infra: no-change | App: react+dotnet | Health: PASS | Smoke: PASS | Telemetry: PASS | Duration: 12m 34s | Status: SUCCESS
```
