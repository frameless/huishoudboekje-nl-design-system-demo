""" MethodView for get all paths """
import logging
from flask.views import MethodView
from flask import request
from core_service.utils import row2dict


class BasicFilterView(MethodView):
    """ Methods for get all paths """

    model = "data"
    query = None

    def get(self, **kwargs):
        """ GET /<view_path>/filter?(offset=...&limit=...))

        Inputs
            json.filter: filter arguments to be used
            offset & limit: use for paged return

        returns
            200 {"<model>": [<object_json>]}
            200 {"<model>": [<object_json>]
                "page_info": {
                        "count": count,
                        "start": offset,
                        "limit": limit
                    }
                }
        """
        filter = request.json.get("filter")
        self.set_basic_query()
        if filter is not None:
            self.query = self.add_filter_options(filter, self.query)
        return self.build_response(self.query)

    def build_response(self, query):
        """ Generates the response to be returned

            when offset and limit are provided it returns a paged result set

        """
        offset = request.args.get("offset")
        limit = request.args.get("limit")
        count = None
        if offset is not None and limit is not None:
            count = query.count()
            query = query.limit(limit).offset(offset)

        response = {self.model: [row2dict(row) for row in query]}

        if count is not None:
            response.update({"page_info": {
                "count": count,
                "start": int(offset),
                "limit": int(limit)
            }
            })
        return response, 200

    def set_basic_query(self):
        """ Needs to be implemented in specific views

            Is used to set the basic query to the given model query

            example:
            self.query = BankTransaction.query 
        """

    def add_filter_options(self, filter_options, query):
        """ Should to be implemented in specific views

            Is used to set add the given filters to the basic query
        """
