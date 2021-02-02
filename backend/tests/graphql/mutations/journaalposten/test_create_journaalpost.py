import re

import pytest
import requests_mock
from hhb_backend.graphql import settings

mock_afspraken = {
    "data": [
        {"id": 11, "grootboekrekening_id": "m12", "credit": True},
        {"id": 12, "grootboekrekening_id": "m2", "credit": False},
    ]
}
mock_grootboekrekeningen = {
    "data": [
        {"id": "m1", "naam": "inkomsten", "children": ["m12"], "credit": True},
        {"id": "m12", "naam": "salaris", "parent_id": "m1", "credit": True},
        {"id": "m2", "naam": "uitgaven", "is_credit": False},
    ]
}
mock_bank_transactions = {
    "data": [
        {"id": 31, "is_credit": True},
        {"id": 32, "is_credit": False},
        {"id": 33, "is_credit": False},
    ]
}

journaalposten = dict()


def journaalpost_id_counter():
    global journaalposten
    journaalposten_ids = [j["id"] for j in journaalposten.values()]
    return max(journaalposten_ids, default=22) + 1


def create_journaalpost_service(request, context):
    global journaalposten
    journaalpost = request.json()

    journaalpost["id"] = journaalpost_id_counter()
    journaalposten[journaalpost["transaction_id"]] = journaalpost
    return {"data": journaalpost}


def get_journaalposten(request, context):
    global journaalposten
    return {"data": [j for j in journaalposten.values()]}


def setup_services(mock):
    global journaalposten
    journaalposten = dict()

    journaalposten[33] = {"id": 22, "afspraak_id": 12, "transaction_id": 33}

    afspraken_adapter = mock.get(
        f"{settings.HHB_SERVICES_URL}/afspraken/", json=mock_afspraken
    )
    grootboekrekeningen_adapter = mock.get(
        f"{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/",
        json=mock_grootboekrekeningen,
    )
    journaalposten_get_adapter = mock.get(
        f"{settings.HHB_SERVICES_URL}/journaalposten/",
        json=get_journaalposten,
    )
    joornaalposten_adapter = mock.post(
        f"{settings.HHB_SERVICES_URL}/journaalposten/", json=create_journaalpost_service
    )
    bank_transactions_adapter = mock.get(
        f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/",
        json=mock_bank_transactions,
    )
    return {
        "afspraken": afspraken_adapter,
        "transacties": bank_transactions_adapter,
        "grootboekrekeningen": grootboekrekeningen_adapter,
        "journaalposten": joornaalposten_adapter,
        "journaalposten_get": journaalposten_get_adapter,
    }


def test_create_journaalpost_grootboekrekening(client):
    with requests_mock.Mocker() as mock:
        adapters = setup_services(mock)

        response = client.post(
            "/graphql",
            json={
                "query": """
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
}""",
                "variables": {
                    "input": {"transactionId": 31, "grootboekrekeningId": "m12"}
                },
            },
            content_type="application/json",
        )
        assert response.json == {
            "data": {
                "createJournaalpostGrootboekrekening": {
                    "ok": True,
                    "journaalpost": {
                        "id": 23,
                        "grootboekrekening": {"id": "m12"},
                        "transaction": {"id": 31},
                        "afspraak": None,
                    },
                }
            }
        }
        assert adapters["grootboekrekeningen"].called_once
        assert adapters["journaalposten"].called_once
        assert adapters["journaalposten_get"].called_once
        assert adapters["transacties"].called_once
        assert not adapters["afspraken"].called


def test_create_journaalpost_grootboekrekening_unknown_transaction(client):
    with requests_mock.Mocker() as mock:
        adapters = setup_services(mock)

        response = client.post(
            "/graphql",
            json={
                "query": """
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
}""",
                "variables": {
                    "input": {"transactionId": 7777, "grootboekrekeningId": "m12"}
                },
            },
            content_type="application/json",
        )
        assert response.json == {
            "data": {"createJournaalpostGrootboekrekening": None},
            "errors": [
                {
                    "locations": [{"column": 3, "line": 3}],
                    "message": "transaction not found",
                    "path": ["createJournaalpostGrootboekrekening"],
                }
            ],
        }


def test_create_journaalpost_grootboekrekening_duplicate_not_allowed(client):
    with requests_mock.Mocker() as mock:
        adapters = setup_services(mock)

        global journaalposten
        journaalposten[31] = {
            "id": 23,
            "transaction_id": 31,
            "grootboekrekening_id": "m12",
        }
        create_journaalpost_mutation = """
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
            }"""
        response = client.post(
            "/graphql",
            json={
                "query": create_journaalpost_mutation,
                "variables": {
                    "input": {"transactionId": 31, "grootboekrekeningId": "m12"}
                },
            },
            content_type="application/json",
        )
        assert adapters["journaalposten_get"].called_once
        assert not adapters["journaalposten"].called
        assert response.json == {
            "data": {"createJournaalpostGrootboekrekening": None},
            "errors": [
                {
                    "locations": [{"column": 15, "line": 3}],
                    "message": "Journaalpost already exists for Transaction",
                    "path": ["createJournaalpostGrootboekrekening"],
                }
            ],
        }


def test_create_journaalpost_afspraak(client):
    with requests_mock.Mocker() as mock:
        adapters = setup_services(mock)

        response = client.post(
            "/graphql",
            json={
                "query": """
mutation test($input:CreateJournaalpostAfspraakInput!) {
  createJournaalpostAfspraak(input:$input) {
    ok
    journaalpost {
      id
      afspraak { id }
      transaction { id }
    }
  }
}""",
                "variables": {"input": {"transactionId": 31, "afspraakId": 11}},
            },
            content_type="application/json",
        )
        assert response.json == {
            "data": {
                "createJournaalpostAfspraak": {
                    "ok": True,
                    "journaalpost": {
                        "id": 23,
                        "afspraak": {"id": 11},
                        "transaction": {"id": 31},
                    },
                }
            }
        }
        assert adapters["afspraken"].called_once
        assert adapters["journaalposten"].called_once
        assert adapters["transacties"].called_once
        # assert adapters["grootboekrekeningen"].called


def test_create_journaalpost_afspraak_journaalpost_exists(client):
    with requests_mock.Mocker() as mock:
        adapters = setup_services(mock)

        response = client.post(
            "/graphql",
            json={
                "query": """
mutation test($input:CreateJournaalpostAfspraakInput!) {
  createJournaalpostAfspraak(input:$input) {
    ok
    journaalpost {
      id
      afspraak { id }
      transaction { id }
    }
  }
}""",
                "variables": {"input": {"transactionId": 33, "afspraakId": 12}},
            },
            content_type="application/json",
        )
        assert adapters["grootboekrekeningen"].call_count == 0
        assert adapters["journaalposten_get"].called_once
        assert adapters["journaalposten"].call_count == 0
        assert adapters["afspraken"].called_once
        assert adapters["transacties"].called_once
        assert response.json == {
            "data": {"createJournaalpostAfspraak": None},
            "errors": [
                {
                    "locations": [{"column": 3, "line": 3}],
                    "message": "journaalpost already exists for transaction",
                    "path": ["createJournaalpostAfspraak"],
                }
            ],
        }
