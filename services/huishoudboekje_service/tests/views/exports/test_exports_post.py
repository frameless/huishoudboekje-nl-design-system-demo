""" Test POST /export/(<export_id>/) """
import json
from datetime import datetime
from dateutil import tz
import pytest
from models.export import Export


def test_exports_post_new_export(client, session):
    """ Test /export/ path """
    assert session.query(Export).count() == 0
    export_dict = {
        "naam": "Nieuwe export",
        "timestamp": datetime(2020, 10, 1, tzinfo=tz.tzlocal()).isoformat(),
        "start_datum": '2021-01-01',
        "eind_datum": '2021-02-01',
        "xmldata": '''<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<CstmrCdtTrfInitn>
		<GrpHdr>
			<MsgId>20201210125908-81df7a00eb5e</MsgId>
			<CreDtTm>2020-12-10T12:59:08</CreDtTm>
			<NbOfTxs>1</NbOfTxs>
			<CtrlSum>100.00</CtrlSum>
			<InitgPty>
				<Nm>Huishoudboekje Gemeente Sloothuizen</Nm>
			</InitgPty>
		</GrpHdr>
		<PmtInf>
			<PmtInfId>HuishoudboekjeGemeente-f8d22f1b54c3</PmtInfId>
			<PmtMtd>TRF</PmtMtd>
			<BtchBookg>true</BtchBookg>
			<NbOfTxs>1</NbOfTxs>
			<CtrlSum>100.00</CtrlSum>
			<PmtTpInf>
				<SvcLvl>
					<Cd>SEPA</Cd>
				</SvcLvl>
			</PmtTpInf>
			<ReqdExctnDt>2020-12-01</ReqdExctnDt>
			<Dbtr>
				<Nm>Huishoudboekje Gemeente Sloothuizen</Nm>
			</Dbtr>
			<DbtrAcct>
				<Id>
					<IBAN>NL36ABNA5632579034</IBAN>
				</Id>
			</DbtrAcct>
			<DbtrAgt>
				<FinInstnId>
					<BIC>ABNANL2A</BIC>
				</FinInstnId>
			</DbtrAgt>
			<ChrgBr>SLEV</ChrgBr>
			<CdtTrfTxInf>
				<PmtId>
					<EndToEndId>NOTPROVIDED</EndToEndId>
				</PmtId>
				<Amt>
					<InstdAmt Ccy="EUR">100.00</InstdAmt>
				</Amt>
				<CdtrAgt>
					<FinInstnId>
						<BIC>BANKNL2A</BIC>
					</FinInstnId>
				</CdtrAgt>
				<Cdtr>
					<Nm>S. Hulleman</Nm>
				</Cdtr>
				<CdtrAcct>
					<Id>
						<IBAN>GB33BUKB20201555556655</IBAN>
					</Id>
				</CdtrAcct>
				<RmtInf>
					<Ustrd>Leefgeld Hulleman</Ustrd>
				</RmtInf>
			</CdtTrfTxInf>
		</PmtInf>
	</CstmrCdtTrfInitn>
</Document>
''',
    "sha256":"88d84d6df3eba23d5e494e8b84c364d194bd6232ead459a1711124e60d983aba"
    }
    response = client.post('/export/', json=export_dict)
    assert response.status_code == 201

    export_dict["id"] = 1
    assert response.json["data"] == export_dict
    assert session.query(Export).count() == 1


@pytest.mark.parametrize("export, status_code", [
    (dict(naam="export.some", timestamp=None), 409),
    (dict(naam=None, timestamp=datetime.utcnow().isoformat()), 400),
])
def test_exports_post_new_export_missing_data(client, session, export, status_code):
    """ Test /export/ path """
    response = client.post('/export/', json=export)
    assert response.status_code == status_code


def test_exports_post_update_export(client, session, export_factory):
    """ Test /export/<export_id> path """
    export = export_factory.createExport(naam="export")
    update_dict = dict(naam="export.pain")
    response = client.post(f'/export/{export.id}', json=update_dict)
    assert response.status_code == 200
    assert response.json["data"]["naam"] == update_dict["naam"] == export.naam


def test_exports_post_update_export_bad_id(client, session, export_factory):
    export_factory.createExport(naam="export")
    update_dict = dict(naam="export.pain")
    response = client.post(f'/export/1337', json=update_dict)
    assert response.status_code == 404


@pytest.mark.parametrize("key,bad_value", [
    ("timestamp", "Kareltje"),
    ("timestamp", 1234),
])
def test_exports_post_bad_requests(client, key, bad_value):
    """ Test /export/ path bad request """
    bad_data = {key: bad_value}
    response = client.post(
        f'/export/',
        data=json.dumps(bad_data),
        content_type='application/json'
    )
    assert response.status_code == 400
