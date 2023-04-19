""" MethodView for /afspraken/search path """

from datetime import datetime
from flask.views import MethodView
from sqlalchemy import or_, and_
from flask import request
from models.afspraak import Afspraak
from core_service.utils import row2dict


class AfsprakenSearchView(MethodView):
    """ Methods for /afspraken/search path """

    def get(self, **kwargs):
        """ GET /afspraken/search
        """
        offset = request.args.get("offset")
        limit = request.args.get("limit")
        afspraak_ids = request.json.get("afspraak_ids")
        burger_ids = request.json.get("burger_ids")
        afdeling_ids = request.json.get("afdeling_ids")
        only_valid = request.json.get("only_valid")
        min_bedrag = request.json.get("min_bedrag")
        max_bedrag = request.json.get("max_bedrag")

        result =  Afspraak.query
        if afspraak_ids:
            result = result.filter(Afspraak.id.in_(afspraak_ids))

        if burger_ids:
            result = result.filter(Afspraak.burger_id.in_(burger_ids))

        if afdeling_ids:
            result = result.filter(Afspraak.afdeling_id.in_(afdeling_ids))

        if only_valid:
            today = datetime.now()
            result = result.filter(and_(today >= Afspraak.valid_from, or_(today <= Afspraak.valid_through, Afspraak.valid_through == None)))

        if min_bedrag:
            result = result.filter(Afspraak.bedrag > min_bedrag)

        if max_bedrag:
            result = result.filter(Afspraak.bedrag < max_bedrag)

        if offset is not None and limit is not None:
            count = result.count()
            result = result.limit(limit).offset(offset)

        response = {"afspraken": [row2dict(row) for row in result]}
        
        if count is not None:
            response.update({"page_info": {
                    "count": count,
                    "offset": int(offset),
                    "limit": int(limit)
                }
            })
        
        return response, 200
