""" MethodView for /afdelingen/<afdeling_id>/ path """
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
