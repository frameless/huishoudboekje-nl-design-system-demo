import re

from flask.views import MethodView
from flask import request, abort, make_response
from core_service.inputs.inputs import Inputs
from core_service.inputs.validators import JsonSchema
from core_service.database import db
from core_service.views.hhb_view.hhb_object import HHBObject
from core_service.views.hhb_view.hhb_query import HHBQuery


class InputValidator(Inputs):
    """ JSON validator for creating and editing a object """
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
        self.validator = InputValidator
        self.validator.json = [JsonSchema(schema=self.validation_data)]
        self.db = db

    @property
    def query(self):
        return self.hhb_query.query

    @property
    def object(self):
        return self.hhb_object.hhb_object

    def input_validate(self):
        """ Validate input data """
        inputs = self.validator(request)
        if not inputs.validate():
            abort(make_response({"errors": inputs.errors}, 400))

    def get_object_id_from_kwargs(self, **kwargs):
        if (object_id := kwargs.get("object_id", None)) is not None:
            if str(self.hhb_model.__table__.c['id'].type) == "VARCHAR":
                if re.match("^\\w+$", object_id):
                    return object_id
                elif re.match("^\\w+(?:,\\w+)+$", object_id):
                    return object_id.split(",")
            else:
                if re.match("^\\d+$", object_id):
                    return int(object_id)
                elif re.match("^\\d+(?:,\\d+)+$", object_id):
                    return [int(s) for s in object_id.split(",")]
            abort(make_response(
                {"errors": [f"Supplied id '{object_id}' is not valid."]}, 400))

    @staticmethod
    def filter_in_string(name, cb):
        filter_string = request.args.get(name)
        ids = []
        if filter_string:
            for raw_id in filter_string.split(","):
                ids.append(str(raw_id))
        elif not filter_string and "content-type" in request.headers and "json" in request.headers['content-type']:
            ids = request.json.get(name)

        if ids:
            if any(not id.isdigit() for id in ids):
                cb(ids)
            else:
                cb(list(map(int, ids)))

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
        object_id = self.get_object_id_from_kwargs(**kwargs)
        self.hhb_query.filter_results()
        self.hhb_query.add_filter_columns()
        self.hhb_query.add_filter_ids(object_id)
        self.extend_get(**kwargs)
        self.hhb_query.load_relations()
        desc = request.args.get('desc', False)
        sortingColumn = request.args.get('sortingColumn', "id")
        self.hhb_query.order_query(desc=desc, sortingColumn=sortingColumn)
        if object_id and type(object_id) != list:
            return self.hhb_query.get_result_single(object_id)
        start = request.args.get('start', None)
        limit = request.args.get('limit', None)
        return self.hhb_query.get_result_multiple(start=start, limit=limit)

    def extend_get(self, **kwargs):
        """ Allows code injection into the get method """

    def post(self, **kwargs):
        """ POST /<view_path>/(<int:object_id>)

        Input:
            object_id: optional path parameter
            object_json: data

        returns
            200 {"data": <object_json>}
            201 {"data": <object_json>}
            400 {"errors": [<input data error message>]}
            404 {"errors": ["Organisatie not found."]}
            409 {"errors": [<database integrity error>]}
        """
        object_id = self.get_object_id_from_kwargs(**kwargs)
        self.input_validate()

        extended_check = self.extend_post_with_extra_check(**kwargs)
        if not object_id and len(extended_check) > 0:
            return {"errors": extended_check}, 400

        response_code = self.hhb_object.get_or_create(object_id)
        self.hhb_object.update_using_request_data()
        self.hhb_object.commit_changes()
        return {"data": self.hhb_object.json}, response_code

    def extend_post_with_extra_check(self, **kwargs):
        """ Extend the post function with extra check """
        return []

    def delete(self, **kwargs):
        """ DELETE /<view_path>/<int:object_id>

        Input:
            object_id: required path parameter

        returns
            204 {}
            405 {"errors": ["Method not allowed"]}
            404 {"errors": ["Object not found."]}
        """
        object_id = self.get_object_id_from_kwargs(**kwargs)
        if not object_id:
            return {"errors": ["Method not allowed"]}, 405
        self.hhb_object.get_or_404(object_id)
        self.hhb_object.delete()
        self.hhb_object.commit_changes()
        return {}, 204

    # TODO put implementeren
    # def put(self, **kwargs):
    #     """ PUT /<view_path>/(<int:object_id>) """
    #     return {"data": self.hhb_object.json}, 200
