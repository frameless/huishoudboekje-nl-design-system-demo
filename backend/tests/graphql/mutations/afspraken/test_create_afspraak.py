import pytest
import requests_mock
from freezegun import freeze_time
from pydash import objects
from requests_mock import Adapter

from hhb_backend.graphql import settings
from tests import post_echo


@freeze_time("2021-01-01")
def test_create_afspraak_success(client):
    input = {
        "omschrijving": "test afspraak",
        "burgerId": 1,
        "credit": False,
        "afdelingId": 1,
        "postadresId": "76d67e32-a29c-476c-b3be-cd2cbf2ee437",
        "tegenRekeningId": 1,
        "rubriekId": 1,
        "bedrag": "100.00",
        "validFrom": "2021-01-01",
        "zoektermen": ["test1", "test2"]
    }

    with requests_mock.mock() as rm:
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        hhbsvc_burger = rm.get(f"{settings.HHB_SERVICES_URL}/burgers/?filter_ids=1", json={'data': [{'id': 1}]})
        hhbsvc_rekening = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", json={
            'data': [{
                'id': 1,
                'iban': 'gb33bukb20201555555555',
                'rekeninghouder': 'john'
            }]
        })
        hhbsvc_rubrieken = rm.get(f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=1",
                                  json={'data': [{'id': 1, 'naam': 'Leefgeld'}]})
        orgsvc_afdelingen = rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", json={
            'data': [
                {'id': 1}
            ]
        })
        padsvc_adressen = rm.get(
            f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/?filter_ids=76d67e32-a29c-476c-b3be-cd2cbf2ee437",
            json={
                'data': [{
                    'id': '76d67e32-a29c-476c-b3be-cd2cbf2ee437'
                }]
            }
        )
        logsvc_gebruikersactiviteiten = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        hhbsvc_post_afspraak = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/", status_code=201, json={
            "data": {
                "id": 420,
                "omschrijving": "test afspraak",
                "burger_id": 1,
                "credit": False,
                "afdeling_id": 1,
                "postadres_id": "76d67e32-a29c-476c-b3be-cd2cbf2ee437",
                "tegen_rekening_id": 1,
                "rubriek_id": 1,
                "bedrag": 10000,
                "valid_from": "2021-01-01",
                "zoektermen": ["test1", "test2"]
            }
        })

        response = client.post(
            "/graphql",
            json={
                "query": """
                    mutation test($input:CreateAfspraakInput!) {
                      createAfspraak(input:$input) {
                        ok
                        afspraak {
                          id
                          omschrijving
                          burger { id }
                          credit
                          afdeling { id }
                          postadres { id }
                          tegenRekening { id }
                          rubriek {
                            id
                            naam
                          }
                          bedrag
                          validFrom
                          zoektermen
                        }
                      }
                    }
                """,
                "variables": {
                    "input": input
                }},
        )

        assert hhbsvc_burger.call_count == 2
        assert hhbsvc_post_afspraak.call_count == 1
        assert hhbsvc_rekening.call_count == 2
        assert hhbsvc_rubrieken.call_count == 2
        assert orgsvc_afdelingen.call_count == 2
        assert padsvc_adressen.call_count == 2
        assert logsvc_gebruikersactiviteiten.call_count == 1
        assert fallback.call_count == 0

        assert response.status_code == 200
        assert response.json["data"]["createAfspraak"] == {
            "ok": True,
            "afspraak": {
                "id": 420,
                "omschrijving": input["omschrijving"],
                "burger": {
                    "id": input["burgerId"]
                },
                "credit": False,
                "afdeling": {"id": input["afdelingId"]},
                "postadres": {"id": input["postadresId"]},
                "tegenRekening": {"id": input["tegenRekeningId"]},
                "rubriek": {
                    "id": input["rubriekId"], "naam": "Leefgeld"
                },
                "bedrag": input["bedrag"],
                "validFrom": "2021-01-01",
                "zoektermen": input["zoektermen"],
            }
        }


