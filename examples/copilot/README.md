# GitHub Copilot Setup — Tasks App Example

This directory shows how to configure GitHub Copilot for a typical Mycoe full-stack project (React + .NET API). Copy the `.github/` folder into the root of your repository.

## What's Included

| File | Purpose |
|---|---|
| `.github/copilot-instructions.md` | Project-specific context file read by GitHub Copilot in every suggestion |

## How Copilot Instructions Work

When you place `copilot-instructions.md` in `.github/`, GitHub Copilot reads it as additional context for every code completion and chat request in VS Code and GitHub.com. It lets you:

- Tell Copilot the tech stack it's working with
- Enforce project-specific coding conventions
- Prevent Copilot from suggesting anti-patterns your team has banned
- Point Copilot toward your preferred libraries and test patterns

## Getting Started

1. Copy `.github/copilot-instructions.md` from this directory into your repository root's `.github/` folder.
2. Customise the Technology Stack, Coding Conventions, and What To Avoid sections for your project.
3. Commit and push — Copilot will pick up the file automatically.

## References

- [CoE Copilot Standards](../../docs/standards/copilot.md)
- [Copilot Template](../../templates/copilot/)
- [GitHub Docs: Copilot Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
