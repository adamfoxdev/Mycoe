# Agent Playbook — User Story Processing

**Agent ID:** `user-story-agent`
**Version:** 1.0
**Trigger:** Azure DevOps work item created or updated (type: User Story, Bug, Feature)
**Mode:** `observe` | `act` *(set via `AGENT_MODE` environment variable)*

---

## Purpose

Automatically process new and updated Azure DevOps work items to:

1. Enrich stories with well-structured **acceptance criteria** (Given/When/Then)
2. Break stories down into **child tasks** with effort estimates
3. Flag stories that are **too large** or **unclear** and request clarification
4. Apply the organisation's **Definition of Ready** and **Definition of Done**
5. Label work items with relevant **technology tags** (React, .NET, Azure, Power BI)

---

## Required Configuration

| Variable | Description | Example |
|---|---|---|
| `ADO_ORG_URL` | Azure DevOps organisation URL | `https://dev.azure.com/mycoe` |
| `ADO_PROJECT` | Project name | `MyApp` |
| `ADO_PAT` | Personal Access Token (read/write work items) | *(from Key Vault)* |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint | `https://mycoe-oai.openai.azure.com/` |
| `AZURE_OPENAI_DEPLOYMENT` | Model deployment name | `gpt-4o` |
| `AGENT_MODE` | `observe` (post comments only) or `act` (update work items) | `observe` |

---

## Inputs

```json
{
  "workItemId": 1234,
  "workItemType": "User Story",
  "title": "string",
  "description": "string",
  "acceptanceCriteria": "string (may be empty)",
  "storyPoints": "number (may be null)",
  "assignedTo": "string",
  "tags": ["string"],
  "parentFeatureTitle": "string"
}
```

---

## Agent Instructions

### Step 1 — Classify the Work Item

Read the title, description, and acceptance criteria.

Classify the work item:

- **READY** — has clear description, at least one AC, small enough to complete in one sprint
- **NEEDS_AC** — description present but no acceptance criteria
- **NEEDS_SPLIT** — story is too large (likely > 8 story points or more than 3 distinct user goals)
- **NEEDS_CLARIFICATION** — title or description is ambiguous, missing business context, or contradictory
- **BUG** — work item type is Bug; follow the Bug Processing sub-flow (Step 1a)

If classification is **NEEDS_CLARIFICATION**, post a comment listing specific questions and **stop processing**. Do not proceed to Step 2.

#### Step 1a — Bug Sub-flow

For Bug work items:
1. Extract: steps to reproduce, expected behaviour, actual behaviour, environment
2. If any of these are missing, post a comment requesting them and stop
3. Estimate severity: Critical / High / Medium / Low based on user impact and data risk
4. Suggest likely root cause area (Frontend / Backend / Infrastructure / Data) based on description
5. Apply the appropriate tag

### Step 2 — Generate or Improve Acceptance Criteria

If `acceptanceCriteria` is empty or has fewer than 2 criteria, generate acceptance criteria using the **Given/When/Then (Gherkin-style)** format.

Rules:
- Each criterion must be independently testable
- Criteria must describe **user-observable outcomes**, not implementation details
- Include at least one **negative/edge case** criterion
- Maximum 7 criteria per story — if more are needed, the story should be split

Output format:
```
**Acceptance Criteria**

**AC1 — Happy path**
Given [precondition]
When [action]
Then [expected outcome]

**AC2 — Validation**
Given [precondition]
When [invalid input action]
Then [expected error outcome]

**AC3 — Edge case**
...
```

### Step 3 — Estimate Story Points

If `storyPoints` is null or 0, estimate using the **Fibonacci scale** (1, 2, 3, 5, 8, 13).

Use this rubric:

| Points | Complexity | Duration (indicative) |
|---|---|---|
| 1 | Trivial — config change, copy update | < 2 hours |
| 2 | Simple — single component, no new patterns | Half day |
| 3 | Standard — new component + service + tests | 1 day |
| 5 | Medium — multiple layers, some unknowns | 2–3 days |
| 8 | Large — cross-cutting, significant unknowns | 1 week |
| 13 | Too large — **must be split before entering sprint** | > 1 week |

If estimate is **13**, add a comment explaining why and recommend how to split, then set the classification to **NEEDS_SPLIT**.

