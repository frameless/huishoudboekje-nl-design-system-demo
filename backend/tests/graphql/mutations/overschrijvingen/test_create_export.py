import requests_mock
from requests_mock import Adapter


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
        if request.path == "/afspraken/" and request.query == "begin_datum=2020-10-10&eind_datum=2020-12-31":
            return MockResponse({'data': [
                {'aantal_betalingen': 12, 'automatische_incasso': False, 'bedrag': 120000,
                 'omschrijving': 'Leefgeld Hulleman', 'credit': True, 'eind_datum': '2020-12-31', 'gebruiker_id': 1,
                 'id': 1, 'interval': 'P0Y1M0W0D', 'journaalposten': [], 'zoektermen': None, 'organisatie_id': None,
                 'overschrijvingen': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'rubriek_id': None,
                 'start_datum': '2020-01-01', 'tegen_rekening_id': 14}]}, 200)
        elif request.path == "/overschrijvingen/" and request.query == "filter_afspraken=1":
            return MockResponse({'data': [
                {'afspraak_id': 1, 'bank_transaction_id': None, 'bedrag': 10000, 'datum': '2020-01-01',
                 'export_id': None, 'id': 1},
                {'afspraak_id': 1, 'bank_transaction_id': None, 'bedrag': 10000, 'datum': '2020-02-01',
                 'export_id': None, 'id': 2},
                {'afspraak_id': 1, 'bank_transaction_id': None, 'bedrag': 10000, 'datum': '2020-03-01',
                 'export_id': None, 'id': 3},
                {'afspraak_id': 1, 'bank_transaction_id': None, 'bedrag': 10000, 'datum': '2020-04-01',
                 'export_id': None, 'id': 4},
                {'afspraak_id': 1, 'bank_transaction_id': None, 'bedrag': 10000, 'datum': '2020-05-01',
                 'export_id': None, 'id': 5},
                {'afspraak_id': 1, 'bank_transaction_id': None, 'bedrag': 10000, 'datum': '2020-06-01',
                 'export_id': None, 'id': 6},
                {'afspraak_id': 1, 'bank_transaction_id': None, 'bedrag': 10000, 'datum': '2020-07-01',
                 'export_id': None, 'id': 7},
                {'afspraak_id': 1, 'bank_transaction_id': None, 'bedrag': 10000, 'datum': '2020-08-01',
                 'export_id': None, 'id': 8},
                {'afspraak_id': 1, 'bank_transaction_id': None, 'bedrag': 10000, 'datum': '2020-09-01',
                 'export_id': None, 'id': 9},
                {'afspraak_id': 1, 'bank_transaction_id': None, 'bedrag': 10000, 'datum': '2020-10-01',
                 'export_id': None, 'id': 10},
                {'afspraak_id': 1, 'bank_transaction_id': None, 'bedrag': 10000, 'datum': '2020-11-01',
                 'export_id': None, 'id': 11}]}, 200)
        elif request.path == "/overschrijvingen/":
            return MockResponse({'data': {'afspraak_id': 1, 'bank_transaction_id': None, 'bedrag': 10000,
                                          'datum': '2020-12-01', 'export_id': 1, 'id': 23}}, 201)
        elif request.path == "/export/":
            return MockResponse({'data': {'id': 1, 'naam': '2020-12-16_13-04-27-SEPA-EXPORT',
                                          'timestamp': '2020-12-16T13:04:27+01:00',
                                          'xmldata': '<?xml version="1.0" encoding="UTF-8"?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><CstmrCdtTrfInitn><GrpHdr><MsgId>20210112044131-94064e82eecf</MsgId><CreDtTm>2021-01-12T16:41:31</CreDtTm><NbOfTxs>1</NbOfTxs><CtrlSum>100.00</CtrlSum><InitgPty><Nm>Huishoudboekje Gemeente Sloothuizen</Nm></InitgPty></GrpHdr><PmtInf><PmtInfId>HuishoudboekjeGemeente-c9756fa217ca</PmtInfId><PmtMtd>TRF</PmtMtd><BtchBookg>false</BtchBookg><NbOfTxs>1</NbOfTxs><CtrlSum>100.00</CtrlSum><PmtTpInf><SvcLvl><Cd>SEPA</Cd></SvcLvl></PmtTpInf><ReqdExctnDt>2020-12-01</ReqdExctnDt><Dbtr><Nm>Huishoudboekje Gemeente Sloothuizen</Nm></Dbtr><DbtrAcct><Id><IBAN>NL36ABNA5632579034</IBAN></Id></DbtrAcct><DbtrAgt><FinInstnId><BIC>ABNANL2A</BIC></FinInstnId></DbtrAgt><ChrgBr>SLEV</ChrgBr><CdtTrfTxInf><PmtId><EndToEndId>NOTPROVIDED</EndToEndId></PmtId><Amt><InstdAmt Ccy="EUR">100.00</InstdAmt></Amt><CdtrAgt><FinInstnId /></CdtrAgt><Cdtr><Nm>S. Hulleman</Nm></Cdtr><CdtrAcct><Id><IBAN>GB33BUKB20201555556655</IBAN></Id></CdtrAcct><RmtInf><Ustrd>Leefgeld Hulleman</Ustrd></RmtInf></CdtTrfTxInf></PmtInf></CstmrCdtTrfInitn></Document>'}}, 201)
        elif request.path == "/rekeningen/" and request.query == "filter_ids=14":
            return MockResponse({'data': [
                {'afspraken': [1], 'gebruikers': [], 'iban': 'GB33BUKB20201555556655', 'id': 14, 'organisaties': [1],
                 'rekeninghouder': 'S. Hulleman'}]}, 200)
        elif request.path == '/configuratie/derdengeldenrekening_rekeninghouder':
            return MockResponse({'data': {'id': 'derdengeldenrekening_rekeninghouder', 'waarde': 'Gemeente Sloothuizen'}}, 200)
        elif request.path == "/configuratie/derdengeldenrekening_iban":
            return MockResponse({'data': {'id': 'derdengeldenrekening_iban', 'waarde': 'NL36ABNA5632579034'}}, 200)
        elif request.path == "/configuratie/derdengeldenrekening_bic":
            return MockResponse({'data': {'id': 'derdengeldenrekening_bic', 'waarde': 'ABNANL2A'}}, 200)

    adapter.add_matcher(test_matcher)
    return adapter


def test_create_export_success(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter()
        response = client.post(
            "/graphql",
            json={
                "query": '''
                mutation createExportOverschrijvingen($startDatum: String, 
                $eindDatum: String) {
                  createExportOverschrijvingen(startDatum: $startDatum, eindDatum:$eindDatum) {
                    ok,
                    export {
                        id,
                        xmldata
                    }
                  }
                }''',
                "variables": {'startDatum': '2020-10-10',
                              'eindDatum': '2020-12-31'}},
            content_type='application/json'
        )
        assert mock._adapter.call_count == 8
        assert response.json["data"]["createExportOverschrijvingen"]["ok"] is True
