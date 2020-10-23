from flask.views import MethodView
from flask import request, abort, make_response
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from core.utils import row2dict
from core.database import db
from core.views.hhb_view.hhb_object import HHBObject
from core.views.hhb_view.hhb_query import HHBQuery

class HHBView(MethodView):
    """ Base class for Huishoudboekje views """
    hhb_model = None
    hhb_query = None
    hhb_object = None

    def __init__(self):
        self.hhb_query = HHBQuery(self.hhb_model)
        self.hhb_object = HHBObject(self.hhb_model)

    def input_validate(self, validator):
        """ Validate input data """
        inputs = validator(request)
        if not inputs.validate():
            abort(make_response({"errors": inputs.errors}, 400))

    def post(self, **kwargs):
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