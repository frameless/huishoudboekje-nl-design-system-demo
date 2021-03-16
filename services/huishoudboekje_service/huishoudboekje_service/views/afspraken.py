""" MethodView for /afspraken/(<afspraak_id>)/ path """
from dateutil import parser
from flask import request, abort, make_response
from sqlalchemy import or_, and_
from werkzeug.exceptions import BadRequest

from models.afspraak import Afspraak
from core_service.views.hhb_view import HHBView


def get_date_from_request(request, key):
    value = request.args.get(key)
    if value:
        try:
            return parser.isoparse(value).date()
        except ValueError:
            abort(make_response({'errors': [f'{key} is not a date']}, 400))
    return None


class AfspraakView(HHBView):
    """ Methods for /afspraken/ path """

    hhb_model = Afspraak
    validation_data = {
        "type": "object",
        "properties": {
            "burger_id": {
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
            "zoektermen": {
                "oneOf": [
                    {"type": "null"},
                    {
                        "type": "array",
                        "uniqueItems": True,
                        "items": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "\\w",
                        },
                    },
                ]
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
        """ Extend the get function with extra filter """
        self.add_filter_filter_burger()
        self.add_filter_filter_organisaties()
        self.add_filter_filter_datums()
        self.add_filter_filter_rekening()
        self.add_filter_filter_zoektermen()
        self.hhb_query.expose_many_relation("journaalposten", "id")
        self.hhb_query.expose_many_relation("overschrijvingen", "id")

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
                        {"errors": [f"Input for {name} is not correct, '{raw_id}' is not a number."]},
                        400))
            cb(ids)

    def add_filter_filter_burger(self):
        """ Add filter_burger filter based on the kvk of the organisatie model """
        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.burger_id.in_(ids))

        AfspraakView.filter_in_string('filter_burgers', add_filter)

    def add_filter_filter_organisaties(self):
        """ Add filter_organisaties filter based on the id of the organisatie model """
        def cb(ids):
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.organisatie_id.in_(ids))

        AfspraakView.filter_in_string('filter_organisaties', cb)

    def add_filter_filter_datums(self):
        """ Add filter_datums filter based on the start_datum and eind_datum """
        begin_datum = get_date_from_request(request, 'begin_datum')
        eind_datum = get_date_from_request(request, 'eind_datum')

        if begin_datum or eind_datum:
            if not begin_datum:
                abort(make_response({"errors": ['begin_datum is missing']}, 400))
            if not eind_datum:
                abort(make_response({"errors": ['eind_datum is missing']}, 400))
            if begin_datum > eind_datum:
                abort(make_response({"errors": ['eind_datum must be after begin_datum']}, 400))

            self.hhb_query.query = self.hhb_query.query.filter(
                and_(
                    or_(
                        self.hhb_model.eind_datum == None,
                        self.hhb_model.eind_datum > begin_datum
                    ),
                    self.hhb_model.start_datum <= eind_datum
                )
            )

    def add_filter_filter_rekening(self):
        """ Add filter_rekening filter"""
        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.tegen_rekening_id.in_(ids))

        AfspraakView.filter_in_string('filter_rekening', add_filter)

    def add_filter_filter_zoektermen(self):
        """ Add filter_zoektermen filter"""
        zoektermenen = request.args.get('filter_zoektermen')
        if zoektermenen:
            for zoektermen in zoektermenen.split(","):
                self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.zoektermen.contains(zoektermen))
