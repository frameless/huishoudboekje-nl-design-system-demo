""" MethodView for /rekeningen/<rekening_id>/organisatie/rekeningen path """
from core_service.utils import row2dict
from sqlalchemy import  func, select
from flask import abort, make_response
from models import Afdeling
from core_service.database import db

from core_service.views.hhb_view import HHBView

class OrganisatieRekeningenView(HHBView):
    """ Methods for /rekeningen/<rekening_id>/organisatie/rekeningen path """

    hhb_model = Afdeling

    def get(self, **kwargs):
        """ 
            GET /rekeningen/<rekening_id>/organisatie/rekeningen
        """
        rekening_id = kwargs.get("rekening_id", None) 

        result_list = [row2dict(row) for row in self.get_organisatie_rekeningen_by_rekening(rekening_id)]

        if len(result_list) != 1:
            abort(make_response({"errors": [f"Failed to get rekeningen"]}, 400))

        return {"data": result_list[0]["organisatie_rekeningen"]}, 200

    def get_organisatie_rekeningen_by_rekening(self,rekening_id):
        '''
            Gets all rekeningen_ids for a organisatie by rekening_id
        '''
        organisatie = Afdeling.query\
                    .filter(Afdeling.rekeningen_ids.any(rekening_id))\
                    .with_entities(Afdeling.organisatie_id).subquery()
        rekeningen = Afdeling.query\
                    .filter(Afdeling.organisatie_id.in_(organisatie))\
                    .with_entities(func.unnest(Afdeling.rekeningen_ids).label("rekening")).subquery()
        result = select(func.array_agg(rekeningen.c.rekening.distinct()).label("organisatie_rekeningen"))
        return db.engine.execute(result)

    def post(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def delete(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def put(self, **kwargs):
        """ Not allowed """
        return {}, 405