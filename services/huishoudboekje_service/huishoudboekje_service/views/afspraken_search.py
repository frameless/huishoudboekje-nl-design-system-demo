""" MethodView for /afspraken/search path """

from datetime import datetime
from flask.views import MethodView
from sqlalchemy import  func, or_, and_ , String
from flask import request
from models.afspraak import Afspraak
from core_service.utils import row2dict


class AfsprakenSearchView(MethodView):
    """ Methods for /afspraken/search path """

    def get(self, **kwargs):
        """ GET /afspraken/search
        """
        search = request.json.get("search")
        query =  Afspraak.query
        if search is not None:
            query = self.add_search_options(search, query)
        return self.build_response(query)

    def build_response(self, query):
        offset = request.args.get("offset")
        limit = request.args.get("limit")
        if offset is not None and limit is not None:
            count = query.count()
            query = query.limit(limit).offset(offset)

        response = {"afspraken": [row2dict(row) for row in query]}
        
        if count is not None:
            response.update({"page_info": {
                    "count": count,
                    "start": int(offset),
                    "limit": int(limit)
                }
            })
        
        return response, 200

    def add_search_options(self, search_options, query):
        afspraak_ids = search_options.get("afspraak_ids", None)
        burger_ids = search_options.get("burger_ids", None)
        afdeling_ids = search_options.get("afdeling_ids", None)
        only_valid = search_options.get("only_valid", None)
        min_bedrag = search_options.get("min_bedrag", None)
        max_bedrag = search_options.get("max_bedrag", None)
        zoektermen = search_options.get("zoektermen", None)

        new_query = query
        if afspraak_ids:
            new_query = new_query.filter(Afspraak.id.in_(afspraak_ids))

        if burger_ids:
            new_query = new_query.filter(Afspraak.burger_id.in_(burger_ids))

        if afdeling_ids:
            new_query = new_query.filter(Afspraak.afdeling_id.in_(afdeling_ids))
        if only_valid is not None:
            today = datetime.now()
            if only_valid:
                new_query = new_query.filter(and_(today >= Afspraak.valid_from, or_(today <= Afspraak.valid_through, Afspraak.valid_through == None)))
            else:
                new_query = new_query.filter(and_(Afspraak.valid_through != None, Afspraak.valid_through < today))

        if min_bedrag:
            new_query = new_query.filter(Afspraak.bedrag > min_bedrag)

        if max_bedrag:
            new_query = new_query.filter(Afspraak.bedrag < max_bedrag)

        if zoektermen:
            clauses = [or_(func.lower(Afspraak.omschrijving).like(f"%{term.lower()}%"), func.lower(Afspraak.zoektermen.cast(String)).like(f"%{term.lower()}%")) for term in zoektermen]
            new_query = new_query.filter(and_(*clauses))
        
        return new_query