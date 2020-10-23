""" MethodView for /gebruikers/<gebruiker_id>/rekeningen path """
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema

from core.views.hhb_view import HHBView
from models import RekeningGebruiker


class InputValidator(Inputs):
    """ JSON validator for creating and editing a Rekening-Gebruiker """
    json = [JsonSchema(schema={
        "type": "object",
        "properties": {
            "gebruiker_id": {
                "type": "integer",
            },
            "rekening_id": {
                "type": "integer",
            },
        },
        "required": []
    })]


class RekeningGebruiker(HHBView):
    """ Methods for /gebruikers/<gebruiker_id>/rekeningen path """

    hhb_model = RekeningGebruiker

    def get(self, gebruiker_id=None):
        """ GET /gebruikers/<gebruiker_id>/rekeningen

        returns
            200 {"data": <afspraak_json>}
            200 {"data": [<afspraak_json>, <afspraak_json>, <afspraak_json>]}
            404 {"errors": ["Afspraak not found."]}
            400 {"errors": ["Input for filter_ids is not correct, '...' is not a number."]}
            400 {"errors": ["Input for columns is not correct, '...' is not a column."]}
        """
        self.initialize_query()
        self.add_filter_columns()
        if gebruiker_id:
            return self.get_result_single(gebruiker_id)


