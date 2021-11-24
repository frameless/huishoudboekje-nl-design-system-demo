import pytest
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
        if request.path == "/addresses":
            return MockResponse({'id': 1}, 201)
        elif request.path == "/afdelingen/" and request.query == "filter_ids=1":
            return MockResponse({'data': [{'id': 1, 'postadressen_ids': []}]}, 200)
        elif request.path == "/afdelingen/1":
            return MockResponse({'data': {'id': 1}}, 200)
        elif request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter


def test_create_postadres_succes(client):
    with requests_mock.Mocker() as rm:
        # arrange
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)


        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation test($input:CreatePostadresInput!) {
            createPostadres(input:$input) {
              ok
              postadres {
                id
                }
            }
        }''',
                "variables": {"input": {
                    'straatnaam': 'teststraat',
                    'huisnummer': '52B',
                    'postcode': '9999ZZ',
                    'plaatsnaam': 'testplaats',
                    'afdelingId': 1}}},
            content_type='application/json'
        )


        # assert
        print(f">> >> >> >> response: {response.json} ")
        for call in rm.request_history:
            print(f">> >> >> >> fallback: {call.method} {call.url} ")

        assert fallback.call_count == 0
        assert response.json["data"]["createPostadres"]["ok"] is True

