# Agentic AI Templates — Overview

This folder contains **agent playbooks** — structured markdown templates that define how an AI agent should autonomously process and act on each stage of the software development lifecycle at Mycoe.

## What Is an Agent Playbook?

An agent playbook is a markdown document that:

1. Defines the agent's **purpose and scope**
2. Specifies the **inputs** the agent expects (from Azure DevOps, GitHub, etc.)
3. Contains the **reasoning instructions** the agent must follow step-by-step
4. Defines the **outputs** and **actions** the agent must produce
5. Specifies **escalation rules** — when the agent must stop and ask a human

These playbooks are designed to be loaded as system prompts or referenced as instruction files by AI agents built on **GitHub Copilot**, **Copilot Studio**, **Azure OpenAI** (with function calling), or **Semantic Kernel**.

## The Mycoe Agent Pipeline

```
Azure DevOps Work Item Created / Updated
            │
            ▼
  ┌─────────────────────┐
  │  User Story Agent   │  ← agents/user-story.md
  │  (story → tasks,    │
  │   AC, estimates)    │
  └──────────┬──────────┘
             │  Triggers
             ▼
  ┌─────────────────────┐
  │  Test Generation    │  ← agents/test-generation.md
  │  Agent              │
  │  (stories → test    │
  │   scaffolds)        │
  └──────────┬──────────┘
             │  Developer implements feature
             ▼
  ┌─────────────────────┐
  │  Pull Request Agent │  ← agents/pull-request.md
  │  (code review,      │
  │   compliance, AC    │
  │   verification)     │
  └──────────┬──────────┘
             │  PR approved + merged
             ▼
  ┌─────────────────────┐
  │  Deployment Agent   │  ← agents/deployment.md
  │  (gates, deploy,    │
  │   verify, rollback) │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │  Pipeline           │  ← agents/pipeline-orchestrator.md
  │  Orchestrator       │
  │  (coordinates all   │
  │   agents above)     │
  └─────────────────────┘
```

## Agent Inventory

| Agent | File | Trigger | Primary Actions |
|---|---|---|---|
| User Story | `agents/user-story.md` | ADO work item created/updated | Generate tasks, AC, estimates, DoD |
| Test Generation | `agents/test-generation.md` | Story refined / branch created | Scaffold unit, integration, E2E tests |
| Pull Request | `agents/pull-request.md` | PR opened/updated | Review code, verify AC, post comments |
| Deployment | `agents/deployment.md` | PR merged to main | Gate checks, deploy, verify, rollback |
| Orchestrator | `agents/pipeline-orchestrator.md` | Any of the above | Coordinate the full pipeline |

## Implementation Options

These playbooks are tool-agnostic. They can be implemented with:

| Platform | How to Use |
|---|---|
| **GitHub Copilot Extensions** | Load playbook as system context in a custom Copilot extension |
| **Copilot Studio** | Use as topic instructions with Azure OpenAI knowledge source |
| **Azure OpenAI + Semantic Kernel** | Load as `IChatCompletionService` system prompt; use SK plugins for ADO/GitHub API calls |
| **Azure DevOps Extensions** | Reference in a custom Azure DevOps agent pipeline task |
| **GitHub Actions** | Reference in a `workflow_dispatch` or event-triggered action with AI step |

## Shared Conventions

All agents follow these rules:

- **Never make irreversible production changes without a human approval gate**
- **Always explain reasoning** before taking an action
- **Always output a structured summary** at the end of each run
- **Escalate immediately** if confidence is below the defined threshold
- **Log all actions** to the designated audit channel (Azure DevOps comment / PR comment / Teams notification)

## JSON Schemas

Input/output schemas for each agent are in `schemas/` to support structured function calling with Azure OpenAI.

## Getting Started

1. Choose the agents relevant to your team
2. Deploy the orchestrator using your preferred platform (see Implementation Options above)
3. Configure the ADO webhook / GitHub webhook to trigger the orchestrator
4. Set the required environment variables (see each agent file for its required config)
5. Run in **observe mode** first — agent posts comments and recommendations but takes no automated actions
6. Graduate to **act mode** once the team is comfortable with agent quality
