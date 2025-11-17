from __future__ import annotations

from urllib.parse import urljoin

from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement


class BasePage:
    """Базовый класс Page Object с утилитами для поиска элементов."""

    def __init__(self, driver: WebDriver, base_url: str) -> None:
        self.driver = driver
        self.base_url = base_url.rstrip("/") + "/"

    def open(self, path: str = "") -> None:
        target_url = urljoin(self.base_url, path.lstrip("/"))
        self.driver.get(target_url)

    def find(self, by: str, locator: str) -> WebElement:
        return self.driver.find_element(by, locator)

    def is_visible(self, by: str, locator: str) -> bool:
        try:
            return self.find(by, locator).is_displayed()
        except Exception:
            return False


