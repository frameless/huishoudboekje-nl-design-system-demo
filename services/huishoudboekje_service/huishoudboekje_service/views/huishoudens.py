""" MethodView for /huishoudens/ path """

from core_service.views.hhb_view import HHBView
from models.huishouden import Huishouden


class HuishoudenView(HHBView):
    """Methods for /huishoudens/(<huishouden_id>) path"""

    hhb_model = Huishouden
    validation_data = {"type": "object", "properties": {}, "required": []}

    def extend_get(self, **kwargs):
        self.add_relations()

    def add_relations(self, **kwargs):
        self.hhb_query.expose_many_relation("burgers", "id")
