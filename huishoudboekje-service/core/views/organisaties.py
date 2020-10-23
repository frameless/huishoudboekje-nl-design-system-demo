""" MethodView for /organisaties/<organisatie_id>/ path """
from flask import request, abort, make_response
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
from models.organisatie import Organisatie
from core.utils import row2dict
from core.views.hhb_view import HHBView

class InputValidator(Inputs):
    """ JSON validator for creating or updating a Organisatie """
    json = [JsonSchema(schema={
        "type": "object",
        "properties": {
            "kvk_nummer": {
                "type": "string",
            },
            "weergave_naam": {
                "type": "string",
            },
        },
        "required": []
    })]

class OrganisatieView(HHBView):
    """ Methods for /organisaties/ path """

    hhb_model = Organisatie

    def get(self, organisatie_id=None):
        """ GET /organisaties/(<int:organisatie_id>?(columns=..,..)&(filter_ids=..,..)&(filter_kvks=..,..))
        
        optional path parameter organisatie_id
        optional url parameters:
            columns: comma seperated list of columns to retrieve
            filter_ids: comma seperated list of organisatie ids
            filter_kvks: comma seperated list of kvk numbers

        returns
            200 {"data": <organisatie_json>}
            200 {"data": [<organisatie_json>, <organisatie_json>, <organisatie_json>]}
            404 {"errors": ["Organisatie not found."]}
            400 {"errors": ["Input for filter_ids is not correct, '...' is not a number."]}
            400 {"errors": ["Input for filter_kvks is not correct, '...' is not a number."]}
            400 {"errors": ["Input for columns is not correct, '...' is not a column."]}
        """
        self.hhb_query.add_filter_columns()
        self.hhb_query.add_filter_ids()
        ## 
        self.add_filter_filter_kvks()
        ##
        if organisatie_id:
            return self.hhb_query.get_result_single(organisatie_id)
        return self.hhb_query.get_result_multiple()

    def add_filter_filter_kvks(self):
        """ Add filter_ids filter based on the kvk of the organisatie model """
        filter_ids = request.args.get('filter_kvks')
        if filter_ids:
            ids = []
            for raw_id in filter_ids.split(","):
                try:
                    ids.append(int(raw_id))
                except ValueError:
                    abort(make_response({"errors": [f"Input for filter_kvks is not correct, '{raw_id}' is not a number."]}, 400))
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.id.in_(ids))

    def post(self, organisatie_id=None):
        """ POST /organisaties/(<int:organisatie_id>)
        
        optional path parameter: organisatie_id
        data: JSON object containing organisatie data

        returns
            200 {"data": <organisatie_json>}
            400 {"errors": [<input data error message>]}
            404 {"errors": ["Organisatie not found."]}
            409 {"errors": [<database integrity error>]}
        """
        self.input_validate(InputValidator)
        response_code = self.hhb_object.get_or_create(organisatie_id)
        self.hhb_object.update_using_request_data()
        self.hhb_object.commit_changes()
        return {"data": self.hhb_object.json}, response_code

    def delete(self, organisatie_id=None):
        """ POST /organisaties/<int:organisatie_id>
        
        required path parameter: organisatie_id

        returns
            202 {}
            405 {"errors": ["Method not allowed"]}
            404 {"errors": ["Organisatie not found."]}
        """
        if not organisatie_id:
            return {"errors": ["Method not allowed"]}, 405
        self.hhb_object.get_or_404(organisatie_id)
        self.hhb_object.delete()
        self.hhb_object.commit_changes()
        return {}, 202
