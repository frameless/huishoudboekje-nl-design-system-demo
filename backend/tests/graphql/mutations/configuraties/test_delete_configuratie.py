import re

import pytest
import requests_mock
from hhb_backend.graphql import settings


def test_delete_configuratie(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.delete(f"{settings.HHB_SERVICES_URL}/configuratie/1", status_code=200)

        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($id: String!) {
  deleteConfiguratie(id: $id) {
    ok
  }
}
''',
                "variables": {"id": "1"}},
            content_type='application/json'
        )
        assert response.json == {"data": {
            "deleteConfiguratie": {
                "ok": True,
            }
        }}
        assert adapter.called_once


def test_delete_configuratie_error(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.delete(f"{settings.HHB_SERVICES_URL}/configuratie/1", status_code=404, text="Not found")

        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($id: String!) {
  deleteConfiguratie(id: $id) {
    ok
  }
}
''',
                "variables": {"id": "1"}},
            content_type='application/json'
        )
        assert response.json == {"data": {"deleteConfiguratie": None},
                                 "errors": [{"locations": [{"column": 3, "line": 3}],
                                             "message": "Upstream API responded: Not found",
                                             "path": ["deleteConfiguratie"]}]}
        assert adapter.called_once
