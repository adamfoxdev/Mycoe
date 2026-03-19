# Community of Practice

## What Is a Community of Practice?

A **Community of Practice (CoP)** is a group of people who share a concern, a set of problems, or a passion for a topic, and who deepen their knowledge and expertise by interacting on an ongoing basis.

The Mycoe Software CoE operates as a community of practice rather than a top-down governance committee. Standards emerge from the engineers who do the work, not from a central authority. The CoP is the mechanism through which that happens.

---

## Purpose

The CoP exists to:

1. **Share knowledge** across guild and team boundaries — patterns that work in one team become available to all
2. **Maintain standards** — keeping them current as technology, threats, and practices evolve
3. **Grow capability** — structured learning pathways, paired with community discussion, raise the collective bar
4. **Govern AI tooling** — ensuring AI tools are adopted safely, effectively, and consistently
5. **Drive the feedback loop** — surfacing what is and is not working so the CoE can improve

---

## Structure

The CoP is deliberately lightweight. It is not a committee that reviews and approves every team's decisions. It is a community that owns shared assets and keeps them useful.

### Working Group

The **CoE Working Group** is the standing group responsible for the CoP. It is cross-functional, drawing one or two representatives from each guild.

| Role | Responsibility |
|---|---|
| **Working Group Lead** | Facilitates the forum, maintains the CoP rhythm, escalates blockers |
| **Guild Representatives** | Bring guild feedback to the forum, take decisions back to their teams |
| **Platform Engineering Rep** | Owns Azure, DevOps, and Agentic AI areas within the CoP |
| **Security Champions Rep** | Owns security standards and SDL gates within the CoP |
| **All Engineers** | Participate in forums, raise issues, contribute improvements |

The working group is not a full-time function. Each representative contributes a fraction of their time — typically **half a day per sprint** — to CoP activities.

### Guilds

The CoP is connected to each technology guild. Guilds own the standards for their area and surface improvements through their working group representative.

| Guild | Technology Area |
|---|---|
| Frontend Guild | React, Microsoft 365 frontend |
| Backend Guild | .NET, Python, API standards |
| Data & Analytics Guild | Power BI, Data & SQL |
| Platform Engineering | Azure, DevOps, Agentic AI |
| Security Champions Network | Security, SDL gates |

---

## How We Meet

### Monthly Community Forum

A **monthly all-hands forum** (60 minutes) open to all engineers:

| Agenda Item | Time |
|---|---|
| What's new — recently merged standards or templates | 10 min |
| Deep-dive on one topic (rotating guild ownership) | 20 min |
| Open floor — questions, ideas, proposals | 15 min |
| Upcoming work and how to contribute | 10 min |
| Close | 5 min |

The forum is recorded and notes are published in this repository.

### Bi-Weekly Working Group Sync

A **bi-weekly 30-minute working group sync** for in-flight work:

- Review open pull requests and issues
- Triage incoming feedback
- Assign owners to new work items
- Unblock anything stuck

### Async by Default

Most CoP work happens asynchronously through GitHub:

- Issues for proposals, questions, and feedback
- Pull requests for standards changes and new templates
- Discussions for broader topics that benefit from threaded conversation

---

## How to Participate

### As an Engineer

- **Use the standards and templates** — they only improve if people use them and surface what does not work
- **Raise an issue** when you find a gap, an error, or an improvement opportunity
- **Open a pull request** if you have a fix or enhancement ready
- **Attend the monthly forum** — bring questions and ideas
- **Join your guild's working group representative** — ask them to raise your feedback at the forum

### As a Working Group Representative

- Attend the bi-weekly working group sync
- Triage issues and pull requests for your technology area
- Facilitate your guild's participation in the monthly forum deep-dive (on rotation)
- Maintain the training pathway for your area
- Communicate changes and decisions back to your guild

### Contribution Process

```
Engineer identifies an improvement
        │
        ▼
Raises a GitHub Issue describing the change
        │
        ▼
Working group triages and assigns an owner
        │
        ▼
Owner drafts the change in a branch / PR
        │
        ▼
Working group reviews with the relevant guild
        │
        ▼
PR merged — standard adopted and communicated
        │
        ▼
Training pathway updated if needed
```

---

## Decision Making

The CoP uses a **consensus-with-escalation** model:

1. **Lazy consensus** — if a PR is open for five working days with no objections, it is assumed approved
2. **Discussion** — if there are comments or disagreements, the working group discusses at the next sync
3. **Vote** — if consensus cannot be reached, the working group representative from the affected guild has the casting vote
4. **Escalation** — architectural or cross-cutting decisions that cannot be resolved within the working group are escalated to the Engineering Director

This keeps the process fast for the majority of changes while providing a clear path for contentious ones.

---

## What We Produce

The CoP maintains and improves the following artefacts:

| Artefact | Location | Update Cadence |
|---|---|---|
| Technology standards | `docs/standards/` | As needed, reviewed quarterly |
| Templates | `templates/` | As needed, reviewed quarterly |
| Training pathways | `docs/training/` | As needed, reviewed bi-annually |
| About and governance docs | `docs/about/` | As needed |
| CoP meeting notes | `docs/about/meeting-notes/` | After each forum |

---

## Measuring the CoP's Health

A healthy CoP is active, inclusive, and producing value. We track:

| Indicator | Target |
|---|---|
| Pull requests merged per quarter | ≥ 4 (at least one per technology area) |
| Issues raised and closed per quarter | Trending upward |
| Forum attendance | ≥ 50% of engineers (over a rolling quarter) |
| Time from issue raised to PR merged | ≤ 2 sprints for non-breaking changes |
| Standards that have not been reviewed in > 6 months | 0 |

These are reviewed at the quarterly retrospective and used to tune the CoP's rhythm.

---

## Getting Involved

If you want to get more involved in the CoP:

1. Star this repository so you see updates
2. Attend the next monthly forum (invite is in the engineering calendar)
3. Raise your first issue — even a typo fix counts
4. Talk to your guild's working group representative

The CoP only works if engineers participate. Every contribution — large or small — makes the standards better for everyone.
