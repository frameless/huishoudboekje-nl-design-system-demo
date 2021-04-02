import pytest
import requests_mock
from pydash import objects

from hhb_backend.graphql import settings
from tests import post_echo, post_echo_with_id

create_afspraak_input = {"burgerId": 1, "credit": False, "organisatieId": 1, "tegenRekeningId": 1,
                         "rubriekId": 1,
                         "omschrijving": "Omschrijving", "bedrag": "0.00"}


def test_create_afspraak_success(client):
    with requests_mock.mock() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)
        log_post = mock.register_uri('POST', f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200,
                                     json=post_echo)
        afspraken_post = mock.register_uri('POST', f"{settings.HHB_SERVICES_URL}/afspraken/",
                                           json=post_echo_with_id(0),
                                           status_code=201)
        response = client.post(
            "/graphql",
            json={
                "query": '''
            mutation test($input:CreateAfspraakInput!) {
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
                              "organisatieId": 1,
                              "tegenRekeningId": 1,
                              "rubriekId": 1,
                              "omschrijving": "",
                              "bedrag": "0.00"
                              }}},
        )
        assert objects.get(response.json, 'errors') == None
        assert response.json == {"data": {"createAfspraak": {'ok': True, 'afspraak': {'id': 1}}}}
        assert afspraken_post.called_once

        # No leftover calls
        assert log_post.called_once
        assert not post_any.called
        assert not get_any.called


@pytest.mark.parametrize(["input", "error_message_contains"], [
    ("burgerId", 'In field "burgerId": Expected "Int!", found null.',),
    ("credit", 'In field "credit": Expected "Boolean!", found null.',),
    ("organisatieId", 'In field "organisatieId": Expected "Int!", found null.',),
    ("tegenRekeningId", 'In field "tegenRekeningId": Expected "Int!", found null.',),
    ("rubriekId", 'In field "rubriekId": Expected "Int!", found null.',),
    ("omschrijving", 'In field "omschrijving": Expected "String!", found null.',),
    ("bedrag", 'In field "bedrag": Expected "Bedrag!", found null.',),
])
def test_create_afspraak_validation(client, field: str, error_message_contains: str):
    with requests_mock.mock() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)

        response = client.post(
            "/graphql",
            json={
                "query": '''
            mutation test($input:CreateAfspraakInput!) {
              createAfspraak(input:$input) {
                ok
                afspraak {
                  id
                }
              }
            }''',
                "variables": {
                    "input": objects.omit(create_afspraak_input, [field])}},
        )
        assert error_message_contains in objects.get(response.json, 'errors[0].message')

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


@pytest.mark.parametrize(["post_status", "post_message", "error_message_contains"], [
    (409, 'Database error', 'Upstream API responded: Database error',),
    (400, 'Bad request', 'Upstream API responded: Bad request',),
])
def test_create_afspraak_validation(client, post_status: int, post_message: str, error_message_contains: str):
    with requests_mock.mock() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)

        log_post = mock.register_uri('POST', f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200,
                                     json=post_echo)
        afspraken_post = mock.register_uri('POST', f"{settings.HHB_SERVICES_URL}/afspraken/",
                                           status_code=post_status,
                                           text=post_message,
                                           )

        response = client.post(
            "/graphql",
            json={
                "query": '''
            mutation test($input:CreateAfspraakInput!) {
              createAfspraak(input:$input) {
                ok
                afspraak {
                  id
                }
              }
            }''',
                "variables": {
                    "input": create_afspraak_input}},
        )
        assert error_message_contains in objects.get(response.json, 'errors[0].message')
        assert afspraken_post.called_once

        # No leftover calls
        assert not log_post.called
        assert not post_any.called
        assert not get_any.called


@pytest.mark.skip  # TODO rewrite for betaalinstructie
def test_create_afspraak_incorrect(client):
    def create_afpraken_matcher(burger_id: int, interval: dict):
        return lambda request: request.json()["burger_id"] == burger_id and request.json()[
            "interval"] == f'P{interval["jaren"]}Y{interval["maanden"]}M{interval["weken"]}W{interval["dagen"]}D'

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
            mutation test($input:CreateAfspraakInput!) {
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
