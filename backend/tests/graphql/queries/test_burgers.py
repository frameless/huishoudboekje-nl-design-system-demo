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
