from flask import request, abort, make_response
from core.utils import row2dict

class HHBQuery():
    hhb_model = None
    query = None

    def __init__(self, hhb_model):
        self.hhb_model = hhb_model
        self.query = self.hhb_model.query

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
            self.query = self.query.with_entities(*column_filter)

    def add_filter_ids(self):
        """ Add filter_ids filter based on the primary key of the hhb model """
        # Todo check if it is possible to reference the PK column rather than the "id" column
        filter_ids = request.args.get('filter_ids')
        if filter_ids:
            ids = []
            for raw_id in filter_ids.split(","):
                try:
                    ids.append(int(raw_id))
                except ValueError:
                    abort(make_response(
                        {"errors": [
                            f"Input for filter_ids is not correct, '{raw_id}' is not a number."
                        ]}, 400))
            self.query = self.query.filter(self.hhb_model.id.in_(ids))

    def get_result_single(self, row_id):
        """ Get a single result from the current query """
        row = self.query.filter(self.hhb_model.id==row_id).one_or_none()
        if not row:
            return {"errors": [f"{self.hhb_model.__name__} not found."]}, 404
        return {"data": row2dict(row)}, 200

    def get_result_multiple(self):
        """ Get multiple results from the current query """
        return {"data": [row2dict(row) for row in self.query.all()]}, 200
