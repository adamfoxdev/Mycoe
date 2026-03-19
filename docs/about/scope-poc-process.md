# Scope POC Process

## Purpose

A **Proof of Concept (POC)** is a time-boxed, low-stakes investigation to determine whether a new standard, pattern, tool, or approach is worth adopting across the organisation. The CoE uses POCs before committing to full adoption of anything significant.

This document describes how to propose, scope, run, and conclude a POC within the CoE.

---

## When to Run a POC

Not every improvement needs a POC. Use this process when:

| Situation | POC Warranted? |
|---|---|
| Adopting a new tool or framework across multiple teams | Yes |
| Replacing an existing standard that teams rely on | Yes |
| Introducing a new AI capability or agent | Yes |
| Adding a new template or updating an existing one | No — just open a PR |
| Fixing an error in a standard | No — just open a PR |
| Clarifying documentation | No — just open a PR |
| Exploring a pattern that could become a standard | Yes |

The rule of thumb: if getting it wrong would cost significant time to unwind, run a POC first.

---

## POC Lifecycle

```
1. Proposal      →  Idea captured in a GitHub Issue with the `poc` label
                    │
2. Scoping       →  Working group approves scope, timeline, and success criteria
                    │
3. Execution     →  One team runs the POC within an agreed time box
                    │
4. Review        →  POC outputs reviewed by the working group and relevant guild
                    │
5. Decision      →  Adopt / Adapt / Abandon — decision recorded
                    │
6. Action        →  If adopted: standard or template updated, community notified
```

---

## Step 1 — Proposal

Anyone can propose a POC. Open a GitHub Issue with:

- **Title:** `[POC] <short description of what you want to try>`
- **Label:** `poc`
- **Description** covering:
  - What are you trying to learn or validate?
  - What problem does it solve?
  - What is the proposed scope (tool, technology, pattern)?
  - Which team would run it?
  - Is there a time constraint or dependency?

The working group will triage the proposal at the next bi-weekly sync.

---

## Step 2 — Scoping

The working group reviews the proposal and agrees a scope document before any work begins. The scope document is written into the GitHub Issue as a comment and must include:

### Scope Document Template

```
## POC Scope

**Objective:** What specific question does this POC answer?

**Success Criteria:** How will we know if the POC has succeeded?
  - [ ] Criterion 1
  - [ ] Criterion 2
  - [ ] Criterion 3

**Out of Scope:** What are we explicitly NOT trying to prove?

**Time Box:** <start date> → <end date> (maximum 2 sprints)

**Team:** <team name and lead>

**Resources Required:** Licences, environments, time estimate

**Risks:** What could go wrong, and how will we mitigate it?

**Output:** What will be produced at the end?
  - e.g., working prototype, written findings, updated template, recommendation
```

The working group lead adds the `poc-approved` label when the scope is agreed. Work does not start until this label is applied.

### Time Box Guidance

| POC Type | Recommended Time Box |
|---|---|
| New tool evaluation (e.g., a new linter) | 1 sprint |
| New framework or library | 1–2 sprints |
| New AI agent or capability | 2 sprints |
| Replacement of an existing standard | 2 sprints |

If the POC cannot be completed within 2 sprints, it is too large. Break it down.

---

## Step 3 — Execution

The assigned team runs the POC within the agreed time box. During execution:

- **Update the GitHub Issue** with a brief progress note at the end of each sprint
- **Raise blockers immediately** — do not wait until the review to flag problems
- **Document findings as you go** — do not rely on memory at the end
- **Stay within scope** — if the scope needs to change, discuss with the working group first

The POC team does not need to produce production-quality code. The goal is learning, not delivery.

---

## Step 4 — Review

At the end of the time box, the POC team presents findings to the working group and relevant guild. The review is a **30-minute session** covering:

| Agenda Item | Time |
|---|---|
| What we tried to learn, and how | 5 min |
| What we found — demo or walkthrough | 10 min |
| What worked, what did not | 5 min |
| Our recommendation: Adopt / Adapt / Abandon | 5 min |
| Questions and discussion | 5 min |

The POC team publishes a written summary in the GitHub Issue within 2 working days of the review session.

---

## Step 5 — Decision

The working group makes one of three decisions:

| Decision | Meaning | Next Action |
|---|---|---|
| **Adopt** | The POC proved the approach is worth standardising | Owner drafts standard/template update; PR opened within 1 sprint |
| **Adapt** | Promising but needs refinement before adoption | Scope a follow-up POC or targeted change |
| **Abandon** | The approach is not suitable for our context | Issue closed with explanation; findings documented for future reference |

The decision and rationale are recorded in the GitHub Issue. The issue is then closed with the appropriate label (`poc-adopted`, `poc-adapted`, or `poc-abandoned`).

---

## Step 6 — Action

If the decision is **Adopt** or **Adapt**:

1. The owner opens a PR with the resulting standard or template change
2. The PR references the original POC issue
3. The working group reviews and merges the PR
4. The community is notified at the next monthly forum
5. The training pathway is updated if the change affects learning content

If the decision is **Abandon**, the findings are still valuable. The written summary in the GitHub Issue is the organisation's record of "we tried this and here is why we did not proceed" — preventing the same question being asked again in the future.

---

## POC Backlog

The CoE maintains a **POC backlog** — a list of ideas and proposals that have been raised but not yet scoped or scheduled. These are GitHub Issues labelled `poc` without the `poc-approved` label.

The backlog is reviewed at the quarterly feedback retrospective. Items are prioritised by:

1. **Strategic value** — does this unblock a significant problem?
2. **Engineering demand** — how many teams have raised this?
3. **Risk** — what is the cost of getting this wrong if we do not investigate?
4. **Feasibility** — is a team available and willing to run it?

---

## Examples of Good POCs

| Proposal | Objective | Time Box |
|---|---|---|
| Evaluate Vitest vs Jest for React testing | Determine whether to recommend Vitest as the default test runner | 1 sprint |
| Try Semantic Kernel for a new agent capability | Validate that SK can support a new agentic workflow before building it into the standard | 2 sprints |
| Assess a new Bicep module for Azure Container Apps | Determine whether our current ACA Bicep module should be replaced | 1 sprint |
| Explore AI-assisted code review beyond Copilot | Evaluate whether an additional AI code review tool adds value alongside the PR agent | 2 sprints |

---

## Questions?

Raise a GitHub Issue with the `question` label, or bring it to the monthly community forum.
