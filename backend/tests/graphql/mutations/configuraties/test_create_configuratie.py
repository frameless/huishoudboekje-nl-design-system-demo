import pytest
import requests_mock
from hhb_backend.graphql import settings


def test_create_configuratie(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.post(f"{settings.HHB_SERVICES_URL}/configuratie",
                            json=lambda request, context: {"data": request.json()})
        mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($input:ConfiguratieInput!) {
  createConfiguratie(input:$input) {
    configuratie {
      id
      waarde
    }
  }
}''',
                "variables": {"input": {"id": "32", "waarde": "m12"}}},
        )
        assert adapter.called_once
        assert response.json == {"data": {"createConfiguratie": {"configuratie": {"id": "32", "waarde": "m12"}}}}


def test_create_configuratie_bad_id(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.post(f"{settings.HHB_SERVICES_URL}/configuratie", status_code=400)
        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($input:ConfiguratieInput!) {
  createConfiguratie(input:$input) {
    configuratie {
      id
      waarde
    }
  }
}''',
                "variables": {"input": {"id": "@@", "waarde": "m12"}}},
        )
        assert adapter.called_once
        assert response.json == {'data': {'createConfiguratie': None},
                                 'errors': [
                                     {'locations': [{'column': 3, 'line': 3}],
                                      'message': 'Upstream API responded: ',
                                      'path': ['createConfiguratie']}
                                 ]}
