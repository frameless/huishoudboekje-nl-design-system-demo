""" MethodView for /exports/paged path """
from core_service.utils import valid_date
from core_service.views.basic_view.basic_filter_view import BasicFilterView
from models.export import Export
from sqlalchemy import  func, and_


class ExportsFilterView(BasicFilterView):
    """ Methods for /export/filter path """

    model = "exports"

    def set_basic_query(self):
        self.query = Export.query.order_by(Export.timestamp.desc())

    def add_filter_options(self, filter_options, query):
        """ No filters """
        return query