import re

import requests_mock
from requests_mock import Adapter


class MockResponse:
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
        print(request.path)
        print(request.query)
        if request.path == "/export/" and request.query == "filter_ids=2":
            return MockResponse({
                'data': [{
                    'id': 2,
                    'naam': '2020-12-16_13-04-27-SEPA-EXPORT',
                    'overschrijvingen': [25],
                    'timestamp': '2020-12-16T13:04:27+01:00',
                    'xmldata': '<?xml version="1.0" encoding="UTF-8"?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><CstmrCdtTrfInitn><GrpHdr><MsgId>20201212010000-ac01f2efa25f</MsgId><CreDtTm>2020-12-12T00:00:00</CreDtTm><NbOfTxs>1</NbOfTxs><CtrlSum>100.00</CtrlSum><InitgPty><Nm>Huishoudboekje Gemeente Sloothuizen</Nm></InitgPty></GrpHdr><PmtInf><PmtInfId>HuishoudboekjeGemeente-df0ea642ccd3</PmtInfId><PmtMtd>TRF</PmtMtd><BtchBookg>false</BtchBookg><NbOfTxs>1</NbOfTxs><CtrlSum>100.00</CtrlSum><PmtTpInf><SvcLvl><Cd>SEPA</Cd></SvcLvl></PmtTpInf><ReqdExctnDt>2020-12-01</ReqdExctnDt><Dbtr><Nm>Huishoudboekje Gemeente Sloothuizen</Nm></Dbtr><DbtrAcct><Id><IBAN>NL36ABNA5632579034</IBAN></Id></DbtrAcct><DbtrAgt><FinInstnId><BIC>ABNANL2A</BIC></FinInstnId></DbtrAgt><ChrgBr>SLEV</ChrgBr><CdtTrfTxInf><PmtId><EndToEndId>NOTPROVIDED</EndToEndId></PmtId><Amt><InstdAmt Ccy="EUR">100.00</InstdAmt></Amt><CdtrAgt><FinInstnId /></CdtrAgt><Cdtr><Nm>S. Hulleman</Nm></Cdtr><CdtrAcct><Id><IBAN>GB33BUKB20201555556655</IBAN></Id></CdtrAcct><RmtInf><Ustrd>Leefgeld Hulleman</Ustrd></RmtInf></CdtTrfTxInf></PmtInf></CstmrCdtTrfInitn></Document>'
                }]
            }, 200)

    adapter.add_matcher(test_matcher)
    return adapter


def test_get_export_success(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter()
        response = client.get("/export/2")
        print(f">>> response: {response.data}")
        expected_response = b'<?xml version="1.0" encoding="UTF-8"?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><CstmrCdtTrfInitn><GrpHdr><MsgId>20201212010000-ac01f2efa25f</MsgId><CreDtTm>2020-12-12T00:00:00</CreDtTm><NbOfTxs>1</NbOfTxs><CtrlSum>100.00</CtrlSum><InitgPty><Nm>Huishoudboekje Gemeente Sloothuizen</Nm></InitgPty></GrpHdr><PmtInf><PmtInfId>HuishoudboekjeGemeente-df0ea642ccd3</PmtInfId><PmtMtd>TRF</PmtMtd><BtchBookg>false</BtchBookg><NbOfTxs>1</NbOfTxs><CtrlSum>100.00</CtrlSum><PmtTpInf><SvcLvl><Cd>SEPA</Cd></SvcLvl></PmtTpInf><ReqdExctnDt>2020-12-01</ReqdExctnDt><Dbtr><Nm>Huishoudboekje Gemeente Sloothuizen</Nm></Dbtr><DbtrAcct><Id><IBAN>NL36ABNA5632579034</IBAN></Id></DbtrAcct><DbtrAgt><FinInstnId><BIC>ABNANL2A</BIC></FinInstnId></DbtrAgt><ChrgBr>SLEV</ChrgBr><CdtTrfTxInf><PmtId><EndToEndId>NOTPROVIDED</EndToEndId></PmtId><Amt><InstdAmt Ccy="EUR">100.00</InstdAmt></Amt><CdtrAgt><FinInstnId /></CdtrAgt><Cdtr><Nm>S. Hulleman</Nm></Cdtr><CdtrAcct><Id><IBAN>GB33BUKB20201555556655</IBAN></Id></CdtrAcct><RmtInf><Ustrd>Leefgeld Hulleman</Ustrd></RmtInf></CdtTrfTxInf></PmtInf></CstmrCdtTrfInitn></Document>'

        assert mock._adapter.call_count == 1
        assert re.match("(application|text)/xml; charset=utf-8", response.content_type)
        assert response.status == '200 OK'
        assert response.data == expected_response
