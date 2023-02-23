from flask import request
from flask.views import MethodView
from core_service.views.hhb_view import HHBView

class RapportageView(MethodView):


    
    def get(self, **kwargs):
        """ 
            GET rapportage/<burger_id>?startDate=<start>&endDate=<end>
        """

        burger_id = kwargs.get("burger_id", None)        
        start = request.args.get('startDate')
        end = request.args.get('endDate')

        return {"id" : burger_id, "start": start, "end": end}, 200


    def post(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def delete(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def put(self, **kwargs):
        """ Not allowed """
        return {}, 405
