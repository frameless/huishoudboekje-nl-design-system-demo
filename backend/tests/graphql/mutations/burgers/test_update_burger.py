import requests_mock
from requests_mock import Adapter
from pydash import objects

from hhb_backend.graphql import settings


def test_update_burger_success(client):
    with requests_mock.Mocker() as mock:
        post_adapter = mock.post(f"{settings.HHB_SERVICES_URL}/burgers/1", status_code=200, json={"data": {"id": 1}})
        get_adapter = mock.get(f"{settings.HHB_SERVICES_URL}/burgers/?filter_ids=1", status_code=200,
                               json={"data": [{"id": 1}]})
        log_adapter = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={'data': {'id': 1}}, status_code=201)
        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation updateBurger($id: Int!, 
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
          updateBurger(id: $id, email:$email, geboortedatum: $geboortedatum, telefoonnummer: $telefoonnummer, 
          achternaam: $achternaam, huisnummer: $huisnummer, postcode: $postcode, straatnaam: $straatnaam, voorletters: $voorletters, voornamen: $voornamen, plaatsnaam: $plaatsnaam) {
            ok
            burger {
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
        assert log_adapter.called_once
        assert objects.get(response.json, 'errors') == None
        assert response.json == {"data": {"updateBurger": {"ok": True, "burger": {"id": 1}}}}
