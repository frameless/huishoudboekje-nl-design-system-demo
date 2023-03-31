""" MethodView for /saldo path """
from models.saldo import Saldo

from core_service.views.hhb_view import HHBView
import logging
from flask.views import MethodView
from flask import request, abort, make_response
from sqlalchemy import select, text
from core_service.database import db
from core_service.utils import row2dict
from core_service.inputs.validators import JsonSchema


class SaldoView(MethodView):
    """ Methods for /saldo path """

    hhb_model = Saldo
    post_validation = {
        "type": "object",
        "properties": {
            "burger_id": {
                "type": "integer",
            },
            "saldo": {
                "type": "integer"
            },
            "begindatum": {
                "type": "string",
                "pattern": "^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$",
            },
            "einddatum": {
                "type": "string",
                "pattern": "^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$",
            }
        },
        "required": ["burger_id", "saldo", "begindatum", "einddatum"]
    }

    def get(self, **kwargs):
        """ 
            GET /saldo?date=...
            Gets a list of saldo's from one or multiple burgers where the date is between the start & end date
        """
        # self.input_validate()
        burger_ids = request.json.get("burger_ids")
        date = request.args.get("date")
        if (burger_ids == None or date == None):
            return {}, 403

        result_list = [row2dict(row) for row in self.__get_saldos(
            burger_ids, date)]
        return {"data": result_list}, 200

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
        self.__input_validate(self.post_validation)
        db.session.add(self.__create_new_saldo(kwargs.get))
        return {"data": self.hhb_object.json}, response_code

    def delete(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def put(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def __get_saldos(self, burger_ids, date):
        '''
            Gets transactions that are related to burgers with tegenrekening rekeninghouder and rubriek
        '''
        result = Saldo.query\
            .filter(Saldo.burger_id.in_(burger_ids))\
            .filter(Saldo.begindatum <= date)\
            .filter(Saldo.einddatum >= date)

        return result

    def __create_new_saldo(self, burger_id, startdate, enddate, saldo=0):
        """creates a new saldo in the saldo table

        Args:
            burger_id (int): id of the burger to link this saldo to
            startdate (string): startdate of the saldo period
            enddate (string): enddate of the saldo period
            saldo (int, optional): the saldo. Defaults to 0.
        """
        saldo_object = self.hhb_model()
        saldo_object.burger_id = burger_id
        saldo_object.begindatum = startdate
        saldo_object.einddatum = enddate
        saldo_object.saldo = saldo

        return saldo_object

    def __input_validate(self, schema):
        """ Validate input data """
        self.validator.json = [JsonSchema(schema=schema)]
        inputs = self.validator(request)
        if not inputs.validate():
            abort(make_response({"errors": inputs.errors}, 400))
