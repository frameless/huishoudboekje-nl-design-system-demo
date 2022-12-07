import requests_mock
from pydash import objects

from hhb_backend.graphql import settings


def test_update_burger_success(client):
    with requests_mock.Mocker() as mock:
        post_adapter = mock.post(f"{settings.HHB_SERVICES_URL}/burgers/1", status_code=200, json={"data": {
            "id": 1,
            'bsn': 209437972,
            'email': 'test@test.com',
            'geboortedatum': "1999-10-10",
            'telefoonnummer': "0612345678",
            'achternaam': "Hulk",
            'huisnummer': "13a",
            'postcode': "9999ZZ",
            'straatnaam': "Hoofdstraat",
            'voorletters': "H",
            'voornamen': "Hogan",
            'plaatsnaam': "Dorp",
            'rekeningen': [],
        }})
        get_adapter = mock.get(f"{settings.HHB_SERVICES_URL}/burgers/?filter_ids=1", status_code=200,
                               json={"data": [{"id": 1}]})
        log_adapter = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={'data': {'id': 1}}, status_code=201)
        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation updateBurger($id: Int!,
        $bsn: Int,
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
          updateBurger(id: $id, bsn: $bsn, email:$email, geboortedatum: $geboortedatum, telefoonnummer: $telefoonnummer,
          achternaam: $achternaam, huisnummer: $huisnummer, postcode: $postcode, straatnaam: $straatnaam, voorletters: $voorletters, voornamen: $voornamen, plaatsnaam: $plaatsnaam) {
            ok
            burger {
              id
            }
          }
        }''',
                "variables": {"id": 1,
                              'bsn': 209437972,
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

        assert get_adapter.call_count == 1
        assert post_adapter.call_count == 1
        assert log_adapter.call_count == 1
        assert objects.get(response.json, 'errors') == None
        assert response.json == {"data": {"updateBurger": {"ok": True, "burger": {"id": 1}}}}
