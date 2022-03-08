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
            "omschrijving": {
                "type": "string",
            },
            "valid_from": {
                "type": "string",
                "pattern": "^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$",
            },
            "valid_through": {
                "oneOf": [
                    {"type": "null"},
                    {
                        "type": "string",
                        "pattern": "^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$",
                    },
                ],
            },
            "aantal_betalingen": {
                "oneOf": [
                    {"type": "null"},
                    {"type": "integer"},
                ],
            },
            "betaalinstructie": {
                "oneOf": [
                    {"type": "object"},
                    {"type": "null"},
                ]
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
            "afdeling_id": {
                "oneOf": [
                    {"type": "integer"},
                    {"type": "null"},
                ]
            },
            "postadres_id": {
                "oneOf": [
                    {"type": "string"},
                    {"type": "null"},
                ]
            },
            "alarm_id": {
                "oneOf": [
                    {"type": "string"},
                    {"type": "null"},
                ]
            }
        },
        "required": []
    }

    def extend_get(self, **kwargs):
        """ Extend the get function with extra filter """
        self.add_filter_filter_burger()
        self.add_filter_filter_datums()
        self.add_filter_filter_afdelingen()
        self.add_filter_filter_postadressen()
        self.add_filter_filter_alarmen()
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

    @staticmethod
    def filter_in_string_(name, cb):
        filter_string = request.args.get(name)
        if filter_string:
            ids = []
            for raw_id in filter_string.split(","):
                try:
                    ids.append(str(raw_id))
                except ValueError:
                    abort(make_response(
                        {"errors": [f"Input for {name} is not correct, '{raw_id}' is not a string."]},
                        400))
            cb(ids)

    def add_filter_filter_datums(self):
        """ Add filter_datums filter based on the valid_from and valid_through """
        valid_from = get_date_from_request(request, 'valid_from')
        valid_through = get_date_from_request(request, 'valid_through')

        if valid_from or valid_through:
            if not valid_from:
                abort(make_response({"errors": ['valid_from is missing']}, 400))
            if not valid_through:
                abort(make_response({"errors": ['valid_through is missing']}, 400))
            if valid_from > valid_through:
                abort(make_response({"errors": ['valid_through must be after valid_from']}, 400))

            self.hhb_query.query = self.hhb_query.query.filter(
                and_(
                    or_(
                        self.hhb_model.valid_through == None,
                        self.hhb_model.valid_through > valid_from
                    ),
                    self.hhb_model.valid_from <= valid_through
                )
            )

    def add_filter_filter_burger(self):
        """ Add filter_burger filter based on the id of burger """

        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.burger_id.in_(ids))

        AfspraakView.filter_in_string('filter_burgers', add_filter)

    # rubriek

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

    def add_filter_filter_afdelingen(self):
        """ Add filter_afdelingen filter based on the id of the afdeling model """
        def cb(ids): # not mandetory, make optional
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.afdeling_id.in_(ids))

        AfspraakView.filter_in_string('filter_afdelingen', cb)

    def add_filter_filter_postadressen(self):
        """ Add filter_postadressen filter based on the id of the postadres model """
        def cb(ids): # not mandetory, make optional
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.postadres_id.in_(ids))

        AfspraakView.filter_in_string_('filter_postadressen', cb)

    def add_filter_filter_alarmen(self):
        """ Add filter_alarmen filter based on the id of the alarm model """
        def cb(ids): # not mandetory, make optional
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.alarm_id.in_(ids))

        AfspraakView.filter_in_string_('filter_alarmen', cb)