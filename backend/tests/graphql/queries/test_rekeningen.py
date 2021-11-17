import requests_mock
from hhb_backend.graphql import settings

def test_rekeningen_byId(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1",
               json={'data': [{'id': 1, 'iban': "NL02ABNA0123456789", 'rekeninghouder':'Piet', 'afdelingen': [1], 'afspraken':[1], 'burgers':[1]}]})
        rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1",
               json={'data': [{'id': 1,
                               'naam': 'naam',
                               'organisatie_id': 1,
                               'postadressen_ids': ["test_id"]}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1",
               json={'data': [{'id': 1, "omschrijving": "Loon"}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/burgers/?filter_ids=1",
               json={'data':[{'id': 1, 'voornamen': "Piet"}]})
        rm.get(f"{settings.CONTACTCATALOGUS_SERVICE_URL}/addresses/test_id",
               json={'id': "test_id",
                     'street': 'teststraat',
                     'houseNumber': '52B',
                     'postalCode': '9999ZZ',
                     'locality': 'testplaats'})
        rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query test ($id:Int!) {
                    rekening(id:$id) {
                      iban
                      rekeninghouder
                      burgers {id voornamen}
                      afdelingen {id naam}
                      afspraken {id omschrijving}
                    }
                }''',
                "variables": {"id": 1}},
            content_type='application/json'
        )
        print(response.json)
        assert response.json ==  {'data': {'rekening': {'iban': 'NL02ABNA0123456789', 'rekeninghouder': 'Piet',
                                                        'afdelingen':[{'id': 1, 'naam': 'naam'}],'burgers': [{'id':1, 'voornamen':'Piet'}],
                                                        'afspraken': [{'id': 1, "omschrijving": "Loon"}]}}}


def test_rekeningen_all(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/",
               json={'data': [{'id': 1, 'iban': "NL02ABNA0123456789",
                               'rekeninghouder': 'Piet', 'afdelingen': [1],
                               'afspraken': [1], 'burgers': [1]}]})
        rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1",
               json={'data': [{'id': 1,
                               'naam': 'naam',
                               'organisatie_id': 1,
                               'postadressen_ids': ["test_id"]}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1",
               json={'data': [{'id': 1, "omschrijving": "Loon"}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/burgers/?filter_ids=1",
               json={'data': [{'id': 1, 'voornamen': "Piet"}]})
        rm.get(f"{settings.CONTACTCATALOGUS_SERVICE_URL}/addresses/test_id",
               json={'id': "test_id",
                     'street': 'teststraat',
                     'houseNumber': '52B',
                     'postalCode': '9999ZZ',
                     'locality': 'testplaats'})
        rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query test {
                    rekeningen {
                      iban
                      rekeninghouder
                      burgers {id voornamen}
                      afdelingen {id naam}
                      afspraken {id omschrijving}
                    }
                }''',},
            content_type='application/json'
        )
        print(response.json)
        assert response.json == {'data': {
            'rekeningen': [{'iban': 'NL02ABNA0123456789', 'rekeninghouder': 'Piet',
                         'afdelingen': [{'id': 1, 'naam': 'naam'}],
                         'burgers': [{'id': 1, 'voornamen': 'Piet'}],
                         'afspraken': [{'id': 1, "omschrijving": "Loon"}]}]}}