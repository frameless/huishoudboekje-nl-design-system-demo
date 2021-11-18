import requests_mock
from hhb_backend.graphql import settings

organisatie = {
    "id": 1,
    "naam": "query test organisation",
    "kvknummer": "98765432",
    "vestigingsnummer": "9876"
}

updated_organisatie = {
    "id": 1,
    "naam": "test",
    "kvknummer": "23456789",
    "vestigingsnummer": "6789"
}

def test_update_organisatie_success(client):
     with requests_mock.Mocker() as rm:
        # arrange
        request = {
            "query": '''
                mutation test($id:Int!, $naam:String, $kvknummer:String, $vestigingsnummer:String) {
                    updateOrganisatie(id:$id, naam:$naam, kvknummer:$kvknummer, vestigingsnummer:$vestigingsnummer) {
                        ok
                        organisatie {
                            id
                            naam
                            kvknummer
                            vestigingsnummer
                        }
                    }
                }''',
            "variables": {
                'id': 1,
                'naam': 'test',
                'kvknummer': "23456789",
                'vestigingsnummer': "6789"
            }}
        expected = {'data': {'updateOrganisatie': {'ok': True, 'organisatie': {'id': 1, 'naam': 'test', 'kvknummer': '23456789', 'vestigingsnummer': '6789'}}}}
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/", status_code=200, json={"data":[organisatie]})
        rm2 = rm.post(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/1", status_code=200, json={"data":updated_organisatie})
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)


        # act
        response = client.post("/graphql", json=request, content_type='application/json')


        # assert
        assert rm1.call_count == 2
        assert rm2.called_once
        assert rm3.called_once
        assert fallback.call_count == 0
        assert response.json == expected

def test_update_organisatie_success_limited(client):
     with requests_mock.Mocker() as rm:
        # arrange
        request = {
            "query": '''
                mutation test($id:Int!, $naam:String, $kvknummer:String) {
                    updateOrganisatie(id:$id, naam:$naam, kvknummer:$kvknummer) {
                        ok
                        organisatie {
                            id
                            naam
                            kvknummer
                            vestigingsnummer
                        }
                    }
                }''',
            "variables": {
                'id': 1,
                'naam': 'test',
                'kvknummer': "23456789"
            }}
        expected = {'data': {'updateOrganisatie': {'ok': True, 'organisatie': {'id': 1, 'naam': 'test', 'kvknummer': '23456789', 'vestigingsnummer': '9876'}}}}
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/", status_code=200, json={"data":[organisatie]})
        rm2 = rm.post(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/1", status_code=200, json={"data":{'id': 1, 'naam': 'test', 'kvknummer': '23456789', 'vestigingsnummer': '9876'}})
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)


        # act
        response = client.post("/graphql", json=request, content_type='application/json')


        # assert
        assert rm1.call_count == 2
        assert rm2.called_once
        assert rm3.called_once
        assert fallback.call_count == 0
        assert response.json == expected


        # arrange
        request = {
            "query": '''
                mutation test($id:Int!, $naam:String, $vestigingsnummer:String) {
                    updateOrganisatie(id:$id, naam:$naam, vestigingsnummer:$vestigingsnummer) {
                        ok
                        organisatie {
                            id
                            naam
                            kvknummer
                            vestigingsnummer
                        }
                    }
                }''',
            "variables": {
                'id': 1,
                'naam': 'test',
                'vestigingsnummer': "23456789"
            }}
        expected = {'data': {'updateOrganisatie': {'ok': True, 'organisatie': {'id': 1, 'naam': 'test', 'kvknummer': '23456789', 'vestigingsnummer': '23456789'}}}}
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/", status_code=200, json={"data":[organisatie]})
        rm2 = rm.post(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/1", status_code=200, json={"data":{'id': 1, 'naam': 'test', 'kvknummer': '23456789', 'vestigingsnummer': '23456789'}})
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)


        # act
        response = client.post("/graphql", json=request, content_type='application/json')


        # assert
        assert rm1.call_count == 2
        assert rm2.called_once
        assert rm3.called_once
        assert fallback.call_count == 0
        assert response.json == expected

def test_update_organisatie_success_no_update(client):
     with requests_mock.Mocker() as rm:
        # arrange
        request = {
            "query": '''
                mutation test($id:Int!) {
                    updateOrganisatie(id:$id) {
                        ok
                        organisatie {
                            id
                            naam
                            kvknummer
                            vestigingsnummer
                        }
                    }
                }''',
            "variables": {
                'id': 1
            }}
        expected = {'data': {'updateOrganisatie': {'ok': True, 'organisatie': organisatie}}}
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/?filter_ids=1", status_code=200, json={"data":[organisatie]})
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)


        # act
        response = client.post("/graphql", json=request, content_type='application/json')


        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert fallback.call_count == 0
        assert response.json == expected

def test_update_organisatie_fail(client):
     with requests_mock.Mocker() as rm:
        # arrange
        organisatie_2 = {
            "id": 2,
            "naam": "test",
            "kvknummer": "23456789",
            "vestigingsnummer": "6789"
        }
        request = {
            "query": '''
                mutation test($id:Int!, $naam:String, $kvknummer:String, $vestigingsnummer:String) {
                    updateOrganisatie(id:$id, naam:$naam, kvknummer:$kvknummer, vestigingsnummer:$vestigingsnummer) {
                        ok
                        organisatie {
                            id
                            naam
                            kvknummer
                            vestigingsnummer
                        }
                    }
                }''',
            "variables": {
                'id': 1,
                'naam': 'test',
                'kvknummer': "23456789",
                'vestigingsnummer': "6789"
            }}
        expected = "Combination kvk-nummer and vestigingsnummer is not unique."
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/", status_code=200, json={"data":[organisatie, organisatie_2]})


        # act
        response = client.post("/graphql", json=request, content_type='application/json')


        # assert
        assert rm1.call_count == 2
        assert fallback.call_count == 0
        assert response.json["errors"][0]["message"] == expected
