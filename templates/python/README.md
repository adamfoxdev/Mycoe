# Mycoe Python Template

A minimal, standards-compliant Python project starter.

## What's Included

| File | Purpose |
|---|---|
| `pyproject.toml` | Project metadata, dependencies, Ruff, mypy, and pytest configuration |
| `src/example/` | Example package — rename to match your project |
| `tests/` | pytest test suite with example tests |
| `.gitignore` | Standard Python ignores (`.venv`, `__pycache__`, coverage, etc.) |

## Quick Start

```bash
# Copy this template to your new project
cp -r templates/python ./my-python-project
cd my-python-project

# Create and activate a virtual environment (using uv — recommended)
uv venv
source .venv/bin/activate   # Linux / macOS
.venv\Scripts\activate      # Windows PowerShell

# Install with dev dependencies
uv pip install -e ".[dev]"

# Run the example
python -m example.main

# Lint
ruff check src tests

# Type check
mypy src

# Run tests with coverage
pytest
```

## Project Layout

```
my-python-project/
├── src/
│   └── example/             # Rename to your package name
│       ├── __init__.py
│       ├── main.py          # Entry point
│       └── services/        # Business logic
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Shared pytest fixtures
│   └── test_example.py
├── pyproject.toml
├── .gitignore
└── README.md
```

## Related Standards

- [Python Standards](../../docs/standards/python.md)
- [Python Training Pathway](../../docs/training/python.md)
