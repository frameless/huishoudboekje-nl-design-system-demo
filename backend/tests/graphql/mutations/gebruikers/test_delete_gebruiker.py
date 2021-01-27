import re

import pytest
import requests_mock
from hhb_backend.graphql import settings


def test_delete_gebruiker(client):
    with requests_mock.Mocker() as mock:
        mock.get(f"{settings.HHB_SERVICES_URL}/gebruikers/?filter_ids=1", status_code=200, json={"data":[{"id": 1}]})
        adapter = mock.delete(f"{settings.HHB_SERVICES_URL}/gebruikers/1", status_code=204)

        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($id: Int!) {
  deleteGebruiker(id: $id) {
    ok
  }
}
''',
                "variables": {"id": 1}},
            content_type='application/json'
        )
        assert response.json == {"data": {
            "deleteGebruiker": {
                "ok": True,
            }
        }}
        assert adapter.called_once


def test_delete_gebruiker_error(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.get(f"{settings.HHB_SERVICES_URL}/gebruikers/?filter_ids=1", status_code=404, text="Not found")

        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($id: Int!) {
  deleteGebruiker(id: $id) {
    ok
  }
}
''',
                "variables": {"id": 1}},
            content_type='application/json'
        )
        assert response.json == {"data": {"deleteGebruiker": None},
                                 "errors": [{"locations": [{"column": 3, "line": 3}],
                                             "message": "Upstream API responded: Not found",
                                             "path": ["deleteGebruiker"]}]}
        assert adapter.called_once
