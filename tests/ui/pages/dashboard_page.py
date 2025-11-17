from selenium.webdriver.common.by import By

from .base_page import BasePage


class DashboardPage(BasePage):
    """Главный экран ежедневника."""

    HEADER = (By.CSS_SELECTOR, "[data-testid='daily-planner-header']")
    TASK_COLUMN = (By.CSS_SELECTOR, "[data-testid='task-column']")
    DECOR_PANEL = (By.CSS_SELECTOR, "[data-testid='decor-panel']")
    FINISH_DAY_BUTTON = (By.CSS_SELECTOR, "[data-testid='finish-day-button']")

    def open(self) -> None:  # type: ignore[override]
        super().open("/")

    def is_loaded(self) -> bool:
        elements = [self.HEADER, self.TASK_COLUMN, self.DECOR_PANEL]
        return all(self.is_visible(*locator) for locator in elements)

    def finish_day_is_visible(self) -> bool:
        return self.is_visible(*self.FINISH_DAY_BUTTON)


