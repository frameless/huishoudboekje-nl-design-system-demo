import requests_mock
from hhb_backend.graphql import settings

def test_afdeling(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_afdelingen=1",
               json={'data': [{'id': 1, 'iban': "NL02ABNA0123456789", 'afdelingen': [1]}]})
        rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1",
               json={'data': [{'id': 1,
                               'naam': 'naam',
                               'organisatie_id': 1,
                               'postadressen_ids': ["test_id"]}]
                     })
        rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/?filter_ids=1",
               json={'data': [{'id': 1}]})
        rm.get(f"{settings.CONTACTCATALOGUS_SERVICE_URL}/addresses/test_id",
               json={'id': "test_id",
                     'street': 'teststraat',
                     'houseNumber': '52B',
                     'postalCode': '9999ZZ',
                     'locality': 'testplaats'
                     })
        rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query test ($id:Int!) {
                    afdeling(id:$id) {
                      naam
                      organisatie {id}
                      postadressen {id}
                      rekeningen {id}
                    }
                }''',
                "variables": {"id": 1}},
            content_type='application/json'
        )
        assert response.json ==  {'data': {'afdeling': {'naam': 'naam', 'organisatie': {'id':1}, 'postadressen': [{'id':'test_id'}], 'rekeningen': [{'id': 1}]}}}


def test_afdelingen(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_afdelingen=1",
               json={'data': [
                   {'id': 1, 'iban': "NL02ABNA0123456789", 'afdelingen': [1]}]})
        rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/",
               json={'data': [{'id': 1,
                               'naam': 'naam',
                               'organisatie_id': 1,
                               'postadressen_ids': ["test_id"]}]
                     })
        rm.get(
            f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/?filter_ids=1",
            json={'data': [{'id': 1}]})
        rm.get(f"{settings.CONTACTCATALOGUS_SERVICE_URL}/addresses/test_id",
               json={'id': "test_id",
                     'street': 'teststraat',
                     'houseNumber': '52B',
                     'postalCode': '9999ZZ',
                     'locality': 'testplaats'
                     })
        rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        response = client.post(
            "/graphql",
            json={
                "query": '''
                        query test  {
                            afdelingen {
                              naam
                              organisatie {id}
                              postadressen {id}
                              rekeningen {id}
                            }
                        }''',},
            content_type='application/json'
        )
        assert response.json == {'data': {
            'afdelingen': [{'naam': 'naam', 'organisatie': {'id': 1},
                         'postadressen': [{'id': 'test_id'}],
                         'rekeningen': [{'id': 1}]}]}}
