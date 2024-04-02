from flask import request, abort, make_response
from flask.views import MethodView
from injector import inject
from core_service.inputs.inputs import Inputs
from core_service.inputs.validators import JsonSchema
from rapportage_service.controllers.citizenController import CitizenController


class InputValidator(Inputs):
    """ JSON validator for creating and editing a object """
    json = [JsonSchema(schema={})]


class CitizenView(MethodView):
    _citizen_controller: CitizenController

    alarm_ids = "alarm_ids"

    validation_data = {
        alarm_ids: {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "required": [alarm_ids]
    }

    @inject
    def __init__(self, citizen_controller: CitizenController):
        self._citizen_controller = citizen_controller
        self.validator = InputValidator
        self.validator.json = [JsonSchema(schema=self.validation_data)]
        super().__init__()

    def get(self, **kwargs):
        """ 
            GET /transactions?startDate=<start>&endDate=<end>
        """
        self.input_validate()
        alarm_ids = request.json.get(self.alarm_ids)

        return self._citizen_controller.get_citizens_for_alarms(alarm_ids)

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
