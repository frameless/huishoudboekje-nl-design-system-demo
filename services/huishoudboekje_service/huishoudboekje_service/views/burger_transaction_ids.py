""" MethodView for /burgers/<burger_id>/transacties path """
import logging
from sqlalchemy import func
from core_service.utils import row2dict, one_or_none
from core_service.views.hhb_view import HHBView
from models import Afspraak, Journaalpost, Rekening, Rubriek, Burger
from flask import request


class BurgerTransactieIdsView(HHBView):
    """ Methods for /burgers/transactie/ids path """

    hhb_model = Afspraak

    BURGER_IDS_LIST_NAME = "burger_ids"
    CITIZEN_UUIDS_LIST_NAME = "citizen_uuids"
    
    validation_data = {
        "oneOf": [{
        BURGER_IDS_LIST_NAME:{
            "type": "array",
            "items": {
                "type": "number"
            }
        },
        "required": [BURGER_IDS_LIST_NAME]
        },
            {
            CITIZEN_UUIDS_LIST_NAME: {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "required": [CITIZEN_UUIDS_LIST_NAME]
        }]
    }
    
    def get(self, **kwargs):
        """ 
            GET /burgers/transactie/ids
            Gets transaction ids that are related to the burger ids
        """
        self.input_validate()
        burger_ids = request.json.get(self.BURGER_IDS_LIST_NAME, None)
        citizen_uuids = request.json.get(self.CITIZEN_UUIDS_LIST_NAME, None)

        if (citizen_uuids) != None:
            result_list = [row2dict(row)
                           for row in self.__get_transaction_ids_by_uuid(citizen_uuids)]
        else:
            result_list = [row2dict(row)
                           for row in self.__get_transaction_ids(burger_ids)]

        return {"data": result_list}, 200

    def __get_transaction_ids(self,burger_ids):
        '''
            Gets transactions that are related to the burger ids
        '''
        return Afspraak.query\
                        .join(Journaalpost)\
                        .with_entities(Journaalpost.transaction_uuid.label("transaction_id"))\
                        .filter(Afspraak.burger_id.in_(burger_ids))

    def __get_transaction_ids_by_uuid(self, citizen_uuids):
        return Afspraak.query\
            .join(Journaalpost)\
            .join(Burger, Burger.id == Afspraak.burger_id)\
            .with_entities(func.array_agg(Journaalpost.transaction_uuid).label('transactions'), Burger.uuid)\
            .filter(Burger.uuid.in_(citizen_uuids))\
            .group_by(Burger.uuid)

    def post(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def delete(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def put(self, **kwargs):
        """ Not allowed """
        return {}, 405
    
