# The Case for a Software CoE with AI

## Executive Summary

Engineering organisations that lack shared standards and tooling pay a hidden tax on every project, every sprint, and every engineer hire. The Mycoe Software Centre of Excellence with AI eliminates that tax — by providing shared standards, reusable templates, governed AI tooling, and AI agents that automate the most time-consuming parts of the software development lifecycle.

This document makes the case for sustained investment in the CoE.

---

## The Problem

### Engineering Teams Are Doing the Same Work Over and Over

Without shared standards, every new project makes the same foundational decisions from scratch:

- How should we structure the React app?
- How do we wire up Azure AD authentication?
- What naming convention do we use for Azure resources?
- How do we set up CI/CD?
- How should we handle secrets?
- What does "done" mean for this feature?

These questions have good answers. The cost is not in finding those answers once — it is in finding them *repeatedly*, across *every team*, on *every project*. In a 50-engineer organisation, that is thousands of hours per year spent on problems that have already been solved.

### Inconsistency Introduces Risk

When teams solve problems independently, they solve them differently. Some differences are fine. But inconsistency in security patterns, secret handling, authentication flows, and deployment processes introduces risk:

- A team that doesn't run SAST ships vulnerabilities
- A team that doesn't use Key Vault commits secrets to a repository
- A team that doesn't threat-model deploys a service with a fundamental architectural flaw

These are not hypothetical. They are industry statistics. According to IBM's Cost of a Data Breach Report, the average cost of a data breach is **$4.45 million**. Most breaches exploit known, preventable vulnerabilities.

### AI Is Being Used — With or Without Governance

GitHub Copilot, Copilot for Microsoft 365, and generative AI tools are already in use across the organisation. The question is not whether AI is used — it is whether it is used **safely, effectively, and consistently**.

Without governance:
- Engineers accept Copilot suggestions for security-sensitive code without understanding the risk
- Customer PII ends up in prompts
- Different teams use different AI tools with no shared learning
- AI tools are banned reactively after an incident, rather than governed proactively

### SDLC Toil Consumes Disproportionate Engineering Time

Research consistently shows that a significant portion of engineering time is spent on activities that are necessary but do not directly create business value:

| Activity | Estimated Time per Sprint |
|---|---|
| Clarifying and enriching user stories | 3–6 hours per team |
| Writing test scaffolding | 4–8 hours per team |
| Mechanical pull request review (style, patterns, naming) | 2–5 hours per reviewer |
| Deployment coordination and health checks | 1–3 hours per release |

In a 10-engineer team, this is 10–22 hours per sprint — **one to two full engineer-days per sprint** — on work that follows rules that could be automated.

---

## The Opportunity

### AI Has Changed the Economics of Engineering Automation

Until recently, automating SDLC activities required building bespoke tools — expensive, brittle, and rarely worth the investment for anything below a very high scale.

**Large language models have changed this.** An AI agent powered by GPT-4o can read a user story, understand the intent, reason about the codebase, and produce a well-formed acceptance criteria breakdown — work that previously required a senior engineer's time. The same model can review a pull request against a standards document, check for security anti-patterns, and post structured findings.

The tooling to do this at an enterprise level — Semantic Kernel, Azure OpenAI, GitHub Copilot — is available, mature, and within budget.

### The Opportunity Cost of Inaction Is Growing

Every quarter without shared standards is a quarter of compounding inconsistency. Every AI tool used without governance is a quarter of compounding risk. As the engineering organisation grows, the cost of retrofitting standards and untangling inconsistency grows with it.

The best time to establish a CoE was at the start. The second best time is now.

---

## The Solution: Mycoe Software CoE with AI

### Three Layers of Value

```
┌─────────────────────────────────────────────────────────────────┐
│  Layer 3: AI Agents                                             │
│  Automate repeatable SDLC tasks: story enrichment, test        │
│  scaffolding, PR review, deployment gates                       │
├─────────────────────────────────────────────────────────────────┤
│  Layer 2: AI Tooling Governance                                 │
│  GitHub Copilot custom instructions, responsible use guidelines │
│  Copilot for M365, Azure OpenAI, Copilot Studio governance      │
├─────────────────────────────────────────────────────────────────┤
│  Layer 1: Standards & Templates                                 │
│  React, .NET, Azure, Power BI, Microsoft 365, Security         │
│  Written standards + copy-paste templates + training pathways  │
└─────────────────────────────────────────────────────────────────┘
```

Each layer builds on the last. Standards define what good looks like. Copilot governance helps engineers meet those standards more easily. AI agents automate the verification and scaffolding work so standards are upheld without manual overhead.

### What We Are Not Proposing

- A central team that reviews and approves every team's code — **that does not scale**
- A rigid, top-down mandate — **adoption is driven by value, not compliance**
- A replacement for human engineering judgment — **agents assist, humans decide**

---

## The Business Case

### Value Driver 1: Eliminate Setup Tax

**Current state:** A new project takes 2–5 days to set up correctly (repo, CI/CD pipeline, linting, auth, infrastructure baseline).

**With CoE templates:** A new project is set up in under an hour. The template includes a working pipeline, correct authentication wiring, security defaults, and linting configured.

**Value:** 1–4 days saved per new project. Across 10 new projects per year in a 50-person organisation: **40–160 engineer-days per year.**

---

