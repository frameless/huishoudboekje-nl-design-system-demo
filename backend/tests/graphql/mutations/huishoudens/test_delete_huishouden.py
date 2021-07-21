import requests_mock

from hhb_backend.graphql import settings


def test_delete_huishouden(client):
    with requests_mock.Mocker() as mock:
        mock.get(
            f"{settings.HHB_SERVICES_URL}/huishoudens/?filter_ids=1",
            status_code=200,
            json={"data": [{"id": 1}]},
        )
        mock.post(
            f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
            json={"data": {"id": 1}},
        )
        adapter = mock.delete(
            f"{settings.HHB_SERVICES_URL}/huishoudens/1", status_code=204
        )

        response = client.post(
            "/graphql",
            json={
                "query": """
                        mutation test($id: Int!) {
                          deleteHuishouden(id: $id) {
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
                "deleteHuishouden": {
                    "ok": True,
                }
            }
        }
        assert adapter.called_once


def test_delete_huishouden_error(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.get(f"{settings.HHB_SERVICES_URL}/huishoudens/?filter_ids=1", status_code=404, text="Not found")

        response = client.post(
            "/graphql",
            json={
                "query": '''
                        mutation test($id: Int!) {
                          deleteHuishouden(id: $id) {
                            ok
                          }
                        }
                        ''',
                "variables": {"id": 1}},
            content_type='application/json'
        )
        assert response.json == {"data": {"deleteHuishouden": None},
                                 "errors": [{"locations": [{"column": 27, "line": 3}],
                                             "message": "Upstream API responded: Not found",
                                             "path": ["deleteHuishouden"]}]}
        assert adapter.called_once
