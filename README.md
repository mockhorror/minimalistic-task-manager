# Pilates Princess Task Manager

Pet-проект для практики QA Automation на Python. Планируем построить набор автотестов (UI, API, smoke/regression/e2e) вокруг воображаемого минималистичного таск-менеджера в эстетике soft shojo/pinterest — ежедневник с pastel-фонами, коробкой лёгких 2D-элементов и мотивационными сообщениями в духе “Pilates Princess”.

Основной стек автотестов:

- Python 3.11 + `pytest`
- UI: `selenium`, Page Object-подход
- API: `requests`
- Отчётность: `allure-pytest`

План работ:

1. Сбор требований и сценариев (готово).
2. Подготовка окружения и GitHub-репозитория (готово).
3. Создание каркаса тестового проекта и зависимостей (готово).
4. UI-автотесты, API-слой, Allure, CI, Docker (в работе).

Референсы UI/эстетики:

- [Нежный “ежедневник” с левым блоком задач и правой иллюстрацией](https://ru.pinterest.com/pin/14144186324116798/)
- [Минималистичная коробочка-панель с 2D элементами](https://ru.pinterest.com/pin/391109548913366090/)
- [Weekly recap в стиле lifestyle/pastel](https://ru.pinterest.com/pin/9007268002419800/)

## Быстрый старт

```bash
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest -m smoke
```

Переменные окружения можно складывать в `.env` (см. `tests/conftest.py` для имен).

## UI smoke-тест

Настраиваем `.env`:

```
PPTM_UI_BASE_URL=https://pilates-princess-demo.example.com
PPTM_BROWSER=chrome         # chrome или firefox
PPTM_HEADLESS=1             # 0 чтобы видеть браузер
PPTM_UI_IMPLICIT_WAIT=5
```

Запуск smoke-сценария:

```bash
source .venv/bin/activate
pytest tests/ui/smoke -m ui --alluredir=allure-results
```

Если `PPTM_UI_BASE_URL` оставлен по умолчанию (локальный localhost), smoke-тест автоматически пропускается до появления реального стенда.

## API smoke-тест

```
PPTM_API_BASE_URL=https://pilates-princess-api.example.com
```

```bash
source .venv/bin/activate
pytest tests/api/smoke -m api --alluredir=allure-results
```
## Allure отчёт

```bash
source .venv/bin/activate
pytest -m "ui or api" --alluredir=allure-results
allure serve allure-results
```

`allure.properties` и `.allure.yml` уже настроены на каталог `allure-results`.

## CI

GitHub Actions (`.github/workflows/tests.yml`) автоматически:

- запускает `pytest -m "ui or api"` на Python 3.11 в `ubuntu-latest`;
- собирает артефакт `allure-results` (даже если тесты помечены `skip`);
- работает по событию `push`/`pull_request` в ветку `main`.

При появлении реальных стендов добавь в Secrets (`PPTM_UI_BASE_URL`, `PPTM_API_BASE_URL`) и workflow начнёт выполнять smoke-сценарии без `skip`.

## Docker

`Dockerfile` и `docker-compose.yml` позволяют запускать pytest внутри контейнера с предустановленным Chrome.

```bash
# 1. Собрать образ
docker compose build tests

# 2. Запустить один прогон
PPTM_UI_BASE_URL=https://demo-ui.example.com \
PPTM_API_BASE_URL=https://demo-api.example.com \
docker compose run --rm tests
```

По умолчанию compose прокидывает базовые URL на `host.docker.internal` (удобно, если UI/API мок запущены локально). Результаты Allure будут собираться в `./allure-results` благодаря volume.

> На macOS 12 (Monterey) Docker Desktop больше не поддерживается. Можно использовать альтернативы вроде [Colima](https://github.com/abiosoft/colima), после чего команды `docker compose …` работают так же.

При отсутствии настроенного API (значение по умолчанию `http://localhost:8000`) тест помечается `skip`, чтобы пайплайн оставался зелёным до появления стенда.

