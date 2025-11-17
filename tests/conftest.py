import os
from pathlib import Path
from typing import Generator

import pytest
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.remote.webdriver import WebDriver

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


@pytest.fixture(scope="session")
def browser_name() -> str:
    """Имя браузера (chrome/firefox), управляем через env."""
    return os.getenv("PPTM_BROWSER", "chrome").lower()


def _create_driver(browser: str, headless: bool) -> WebDriver:
    if browser == "chrome":
        options = ChromeOptions()
        if headless:
            options.add_argument("--headless=new")
        options.add_argument("--window-size=1440,900")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        return webdriver.Chrome(options=options)

    if browser == "firefox":
        options = FirefoxOptions()
        options.headless = headless
        options.set_preference("layout.css.devPixelsPerPx", "1.0")
        return webdriver.Firefox(options=options)

    raise ValueError(f"Unsupported browser: {browser}")


@pytest.fixture
def driver(browser_name: str) -> Generator[WebDriver, None, None]:
    """Selenium WebDriver с настройками по умолчанию."""
    headless_flag = os.getenv("PPTM_HEADLESS", "1").lower() not in {"0", "false", "no"}
    implicit_wait = int(os.getenv("PPTM_UI_IMPLICIT_WAIT", "5"))

    driver = _create_driver(browser_name, headless_flag)
    driver.implicitly_wait(implicit_wait)

    yield driver

    driver.quit()


