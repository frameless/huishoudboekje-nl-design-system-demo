""" MethodView for /afspraken/(<afspraak_id>)/ path """
from flask import request, abort, make_response
from models.afspraak import Afspraak
from core.views.hhb_view import HHBView

class AfspraakView(HHBView):
    """ Methods for /afspraken/ path """

    hhb_model = Afspraak
    validation_data = {
        "type": "object",
        "properties": {
            "gebruiker_id": {
                "type": "integer",
            },
            "beschrijving": {
                "type": "string",
            },
            "start_datum": {
                "type": "string",
                "pattern": "^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$"
            },
            "eind_datum": {
                "type": "string",
                "pattern": "^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$"
            },
            "aantal_betalingen": {
                "type": "integer",
            },
            "interval": {
                "type": "string",
            },
            "bedrag": {
                "type": "number",
            },
            "credit": {
                "type": "boolean",
            },
            "kenmerk": {
                "type": "string",
            },
            "actief": {
                "type": "boolean",
            },
        },
        "required": []
    }

    def extend_get(self, **kwargs):
        """ Extend the get function with a filer on kvk nummers """
        self.add_filter_filter_gebruiker()

    def add_filter_filter_gebruiker(self):
        """ Add filter_gebruiker filter based on the kvk of the organisatie model """
        filter_ids = request.args.get('filter_gebruikers')
        if filter_ids:
            ids = []
            for raw_id in filter_ids.split(","):
                try:
                    ids.append(int(raw_id))
                except ValueError:
                    abort(make_response({"errors": [f"Input for filter_gebruikers is not correct, '{raw_id}' is not a number."]}, 400))
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.gebruiker_id.in_(ids))