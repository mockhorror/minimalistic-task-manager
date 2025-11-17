import allure
import pytest

from tests.ui.pages.dashboard_page import DashboardPage


@allure.feature("Dashboard")
@allure.story("Smoke widgets")
@allure.title("Панель ежедневника отображает основные блоки")
@pytest.mark.ui
@pytest.mark.smoke
def test_dashboard_displays_core_widgets(driver, ui_base_url):
    """Smoke: проверяем, что базовые блоки ежедневника подгрузились."""
    if ui_base_url.startswith("http://localhost"):
        pytest.skip(
            "UI base URL не настроен. Установи PPTM_UI_BASE_URL на реальный стенд."
        )

    page = DashboardPage(driver, ui_base_url)

    with allure.step("Открываем страницу ежедневника"):
        page.open()

    with allure.step("Проверяем наличие основных блоков"):
        assert page.is_loaded(), "Основные блоки ежедневника не отобразились"

    with allure.step("Проверяем кнопку завершения дня"):
        assert page.finish_day_is_visible(), "Кнопка завершения дня недоступна"


