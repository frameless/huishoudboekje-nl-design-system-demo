""" MethodView for /configuratie/<naam>/ path """
from models import Configuratie
from core_service.views.hhb_view import HHBView


class ConfiguratieView(HHBView):
    """ Methods for /configuratie/ path """

    hhb_model = Configuratie
    validation_data = {
        "type": "object",
        "properties": {
            "id": {
                "type": "string",
                "pattern": "^[a-zA-Z0-9_]+$",
            },
            "waarde": {
                "type": "string",
            },
        },
        "required": ["id"]
    }

    def get_object_id_from_kwargs(self, **kwargs):
        if "object_id" in kwargs:
            return kwargs["object_id"]