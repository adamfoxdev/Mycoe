# Agent Playbook — Pipeline Orchestrator

**Agent ID:** `pipeline-orchestrator`
**Version:** 1.0
**Trigger:** Any Azure DevOps or GitHub webhook event, or scheduled health sweep
**Mode:** `observe` | `act`

---

## Purpose

The Pipeline Orchestrator is the master coordination layer. It:

1. **Receives all webhook events** from Azure DevOps and GitHub
2. **Routes events** to the correct specialist agent
3. **Tracks the full lifecycle** of a work item from story → code → tests → review → deployment
4. **Manages agent handoffs** — each agent notifies the orchestrator when it completes
5. **Maintains a lifecycle state machine** per work item
6. **Provides a unified audit trail** and status dashboard
7. **Escalates cross-cutting issues** that individual agents cannot handle alone

---

## Required Configuration

| Variable | Description |
|---|---|
| `ADO_ORG_URL` | Azure DevOps organisation URL |
| `ADO_PROJECT` | Project name |
| `ADO_PAT` | PAT with full work item, code, build, release permissions |
| `GITHUB_TOKEN` | Token with repo read/write, PR read/write |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint |
| `AZURE_OPENAI_DEPLOYMENT` | Model deployment name (`gpt-4o`) |
| `TEAMS_WEBHOOK_URL` | Teams channel for orchestrator notifications |
| `AGENT_MODE` | `observe` or `act` |
| `STATE_STORE_URL` | Azure Table Storage URL for persisting lifecycle state |
| `STATE_STORE_TABLE` | Table name (e.g., `AgentLifecycleState`) |

---

## Work Item Lifecycle State Machine

```
                        ┌────────────────────────────────┐
                        │         LIFECYCLE STATES         │
                        └────────────────────────────────┘

  NEW ──► STORY_ENRICHED ──► TESTS_SCAFFOLDED ──► IN_DEVELOPMENT
                                                        │
                                     ┌──────────────────┘
                                     ▼
                              PR_OPEN ──► PR_REVIEWED ──► PR_APPROVED
                                                               │
                                              ┌────────────────┘
                                              ▼
                                       DEPLOYING_DEV ──► DEV_VERIFIED
                                                               │
                                              ┌────────────────┘
                                              ▼
                                       DEPLOYING_PRD ──► DONE
                                              │
                                       ROLLED_BACK ──► BLOCKED
```

Any state can also transition to `BLOCKED` (human intervention required) or `FAILED`.

---

## Event Routing Table

| Source | Event | Routed To | Expected Outcome |
|---|---|---|---|
| Azure DevOps | Work item created (User Story / Bug) | `user-story-agent` | Story enriched, tasks created |
| Azure DevOps | Work item moved to "In Progress" | `test-generation-agent` | Test scaffolds committed to feature branch |
| GitHub | PR opened | `pull-request-agent` | Review comment posted |
| GitHub | PR synchronise (new commits) | `pull-request-agent` | Updated review comment posted |
| GitHub | PR merged to `main` | `deployment-agent` (dev) | Deploy to Dev, post summary |
| Azure DevOps | Environment approval granted (uat/prd) | `deployment-agent` (uat/prd) | Deploy to UAT/Production |
| Azure DevOps | Build failed | Orchestrator (notify only) | Post failure notification to Teams + ADO |
| Azure DevOps | Work item moved to "Done" | Orchestrator (verify only) | Verify lifecycle state is `DONE` or `DEV_VERIFIED` |
| Schedule (hourly) | Health sweep | Orchestrator | Scan for stale/blocked items |

---

## Agent Instructions

### On Receiving an Event

```
1. Parse the webhook payload
2. Extract the entity ID (work item ID, PR number, build ID)
3. Load current lifecycle state from State Store
4. Determine the correct action using the Event Routing Table above
5. Invoke the specialist agent (pass context as JSON — see schemas/)
6. Wait for specialist agent completion (async with callback or polling)
7. Update lifecycle state in State Store
8. Post orchestrator summary to the entity (ADO comment or PR comment)
9. Write audit log entry
10. If handoff to next agent is needed, invoke it
```

### Automatic Agent Chaining

The orchestrator automatically chains agents where the workflow demands it:

```
user-story-agent completes (STORY_ENRICHED)
    └──► If story has feature branch → invoke test-generation-agent immediately
         Else → wait for ADO "In Progress" event

test-generation-agent completes (TESTS_SCAFFOLDED)
    └──► Post a notification to the developer: "Test scaffolds are ready on your branch."
         Orchestrator waits for PR_OPEN event.

pull-request-agent completes (PR_REVIEWED)
    └──► Update lifecycle state. No automatic next step — human must approve PR.

PR merged (PR_APPROVED → DEPLOYING_DEV)
    └──► Invoke deployment-agent targeting Dev.

deployment-agent completes for Dev (DEV_VERIFIED)
    └──► Move ADO work items linked to the PR to "Ready for UAT"
         Notify the Product Owner / BA via Teams: "Feature #{{id}} is ready for UAT verification."
         Wait for UAT sign-off and UAT deployment approval.

UAT deployment approval granted
    └──► Invoke deployment-agent targeting Production.

deployment-agent completes for Prd (DONE)
    └──► Close all linked ADO work items (set state to "Done")
         Post release summary to Teams
```

