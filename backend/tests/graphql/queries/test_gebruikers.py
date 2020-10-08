#import requests
import os
from hhb_backend.graphql import settings
import requests_mock

def test_gebruikers_success(client):
    with requests_mock.Mocker() as rm:
        rm.get(os.path.join(settings.HHB_SERVICES_URL,"gebruikers/"), json={'data':[ {'email': 'a@b.c'} ]})
        response = client.post(
            "/graphql",
            data='{"query": "{ gebruikersQuery { gebruikers { email }}}"}',
            content_type='application/json'
        )
        assert response.json == {'data': {'gebruikersQuery': {'gebruikers': [ {'email': 'a@b.c'} ]}}}

def test_gebruiker_success(client):
    with requests_mock.Mocker() as rm:
        rm.get(os.path.join(settings.HHB_SERVICES_URL,"gebruikers/1"), json={'data': {'email': 'a@b.c'} })
        response = client.post(
            "/graphql",
            data='{"query": "{ gebruikersQuery { gebruiker(id:1) { email }}}"}',
            content_type='application/json'
        )
        assert response.json == {'data': {'gebruikersQuery': {'gebruiker': {'email': 'a@b.c'} }}}