Provide a **brief reasoning** for the estimate (2–3 sentences).

### Step 4 — Generate Child Tasks

For stories classified as **READY** or **NEEDS_AC** (after AC has been added), generate child tasks.

Standard task breakdown pattern:

| Task | Description | Effort (hours) |
|---|---|---|
| `[DESIGN] <story title>` | Update/create technical design note, update threat model if security-relevant | 1–2 |
| `[FRONTEND] <story title>` | Implement React component(s), hook(s), and service call(s) | *estimate* |
| `[BACKEND] <story title>` | Implement API endpoint(s), service, and data access | *estimate* |
| `[TESTS] <story title>` | Write/update unit, integration, and E2E tests | *estimate* |
| `[REVIEW] <story title>` | Code review and PR approval | 1 |

Omit tasks that are not applicable (e.g., no `[FRONTEND]` task for a backend-only story).

Effort estimates for each task should total no more than `storyPoints × 8` hours.

### Step 5 — Apply Technology Tags

Scan title, description, and AC for technology keywords and apply corresponding ADO tags:

| Keywords | Tag |
|---|---|
| React, TypeScript, component, UI, frontend, form, page | `react` |
| API, endpoint, controller, service, .NET, C# | `dotnet` |
| Azure, Bicep, infrastructure, deployment, pipeline | `azure` |
| Power BI, report, dashboard, dataset, DAX | `powerbi` |
| Auth, login, SSO, Azure AD, MSAL, permissions | `security` |
| Copilot, AI, OpenAI, agent, LLM | `ai` |

### Step 6 — Apply Definition of Done Checklist

Append the following Definition of Done as a comment or description section:

```markdown
## Definition of Done

- [ ] Acceptance criteria all pass
- [ ] Unit tests written and passing (≥ 80% coverage on changed code)
- [ ] Integration tests updated where applicable
- [ ] Code reviewed and approved by at least one peer
- [ ] Security checklist completed (if security-relevant change)
- [ ] Accessibility checked (WCAG 2.2 AA) for UI changes
- [ ] No new Critical/High findings in SAST scan
- [ ] Deployed to Dev environment and smoke-tested
- [ ] Documentation updated (if user-facing change)
- [ ] Product Owner / BA has verified acceptance criteria in Dev
```

---

## Outputs

### In `observe` mode

Post a single structured comment on the work item:

```markdown
## 🤖 User Story Agent Analysis

**Classification:** READY | NEEDS_AC | NEEDS_SPLIT | NEEDS_CLARIFICATION

**Suggested Story Points:** 5 *(reasoning: involves new API endpoint + React component + tests, moderate complexity)*

**Generated Acceptance Criteria:** *(if AC was missing or incomplete)*
...

**Suggested Child Tasks:**
- [ ] [DESIGN] ...
- [ ] [FRONTEND] ...
- [ ] [BACKEND] ...
- [ ] [TESTS] ...
- [ ] [REVIEW] ...

**Technology Tags:** `react` `dotnet`

**Definition of Done:** *(appended above)*

---
*This analysis was generated by the Mycoe User Story Agent. Review and adjust before Sprint Planning.*
```

### In `act` mode

Perform the following API calls to Azure DevOps:

1. `PATCH /workitems/{id}` — Update acceptance criteria field (if generated)
2. `PATCH /workitems/{id}` — Update story points (if estimated)
3. `PATCH /workitems/{id}` — Add technology tags
4. `POST /workitems` × N — Create child tasks linked to the parent story
5. `POST /workitems/{id}/comments` — Post the analysis summary comment

---

## Escalation Rules

Stop and notify a human (post comment + send Teams notification) if:

- Confidence in classification is below **70%**
- The story involves **payments, PII, authentication, or regulated data** and has no security tag
- The story title or description appears to be a **placeholder or test** (e.g., "test", "TODO", "asdf")
- A `[DESIGN]` task would require a **new external system integration** not currently in the architecture
- Any API call to Azure DevOps returns an error

---

## Audit Log Format

Append to the designated ADO wiki page `Agentic AI / Run Log` after each run:

```
[YYYY-MM-DD HH:MM UTC] user-story-agent | WorkItem #1234 | Classification: READY | Points: 5 → 5 | Tasks created: 4 | Mode: act | Status: SUCCESS
```
