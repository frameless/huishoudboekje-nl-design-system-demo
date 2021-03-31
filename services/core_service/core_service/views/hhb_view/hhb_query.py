import re

from flask import request, abort, make_response
from sqlalchemy import String
from sqlalchemy.orm import joinedload
from core_service.utils import row2dict

class HHBQuery():
    hhb_model = None
    query = None

    def __init__(self, hhb_model):
        self._exposed_many_relations = []
        self._exposed_one_relations = []
        self.hhb_model = hhb_model
        self.query = self.hhb_model.query
        self.filtered_columns = []

    def expose_one_relation(self, relation, relation_property):
        self._exposed_one_relations.append({"relation": relation, "relation_property": relation_property})

    def expose_many_relation(self, relation, relation_property):
        self._exposed_many_relations.append({"relation": relation, "relation_property": relation_property})

    def add_filter_columns(self):
        """ Add column filters to query """
        columns = request.args.get('columns')
        if columns:
            column_filter = []
            for column_name in columns.split(","):
                if column_name not in self.hhb_model.__table__.columns.keys():
                    abort(make_response(
                        {"errors": [
                            f"Input for columns is not correct, '{column_name}' is not a column."
                        ]}, 400))
                column_filter.append(self.hhb_model.__table__.columns[column_name])
                self.filtered_columns.append(column_name)
            self.query = self.query.with_entities(*column_filter)

    def add_filter_ids(self, object_id):
        """ Add filter_ids filter based on the primary key of the hhb model """
        if type(object_id) == list:
            filter_ids = object_id
        elif 'filter_ids' in request.args:
            filter_ids = request.args.get('filter_ids').split(",")
        else:
            return

        # TODO check if it is possible to reference the PK column rather than the "id" column
        if str(self.hhb_model.__table__.c['id'].type) == "VARCHAR":
            ids = [str(id) for id in filter_ids]
        else:
            try:
                ids = [int(id) for id in filter_ids]
            except ValueError as err:
                abort(make_response(
                    {"errors": [
                        f"""Input for filter_ids is not correct, '{re.findall("'([^']*)'", str(err))[0]}' is not a number."""
                    ]}, 400))

        self.query = self.query.filter(self.hhb_model.id.in_(ids))

    def get_result_single(self, row_id):
        """ Get a single result from the current query """
        row = self.query.filter(self.hhb_model.id==row_id).one_or_none()
        if not row:
            return {"errors": [f"{self.hhb_model.__name__} not found."]}, 404
        return {"data": self.post_process_data(row)}, 200

    def get_result_multiple(self, start=None, limit=None):
        """ Get multiple results from the current query """
        results = self.query.all()

        if start is not None and limit is not None:
            start = int(start)
            limit = int(limit)
            count = len(results)
            if count < start:
                abort(404)
            # make response
            obj = {'start': start, 'limit': limit, 'count': count}
            # make URLs
            # make previous url
            if start == 1:
                obj['previous'] = ''
            else:
                start_copy = max(1, start - limit)
                limit_copy = start - 1
                obj['previous'] = '?start=%d&limit=%d' % (start_copy, limit_copy)
            # make next url
            if start + limit > count:
                obj['next'] = ''
            else:
                start_copy = start + limit
                obj['next'] = '?start=%d&limit=%d' % (start_copy, limit)
            # finally extract result according to bounds
            obj['data'] = []
            for row in results[(start - 1):(start - 1 + limit)]:
                obj['data'].append(self.post_process_data(row))
            return obj
        else:
            result_list = []
            for row in results:
                result_list.append(self.post_process_data(row))
            return {"data": result_list}, 200

    def load_relations(self):
        for relation in self._exposed_many_relations + self._exposed_one_relations:
            if not self.filtered_columns or relation['relation'] in self.filtered_columns:
                self.query = self.query.options(joinedload(relation["relation"]))

    def order_query(self):
        self.query = self.query.order_by(self.hhb_model.id)

    def post_process_data(self, row):
        result_dict = row2dict(row)
        for relation in self._exposed_many_relations:
            if not self.filtered_columns or relation['relation'] in self.filtered_columns:
                result_dict[relation["relation"]] = [getattr(item, relation["relation_property"]) for item in getattr(row, relation["relation"])]
        for relation in self._exposed_one_relations:
            if not self.filtered_columns or relation['relation'] in self.filtered_columns:
                result_dict[relation["relation"]] = getattr(getattr(row, relation["relation"]), relation["relation_property"])
        return result_dict