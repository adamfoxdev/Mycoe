# Copilot Studio — Starter Agent

This folder contains the configuration and documentation for a starter Copilot Studio agent.
Use this as a reference when building your own custom agents.

## Agent Overview

| Field | Value |
|---|---|
| Agent Name | Mycoe Help Desk Assistant |
| Purpose | Answer internal FAQs using SharePoint knowledge base |
| Deployment | Microsoft Teams |
| Owner | *(replace with team/person name)* |
| Environment | Development → Production |

## Architecture

```
User (Teams)
    │
    ▼
Copilot Studio Agent
    │
    ├── Topic: Greeting / Fallback
    ├── Topic: IT Support FAQ        ← SharePoint knowledge source
    ├── Topic: HR Policy FAQ         ← SharePoint knowledge source
    ├── Topic: Escalate to Human     ← Power Automate flow
    └── Topic: End Conversation
```

## Knowledge Sources

| Source | Type | SharePoint URL |
|---|---|---|
| IT Support FAQs | SharePoint Page | *(insert URL)* |
| HR Policies | SharePoint Document Library | *(insert URL)* |

## Topics

### Greeting

Triggered when the user starts a conversation. Welcomes the user and offers a list of topics it can help with.

### IT Support FAQ

Triggered by keywords: "password", "laptop", "VPN", "software", "access", "printer".
Uses generative AI answers from the IT Support FAQ SharePoint page.

### HR Policy FAQ

Triggered by keywords: "leave", "holiday", "payroll", "benefits", "policy".
Uses generative AI answers from the HR Policies document library.

### Escalate to Human

Triggered when the agent cannot answer, or when the user says "speak to a person", "talk to someone", "human agent".
Calls a Power Automate flow to create a support ticket and notifies the support team via Teams.

### End Conversation

Triggered when the user says goodbye or after a resolution is confirmed.
Asks for a satisfaction rating (1–5) and logs the response.

## DLP Policy

This agent must be connected to the organisation's **Microsoft Copilot Studio DLP policy**.

Approved connectors:
- Microsoft Teams
- SharePoint
- Office 365 Outlook
- Power Automate flows (internal only)

No external connectors are permitted without Security Champion approval.

## Deployment Checklist

Before publishing to Production:

- [ ] All topics tested in the development environment
- [ ] DLP policy applied and verified
- [ ] Agent owner assigned (not a personal account)
- [ ] Knowledge sources reviewed and up to date
- [ ] Escalation flow tested end-to-end
- [ ] CoE approval obtained
- [ ] Published to the production Teams environment
- [ ] Announcement sent to users

## Maintenance

- Review knowledge sources **quarterly** for accuracy
- Monitor conversation analytics in Copilot Studio monthly
- Update topics when underlying policies or FAQs change
