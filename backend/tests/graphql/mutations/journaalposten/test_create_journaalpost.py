import pytest
import requests_mock
from hhb_backend.graphql import settings

mock_afspraken = {"data": [
    {"id": 11, "grootboekrekening_id": "m12"},
]}
mock_grootboekrekeningen = {"data": [
    {"id": "m1", "naam": "inkomsten", "children": ["m12"]},
    {"id": "m12", "naam": "salaris", "parent_id": "m1"},
]}
mock_bank_transactions = {"data": [
    {"id": 31}
]}


def setup_services(mock):
    afspraken_adapter = mock.get(f"{settings.HHB_SERVICES_URL}/afspraken/",
                                 json=mock_afspraken)
    grootboekrekeningen_adapter = mock.get(f"{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/",
                                           json=mock_grootboekrekeningen)
    joornaalposten_adapter = mock.post(f"{settings.HHB_SERVICES_URL}/journaalposten/",
                                       json=lambda request, context: {
                                           "data": {
                                               "id": 23,
                                               "transaction_id": request.json()["transaction_id"],
                                               "grootboekrekening_id": request.json()["grootboekrekening_id"]
                                           }
                                       })
    bank_transactions_adapter = mock.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/",
                                         json=mock_bank_transactions)
    return {"afspraken": afspraken_adapter, "transacties": bank_transactions_adapter,
            "grootboekrekeningen": grootboekrekeningen_adapter, "journaalposten": joornaalposten_adapter}


def test_create_journaalpost_grootboekrekening(client):
    with requests_mock.Mocker() as mock:
        adapters = setup_services(mock)

        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($input:CreateJournaalpostGrootboekrekeningInput!) {
  createJournaalpostGrootboekrekening(input:$input) {
    ok
    journaalpost {
      id
      grootboekrekening { id }
      transaction { id }
      afspraak { id }
    }
  }
}''',
                "variables": {"input": {"transactionId": 31, "grootboekrekeningId": "m12"}}},
            content_type='application/json'
        )
        assert response.json == {"data": {
            "createJournaalpostGrootboekrekening": {
                "ok": True,
                "journaalpost": {
                    "id": 23,
                    "grootboekrekening": {"id": "m12"},
                    "transaction": {"id": 31},
                    "afspraak": None},
            }
        }}
        assert adapters["grootboekrekeningen"].called_once
        assert adapters["journaalposten"].called_once
        assert adapters["transacties"].called_once
        assert not adapters["afspraken"].called


def test_create_journaalpost_grootboekrekening_unknown_transaction(client):
    with requests_mock.Mocker() as mock:
        adapters = setup_services(mock)

        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($input:CreateJournaalpostGrootboekrekeningInput!) {
  createJournaalpostGrootboekrekening(input:$input) {
    ok
    journaalpost {
      id
      grootboekrekening { id }
      transaction { id }
      afspraak { id }
    }
  }
}''',
                "variables": {"input": {"transactionId": 32, "grootboekrekeningId": "m12"}}},
            content_type='application/json'
        )
        assert response.json == {"data": {
            "createJournaalpostGrootboekrekening": None},
            "errors": [{"locations": [{"column": 3, "line": 3}],
                        "message": "transaction not found",
                        "path": ["createJournaalpostGrootboekrekening"]
                        }]
        }
        assert adapters["transacties"].called_once
        assert not adapters["journaalposten"].called
        assert not adapters["grootboekrekeningen"].called
        assert not adapters["afspraken"].called


@pytest.mark.skip("TODO implement grootboekrekening in afspraak")
def test_create_journaalpost_afspraak(client):
    with requests_mock.Mocker() as mock:
        adapters = setup_services(mock)

        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($input:CreateJournaalpostAfspraakInput!) {
  createJournaalpostAfspraak(input:$input) {
    ok
    journaalpost {
      id
      afspraak { id }
      transaction { id }
      afspraak { id }
    }
  }
}''',
                "variables": {"input": {"transactionId": 31, "afspraakId": 11}}},
            content_type='application/json'
        )
        assert response.json == {"data": {
            "createJournaalpostAfspraak": {
                "ok": True,
                "journaalpost": {
                    "id": 23,
                    "afspraak": {"id": 11},
                    "transaction": {"id": 31},
                    "grootboekrekening": {"id": "m12"}},

            }
        }}
        assert adapters["afspraken"].called_once
        assert adapters["journaalposten"].called_once
        assert adapters["transacties"].called_once
        assert adapters["grootboekrekeningen"].called
