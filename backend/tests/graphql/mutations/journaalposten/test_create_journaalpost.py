import re

import requests_mock
from hhb_backend.graphql import settings

mock_afspraken = {
    "data": [
        {"id": 11, "rubriek_id": 1, "credit": True},
        {"id": 12, "rubriek_id": 2, "credit": False},
    ]
}
mock_rubrieken = {
    "data": [
        {"id": 1, "naam": "Inkomsten", "grootboekrekening_id": "m1"},
        {"id": 12, "naam": "Salaris", "grootboekrekening_id": "m12"},
        {"id": 2, "naam": "Uitgaven", "grootboekrekening_id": "m2"},
    ]
}
mock_grootboekrekeningen = {
    "data": [
        {"id": "m1", "naam": "inkomsten", "children": ["m12"], "debet": False},
        {"id": "m12", "naam": "salaris", "parent_id": "m1", "debet": False},
        {"id": "m2", "naam": "uitgaven", "debet": True},
    ]
}
mock_bank_transactions = {
    "data": [
        {"id": 31, "is_credit": True},
        {"id": 32, "is_credit": False},
        {"id": 33, "is_credit": False},
    ]
}

journaalposten = []


def journaalpost_id_counter():
    global journaalposten
    return max([jp["id"] for jp in journaalposten], default=22) + 1


def create_journaalpost_service(request, context):
    global journaalposten
    data = request.json()
    if type(data) == list:
        for journaalpost in data:
            journaalpost["id"] = journaalpost_id_counter()
            journaalposten.append(journaalpost)
    else:
        journaalpost = data
        journaalpost["id"] = journaalpost_id_counter()
        journaalposten.append(journaalpost)
    return {"data": data}


def get_journaalposten(request, context):
    global journaalposten
    return {"data": journaalposten}


