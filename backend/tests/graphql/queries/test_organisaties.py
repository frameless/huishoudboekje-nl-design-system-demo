import requests_mock
from hhb_backend.graphql import settings

def test_organisatie(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_afdelingen=1",
               json={'data': [{'id': 1, 'iban': "NL02ABNA0123456789", 'afdelingen': [1]}]})
        rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_organisaties=1",
               json={'data': [{'id': 1,
                               'naam': 'naam',
                               'organisatie_id': 1,
                               'postadressen_ids': ["test_id"]}]})
        rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/?filter_ids=1",
               json={'data': [{'id': 1, 'kvknummer':"123", 'vestigingsnummer':"321", "naam":"naam"}]})
        rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query test ($id:Int!) {
                    organisatie(id:$id) {
                      naam
                      afdelingen {id naam}
                      kvknummer
                      vestigingsnummer
                    }
                }''',
                "variables": {"id": 1}},
            content_type='application/json'
        )
        assert response.json ==  {'data': {'organisatie': {'naam': 'naam', 'afdelingen': [{'id': 1, 'naam': 'naam'}],
                                                           'kvknummer': '123', 'vestigingsnummer': "321"}}}


def test_organisaties(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_afdelingen=1",
               json={'data': [
                   {'id': 1, 'iban': "NL02ABNA0123456789", 'afdelingen': [1]}]})
        rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_organisaties=1",
            json={'data': [{'id': 1,
                            'naam': 'naam',
                            'organisatie_id': 1,
                            'postadressen_ids': ["test_id"]}]})
        rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/",
            json={'data': [{'id': 1, 'kvknummer': "123", 'vestigingsnummer': "321","naam": "naam"}]})
        rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query test {
                    organisaties {
                      naam
                      afdelingen {id naam}
                      kvknummer
                      vestigingsnummer
                    }
                }'''},
            content_type='application/json'
        )
        assert response.json == {'data': {'organisaties': [{'naam': 'naam',
                                                          'afdelingen': [{'id': 1,'naam': 'naam'}],
                                                          'kvknummer': '123',
                                                          'vestigingsnummer': "321"}]}}