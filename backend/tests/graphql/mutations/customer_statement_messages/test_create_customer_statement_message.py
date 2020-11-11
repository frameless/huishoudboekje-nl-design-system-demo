import json
import os

import requests_mock

ING_CSM_FILE = os.path.join(os.path.dirname(__file__), 'ING.txt')
ABN_CSM_FILE = os.path.join(os.path.dirname(__file__), 'ABN.txt')
BNG_CSM_FILE = os.path.join(os.path.dirname(__file__), 'BNG.txt')
INCORRECT_CSM_FILE = os.path.join(os.path.dirname(__file__), 'incorrect.txt')


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


def test_create_csm_with_ing_file(client):
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        assert request.json()["account_identification"] == "NL69INGB0123456789EUR"
        assert request.json()["closing_available_funds"] == 56435
        assert request.json()["closing_balance"] == 56435
        assert request.json()["forward_available_balance"] == 56435
        assert request.json()["opening_balance"] == 66223
        assert request.json()[
                   "raw_data"] == "{1:F01INGBNL2ABXXX0000000000}\r\n{2:I940INGBNL2AXXXN}\r\n{4:\r\n:20:P140220000000001\r\n:25:NL69INGB0123456789EUR\r\n:28C:00000\r\n:60F:C140219EUR662,23\r\n:61:1402200220C1,56NTRFEREF//00000000001005/TRCD/00100/\r\n:86:/EREF/EV12341REP1231456T1234//CNTP/NL32INGB0000012345/INGBNL2A/ING BANK NV INZAKE WEB///REMI/USTD//EV10001REP1000000T1000/\r\n:61:1402200220D1,57NTRFPREF//00000000001006/TRCD/00200/\r\n:86:/PREF/M000000003333333//REMI/USTD//TOTAAL 1 VZ/\r\n:61:1402200220C1,57NRTIEREF//00000000001007/TRCD/00190/\r\n:86:/RTRN/MS03//EREF/20120123456789//CNTP/NL32INGB0000012345/INGBNL2A/J.Janssen///REMI/USTD//Factuurnr 123456 Klantnr 00123/\r\n:61:1402200220D1,14NDDTEREF//00000000001009/TRCD/01016/\r\n:86:/EREF/EV123REP123412T1234//MARF/MND\u00adEV01//CSID/NL32ZZZ999999991234//CNTP/NL32INGB0000012345/INGBNL2A/ING Bank N.V. inzake WeB///REMI/USTD//EV123REP123412T1234/\r\n:61:1402200220C1,45NDDTPREF//00000000001008/TRCD/01000/\r\n:86:/PREF/M000000001111111//CSID/NL32ZZZ999999991234//REMI/USTD//TOTAAL       1 POSTEN/\r\n:61:1402200220D12,75NRTIEREF//00000000001010/TRCD/01315/\r\n:86:/RTRN/MS03//EREF/20120501P0123478//MARF/MND\u00ad120123//CSID/NL32ZZZ999999991234//CNTP/NL32INGB0000012345/INGBNL2A/J.Janssen///REMI/USTD//CONTRIBUTIE FEB 2014/\r\n:61:1402200220C32,00NTRF9001123412341234//00000000001011/TRCD/00108/\r\n:86:/EREF/15814016000676480//CNTP/NL32INGB0000012345/INGBNL2A/J.Janssen///REMI/STRD/CUR/9001123412341234/\r\n:61:1402200220D119,00NTRF1070123412341234//00000000001012/TRCD/00108/\r\n:86:/EREF/15614016000384600//CNTP/NL32INGB0000012345/INGBNL2A/INGBANK NV///REMI/STRD/CUR/1070123412341234/\r\n:62F:C140220EUR564,35\r\n:64:C140220EUR564,35\r\n:65:C140221EUR564,35\r\n:65:C140224EUR564,35\r\n:86:/SUM/4/4/134,46/36,58/\r\n\u00ad}"
        assert request.json()["transaction_reference_number"] == "P140220000000001"
        return MockResponse({'data': [{'id': 1}]}, 201)

    adapter.add_matcher(test_matcher)

    with open(ING_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            response = client.post(
                '/graphql/upload',
                data=create_data_post(testfile)
            )
            assert response.status_code == 200


def test_create_csm_with_abn_file(client):
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        assert request.json()["account_identification"] == "123456789"
        assert request.json()["transaction_reference_number"] == "ABN AMRO BANK NV"
        assert request.json()["sequence_number"] == "1"
        assert request.json()["opening_balance"] == 513861
        assert request.json()["closing_balance"] == 563862
        assert request.json()[
                   "raw_data"] == """:20:ABN AMRO BANK NV
:25:123456789
:28:13501/1
:60F:C120511EUR5138,61
:61:1205120514C500,01N654NONREF
:86:/TRTP/SEPA OVERBOEKING/IBAN/FR12345678901234/BIC/GEFRADAM
/NAME/QASD JGRED/REMI/Dit zijn de omschrijvingsregels/EREF/NOTPRO
VIDED
:62F:C120514EUR5638,62"""
        return MockResponse({'data': [{'id': 1}]}, 201)

    adapter.add_matcher(test_matcher)

    with open(ABN_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            response = client.post(
                '/graphql/upload',
                data=create_data_post(testfile)
            )
            assert response.status_code == 200


def test_create_csm_with_bng_file(client):
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        assert request.json()["account_identification"] == "0285053876"
        assert request.json()["transaction_reference_number"] == "34948929"
        assert request.json()["sequence_number"] == "1"
        assert request.json()["opening_balance"] == -2000000
        assert request.json()["closing_balance"] == 17060000
        assert request.json()[
                   "raw_data"] == """0200 13XXXXXXXXXXXX00000
0200 13BNGHNL20AXXX00000
940 02
:20:34948929
:25:0285053876
:28C:9/1
:60F:D140831EUR20000,00
:61:140912D1000,00NMSC028
:86:0266474500                       Bakkerij van Bohemen Lange Houtstraat 11              Den Haag Bestelling van gebak
:61:120912D1000,00NMSC028
:86:DE37500700100925464001           DEUTDEFF Schuhe GMBH                      Frankfurt Zahlungsnummer 1234567
:61:140912D10000,00NMSC028
:86:EB BATCH: 123456789               POSTEN: 000057                        LST 5 POS SOM REKNRS 78.445                    
:61:140912D10000,00NMSC028
:86:EB BATCH: 123456790               POSTEN: 000022  
:61:140912D100,00NMSC091
:86:P0001234567                       Handelsmaatschappij Amsterdam                        BET KENMERK: 123456789 Levering potloden
:61:140912D100,00NMSC091
:86:DE37500700100925464001           DEUTDEFF Deutschland GMBH                 Frankfurt REFO:1234567890                  Incassant ID Kenmerk machtiging               Zahlungsnummer 1234568 :61:140912D100,00NMSC092
:86:OORSPR. VEREV. 120903            BET KENMERK: KTB-966591 P0001234533                      P. Pieterse NIET AKKOORD MET AFSCHRIJVING      Huur september 
:61:140912D100,00NMSC092
:86: OORSPR. VEREV. 120903           REFO:KTB-966591 NL12RABO0313131314               J. Jansen REDEN TERUGBOEKING               Kenmerk machtiging Huur september 
:61:140912C1000,00NMSC027
:86:0266474855                       K. Geel                         Prinsessengracht 2               Den Haag Hondenbelasting 2012
:61:140912C1000,00NMSC027
:86:NL09INGB0000156610               INGBNL2A Belastingdienst                  Amsterdam NL REFO: BEL1234678                 correctiebedrag maand augustus
:61:140912C100000,00NMSC091
:86:000701326323232323               TOTAAL INCASSO                        VOOR COMPRIMEREN:3.500 POSTEN    LAATSTE 5 POS SOM REKNRS: 78.3345
:61:140912C100000,00NMSC091
:86:BATCH INCASSO:123456789          VOOR COMPRIMEREN:5.500 POSTEN   LAATSTE 5 POS SHA1:23473
:61:140912C10000,00NMSC095
:86:BGC. 99 ACCEPTGIRO’S             RUNNR: 4956
:61:140912C1000,00NMSC095
:86:IBAN ACCEPTGIRO                  NL09INGB0001236610 P.Klaassen                       REMI:1234567890123456
:62F:C140912EUR170600,00
-"""
        return MockResponse({'data': [{'id': 1}]}, 201)

    adapter.add_matcher(test_matcher)

    with open(BNG_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            response = client.post(
                '/graphql/upload',
                data=create_data_post(testfile)
            )
            assert response.status_code == 200


def test_create_csm_with_incorrect_file(client):

    with open(INCORRECT_CSM_FILE, "rb") as testfile:
        response = client.post(
            '/graphql/upload',
            data=create_data_post(testfile)
        )
        assert response.json['errors'] is not None
        assert response.status_code == 200


def create_data_post(testfile):
    query = '''
        mutation testCSMCreate($file: Upload!) {
            createCustomerStatementMessage(file: $file) {
                ok
            }
        }
    '''
    return {
        'operations': json.dumps({
            'query': query,
            'variables': {
                'file': None,
            },
        }),
        't_file': testfile,
        'map': json.dumps({
            't_file': ['variables.file'],
        }),
    }
