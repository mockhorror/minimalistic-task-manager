import pytest

from tests.api.clients.task_lists import default_list_payload


@pytest.mark.api
@pytest.mark.smoke
def test_task_list_crud_flow(task_lists_client, api_base_url, faker):
    """Smoke: CRUD листа задач."""
    if api_base_url.startswith("http://localhost"):
        pytest.skip(
            "API base URL не настроен. Установи PPTM_API_BASE_URL на стенд."
        )

    theme = faker.random_element(
        ["pilates-princess", "matcha-garden", "beach-episode"]
    )
    payload = default_list_payload(theme=theme)

    created = task_lists_client.create_list(payload).assert_status(201)
    list_id = created.body.get("id")
    assert list_id, f"API не вернул идентификатор листа: {created.body}"

    fetched = task_lists_client.get_list(list_id).assert_status(200)
    assert fetched.body["theme"] == theme
    assert len(fetched.body.get("tasks", [])) == len(payload["tasks"])

    updated_payload = {**payload, "title": "Sunrise checklist"}
    task_lists_client.update_list(list_id, updated_payload).assert_status(200)

    updated = task_lists_client.get_list(list_id).assert_status(200)
    assert updated.body["title"] == "Sunrise checklist"

    task_lists_client.delete_list(list_id).assert_status(204)

