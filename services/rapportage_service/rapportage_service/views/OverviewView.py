from flask import request, abort, make_response
from flask.views import MethodView
from injector import inject
from core_service.inputs.inputs import Inputs
from core_service.inputs.validators import JsonSchema
from rapportage_service.controllers.overviewController import OverviewController


class InputValidator(Inputs):
    """ JSON validator for creating and editing a object """
    json = [JsonSchema(schema={})]


class OverviewView(MethodView):
    _overview_controller: OverviewController

    BURGER_IDS_LIST_NAME = "burger_ids"

    validation_data = {
        BURGER_IDS_LIST_NAME: {
            "type": "array",
            "items": {
                "type": "number"
            }
        },
        "required": [BURGER_IDS_LIST_NAME]
    }

    @inject
    def __init__(self, overview_controller: OverviewController):
        self._overview_controller = overview_controller
        self.validator = InputValidator
        self.validator.json = [JsonSchema(schema=self.validation_data)]
        super().__init__()

    def get(self, **kwargs):
        """ 
            GET /overzicht?startDate=<start>&endDate=<end>
        """
        self.input_validate()
        burger_ids = request.json.get(self.BURGER_IDS_LIST_NAME)

        start = request.args.get('startDate')
        end = request.args.get('endDate')

        return self._overview_controller.get_overview(burger_ids, start, end)

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
