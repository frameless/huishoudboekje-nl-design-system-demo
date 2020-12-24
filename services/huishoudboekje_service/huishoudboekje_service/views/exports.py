""" MethodView for /exports/(<export_id>)/ path """
from datetime import datetime

from flask import request, abort, make_response

from models.export import Export
from core_service.views.hhb_view import HHBView


def get_datetime_from_request(request, key):
    value = request.args.get(key)
    if value:
        try:
            return datetime.fromisoformat(value)
        except ValueError as err:
            abort(make_response({'errors': [f'{key} is not a timestamp: {repr(err)}']}, 400))
    return None


class ExportView(HHBView):
    """ Methods for /exports/ path """

    hhb_model = Export
    validation_data = {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
            },
            "naam": {
                "type": "string",
            },
            "timestamp": {
                "oneOf": [
                    {"type": "null"},
                    {"type": "string", "pattern": "^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\+\d{2}:\d{2}|Z)?$"}
                ]
            },
        },
        "required": []
    }

    def extend_get(self, **kwargs):
        """ Extend the get function with filters and relationships """
        self.add_filter_filter_naam()
        self.add_filter_filter_timestamp()
        self.hhb_query.expose_many_relation("overschrijvingen", "id")

    def add_filter_filter_naam(self):
        naam = request.args.get('filter_naam')
        if naam:
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.naam.ilike(f'%{naam}%'))

    def add_filter_filter_timestamp(self):
        """ Add filter_timestamp filter based on the timestamp """
        start_datum = get_datetime_from_request(request, 'start_datum')
        eind_datum = get_datetime_from_request(request, 'eind_datum')

        if start_datum or eind_datum:
            if not start_datum:
                abort(make_response({"errors": ['start_datum is missing']}, 400))
            if not eind_datum:
                abort(make_response({"errors": ['eind_datum is missing']}, 400))
            try:
                if start_datum > eind_datum:
                    abort(make_response({"errors": ['eind_datum must be after start_datum']}, 400))
            except TypeError as err:
                abort(make_response({"errors": [f'failed to compare start_datum to eind_datum: {repr(err)}']}, 400))

            self.hhb_query.query = self.hhb_query.query.filter(
                self.hhb_model.timestamp.between(start_datum, eind_datum))
