import requests_mock
from requests_mock import Adapter

from hhb_backend.graphql import settings

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


def test_create_burger_success(client):
    with requests_mock.Mocker() as mock:
        get_rekening = mock.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ibans=GB33BUKB20201555555555",
            json={"data": [{"id": 1}]}
        )
        post_burger = mock.post(f"{settings.HHB_SERVICES_URL}/burgers/", json={'data': {'id': 1}}, status_code=201)
        post_rekening = mock.post(f"{settings.HHB_SERVICES_URL}/burgers/1/rekeningen/", json={'data': {'id': 1}}, status_code=201)
        post_gebruikersactiviteit = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        post_huishouden = mock.post(f"{settings.HHB_SERVICES_URL}/huishoudens/", json={'data': {'id': 1}}, status_code=201)

        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation test($input:CreateBurgerInput!) {
          createBurger(input:$input) {
            ok
            burger {
              id
            }
          }
        }''',
                "variables": {"input": {
                    'bsn': 845233488,
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
                    'rekeningen': [{"iban": "GB33BUKB20201555555555",
                                    "rekeninghouder": "C. Lown"}]}}},
            content_type='application/json'
        )

        assert get_rekening.call_count == 1
        assert post_burger.call_count == 1
        assert post_rekening.call_count == 1
        assert post_huishouden.call_count == 1
        assert post_gebruikersactiviteit.call_count == 1
        assert response.json["data"]["createBurger"]["ok"] is True


def create_mock_new_rekening_adapter() -> Adapter:
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        if request.path == "/rekeningen/" and request.query == "filter_ibans=gb33bukb20201555555555":
            return MockResponse({'data': ""}, 200)
        elif request.path == "/burgers/":
            return MockResponse({'data': {'id': 1}}, 201)
        elif request.path == "/burgers/1/rekeningen/":
            return MockResponse({'data': "{'id': 1}"}, 201)
        elif request.path == "/rekeningen/":
            return MockResponse({'data': {'id': 10}}, 201)
        elif request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)
        elif request.path == "/huishoudens/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter


def test_create_burger_with_new_rekening_valid_success(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_new_rekening_adapter()

        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation test($input:CreateBurgerInput!) {
          createBurger(input:$input) {
            ok
            burger {
              id
            }
          }
        }''',
                "variables": {"input": {
                    'bsn': 845233488,
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
                    'rekeningen': [{"iban": "GB33BUKB20201555555555",
                                    "rekeninghouder": "C. Lown"}]}}},
            content_type='application/json'
        )

        assert mock._adapter.call_count == 6
        assert response.json == {"data": {"createBurger": {"ok": True, "burger": {"id": 1}}}}


def create_mock_new_rekening_invalid_adapter() -> Adapter:
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        if request.path == "/rekeningen/" and request.query == "filter_ibans=33bukb20201555555555":
            return MockResponse({'data': ""}, 200)
        elif request.path == "/burgers/":
            return MockResponse({'data': {'id': 1}}, 201)
        elif request.path == "/burgers/1/rekeningen/":
            return MockResponse({'data': "{'id': 1}"}, 201)
        elif request.path == "/huishoudens/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter


def test_create_burger_with_new_rekening_invalid_success(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_new_rekening_invalid_adapter()
        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation test($input:CreateBurgerInput!) {
          createBurger(input:$input) {
            ok
            burger {
              id
            }
          }
        }''',
                "variables": {"input": {
                    'bsn': 845233488,
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
                    'rekeningen': [{"iban": "33BUKB20201555555555",
                                    "rekeninghouder": "C. Lown"}]}}},
            content_type='application/json'
        )

        assert mock._adapter.call_count == 3
        assert response.json['errors'][0]['message'] == "Invalid IBAN: 33BUKB20201555555555"


def create_mock_huishouden_id_success_adapter() -> Adapter:
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        if request.path == "/rekeningen/" and request.query == "filter_ibans=gb33bukb20201555555555":
            return MockResponse({'data': ""}, 200)
        elif request.path == "/rekeningen/":
            return MockResponse({'data': {'id': 1}}, 201)
        elif request.path == "/burgers/":
            return MockResponse({'data': {'id': 1, 'huishouden_id': 1}}, 201)
        elif request.path == "/burgers/1/rekeningen/":
            return MockResponse({'data': "{'id': 1}"}, 201)
        elif request.path == "/huishoudens/" and request.query == "filter_ids=1":
            return MockResponse({'data': [{'id': 1}]}, 200)
        elif request.path == "/huishoudens/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter


def test_create_burger_with_huishouden_id_success(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_huishouden_id_success_adapter()

        response = client.post(
            "/graphql",
            json={
                "query": '''
                mutation test($input:CreateBurgerInput!) {
                  createBurger(input:$input) {
                    ok
                    burger {
                      id
                      huishouden{
                        id
                      }
                    }
                  }
                }''',
                "variables": {"input": {
                    'bsn': 845233488,
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
                    'rekeningen': [{"iban": "GB33BUKB20201555555555",
                                    "rekeninghouder": "C. Lown"}],
                    'huishouden': {'id': 1}
                }}},
            content_type='application/json'
        )

        assert mock._adapter.call_count == 7
        assert response.json["data"]["createBurger"]["ok"] is True

