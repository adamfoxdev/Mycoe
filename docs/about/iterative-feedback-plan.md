# Iterative Feedback Plan

## Purpose

Standards and templates that are not used — or that do not reflect how teams actually work — deliver no value. The iterative feedback plan ensures the CoE continuously learns from the engineering community and improves.

This document describes how feedback is collected, processed, prioritised, and acted on so that the CoE remains useful, current, and trusted.

---

## Principles

- **Feedback is a gift** — anyone raising an issue is investing their time to improve something for everyone
- **Close the loop** — every piece of feedback receives a response, even if the response is "not now, because..."
- **Prefer small and frequent over large and infrequent** — small improvements merged regularly beat a big standards overhaul every year
- **Measure what matters** — feedback leads to action; action leads to measurable improvement

---

## Feedback Channels

| Channel | When to Use | Response SLA |
|---|---|---|
| **GitHub Issue** | Gaps, errors, improvement proposals, questions | Acknowledged within 3 working days |
| **GitHub Pull Request** | Ready-to-merge fixes or enhancements | First review within 5 working days |
| **Monthly Forum open floor** | Discussion, ideas not yet fully formed | Discussed in the session; owner assigned if actionable |
| **Guild representative** | Informal feedback, sensitive concerns | Representative raises it at the next working group sync |
| **Retrospective actions** | Team-level problems with the CoE standards or tooling | Captured and triaged at the next working group sync |

All formal feedback flows through GitHub Issues so it is tracked and visible to the whole community.

---

## Feedback Lifecycle

```
Feedback received (any channel)
        │
        ▼
Captured as a GitHub Issue (if not already)
        │
        ▼
Triaged at bi-weekly working group sync
        │  ├── Critical fix → assigned immediately, target: current sprint
        │  ├── Standard update → assigned to guild rep, target: next sprint
        │  └── Enhancement / new capability → added to CoE backlog
        ▼
Owner drafts the change
        │
        ▼
Pull request opened → reviewed by working group
        │
        ▼
Merged and communicated to the community
        │
        ▼
Feedback originator notified (GitHub thread auto-closes)
```

---

## Triage Categories

When an issue is triaged, it is assigned one of four labels:

| Label | Meaning | Target Resolution |
|---|---|---|
| `critical` | A standard is incorrect, misleading, or causing active harm | Current sprint |
| `update` | A standard or template needs updating — correct but stale | Next sprint |
| `enhancement` | A new capability, new standard, or new template | Backlog — prioritised by value |
| `question` | Clarification needed — answered async or at the forum | 3 working days |

---

## Review Cadence

Feedback is not only reactive. The CoP proactively reviews its own artefacts on a regular cadence:

| Review | Cadence | Scope |
|---|---|---|
| **Standards staleness check** | Quarterly | Flag any standard not reviewed in > 3 months |
| **Template health check** | Quarterly | Run each template; verify it builds, tests pass, dependencies are current |
| **Training pathway review** | Bi-annually | Verify links, resources, and learning content are current |
| **Metrics review** | Quarterly | Assess CoP health metrics and feedback trends |
| **Annual retrospective** | Annually | Deep review of what is working, what is not, what to change |

These are scheduled in the engineering calendar and owned by the working group lead.

---

## Quarterly Feedback Retrospective

At the end of each quarter, the working group runs a **30-minute feedback retrospective**:

| Agenda Item | Time |
|---|---|
| Review feedback volume and resolution rate from the quarter | 5 min |
| What themes emerged — are the same issues being raised repeatedly? | 10 min |
| What was resolved well? What took too long? | 10 min |
| Actions for the next quarter | 5 min |

Outputs are published as a brief note in `docs/about/meeting-notes/`.

---

## Metrics

The following metrics are tracked and reported quarterly:

| Metric | Target |
|---|---|
| Issues acknowledged within SLA | 100% |
| Issues resolved within target for their category | ≥ 90% |
| Open issues older than 2 sprints with no owner | 0 |
| Standards not reviewed in the last quarter | 0 |
| Forum attendees who raise at least one issue per quarter | ≥ 20% |

If a metric falls below target, it is reviewed at the quarterly retrospective and a corrective action is agreed.

---

## Acting on Patterns

Individual pieces of feedback are valuable. Patterns across feedback are more valuable. If the same theme appears three or more times across different teams or quarters, the working group treats it as a signal of a systemic gap and responds accordingly:

| Pattern | Response |
|---|---|
| Multiple teams struggling with the same standard | Schedule a forum deep-dive; consider rewriting the standard |
| Recurring confusion about the same template | Add inline comments or a companion FAQ |
| Standards not being followed despite being known | Investigate root cause — is it adoption, tooling, or the standard itself? |
| Feedback that feedback is not being acted on | Meta-issue: review the feedback process itself |

---

## Closing the Loop

Every contributor deserves to know what happened to their feedback. The working group commits to:

1. **Acknowledge** every GitHub Issue within 3 working days with a triage label and a brief comment
2. **Update** the issue when an owner is assigned
3. **Notify** the originator when the change is merged (GitHub will close and notify automatically for linked PRs)
4. **Reference** the original issue in the PR description so the connection is traceable

Unactioned issues are not silently closed. If a proposal is not going to be taken forward, the reason is explained in the issue before it is closed.
