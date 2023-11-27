""" MethodView for /afspraken/overzicht path """

import logging
from flask import abort, json, make_response, request
from flask.views import MethodView
from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import aliased
from models.rekening import Rekening
from core_service.views.basic_view.basic_filter_view import BasicFilterView
from models.afspraak import Afspraak
from models.burger import Burger
from models.journaalpost import Journaalpost
from core_service.database import db

from core_service.utils import row2dict
from models.afdeling import Afdeling


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

        if data != None:
            return {"data": self.build_response(data)}, 200
        else:
            return {}, 204

    def __get_afspraken_with_journaalposten_in_months(self, burger_ids, startdate, enddate):
        afspraken_with_transaction_ids = Afspraak.query\
            .filter(Afspraak.burger_id.in_(burger_ids), and_(Afspraak.valid_from <= enddate, or_(Afspraak.valid_through >= startdate, Afspraak.valid_through == None)))\
            .outerjoin(Journaalpost, Journaalpost.afspraak_id == Afspraak.id)\
            .outerjoin(Afdeling, Afdeling.id == Afspraak.afdeling_id)\
            .outerjoin(Rekening, Rekening.id == Afspraak.tegen_rekening_id)\
            .with_entities(Afspraak.valid_from, Afspraak.valid_through, Rekening.rekeninghouder, Afspraak.id, Afspraak.burger_id, Afspraak.tegen_rekening_id, Afspraak.omschrijving, Afdeling.organisatie_id, func.array_agg(Journaalpost.transaction_id).label("transaction_ids"))\
            .group_by(Afspraak.id, Afdeling.organisatie_id, Afspraak.tegen_rekening_id, Rekening.rekeninghouder)

        return afspraken_with_transaction_ids
