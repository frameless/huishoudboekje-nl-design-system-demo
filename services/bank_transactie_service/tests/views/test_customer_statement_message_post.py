""" Test POST /customerstatementmessages/(<customerstatementmessage_id>/) """
import json
from models.customer_statement_message import CustomerStatementMessage


def test_csm_post_new_csm(client, dbsession):
    """ Test /customerstatementmessages/ path """
    assert dbsession.query(CustomerStatementMessage).count() == 0
    csm_dict = {
        "upload_date": "2020-01-01 14:14:14",
        "raw_data": "TESTDATA",
        "filename": "ING.txt"
    }
    response = client.post(
        '/customerstatementmessages/',
        data=json.dumps(csm_dict),
        content_type='application/json'
    )
    assert response.status_code == 201
    csm_dict["id"] = 1
    assert response.json["data"]["raw_data"] == csm_dict["raw_data"]
    assert response.json["data"]["upload_date"] == "2020-01-01T14:14:14"
    assert dbsession.query(CustomerStatementMessage).count() == 1
