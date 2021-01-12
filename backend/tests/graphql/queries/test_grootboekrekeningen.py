import re

import pytest
import requests_mock
from hhb_backend.graphql import settings

mock_inkomsten = {"id": "m1", "naam": "inkomsten", "children": ["m12"], "debet": False}
mock_salaris = {"id": "m12", "naam": "salaris", "parent_id": "m1", "debet": False}
mock_huur = {"id": "m21", "naam": "huur", "debet": True}
mock_data = {"data": [
    mock_inkomsten,
    mock_salaris,
    mock_huur,
]}
mock_rubriek = {
    "afspraken": [
        3
    ],
    "grootboekrekening_id": "m1",
    "id": 2,
    "naam": "Rubriek 1"
}


def test_grootboekrekeningen(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.get(f"{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/", json=mock_data)
        response = client.post(
            "/graphql",
            data='{"query": "query test { grootboekrekeningen { id naam }}"}',
            content_type='application/json'
        )
        assert adapter.called_once
        assert response.json == {"data": {"grootboekrekeningen": [
            {"id": "m1", "naam": "inkomsten"},
            {"id": "m12", "naam": "salaris"},
            {"id": "m21", "naam": "huur"},
        ]}}


def test_grootboekrekeningen_children(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.get(f"{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/", json=mock_data)
        filter_adapter = mock.get(
            re.compile(f'{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/\?filter_ids=\w+(?:,\w+)*'),
            json={"data": [mock_inkomsten]})
        response = client.post(
            "/graphql",
            data='{"query": "query test { grootboekrekeningen { id naam children { id naam }}}"}',
            content_type='application/json'
        )
        assert adapter.called_once
        assert filter_adapter.call_count == 0
        assert response.json == {"data": {"grootboekrekeningen": [
            {"id": "m1", "naam": "inkomsten", "children": [{"id": "m12", "naam": "salaris"}]},
            {"id": "m12", "naam": "salaris", "children": None},
            {"id": "m21", "naam": "huur", "children": None},
        ]}}


def test_grootboekrekeningen_with_ids(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.get(f'{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/?filter_ids=m1,m12',
                           json=mock_data)
        response = client.post(
            "/graphql",
            data='{"query":"query test($ids:[String!]){ grootboekrekeningen(ids: $ids) { id naam children { id naam } } }","variables":{"ids":["m1","m12"]}}',
            content_type='application/json'
        )
        assert adapter.call_count == 1
        assert response.json == {"data": {"grootboekrekeningen": [
            {"id": "m1", "naam": "inkomsten",
             "children": [{"id": "m12", "naam": "salaris"}]},
            {"id": "m12", "naam": "salaris", "children": None},
        ]}}


def test_grootboekrekening_by_id(client):
    with requests_mock.Mocker() as mock:
        inkomsten_adapter = mock.get(f'{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/?filter_ids=m1',
                                     json={"data": [mock_inkomsten]})
        response = client.post(
            "/graphql",
            data='{"query":"query test($id:String!){ grootboekrekening(id: $id) { id naam } }","variables":{"id":"m1"}}',
            content_type='application/json'
        )
        assert inkomsten_adapter.called_once
        assert response.json == {"data": {"grootboekrekening":
                                              {"id": "m1", "naam": "inkomsten"},

                                          }}


def test_grootboekrekening_with_children(client):
    with requests_mock.Mocker() as mock:
        inkomsten_adapter = mock.get(f'{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/?filter_ids=m1',
                                     json={"data": [mock_inkomsten]})
        salaris_adapter = mock.get(f'{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/?filter_ids=m12',
                                   json={"data": [mock_salaris]})
        response = client.post(
            "/graphql",
            data='{"query":"query test($id:String!){ grootboekrekening(id: $id) { id naam children { id naam } } }","variables":{"id":"m1"}}',
            content_type='application/json'
        )
        assert inkomsten_adapter.called_once
        assert salaris_adapter.called_once
        assert response.json == {"data": {"grootboekrekening":
                                              {"id": "m1", "naam": "inkomsten",
                                               "children": [{"id": "m12", "naam": "salaris"}]},
                                          }}


def test_grootboekrekening_with_parent(client):
    with requests_mock.Mocker() as mock:
        inkomsten_adapter = mock.get(f'{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/?filter_ids=m1',
                                     json={"data": [mock_inkomsten]})
        salaris_adapter = mock.get(f'{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/?filter_ids=m12',
                                   json={"data": [mock_salaris]})
        response = client.post(
            "/graphql",
            data='{"query":"query test($id:String!){ grootboekrekening(id: $id) { id naam parent { id naam } } }","variables":{"id":"m12"}}',
            content_type='application/json'
        )
        assert inkomsten_adapter.called_once
        assert salaris_adapter.called_once
        assert response.json == {"data": {"grootboekrekening":
                                              {"id": "m12", "naam": "salaris",
                                               "parent": {"id": "m1", "naam": "inkomsten"}}
                                          }}


def test_grootboekrekeningen_rubriek(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.get(f"{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/", json=mock_data)
        filter_adapter = mock.get(
            re.compile(f'{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/\?filter_ids=\w+(?:,\w+)*'),
            json={"data": [mock_inkomsten]})
        hhb_adapter = mock.get(
            re.compile(f'{settings.HHB_SERVICES_URL}/rubrieken/\?filter_grootboekrekeningen=\w+(?:,\w+)*'),
            json={"data": [mock_rubriek]})
        response = client.post(
            "/graphql",
            data='{"query":"query test($id:String!){ grootboekrekening(id: $id) { id rubriek { id naam }} }","variables":{"id":"m1"}}',
            content_type='application/json'
        )
        assert adapter.call_count == 0
        assert filter_adapter.called_once
        assert hhb_adapter.called_once
        assert response.json == {'data': {'grootboekrekening': {'id': 'm1', 'rubriek': {'id': 2, 'naam': 'Rubriek 1'}}}}

def test_grootboekrekeningen_credit_transform(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.get(f"{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/", json=mock_data)
        response = client.post(
            "/graphql",
            data='{"query": "query test { grootboekrekeningen { id naam credit }}"}',
            content_type='application/json'
        )
        assert adapter.called_once
        assert response.json == {"data": {"grootboekrekeningen": [
            {"id": "m1", "naam": "inkomsten", "credit": True},
            {"id": "m12", "naam": "salaris", "credit": True},
            {"id": "m21", "naam": "huur", "credit": False},
        ]}}

