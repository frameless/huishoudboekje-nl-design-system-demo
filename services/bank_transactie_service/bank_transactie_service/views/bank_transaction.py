""" MethodView for /customerstatementmessages/ path """
from models.bank_transaction import BankTransaction
from core_service.views.hhb_view import HHBView


class BankTransactionView(HHBView):
    """ Methods for /banktransaction/(<banktransaction_id>) path """
    hhb_model = BankTransaction
    validation_data = {
        "type": "object",
        "properties": {
            "customer_statement_message_id": {
                "type": "integer",
            },
            "statement_line": {
                "type": "string",
            },
            "information_to_account_owner": {
                "type": "string",
            }
        },
        "required": ["customer_statement_message_id"]
    }
