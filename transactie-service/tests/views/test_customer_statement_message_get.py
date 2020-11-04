""" Test GET /customerstatementmessages/(<customerstatementmessage_id>/) """
from models.customer_statement_message import CustomerStatementMessage
from core.utils import row2dict


def test_csm_get_success_all(client, csm_factory):
    """ Test /customerstatementmessages/ path """
    csm1 = csm_factory.create_customer_statement_message()
    csm2 = csm_factory.create_customer_statement_message(opening_balance=8282)
    response = client.get(f'/customerstatementmessages/')
    assert response.status_code == 200
    assert response.json["data"] == [row2dict(csm1), row2dict(csm2)]
