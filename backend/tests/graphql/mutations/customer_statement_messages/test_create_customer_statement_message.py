import json
import os

import requests_mock
from pytest_mock import MockerFixture
from requests_mock import Adapter

from hhb_backend.graphql import settings

ING_CSM_FILE = os.path.join(os.path.dirname(__file__), "ING.txt")
ABN_CSM_FILE = os.path.join(os.path.dirname(__file__), "ABN.txt")
BNG_CSM_FILE = os.path.join(os.path.dirname(__file__), "BNG.txt")
INCORRECT_CSM_FILE = os.path.join(os.path.dirname(__file__), "incorrect.txt")
ABN_CAMT_CSM_FILE = os.path.join(os.path.dirname(__file__), "CAMT_ABN.xml")
RABO_CAMT_CSM_FILE = os.path.join(os.path.dirname(__file__), "CAMT_RABO.xml")
ING_CAMT_CSM_FILE = os.path.join(os.path.dirname(__file__), "CAMT_ING.xml")
INCORRECT_CAMT_FILE = os.path.join(os.path.dirname(__file__), "incorrect.xml")
ANONIEM_CSM_FILE = os.path.join(os.path.dirname(__file__), "Anoniem.xml")
INCORRECT_FILE_FORMAT = os.path.join(os.path.dirname(__file__), "GameOver.jpg")
DANGEROUS_CAMT_CSM_FILE = os.path.join(os.path.dirname(__file__), "CAMT_DANGEROUS.xml")

class MockResponse:
    history = None
    raw = None
    is_redirect = None
    content = None

    def __init__(self, json_data, status_code):
        self.json_data = json_data
        self.status_code = status_code

    def json(self):
        return self.json_data


