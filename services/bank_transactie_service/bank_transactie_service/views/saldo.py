
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from flask.views import MethodView

from models.bank_transaction import BankTransaction
from core_service.database import db

import logging

class SaldoView(MethodView):

    def get(self, **kwargs):
        """ Get Saldo """
        logging.info("In SaldoView")
        transaction_ids = kwargs.get("object_id", None)
        saldo = 0
        try:  
            if transaction_ids:
                saldo = db.session.query(func.sum(BankTransaction.bedrag).label("saldo")).filter(BankTransaction.id.in_(transaction_ids.split(","))).filter(BankTransaction.is_geboekt==True)
            else:
                saldo = db.session.query(func.sum(BankTransaction.bedrag).label("saldo")).filter(BankTransaction.is_geboekt==True)
        except SQLAlchemyError as excep:
            logging.exception(excep)

        s = {"data": { "bedrag": saldo.all()[0][0] }}
        return s