def setup_services(mock):
    global journaalposten
    journaalposten = []

    journaalposten.append({"id": 22, "afspraak_id": 12, "transaction_id": 33})

    bank_transactions_update = mock.post(
        # requests_mock.ANY,
        re.compile(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/.*"),
        json=echo_json_data,
    )
    afspraken_adapter = mock.get(
        f"{settings.HHB_SERVICES_URL}/afspraken/", json=mock_afspraken
    )
    rubrieken_get = mock.get(
        f"{settings.HHB_SERVICES_URL}/rubrieken/",
        json=mock_rubrieken,
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
        re.compile(f"{settings.HHB_SERVICES_URL}/journaalposten/.*"), json=create_journaalpost_service
    )
    bank_transactions_adapter = mock.get(
        f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/",
        json=mock_bank_transactions,
    )
    mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
    return {
        "afspraken": afspraken_adapter,
        "transacties": bank_transactions_adapter,
        "transacties_update": bank_transactions_update,
        "grootboekrekeningen": grootboekrekeningen_adapter,
        "rubrieken": rubrieken_get,
        "journaalposten": joornaalposten_adapter,
        "journaalposten_get": journaalposten_get_adapter,
    }


def echo_json_data(req, ctx):
    return {"data": req.json()}


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
      isAutomatischGeboekt
    }
  }
}""",
                "variables": {
                    "input": {"transactionId": 31, "grootboekrekeningId": "m12", "isAutomatischGeboekt": False}
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
                        "isAutomatischGeboekt": False
                    },
                }
            }
        }
        assert adapters["grootboekrekeningen"].called_once
        assert adapters["journaalposten"].called_once
        assert adapters["journaalposten_get"].called_once
        assert adapters["transacties"].called_once
        assert adapters["transacties_update"].called_once
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
      isAutomatischGeboekt
    }
  }
}""",
                "variables": {
                    "input": {"transactionId": 7777, "grootboekrekeningId": "m12", "isAutomatischGeboekt": False}
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
        journaalposten.append({
            "id": 23,
            "transaction_id": 31,
            "grootboekrekening_id": "m12",
        })
        create_journaalpost_mutation = """
            mutation test($input:CreateJournaalpostGrootboekrekeningInput!) {
              createJournaalpostGrootboekrekening(input:$input) {
                ok
                journaalpost {
                  id
                  grootboekrekening { id }
                  transaction { id }
                  afspraak { id }
                  isAutomatischGeboekt
                }
              }
            }"""
        response = client.post(
            "/graphql",
            json={
                "query": create_journaalpost_mutation,
                "variables": {
                    "input": {"transactionId": 31, "grootboekrekeningId": "m12", "isAutomatischGeboekt": False}
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
mutation test($input:[CreateJournaalpostAfspraakInput!]!) {
  createJournaalpostPerAfspraak(input:$input) {
    ok
    journaalposten {
      id
      afspraak { id }
      transaction { id }
      isAutomatischGeboekt
    }
  }
}""",
                "variables": {"input": [{"transactionId": 31, "afspraakId": 11, "isAutomatischGeboekt": False},]},
            },
            content_type="application/json",
        )
        assert adapters["rubrieken"].called_once
        assert response.json == {
            "data": {
                "createJournaalpostPerAfspraak": {
                    "ok": True,
                    "journaalposten": [{
                        "id": 23,
                        "afspraak": {"id": 11},
                        "transaction": {"id": 31},
                        "isAutomatischGeboekt": False
                    },]
                }
            }
        }
        assert adapters["afspraken"].called_once
        assert adapters["journaalposten"].called_once
        assert adapters["transacties"].called_once
        assert adapters["transacties_update"].called_once
        # assert adapters["grootboekrekeningen"].called


def test_create_journaalpost_afspraak_journaalpost_exists(client):
    with requests_mock.Mocker() as mock:
        adapters = setup_services(mock)

        response = client.post(
            "/graphql",
            json={
                "query": """
mutation test($input:[CreateJournaalpostAfspraakInput!]!) {
  createJournaalpostPerAfspraak(input:$input) {
    ok
    journaalposten {
      id
      afspraak { id }
      transaction { id }
      isAutomatischGeboekt
    }
  }
}""",
                "variables": {"input": [{"transactionId": 33, "afspraakId": 12, "isAutomatischGeboekt": False},]},
            },
            content_type="application/json",
        )
        assert adapters["rubrieken"].call_count == 0
        assert adapters["journaalposten_get"].called_once
        assert adapters["journaalposten"].call_count == 0
        assert adapters["afspraken"].call_count == 0
        assert adapters["transacties"].called_once
        assert response.json == {
            "data": {"createJournaalpostPerAfspraak": None},
            "errors": [
                {
                    "locations": [{"column": 3, "line": 3}],
                    "message": "(some) journaalposten already exist",
                    "path": ["createJournaalpostPerAfspraak"],
                }
            ],
        }


def test_create_journaalpost_per_afspraak(client):
    with requests_mock.Mocker() as mock:
        adapters = setup_services(mock)

        response = client.post(
            "/graphql",
            json={
                "query": """
mutation test($input: [CreateJournaalpostAfspraakInput!]!) {
  createJournaalpostPerAfspraak(input: $input) {
    ok
    journaalposten {
      id
      afspraak {
        id
      }
      transaction {
        id
      }
      isAutomatischGeboekt
    }
  }
}
""",
                "variables": {"input": [
                    {"transactionId": 31, "afspraakId": 11, "isAutomatischGeboekt": True},
                    {"transactionId": 32, "afspraakId": 12, "isAutomatischGeboekt": True},
                ]},
            },
        )
        assert adapters["rubrieken"].called_once
        assert response.json == {
            "data": {
                "createJournaalpostPerAfspraak": {
                    "ok": True,
                    "journaalposten": [
                        {
                            "id": 23,
                            "afspraak": {"id": 11},
                            "transaction": {"id": 31},
                            "isAutomatischGeboekt": True
                        }, {
                            "id": 24,
                            "afspraak": {"id": 12},
                            "transaction": {"id": 32},
                            "isAutomatischGeboekt": True
                        },
                    ],
                }
            }
        }
        assert adapters["afspraken"].called_once
        assert adapters["journaalposten"].called_once
        assert adapters["transacties"].called_once
        assert adapters["transacties_update"].call_count == 2
        # assert adapters["grootboekrekeningen"].called
