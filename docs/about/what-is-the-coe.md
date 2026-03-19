# What Is the Mycoe Software Centre of Excellence?

## Our Mission

> **Enable every engineering team to build better software, faster, safely — by sharing standards, patterns, and AI-augmented tooling that remove friction and multiply capability.**

The Mycoe Software Centre of Excellence (CoE) is the organisation's shared engineering platform. It is not a gate, a committee, or a bureaucracy. It is a living system of standards, reusable assets, and AI tooling that teams adopt because doing so makes their lives easier and their software better.

---

## The Problem We Exist to Solve

Without a shared foundation, engineering organisations default to chaos by accident:

| Symptom | Root Cause |
|---|---|
| Every new project starts from scratch | No reusable, approved starting points |
| Security issues slip through | No consistent gates or tooling |
| New engineers take months to become productive | Knowledge is tribal, not written down |
| Different teams solve the same problem differently | No shared standards to reference |
| AI tools used inconsistently — or dangerously | No governance or guidelines |
| Time spent on toil (boilerplate, config, pipeline setup) | No automation |

Each of these is a tax on every team, every sprint, every quarter. The CoE exists to eliminate that tax.

---

## What Is a Software CoE?

A **Software Centre of Excellence** is an organisational function that owns shared engineering practices across multiple teams. Rather than every team independently deciding how to structure a React app, wire up Azure, handle secrets, or use AI tools, the CoE:

1. **Decides once** — researches best practices, evaluates options, agrees on a standard
2. **Documents clearly** — writes it down in a way teams can reference and follow
3. **Templates it** — provides working, copy-paste-ready starting points
4. **Keeps it current** — updates standards as technology and threats evolve
5. **Trains teams** — ensures engineers have clear learning pathways to reach those standards

This is not about restricting engineers. It is about giving them a fast, safe lane.

---

## What Makes This CoE Different: AI at the Core

Most CoEs focus on documentation and occasional workshops. The Mycoe CoE goes further — **AI is woven into every layer**.

### GitHub Copilot as Standard Tooling

Every engineer has access to GitHub Copilot. Rather than leaving individuals to figure it out, the CoE provides:

- **Per-project custom instructions** so Copilot understands your stack, conventions, and patterns
- A **curated prompt library** so engineers get great results without trial and error
- **Responsible use guidelines** so the productivity gains don't introduce risk

### Copilot for Microsoft 365 Across the Business

The CoE governs how Copilot for M365 is used in Teams, Outlook, Word, and Excel — ensuring data handling, sensitivity labels, and responsible use are consistent.

### Agentic AI That Automates SDLC Toil

The most ambitious layer: **AI agents** that work autonomously within the software development lifecycle:

```
New work item created in Azure DevOps
        │
        ▼
  User Story Agent   ← enriches stories with tasks, acceptance criteria, estimates
        │
        ▼
  Test Generation Agent  ← scaffolds unit, integration, and E2E tests
        │
        ▼
  Pull Request Agent  ← reviews code, verifies acceptance criteria, flags issues
        │
        ▼
  Deployment Agent    ← runs gates, deploys, verifies health, rolls back if needed
```

These agents do not replace engineers. They handle the repeatable, rules-based work so engineers can focus on the things that require human judgment: design, architecture, complex problem solving, and collaboration.

---

## Our Scope

The CoE covers the full stack used across Mycoe engineering:

| Area | What We Own |
|---|---|
| **React / Frontend** | TypeScript app template, folder structure, ESLint, testing patterns |
| **.NET / Backend** | Web API template, Clean Architecture, coding standards, NuGet governance |
| **Azure & DevOps** | Bicep modules, YAML pipelines, RBAC patterns, naming conventions |
| **Microsoft 365** | SharePoint, Teams apps, Graph API usage, Power Automate governance |
| **Power BI** | Report naming, DAX standards, row-level security, deployment pipelines |
| **Security** | SDL gates, threat modelling, SAST, secrets management, incident response |
| **Copilot & AI** | GitHub Copilot, Copilot for M365, Copilot Studio, Azure OpenAI governance |
| **Agentic AI** | Agent playbooks, Semantic Kernel patterns, governance and safety framework |
| **Python** | Coding standards, type checking, Ruff + mypy, pytest patterns, Azure Functions |

---

## How the CoE Works

### We Are a Guild, Not a Gate

Contribution flows from the engineering community, not down from a central authority. Any engineer can propose a new standard or improvement. The CoE working group reviews, refines, and publishes.

```
Engineer identifies a pattern that works well
        │
        ▼
Raises a GitHub Issue or Pull Request
        │
        ▼
CoE Working Group reviews with the relevant guild
        │
        ▼
Standard is adopted, documented, and templated
        │
        ▼
Training pathway updated — community is notified
```

For details on how the working group is structured, how meetings are run, and how to get involved, see **[docs/about/community-of-practice.md](community-of-practice.md)**.

### Iterative Improvement

The CoE does not stand still. Feedback from teams is continuously collected, triaged, and acted on. Every engineer can raise an issue, propose a change, or flag a gap. See **[docs/about/iterative-feedback-plan.md](iterative-feedback-plan.md)** for how the feedback loop works.

### Proving New Ideas First

Before committing to a new standard or adopting a new tool across all teams, the CoE runs time-boxed proofs of concept. See **[docs/about/scope-poc-process.md](scope-poc-process.md)** for the full process.

### Three Layers of Value

| Layer | What It Is | How to Use It |
|---|---|---|
| **Standards** | Agreed-upon decisions for how we build software | Read before starting a new project or feature |
| **Templates** | Working, copy-paste starting points | Copy the relevant template to bootstrap a new project |
| **Training** | Structured learning pathways per technology area | Work through the tiers relevant to your role |

### Everything Is in Git

All standards, templates, and guidelines live in this repository. They are version-controlled, pull-request-reviewed, and owned by the community. If a standard is out of date or wrong, raise a PR.

---

## Who Is Involved

| Role | Responsibility |
|---|---|
| **CoE Working Group** | Sets direction, reviews contributions, maintains quality |
| **Platform Engineering** | Owns Azure, DevOps, and Agentic AI areas |
| **Frontend Guild** | Owns React and Microsoft 365 frontend standards |
| **Backend Guild** | Owns .NET and API standards |
| **Data & Analytics Guild** | Owns Power BI standards |
| **Security Champions Network** | Owns security standards and SDL gates |
| **All Engineers** | Follow standards, contribute improvements, raise issues |

---

## Getting Started

If you are new to the CoE:

1. Read **[docs/about/benefits.md](benefits.md)** to understand what the CoE gives you
2. Read **[docs/getting-started.md](../getting-started.md)** to get set up
3. Find your technology area in **[docs/standards/](../standards/)** and read the relevant standard
4. Copy the appropriate **[template](../../templates/)** to your new project
5. Work through the **[training pathway](../training/)** for your primary technology

If you are evaluating the CoE or considering investment, read **[docs/about/business-case.md](business-case.md)** first.
