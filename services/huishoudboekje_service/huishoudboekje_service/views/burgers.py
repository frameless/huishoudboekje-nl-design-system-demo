""" MethodView for /burgers/ path """
from models.burger import Burger
from core_service.views.hhb_view import HHBView
from flask import request, abort, make_response

class BurgerView(HHBView):
    """ Methods for /burgers/(<burger_id>) path """
    hhb_model = Burger
    validation_data = {
        "type": "object",
        "properties": {
            "telefoonnummer": {
                "type": "string",
            },
            "email": {
                "type": "string",
            },
            "geboortedatum": {
                "type": "string",
                "pattern": "^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$"
            },
            "iban": {
                "type": "string",
            },
            "voornamen": {
                "type": "string",
            },
            "voorletters": {
                "type": "string",
            },
            "achternaam": {
                "type": "string",
            },
            "straatnaam": {
                "type": "string",
            },
            "huisnummer": {
                "type": "string",
            },
            "postcode": {
                "type": "string",
            },
            "plaatsnaam": {
                "type": "string",
            },
            "huishouden_id": {
                "type": "integer",
            }
        },
        "required": []
    }

    def extend_get(self, **kwargs):
        """ Extend the get function with extra filter """
        self.add_filter_filter_huishouden()

    @staticmethod
    def filter_in_string(name, cb):
        filter_string = request.args.get(name)
        if filter_string:
            ids = []
            for raw_id in filter_string.split(","):
                try:
                    ids.append(int(raw_id))
                except ValueError:
                    abort(make_response(
                        {"errors": [
                            f"Input for {name} is not correct, '{raw_id}' is not a number."]},
                        400))
            cb(ids)

    def add_filter_filter_huishouden(self):
        """ Add filter_huishouden filter based on the id of huishouden """

        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(
                self.hhb_model.huishouden_id.in_(ids))

        BurgerView.filter_in_string('filter_huishoudens', add_filter)
