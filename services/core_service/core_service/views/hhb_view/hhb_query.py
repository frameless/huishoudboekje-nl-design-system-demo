import json
import logging
import re
from typing import Dict, Union, List

from flask import request, abort, make_response
from sqlalchemy import sql
from sqlalchemy.orm import joinedload
from sqlalchemy.sql.expression import ColumnElement

from core_service.consts import AndOrOperator, ComparisonOperator, ListAppearanceOperator, RangeOperator
from core_service.utils import row2dict, get_all, one_or_none


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
        self._exposed_one_relations.append(
            {"relation": relation, "relation_property": relation_property})

    def expose_many_relation(self, relation, relation_property):
        self._exposed_many_relations.append(
            {"relation": relation, "relation_property": relation_property})

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
                column_filter.append(
                    self.hhb_model.__table__.columns[column_name])
                self.filtered_columns.append(column_name)
            self.query = self.query.with_entities(*column_filter)

    def add_filter_ids(self, object_id):
        """ Add filter_ids filter based on the primary key of the hhb model """
        if type(object_id) == list:
            filter_ids = object_id
        elif 'filter_ids' in request.args:
            filter_ids = request.args.get('filter_ids').split(",")
        elif "content-type" in request.headers and "json" in request.headers["content-type"] and 'filter_ids' in request.json:
            filter_ids = request.json['filter_ids']
        else:
            return

        # TODO check if it is possible to reference the PK column rather than the "id" column
        if str(self.hhb_model.__table__.c['id'].type) == "VARCHAR":
            ids = [str(id) for id in filter_ids]
        else:
            try:
                ids = [int(id) for id in filter_ids]
            except ValueError:
                ids = []

        self.query = self.query.filter(self.hhb_model.id.in_(ids))

    def filter_results(self):
        """
        Prepares complex filter query building.
        Expects a JSON-stringified dictionary under the key "filters".
        """
        filter_kwargs_str = request.args.get('filters', '{}')
        try:
            filter_kwargs = json.loads(filter_kwargs_str)
            if filter_kwargs:
                filters = self.__parse_filter_kwargs(
                    filter_kwargs=filter_kwargs)
                self.query = self.query.filter(*filters)
        except ValueError as e:
            abort(make_response(
                {"errors": [f"Failed to parse filters: {e}"]}, 400))

    def __parse_filter_kwargs(self, filter_kwargs: Dict[str, Union[str, int, bool]],
                              col_name: str = None) -> List[ColumnElement]:
        """
        Dynamically builds complex filter queries.

        Based on the dict filter_kwargs, a SQLAlchemy filter list is created on which the desired data
        should be filtered.
        For supported operators, see consts in ../consts.py.

        example:
        query {
            bankTransactionsPaged(
              start: 1, limit: 50, filters: {
                OR: {
                  bedrag: {
                    IN: [39100, 166912]
                  }
                  bedrag: {
                    BETWEEN: [0, 200]
                  }
                  AND: {
                    isGeboekt: false,
                    isCredit: true,
                    bedrag: {
                      GT: 30000
                    }
                  }

                }
              }
            ) {
                banktransactions{
                id
                isGeboekt
                isCredit
                bedrag
              }
            }
        }
        """
        sqlalchemy_filters = []
        for key, value in filter_kwargs.items():
            if isinstance(value, dict):
                if (operator := AndOrOperator.get(key, None)):
                    # value is dict with one or more filters
                    op = getattr(sql, operator.value)
                    filter = op(
                        *self.__parse_filter_kwargs(filter_kwargs=value))
                    sqlalchemy_filters.append(filter)
                else:
                    # key is column name, value is operator. Pass col_name so it is remembered
                    filters = self.__parse_filter_kwargs(
                        filter_kwargs=value, col_name=key)
                    sqlalchemy_filters.append(*filters)
            elif col_name:
                # existence of col_name indicates a nested comparison with an operator
                db_column = getattr(self.hhb_model, col_name)

                if (operator := ComparisonOperator.get(key, None)):
                    filter = operator.value(db_column, value)
                    sqlalchemy_filters.append(filter)

                elif (operator := RangeOperator.get(key, None)):
                    if not isinstance(value, list):
                        raise ValueError(f"Incorrect input for BETWEEN operator: "
                                         f"value should be list ({value =})")
                    elif len(value) != 2:
                        raise ValueError(f"Incorrect input for BETWEEN operator: "
                                         f"value list should contain 2 values (min and max) ({value =})")
                    column_operator = getattr(db_column, operator.value)
                    filter = column_operator(*value, symmetric=True)
                    sqlalchemy_filters.append(filter)

                elif (operator := ListAppearanceOperator.get(key, None)):
                    if not isinstance(value, list):
                        raise ValueError(f"Incorrect syntax for BETWEEN operator: "
                                         f"value should be list ({key =} - {value =})")
                    column_operator = getattr(db_column, operator.value)
                    filter = column_operator(value)
                    sqlalchemy_filters.append(filter)
                else:
                    raise ValueError(f"Incorrect syntax in filter_kwargs: "
                                     f"expected to find operator for key but could not find one "
                                     f"({key =}  {value =})")
            else:
                # just a simple equation
                filter = getattr(self.hhb_model, key) == value
                sqlalchemy_filters.append(filter)

        return sqlalchemy_filters

    def get_result_single(self, row_id):
        """ Get a single result from the current query """
        row = one_or_none(self.query.filter(self.hhb_model.id == row_id))
        if not row:
            return {"errors": [f"{self.hhb_model.__name__} not found."]}, 404
        return {"data": self.post_process_data(row)}, 200

    def get_result_multiple(self, start=None, limit=None):
        """ Get multiple results from the current query """
        results = get_all(self.query)

        if start is not None and limit is not None:
            start = int(start)
            limit = int(limit)
            count = len(results)
            if limit < 1:
                return {"errors": [f"Limit cannot be below one."]}, 404
            if start < 1:
                return {"errors": [f"Start cannot be below one."]}, 404
            if count < start:
                return {'start': start, 'limit': limit, 'count': count, 'data': []}
            # make response
            obj = {'start': start, 'limit': limit, 'count': count}
            # make URLs
            # make previous url
            if start == 1:
                obj['previous'] = ''
            else:
                start_copy = max(1, start - limit)
                limit_copy = start - 1
                obj['previous'] = '?start=%d&limit=%d' % (
                    start_copy, limit_copy)
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
                self.query = self.query.options(
                    joinedload(getattr(self.hhb_model, relation['relation'])))

    def order_query(self, desc=False, sortingColumn="id"):
        if desc:
            self.query = self.query.order_by(
                self.hhb_model.__table__.c[sortingColumn].desc())
        else:
            self.query = self.query.order_by(
                self.hhb_model.__table__.c[sortingColumn])

    def post_process_data(self, row):
        result_dict = row2dict(row)
        for relation in self._exposed_many_relations:

            if not self.filtered_columns or relation['relation'] in self.filtered_columns:
                result_dict[relation["relation"]] = [getattr(item, relation["relation_property"]) for item in
                                                     getattr(row, relation["relation"])]
        for relation in self._exposed_one_relations:
            if not self.filtered_columns or relation['relation'] in self.filtered_columns:
                result_dict[relation["relation"]] = getattr(getattr(row, relation["relation"]),
                                                            relation["relation_property"])
        return result_dict
