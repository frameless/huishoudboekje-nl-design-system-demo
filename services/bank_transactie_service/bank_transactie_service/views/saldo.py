
import logging

from flask import request
from flask.views import MethodView
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError

from core_service.database import db
from core_service.utils import one_or_none
from models.bank_transaction import BankTransaction


class SaldoView(MethodView):

    def get(self, **kwargs):
        """ Get Saldo """
        logging.info("In SaldoView")
        transaction_ids = request.args.get("filter_ids") or kwargs.get("object_id")
        saldo = 0

        try:
            query =\
                db.session.query(func.sum(BankTransaction.bedrag).label("saldo")).filter(BankTransaction.is_geboekt)
            if transaction_ids:
                query = query.filter(BankTransaction.id.in_(transaction_ids.split(",")))

            result = one_or_none(query)
            if result is not None:
                saldo = result[0] or saldo
        except SQLAlchemyError as excep:
            logging.exception(excep)

        return {"data": [{"bedrag": saldo}]}
