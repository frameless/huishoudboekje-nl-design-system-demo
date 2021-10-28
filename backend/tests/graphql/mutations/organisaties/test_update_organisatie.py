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
        if request.method == "GET" and request.path == "/organisaties/" and request.query == "filter_ids=1":
            return MockResponse({'data': [{"id": 1, "kvknummer": "123456789", "vestigingsnummer": "012345678912", "naam": "test_organisatie"}]}, 200)
        elif request.method == "GET" and request.path == "/organisaties/":
            return MockResponse({'data': [{'id': 1}]}, 201)
        elif request.method == "POST" and  request.path == "/organisaties/1":
            return MockResponse({'data': {'id': 1}}, 200)
        elif request.method == "POST" and request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter


def test_update_organisatie_success(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter()
        organisatie_to_update = {"id": 1, "kvknummer": "123456789", "vestigingsnummer": "012345678912", "naam": "test_organisatie"}

        response = client.post(
            "/graphql",
            json={
                "query": '''
                mutation updateOrganisatie($id: Int!,
                $kvknummer: String,
                $vestigingsnummer: String,
                $naam: String) {
                  updateOrganisatie(id: $id, kvknummer: $kvknummer, vestigingsnummer: $vestigingsnummer, naam: $naam) {
                    ok
                    organisatie {
                      id
                    }
                  }
                }''',
                "variables": organisatie_to_update},
        )

        assert response.json == {"data": {"updateOrganisatie": {"ok": True, "organisatie": {"id": 1}}}}
        assert mock._adapter.call_count == 4

def create_mock_adapter2() -> Adapter:
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        if request.path == "/organisaties/" and request.query == "filter_ids=1":
            return MockResponse({'data': [{"id": 1, "kvknummer": "123456789", "vestigingsnummer": "012345678912", "naam": "test_organisatie"}]}, 200)
        if request.path == "/organisaties/":
            return MockResponse({'data': [{'id': 1, 'kvknummer': "123", 'vestigingsnummer': "123"},
                                          {'id': 2, 'kvknummer': "123", 'vestigingsnummer': "123"}]}, 201)
        elif request.path == "/organisaties/1":
            return MockResponse({'data': {'id': 1}}, 200)
        elif request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter


def test_update_organisatie_unique_fail(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter2()

        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation updateOrganisatie($id: Int!, $kvknummer: String, $vestigingsnummer: String,$naam: String) 
        { updateOrganisatie(id: $id, kvknummer: $kvknummer, vestigingsnummer: $vestigingsnummer, naam: $naam)  {
              ok
              organisatie {
                id
                }
            }
        }''',
                "variables": {
                    'id': 1,
                    'kvknummer': '123',
                    'vestigingsnummer': '123',
                    'naam': 'testOrganisatie'}},
            content_type='application/json'
        )

        assert mock._adapter.call_count == 2
        assert response.json["errors"][0]["message"] == "Combination kvk-nummer and vestigingsnummer is not unique."
