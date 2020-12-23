import requests_mock
from requests_mock import Adapter
from freezegun import freeze_time
import difflib


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
        if request.path == "/overschrijvingen/" and request.query == "filter_exports=2":
            return MockResponse({'data': [
                {'afspraak_id': 1, 'bank_transaction_id': None, 'bedrag': 10000, 'datum': '2020-12-01', 'export_id': 2,
                 'id': 25}]}, 200)
        elif request.path == "/afspraken/" and request.query == "filter_ids=1":
            return MockResponse(
                {'data': [{'aantal_betalingen': 12, 'actief': True, 'automatische_incasso': False, 'bedrag': 120000,
                           'beschrijving': 'Leefgeld Hulleman', 'credit': True, 'eind_datum': '2020-12-31',
                           'gebruiker_id': 1, 'id': 1, 'interval': 'P0Y1M0W0D', 'journaalposten': [], 'kenmerk': None,
                           'organisatie_id': None, 'overschrijvingen': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 25],
                           'rubriek_id': None, 'start_datum': '2020-01-01', 'tegen_rekening_id': 14}]}, 200)
        elif request.path == "/rekeningen/" and request.query == "filter_ids=14":
            return MockResponse({'data': [
                {'afspraken': [1], 'gebruikers': [], 'iban': 'GB33BUKB20201555556655', 'id': 14, 'organisaties': [1],
                 'rekeninghouder': 'S. Hulleman'}]}, 200)
        elif request.path == '/configuratie/gemeente_naam':
            return MockResponse({'data': {'id': 'gemeente_naam', 'waarde': 'Gemeente Sloothuizen'}}, 200)
        elif request.path == "/configuratie/gemeente_iban":
            return MockResponse({'data': {'id': 'gemeente_iban', 'waarde': 'NL36ABNA5632579034'}}, 200)
        elif request.path == "/configuratie/gemeente_bic":
            return MockResponse({'data': {'id': 'gemeente_bic', 'waarde': 'ABNANL2A'}}, 200)
        elif request.path == "/export/2":
            return MockResponse({'data': {'id': 2, 'naam': '2020-12-16_13-04-27-SEPA-EXPORT', 'overschrijvingen': [25],
                                          'timestamp': '2020-12-16T13:04:27+01:00'}}, 200)

    adapter.add_matcher(test_matcher)
    return adapter


@freeze_time("2020-12-12")
def test_get_export_success(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter()
        response = client.get(
            "/export/2")
        expected_response = b'<?xml version="1.0" encoding="UTF-8"?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><CstmrCdtTrfInitn><GrpHdr><MsgId>20201212010000-ac01f2efa25f</MsgId><CreDtTm>2020-12-12T00:00:00</CreDtTm><NbOfTxs>1</NbOfTxs><CtrlSum>100.00</CtrlSum><InitgPty><Nm>Huishoudboekje Gemeente Sloothuizen</Nm></InitgPty></GrpHdr><PmtInf><PmtInfId>HuishoudboekjeGemeente-df0ea642ccd3</PmtInfId><PmtMtd>TRF</PmtMtd><BtchBookg>false</BtchBookg><NbOfTxs>1</NbOfTxs><CtrlSum>100.00</CtrlSum><PmtTpInf><SvcLvl><Cd>SEPA</Cd></SvcLvl></PmtTpInf><ReqdExctnDt>2020-12-01</ReqdExctnDt><Dbtr><Nm>Huishoudboekje Gemeente Sloothuizen</Nm></Dbtr><DbtrAcct><Id><IBAN>NL36ABNA5632579034</IBAN></Id></DbtrAcct><DbtrAgt><FinInstnId><BIC>ABNANL2A</BIC></FinInstnId></DbtrAgt><ChrgBr>SLEV</ChrgBr><CdtTrfTxInf><PmtId><EndToEndId>NOTPROVIDED</EndToEndId></PmtId><Amt><InstdAmt Ccy="EUR">100.00</InstdAmt></Amt><CdtrAgt><FinInstnId /></CdtrAgt><Cdtr><Nm>S. Hulleman</Nm></Cdtr><CdtrAcct><Id><IBAN>GB33BUKB20201555556655</IBAN></Id></CdtrAcct><RmtInf><Ustrd>Leefgeld Hulleman</Ustrd></RmtInf></CdtTrfTxInf></PmtInf></CstmrCdtTrfInitn></Document>'

        assert mock._adapter.call_count == 7
        assert response.content_type == 'text/xml; charset=utf-8'
        assert response.status == '200 OK'
        ratio = difflib.SequenceMatcher(None, response.data, expected_response).ratio()
        assert ratio >= 0.98
