# Agentic AI Standards

This document defines standards for building and operating AI agents within the Mycoe engineering platform.

## What Is an Agentic AI System?

An **agentic AI system** is one where an AI model autonomously plans and executes multi-step tasks — calling tools, reading data, making decisions, and taking actions — without requiring a human to approve every step.

At Mycoe, agentic AI is used to automate repetitive, rule-based tasks in the software development lifecycle (SDLC), such as enriching work items, generating test scaffolds, reviewing pull requests, and orchestrating deployments.

---

## Core Principles

| Principle | Description |
|---|---|
| **Human in the loop for irreversible actions** | Agents may never deploy to Production, delete resources, or close work items without a human approval gate |
| **Observe before act** | All new agents must run in `observe` mode (recommendations only) for at least 2 sprints before being granted `act` mode |
| **Explain reasoning** | Every agent action must include a human-readable explanation of why it was taken |
| **Fail safe** | On any error or low-confidence decision, agents escalate to a human — they do not guess |
| **Least privilege** | Agent service principals are scoped to the minimum required permissions for their task |
| **Auditability** | Every agent action is logged to the audit trail with timestamp, agent ID, entity, and outcome |

---

## Agent Modes

| Mode | Description | When to Use |
|---|---|---|
| `observe` | Agent posts recommendations as comments but takes no automated actions | Always start here |
| `act` | Agent performs automated actions (update work items, commit files, trigger pipelines) | After 2-sprint observe period with Engineering Lead sign-off |

Switching an agent from `observe` to `act` requires:
- [ ] Engineering Lead sign-off
- [ ] Security Champion review of agent permissions
- [ ] At least 20 successful observe-mode runs reviewed by the team
- [ ] Rollback plan documented

---

## Agent Architecture

Mycoe agents are built using **Semantic Kernel** (.NET) with **Azure OpenAI** (GPT-4o deployment).

### Layers

```
┌──────────────────────────────────────────┐
│          Agent Playbook (Markdown)        │  ← System prompt / instruction file
├──────────────────────────────────────────┤
│          Semantic Kernel Planner          │  ← Orchestrates tool calls
├──────────────────────────────────────────┤
│              SK Plugins                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │  ADO     │ │  GitHub  │ │  Azure   │ │  ← API integrations as SK functions
│  │  Plugin  │ │  Plugin  │ │  Plugin  │ │
│  └──────────┘ └──────────┘ └──────────┘ │
├──────────────────────────────────────────┤
│          Azure OpenAI (GPT-4o)            │  ← LLM reasoning
└──────────────────────────────────────────┘
```

### Required Semantic Kernel Plugins

| Plugin | Responsibilities |
|---|---|
| `AdoPlugin` | Read/write work items, create tasks, post comments, trigger pipelines |
| `GitHubPlugin` | Read PR diffs, post PR comments, commit files, manage branches |
| `AzurePlugin` | Run Bicep what-if, trigger deployments, query App Insights, check health endpoints |
| `TeamsPlugin` | Send Teams channel notifications and adaptive cards |
| `StatePlugin` | Read/write lifecycle state from Azure Table Storage |

---

## Permissions (Least Privilege)

Each agent's service principal must be scoped to **only what it needs**:

| Agent | ADO Permissions | GitHub Permissions | Azure Permissions |
|---|---|---|---|
| user-story-agent | Work Items: Read/Write | — | — |
| test-generation-agent | Work Items: Read; Code: Read/Write | Contents: Read/Write | — |
| pull-request-agent | Work Items: Read | Pull Requests: Read; Issues: Write (comments) | — |
| deployment-agent | Build: Read/Write; Environments: Write | Actions: Read | Contributor on resource group |
| pipeline-orchestrator | All of the above (delegated) | All of the above (delegated) | Reader + delegated deployment |

Use **Managed Identities** where possible. Use service principals with client certificates (not secrets) where Managed Identity is not available.

---

## Model Selection

| Use Case | Recommended Model | Reason |
|---|---|---|
| Story enrichment, AC generation | `gpt-4o` | Requires strong reasoning and structured output |
| Code review, security analysis | `gpt-4o` | Requires code understanding |
| Test scaffold generation | `gpt-4o` | Requires code generation |
| Deployment gate evaluation | `gpt-4o-mini` | Deterministic rule evaluation; lower cost |
| Teams notifications (templated) | No LLM needed | Use template strings |

Always use the model from your organisation's **Azure OpenAI** deployment — never the public OpenAI API.

---

## Structured Outputs

All agents must return structured JSON matching the schemas in `templates/agentic-ai/schemas/`.

Use Azure OpenAI's **structured outputs** feature (JSON mode / response format) to enforce schema compliance.

```csharp
// Semantic Kernel — enforce JSON output matching a schema
var settings = new OpenAIPromptExecutionSettings
{
    ResponseFormat = typeof(UserStoryAgentOutput) // Enforces structured output
};
```

---

## Content Safety

All Azure OpenAI deployments used by agents **must** have content filtering enabled.

Agents must not:
- Send customer PII to the model unless a Data Processing Agreement is in place
- Send production secrets, credentials, or tokens in prompts
- Use the model to make final decisions on security incidents, legal matters, or financial transactions

If a prompt would require sending sensitive data, the agent must redact or anonymise before sending.

---

## Observability

Every agent run must produce:

1. **Structured log entry** in Azure Log Analytics (agent ID, entity, action, status, duration)
2. **ADO comment** on the relevant work item or PR summarising the run
3. **Teams notification** for escalations and failures
4. **State Store update** in Azure Table Storage

Use Application Insights custom events to track agent performance:

| Metric | Description |
|---|---|
| `agent.run.duration` | Time taken per agent run |
| `agent.ac.coverage` | Fraction of ACs covered per story |
| `agent.security.findings` | Count of security findings by severity |
| `agent.deployment.success_rate` | Deployment success rate over time |
| `agent.escalation.rate` | How often agents escalate to humans |

---

## Governance

### Before Deploying a New Agent

- [ ] Playbook reviewed by Engineering Lead and Security Champion
- [ ] Permissions reviewed and scoped to least privilege
- [ ] Agent runs in `observe` mode for 2 sprints minimum
- [ ] Rollback/disable procedure documented
- [ ] Monitoring and alerting configured

### Ongoing

- Monthly review of agent accuracy (are recommendations correct and useful?)
- Quarterly review of model performance and costs
- Immediate review if an agent takes an unexpected or harmful action

### Disabling an Agent

To disable an agent immediately:
1. Set `AGENT_MODE=disabled` in the Azure DevOps Variable Group
2. Revoke the agent service principal's permissions in Entra ID
3. Post a notification to the team

---

## Anti-Patterns

| Anti-Pattern | Why It's Dangerous |
|---|---|
| Agent auto-approves PRs | Bypasses human code review — security and quality risk |
| Agent auto-merges to `main` | Could deploy untested or insecure code |
| Agent deletes Azure resources | Irreversible; could cause downtime |
| Agent sends raw code diffs to the model without sanitisation | May expose secrets or PII present in the diff |
| Agent uses floating model versions (e.g., `gpt-4-turbo-latest`) | Model behaviour can change unexpectedly between deployments |
| Agent swallows errors silently | Missed failures lead to incorrect state and silent data corruption |
