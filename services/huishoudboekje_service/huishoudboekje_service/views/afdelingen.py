""" MethodView for /afdelingen/<afdeling_id>/ path """
from flask import request, abort, make_response
from models.afdeling import Afdeling
from core_service.views.hhb_view import HHBView

class AfdelingView(HHBView):
    """ Methods for /afdelingen/ path """

    hhb_model = Afdeling
    validation_data = {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
            },
            "organisatie_id": {
                "type": "integer",
            }
        },
        "required": []
    }

    def extend_get(self, **kwargs):
        """ Extend the get function """
        self.hhb_query.expose_many_relation("afspraken", "id")
        self.hhb_query.expose_many_relation("rekeningen", "iban")


