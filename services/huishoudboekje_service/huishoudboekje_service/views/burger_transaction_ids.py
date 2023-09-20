""" MethodView for /burgers/<burger_id>/transacties path """
from core_service.utils import row2dict, one_or_none
from core_service.views.hhb_view import HHBView
from models import Afspraak, Journaalpost, Rekening, Rubriek
from flask import request


class BurgerTransactieIdsView(HHBView):
    """ Methods for /burgers/transactie/ids path """

    hhb_model = Afspraak

    BURGER_IDS_LIST_NAME = "burger_ids"
    
    validation_data = {
        BURGER_IDS_LIST_NAME:{
            "type": "array",
            "items": {
                "type": "number"
            }
        },
        "required": [BURGER_IDS_LIST_NAME]
    }
    
    def get(self, **kwargs):
        """ 
            GET /burgers/transactie/ids
            Gets transaction ids that are related to the burger ids
        """
        self.input_validate()
        burger_ids = request.json.get(self.BURGER_IDS_LIST_NAME)
        
        result_list = [row2dict(row) for row in self.__get_transaction_ids(burger_ids)]
        return {"data": result_list}, 200

    def __get_transaction_ids(self,burger_ids):
        '''
            Gets transactions that are related to the burger ids
        '''
        return Afspraak.query\
                        .join(Journaalpost)\
                        .with_entities(Journaalpost.transaction_id.label("transaction_id"))\
                        .filter(Afspraak.burger_id.in_(burger_ids))

    def post(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def delete(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def put(self, **kwargs):
        """ Not allowed """
        return {}, 405
    
