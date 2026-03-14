# Mycoe – Software Centre of Excellence

Welcome to the **Mycoe Software Centre of Excellence (CoE)**. This repository is the single source of truth for standards, best practices, templates, and tooling used across all software engineering disciplines in the organisation.

## What Is This?

A Software CoE provides shared standards and reusable assets so every team can start fast and stay consistent. Rather than each team re-inventing the wheel, the CoE captures patterns that work and makes them available to everyone.

## Technology Coverage

| Technology | What We Standardise |
|---|---|
| **React** | TypeScript app template, folder structure, ESLint/Prettier config, testing |
| **.NET** | Web API template, solution structure, coding standards, NuGet governance |
| **Power BI** | Report/dataset naming, row-level security patterns, deployment guidelines |
| **Microsoft 365** | SharePoint, Teams, and Graph API usage guidelines |
| **Azure** | Bicep modules, Azure DevOps pipelines, RBAC patterns, naming conventions |
| **Copilot & AI** | GitHub Copilot, Copilot for M365, Copilot Studio, Azure OpenAI guidelines |
| **Security** | SDL gates, threat modelling, SAST, secrets management, incident response |
| **Agentic AI** | Agent playbooks for end-to-end SDLC automation (stories → tests → PR → deploy) |

## Repository Layout

```
Mycoe/
├── docs/                    # Standards, guidelines, and decision records
│   ├── getting-started.md
│   ├── standards/
│   │   ├── react.md
│   │   ├── dotnet.md
│   │   ├── powerbi.md
│   │   ├── microsoft365.md
│   │   ├── azure.md
│   │   ├── copilot.md
│   │   ├── security.md
│   │   └── agentic-ai.md
│   └── training/            # Learning pathways per technology
└── templates/               # Copy-paste starter templates for each tech
    ├── react-app/           # Vite + React + TypeScript starter
    ├── dotnet-api/          # ASP.NET Core Web API starter
    ├── powerbi/             # Power BI DAX templates and guidelines
    ├── azure/               # Bicep modules + Azure DevOps pipelines
    ├── copilot/             # GitHub Copilot instructions + prompt library + Copilot Studio
    ├── security/            # Threat model template + pre-release security checklist
    ├── agentic-ai/          # Agent playbooks for SDLC automation
    └── microsoft365/        # SPFx web part, Teams app manifest, Power Automate flow templates
```

## Getting Started

See **[docs/getting-started.md](docs/getting-started.md)** for a full onboarding guide.

## Contributing

All engineers are encouraged to contribute improvements. Open a pull request targeting `main` and request a review from the CoE working group. See the contributing guidelines in the getting-started guide.

## Ownership

| Area | Owner |
|---|---|
| React / Frontend | Frontend Guild |
| .NET / Backend | Backend Guild |
| Power BI | Data & Analytics Guild |
| Azure / DevOps | Platform Engineering |
| Microsoft 365 | Collaboration & Productivity |
| Copilot & AI | Platform Engineering + All Guilds |
| Security | Security Champions Network |
| Agentic AI | Platform Engineering |
