import requests_mock
from hhb_backend.graphql import settings

mock_afspraken = {"data": [
    {"id": 11, },
]}
mock_grootboekrekeningen = {"data": [
    {"id": "m1", "naam": "inkomsten", "children": ["m12"]},
    {"id": "m12", "naam": "salaris", "parent_id": "m1"},
]}
mock_bank_transactions = {"data": [
    {"id": 31}
]}
mock_journaalposten = {"data": [
    {"id": 21, "grootboekrekening_id": "m1"},
    {"id": 22, "grootboekrekening_id": "m12", "afspraak_id": 11},
    {"id": 23, "grootboekrekening_id": "m12", "transaction_id": 31},
]}


def test_journaalposten(client):
    with requests_mock.Mocker() as mock:
        afspraken_adapter = mock.get(f"{settings.HHB_SERVICES_URL}/afspraken/",
                                               json=mock_afspraken)
        grootboekrekeningen_adapter = mock.get(f"{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/",
                                               json=mock_grootboekrekeningen)
        joornaalposten_adapter = mock.get(f"{settings.HHB_SERVICES_URL}/journaalposten/", json=mock_journaalposten)
        bank_transactions_adapter = mock.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/",
                                             json=mock_bank_transactions)

        response = client.post(
            "/graphql",
            json={"query": '''query test {
            journaalposten { 
                id 
                grootboekrekening { 
                    id 
                }
                transaction { 
                    id
                } 
                afspraak { 
                    id
                } 
            }}'''},
            content_type='application/json'
        )
        assert response.json == {"data": {"journaalposten": [
            {"id": 21, "grootboekrekening": {"id": "m1"}, "afspraak": None, "transaction": None},
            {"id": 22, "grootboekrekening": {"id": "m12"}, "afspraak": {"id": 11}, "transaction": None},
            {"id": 23, "grootboekrekening": {"id": "m12"}, "transaction": {"id": 31}, "afspraak": None},
        ]}}
        assert grootboekrekeningen_adapter.called_once
        assert joornaalposten_adapter.called_once
        assert bank_transactions_adapter.called_once
        assert afspraken_adapter.called_once


def test_journaalpost(client):
    with requests_mock.Mocker() as mock:
        afspraken_adapter = mock.get(f"{settings.HHB_SERVICES_URL}/afspraken/",
                                               json=mock_afspraken)
        grootboekrekeningen_adapter = mock.get(f"{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/",
                                               json=mock_grootboekrekeningen)
        joornaalposten_adapter = mock.get(f"{settings.HHB_SERVICES_URL}/journaalposten/", json=mock_journaalposten)
        bank_transactions_adapter = mock.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/",
                                             json=mock_bank_transactions)

        response = client.post(
            "/graphql",
            json={"query": '''query test($id:Int!) {
            journaalpost(id: $id) { 
                id 
                grootboekrekening { 
                    id 
                }
                transaction { 
                    id
                } 
                afspraak { 
                    id
                } 
            }}''', "variables": {"id": 21}},
            content_type='application/json'
        )
        assert response.json == {"data": {"journaalpost":
            {"id": 21, "grootboekrekening": {"id": "m1"}, "afspraak": None, "transaction": None},
        }}
        assert grootboekrekeningen_adapter.called_once
        assert joornaalposten_adapter.called_once
        assert not bank_transactions_adapter.called
        assert not afspraken_adapter.called
