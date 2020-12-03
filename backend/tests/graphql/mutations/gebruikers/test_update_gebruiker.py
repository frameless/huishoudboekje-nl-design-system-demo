import requests_mock
from requests_mock import Adapter


class MockResponse():
    history = None
    raw = None
    is_redirect = None
    content = None

    def __init__(self, json_data, status_code):
        self.json_data = json_data
        self.status_code = status_code

    def json(self):
        return self.json_data


def create_mock_adapter() -> Adapter:
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        return MockResponse({'data': "{'id': 1}"}, 200)

    adapter.add_matcher(test_matcher)
    return adapter


def test_update_gebruiker_success(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter()
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
            content_type='application/json'
        )
        assert mock._adapter.call_count == 1
        assert response.json["data"]["updateGebruiker"]["ok"] is True
