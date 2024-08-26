""" MethodView for /journaalposten_delete/ path """
import logging
from flask.views import MethodView
from flask import request
from models.journaalpost import Journaalpost
from core_service.database import db
from core_service.utils import row2dict


class JournaalpostDeleteView(MethodView):
    """ Methods for /journaalposten_delete/ path """
    hhb_query = None

    def delete(self, **kwargs):
        """ DELETE

        Inputs
            transaction_ids

        returns
            200 
        """
        transaction_uuids = request.json.get("transaction_ids")
        
        
        deleted = Journaalpost.query\
            .filter(Journaalpost.transaction_uuid.in_(transaction_uuids))\
            .with_entities(Journaalpost.uuid).all()

        Journaalpost.query.filter(Journaalpost.transaction_uuid.in_(transaction_uuids)).delete()
        db.session.commit()

        response = {"data": [row2dict(row) for row in deleted]}
        return response, 200
