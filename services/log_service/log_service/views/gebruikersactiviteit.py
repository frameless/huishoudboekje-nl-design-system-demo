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
                "type": "integer",
            },
            "action": {
                "type": "string",
            },
            "entities": {
                "type": "string",
            },
            "snapshot_before": {
                "type": "string",
            },
            "snapshot_after": {
                "type": "string",
            },
            "meta": {
                "type": "string",
            },
        },
        "required": []
    }

    def extend_get(self, **kwargs):
        self.add_filter_filter_gebruiker()

    def add_filter_filter_gebruiker(self):
        filter_ids = request.args.get('filter_gebruikers')
        if filter_ids:
            filters = []
            for raw_id in filter_ids.split(","):
                try:
                    int_id = int(raw_id)
                    filters.append(self.hhb_model.entities.contains(
                        [{"entityId": int_id, "entityType": "burger"}]))
                except ValueError:
                    abort(make_response(
                        {"errors": [f"Input for filter_gebruikers is not correct, '{raw_id}' is not a number."]}, 400))

            if len(filters) > 0:
                self.hhb_query.query = self.hhb_query.query.filter(or_(*filters))
