# Pilates Princess Task Manager — Test Strategy

## Test Packages

| Package     | Purpose                                                                 | Entry Criteria                                       | Exit Criteria                                                |
|-------------|-------------------------------------------------------------------------|------------------------------------------------------|--------------------------------------------------------------|
| `smoke`     | Быстрый прогон доступности UI/API.                                      | Доступен стенд, указаны `PPTM_*` переменные.         | Все критичные проверки зелёные или заведён инцидент.         |
| `regression`| Проверка всех пользовательских сценариев, негативы, валидации.          | Подготовлены фикстуры данных / тестовые аккаунты.    | Пройдены smoke + ключевые happy/edge cases.                 |
| `unit`      | Локальные тесты утилит/клиентов.                                        | Изменения в вспомогательных функциях.                | Покрытие не падает, CI зелёный.                              |
| `e2e`       | Сквозные сценарии (UI+API, день пользователя от создания листа до отчёта)| Готовы API/UI моки или staging.                      | Выполнены все шаги сценария, собраны метрики Allure.        |

## Smoke Checklist

### UI
- Хедер “Pilates Princess Daybook” отображается.
- Колонка задач доступна, можно добавить элемент.
- Панель декора рендерит подборку 2D элементов.
- Кнопка “Finish day” видима, при клике появляется тост “Хорошая работа”.

### API
- `POST /lists` создаёт лист с темой (`pilates-princess`, `matcha-garden`, `beach-episode`).
- `GET /lists/{id}` возвращает созданный лист, количество задач совпадает.
- `PUT /lists/{id}` позволяет обновить название листа.
- `DELETE /lists/{id}` удаляет лист без остатка.

## Regression Ideas
- Фильтрация листов по темам и дате.
- Состояние сессии: листы сохраняются, пока вкладка открыта; при закрытии создаётся новый seed-лист.
- Массовое применение декоров (переключение набора и проверка, что таски сохраняются).
- Интеграция кнопки “Finish day” с отчётом (письмо, push, лог).
- Негативы: пустой список задач, лимит по количеству листов, XSS в тексте задачи.

## Environment Matrix

| Variable             | Description                                      | Default                          |
|---------------------|--------------------------------------------------|----------------------------------|
| `PPTM_UI_BASE_URL`  | UI стенд                                         | `http://localhost:4173`          |
| `PPTM_API_BASE_URL` | API стенд                                        | `http://localhost:8000`          |
| `PPTM_BROWSER`      | `chrome` / `firefox`                             | `chrome`                         |
| `PPTM_HEADLESS`     | `1` чтобы гонять без UI                          | `1`                              |
| `PPTM_UI_IMPLICIT_WAIT` | Selenium implicit wait (сек)                | `5`                              |

## Running Suites

```bash
source .venv/bin/activate
# Smoke (UI+API)
pytest -m "smoke and (ui or api)" --alluredir=allure-results

# Regression (пример)
pytest tests/regression --alluredir=allure-results
```

## Reporting & Artifacts
- Allure results в `allure-results` (локально, Docker, CI).
- GitHub Actions загружает артефакт `allure-results` для каждого прогона.
- Для ручного просмотра: `allure serve allure-results`.

