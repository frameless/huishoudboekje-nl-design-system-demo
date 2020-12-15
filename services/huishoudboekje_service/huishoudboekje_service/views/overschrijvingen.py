""" MethodView for /overschrijvingen/(<overschrijving_id>)/ path """
from flask import request, abort, make_response
from models import Overschrijving
from core_service.views.hhb_view import HHBView

class OverschrijvingView(HHBView):
    """ Methods for /afspraken/ path """

    hhb_model = Overschrijving
    validation_data = {
        "type": "object",
        "properties": {
            "afspraak_id": {
                "type": "integer",
            },
            "export_id": {
                "type": "integer",
            },
            "bank_transaction_id": {
                "type": "integer",
            },
            "bedrag": {
                "type": "integer",
            },
            "datum": {
                "type": "string",
                "pattern": "^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$"
            },
        },
        "required": []
    }

    def extend_get(self, **kwargs):
        self.add_filter_filter_afspraken()

    def add_filter_filter_afspraken(self):
        filter_ids = request.args.get('filter_afspraken')
        if filter_ids:
            ids = []
            for raw_id in filter_ids.split(","):
                try:
                    ids.append(int(raw_id))
                except ValueError:
                    abort(make_response({"errors": [f"Input for filter_afspraken is not correct, '{raw_id}' is not a number."]}, 400))
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.afspraak_id.in_(ids))
