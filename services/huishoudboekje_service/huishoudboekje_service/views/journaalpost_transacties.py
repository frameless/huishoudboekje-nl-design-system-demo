""" MethodView for /burgers/<burger_id>/transacties path """
from core_service.utils import row2dict, one_or_none
from core_service.views.hhb_view import HHBView
from models import Afspraak, Journaalpost, Rekening, Rubriek
from flask import request


class BurgerTransactiesView(HHBView):
    """ Methods for /burgers/transacties path """

    hhb_model = Afspraak

    BURGER_IDS_LIST_NAME = "burger_ids"
    RUBRIEKEN_FILTER_LIST_NAME = "filter_rubrieken"
    
    validation_data = {
        BURGER_IDS_LIST_NAME:{
            "type": "array",
            "items": {
                "type": "number"
            }
        },
        RUBRIEKEN_FILTER_LIST_NAME:{
            "type": "array",
            "items": {
                "type": "number"
            }
        },
        "required": [BURGER_IDS_LIST_NAME]
      }
    
    def get(self, **kwargs):
        """ 
            GET /burgers/transacties
            Gets transactions that are related to burgers with tegenrekening rekeninghouder
        """
        self.input_validate()
        burger_ids = request.json.get(self.BURGER_IDS_LIST_NAME)
        filter_rubrieken = request.json.get(self.RUBRIEKEN_FILTER_LIST_NAME)
        
        result_list = [row2dict(row) for row in self.__get_transactions(burger_ids, filter_rubrieken)]
        return {"data": result_list}, 200

    def __get_transactions(self,burger_ids, filter_rubrieken):
        '''
            Gets transactions that are related to burgers with tegenrekening rekeninghouder and rubriek
        '''
        result = Afspraak.query\
                        .join(Journaalpost)\
                        .join(Rekening)\
                        .join(Rubriek, Rubriek.grootboekrekening_id == Journaalpost.grootboekrekening_id)\
                        .with_entities(Afspraak.burger_id, Rubriek.naam.label("rubriek"), Rekening.rekeninghouder, Journaalpost.transaction_uuid.label("transaction_id"))

        if(len(burger_ids) > 0):
            result = result.filter(Afspraak.burger_id.in_(burger_ids))
        
        if(filter_rubrieken and len(filter_rubrieken) > 0):
            result = result.filter(Rubriek.id.in_(filter_rubrieken))

        return result

    def post(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def delete(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def put(self, **kwargs):
        """ Not allowed """
        return {}, 405
    
