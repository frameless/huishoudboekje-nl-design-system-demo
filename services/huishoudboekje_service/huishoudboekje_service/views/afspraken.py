""" MethodView for /afspraken/(<afspraak_id>)/ path """
from flask import request, abort, make_response
from models.afspraak import Afspraak
from core_service.views.hhb_view import HHBView

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
            "organisatie_id": {
                "oneOf": [
                    {"type": "null"},
                    {"type": "integer"},
                ]
            },
        },
        "required": []
    }

    def extend_get(self, **kwargs):
        """ Extend the get function with a filer on kvk nummers """
        self.add_filter_filter_gebruiker()
        self.add_filter_filter_organisaties()
        self.hhb_query.expose_many_relation("journaalposten", "id")
        self.hhb_query.expose_many_relation("overschrijvingen", "id")

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

    def add_filter_filter_organisaties(self):
        """ Add filter_organisaties filter based on the id of the organisatie model """
        filter_organisaties = request.args.get('filter_organisaties')
        if filter_organisaties:
            ids = []
            for raw_id in filter_organisaties.split(","):
                try:
                    ids.append(int(raw_id))
                except ValueError:
                    abort(make_response({"errors": [f"Input for filter_organisaties is not correct, '{raw_id}' is not a number."]}, 400))
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.organisatie_id.in_(ids))
