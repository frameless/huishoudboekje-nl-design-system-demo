""" MethodView for /afspraken/<afspraak_id>/ path """
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
from models.afspraak import Afspraak
from core.views.hhb_view import HHBView

class InputValidator(Inputs):
    """ JSON validator for creating and editing a Afspraak """
    json = [JsonSchema(schema={
        "type": "object",
        "properties": {
            "gebruiker_id": {
                "type": "integer",
            },
            "beschijving": {
                "type": "string",
            },
            "start_datum": {
                "type": "string",
                "pattern": "^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$"
            },
            "eind_datum": {
                "type": "string",
                "pattern": "^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$"
            },
            "aantal_betalingen": {
                "type": "integer",
            },
            "interval": {
                "type": "string",
            },
            "bedrag": {
                "type": "number",
            },
            "credit": {
                "type": "boolean",
            },
            "kenmerk": {
                "type": "string",
            },
            "actief": {
                "type": "boolean",
            },
        },
        "required": []
    })]

class AfspraakView(HHBView):
    """ Methods for /afspraken/ path """

    hhb_model = Afspraak

    def get(self, afspraak_id=None):
        """ GET /afspraken/(<int:afspraak_id>?(columns=..,..,..)&(filter_ids=..,..,..))
        
        optional path parameter afspraak_id
        optional url parameters:
            columns: comma seperated list of columns to retrieve
            filter_ids: comma seperated list of afspraak ids

        returns
            200 {"data": <afspraak_json>}
            200 {"data": [<afspraak_json>, <afspraak_json>, <afspraak_json>]}
            404 {"errors": ["Afspraak not found."]}
            400 {"errors": ["Input for filter_ids is not correct, '...' is not a number."]}
            400 {"errors": ["Input for columns is not correct, '...' is not a column."]}
        """
        self.hhb_query.add_filter_columns()
        self.hhb_query.add_filter_ids()
        if afspraak_id:
            return self.hhb_query.get_result_single(afspraak_id)
        return self.hhb_query.get_result_multiple()

    def post(self, afspraak_id=None):
        """ POST /afspraken/(<int:afspraak_id>)
        
        optional path parameter: afspraak_id
        data: JSON object containing afspraak data

        returns
            200 {"data": <afspraak_json>}
            400 {"errors": [<input data error message>]}
            404 {"errors": ["Afspraak not found."]}
            409 {"errors": [<database integrity error>]}
        """
        self.input_validate(InputValidator)
        response_code = self.hhb_object.get_or_create(afspraak_id)
        self.hhb_object.update_using_request_data()
        self.hhb_object.commit_changes()
        return {"data": self.hhb_object.json}, response_code

    def delete(self, afspraak_id=None):
        """ POST /afspraken/<int:afspraak_id>
        
        required path parameter: afspraak_id

        returns
            202 {}
            405 {"errors": ["Method not allowed"]}
            404 {"errors": ["Afspraak not found."]}
        """
        if not afspraak_id:
            return {"errors": ["Method not allowed"]}, 405
        self.hhb_object.get_or_404(afspraak_id)
        self.hhb_object.delete()
        self.hhb_object.commit_changes()
        return {}, 202


