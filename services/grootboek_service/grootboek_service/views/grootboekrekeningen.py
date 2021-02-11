""" MethodView for /grootboeken/ path """
from flask import request, abort, make_response
from models import Grootboekrekening
from core_service.views.hhb_view import HHBView


class GrootboekrekeningenView(HHBView):
    """ Methods for /grootboekrekeningen/(<grootboekrekening_id>) path """
    hhb_model = Grootboekrekening
    validation_data = {
        "type": "object",
        "properties": {
            "id": {
                "type": "string"
            },
            "naam": {
                "type": "string",
            },
            "omschrijving": {
                "type": "string",
            },
            "parent_id": {
                "type": "string",
            }
        },
        "required": ["id"]
    }

    def extend_get(self, **kwargs):
        """ Extend the get function to expose children """
        self.hhb_query.expose_many_relation("children", "id")
