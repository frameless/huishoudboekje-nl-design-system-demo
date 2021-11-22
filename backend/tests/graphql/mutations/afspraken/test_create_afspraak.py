from datetime import datetime
from typing import Text
import pytest
import requests_mock
from requests_mock import Adapter
from pydash import objects

from hhb_backend.graphql import settings
from tests import post_echo, post_echo_with_id
class MockResponse():
    history = None
    raw = None
    is_redirect = None
    content = None

    def __init__(self, json_data, status_code):
        self.json_data = json_data
        self.status_code = status_code

    def json(self):
        return self.json_data

create_afspraak_input = {
  "omschrijving": "test afspraak", 
  "burgerId": 1, 
  "credit": False, 
  "afdelingId": 1, 
  "postadresId": "76d67e32-a29c-476c-b3be-cd2cbf2ee437", 
  "tegenRekeningId": 1,
  "rubriekId": 1,
  "bedrag": "0.00",
  "validFrom": "2021-01-01"
}

def create_mock_adapter() -> Adapter:
    adapter = requests_mock.Adapter()

    def test_matcher(request): 
        if request.path == "/burgers/" and request.query == "filter_ids=1":
          return MockResponse({'data': [{'id': 1}]}, 200)

        elif request.path == "/rekeningen/" and request.query == "filter_ids=1":
          return MockResponse({'data': [{'id': 1, 'iban': 'gb33bukb20201555555555', 'rekeninghouder': 'john'}]}, 200)
        
        elif request.path == "/rubrieken/" and request.query == "filter_ids=1":
          return MockResponse({'data': [{'id': 1}]}, 200)

        elif request.path == "/afdelingen/" and request.query == "filter_ids=1":
          return MockResponse({'data': [{'id': 1}]}, 200)

        elif request.path == "/addresses/" and request.query == "id[]=76d67e32-a29c-476c-b3be-cd2cbf2ee437":
          return MockResponse([{'id': '76d67e32-a29c-476c-b3be-cd2cbf2ee437'}], 200)

        elif request.path == "/afspraken/": # post
          return MockResponse({'data': { 'id': 100 }}, 201)

        elif request.path == "/gebruikersactiviteiten/": #post
          return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter

def test_create_afspraak_success(client):
    with requests_mock.mock() as rm:
      # arrange
      fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
      rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/burgers/?filter_ids=1", status_code=200, json={'data': [{'id': 1}]})
      rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", status_code=200, json={'data': [{'id': 1, 'iban': 'gb33bukb20201555555555', 'rekeninghouder': 'john'}]})
      rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=1", status_code=200, json={'data': [{'id': 1}]})
      rm4 = rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", status_code=200, json={'data': [{'id': 1}]})
      rm5 = rm.get(f"{settings.CONTACTCATALOGUS_SERVICE_URL}/addresses/76d67e32-a29c-476c-b3be-cd2cbf2ee437", status_code=200, json=[{'id': '76d67e32-a29c-476c-b3be-cd2cbf2ee437'}])
      rm6 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/", status_code=201, json={'data': { 'id': 100 }})
      rm7 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)


      # act
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
                    "input": {
                      "omschrijving": "test afspraak",
                      "burgerId": 1,
                      "credit": 0,
                      "afdelingId": 1,
                      "postadresId" : "76d67e32-a29c-476c-b3be-cd2cbf2ee437",
                      "tegenRekeningId": 1,
                      "rubriekId": 1,
                      "bedrag": "0.00",
                      "validFrom": '2021-01-01'
                    }
                }},
        )


      # assert
      assert rm1.called_once
      assert rm2.called_once
      assert rm3.called_once
      assert rm4.called_once
      assert rm5.called_once
      assert rm6.called_once
      assert rm7.called_once
      assert fallback.call_count == 0
      assert response.json["data"]["createAfspraak"]["ok"] is True

def create_mock_adapter_not_found() -> Adapter:
    adapter = requests_mock.Adapter()

    def test_matcher(request): 
        return MockResponse({'text': 'Not found'}, 404)

    adapter.add_matcher(test_matcher)
    return adapter

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
    (400, 'Bad request', 'Upstream API responded: Bad request',),
    (400, 'Bad request', 'Upstream API responded: Bad request',),
    (409, 'Database error', 'Upstream API responded: Database error',),
    (400, 'Bad request', 'Upstream API responded: Bad request',),
])
def test_create_afspraak_validation(client, post_status: int, post_message: str, error_message_contains: str):
    with requests_mock.mock() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)
       
        burgers = mock.register_uri("GET", f"{settings.HHB_SERVICES_URL}/burgers/?filter_ids=1", text=post_message, status_code=post_status,)
        rekeningen = mock.register_uri("GET", f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", text=post_message, status_code=post_status,)
        rubrieken = mock.register_uri("GET", f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=1", text=post_message, status_code=post_status,)
        afdelingen = mock.register_uri("GET", f"{settings.HHB_SERVICES_URL}/afdelingen/?filter_ids=1", text=post_message, status_code=post_status,)
        postaddressen = mock.register_uri("GET", f"{settings.HHB_SERVICES_URL}/addresses/?filter_ids=76d67e32-a29c-476c-b3be-cd2cbf2ee437", text=post_message, status_code=post_status,)
        
        log_post = mock.register_uri('POST', f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200, json=post_echo)
        afspraken_post = mock.register_uri('POST', f"{settings.HHB_SERVICES_URL}/afspraken/", status_code=post_status, text=post_message,)

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
        
        # TODO think of a way to validate what's get called how many times
        # rekeningen
        # postaddressen
        # assert not log_post.called
        # assert afspraken_post.called_once
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
