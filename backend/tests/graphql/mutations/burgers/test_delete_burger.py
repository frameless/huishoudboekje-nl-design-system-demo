import re

import pytest
import requests_mock
from hhb_backend.graphql import settings


def test_delete_burger(client):
    with requests_mock.Mocker() as mock:
        mock.get(f"{settings.HHB_SERVICES_URL}/burgers/?filter_ids=1", status_code=200, json={"data":[{"id": 1}]})
        mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
        adapter = mock.delete(f"{settings.HHB_SERVICES_URL}/burgers/1", status_code=204)

        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($id: Int!) {
  deleteBurger(id: $id) {
    ok
  }
}
''',
                "variables": {"id": 1}},
            content_type='application/json'
        )
        assert response.json == {"data": {
            "deleteBurger": {
                "ok": True,
            }
        }}
        assert adapter.called_once


def test_delete_burger_error(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.get(f"{settings.HHB_SERVICES_URL}/burgers/?filter_ids=1", status_code=404, text="Not found")

        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($id: Int!) {
  deleteBurger(id: $id) {
    ok
  }
}
''',
                "variables": {"id": 1}},
            content_type='application/json'
        )
        assert response.json == {"data": {"deleteBurger": None},
                                 "errors": [{"locations": [{"column": 3, "line": 3}],
                                             "message": "Upstream API responded: Not found",
                                             "path": ["deleteBurger"]}]}
        assert adapter.called_once
