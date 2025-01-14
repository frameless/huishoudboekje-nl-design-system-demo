""" MethodView for /organisaties/<organisatie_id>/ path """
from flask import request
from models import Rubriek
from core_service.views.hhb_view import HHBView

class RubriekView(HHBView):
    """ Methods for /organisaties/ path """

    hhb_model = Rubriek
    validation_data = {
        "type": "object",
        "properties": {
            "naam": {
                "type": "string",
            },
            "grootboek_id": {
                "type": "string",
            },
        },
        "required": []
    }

    def extend_get(self, **kwargs):
        self.add_filter_grootboekrekening()
        self.hhb_query.expose_many_relation("afspraken", "id")

    def add_filter_grootboekrekening(self):
        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(
                Rubriek.grootboekrekening_id.in_(ids)
            )
        
        RubriekView.filter_in_string('filter_grootboekrekeningen', add_filter)            
