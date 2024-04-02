from core_service.utils import valid_date
from flask import request, abort, make_response
from flask.views import MethodView
from injector import inject
from core_service.inputs.inputs import Inputs
from core_service.inputs.validators import JsonSchema
from rapportage_service.controllers.saldoController import SaldoController

class InputValidator(Inputs):
    """ JSON validator for creating and editing a object """
    json = [JsonSchema(schema={})]

class SaldoView(MethodView):
    _saldo_controller: SaldoController

    BURGER_IDS_LIST_NAME = "burger_ids"
    CITIZEN_UUIDS_LIST_NAME = "citizen_uuids"
    
    validation_data = {
        "oneOf": [{
            BURGER_IDS_LIST_NAME: {
                "type": "array",
                "items": {
                    "type": "number"
                }
            },
            "required": [BURGER_IDS_LIST_NAME]
        },
            {
            CITIZEN_UUIDS_LIST_NAME: {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "required": [CITIZEN_UUIDS_LIST_NAME]
        }]
    }

    @inject
    def __init__(self, saldo_controller: SaldoController):
        self._saldo_controller = saldo_controller
        self.validator = InputValidator
        self.validator.json = [JsonSchema(schema=self.validation_data)]
        super().__init__()

    
    def get(self, **kwargs):
        """ 
            GET saldo?date=<date>
        """
        self.input_validate()
        burger_ids = request.json.get(self.BURGER_IDS_LIST_NAME, None)
        citizen_uuids = request.json.get(self.CITIZEN_UUIDS_LIST_NAME, None)
        date = request.args.get('date')
        if not valid_date(date):
            abort(make_response({"errors": "invalid date"}, 400))
        if citizen_uuids != None:
            return {"data": self._saldo_controller.get_saldos_per_citizen(citizen_uuids, date)}, 200

        return {"data": self._saldo_controller.get_saldos(burger_ids, date)}, 200

    def post(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def delete(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def put(self, **kwargs):
        """ Not allowed """
        return {}, 405
    
    def input_validate(self):
        """ Validate input data """
        inputs = self.validator(request)
        if not inputs.validate():
            abort(make_response({"errors": inputs.errors}, 400))