### Stale Item Detection (Hourly Sweep)

Every hour, scan the State Store for items that have been in the same state for too long:

| State | Stale Threshold | Action |
|---|---|---|
| `NEW` | > 24 hours | Post reminder: "This story has not been enriched yet." |
| `STORY_ENRICHED` | > 48 hours | Post reminder: "No branch created yet for this story." |
| `TESTS_SCAFFOLDED` | > 5 business days | Post reminder: "Test scaffolds were created 5+ days ago. Is this story still in progress?" |
| `PR_OPEN` | > 3 business days | Post reminder to PR: "This PR has been open for 3+ days. Is it blocked?" |
| `PR_REVIEWED` | > 2 business days | Post reminder: "PR has been reviewed but not approved. Please action the review." |
| `DEV_VERIFIED` | > 5 business days | Post reminder: "Feature ready for UAT for 5+ days. Please schedule UAT testing." |
| `DEPLOYING_*` | > 45 minutes | Escalate — deployment taking too long |
| `BLOCKED` | > 1 business day | Escalate to Engineering Lead |

### Cross-Agent Conflict Detection

Before invoking any agent, check for conflicts:

- **Concurrent deployments:** If `DEPLOYING_DEV` or `DEPLOYING_PRD` is active for another item in the same environment, queue the new deployment rather than running it in parallel
- **Overlapping PRs:** If two PRs are open for the same ADO story, post a warning
- **Story split without tasks:** If a story was marked `NEEDS_SPLIT` but tasks have not been created after 48 hours, re-trigger `user-story-agent`

---

## Orchestrator Dashboard Comment

After each agent completes, update a **pinned comment** on the ADO work item with the current lifecycle status:

```markdown
## 🤖 Mycoe Agent Pipeline — Work Item #{{workItemId}}

**Current State:** DEV_VERIFIED 🟢

| Stage | Status | Agent | Completed |
|---|---|---|---|
| Story Enriched | ✅ | user-story-agent | 2025-03-10 09:14 |
| Tests Scaffolded | ✅ | test-generation-agent | 2025-03-10 09:18 |
| PR Review | ✅ | pull-request-agent | 2025-03-10 14:32 |
| Deploy to Dev | ✅ | deployment-agent | 2025-03-10 15:01 |
| UAT Verification | 🔄 Awaiting PO sign-off | — | — |
| Deploy to Production | ⏳ Pending | — | — |

**Next action:** Product Owner to verify acceptance criteria in Dev, then approve UAT deployment.

---
*Managed by the Mycoe Pipeline Orchestrator*
```

---

## Teams Notification Templates

### Deployment Ready for UAT

```
🚀 Feature ready for UAT
Story: #{{workItemId}} — {{title}}
Dev URL: {{devUrl}}
Linked PR: #{{prNumber}}

Please verify the acceptance criteria in the Dev environment and approve the UAT deployment in Azure DevOps.
```

### Deployment to Production Succeeded

```
✅ Production deployment complete
Story: #{{workItemId}} — {{title}}
Deployed by: {{requestedBy}}
Production URL: {{prdUrl}}
Duration: {{duration}}
```

### Blocked / Needs Attention

```
⚠️ Agent pipeline blocked
Story: #{{workItemId}} — {{title}}
Stage: {{currentState}}
Reason: {{reason}}
Action required by: {{escalateTo}}
```

---

## State Store Schema

Stored in Azure Table Storage. Partition key: `project`, Row key: `workItemId`.

```json
{
  "partitionKey": "MyApp",
  "rowKey": "1234",
  "lifecycleState": "DEV_VERIFIED",
  "linkedPRNumber": 42,
  "linkedBranch": "feature/1234-user-login",
  "lastAgentRun": "pull-request-agent",
  "lastUpdated": "2025-03-10T15:01:00Z",
  "staleCheckAt": "2025-03-15T15:01:00Z",
  "deploymentHistory": [
    {
      "environment": "dev",
      "status": "succeeded",
      "timestamp": "2025-03-10T15:01:00Z",
      "commitSha": "abc123"
    }
  ],
  "agentRunLog": [
    { "agent": "user-story-agent", "status": "SUCCESS", "timestamp": "2025-03-10T09:14:00Z" },
    { "agent": "test-generation-agent", "status": "SUCCESS", "timestamp": "2025-03-10T09:18:00Z" },
    { "agent": "pull-request-agent", "status": "REVIEW_POSTED", "timestamp": "2025-03-10T14:32:00Z" },
    { "agent": "deployment-agent", "status": "SUCCESS", "timestamp": "2025-03-10T15:01:00Z" }
  ]
}
```

---

## Escalation Rules

Escalate to Engineering Lead (Teams + email) if:

- Any specialist agent returns `ERROR` status (not a handled workflow failure)
- The same work item has been `BLOCKED` for > 1 business day
- A production deployment fails and rollback also fails
- The State Store becomes unavailable
- More than 3 consecutive agent runs fail within 1 hour (possible misconfiguration)

---

## Audit Log Format

```
[YYYY-MM-DD HH:MM UTC] pipeline-orchestrator | Event: pr_merged | PR #42 | WorkItems: [1234] | Action: invoke deployment-agent (dev) | State: PR_APPROVED → DEPLOYING_DEV | Status: ROUTED
```
