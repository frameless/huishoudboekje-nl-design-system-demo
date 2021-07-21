import requests_mock

from hhb_backend.graphql import settings


def test_huishoudens_success(client):
    with requests_mock.Mocker() as rm:
        adapter = rm.get(
            f"{settings.HHB_SERVICES_URL}/huishoudens/", json={"data": [{"id": 1}]}
        )
        response = client.post(
            "/graphql",
            data='{"query": "{ huishoudens { id }}"}',
            content_type="application/json",
        )

        assert adapter.called_once
        assert response.json == {"data": {"huishoudens": [{"id": 1}]}}


def test_huishoudens_paged_success(client):
    with requests_mock.Mocker() as rm:
        adapter = rm.get(
            f"{settings.HHB_SERVICES_URL}/huishoudens/",
            json={
                "count": 12,
                "data": [{"id": 1}, {"id": 2}],
                "limit": 2,
                "next": "?start=3&limit=2",
                "previous": "",
                "start": 1,
            },
        )
        response = client.post(
            "/graphql",
            data='{"query": "{ huishoudensPaged(start:1, limit:2) {huishoudens{id}pageInfo{count, start, limit}}}"}',
            content_type="application/json",
        )

        assert adapter.called_once
        assert response.json == {
            "data": {
                "huishoudensPaged": {
                    "huishoudens": [{"id": 1}, {"id": 2}],
                    "pageInfo": {"count": 12, "limit": 2, "start": 1},
                }
            }
        }
