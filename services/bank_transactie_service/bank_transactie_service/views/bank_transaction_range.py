""" MethodView for /customerstatementmessages/ path """
from flask import request

from models.bank_transaction import BankTransaction
from core_service.views.hhb_view import HHBView
from bank_transactie_service.controllers.BanktransactionRangeControllers import BanktransactionRangeController


class BanktransactionRangeView(HHBView):
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
            GET /banktransactions/range?startDate=<start>&endDate=<end>
        """
        start = request.args.get('startDate')
        end = request.args.get('endDate')
        ids = self.__get_transaction_ids_from_body()

        banktransactionRangeService = BanktransactionRangeController()

        return banktransactionRangeService.get_banktransactions_in_range(ids,start,end)

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