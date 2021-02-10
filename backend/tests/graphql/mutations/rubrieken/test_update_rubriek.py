import pytest
import requests_mock
from hhb_backend.graphql import settings

mock_rubriek_post_success_repsonse = {
    "data": {"id": 11, "grootboekrekening_id": "m12", "naam": "test rubriek"},
}
mock_grootboekrekeningen = {
    "data": [
        {"id": "m1", "naam": "inkomsten", "children": ["m12"]},
        {"id": "m12", "naam": "salaris", "parent_id": "m1"},
    ]
}
mock_grootboekrekening = {"data": [{"id": "m12", "naam": "salaris", "parent_id": "m1"}]}


def setup_services(mock):
    grootboekrekeningen_adapter1 = mock.get(
        f"{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/",
        json=mock_grootboekrekeningen,
    )
    grootboekrekeningen_adapter2 = mock.get(
        f"{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/?filter_ids=WRONG",
        json={"data": []},
    )
    grootboekrekeningen_adapter3 = mock.get(
        f"{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/?filter_ids=m12",
        json=mock_grootboekrekening,
    )
    rubrieken_adapter = mock.post(
        f"{settings.HHB_SERVICES_URL}/rubrieken/11",
        json=mock_rubriek_post_success_repsonse,
        status_code=201,
    )
    mock.get(
        f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=11",
        status_code=200,
        json={"data": [{"id": 11}]},
    )
    return {
        "grootboekrekeningen1": grootboekrekeningen_adapter1,
        "grootboekrekeningen2": grootboekrekeningen_adapter2,
        "grootboekrekeningen3": grootboekrekeningen_adapter3,
        "rubrieken": rubrieken_adapter,
    }


def test_update_rubriek_success(client):
    with requests_mock.Mocker() as mock:
        adapters = setup_services(mock)

        response = client.post(
            "/graphql",
            json={
                "query": """
                    mutation {
                        updateRubriek(
                            id: 11,
                            naam: "test rubriek",
                            grootboekrekeningId: "m12"
                        ) {
                            rubriek {
                                id
                                naam
                                grootboekrekening {
                                    id
                                }
                            }
                        }
                    }
                """
            },
            content_type="application/json",
        )
        assert response.json == {
            "data": {
                "updateRubriek": {
                    "rubriek": {
                        "id": 11,
                        "naam": "test rubriek",
                        "grootboekrekening": {"id": "m12"},
                    }
                }
            }
        }


def test_update_rubriek_unknown_grootboek(client):
    with requests_mock.Mocker() as mock:
        adapters = setup_services(mock)

        response = client.post(
            "/graphql",
            json={
                "query": """
                    mutation {
                        updateRubriek(
                            id: 11,
                            naam: "test rubriek",
                            grootboekrekeningId: "WRONG"
                        ) {
                            rubriek {
                                id
                                naam
                                grootboekrekening {
                                    id
                                }
                            }
                        }
                    }
                """
            },
            content_type="application/json",
        )
        assert (
            response.json["errors"][0]["message"]
            == "Grootboekrekening id [WRONG] not found."
        )
