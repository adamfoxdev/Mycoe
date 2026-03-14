"""Entry point for the example package."""

import logging

logger = logging.getLogger(__name__)


def greet(name: str) -> str:
    """Return a greeting string for the given name.

    Args:
        name: The name to greet.

    Returns:
        A greeting string.

    Raises:
        ValueError: If name is empty or whitespace.
    """
    if not name or not name.strip():
        raise ValueError("name must be a non-empty string")
    message = f"Hello, {name}!"
    logger.info("Generated greeting", extra={"name": name})
    return message


def main() -> None:
    """Run the example entry point."""
    logging.basicConfig(level=logging.INFO)
    print(greet("World"))


if __name__ == "__main__":
    main()
