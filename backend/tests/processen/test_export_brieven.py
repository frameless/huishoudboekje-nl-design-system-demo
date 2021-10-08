import requests_mock
from requests_mock import Adapter
from hhb_backend.processen import brieven_export
from datetime import datetime

class MockResponse():
    history = None
    raw = None
    is_redirect = None
    content = None

    def __init__(self, json_data, status_code, ok=True):
        self.json_data = json_data
        self.status_code = status_code
        self.ok = ok

    def json(self):
        return self.json_data

    def ok(self):
        return self.ok

def create_mock_adapter() -> Adapter:
    adapter = requests_mock.Adapter()

    def test_matcher(request):

        if request.path == "/burgers/1":
            return MockResponse({'data': {'id': 1, 'voornamen': "burgernaam",
                                          'achternaam': 'burgerachternaam',
                                          'straatnaam': 'burgerstraat', 'huisnummer': 1,
                                          'postcode':'1234AB', 'plaatsnaam':'burgerplaats'}}, 200)
        elif request.path == "/afspraken/":
            return MockResponse({'data': [{
                "burgerId": 1, "credit": False, "organisatie_id": 1, "tegenRekeningId": 1,
                "rubriekId": 1,"omschrijving": "Omschrijving", "bedrag": "0.00",
                'zoektermen': {"zoektest"}, 'valid_through':"2019-01-01"}]},200)
        elif request.path == "/organisaties/" and request.query == "filter_ids=1":
            return MockResponse({'data': [{'id': 1, "kvk_nummer": 12345678}]},200)
        elif request.path == "/organisaties/" and request.query == "filter_kvks=12345678":
            return MockResponse({'data': [{'id': 1, 'kvk_nummer': 12345678,
                                           'naam': 'organisatie1', 'straatnaam': 'teststraat',
                                           'huisnummer': 1, 'postcode': '9999ZZ',
                                           'plaatsnaam': 'testplaats'}]},200)
        elif request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter

def test_create_export_brieven(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter()

        response_csv, filename_csv, data_excel, filename_excel = brieven_export.create_brieven_export(1)
        current_date_str = datetime.now().strftime("%Y-%m-%d")

        assert response_csv == f'organisatie.naam|organisatie.postadres.adresregel1|organisatie.postadres.postcode|organisatie.postadres.plaats|afspraak.id|nu.datum|burger.naam|burger.postadres.adresregel1|burger.postadres.postcode|burger.postadres.plaats|betaalrichting|status.afspraak\norganisatie1|teststraat 1|9999ZZ|testplaats|zoektest|{current_date_str}|burgernaam burgerachternaam|burgerstraat 1|1234AB|burgerplaats|debet|2019-01-01\n'


