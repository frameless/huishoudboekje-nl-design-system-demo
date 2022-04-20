import requests_mock
from hhb_backend.graphql import settings

def test_delete_afdeling(client):
    with requests_mock.Mocker() as mock:
        # arrange
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        afdeling = {'data': [{'id': 1, 'postadressen_ids': []}]}
        afdeling_get = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", json=afdeling, status_code=200)
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
        assert afdeling_get.called_once
        assert afdeling_org_del.called_once
        assert afdeling_hhb_del.called_once
        assert gebruikers_activiteit.called_once
        assert fallback.called == 0
        assert response.json == {"data": {
                "deleteAfdeling": {
                    "ok": True,
                }
            }}

def test_delete_afdeling_postadres_error(client):
    with requests_mock.Mocker() as mock:
        # arrange
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        afdeling = {'data': [{'id': 1, 'postadressen_ids': [ 'test_postadres_id' ]}]}
        afdeling_get = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", json=afdeling, status_code=200)

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
        assert afdeling_get.called_once
        assert fallback.called == 0
        assert response.json == {
            'data': {'deleteAfdeling': None}, 
            'errors': [{'locations': [{'column': 25, 'line': 3}], 
            'message': 'Afdeling heeft postadressen - verwijderen is niet mogelijk.', 
            'path': ['deleteAfdeling']}]
            }

def test_delete_afdeling_rekeningen_error(client):
    with requests_mock.Mocker() as mock:
        # arrange
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        afdeling = {'data': [{'id': 1, 'rekeningen_ids': [ 'test_rekeningen_id' ]}]}
        afdeling_get = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", json=afdeling, status_code=200)

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
        assert afdeling_get.called_once
        assert fallback.called == 0
        assert response.json == {
            'data': {'deleteAfdeling': None}, 
            'errors': [{'locations': [{'column': 25, 'line': 3}], 
            'message': 'Afdeling heeft rekeningen - verwijderen is niet mogelijk.', 
            'path': ['deleteAfdeling']}]
            }

def test_delete_afdeling_afspraken_error(client):
    with requests_mock.Mocker() as mock:
        # arrange
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        afdeling = {'data': [{'id': 1, 'afspraken': [ 'test_afspraak' ]}]}
        afdeling_get = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", json=afdeling, status_code=200)

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
        assert afdeling_get.called_once
        assert fallback.called == 0
        assert response.json == {
            'data': {'deleteAfdeling': None}, 
            'errors': [{'locations': [{'column': 25, 'line': 3}], 
            'message': 'Afdeling wordt gebruikt in afpraken - verwijderen is niet mogelijk.', 
            'path': ['deleteAfdeling']}]
            }

def test_delete_afdeling_error(client):
    with requests_mock.Mocker() as mock:
        # arrange
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        afdeling_get = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", status_code=404, text="Not found")

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
        assert afdeling_get.called_once
        assert fallback.called == 0
        assert response.json == {'data': {'deleteAfdeling': None}, 'errors': [{'locations': [{'column': 21, 'line': 3}], 'message': 'Upstream API responded: Not found', 'path': ['deleteAfdeling']}]}

def test_delete_afdeling_without_postadres(client):
    with requests_mock.Mocker() as mock:
        # arrange
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        afdeling = {'data': [{'id': 1, 'postadressen_ids': None }]}
        afdeling_get = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", json=afdeling, status_code=200)
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
        assert afdeling_get.called_once
        assert afdeling_org_del.called_once
        assert afdeling_hhb_del.called_once
        assert gebruikers_activiteit.called_once
        assert fallback.called == 0
        assert response.json == {"data": {
                "deleteAfdeling": {
                    "ok": True,
                }
            }}