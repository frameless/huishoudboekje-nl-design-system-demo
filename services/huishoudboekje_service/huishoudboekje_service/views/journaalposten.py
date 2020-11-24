""" MethodView for /organisaties/<organisatie_id>/ path """
from flask import request, abort, make_response
from models import Journaalpost
from core_service.views.hhb_view import HHBView

class JournaalpostView(HHBView):
    """ Methods for /organisaties/ path """

    hhb_model = Journaalpost
    validation_data = {
        "type": "object",
        "properties": {
            "afspraak_id": {
                "type": "integer",
            },
            "transaction_id": {
                "type": "integer",
            },
            "grootboekrekening_id": {
                "type": "string",
            },
        },
        "required": []
    }

    def add_filter_transactions(self):
        # TODO check if this needs an index
        filter_transactions = request.args.get('filter_transactions')
        if filter_transactions:
            self.hhb_query.query = self.hhb_query.query.filter(
                Journaalpost.transaction_id.in_(filter_transactions.split(","))
            )
