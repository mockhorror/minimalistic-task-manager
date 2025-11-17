from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict

import requests


@dataclass
class ApiResponse:
    status_code: int
    body: Dict[str, Any]

    def assert_status(self, expected_code: int) -> "ApiResponse":
        assert (
            self.status_code == expected_code
        ), f"Ожидали код {expected_code}, получили {self.status_code}: {self.body}"
        return self


class TaskListsClient:
    """Мини-клиент для CRUD операций над листами."""

    def __init__(self, session: requests.Session, base_url: str) -> None:
        self.session = session
        self.base_url = base_url.rstrip("/")

    def _wrap(self, response: requests.Response) -> ApiResponse:
        try:
            body = response.json()
        except ValueError:
            body = {}
        return ApiResponse(response.status_code, body)

    def create_list(self, payload: Dict[str, Any]) -> ApiResponse:
        response = self.session.post(f"{self.base_url}/lists", json=payload)
        return self._wrap(response)

    def get_list(self, list_id: str) -> ApiResponse:
        response = self.session.get(f"{self.base_url}/lists/{list_id}")
        return self._wrap(response)

    def update_list(self, list_id: str, payload: Dict[str, Any]) -> ApiResponse:
        response = self.session.put(f"{self.base_url}/lists/{list_id}", json=payload)
        return self._wrap(response)

    def delete_list(self, list_id: str) -> ApiResponse:
        response = self.session.delete(f"{self.base_url}/lists/{list_id}")
        return self._wrap(response)


def default_list_payload(theme: str = "pilates-princess") -> Dict[str, Any]:
    return {
        "title": "Daily flow checklist",
        "theme": theme,
        "decor_pack": "matcha-garden",
        "tasks": [
            {"text": "Warm-up flow", "done": False},
            {"text": "Deep stretch", "done": False},
        ],
    }

