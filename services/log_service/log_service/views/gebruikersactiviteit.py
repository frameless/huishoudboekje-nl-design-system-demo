""" MethodView for /gebruikersactiviteiten/ path """

from core_service.views.hhb_view import HHBView
from flask import request, abort, make_response
from sqlalchemy import or_

from models.gebruikersactiviteit import GebruikersActiviteit


class GebruikersActiviteitView(HHBView):
    """ Methods for /gebruikersactiviteiten/(<gebruikersactiviteit_id>) path """
    hhb_model = GebruikersActiviteit
    validation_data = {
        "type": "object",
        "properties": {
            "timestamp": {
                "type": "string", "pattern": "^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\+\d{2}:\d{2}|Z)?$"
            },
            "gebruiker_id": {
                "oneOf": [
                    {"type": "string"},
                    {"type": "null"},
                ]
            },
            "action": {
                "type": "string",
            },
            "entities": {
                "type": "array",
            },
            "snapshot_before": {
                "oneOf": [
                    {"type": "object"},
                    {"type": "null"},
                ]
            },
            "snapshot_after": {
                "oneOf": [
                    {"type": "object"},
                    {"type": "null"},
                ]
            },
            "meta": {
                "type": "object",
            },
        },
        "required": []
    }

    def extend_get(self, **kwargs):
        self.add_filter_filter_burger()
        self.add_filter_filter_afspraken()

    def add_filter_filter_burger(self):
        filter_ids = request.args.get('filter_burgers')
        if filter_ids:
            filters = []
            for raw_id in filter_ids.split(","):
                try:
                    int_id = int(raw_id)
                    filters.append(self.hhb_model.entities.contains(
                        [{"entityId": int_id, "entityType": "burger"}]))
                except ValueError:
                    abort(make_response(
                        {"errors": [f"Input for filter_burgers is not correct, '{raw_id}' is not a number."]}, 400))

            if len(filters) > 0:
                self.hhb_query.query = self.hhb_query.query.filter(or_(*filters))

    def add_filter_filter_afspraken(self):
        filter_ids = request.args.get('filter_afspraken')
        if filter_ids:
            filters = []
            for raw_id in filter_ids.split(","):
                try:
                    int_id = int(raw_id)
                    filters.append(self.hhb_model.entities.contains(
                        [{"entityId": int_id, "entityType": "afspraak"}]))
                except ValueError:
                    abort(make_response(
                        {"errors": [f"Input for filter_afspraken is not correct, '{raw_id}' is not a number."]}, 400))

            if len(filters) > 0:
                self.hhb_query.query = self.hhb_query.query.filter(or_(*filters))