### Value Driver 2: Reduce Security Incident Cost

**Current state:** Security is checked inconsistently. Some teams run SAST; others do not. Secret scanning is not universal. Threat modelling happens on major projects only.

**With CoE security standards:** SDL gates, SAST, secret scanning, and pre-release security checklists are standard on every project.

**Value:** Even one prevented medium-severity security incident justifies the investment. A conservative estimate of the cost of a security incident (investigation, remediation, reputational impact, regulatory exposure) is **£50,000–£500,000**.

---

### Value Driver 3: Faster Onboarding

**Current state:** A new engineer takes 6–12 weeks to become fully productive. Knowledge is largely tribal.

**With CoE training pathways and templates:** A new engineer has a structured learning pathway, a clear standards reference, and can copy a working template on day one.

**Value:** If onboarding is accelerated by 2–4 weeks, and a fully-loaded engineer cost is £500/day, that is **£5,000–£10,000 per engineer hire** saved. For an organisation hiring 10 engineers per year: **£50,000–£100,000 per year.**

---

### Value Driver 4: Reclaim SDLC Toil with AI Agents

**Current state:** Approximately 1–2 engineer-days per sprint per team are spent on story clarification, test scaffolding, mechanical PR review, and deployment coordination.

**With AI agents:** These tasks are automated. Human engineers focus on the decisions that require judgment.

**Value:** Recovering 1 engineer-day per sprint per team, across 5 teams: **5 engineer-days per sprint** = approximately **130 engineer-days per year** = **1 engineer's full year of productive output.**

---

### Value Driver 5: Safe, Effective AI Adoption

**Current state:** AI tools are available but ungoverned. Risk of misuse is increasing as adoption increases.

**With CoE AI governance:** Guidelines, custom instructions, and responsible AI checklists are available to every team. AI tools deliver their productivity benefits within a controlled framework.

**Value:** Avoiding one significant AI-related incident (data breach, IP exposure, regulatory breach): **£100,000–£1,000,000+**.

---

### Value at a Glance

| Value Driver | Estimated Annual Value |
|---|---|
| Eliminate setup tax (10 projects/year) | £40,000–£160,000 |
| Prevent one security incident | £50,000–£500,000 |
| Faster engineer onboarding (10 hires/year) | £50,000–£100,000 |
| Reclaim SDLC toil (5 teams) | £130,000–£200,000 |
| Safe AI adoption (prevent one incident) | £100,000–£1,000,000 |
| **Conservative total** | **£370,000–£1,960,000 per year** |

These are conservative estimates. They do not account for compound effects (consistency making future changes cheaper) or the talent and culture benefits of a high-quality engineering environment.

---

### Investment Required

The CoE requires investment in three areas:

| Investment | Description |
|---|---|
| **Working Group Time** | ~0.5 FTE equivalent across the working group (shared across participants from each guild) |
| **AI Tool Licences** | GitHub Copilot Business: ~£19/user/month. Azure OpenAI: consumption-based. Copilot for M365: licence add-on |
| **Agent Infrastructure** | Azure App Service + Table Storage for agent hosting: low cost, scales to zero |

**The working group is not a new team.** It is engineers from existing teams contributing a fraction of their time, governed as a community of practice.

---

## Risks of Not Investing

| Risk | Likelihood | Impact |
|---|---|---|
| Security incident from inconsistent practices | Medium | High |
| AI tools used ungoverned — data or IP breach | High (as adoption grows) | High |
| Slow onboarding limits growth velocity | High | Medium |
| Compounding inconsistency makes future standardisation expensive | Certain | Medium–High |
| Talent attrition — engineers want modern tooling and clear standards | Medium | Medium |

---

## How We Know It's Working

The CoE measures its own value through leading and lagging indicators:

| Metric | Target |
|---|---|
| New project setup time | < 1 hour (from template) |
| Test coverage baseline across projects | ≥ 80% |
| SAST scan adoption | 100% of production repositories |
| Mean time to productive for new engineers | ≤ 4 weeks |
| Stories with complete AC at sprint start | ≥ 90% |
| PR review cycle time | Trending down (baseline + quarterly measure) |
| Security incidents | Trending down year-on-year |
| AI governance adoption | 100% of AI-enabled projects have custom instructions and responsible AI checklist |

---

## Recommendation

**Invest in the Mycoe Software CoE with AI.** Start with Layer 1 (standards and templates — mostly already in place), move to Layer 2 (governed AI tooling — Copilot in every IDE with custom instructions), and introduce Layer 3 agents in observe mode over a 2-sprint period before enabling act mode.

The standards and templates already exist in this repository. The incremental investment is in adoption, maintenance, and the agent infrastructure.

The risk of not investing is not zero — it is a slow, compounding erosion of quality, consistency, and competitive engineering capability. The opportunity cost of inaction grows every quarter.

---

## Next Steps

| Action | Owner | When |
|---|---|---|
| Endorse the CoE charter and working group model | Engineering Director | This quarter |
| Provision GitHub Copilot licences for all engineers | IT / Platform Engineering | This quarter |
| Run one team through the full agentic AI pipeline in observe mode | Platform Engineering | Next quarter |
| Review and adopt the security SDL gates across all projects | Security Champions Network | Next quarter |
| Publish the first quarterly CoE metrics report | CoE Working Group | End of next quarter |
