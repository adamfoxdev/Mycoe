# Getting Started with the Mycoe Software CoE

This guide helps new engineers onboard to the Centre of Excellence standards and use the provided templates.

If you are new to the CoE and want to understand what it is and why it exists before diving into the technical content, read **[docs/about/what-is-the-coe.md](about/what-is-the-coe.md)** first.

## Prerequisites

| Tool | Minimum Version | Notes |
|---|---|---|
| Node.js | 20 LTS | For React development |
| .NET SDK | 8.0 | For backend development |
| Azure CLI | 2.57+ | For Azure deployments |
| Bicep CLI | 0.25+ | Bundled with Azure CLI 2.51+ |
| Power BI Desktop | Latest | For report development |
| Git | 2.40+ | Version control |

## Onboarding Checklist

- [ ] Read the relevant standards document for your technology area
- [ ] Clone this repository so you have a local copy of all templates
- [ ] Copy the appropriate template to your new project
- [ ] Follow the naming conventions defined in the standards
- [ ] Add your project to the CoE project registry (see below)

## Using a Template

### React App

```bash
# Copy the template to your new project
cp -r templates/react-app ./my-new-app
cd my-new-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### .NET Web API

```bash
# Copy the template to your new project
cp -r templates/dotnet-api ./MyNewApi
cd MyNewApi

# Restore packages
dotnet restore

# Run the API
dotnet run --project src/Template.Api
```

### Azure Infrastructure

```bash
# Copy the Bicep templates
cp -r templates/azure/bicep ./infra

# Preview a deployment (what-if)
az deployment group what-if \
  --resource-group rg-myapp-dev \
  --template-file infra/main.bicep \
  --parameters @infra/main.parameters.dev.json
```

### Microsoft 365 — SPFx Web Part

```bash
# Copy the template to your new project
cp -r templates/microsoft365/spfx-webpart ./my-webpart
cd my-webpart

# Install dependencies
npm install

# Start the local workbench
gulp serve
```

### Microsoft 365 — Teams App

```bash
# Copy the template to your new project
cp -r templates/microsoft365/teams-app ./my-teams-app

# Open in VS Code with Teams Toolkit installed
code ./my-teams-app
# Use Teams Toolkit: Preview in Teams (Edge) to sideload and test
```

### Microsoft 365 — Power Automate Flow

```bash
# Copy the approval flow template
cp -r templates/microsoft365/power-automate ./my-flow
```

Then import `my-flow/approval-flow.json` into Power Automate via **My Flows → Import → Import Package**.
Update the connection references and parameters, then test before enabling in production.

### Agentic AI Pipeline

```bash
# Copy the agent playbooks into your project
cp -r templates/agentic-ai ./.agents

# Configure environment variables (see each agent playbook for details)
cp .agents/schemas/*.schema.json ./src/agents/schemas/

# Run the Pipeline Orchestrator in observe mode first
# Set AGENT_MODE=observe in your Azure DevOps Variable Group
# Then register the ADO and GitHub webhooks to point at your orchestrator endpoint
```

## Project Registry

When you start a new project, add an entry to the project registry table in this document:

| Project Name | Technology | Team | Repository |
|---|---|---|---|
| *(your project here)* | React / .NET / Power BI | *(team name)* | *(repo URL)* |

## Contributing to the CoE

1. Raise a GitHub Issue describing the improvement or new standard
2. Fork or branch from `main`
3. Make your changes, following the existing file structure
4. Submit a Pull Request — request at least one review from the CoE working group
5. Changes merged to `main` are considered adopted standards

## Questions & Support

Raise a GitHub Issue with the `question` label, or reach out to the relevant guild listed in the main README.
