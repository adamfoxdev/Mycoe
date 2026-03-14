"""Shared pytest fixtures.

Place fixtures that are used across multiple test modules here.
Fixtures defined here are automatically available to all test files in this
package — no import required.
"""

import pytest


@pytest.fixture
def example_name() -> str:
    """Return a sample name for use in greeting tests."""
    return "Alice"
