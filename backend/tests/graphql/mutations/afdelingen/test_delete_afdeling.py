import requests_mock

from hhb_backend.graphql import settings


def test_delete_afdeling(client):
    with requests_mock.Mocker() as mock:
        # arrange
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        afdeling = {'data': [{'id': 1, 'postadressen_ids': [], 'rekeningen_ids': [], 'organisatie_id': 42 }]}
        afdeling_get = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", json=afdeling)
        afdeling_org_del = mock.delete(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/1", json={'data': {'id': 1}}, status_code=204)
        afdeling_hhb_del = mock.delete(f"{settings.HHB_SERVICES_URL}/afdelingen/1", json={'data': {'id': 1}}, status_code=204)
        gebruikers_activiteit = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201, json={"data": {"id": 1}})

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($id: Int!) {
                        deleteAfdeling(id: $id) {
                            ok
                        }
                    }
                    ''',
                "variables": {"id": 1}},
            content_type='application/json'
        )

        # assert
        assert afdeling_get.call_count == 1
        assert afdeling_org_del.call_count == 1
        assert afdeling_hhb_del.call_count == 1
        assert gebruikers_activiteit.call_count == 1
        assert fallback.call_count == 0
        assert response.json == {"data": {
                "deleteAfdeling": {
                    "ok": True,
                }
            }}

def test_delete_afdeling_postadres_error(client):
    with requests_mock.Mocker() as mock:
        # arrange
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        afdeling = {'data': [{'id': 1, 'postadressen_ids': ['test_postadres_id']}]}
        afdeling_get = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", json=afdeling)

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($id: Int!) {
                        deleteAfdeling(id: $id) {
                            ok
                        }
                    }
                    ''',
                "variables": {"id": 1}},
            content_type='application/json'
        )

        # assert
        assert afdeling_get.call_count == 1
        assert fallback.call_count == 0
        assert response.json == {
            'data': {'deleteAfdeling': None},
            'errors': [{'locations': [{'column': 25, 'line': 3}],
            'message': 'Afdeling has postadressen - deletion is not possible.',
            'path': ['deleteAfdeling']}]
        }

def test_delete_afdeling_rekeningen_error(client):
    with requests_mock.Mocker() as mock:
        # arrange
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        afdeling = {'data': [{'id': 1, 'rekeningen_ids': ['test_rekeningen_id'], 'postadressen_ids': []}]}
        afdeling_get = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", json=afdeling)

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($id: Int!) {
                        deleteAfdeling(id: $id) {
                            ok
                        }
                    }
                    ''',
                "variables": {"id": 1}},
            content_type='application/json'
        )

        # assert
        assert afdeling_get.call_count == 1
        assert fallback.call_count == 0
        assert response.json == {
            'data': {'deleteAfdeling': None},
            'errors': [{'locations': [{'column': 25, 'line': 3}],
            'message': 'Afdeling has rekeningen - deletion is not possible.',
            'path': ['deleteAfdeling']}]
        }

def test_delete_afdeling_error(client):
    with requests_mock.Mocker() as mock:
        # arrange
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        afdeling_get = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", json={"data": []})

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($id: Int!) {
                    deleteAfdeling(id: $id) {
                        ok
                    }
                    }
                    ''',
                "variables": {"id": 1}},
            content_type='application/json'
        )

        # assert
        assert afdeling_get.call_count == 1
        assert fallback.call_count == 0
        assert response.json == {
            'data': {'deleteAfdeling': None},
            'errors': [{
                'locations': [{'column': 21, 'line': 3}],
                'message': "Afdeling not found",
                'path': ['deleteAfdeling']
            }]
        }

def test_delete_afdeling_without_postadres(client):
    with requests_mock.Mocker() as mock:
        # arrange
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        afdeling = {'data': [{'id': 1, 'postadressen_ids': [], 'rekeningen_ids': [], 'organisatie_id': 42}]}
        afdeling_get = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", json=afdeling)
        afdeling_org_del = mock.delete(
            f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/1",
            json={'data': {'id': 1}}, status_code=204
        )
        afdeling_hhb_del = mock.delete(
            f"{settings.HHB_SERVICES_URL}/afdelingen/1",
            json={'data': {'id': 1}}, status_code=204
        )
        gebruikers_activiteit = mock.post(
            f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
            status_code=201, json={"data": {"id": 1}}
        )

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($id: Int!) {
                        deleteAfdeling(id: $id) {
                            ok
                        }
                    }
                    ''',
                "variables": {"id": 1}},
            content_type='application/json'
        )

        # assert
        assert afdeling_get.call_count == 1
        assert afdeling_org_del.call_count == 1
        assert afdeling_hhb_del.call_count == 1
        assert gebruikers_activiteit.call_count == 1
        assert fallback.call_count == 0
        assert response.json == {"data": {
            "deleteAfdeling": {
                 "ok": True,
            }
        }}
