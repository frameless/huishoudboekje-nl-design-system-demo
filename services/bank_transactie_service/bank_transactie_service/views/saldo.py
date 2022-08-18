
import logging

from flask.views import MethodView
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError

from core_service.database import db
from core_service.utils import get_all
from models.bank_transaction import BankTransaction


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

        s = {"data": {"bedrag": get_all(saldo)[0][0]}}
        return s