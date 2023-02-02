""" MethodView for /journaalposten_rubriek/ path """
import logging
from flask.views import MethodView
from flask import request, abort, make_response
from sqlalchemy import select, text
from core_service.database import db


class JournaalpostRubriekView(MethodView):
    """ Methods for /journaalposten_rubriek/ path """
    hhb_query = None

    def __init__(self):
        self.hhb_query = text("""
            SELECT j.id, j.transaction_id, j.is_automatisch_geboekt, r1.naam AS "afspraak_rubriek_naam", r2.naam AS "grootboekrekening_rubriek_naam"
            FROM journaalposten j 
            LEFT JOIN afspraken a ON j.afspraak_id = a.id
            LEFT JOIN rubrieken r1 ON a.rubriek_id = r1.id
            LEFT JOIN rubrieken r2 ON j.grootboekrekening_id = r2.grootboekrekening_id
            WHERE transaction_id IN :ids 
            """)
        self.db = db

    def get(self, **kwargs):
        """ GET /<view_path>/(<int:object_id>)?(filter_ids=..,..,..))

        Inputs
            object_id: optional path parameter
            optional url parameters:
                filter_ids: comma seperated list of object ids

        returns
            200 {"data": <object_json>}
            200 {"data": [<object_json>, <object_json>, <object_json>]}
            404 {"errors": ["Object not found."]}
            400 {"errors": ["Input for filter_ids is not correct, '...' is not a number."]}
            400 {"errors": ["Input for columns is not correct, '...' is not a column."]}
        """

        #get filter ids
        if 'filter_ids' in request.args:
            filter_ids = request.args.get('filter_ids').split(",")
        elif "content-type" in request.headers and "json" in request.headers["content-type"] and 'filter_ids' in request.json:
            filter_ids = request.json['filter_ids']

        try:
            filter_ids = list(map(int, filter_ids))
        except ValueError as e:
            abort(make_response({"errors": [f"Failed to parse filters: {e}"]}, 400))

        result = db.engine.execute(self.hhb_query, ids=tuple(filter_ids))
        
        result_list = []
        for row in result:
            result_list.append(dict(row))
        
        return {"data": result_list}, 200
