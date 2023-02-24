""" MethodView for /burgers/<burger_id>/transacties path """
from core_service.utils import row2dict, one_or_none
from core_service.views.hhb_view import HHBView
from models import Afspraak, Journaalpost, Rekening


class BurgerAfsprakenTransactiesView(HHBView):
    """ Methods for /burgers/<burger_id>/transacties path """

    hhb_model = Afspraak

    def get(self, **kwargs):
        """ 
            GET /burgers/<burger_id>/transacties
            Gets transactions that are related to a burger with tegenrekening rekeninghouder
        """

        burger_id = kwargs.get("burger_id", None) 

        
        result_list = [row2dict(row) for row in self.get_burger_transactions(burger_id)]
        return {"data": result_list}, 200


    def get_burger_transactions(self,burger_id):
        '''
            Gets transactions that are related to a burger with tegenrekening rekeninghouder
        '''
        result = Afspraak.query\
                    .filter(Afspraak.burger_id == burger_id)\
                    .join(Journaalpost)\
                    .join(Rekening)\
                    .with_entities(Afspraak.tegen_rekening_id, Rekening.rekeninghouder, Journaalpost.transaction_id.label("transaction_id"))
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
