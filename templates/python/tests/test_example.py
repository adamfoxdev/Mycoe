"""Tests for the example.main module."""

import pytest

from example.main import greet


def test_greet_returns_expected_message(example_name: str) -> None:
    result = greet(example_name)
    assert result == f"Hello, {example_name}!"


def test_greet_includes_name_in_output() -> None:
    result = greet("Bob")
    assert "Bob" in result


@pytest.mark.parametrize("bad_input", ["", "   ", "\t"])
def test_greet_raises_for_empty_or_whitespace_name(bad_input: str) -> None:
    with pytest.raises(ValueError, match="non-empty string"):
        greet(bad_input)
