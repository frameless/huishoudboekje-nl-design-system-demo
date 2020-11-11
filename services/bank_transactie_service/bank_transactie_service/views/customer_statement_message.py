""" MethodView for /customerstatementmessages/ path """
from models.customer_statement_message import CustomerStatementMessage
from core_service.views.hhb_view import HHBView


class CustomerStatementMessageView(HHBView):
    """ Methods for /customerstatementmessages/(<customerstatementmessage_id>) path """
    hhb_model = CustomerStatementMessage
    validation_data = {
        "type": "object",
        "properties": {
            "upload_date": {
                "type": "string",
                "pattern": "(\\d{4})-(\\d{2})-(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2})"
            },
            "raw_data": {
                "type": "string",
            },
            "transaction_reference_number": {
                "type": "string",
            },
            "related_reference": {
                "type": "string",
            },
            "account_identification": {
                "type": "string",
            },
            "sequence_number": {
                "type": "string",
            },
            "opening_balance": {
                "type": "integer",
            },
            "closing_balance": {
                "type": "integer",
            },
            "closing_available_funds": {
                "type": "integer",
            },
            "forward_available_balance": {
                "type": "integer",
            }
        },
        "required": []
    }

    def extend_get(self, **kwargs):
        self.hhb_query.expose_many_relation("bank_transactions", "id")