@pytest.mark.parametrize(["field", "error_message_contains"], [
    ("burgerId", 'In field "burgerId": Expected "Int!", found null.',),
    ("credit", 'In field "credit": Expected "Boolean!", found null.',),
    ("afdelingId", 'In field "afdelingId": Expected "Int!", found null.',),
    ("tegenRekeningId", 'In field "tegenRekeningId": Expected "Int!", found null.',),
    ("rubriekId", 'In field "rubriekId": Expected "Int!", found null.',),
    ("omschrijving", 'In field "omschrijving": Expected "String!", found null.',),
    ("bedrag", 'In field "bedrag": Expected "Bedrag!", found null.',),
])
def test_create_afspraak_validation(client, field: str, error_message_contains: str):
    create_afspraak_input = {
        "omschrijving": "test afspraak",
        "burgerId": 1,
        "credit": False,
        "afdelingId": 1,
        "postadresId": "76d67e32-a29c-476c-b3be-cd2cbf2ee437",
        "tegenRekeningId": 1,
        "rubriekId": 1,
        "bedrag": "0.00",
        "validFrom": "2021-01-01",
        "zoektermen": ["test1", "test2"],
    }

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
        assert not post_any.called
        assert not get_any.called


@pytest.mark.parametrize([
    "post_status", "post_message", "error_message_contains"], [
    (400, 'Bad request', 'Upstream API responded: [400] Bad request',),
    (400, 'Bad request', 'Upstream API responded: [400] Bad request',),
    (409, 'Database error', 'Upstream API responded: [409] Database error',),
    (400, 'Bad request', 'Upstream API responded: [400] Bad request',),
])
def test_create_afspraak_validation(client, post_status: int, post_message: str, error_message_contains: str):
    create_afspraak_input = {
        "omschrijving": "test afspraak",
        "burgerId": 1,
        "credit": False,
        "afdelingId": 1,
        "postadresId": "76d67e32-a29c-476c-b3be-cd2cbf2ee437",
        "tegenRekeningId": 1,
        "rubriekId": 1,
        "bedrag": "0.00",
        "validFrom": "2021-01-01",
        "zoektermen": ["test1", "test2"],
    }

    with requests_mock.mock() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)

        burgers = mock.get(
            f"{settings.HHB_SERVICES_URL}/burgers/?filter_ids=1", text=post_message, status_code=post_status
        )
        rekeningen = mock.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", text=post_message, status_code=post_status
        )
        rubrieken = mock.get(
            f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=1", text=post_message, status_code=post_status
        )
        afdelingen = mock.get(
            f"{settings.HHB_SERVICES_URL}/afdelingen/?filter_ids=1", text=post_message, status_code=post_status
        )
        postaddressen = mock.get(
            f"{settings.HHB_SERVICES_URL}/addresses/?filter_ids=76d67e32-a29c-476c-b3be-cd2cbf2ee437",
            text=post_message, status_code=post_status
        )

        log_post = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json=post_echo)
        afspraken_post = mock.post(
            f"{settings.HHB_SERVICES_URL}/afspraken/", status_code=post_status, text=post_message
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

        # TODO think of a way to validate what's get called how many times (22-10-2021)
        # rekeningen
        # postaddressen
        # assert not log_post.called
        # assert afspraken_post.call_count == 1
        assert not post_any.called
        assert not get_any.called

# @pytest.mark.skip  # TODO rewrite for betaalinstructie (10-02-2021)
# def test_create_afspraak_incorrect(client):
#     def create_afpraken_matcher(burger_id: int, interval: dict):
#         return lambda request: request.json()["burger_id"] == burger_id and request.json()[
#             "interval"] == f'P{interval["jaren"]}Y{interval["maanden"]}M{interval["weken"]}W{interval["dagen"]}D'
#
#     with requests_mock.mock() as m:
#         log_request = m.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
#         bad_request = m.post(f"{settings.HHB_SERVICES_URL}/afspraken/", status_code=400)
#         good_request = m.post(
#             f"{settings.HHB_SERVICES_URL}/afspraken/",
#             additional_matcher=create_afpraken_matcher(1, {"jaren": 0, "maanden": 0, "weken": 0, "dagen": 0}),
#             json={"data": {"id": 1}},
#             status_code=201
#         )
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#             mutation test($input:CreateAfspraakInput!) {
#               createAfspraak(input:$input) {
#                 ok
#                 afspraak {
#                   id
#                 }
#               }
#             }''',
#                 "variables": {
#                     "input": {"burgerId": 1,
#                               "interval": {"jaren": 0, "maanden": 0, "weken": 0, "dagen": 0},
#                               "credit": 0,
#                               "aantalBetalingen": 0,
#                               "startDatum": "2021-01-01",
#                               "automatischeIncasso": 0}}},
#         )
#         assert not bad_request.called
#         assert response.json['errors'][0]['message'] == 'Interval en aantal betalingen kan niet allebei nul zijn.'
