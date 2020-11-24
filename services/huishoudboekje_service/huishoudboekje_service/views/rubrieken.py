""" MethodView for /organisaties/<organisatie_id>/ path """
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
        """ Expose the relationship """
        self.hhb_query.expose_many_relation("afspraken", "id")