""" MethodView for /saldo path """
from datetime import datetime
from models.saldo import Saldo

from core_service.views.hhb_view import HHBView
import logging
from flask.views import MethodView
from core_service.inputs.inputs import Inputs
from core_service.inputs.validators import JsonSchema
from flask import request, abort, make_response
from sqlalchemy import select, text, and_
from core_service.utils import row2dict
from core_service.inputs.validators import JsonSchema
from core_service.views.hhb_view.hhb_object import HHBObject
from sqlalchemy.exc import IntegrityError, OperationalError
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.sql import func
import json

from core_service.database import db
from core_service.utils import row2dict, handle_operational_error


class SaldoView(HHBView):
    """ Methods for /saldo path """

    hhb_model = Saldo
    validation_data = {
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
        "required": []
    }

    def get(self, **kwargs):
        """
            GET /saldo?date=...
            GET /saldo?closest_to=...
            GET /saldo?startdate=...&enddate=...
            GET /saldo

            Body should contain a list of burger_ids
            Gets a list of saldo's from one or multiple burgers where the date is between the start & end date
        """
        burger_ids = request.json.get("burger_ids")
        date = request.args.get("date")
        closest_to = request.args.get("closest_to")
        startdate = request.args.get("startdate")
        enddate = request.args.get("enddate")
        data = None
        if (burger_ids == None):
            return {}, 403

        elif (date != None):
            data = self.__get_saldos(burger_ids, date)

        elif (startdate != None and enddate != None):
            data = self.__get_saldos_by_daterange(
                burger_ids, startdate, enddate)

        elif (closest_to != None):
            data = self.__get_closest_saldo_to_date(burger_ids, closest_to)

        elif (burger_ids != None):
            data = self.__get_saldos_by_burger_ids(burger_ids)

        if (data != None):
            result_list = [row2dict(row) for row in data]
            return {"data": result_list}, 200
        elif (data == None):
            return {"data": []}, 200

        else:
            return {}, 403

    def post(self, **kwargs):
        self.input_validate()
        if (request.json.get("id")):
            abort(make_response(
                {"errors": "POST does not support posting by id, leave the field empty to auto increment. Use PUT to update existing saldo"}, 400))

        response = super().post(**kwargs)
        closest_saldo = self.__get_closest_saldo_to_date([request.json.get("burger_id")],  datetime.strptime(
            request.json.get("einddatum"), '%Y-%m-%d'))
        if (len(closest_saldo.all()) > 0):
            prev_saldo = closest_saldo.first().saldo
        else:
            prev_saldo = 0
        add_to_saldo = request.json.get("saldo") - prev_saldo
        saldo_object_json = self.hhb_object.json
        burger_id = saldo_object_json.get("burger_id")
        enddate = datetime.strptime(
            saldo_object_json.get("einddatum"), '%Y-%m-%dT%H:%M:%S')

        if (add_to_saldo != None and enddate != None and burger_id != None):
            self.__update_future_saldos(burger_id, add_to_saldo, enddate)
            self.hhb_object.commit_changes()

        return response

    def delete(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def put(self, **kwargs):
        self.input_validate()
        try:
            id = request.json.get("id")
            self.hhb_object.get_or_404(id)
        except NoResultFound:
            return {}, 404

        old_saldo = self.hhb_object.json.get("saldo")
        self.hhb_object.update_using_request_data()
        self.hhb_object.commit_changes()

        new_saldo = request.json.get("saldo")
        saldo = new_saldo - old_saldo
        saldo_object_json = self.hhb_object.json
        burger_id = saldo_object_json.get("burger_id")
        enddate = datetime.strptime(
            saldo_object_json.get("einddatum"), '%Y-%m-%dT%H:%M:%S')

        if (saldo != None and enddate != None and burger_id != None):
            self.__update_future_saldos(burger_id, saldo, enddate)
            self.hhb_object.commit_changes()

        return {"data": saldo_object_json}, 200

    def __get_saldos(self, burger_ids, date):
        '''
            Gets transactions that are related to burgers with tegenrekening rekeninghouder and rubriek
        '''
        result = Saldo.query\
            .filter(Saldo.burger_id.in_(burger_ids))\
            .filter(Saldo.begindatum <= date)\
            .filter(Saldo.einddatum >= date)

        return result

    def __update_future_saldos(self, burger_id, saldo, enddate):
        result = Saldo.query\
            .filter(Saldo.burger_id == burger_id)\
            .filter(Saldo.begindatum > enddate)\
            .update({Saldo.saldo: Saldo.saldo + saldo}, synchronize_session='evaluate')

        return result

    def __get_saldos_by_daterange(self, burger_ids, startdate, enddate):
        result = Saldo.query\
            .filter(Saldo.burger_id.in_(burger_ids))\
            .filter(Saldo.begindatum <= enddate)\
            .filter(Saldo.einddatum >= startdate)

        return result

    def __get_saldos_by_burger_ids(self, burger_ids):
        result = Saldo.query\
            .filter(Saldo.burger_id.in_(burger_ids))

        return result

    def __get_closest_saldo_to_date(self, burger_ids, date):
        if (len(burger_ids) == 0):
            subquery = db.session.query(db.func.max(Saldo.einddatum).label(
                'einddatum'), Saldo.burger_id).filter(Saldo.einddatum < date)\
                .group_by(Saldo.burger_id).subquery()

        if (len(burger_ids) > 0):
            subquery = db.session.query(db.func.max(Saldo.einddatum).label(
                'einddatum'), Saldo.burger_id).filter(Saldo.einddatum < date)\
                .filter(Saldo.burger_id.in_(burger_ids))\
                .group_by(Saldo.burger_id).subquery()

        # Specifically get the columns needed because we use db.session.query and not Saldo.query
        # db.sessions.query is required here because we are using subquery and not strictly a query on the Saldo table
        result = db.session.query(Saldo.einddatum, Saldo.saldo, Saldo.burger_id, Saldo.begindatum, Saldo.id)\
            .join(subquery, and_(
                subquery.c.burger_id == Saldo.burger_id,
                subquery.c.einddatum == Saldo.einddatum
            ))
        return result
