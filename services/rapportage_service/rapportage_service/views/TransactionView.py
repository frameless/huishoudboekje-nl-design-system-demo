from flask import request, abort, make_response
from flask.views import MethodView
from injector import inject
from core_service.inputs.inputs import Inputs
from core_service.inputs.validators import JsonSchema
from rapportage_service.controllers.transactieController import TransactieController


class InputValidator(Inputs):
    """ JSON validator for creating and editing a object """
    json = [JsonSchema(schema={})]


class TransactionView(MethodView):
    _overview_controller: TransactieController

    agreement_ids = "agreement_uuids"

    validation_data = {
        agreement_ids: {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "required": [agreement_ids]
    }

    @inject
    def __init__(self, transaction_controller: TransactieController):
        self._transaction_controller = transaction_controller
        self.validator = InputValidator
        self.validator.json = [JsonSchema(schema=self.validation_data)]
        super().__init__()

    def get(self, **kwargs):
        """ 
            GET /transactions?startDate=<start>&endDate=<end>
        """
        self.input_validate()
        agreement_uuids = request.json.get(self.agreement_ids)

        start = request.args.get('startDate')
        end = request.args.get('endDate')

        return self._transaction_controller.get_transacties_in_range_and_afspraak(agreement_uuids, start, end)

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
