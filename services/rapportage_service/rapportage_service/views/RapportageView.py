from flask import request
from flask.views import MethodView
from core_service.views.hhb_view import HHBView
from rapportage_service.controllers.rapportageController import RapportageController

class RapportageView(MethodView):


    
    def get(self, **kwargs):
        """ 
            GET rapportage/<burger_id>?startDate=<start>&endDate=<end>
        """

        burger_id = kwargs.get("burger_id", None) 

        #TODO check dates are valid, functions for this are in banktransaction service should be refactored into core service       
        start = request.args.get('startDate')
        end = request.args.get('endDate')

        #TODO implement dependency injection 
        controller = RapportageController()

        return controller.get_rapportage_burger(burger_id,start,end)


    def post(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def delete(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def put(self, **kwargs):
        """ Not allowed """
        return {}, 405
