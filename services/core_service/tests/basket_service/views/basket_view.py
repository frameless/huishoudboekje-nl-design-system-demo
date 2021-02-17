from flask import request

from core_service.views.hhb_view import HHBView
from tests.basket_service.models.basket import Basket


class BasketView(HHBView):
    hhb_model = Basket
    validation_data = {
        "definitions": {
            "one_or_more_baskets": {
                "anyOf": [
                    {
                        "type": "object",
                        "$ref": "#/definitions/basket"
                    },
                    {
                        "type": "array",
                        "items": {"$ref": "#/definitions/basket"}
                    }
                ]
            },
            "basket": {
                "type": "object",
                "required": [
                    "name",
                ],
                "properties": {
                    "name": {
                        "type": "string"
                    },
                }
            }
        },
        "$ref": "#/definitions/one_or_more_baskets"
    }


    def extend_get(self, **kwargs):
        self.hhb_query.expose_many_relation("fruits", "id")

    def add_filter_names(self):
        if filter_names := request.args.get('filter_names'):
            self.hhb_query.query = self.hhb_query.query.filter(
                Basket.name.in_(filter_names.split(","))
            )
