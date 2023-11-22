""" MethodView for /afspraken/overzicht path """

import logging
from flask import abort, make_response, request
from flask.views import MethodView
from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import aliased
from core_service.views.basic_view.basic_filter_view import BasicFilterView
from models.afspraak import Afspraak
from models.burger import Burger
from models.journaalpost import Journaalpost
from core_service.database import db

from core_service.utils import row2dict


class AfsprakenOverviewView(BasicFilterView):
    """ Methods for /afspraken/overzicht path """

    model = "afspraken"
    query = None

    def get(self, **kwargs):
        burger_ids = request.json.get("burger_ids", [])
        startdate = request.json.get("startdate", [])
        enddate = request.json.get("enddate", [])

        if burger_ids == None or startdate == None or enddate == None:
            abort(make_response(
                {"errors": [f"Invalid JSON given for route afspraken/overzicht"]}, 400))

        data = self.__get_afspraken_with_journaalposten_in_months(
            burger_ids, startdate, enddate)
        logging.warning(data)
        if data != None:
            for row in data:
                logging.warning(row)
            return [self.__create_json_response(row) for row in data]
        else:
            return {}, 204

    def __get_afspraken_with_journaalposten_in_months(self, burger_ids, startdate, enddate):
        # select a.id, (select array_agg(transaction_id) as transactions from journaalposten where journaalposten.afspraak_id = a.id) as transactions from afspraken as a where a.id = 39;

        subquery = (select(func.array_agg(Journaalpost.transaction_id).label('transactions'))
                    .where(Journaalpost.afspraak_id == Afspraak.id).scalar_subquery())

        query = select(Afspraak, subquery.label('transactions'))\
            .filter(Afspraak.burger_id.in_(burger_ids), and_(Afspraak.valid_from <= enddate, or_(Afspraak.valid_through >= startdate, Afspraak.valid_through == None)))
        return db.session.execute(query).all()

    def __create_json_response(self, row):
        (afspraak, transactions) = row
        return afspraak.__dict__, transactions
