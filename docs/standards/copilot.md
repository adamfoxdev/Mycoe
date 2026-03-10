# Copilot Integration Standards

This document defines standards for using AI Copilot tooling across Mycoe engineering and business teams.

## Scope

| Product | Primary Use Case |
|---|---|
| **GitHub Copilot** | In-IDE code completion and chat for software engineers |
| **Copilot for Microsoft 365** | Productivity assistance in Teams, Word, Excel, Outlook |
| **Copilot Studio** | Building custom Copilot agents and automations |
| **Azure OpenAI Service** | Teams/products that need direct LLM API access |

---

## GitHub Copilot

### Enablement

- Licences are managed centrally. Request access via the IT Service Desk.
- Supported IDEs: **Visual Studio Code**, **Visual Studio**, **JetBrains IDEs**, **Neovim**
- Enable using the [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)

### Custom Instructions

Each repository should include a `.github/copilot-instructions.md` file to give Copilot context about the project's conventions. A starter template is provided at `templates/copilot/copilot-instructions.md`.

```markdown
# Copilot Instructions

- This is a TypeScript React application using Fluent UI v9, React Router v6, and MSAL for Azure AD auth.
- Follow the coding standards in docs/standards/react.md.
- Always add explicit TypeScript return types to exported functions.
- Never use `any` — use `unknown` and narrow the type.
- Use React Testing Library for tests.
```

### Responsible Use

- **Review every suggestion** before accepting — Copilot can generate incorrect, insecure, or non-compliant code
- **Never accept code that handles secrets, credentials, or PII without careful review**
- Do not use Copilot to generate code that accesses Azure resources without understanding the permissions required
- Report suspected IP/copyright concerns to the Engineering Lead
- Copilot does not replace code review — all pull requests must still be reviewed by a human

### What Copilot Is Good At

| Task | Verdict |
|---|---|
| Boilerplate / scaffolding | ✅ Excellent |
| Writing unit tests | ✅ Excellent |
| Explaining unfamiliar code | ✅ Excellent |
| Refactoring / renaming | ✅ Good |
| Writing complex business logic | ⚠️ Always review carefully |
| Security-sensitive code (auth, crypto) | ⚠️ Always review carefully |
| Architecture decisions | ❌ Use human judgment |

### Prompt Engineering Tips

- Be specific about language, framework, and constraints in your prompt
- Reference existing code patterns: "write a controller like `ExamplesController`"
- Iterate — if the first suggestion isn't right, refine your prompt
- Use `/explain` and `/tests` slash commands in Copilot Chat

---

## Copilot for Microsoft 365

### Eligible Applications

Copilot for M365 is available in: **Teams**, **Word**, **Excel**, **PowerPoint**, **Outlook**, **OneNote**, **Loop**, and **Whiteboard**.

### Data Handling

- Copilot for M365 processes data within your Microsoft 365 tenant boundary — it does not use your data to train foundation models
- It respects your organisation's existing **sensitivity labels** and **permissions** — if a user cannot see a file, Copilot cannot surface it to them either
- Do **not** paste external confidential data (customer PII, passwords, financial data) directly into a Copilot prompt

### Usage Guidelines

| Scenario | Guidance |
|---|---|
| Summarising meeting notes | ✅ Good use — review output before sharing |
| Drafting emails / documents | ✅ Good use — always review and personalise |
| Analysing Excel data | ✅ Good use — validate all formulas and figures |
| Making final decisions | ❌ Copilot assists, humans decide |
| Sending Copilot output verbatim without review | ❌ Always review before sending |

### Sensitivity Labels

Ensure all documents and emails have the correct sensitivity label applied **before** using Copilot features. Copilot inherits and enforces these labels.

---

## Copilot Studio

Copilot Studio allows teams to build custom AI agents ("copilots") that can be deployed in Microsoft Teams or as standalone web apps.

### When to Use Copilot Studio

- Internal helpdesk / FAQ bots
- Guided forms and approval workflows
- Custom agents surfacing internal knowledge bases (SharePoint, Dataverse)

### When NOT to Use Copilot Studio

- When complex logic is required — use .NET services instead
- When you need direct database access beyond Dataverse/SharePoint
- When the agent needs to handle highly sensitive data (use Azure OpenAI + custom backend instead)

### Governance

- All Copilot Studio agents must be approved by the CoE before going to production
- Agents must be connected to a **DLP policy** — no unapproved external connectors
- Every agent must have a named owner (a person, not a shared mailbox)
- Test agents in a development environment before publishing to production
- Review and update knowledge sources on a defined schedule (minimum quarterly)

### Starter Agent Template

A starter Copilot Studio agent configuration is provided in `templates/copilot/copilot-studio/`.

---

## Azure OpenAI Service

For teams building custom applications that integrate directly with LLMs.

### Access

- Request an Azure OpenAI resource via the Platform Engineering team
- All resources must be deployed inside the organisation's Azure subscription — no direct use of public OpenAI APIs in production

### Security Requirements

- Use **Managed Identity** to authenticate to Azure OpenAI — never use API keys in code or config files
- Store any required keys in **Azure Key Vault**
- Enable **content filtering** on all Azure OpenAI deployments
- Do **not** send customer PII or internal confidential data to the model unless a Data Processing Agreement is in place

### Responsible AI Checklist

Before deploying any AI-powered feature:

- [ ] Conducted a **Responsible AI review** (fairness, reliability, privacy, security, inclusiveness, transparency, accountability)
- [ ] Defined the expected behaviour and failure modes
- [ ] Implemented human oversight / escalation path for high-risk outputs
- [ ] Documented what data is sent to the model and why
- [ ] Applied appropriate content filters
- [ ] Set up monitoring and alerting for unexpected outputs
