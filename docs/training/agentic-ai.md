# Agentic AI Training Pathway

## Foundation — All Engineers

Complete this tier before working on any project that uses AI agents.

| Resource | Type | Duration |
|---|---|---|
| [Introduction to Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/overview/) | Docs | 1 hr |
| [Introduction to Azure OpenAI Service](https://learn.microsoft.com/en-us/training/modules/explore-azure-openai/) | Microsoft Learn | 1 hr |
| [Responsible AI Principles — Microsoft](https://learn.microsoft.com/en-us/training/modules/responsible-ai-principles/) | Microsoft Learn | 30 min |
| [Introduction to Prompt Engineering](https://learn.microsoft.com/en-us/training/modules/apply-prompt-engineering-azure-openai/) | Microsoft Learn | 1 hr |
| [Azure OpenAI — Content Safety](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview) | Docs | 30 min |
| Read [docs/standards/agentic-ai.md](../standards/agentic-ai.md) — core principles and anti-patterns | CoE Standard | 30 min |

**Outcome:** Understands what an agentic AI system is, the risks involved, and the CoE's core governance principles.

## Practitioner — Engineers Building or Operating Agents

| Resource | Type | Duration |
|---|---|---|
| [Semantic Kernel — Quick Start (.NET)](https://learn.microsoft.com/en-us/semantic-kernel/get-started/quick-start-guide) | Docs | 2 hrs |
| [Semantic Kernel — Plugins](https://learn.microsoft.com/en-us/semantic-kernel/concepts/plugins/) | Docs | 2 hrs |
| [Semantic Kernel — Planners](https://learn.microsoft.com/en-us/semantic-kernel/concepts/planning) | Docs | 2 hrs |
| [Azure OpenAI — Structured Outputs](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/structured-outputs) | Docs | 1 hr |
| [Azure OpenAI — Function Calling](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/function-calling) | Docs | 1 hr |
| [Azure DevOps REST API](https://learn.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-7.1) | Docs | 2 hrs |
| [Managed Identities for Azure Resources](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview) | Docs | 1 hr |
| Review the agent playbooks in [templates/agentic-ai/agents/](../../templates/agentic-ai/agents/) | CoE Templates | 2 hrs |

**Outcome:** Can build a Semantic Kernel agent plugin, wire it to Azure OpenAI with structured outputs, and deploy it following CoE governance (observe mode, least-privilege service principal, audit logging).

## Expert — AI Platform & Architecture

| Resource | Type | Duration |
|---|---|---|
| [AI-102: Azure AI Engineer Associate Learning Path](https://learn.microsoft.com/en-us/training/paths/prepare-for-ai-engineering/) | Microsoft Learn | 15 hrs |
| [LLMOps — Operating LLMs in Production](https://learn.microsoft.com/en-us/azure/machine-learning/concept-llmops-maturity) | Docs | 2 hrs |
| [Azure AI Foundry (formerly Azure AI Studio)](https://learn.microsoft.com/en-us/azure/ai-studio/what-is-ai-studio) | Docs | 2 hrs |
| [Semantic Kernel — Multi-Agent Orchestration](https://learn.microsoft.com/en-us/semantic-kernel/concepts/agents/) | Docs | 3 hrs |
| [Microsoft Responsible AI Standard](https://www.microsoft.com/en-us/ai/responsible-ai) | Framework | 2 hrs |
| [Azure Monitor — Application Insights Custom Events](https://learn.microsoft.com/en-us/azure/azure-monitor/app/api-custom-events-metrics) | Docs | 1 hr |

**Outcome:** Can architect multi-agent pipelines, lead Responsible AI reviews for agentic systems, define observability and governance standards, and contribute to CoE agentic AI patterns.

## Recommended Certifications

| Certification | Target Audience |
|---|---|
| AI-900: Azure AI Fundamentals | All engineers on AI-adjacent projects |
| AI-102: Azure AI Engineer Associate | Engineers building or operating agents |
| AZ-204: Azure Developer Associate | Engineers deploying agent infrastructure |
