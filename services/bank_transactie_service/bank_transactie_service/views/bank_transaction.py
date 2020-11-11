""" MethodView for /customerstatementmessages/ path """
from flask import request, abort, make_response
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

    def extend_get(self, **kwargs):
        """ Extend the get function with a filer on kvk nummers """
        self.add_filter_filter_customer_statement_message()

    def add_filter_filter_customer_statement_message(self):
        """ Add filter_gebruiker filter based on the kvk of the organisatie model """
        filter_csms = request.args.get('filter_csms')
        if filter_csms:
            csms = []
            for raw_id in filter_csms.split(","):
                try:
                    csms.append(int(raw_id))
                except ValueError:
                    abort(make_response({"errors": [f"Input for filter_csms is not correct, '{raw_id}' is not a number."]}, 400))
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.customer_statement_message_id.in_(csms))