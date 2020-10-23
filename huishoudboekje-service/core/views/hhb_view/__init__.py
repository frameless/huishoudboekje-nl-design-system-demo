from flask.views import MethodView
from flask import request, abort, make_response
from flask_inputs import Inputs
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from flask_inputs.validators import JsonSchema
from core.utils import row2dict
from core.database import db
from core.views.hhb_view.hhb_object import HHBObject
from core.views.hhb_view.hhb_query import HHBQuery

class InputValidator(Inputs):
    """ JSON validator for creating and editing a Afspraak """
    json = [JsonSchema(schema={})]

class HHBView(MethodView):
    """ Base class for Huishoudboekje views """
    hhb_model = None
    hhb_query = None
    hhb_object = None
    validation_data = None
    validator = None

    def __init__(self):
        self.hhb_query = HHBQuery(self.hhb_model)
        self.hhb_object = HHBObject(self.hhb_model)
        self.validator = InputValidator()
        self.validator.json = [JsonSchema(schema=self.validation_data)]

    def input_validate(self):
        """ Validate input data """
        inputs = self.validator(request)
        if not inputs.validate():
            abort(make_response({"errors": inputs.errors}, 400))

    def get_id_from_kwargs(self, **kwargs):
        if len(kwargs) == 0:
            return None
        elif len(kwargs) == 1:
            return kwargs[kwargs.keys()[0]]
        else:
            abort(make_response({"errors": "Recieved too many parameters."}, 400))

    def get(self, **kwargs):
        """ GET /<view_path>/(<int:object_id>)?(columns=..,..,..)&(filter_ids=..,..,..))
        
        Inputs
            object_id: optional path parameter
            optional url parameters:
                columns: comma seperated list of columns to retrieve
                filter_ids: comma seperated list of object ids

        returns
            200 {"data": <object_json>}
            200 {"data": [<object_json>, <object_json>, <object_json>]}
            404 {"errors": ["Object not found."]}
            400 {"errors": ["Input for filter_ids is not correct, '...' is not a number."]}
            400 {"errors": ["Input for columns is not correct, '...' is not a column."]}
        """
        object_id = self.get_id_from_kwargs(**kwargs)
        self.hhb_query.add_filter_columns()
        self.hhb_query.add_filter_ids()
        self.extend_get(**kwargs)
        if object_id:
            return self.hhb_query.get_result_single(object_id)
        return self.hhb_query.get_result_multiple()

    def extend_get(self, **kwargs):
        """ Allows code injection into the get method """

    def post(self, **kwargs):
        """ POST /<view_path>/(<int:object_id>)
        
        Input:
            object_id: optional path parameter
            object_json: data

        returns
            201 {"data": <object_json>}
            202 {"data": <object_json>}
            400 {"errors": [<input data error message>]}
            404 {"errors": ["Organisatie not found."]}
            409 {"errors": [<database integrity error>]}
        """
        object_id = self.get_id_from_kwargs(**kwargs)
        self.input_validate()
        response_code = self.hhb_object.get_or_create(object_id)
        self.hhb_object.update_using_request_data()
        self.hhb_object.commit_changes()
        return {"data": self.hhb_object.json}, response_code

    def delete(self, **kwargs):
        """ POST /<view_path>/<int:object_id>
        
        Input:
            object_id: required path parameter

        returns
            202 {}
            405 {"errors": ["Method not allowed"]}
            404 {"errors": ["Object not found."]}
        """
        object_id = self.get_id_from_kwargs(**kwargs)
        if not object_id:
            return {"errors": ["Method not allowed"]}, 405
        self.hhb_object.get_or_404(object_id)
        self.hhb_object.delete()
        self.hhb_object.commit_changes()
        return {}, 202