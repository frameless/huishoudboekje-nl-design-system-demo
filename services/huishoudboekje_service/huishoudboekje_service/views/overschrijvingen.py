""" MethodView for /overschrijvingen/(<overschijving_id>)/ path """
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
