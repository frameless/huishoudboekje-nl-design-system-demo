import requests_mock

from hhb_backend.graphql import settings


def post_echo(request, _context):
    return {"data": (request.json())}


def test_update_afspraak_automatisch_boeken_success(client):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)
        log_post = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200,
                             json={"data": {"id": 1}})
        afspraken_get = mock.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1",
                                 json={"data": [{"id": 1, "automatisch_boeken": None}]})
        afspraken_post = mock.post(f"{settings.HHB_SERVICES_URL}/afspraken/1", json=post_echo)

        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($afspraakId: Int!, $automatischBoeken: Boolean!) {
                        updateAfspraakAutomatischBoeken(afspraakId: $afspraakId, automatischBoeken: $automatischBoeken) {
                            afspraak {
                                id
                                automatischBoeken
                            }
                        }
                    }
                    ''',
                "variables": {"afspraakId": 1, "automatischBoeken": True}
            },
        )
        assert response.json == {
            "data": {"updateAfspraakAutomatischBoeken": {"afspraak": {"id": 1, "automatischBoeken": True}}}}
        assert afspraken_get.called_once
        assert afspraken_post.called
        assert log_post.called_once

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


def test_update_afspraak_automatisch_boeken_not_found(client):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)
        log_post = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200,
                             json={"data": {"id": 1}})
        afspraken_get = mock.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1",
                                 json={"data": []})
        afspraken_post = mock.post(f"{settings.HHB_SERVICES_URL}/afspraken/1", json=post_echo)

        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($afspraakId: Int!, $automatischBoeken: Boolean!) {
                        updateAfspraakAutomatischBoeken(afspraakId: $afspraakId, automatischBoeken: $automatischBoeken) {
                            afspraak {
                                id
                                automatischBoeken
                            }
                        }
                    }
                    ''',
                "variables": {"afspraakId": 1, "automatischBoeken": True}
            },
        )
        assert response.json == {"data": {"updateAfspraakAutomatischBoeken": None},
                                 "errors": [{"message": "afspraak not found",
                                             "path": ["updateAfspraakAutomatischBoeken"],
                                             "locations": [{"column": 25, "line": 3}]
                                             }]
                                 }
        assert afspraken_get.called_once
        assert not afspraken_post.called
        assert not log_post.called

        # No leftover calls
        assert not post_any.called
        assert not get_any.called
