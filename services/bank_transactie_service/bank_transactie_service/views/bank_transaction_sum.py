""" MethodView for /customerstatementmessages/ path """
from core_service.utils import row2dict, string_to_date, valid_date
from flask import request, abort, make_response

from models.bank_transaction import BankTransaction
from core_service.views.hhb_view import HHBView
from bank_transactie_service.controllers.BanktransactionRangeControllers import BanktransactionRangeController
from sqlalchemy import func


class BanktransactionSumView(HHBView):
    """ Methods for /banktransactions/range?start=<start>&end=<end> path """
    TRANSACTIONS_IDS_LIST_NAME = "transaction_ids"

    hhb_model = BankTransaction
    validation_data = {
        TRANSACTIONS_IDS_LIST_NAME:{
            "type": "array",
            "items": {
                "type": "number"
            }
        },
        "required": [TRANSACTIONS_IDS_LIST_NAME]
    }

    def get(self, **kwargs):
        """ 
            GET /banktransactions/sum?date=<date>
        """
        date = request.args.get('date')

        if not valid_date(date):
            abort(make_response({"errors": "invalid date"}, 400))

        ids = self.__get_transaction_ids_from_body()

        query = BankTransaction.query\
                    .with_entities(func.coalesce(func.sum(BankTransaction.bedrag), 0).label("sum"))\
                    .filter(BankTransaction.transactie_datum <= string_to_date(date))\
                    .filter(BankTransaction.is_geboekt == True)
        
        if ids and len(ids) > 0:
            query = query.filter(BankTransaction.id.in_(ids))

        result_list = [row2dict(row) for row in query]
        return {"data": result_list}, 200

    def __get_transaction_ids_from_body(self):
        ''' validates json in body and if valid returns list of transaction ids'''
        self.input_validate()
        return request.json.get(self.TRANSACTIONS_IDS_LIST_NAME)

    def post(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def delete(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def put(self, **kwargs):
        """ Not allowed """
        return {}, 405