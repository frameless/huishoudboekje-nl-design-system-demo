import re

import requests_mock

from hhb_backend.graphql import settings


def test_delete_journaalpost(client):
    with requests_mock.Mocker() as mock:
        get_transaction = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids=11",
            json={"data": [{"id": 11}]},
            status_code=200,
        )
        post_transaction = mock.put(
            re.compile(
                f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/\\d+"),
            json=lambda req, _ctx: {"data": req.json()},
            status_code=200,
        )
        get_journaalpost = mock.get(
            f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids=1",
            json={"data": [{"id": 1, "transaction_id": 11,
                            "afspraak_id": None, "grootboekrekening_id": 1}]},
            status_code=200,
        )
        adapter = mock.delete(
            f"{settings.HHB_SERVICES_URL}/journaalposten/1", status_code=200
        )

        response = client.post(
            "/graphql",
            json={
                "query": """
mutation test($id: Int!) {
  deleteJournaalpost(id: $id) {
    ok
  }
}
""",
                "variables": {"id": 1},
            },
            content_type="application/json",
        )
        assert response.json == {
            "data": {
                "deleteJournaalpost": {
                    "ok": True,
                }
            }
        }
        assert adapter.call_count == 1
        assert get_transaction.call_count == 1
        assert get_journaalpost.call_count == 1
        assert post_transaction.call_count == 1


def test_delete_journaalpost_error(client):
    with requests_mock.Mocker() as mock:
        get_journaalpost = mock.get(
            f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids=1",
            json={"data": []},
            status_code=200,
        )
        adapter = mock.delete(
            f"{settings.HHB_SERVICES_URL}/journaalposten/1",
            status_code=404,
            text="Not found",
        )

        response = client.post(
            "/graphql",
            json={
                "query": """
mutation test($id: Int!) {
  deleteJournaalpost(id: $id) {
    ok
  }
}
""",
                "variables": {"id": 1},
            },
            content_type="application/json",
        )
        assert response.json == {
            "data": {"deleteJournaalpost": None},
            "errors": [
                {
                    "locations": [{"column": 3, "line": 3}],
                    "message": "Upstream API responded: Not found",
                    "path": ["deleteJournaalpost"],
                }
            ],
        }
        assert adapter.call_count == 1