def test_create_csm_with_ing_file(client, mocker: MockerFixture):
    adapter = create_mock_adapter(mocker)

    with open(ING_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            m.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
            response = do_csm_post(client, testfile, mocker)
            # Customer Statement Message
            assert (
                adapter.request_history[0].json()["account_identification"]
                == "NL69INGB0123456789EUR"
            )
            assert adapter.request_history[0].json()["closing_available_funds"] == 56435
            assert adapter.request_history[0].json()["closing_balance"] == 56435
            assert (
                adapter.request_history[0].json()["forward_available_balance"] == 56435
            )
            assert adapter.request_history[0].json()["opening_balance"] == 66223
            assert (
                adapter.request_history[0].json()["transaction_reference_number"]
                == "P140220000000001"
            )
            # Bank transaction
            assert (
                adapter.request_history[1].json()[0]["tegen_rekening"]
                == "NL32INGB0000012345"
            )
            assert adapter.request_history[1].json()[0]["bedrag"] == 156
            assert adapter.request_history[1].json()[0]["transactie_datum"] == "2014-02-20"
            # Overall response
            assert len(adapter.request_history[1].json()) == 8
            assert adapter.call_count == 3
            assert response.json.get("errors") is None
            assert response.status_code == 200


def test_create_csm_with_abn_file(client, mocker: MockerFixture):
    adapter = create_mock_adapter(mocker)

    with open(ABN_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            m.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
            response = do_csm_post(client, testfile, mocker)
            # Customer Statement Message
            assert (
                adapter.request_history[0].json()["account_identification"]
                == "123456789"
            )
            assert (
                adapter.request_history[0].json()["transaction_reference_number"]
                == "ABN AMRO BANK NV"
            )
            assert adapter.request_history[0].json()["sequence_number"] == "1"
            assert adapter.request_history[0].json()["opening_balance"] == 513861
            assert adapter.request_history[0].json()["closing_balance"] == 563862
            # Bank transaction
            assert (
                adapter.request_history[1].json()[0]["tegen_rekening"]
                == "FR12345678901234"
            )
            assert adapter.request_history[1].json()[0]["bedrag"] == 50001
            assert adapter.request_history[1].json()[0]["transactie_datum"] == "2012-05-12"
            # Overall response
            assert len(adapter.request_history[1].json()) == 1
            assert adapter.call_count == 3
            assert response.json.get("errors") is None
            assert response.status_code == 200


def test_create_csm_with_bng_file(client, mocker: MockerFixture):
    adapter = create_mock_adapter(mocker)

    with open(BNG_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            m.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
            response = do_csm_post(client, testfile, mocker)
            # Customer Statement Message
            assert (
                adapter.request_history[0].json()["account_identification"]
                == "0285053876"
            )
            assert (
                adapter.request_history[0].json()["transaction_reference_number"]
                == "34948929"
            )
            assert adapter.request_history[0].json()["sequence_number"] == "1"
            assert adapter.request_history[0].json()["opening_balance"] == -2000000
            assert adapter.request_history[0].json()["closing_balance"] == 17060000
            # Bank transaction
            assert (
                adapter.request_history[1].json()[1]["tegen_rekening"]
                == "DE37500700100925464001"
            )
            assert adapter.request_history[1].json()[0]["bedrag"] == -100000
            assert adapter.request_history[1].json()[0]["transactie_datum"] == "2014-09-12"
            # Overall response
            assert len(adapter.request_history[1].json()) == 13
            assert adapter.call_count == 3
            assert response.json.get("errors") is None
            assert response.status_code == 200

def test_create_csm_with_abn_camt_file(client, mocker: MockerFixture):
    adapter = create_mock_adapter(mocker)

    with open(ABN_CAMT_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            m.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
            response = do_csm_post(client, testfile, mocker)

            # Customer Statement Message
            assert (
                adapter.request_history[0].json()["account_identification"]
                == "NL77ABNA0574908765"
            )
            assert (
                adapter.request_history[0].json()["transaction_reference_number"]
                == "0574908765.2013-04-02"
            )

            assert adapter.request_history[0].json()["closing_available_funds"] == 10001
            assert adapter.request_history[0].json()["closing_balance"] == 10001
            assert (
                adapter.request_history[0].json()["forward_available_balance"] == 10001
            )
            assert adapter.request_history[0].json()["opening_balance"] == 100001
            
            # Bank transaction
            assert (
                adapter.request_history[1].json()[1]["tegen_rekening"]
                == "NL46ABNA0499998748"
            )

            assert "/TRTP/SEPA OVERBOEKING/IBAN/NL46ABNA0499998748/BIC/ABNANL2A/NAME/NAAM/REMI/OMSCHRIJVING/EREF/NOTPROVIDED" in adapter.request_history[1].json()[1]["information_to_account_owner"]
            assert "NOTPROVIDED" in adapter.request_history[1].json()[1]["information_to_account_owner"]
            assert adapter.request_history[1].json()[1]["bedrag"] == 100
            assert adapter.request_history[1].json()[1]["transactie_datum"] == "2013-04-02"

            # Details from other transactions must be correct
            assert "/TRTP/SEPA ACCEPTGIRO/IBAN/NL46ABNA0499998748/BIC/ABNANL2A/NAME/NAAM/REMI//REMI/Issuer: CUR Ref: 1234567812345678/EREF/NOTPROVIDED" in adapter.request_history[1].json()[2]["information_to_account_owner"]
            assert "NOTPROVIDED" in adapter.request_history[1].json()[2]["information_to_account_owner"]
            
            assert  "/TRTP/SEPA ACCEPTGIRO BATCH/PREF/3095D4322561460S0PS/NRTX/10" in adapter.request_history[1].json()[3]["information_to_account_owner"]
            assert "NOTPROVIDED" in adapter.request_history[1].json()[3]["information_to_account_owner"]

            assert "/TRTP/SEPA ACCEPTGIRO BATCH/PREF/3095D4322561460S0PS/NRTX/10" in adapter.request_history[1].json()[4]["information_to_account_owner"]
            assert "NOTPROVIDED" in adapter.request_history[1].json()[4]["information_to_account_owner"]

            assert "/RTYP/SEPA Incasso niet uitgevoerd/MARF/123456789XXmandaat/RTRN/MS03/IBAN/NL27ABNA0562399340/NAME/Debtor/REMI/Levering maand mei, zie nota 1234556. Uw klantnummer 123455666/EREF/1234567X908303803" in adapter.request_history[1].json()[27]["information_to_account_owner"]
            assert "1234567X908303803" in adapter.request_history[1].json()[27]["information_to_account_owner"]
            assert "123456789XXmandaat" in adapter.request_history[1].json()[27]["information_to_account_owner"]
            
            # Overall response
            assert len(adapter.request_history[1].json()) == 29
            assert adapter.call_count == 3
            assert response.json.get("errors") is None
            assert response.status_code == 200

def test_create_csm_with_rabo_camt_file(client, mocker: MockerFixture):
    adapter = create_mock_adapter(mocker)

    with open(RABO_CAMT_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            m.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
            response = do_csm_post(client, testfile, mocker)

            # Customer Statement Message
            assert (
                adapter.request_history[0].json()["account_identification"]
                == 'NL44RABO0123456789'
            )
            assert adapter.request_history[0].json()["closing_available_funds"] == 83
            assert adapter.request_history[0].json()["closing_balance"] == 67
            assert (
                adapter.request_history[0].json()["forward_available_balance"] == 67
            )
            assert adapter.request_history[0].json()["opening_balance"] == 83
            assert (
                adapter.request_history[0].json()["transaction_reference_number"]
                == 'CAMT0532015012200001'
            )
            # Bank transaction
            assert (
                adapter.request_history[1].json()[1]["tegen_rekening"]
                == ""
            )
            assert adapter.request_history[1].json()[1]["bedrag"] == -3
            assert adapter.request_history[1].json()[1]["transactie_datum"] == "2015-01-23"
            assert adapter.request_history[1].json()[1]["information_to_account_owner"] == "Europayment Batch-id:0002"

            # Overall response
            assert len(adapter.request_history[1].json()) == 6
            assert adapter.call_count == 3
            assert response.json.get("errors") is None
            assert response.status_code == 200

def test_create_csm_with_ing_camt_file(client, mocker: MockerFixture):
    adapter = create_mock_adapter(mocker)

    with open(ING_CAMT_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            m.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
            response = do_csm_post(client, testfile, mocker)

            # Customer Statement Message
            assert (
                adapter.request_history[0].json()["account_identification"]
                == 'NL08INGB0000001234'
            )
            assert adapter.request_history[0].json()["closing_available_funds"] == 160500
            assert adapter.request_history[0].json()["closing_balance"] == 160500
            assert (
                adapter.request_history[0].json()["forward_available_balance"] == 160500
            )
            assert adapter.request_history[0].json()["opening_balance"] == 100000
            assert (
                adapter.request_history[0].json()["transaction_reference_number"]
                == '201401030009999'
            )
            # Bank transaction
            assert (
                adapter.request_history[1].json()[1]["tegen_rekening"]
                == "NL20INGB0001234567"
            )
            assert adapter.request_history[1].json()[1]["bedrag"] == 12500
            assert adapter.request_history[1].json()[1]["transactie_datum"] == "2014-01-03"
            assert adapter.request_history[1].json()[1]["information_to_account_owner"] == 'UstrdRemi2014010323566INGBankNV'
            assert "20140103E2EIdA1INGBankNV" in adapter.request_history[1].json()[2]["information_to_account_owner"]
            # Overall response
            assert len(adapter.request_history[1].json()) == 9
            assert adapter.call_count == 3
            assert response.json.get("errors") is None
            assert response.status_code == 200

def test_create_csm_with_anoniem_camt_file(client, mocker: MockerFixture):
    adapter = create_mock_adapter(mocker)

    with open(ANONIEM_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            m.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
            response = do_csm_post(client, testfile, mocker)
            # Customer Statement Message
            assert (
                adapter.request_history[0].json()["account_identification"]
                == 'NL49BNGH0285171712'
            )
            assert adapter.request_history[0].json()["closing_available_funds"] == 12097461
            assert adapter.request_history[0].json()["closing_balance"] == 12097461
            assert (
                adapter.request_history[0].json()["forward_available_balance"] == 12097461
            )
            assert adapter.request_history[0].json()["opening_balance"] == 12470442
            assert (
                adapter.request_history[0].json()["transaction_reference_number"]
                == '44280792'
            )
            # Bank transaction
            assert (
                adapter.request_history[1].json()[1]["tegen_rekening"]
                == 'NL54INGB0000000503'
            )
            assert adapter.request_history[1].json()[1]["bedrag"] == 100997
            assert adapter.request_history[1].json()[1]["transactie_datum"] == "2021-08-16"
            assert '''/TRTP/SEPA ontvangst/REMI/518303424874 Factnr 54005413523 BTW 137,11 Jaarafr 10.08.2021
                    Klantnr 12345678 CRN 3014357265 Straatnaam 1 3531 PN UTRECHT
                ''' in adapter.request_history[1].json()[1]["information_to_account_owner"]
            assert "518303424874" in adapter.request_history[1].json()[1]["information_to_account_owner"]
            assert '''/TRTP/SEPA ontvangst/REMI/MAAND AUG. NR. 123456789H1001 IB/PVV 2021 (ACHTER )
                ''' in adapter.request_history[1].json()[2]["information_to_account_owner"]
            assert "GVSXX20210811035337804" in adapter.request_history[1].json()[2]["information_to_account_owner"]
            # Overall response
            assert len(adapter.request_history[1].json()) == 23
            assert adapter.call_count == 3
            assert response.json.get("errors") is None
            assert response.status_code == 200

def test_create_csm_with_incorrect_file(client, mocker: MockerFixture):
    with open(INCORRECT_CSM_FILE, "rb") as testfile:
        response = do_csm_post(client, testfile, mocker)
        assert response.json["errors"] is not None
        assert response.status_code == 200

def test_create_camt_with_incorrect_file(client, mocker: MockerFixture):
    with open(INCORRECT_CAMT_FILE, "rb") as testfile:
        response = do_csm_post(client, testfile, mocker)
        assert response.json["errors"] is not None
        assert response.status_code == 200

def test_create_with_incorrect_file_format(client, mocker: MockerFixture):
    with open(INCORRECT_FILE_FORMAT, "rb") as testfile:
        response = do_csm_post(client, testfile, mocker)
        assert response.json["errors"][0]['message'] == "File format not allowed."
        assert response.status_code == 200

def test_vulnerability_XXE_attack():
    '''
    This test is a demonstration on what the resolve_entities parameter in the etree.XMLParser does. 
    By setting it to False it does not resolve entities and helps protect agains XXE attacks. 
    '''
    from lxml import etree

    file = open(DANGEROUS_CAMT_CSM_FILE, "rb")
    data = file.read()
    root = etree.fromstring(data, parser=etree.XMLParser(recover=True, resolve_entities=True))
    ns = root.tag[1 : root.tag.index("}")]
    value = root.xpath("./ns:BkToCstmrStmt/ns:Stmt/ns:Ntry/ns:AddtlNtryInf", namespaces={"ns": ns})

    assert(value[0].text == "11.11.111.111 Naam Adres 7 2960 Dorp")
    assert(value[1].text == "THIS COULD BE YOUR PLAIN TEXT PASSWORD THAT WAS SAVED IN A TXT FILE")
    assert(value[2].text == "THIS COULD BE ANYTHING RANDOM")

    root = etree.fromstring(data, parser=etree.XMLParser(recover=True, resolve_entities=False))
    ns = root.tag[1 : root.tag.index("}")]
    value = root.xpath("./ns:BkToCstmrStmt/ns:Stmt/ns:Ntry/ns:AddtlNtryInf", namespaces={"ns": ns})

    assert(value[0].text == "11.11.111.111 Naam Adres 7 2960 Dorp")
    assert(value[1].text == None)
    assert(value[2].text == None)

def test_create_csm_with_dangerous_camt_file(client, mocker: MockerFixture):
    '''
    The file contains Entities that should not be resolved to protect against XXE attacks. 
    If the Entities are resolved this test will fail.
    '''
    adapter = create_mock_adapter(mocker)

    with open(DANGEROUS_CAMT_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            m.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
            response = do_csm_post(client, testfile, mocker)

            assert(adapter.request_history == [])
            assert(response.json['errors'][0]['message'] == 'Not a valid xml file, or not an xml file at all.')

def create_mock_adapter(mocker: MockerFixture) -> Adapter:
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        if request.path == "/customerstatementmessages/":
            return MockResponse({"data": {"id": 1}}, 201)
        elif request.path == "/banktransactions/":
            return MockResponse({"data": [{"id": 1},{"id": 2}]}, 201)
        elif request.path == "/gebruikersactiviteiten":
            return MockResponse({"data": {"id": 1}}, 201)

    mocker.patch('hhb_backend.processen.automatisch_boeken.automatisch_boeken', return_value=[])
    adapter.add_matcher(test_matcher)
    return adapter


def do_csm_post(client, testfile, mocker):
    mocker.patch('hhb_backend.content_type_validation.ContentTypeValidator.is_valid', return_value=True)
    query = """
        mutation testCSMCreate($file: Upload!) {
            createCustomerStatementMessage(file: $file) {
                ok
            }
        }
    """

    return client.post(
        "/graphql",
        data={
            "operations": json.dumps(
                {
                    "query": query,
                    "variables": {
                        "file": None,
                    },
                }
            ),
            "t_file": testfile,
            "map": json.dumps(
                {
                    "t_file": ["variables.file"],
                }
            ),
        },
    )
