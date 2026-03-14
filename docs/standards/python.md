# Python Standards

This document defines standards for all Python code built within Mycoe — including Azure Functions, data engineering scripts, automation tooling, and AI/ML utilities.

## Technology Stack

| Concern | Choice | Rationale |
|---|---|---|
| Language version | Python 3.12 | Latest stable; supported until 2028 |
| Package manager | `uv` (preferred) or `pip` + `venv` | `uv` is significantly faster; compatible with `pyproject.toml` |
| Project metadata | `pyproject.toml` (PEP 621) | Single source of truth for metadata, dependencies, and tooling |
| Linting & formatting | Ruff | Extremely fast; replaces Flake8, isort, and Black in one tool |
| Type checking | mypy (strict) | Catches type errors before runtime |
| Testing | pytest | De-facto standard; rich plugin ecosystem |
| Coverage | pytest-cov | Coverage report integrated into CI |
| Azure integration | `azure-functions`, `azure-identity`, `azure-keyvault-secrets` | First-party Azure SDKs |

## Project Structure

```
my-python-project/
├── src/
│   └── my_project/          # Package source (underscore-named module)
│       ├── __init__.py
│       ├── main.py          # Entry point
│       └── services/        # Business logic modules
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Shared pytest fixtures
│   └── test_main.py
├── pyproject.toml           # Project metadata, dependencies, tool config
├── .gitignore
└── README.md
```

See the copy-paste starter in `templates/python/`.

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Modules / packages | `snake_case` | `user_service.py` |
| Classes | `PascalCase` | `UserRepository` |
| Functions and methods | `snake_case` | `get_user_by_id` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| Private members | Single underscore prefix | `_connection_string` |
| Type aliases | `PascalCase` | `UserId = str` |
| Test files | `test_<module>.py` | `test_user_service.py` |

## Coding Standards

- Enable `strict` mode in `mypy` — resolve all type errors
- Use **type annotations** on all function signatures and class attributes
- Prefer `pathlib.Path` over `os.path` for file operations
- Use `logging` (not `print`) — see the [logging pattern](#logging) below
- Avoid mutable default arguments — use `None` with an explicit guard instead
- Keep functions short and single-purpose; aim for ≤ 30 lines per function
- Raise specific exceptions (`ValueError`, `RuntimeError`, custom exceptions) — never `Exception` bare

```python
# ✅ Good: typed, specific exception, no mutable default
def get_user(user_id: str, tags: list[str] | None = None) -> User:
    if tags is None:
        tags = []
    if not user_id:
        raise ValueError("user_id must be a non-empty string")
    ...

# ❌ Avoid: untyped, mutable default, bare Exception
def get_user(user_id, tags=[]):
    try:
        ...
    except Exception:
        pass
```

## Virtual Environments & Dependencies

```bash
# Using uv (preferred)
uv venv
source .venv/bin/activate   # Linux / macOS
.venv\Scripts\activate      # Windows PowerShell

uv pip install -e ".[dev]"  # install with dev extras

# Using standard venv
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

Always commit `pyproject.toml` and a lock file (`uv.lock` or `requirements.txt` generated from it). Never commit `.venv/`.

## `pyproject.toml` Baseline

```toml
[project]
name = "my-project"
version = "1.0.0"
requires-python = ">=3.12"
dependencies = [
    "azure-identity>=1.16",
    "azure-keyvault-secrets>=4.8",
]

[project.optional-dependencies]
dev = [
    "pytest>=8",
    "pytest-cov>=5",
    "mypy>=1.10",
    "ruff>=0.4",
]

[tool.ruff]
line-length = 120
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B", "SIM", "ANN"]
ignore = ["ANN101"]  # ignore self annotation

[tool.mypy]
strict = true
python_version = "3.12"

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "--cov=src --cov-report=term-missing --cov-fail-under=80"
```

## Logging

Use Python's standard `logging` module with structured context. Never use `print` in production code.

```python
import logging

logger = logging.getLogger(__name__)

def process_order(order_id: str) -> None:
    logger.info("Processing order", extra={"order_id": order_id})
    try:
        ...
    except ValueError as exc:
        logger.error("Invalid order data", extra={"order_id": order_id, "error": str(exc)})
        raise
```

In Azure Functions, Application Insights captures `logging` output automatically when `APPLICATIONINSIGHTS_CONNECTION_STRING` is set.

## Secrets Management

- **Never** hardcode secrets, passwords, or API keys
- Use **Azure Key Vault** via `azure-keyvault-secrets` and **DefaultAzureCredential** (Managed Identity in Azure, CLI credentials locally)
- Do not store secrets in environment variables in production — use Key Vault references in App Settings

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

def get_secret(vault_url: str, secret_name: str) -> str:
    client = SecretClient(vault_url=vault_url, credential=DefaultAzureCredential())
    return client.get_secret(secret_name).value
```

## Testing Standards

### Overview

| Layer | Tool | Scope |
|---|---|---|
| Unit | pytest + unittest.mock | Individual functions and classes in isolation |
| Integration | pytest | Functions that call external services (use test doubles or real test instances) |
| Coverage | pytest-cov | Minimum 80% statement and branch coverage enforced in CI |

### Unit Test Example

```python
# tests/test_user_service.py
from unittest.mock import MagicMock, patch

import pytest

from my_project.services.user_service import UserService


@pytest.fixture
def mock_repo() -> MagicMock:
    return MagicMock()


def test_get_user_returns_user_when_exists(mock_repo: MagicMock) -> None:
    mock_repo.find_by_id.return_value = {"id": "1", "name": "Alice"}
    service = UserService(repository=mock_repo)

    result = service.get_user("1")

    assert result["name"] == "Alice"
    mock_repo.find_by_id.assert_called_once_with("1")


def test_get_user_raises_when_not_found(mock_repo: MagicMock) -> None:
    mock_repo.find_by_id.return_value = None
    service = UserService(repository=mock_repo)

    with pytest.raises(ValueError, match="User not found"):
        service.get_user("missing-id")
```

### Running Tests

```bash
# Run all tests with coverage
pytest

# Run a specific test file
pytest tests/test_user_service.py

# Run tests matching a keyword
pytest -k "test_get_user"

# Run with verbose output
pytest -v
```

### Coverage Requirements

- Minimum **80% statement and branch coverage** enforced in CI (`--cov-fail-under=80`)
- Aim for **100% coverage** of pure utility functions and service logic

## CI/CD

- Ruff lint must pass: `ruff check src tests`
- mypy type check must pass: `mypy src`
- All tests must pass with coverage threshold: `pytest`
- Pipelines are defined in `templates/azure/pipelines/` — add a Python pipeline entry following the existing patterns
