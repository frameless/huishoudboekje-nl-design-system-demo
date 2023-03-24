""" MethodView for /rekeningen/<rekening_id>/organisatie/rekeningen path """
from core_service.utils import row2dict
from sqlalchemy import  func, select, or_, lateral
from flask import abort, make_response, request
from models import Afdeling
from core_service.database import db

from core_service.views.hhb_view import HHBView

class OrganisatieRekeningenView(HHBView):
    """ Methods for organisaties/afdelingen path """
    REKENINGEN_IDS = "rekeningen_ids"

    hhb_model = Afdeling
    validation_data = {
        REKENINGEN_IDS:{
            "type": "array",
            "items": {
                "type": "number"
            }
        },
        "required": [REKENINGEN_IDS]
    }

    def get(self, **kwargs):
        """ 
            GET /organisaties/rekeningen
        """
        
        rekeningen_ids = self.__get_rekeningen_ids_from_body()
    
        result_list = [row2dict(row) for row in self.get_organisatie_rekeningen_by_rekening(rekeningen_ids)]

        #set makes it distinct values in a set type, list() to convert it back to a list
        for result in result_list:
            result["rekening_ids"] = list(set(result["rekening_ids"]))

        return {"data": result_list}, 200 
    

    def __get_rekeningen_ids_from_body(self):
        ''' validates json in body and if valid returns list of transaction ids'''
        self.input_validate()
        return request.json.get(self.REKENINGEN_IDS)

    def get_organisatie_rekeningen_by_rekening(self,rekeningen_ids):
        '''
            Gets all rekeningen_ids for a organisatie by rekeningen_ids
        '''
        clauses = [Afdeling.rekeningen_ids.any(rekening_id) for rekening_id in rekeningen_ids]

        organisatie_rekeningen = Afdeling.query\
                    .filter(or_(*clauses))\
                    .with_entities(Afdeling.organisatie_id, \
                        func.array_agg(Afdeling.id).label("afdeling_ids"),\
                        func.array_concat_agg(Afdeling.rekeningen_ids).label("rekening_ids"))\
                    .group_by(Afdeling.organisatie_id)
        return organisatie_rekeningen


    def post(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def delete(self, **kwargs):
        """ Not allowed """
        return {}, 405

    def put(self, **kwargs):
        """ Not allowed """
        return {}, 405