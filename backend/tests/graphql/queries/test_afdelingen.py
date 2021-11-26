import requests_mock
from hhb_backend.graphql import settings

def test_afdeling(client):
    with requests_mock.Mocker() as rm:
        # arrange
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_afdelingen=1",
               json={'data': [{'id': 1, 'iban': "NL02ABNA0123456789", 'afdelingen': [1]}]})
        rm2 = rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1",
               json={'data': [{'id': 1,
                               'naam': 'naam',
                               'organisatie_id': 1,
                               'postadressen_ids': ["test_id"]}]
                     })
        rm3 = rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/?filter_ids=1",
               json={'data': [{'id': 1}]})
        rm4 = rm.get(f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/?filter_ids=test_id",
               json=[{
                        "@id": "/addresses/test_id",
                        "@type": "Address",
                        "id": "test_id",
                        "name": None,
                        "bagnummeraanduiding": None,
                        "street": "teststraat",
                        "houseNumber": "52B",
                        "houseNumberSuffix": None,
                        "postalCode": "9999ZZ",
                        "region": None,
                        "locality": "testplaats",
                        "country": None,
                        "postOfficeBoxNumber": None,
                        "dateCreated": "2021-11-09T12:01:05+00:00",
                        "dateModified": "2021-11-09T12:01:05+00:00"
                    }])
        rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")

        # act
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

        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert rm5.called_once
        assert fallback.call_count == 0
        assert response.json ==  {'data': {'afdeling': {'naam': 'naam', 'organisatie': {'id':1}, 'postadressen': [{'id':'test_id'}], 'rekeningen': [{'id': 1}]}}}
        

def test_afdelingen(client):
    with requests_mock.Mocker() as rm:
        # arrange
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_afdelingen=1",
               json={'data': [
                   {'id': 1, 'iban': "NL02ABNA0123456789", 'afdelingen': [1]}]})
        rm2 = rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/",
               json={'data': [{'id': 1,
                               'naam': 'naam',
                               'organisatie_id': 1,
                               'postadressen_ids': ["test_id"]}]
                     })
        rm3 = rm.get(
            f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/?filter_ids=1",
            json={'data': [{'id': 1}]})
        rm4 = rm.get(f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/?filter_ids=test_id",
               json=[{
                        "@id": "/addresses/test_id",
                        "@type": "Address",
                        "id": "test_id",
                        "name": None,
                        "bagnummeraanduiding": None,
                        "street": "teststraat",
                        "houseNumber": "52B",
                        "houseNumberSuffix": None,
                        "postalCode": "9999ZZ",
                        "region": None,
                        "locality": "testplaats",
                        "country": None,
                        "postOfficeBoxNumber": None,
                        "dateCreated": "2021-11-09T12:01:05+00:00",
                        "dateModified": "2021-11-09T12:01:05+00:00"
                    }])
        rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")

        # act
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

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert rm5.called_once
        assert fallback.call_count == 0
        assert response.json == {'data': {
            'afdelingen': [{'naam': 'naam', 'organisatie': {'id': 1},
                         'postadressen': [{'id': 'test_id'}],
                         'rekeningen': [{'id': 1}]}]}}
