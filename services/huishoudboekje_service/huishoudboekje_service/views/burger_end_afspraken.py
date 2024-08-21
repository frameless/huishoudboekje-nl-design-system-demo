""" MethodView for /burger/end/afspraken path """

from datetime import datetime
from flask import request ,make_response, abort
from flask.views import MethodView
from core_service.inputs.inputs import Inputs
from core_service.inputs.validators import JsonSchema
from sqlalchemy import text
from core_service.database import db

class InputValidator(Inputs):
    """ JSON validator for creating and editing a object """
    json = [JsonSchema(schema={})]

class BurgerEndAfspraken(MethodView):
    """ Methods for /burger/end/afspraken path """

    validation_data = {
        "burger_id": {
            "type": "number"
        },
        "end_date": {
            "type": ["string"],
            "pattern": "^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$"
        },
        "required": ["burger_id", "end_date"]
    }

    def __init__(self):
        self.validator = InputValidator
        self.validator.json = [JsonSchema(schema=self.validation_data)]
        super().__init__()

    def get(self, **kwargs):
        """ Not allowed """
        return {}, 405
    
    def post(self, **kwargs):
        """ 
            POST /burger/end/afspraken
        """
        self.input_validate()
        burger_id = request.json.get("burger_id")
        end_date = self.string_to_date(request.json.get("end_date"))

        stmt = text("""
            UPDATE afspraken
            SET valid_through = :date
            WHERE burger_id = :id AND valid_through IS NULL
            """)
        
        db.session.execute(stmt, {
            "id": burger_id,
            "date": end_date
        })
        db.session.commit()

        return {}, 200

    def delete(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def put(self, **kwargs):
        """ Not allowed """



    def string_to_date(self, date):
        dateformat = '%Y-%m-%d'
        return datetime.strptime(date, dateformat)
    
    def input_validate(self):
        """ Validate input data """
        inputs = self.validator(request)
        if not inputs.validate():
            abort(make_response({"errors": inputs.errors}, 400))