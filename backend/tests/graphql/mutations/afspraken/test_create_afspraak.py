import requests_mock
from pydash import objects

from hhb_backend.graphql import settings


def create_afpraken_matcher(burger_id: int, interval: dict):
    return lambda request: request.json()["burger_id"] == burger_id and request.json()[
        "interval"] == f'P{interval["jaren"]}Y{interval["maanden"]}M{interval["weken"]}W{interval["dagen"]}D'


def test_create_afspraak_success(client):
    with requests_mock.mock() as m:
        log_request = m.register_uri('POST', f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200,
                                     json={"data": {"id": 1}})
        bad_request = m.register_uri('POST', f"{settings.HHB_SERVICES_URL}/afspraken/",
                                     status_code=400)
        good_request = m.register_uri('POST', f"{settings.HHB_SERVICES_URL}/afspraken/",
                                      additional_matcher=create_afpraken_matcher(1,
                                                                                 {"jaren": 1, "maanden": 2, "weken": 3,
                                                                                  "dagen": 4}),
                                      json={"data": {"id": 1}},
                                      status_code=201)
        response = client.post(
            "/graphql",
            json={
                "query": '''
            mutation test($input:AfspraakInput!) {
              createAfspraak(input:$input) {
                ok
                afspraak {
                  id
                }
              }
            }''',
                "variables": {
                    "input": {"burgerId": 1,
                              "credit": 0,
                              }}},
        )
        assert not bad_request.called
        assert good_request.called_once
        # assert log_request.called_once
        assert objects.get(response.json, 'errors') == None
        assert response.json == {"data": {"createAfspraak": {'ok': True, 'afspraak': {'id': 1}}}}


def test_create_afspraak_failure(client):
    with requests_mock.mock() as m:
        log_request = m.register_uri('POST', f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200,
                                     json={"data": {"id": 1}})

        bad_request = m.register_uri('POST', f"{settings.HHB_SERVICES_URL}/afspraken/",
                                     status_code=400)
        good_request = m.register_uri('POST', f"{settings.HHB_SERVICES_URL}/afspraken/",
                                      additional_matcher=create_afpraken_matcher(1,
                                                                                 {"jaren": 1, "maanden": 2, "weken": 3,
                                                                                  "dagen": 4}),
                                      json={"data": {"id": 1}},
                                      status_code=201)
        response = client.post(
            "/graphql",
            json={
                "query": '''
            mutation test($input:AfspraakInput!) {
              createAfspraak(input:$input) {
                ok
                afspraak {
                  id
                }
              }
            }''',
                "variables": {
                    "input": {"burgerId": 2,
                              "interval": {"jaren": 1, "maanden": 2, "weken": 3, "dagen": 4},
                              "credit": 0,
                              "aantalBetalingen": 1,
                              "startDatum": "2021-01-01",
                              "automatischeIncasso": 0}}},
        )
        assert not log_request.called
        assert bad_request.called_once
        assert not good_request.called
        assert objects.get(response.json, 'errors') != None
        assert objects.get(response.json, 'data.createAfspraak') == None


def test_create_afspraak_incorrect(client):
    with requests_mock.mock() as m:
        log_request = m.register_uri('POST', f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200,
                                     json={"data": {"id": 1}})
        bad_request = m.register_uri('POST', f"{settings.HHB_SERVICES_URL}/afspraken/",
                                     status_code=400)
        good_request = m.register_uri('POST', f"{settings.HHB_SERVICES_URL}/afspraken/",
                                      additional_matcher=create_afpraken_matcher(1,
                                                                                 {"jaren": 0, "maanden": 0, "weken": 0,
                                                                                  "dagen": 0}),
                                      json={"data": {"id": 1}},
                                      status_code=201)
        response = client.post(
            "/graphql",
            json={
                "query": '''
            mutation test($input:AfspraakInput!) {
              createAfspraak(input:$input) {
                ok
                afspraak {
                  id
                }
              }
            }''',
                "variables": {
                    "input": {"burgerId": 1,
                              "interval": {"jaren": 0, "maanden": 0, "weken": 0, "dagen": 0},
                              "credit": 0,
                              "aantalBetalingen": 0,
                              "startDatum": "2021-01-01",
                              "automatischeIncasso": 0}}},
        )
        assert not bad_request.called
        assert response.json['errors'][0]['message'] == 'Interval en aantal betalingen kan niet allebei nul zijn.'
