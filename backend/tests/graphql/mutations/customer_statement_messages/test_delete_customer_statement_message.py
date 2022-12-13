import requests_mock

from hhb_backend.graphql import settings


def test_delete_csm(client):
    with requests_mock.Mocker() as rm:
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)

        log_post = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
        get_csm = rm.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/customerstatementmessages/?filter_ids=2",
            json={"data": [{'account_identification': 'NL69INGB0123456789EUR', 'bank_transactions': [11, 12],
                            'closing_available_funds': 56435, 'closing_balance': 56435, 'filename': None,
                            'forward_available_balance': 56435, 'id': 2, 'opening_balance': 66223,
                            'raw_data': '{1:F01INGBNL2ABXXX0000000000}\r\n{2:I940INGBNL2AXXXN}\r\n{4:\r\n:20:P140220000000001\r\n:25:NL69INGB0123456789EUR\r\n:28C:00000\r\n:60F:C140219EUR662,23\r\n:61:1402200220C1,56NTRFEREF//00000000001005/TRCD/00100/\r\n:86:/EREF/EV12341REP1231456T1234//CNTP/NL32INGB0000012345/INGBNL2A/ING BANK NV INZAKE WEB///REMI/USTD//EV10001REP1000000T1000/\r\n:61:1402200220D1,57NTRFPREF//00000000001006/TRCD/00200/\r\n:86:/PREF/M000000003333333//REMI/USTD//TOTAAL 1 VZ/\r\n:61:1402200220C1,57NRTIEREF//00000000001007/TRCD/00190/\r\n:86:/RTRN/MS03//EREF/20120123456789//CNTP/NL32INGB0000012345/INGBNL2A/J.Janssen///REMI/USTD//Factuurnr 123456 Klantnr 00123/\r\n:61:1402200220D1,14NDDTEREF//00000000001009/TRCD/01016/\r\n:86:/EREF/EV123REP123412T1234//MARF/MND\xadEV01//CSID/NL32ZZZ999999991234//CNTP/NL32INGB0000012345/INGBNL2A/ING Bank N.V. inzake WeB///REMI/USTD//EV123REP123412T1234/\r\n:61:1402200220C1,45NDDTPREF//00000000001008/TRCD/01000/\r\n:86:/PREF/M000000001111111//CSID/NL32ZZZ999999991234//REMI/USTD//TOTAAL       1 POSTEN/\r\n:61:1402200220D12,75NRTIEREF//00000000001010/TRCD/01315/\r\n:86:/RTRN/MS03//EREF/20120501P0123478//MARF/MND\xad120123//CSID/NL32ZZZ999999991234//CNTP/NL32INGB0000012345/INGBNL2A/J.Janssen///REMI/USTD//CONTRIBUTIE FEB 2014/\r\n:61:1402200220C32,00NTRF9001123412341234//00000000001011/TRCD/00108/\r\n:86:/EREF/15814016000676480//CNTP/NL32INGB0000012345/INGBNL2A/J.Janssen///REMI/STRD/CUR/9001123412341234/\r\n:61:1402200220D119,00NTRF1070123412341234//00000000001012/TRCD/00108/\r\n:86:/EREF/15614016000384600//CNTP/NL32INGB0000012345/INGBNL2A/INGBANK NV///REMI/STRD/CUR/1070123412341234/\r\n:62F:C140220EUR564,35\r\n:64:C140220EUR564,35\r\n:65:C140221EUR564,35\r\n:65:C140224EUR564,35\r\n:86:/SUM/4/4/134,46/36,58/\r\n\xad}',
                            'related_reference': None, 'sequence_number': None,
                            'transaction_reference_number': 'P140220000000001', 'upload_date': '2020-11-10T16:28:18'}]},
            status_code=200,
        )
        get_journaalpost = rm.get(
            f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_transactions=11,12",
            json={"data": [{"id": 1, "transaction_id": 11, "afspraak_id": None}]},
            status_code=200,
        )
        delete_journaalpost = rm.delete(
            f"{settings.HHB_SERVICES_URL}/journaalposten/1", status_code=200
        )
        delete_transactie1 = rm.delete(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/11", status_code=200
        )
        delete_transactie2 = rm.delete(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/12", status_code=200
        )
        delete_csm = rm.delete(
            f"{settings.TRANSACTIE_SERVICES_URL}/customerstatementmessages/2", status_code=200
        )
        get_banktransacties = rm.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/", status_code=200, json={
                "data": [
                    {"id": 11},
                    {"id": 12}
                ]
            }
        )

        response = client.post(
            "/graphql",
            json={
                "query": """
                    mutation test($id: Int!) {
                      deleteCustomerStatementMessage(id: $id) {
                        ok
                      }
                    }
                    """,
                "variables": {"id": 2},
            },
            content_type="application/json",
        )

        assert fallback.call_count == 0
        assert get_banktransacties.call_count == 1
        assert log_post.call_count == 1
        assert get_csm.call_count == 1
        assert get_journaalpost.call_count == 1
        assert delete_journaalpost.call_count == 1
        assert delete_transactie1.call_count == 1
        assert delete_transactie2.call_count == 1
        assert delete_csm.call_count == 1


def test_delete_csm_error(client):
    with requests_mock.Mocker() as mock:
        get_journaalpost = mock.get(
            f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids=1",
            json={"data": []},
            status_code=200,
        )
        adapter = mock.delete(
            f"{settings.HHB_SERVICES_URL}/journaalposten/1",
            status_code=404,
            text="Not found",
        )

        response = client.post(
            "/graphql",
            json={
                "query": """
mutation test($id: Int!) {
  deleteJournaalpost(id: $id) {
    ok
  }
}
""",
                "variables": {"id": 1},
            },
            content_type="application/json",
        )
        assert response.json == {
            "data": {"deleteJournaalpost": None},
            "errors": [
                {
                    "locations": [{"column": 3, "line": 3}],
                    "message": "Upstream API responded: Not found",
                    "path": ["deleteJournaalpost"],
                }
            ],
        }
        assert adapter.call_count == 1
