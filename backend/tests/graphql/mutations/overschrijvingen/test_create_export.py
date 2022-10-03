import requests_mock

from hhb_backend.graphql import settings

def test_create_export_success(client):
    with requests_mock.Mocker() as rm:
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)

        rm1 = rm.get(f"/afspraken/?valid_from=2020-10-10&valid_through=2020-12-31", json={"ok": True, "data": [
            {
                'aantal_betalingen': 12,
                'bedrag': 120000,
                'omschrijving': 'Leefgeld Hulleman',
                'credit': True,
                'valid_through': '2020-12-31',
                'gebruiker_id': 1,
                'id': 1,
                'betaalinstructie': {
                    "end_date": "2020-12-31",
                    "start_date": "2020-01-01",
                    "by_month_day": [1],
                    "except_dates": []
                },
                'journaalposten': [],
                'zoektermen': None,
                'organisatie_id': None,
                'overschrijvingen': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                'rubriek_id': None,
                'valid_from': '2020-01-01',
                'tegen_rekening_id': 14
            }
        ]}, status_code=200)

        rm2 = rm.get(f"/overschrijvingen/?filter_afspraken=1", json={"ok": True, "data": 
            [{
                'afspraak_id': 1,
                'bank_transaction_id': None,
                'bedrag': 10000,
                'datum': f'2020-{str(i).zfill(2)}-01',
                'export_id': None,
                'id': i
            } for i in range(1, 12)]
        }, status_code=200)

        rm3 = rm.post(f"/overschrijvingen/", json={"data": {
            'afspraak_id': 1,
            'bank_transaction_id': None,
            'bedrag': 10000,
            'datum': '2020-12-01',
            'export_id': 1,
            'id': 23
        }}, status_code=201)

        rm4 = rm.post(f"/export/", json={'data': {
            'id': 1,
            'naam': '2020-12-16_13-04-27-SEPA-EXPORT',
            'timestamp': '2020-12-16T13:04:27+01:00',
            'xmldata': '<?xml version="1.0" encoding="UTF-8"?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><CstmrCdtTrfInitn><GrpHdr><MsgId>20210112044131-94064e82eecf</MsgId><CreDtTm>2021-01-12T16:41:31</CreDtTm><NbOfTxs>1</NbOfTxs><CtrlSum>100.00</CtrlSum><InitgPty><Nm>Huishoudboekje Gemeente Sloothuizen</Nm></InitgPty></GrpHdr><PmtInf><PmtInfId>HuishoudboekjeGemeente-c9756fa217ca</PmtInfId><PmtMtd>TRF</PmtMtd><BtchBookg>false</BtchBookg><NbOfTxs>1</NbOfTxs><CtrlSum>100.00</CtrlSum><PmtTpInf><SvcLvl><Cd>SEPA</Cd></SvcLvl></PmtTpInf><ReqdExctnDt>2020-12-01</ReqdExctnDt><Dbtr><Nm>Huishoudboekje Gemeente Sloothuizen</Nm></Dbtr><DbtrAcct><Id><IBAN>NL36ABNA5632579034</IBAN></Id></DbtrAcct><DbtrAgt><FinInstnId><BIC>ABNANL2A</BIC></FinInstnId></DbtrAgt><ChrgBr>SLEV</ChrgBr><CdtTrfTxInf><PmtId><EndToEndId>NOTPROVIDED</EndToEndId></PmtId><Amt><InstdAmt Ccy="EUR">100.00</InstdAmt></Amt><CdtrAgt><FinInstnId /></CdtrAgt><Cdtr><Nm>S. Hulleman</Nm></Cdtr><CdtrAcct><Id><IBAN>GB33BUKB20201555556655</IBAN></Id></CdtrAcct><RmtInf><Ustrd>Leefgeld Hulleman</Ustrd></RmtInf></CdtTrfTxInf></PmtInf></CstmrCdtTrfInitn></Document>'
        }}, status_code=201)

        rm5 = rm.get(f"/rekeningen/?filter_ids=14", json={'data': [{
            'afspraken': [1],
            'gebruikers': [],
            'iban': 'GB33BUKB20201555556655',
            'id': 14,
            'organisaties': [1],
            'rekeninghouder': 'S. Hulleman'
        }]}, status_code=200)

        rm6 = rm.get(f"/configuratie/?filter_ids=derdengeldenrekening_rekeninghouder", json={'data': [{
            'id': 'derdengeldenrekening_rekeninghouder', 'waarde': 'Gemeente Sloothuizen'
        }]}, status_code=200)
        
        rm7 = rm.get(f"/configuratie/?filter_ids=derdengeldenrekening_iban", json={'data': [{
            'id': 'derdengeldenrekening_iban', 'waarde': 'NL36ABNA5632579034'
        }]}, status_code=200)
        
        rm8 = rm.get(f"/configuratie/?filter_ids=derdengeldenrekening_bic", json={'data': [{
            'id': 'derdengeldenrekening_bic', 'waarde': 'ABNANL2A'
        }]}, status_code=200)
            
        rm9 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")

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

        assert fallback.call_count == 0
        assert rm1.call_count == 1
        assert rm2.call_count == 1
        assert rm3.call_count == 2
        assert rm4.call_count == 1
        assert rm5.call_count == 1
        assert rm6.call_count == 1
        assert rm7.call_count == 1
        assert rm8.call_count == 1
        assert rm9.call_count == 1
        assert fallback.call_count == 0
        
        assert response.json["data"]["createExportOverschrijvingen"]["ok"] is True
