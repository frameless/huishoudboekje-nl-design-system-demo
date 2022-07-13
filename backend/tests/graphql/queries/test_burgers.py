import requests_mock
from hhb_backend.graphql import settings


def test_burgers_success(client):
    with requests_mock.Mocker() as rm:
        adapter = rm.get(f"{settings.HHB_SERVICES_URL}/burgers/", json={"data": [{"id": 1, "email": "a@b.c"}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ burgers { email }}"}',
            content_type='application/json'
        )

        assert adapter.called_once
        assert response.json == {'data': {'burgers': [{'email': 'a@b.c'}]}}


def test_burgers_paged_success(client):
    with requests_mock.Mocker() as rm:
        adapter = rm.get(f"{settings.HHB_SERVICES_URL}/burgers/", json={'count': 12, 'data': [{'email': 'a@b.c', 'id': 1}, {'email': 'test@test.com', 'id': 2}], 'limit': 2, 'next': '?start=3&limit=2', 'previous': '', 'start': 1})
        response = client.post(
            "/graphql",
            data='{"query": "{ burgersPaged(start:1, limit:2) {burgers{email}pageInfo{count, start, limit}}}"}',
            content_type='application/json'
        )

        assert adapter.called_once
        assert response.json == {'data': {'burgersPaged': {'burgers': [{'email': 'a@b.c'},
                                       {'email': 'test@test.com'}],
                           'pageInfo': {'count': 12, 'limit': 2, 'start': 1}}}}


def test_burger_success(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/burgers/", json={'data': [{'id': 1, 'email': 'a@b.c'}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ burger(id:1) { email }}"}',
            content_type='application/json'
        )
        assert response.json == {'data': {'burger': {'email': 'a@b.c'}}}

def test_burger_afspraken(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/burgers/", json={'data': [{'id': 1, 'afspraken': [1]}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", json={'data': [{'id': 1, "burger_id": 1}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ burger(id:1) { afspraken { id } } }"}',
            content_type='application/json'
        )
        assert response.json == {'data': {'burger': {'afspraken': [{'id': 1}]}}}


def test_burger_rekeningen(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/burgers/", json={'data': [{'id': 1, 'rekeningen': [1]}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/", json={'data': [{'id': 1, "burgers": [1]}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ burger(id:1) { rekeningen { id } } }"}',
            content_type='application/json'
        )
        assert response.json == {'data': {'burger': {'rekeningen': [{'id': 1}]}}}

mock_burger_data = {
            "data": [
                {
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
                {
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
                {
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
            ]
        }
mock_rekeningen_data = {
    "data": [
        {
            "afdelingen": [],
            "afspraken": [],
            "burgers": [3],
            "iban": "NL21ABNA3184752488",
            "id": 10,
            "rekeninghouder": "pier"
        }
    ]
}
mock_afspraken_data = {
    "data": [
        {
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
        }
    ]
}
mock_empty = {"data": []}

def test_burgers_search_single_voornaam(client):
    with requests_mock.Mocker() as rm:
        # arrange
        request = '{"query": "{ burgers(search:piet){id,bsn,voornamen,achternaam} }"}'
        expected = {'data': {'burgers': [
            {'achternaam': 'pieterson',
            'bsn': 285278939,
            'id': 1,
            'voornamen': 'piet pieter'}
        ]}}

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/burgers/", status_code=200, json=mock_burger_data)
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/", status_code=200, json=mock_empty)
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", status_code=200, json=mock_empty)
        rm4 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)

        # act
        response = client.post("/graphql", data=request, content_type='application/json')

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert fallback.call_count == 0
        assert response.json == expected

def test_burgers_search_single_achternaam(client):
    with requests_mock.Mocker() as rm:
        # arrange
        request = '{"query": "{ burgers(search:klaasen){id,bsn,voornamen,achternaam} }"}'
        expected = {'data': {'burgers': [
            {'achternaam': 'klaasen',
            'bsn': 914304057,
            'id': 2,
            'voornamen': 'kees'}
        ]}}
        
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/burgers/", status_code=200, json=mock_burger_data)
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/", status_code=200, json=mock_empty)
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", status_code=200, json=mock_empty)
        rm4 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)

        # act
        response = client.post("/graphql", data=request, content_type='application/json')

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert fallback.call_count == 0
        assert response.json == expected

def test_burgers_search_single_bsn(client):
    with requests_mock.Mocker() as rm:
        # arrange
        request = '{"query": "{ burgers(search:939){id,bsn,voornamen,achternaam} }"}'
        expected = {'data': {'burgers': [
            {'achternaam': 'pieterson',
            'bsn': 285278939,
            'id': 1,
            'voornamen': 'piet pieter'}
        ]}}

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/burgers/", status_code=200, json=mock_burger_data)
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/", status_code=200, json=mock_empty)
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", status_code=200, json=mock_empty)
        rm4 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)

        # act
        response = client.post("/graphql", data=request, content_type='application/json')

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert fallback.call_count == 0
        assert response.json == expected

def test_burgers_search_single_iban(client):
    with requests_mock.Mocker() as rm:
        # arrange
        request = '{"query": "{ burgers(search:NL21ABNA3184752488){id,bsn,voornamen,achternaam} }"}'
        expected = {'data': {'burgers': [
             {'achternaam': 'hansen',
            'bsn': 356948705,
            'id': 3,
            'voornamen': 'henk'}
        ]}}

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/burgers/", status_code=200, json=mock_burger_data)
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/", status_code=200, json=mock_rekeningen_data)
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", status_code=200, json=mock_empty)
        rm4 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)

        # act
        response = client.post("/graphql", data=request, content_type='application/json')

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert fallback.call_count == 0
        assert response.json == expected

def test_find_one_burger_after_zoekterm_search_single_afspraak(client):
    with requests_mock.Mocker() as rm:
        # arrange
        request = '{"query": "{ burgers(search:zoekterm1){id,bsn,voornamen,achternaam} }"}'
        expected = {'data': {'burgers': [
            {'achternaam': 'pieterson',
            'bsn': 285278939,
            'id': 1,
            'voornamen': 'piet pieter'}
        ]}}

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/burgers/", status_code=200, json=mock_burger_data)
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/", status_code=200, json=mock_empty)
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", status_code=200, json=mock_afspraken_data)
        rm4 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)

        # act
        response = client.post("/graphql", data=request, content_type='application/json')

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert fallback.call_count == 0
        assert response.json == expected

def test_find_one_burger_after_zoekterm_search_with_one_invalid_afspraak(client):
    mock_afspraken_data = {
        "data": [
            {
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
            {
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
        ]
    }
    with requests_mock.Mocker() as rm:
        # arrange
        request = '{"query": "{ burgers(search:zoekterm1){id,bsn,voornamen,achternaam} }"}'
        expected = {'data': {'burgers': [
            {'achternaam': 'pieterson',
            'bsn': 285278939,
            'id': 1,
            'voornamen': 'piet pieter'}
        ]}}

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/burgers/", status_code=200, json=mock_burger_data)
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/", status_code=200, json=mock_empty)
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", status_code=200, json=mock_afspraken_data)
        rm4 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)

        # act
        response = client.post("/graphql", data=request, content_type='application/json')

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert fallback.call_count == 0
        assert response.json == expected