import pytest
import requests_mock
from hhb_backend.graphql import settings


def test_update_configuratie(client):
    with requests_mock.Mocker() as mock:
        mock_get_configuratie = mock.get(
            f"{settings.HHB_SERVICES_URL}/configuratie/?filter_ids=32",
            status_code=200,
            json={"data": [{"id": 32}]},
        )
        adapter = mock.post(
            f"{settings.HHB_SERVICES_URL}/configuratie/32",
            json=lambda request, context: {"data": request.json()},
        )
        response = client.post(
            "/graphql",
            json={
                "query": """
mutation test($input:ConfiguratieInput!) {
  updateConfiguratie(input:$input) {
    configuratie {
      id
      waarde
    }
  }
}""",
                "variables": {"input": {"id": "32", "waarde": "m12"}},
            },
        )
        assert mock_get_configuratie.called_once
        assert adapter.called_once
        assert response.json == {
            "data": {
                "updateConfiguratie": {"configuratie": {"id": "32", "waarde": "m12"}}
            }
        }


def test_update_configuratie_not_found(client):
    with requests_mock.Mocker() as mock:
        mock_get_configuratie = mock.get(
            f"{settings.HHB_SERVICES_URL}/configuratie/?filter_ids=32",
            status_code=200,
            json={"data": []},
        )
        adapter = mock.post(
            f"{settings.HHB_SERVICES_URL}/configuratie/32",
            status_code=404,
            text="Not found",
        )
        response = client.post(
            "/graphql",
            json={
                "query": """
mutation test($input:ConfiguratieInput!) {
  updateConfiguratie(input:$input) {
    configuratie {
      id
      waarde
    }
  }
}""",
                "variables": {"input": {"id": "32", "waarde": "m12"}},
            },
        )
        assert mock_get_configuratie.called_once
        assert adapter.called_once
        assert response.json == {
            "data": {"updateConfiguratie": None},
            "errors": [
                {
                    "locations": [{"column": 3, "line": 3}],
                    "message": "Upstream API responded: Not found",
                    "path": ["updateConfiguratie"],
                }
            ],
        }
