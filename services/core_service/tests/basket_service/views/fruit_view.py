from flask import make_response, request, abort

from core_service.views.hhb_view import HHBView
from tests.basket_service.models.fruit import Fruit


class FruitView(HHBView):
    hhb_model = Fruit
    validation_data = {
        "definitions": {
            "one_or_more_fruits": {
                "anyOf": [
                    {
                        "type": "object",
                        "$ref": "#/definitions/fruit"
                    },
                    {
                        "type": "array",
                        "items": {"$ref": "#/definitions/fruit"}
                    }
                ]
            },
            "fruit": {
                "type": "object",
                "required": [
                    "basket_id",
                ],
                "properties": {
                    "basket_id": {
                        "type": "integer"
                    },
                    "name": {
                        "type": "string"
                    },
                }
            }
        },
        "$ref": "#/definitions/one_or_more_fruits"
    }

    def extend_get(self, **kwargs):
        """ Extend the get function with filters """
        self.add_filter_filter_basket()
        self.add_filter_names()

    def add_filter_filter_basket(self):
        """ Add filter_baskets filter """
        filter_baskets = request.args.get('filter_baskets')
        if filter_baskets:
            baskets = []
            for raw_id in filter_baskets.split(","):
                try:
                    baskets.append(int(raw_id))
                except ValueError:
                    abort(make_response(
                        {"errors": [f"Input for filter_baskets is not correct, '{raw_id}' is not a number."]}, 400))
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.basket_id.in_(baskets))

    def add_filter_names(self):
        if filter_names := request.args.get('filter_names'):
            self.hhb_query.query = self.hhb_query.query.filter(
                Fruit.name.in_(filter_names.split(","))
            )
