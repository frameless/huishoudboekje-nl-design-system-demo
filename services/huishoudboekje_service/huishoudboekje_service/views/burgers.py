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
                "type": ["string", "null"],
            },
            "email": {
                "type": ["string", "null"],
            },
            "geboortedatum": {
                "type": ["string", "null"],
                "pattern": "^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$"
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
            },
            "bsn": {
                "type": "integer",
            }
        },
        "required": []
    }

    def extend_post_with_extra_check(self, **kwargs):
        """ Extend the post function with extra check and return a list of errors"""
        errors = []
        errors = self.check_if_bsn_already_exists(errors)
        return errors

    def check_if_bsn_already_exists(self, errors):
        bsn = request.json.get("bsn", None)
        if bsn:
            result = Burger.query.filter(Burger.bsn == bsn).all()
        if len(result) > 0:
            errors.append("bsn already exists")
        return errors

    def extend_get(self, **kwargs):
        """ Extend the get function with extra filter """
        self.add_filter_filter_huishouden()
        self.add_filter_filter_bsn()


    def add_filter_filter_huishouden(self):
        """ Add filter_huishouden filter based on the id of huishouden """

        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(
                self.hhb_model.huishouden_id.in_(ids))

        BurgerView.filter_in_string('filter_huishoudens', add_filter)


    def add_filter_filter_bsn(self):
        """ Add filter_bsn filter based on the bsn of a burger """

        def add_filter(bsn):
            self.hhb_query.query = self.hhb_query.query.filter(
                self.hhb_model.bsn.in_(bsn))

        BurgerView.filter_in_string('filter_bsn', add_filter)
