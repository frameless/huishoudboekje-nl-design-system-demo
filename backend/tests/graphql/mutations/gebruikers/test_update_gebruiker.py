import requests_mock
from requests_mock import Adapter

from hhb_backend.graphql import settings


def test_update_gebruiker_success(client):
    with requests_mock.Mocker() as mock:
        post_adapter = mock.post(f"{settings.HHB_SERVICES_URL}/gebruikers/1", status_code=200, json={"data": {"id": 1}})
        get_adapter = mock.get(f"{settings.HHB_SERVICES_URL}/gebruikers/?filter_ids=1", status_code=200,
                               json={"data": [{"id": 1}]})
        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation updateGebruiker($id: Int!, 
        $voorletters: String,
        $voornamen: String,
        $achternaam: String,
        $geboortedatum: String,
        $straatnaam: String,
        $huisnummer: String,
        $postcode: String,
        $plaatsnaam: String,
        $telefoonnummer: String,
        $email: String) {
          updateGebruiker(id: $id, email:$email, geboortedatum: $geboortedatum, telefoonnummer: $telefoonnummer, 
          achternaam: $achternaam, huisnummer: $huisnummer, postcode: $postcode, straatnaam: $straatnaam, voorletters: $voorletters, voornamen: $voornamen, plaatsnaam: $plaatsnaam) {
            ok
            gebruiker {
              id
            }
          }
        }''',
                "variables": {"id": 1,
                              'email': 'test@test.com',
                              'geboortedatum': "1999-10-10",
                              'telefoonnummer': "0612345678",
                              'achternaam': "Hulk",
                              'huisnummer': "13a",
                              'postcode': "9999ZZ",
                              'straatnaam': "Hoofdstraat",
                              'voorletters': "H",
                              'voornamen': "Hogan",
                              'plaatsnaam': "Dorp"}},
        )
        assert get_adapter.called_once
        assert post_adapter.called_once
        assert response.json["data"]["updateGebruiker"]["ok"] is True
