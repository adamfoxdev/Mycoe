# Visual Studio Code Training Guide

Visual Studio Code (VS Code) is the standard editor across the Mycoe CoE. This guide walks you through setting up and using VS Code effectively for each technology area we support.

## Installation & Initial Setup

| Resource | Type | Duration |
|---|---|---|
| [Download VS Code](https://code.visualstudio.com/download) | Download | 5 min |
| [VS Code — Getting Started](https://code.visualstudio.com/docs/introvideos/basics) | Video | 5 min |
| [VS Code User Interface Overview](https://code.visualstudio.com/docs/getstarted/userinterface) | Docs | 30 min |
| [VS Code Settings Sync](https://code.visualstudio.com/docs/editor/settings-sync) | Docs | 10 min |

**Outcome:** VS Code installed, signed in with your Microsoft/GitHub account, and settings synced.

---

## Git with VS Code

VS Code has built-in Git support via the Source Control panel and tight integration with GitHub via the GitHub Pull Requests and Issues extension.

### Recommended Extensions

| Extension | Purpose |
|---|---|
| [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) | Inline blame, history, and code authorship |
| [GitHub Pull Requests and Issues](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github) | Review and manage PRs directly in VS Code |
| [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) | Visualise branch and commit history |

### Learning Resources

| Resource | Type | Duration |
|---|---|---|
| [Using Git Source Control in VS Code](https://code.visualstudio.com/docs/sourcecontrol/overview) | Docs | 30 min |
| [VS Code — Git Tutorial](https://code.visualstudio.com/docs/introvideos/versioncontrol) | Video | 5 min |
| [Working with GitHub in VS Code](https://code.visualstudio.com/docs/sourcecontrol/github) | Docs | 30 min |
| [Git — Official Getting Started Guide](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control) | Book (free) | 1 hr |
| [GitHub Skills: Introduction to GitHub](https://skills.github.com/) | Interactive | 1 hr |
| [Merging vs Rebasing — Atlassian](https://www.atlassian.com/git/tutorials/merging-vs-rebasing) | Tutorial | 30 min |

### Key Tasks to Practice

- Stage, commit, and push changes using the Source Control panel
- Create and switch branches from the status bar
- Resolve merge conflicts using the built-in 3-way merge editor
- Review a pull request without leaving VS Code using the GitHub extension
- Use GitLens inline blame to understand code history

**Outcome:** Can perform everyday Git workflows entirely within VS Code.

---

## .NET with VS Code

VS Code supports full .NET development including debugging, testing, and NuGet management via the C# Dev Kit extension.

### Recommended Extensions

| Extension | Purpose |
|---|---|
| [C# Dev Kit](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit) | IntelliSense, debugging, solution explorer, test runner |
| [.NET Install Tool](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.vscode-dotnet-runtime) | Manages .NET SDK installations |
| [NuGet Gallery](https://marketplace.visualstudio.com/items?itemName=patcx.vscode-nuget-gallery) | Browse and install NuGet packages |

### Learning Resources

| Resource | Type | Duration |
|---|---|---|
| [VS Code for C# and .NET — Official Docs](https://code.visualstudio.com/docs/languages/dotnet) | Docs | 30 min |
| [C# Dev Kit — Getting Started](https://learn.microsoft.com/en-us/visualstudio/subscriptions/vs-c-sharp-dev-kit) | Docs | 30 min |
| [Debugging .NET in VS Code](https://code.visualstudio.com/docs/editor/debugging) | Docs | 30 min |
| [Running and Debugging Unit Tests (C# Dev Kit)](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-dotnet-test) | Tutorial | 1 hr |
| [Create a .NET console app in VS Code](https://learn.microsoft.com/en-us/dotnet/core/tutorials/with-visual-studio-code) | Tutorial | 1 hr |
| [Create an ASP.NET Core Web API in VS Code](https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api) | Tutorial | 2 hrs |

### Key Tasks to Practice

- Create a new solution and project using the Command Palette (`Ctrl+Shift+P` → `.NET: New Project`)
- Navigate the Solution Explorer
- Set breakpoints and step through code with the debugger
- Run xUnit tests from the Test Explorer panel
- Add and restore NuGet packages

**Outcome:** Can build, run, debug, and test .NET applications entirely within VS Code.

---

## React with VS Code

VS Code is the most popular editor for React development. The extensions below provide linting, formatting, IntelliSense, and testing support.

### Recommended Extensions

| Extension | Purpose |
|---|---|
| [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) | JavaScript/TypeScript linting |
| [Prettier – Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) | Opinionated code formatting |
| [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets) | Productivity snippets for React |
| [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) | Autocomplete for Tailwind classes |
| [Vite](https://marketplace.visualstudio.com/items?itemName=antfu.vite) | Vite project support |

### Learning Resources

| Resource | Type | Duration |
|---|---|---|
| [VS Code — JavaScript and TypeScript](https://code.visualstudio.com/docs/languages/javascript) | Docs | 30 min |
| [React in VS Code](https://code.visualstudio.com/docs/nodejs/reactjs-tutorial) | Tutorial | 1 hr |
| [Configuring ESLint and Prettier in VS Code](https://code.visualstudio.com/docs/languages/javascript#_linting) | Docs | 30 min |
| [Debugging React in VS Code](https://code.visualstudio.com/docs/nodejs/reactjs-tutorial#_debugging-react) | Docs | 30 min |
| [Vitest Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) | Marketplace | 15 min |

### Key Tasks to Practice

- Scaffold a new Vite + React + TypeScript project and open it in VS Code
- Configure ESLint and Prettier to auto-fix on save (`editor.formatOnSave`)
- Use the Vitest extension to run and debug tests in the Test Explorer
- Use the integrated terminal to run `npm run dev` and open the preview
- Inspect component state and props using browser DevTools

**Outcome:** Can develop, lint, format, and test React applications within VS Code.

---

## Python with VS Code

VS Code is a first-class Python IDE with support for virtual environments, linting, formatting, debugging, and Jupyter notebooks.

### Recommended Extensions

| Extension | Purpose |
|---|---|
| [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) | IntelliSense, linting, debugging, environment management |
| [Pylance](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance) | Fast, feature-rich language server for Python |
| [Ruff](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff) | Extremely fast Python linter and formatter |
| [Jupyter](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter) | Jupyter Notebook support |

### Learning Resources

| Resource | Type | Duration |
|---|---|---|
| [Python in VS Code — Official Docs](https://code.visualstudio.com/docs/languages/python) | Docs | 30 min |
| [Getting Started with Python in VS Code](https://code.visualstudio.com/docs/python/python-tutorial) | Tutorial | 1 hr |
| [Python Environments in VS Code](https://code.visualstudio.com/docs/python/environments) | Docs | 30 min |
| [Debugging Python in VS Code](https://code.visualstudio.com/docs/python/debugging) | Docs | 30 min |
| [Testing Python in VS Code (pytest)](https://code.visualstudio.com/docs/python/testing) | Docs | 30 min |
| [Jupyter Notebooks in VS Code](https://code.visualstudio.com/docs/datascience/jupyter-notebooks) | Docs | 30 min |
| [Python — Official Tutorial](https://docs.python.org/3/tutorial/) | Docs | 4 hrs |

### Key Tasks to Practice

- Select a Python interpreter / virtual environment from the status bar
- Create and activate a `venv` using the integrated terminal
- Install packages with `pip` and use a `requirements.txt`
- Set breakpoints and use the Python debugger
- Run pytest tests from the Test Explorer panel
- Open and run a Jupyter notebook cell-by-cell

**Outcome:** Can write, debug, and test Python code — including notebooks — within VS Code.

---

## SQL with VS Code

VS Code supports SQL development through extensions that provide IntelliSense, query execution, and database exploration for SQL Server, Azure SQL, and other databases.

### Recommended Extensions

| Extension | Purpose |
|---|---|
| [SQL Server (mssql)](https://marketplace.visualstudio.com/items?itemName=ms-mssql.mssql) | Connect to SQL Server / Azure SQL, run queries, view results |
| [SQLTools](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools) | Multi-database SQL client (Postgres, MySQL, SQLite, etc.) |
| [SQL Formatter](https://marketplace.visualstudio.com/items?itemName=adpyke.vscode-sql-formatter) | Auto-format SQL files |

### Learning Resources

| Resource | Type | Duration |
|---|---|---|
| [MSSQL Extension for VS Code — Quickstart](https://learn.microsoft.com/en-us/sql/tools/visual-studio-code/mssql-extensions?view=sql-server-ver16) | Docs | 30 min |
| [Use VS Code to Create and Run T-SQL Scripts](https://learn.microsoft.com/en-us/sql/tools/visual-studio-code/sql-server-develop-use-vscode) | Tutorial | 1 hr |
| [SQLTools Documentation](https://vscode-sqltools.mteixeira.dev/en/home) | Docs | 30 min |
| [T-SQL Fundamentals — Microsoft Learn](https://learn.microsoft.com/en-us/training/paths/get-started-querying-with-transact-sql/) | Microsoft Learn | 4 hrs |

### Key Tasks to Practice

- Connect to a SQL Server or Azure SQL instance using the mssql extension
- Write and execute a T-SQL query and view results in the grid
- Use IntelliSense to autocomplete table and column names
- Save and organise query files in a workspace folder
- Export query results to CSV

**Outcome:** Can connect to and query SQL databases directly from VS Code.

---

## Azure with VS Code

Several first-party Microsoft extensions integrate VS Code directly with the Azure portal, allowing deployment, resource browsing, and function development without leaving the editor.

### Recommended Extensions

| Extension | Purpose |
|---|---|
| [Azure Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) | Meta-pack: installs all core Azure extensions |
| [Azure Resources](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups) | Browse and manage Azure resources |
| [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) | Deploy and manage App Service apps |
| [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) | Create, run, and deploy Azure Functions |
| [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb) | Browse Azure Cosmos DB and Azure SQL |
| [Bicep](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) | IntelliSense and validation for Bicep IaC files |
| [Azure Pipelines](https://marketplace.visualstudio.com/items?itemName=ms-azure-devops.azure-pipelines) | YAML pipeline syntax highlighting and validation |

### Learning Resources

| Resource | Type | Duration |
|---|---|---|
| [VS Code for Azure — Official Overview](https://code.visualstudio.com/docs/azure/extensions) | Docs | 15 min |
| [Deploy to Azure App Service from VS Code](https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-vscode) | Tutorial | 1 hr |
| [Create an Azure Function in VS Code](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-csharp) | Tutorial | 1 hr |
| [Bicep — Author Bicep in VS Code](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/configure-visual-studio-code) | Docs | 30 min |
| [Azure CLI in the VS Code Terminal](https://code.visualstudio.com/docs/azure/extensions#_azure-cli) | Docs | 15 min |

### Key Tasks to Practice

- Sign in to Azure from the Azure Resources extension
- Browse resource groups, App Services, and databases in the Azure explorer
- Deploy an App Service or Azure Function directly from VS Code
- Validate and lint a Bicep file using the Bicep extension
- Run an Azure Function locally using the Functions extension and debug it

**Outcome:** Can develop, deploy, and manage Azure resources and Infrastructure-as-Code directly from VS Code.

---

## Recommended Workspace Settings

Add the following to your `.vscode/settings.json` to apply Mycoe standard editor defaults across all projects:

```json
{
  "editor.formatOnSave": true,
  "editor.rulers": [120],
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "git.autofetch": true,
  "git.confirmSync": false
}
```

## Recommended Certifications

There is no official VS Code certification, but competency in the tooling supports the following:

- **GitHub Foundations** — covers Git and GitHub workflows used daily in VS Code
- **Microsoft Certified: Azure Developer Associate (AZ-204)** — assumes comfort with VS Code for Azure development
