import os
from pathlib import Path

import pytest
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = PROJECT_ROOT / ".env"


@pytest.fixture(scope="session", autouse=True)
def load_environment() -> None:
    """Load variables from .env once per test session."""
    load_dotenv(dotenv_path=ENV_PATH, override=False)


@pytest.fixture(scope="session")
def ui_base_url() -> str:
    """Base URL для UI-слоя."""
    return os.getenv("PPTM_UI_BASE_URL", "http://localhost:4173")


@pytest.fixture(scope="session")
def api_base_url() -> str:
    """Base URL для API-слоя."""
    return os.getenv("PPTM_API_BASE_URL", "http://localhost:8000")


@pytest.fixture(scope="session")
def default_user() -> dict:
    """Условный пользователь для smoke-сценариев."""
    return {
        "display_name": os.getenv("PPTM_USER_NAME", "Pilates Princess"),
        "timezone": os.getenv("PPTM_USER_TZ", "Europe/Moscow"),
    }


