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

    def get_object_id_from_kwargs(self, **kwargs):
        if "object_id" in kwargs:
            try:
                int(kwargs["object_id"])
            except ValueError:
                abort(make_response({"errors": [f"Supplied id '{kwargs[list(kwargs.keys())[0]]}' is not an number."]}, 400))
            return kwargs["object_id"]