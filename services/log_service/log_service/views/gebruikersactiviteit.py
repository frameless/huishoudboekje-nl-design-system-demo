""" MethodView for /gebruikersactiviteiten/ path """

from core_service.views.hhb_view import HHBView

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
