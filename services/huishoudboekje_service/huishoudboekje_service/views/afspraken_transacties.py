""" MethodView for /afspraken/overzicht path """


import logging
from flask import abort, make_response, request
from sqlalchemy import func, select
from core_service.views.basic_view.basic_filter_view import BasicFilterView
from models.afspraak import Afspraak
from models.journaalpost import Journaalpost
from core_service.database import db


class AfsprakenTransactiesView(BasicFilterView):
    """ Methods for /afspraken/transactions path """

    model = "afspraken"
    query = None

    def get(self, **kwargs):
        agreement_uuids = request.json.get("agreement_uuids", [])
        with_journalentry = request.json.get("with_journalentry", False)

        if agreement_uuids == None:
            abort(make_response(
                {"errors": [f"Invalid JSON given for route afspraken/transactions"]}, 400))

        if with_journalentry:
            data = self.__get_afspraken_with_transaction_ids_and_journalentry(
                agreement_uuids)
        else:
            data = self.__get_afspraken_with_transaction_ids(
                agreement_uuids)

        if data != None:
            return [self.__create_json_response(row) for row in data]
        else:
            return {}, 204

    def __get_afspraken_with_transaction_ids(self, agreement_uuids):

        subquery = (select(func.array_agg(Journaalpost.transaction_uuid).label('transactions'))
                    .where(Journaalpost.afspraak_id == Afspraak.id).scalar_subquery())

        query = select(Afspraak.uuid, subquery.label('transactions'))\
            .filter(Afspraak.uuid.in_(agreement_uuids))

        return db.session.execute(query).all()

    def __get_afspraken_with_transaction_ids_and_journalentry(self, agreement_uuids):

        subquery = (select(func.json_object_agg(Journaalpost.transaction_uuid, Journaalpost.uuid).label('transactions'))
                    .where(Journaalpost.afspraak_id == Afspraak.id).scalar_subquery())

        query = select(Afspraak.uuid, subquery.label('transactions'))\
            .filter(Afspraak.uuid.in_(agreement_uuids))

        return db.session.execute(query).all()

    def __create_json_response(self, row):
        (id, transactions) = row
        return id, transactions
