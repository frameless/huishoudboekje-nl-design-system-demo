from flask import request, abort, make_response
from flask.views import MethodView
from injector import inject
from rapportage_service.controllers.rapportageController import RapportageController
from core_service.inputs.inputs import Inputs
from core_service.inputs.validators import JsonSchema

class InputValidator(Inputs):
    """ JSON validator for creating and editing a object """
    json = [JsonSchema(schema={})]

class BurgerRapportageView(MethodView):
    _rapportage_controller: RapportageController

    BURGER_IDS_LIST_NAME = "burger_ids"
    RUBRIEKEN_FILTER_LIST_NAME = "filter_rubrieken"
    
    validation_data = {
        BURGER_IDS_LIST_NAME:{
            "type": "array",
            "items": {
                "type": "number"
            }
        },
        RUBRIEKEN_FILTER_LIST_NAME:{
            "type": "array",
            "items": {
                "type": "number"
            }
        },
        "required": [BURGER_IDS_LIST_NAME]
      }

    @inject
    def __init__(self, rapportage_controller: RapportageController):
        self._rapportage_controller = rapportage_controller
        self.validator = InputValidator
        self.validator.json = [JsonSchema(schema=self.validation_data)]
        super().__init__()

    
    def get(self, **kwargs):
        """ 
            GET rapportage?startDate=<start>&endDate=<end>
        """
        self.input_validate()
        burger_ids = request.json.get(self.BURGER_IDS_LIST_NAME)
        filter_rubrieken = request.json.get(self.RUBRIEKEN_FILTER_LIST_NAME)

        start = request.args.get('startDate')
        end = request.args.get('endDate')

        return self._rapportage_controller.get_rapportage(burger_ids,filter_rubrieken,start,end)

    def post(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def delete(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def put(self, **kwargs):
        """ Not allowed """
        return {}, 405
    
    #Copy from HHBView bc it is to generic, needs to be refactored, dont appove if this comment is stil here
    def input_validate(self):
        """ Validate input data """
        inputs = self.validator(request)
        if not inputs.validate():
            abort(make_response({"errors": inputs.errors}, 400))
