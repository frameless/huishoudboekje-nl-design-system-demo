import re

import pytest
import requests_mock
from hhb_backend.graphql import settings

# mock_inkomsten = {"id": "m1", "naam": "inkomsten", "children": ["m12"]}
mock_inkomsten = {"id": "m1", "naam": "inkomsten"}
mock_salaris = {"id": "m12", "naam": "salaris", "parent_id": "m1"}
mock_data = {"data": [
    mock_inkomsten,
    mock_salaris,
]}


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
        ]}}



@pytest.mark.skip('TODO enable when the children relationship is re-enabled in grootboek_service')
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
        ]}}


@pytest.mark.skip('TODO enable when the children relationship is re-enabled in grootboek_service')
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


@pytest.mark.skip('TODO enable when the children relationship is re-enabled in grootboek_service')
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
                                              {"id": "m12", "naam": "salaris", "parent": {"id": "m1", "naam": "inkomsten"}}
                                          }}
