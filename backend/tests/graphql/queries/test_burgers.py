import re

import requests_mock

from hhb_backend.graphql import settings
from tests.utils.mock_utils import get_by_filter_or_fallback

mock_burgers = {
    1: {
        "achternaam": "pieterson",
        "bsn": 285278939,
        "email": None,
        "geboortedatum": None,
        "huishouden_id": 1,
        "huisnummer": None,
        "iban": None,
        "id": 1,
        "plaatsnaam": None,
        "postcode": None,
        "straatnaam": None,
        "telefoonnummer": None,
        "voorletters": None,
        "voornamen": "piet pieter"
    },
    2: {
        "achternaam": "klaasen",
        "bsn": 914304057,
        "email": None,
        "geboortedatum": None,
        "huishouden_id": 2,
        "huisnummer": None,
        "iban": None,
        "id": 2,
        "plaatsnaam": None,
        "postcode": None,
        "straatnaam": None,
        "telefoonnummer": None,
        "voorletters": None,
        "voornamen": "kees"
    },
    3: {
        "achternaam": "hansen",
        "bsn": 356948705,
        "email": None,
        "geboortedatum": None,
        "huishouden_id": 3,
        "huisnummer": None,
        "iban": None,
        "id": 3,
        "plaatsnaam": None,
        "postcode": None,
        "straatnaam": None,
        "telefoonnummer": None,
        "voorletters": None,
        "voornamen": "henk"
    }
}
mock_rekeningen = {
    10: {
        "afdelingen": [],
        "afspraken": [],
        "burgers": [3],
        "iban": "NL21ABNA3184752488",
        "id": 10,
        "rekeninghouder": "pier"
    }
}
mock_afspraken = {
    100: {
        "id": 100,
        "burger_id": 1,
        "omschrijving": "",
        "valid_from": "",
        "valid_through": "",
        "bedrag": "12.34",
        "credit": True,
        "zoektermen": [
            "zoekterm1", "zoekterm2"
        ]
    },
    101: {
        "id": 101,
        "burger_id": 2,
        "omschrijving": "",
        "valid_from": "",
        "valid_through": "2022-07-04",
        "bedrag": "12.34",
        "credit": True,
        "zoektermen": [
            "zoekterm1", "zoekterm2"
        ]
    }
}
mock_empty = {"data": []}


def get_burgers(request, _context):
    return get_by_filter_or_fallback(request, mock_burgers)


def get_rekeningen(request, _context):
    return get_by_filter_or_fallback(request, mock_rekeningen)


def get_afspraken(request, _context):
    return get_by_filter_or_fallback(request, mock_afspraken)


def test_burgers_success(client):
    with requests_mock.Mocker() as rm:
        adapter = rm.get(f"{settings.HHB_SERVICES_URL}/burgers/",
                         json={"data": [{"id": 1, "email": "a@b.c"}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ burgers { email }}"}',
            content_type='application/json'
        )

        assert adapter.call_count == 1
        assert response.json == {'data': {'burgers': [{'email': 'a@b.c'}]}}


def test_burgers_paged_success(client):
    with requests_mock.Mocker() as rm:
        adapter = rm.get(
            f"{settings.HHB_SERVICES_URL}/burgers/",
            json={
                'count': 12, 'data': [{'email': 'a@b.c', 'id': 1}, {'email': 'test@test.com', 'id': 2}],
                'limit': 2, 'next': '?start=3&limit=2', 'previous': '', 'start': 1
            }
        )
        response = client.post(
            "/graphql",
            data='{"query": "{ burgersPaged(start:1, limit:2) {burgers{email}pageInfo{count, start, limit}}}"}',
            content_type='application/json'
        )

        assert adapter.call_count == 1
        assert response.json == {
            'data': {'burgersPaged': {'burgers': [{'email': 'a@b.c'}, {'email': 'test@test.com'}],
                                      'pageInfo': {'count': 12, 'limit': 2, 'start': 1}}}
        }


def test_burger_success(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/burgers/",
               json={'data': [{'id': 1, 'email': 'a@b.c'}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ burger(id:1) { email }}"}',
            content_type='application/json'
        )
        assert response.json == {'data': {'burger': {'email': 'a@b.c'}}}


def test_burger_afspraken(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/burgers/",
               json={'data': [{'id': 1, 'afspraken': [1]}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/",
               json={'data': [{'id': 1, "burger_id": 1}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ burger(id:1) { afspraken { id } } }"}',
            content_type='application/json'
        )
        assert response.json == {
            'data': {'burger': {'afspraken': [{'id': 1}]}}}


def test_burger_rekeningen(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/burgers/",
               json={'data': [{'id': 1, 'rekeningen': [1]}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/",
               json={'data': [{'id': 1, "burgers": [1]}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ burger(id:1) { rekeningen { id } } }"}',
            content_type='application/json'
        )
        assert response.json == {
            'data': {'burger': {'rekeningen': [{'id': 1}]}}}


def test_burgers_search(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = {'data': {'burgers': [
            {'achternaam': 'klaasen',
             'id': 2,
             'voornamen': 'kees'}
        ]}}

        fallback = rm.register_uri(
            requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(
            re.compile(f"{settings.HHB_SERVICES_URL}/burgers",),
            json={'data':
                  [{'achternaam': 'klaasen',
                    'id': 2,
                    'voornamen': 'kees'}
                   ]}
        )
        rm4 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")

        response = client.post(
            "/graphql",
            json={
                "query": """
                    query test($search:String!) {
                      burgers(search:$search) {
                        id
                        voornamen
                        achternaam
                      }
                    }""",
                "variables": {"search": "klaasen"},
            },
        )

        # assert
        assert rm1.call_count == 1
        assert rm4.call_count == 1
        assert fallback.call_count == 0
        assert response.json == expected