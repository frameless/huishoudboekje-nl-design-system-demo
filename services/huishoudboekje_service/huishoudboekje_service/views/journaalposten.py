""" MethodView for /organisaties/<organisatie_id>/ path """
from flask import request, abort, make_response
from models import Journaalpost
from core_service.views.hhb_view import HHBView


class JournaalpostView(HHBView):
    """ Methods for /organisaties/ path """

    hhb_model = Journaalpost
    validation_data = {
        "definitions": {
            "one_or_more_journaalposten": {
                "anyOf": [
                    {
                        "type": "object",
                        "$ref": "#/definitions/journaalpost"
                    },
                    {
                        "type": "array",
                        "items": {"$ref": "#/definitions/journaalpost"}
                    }
                ]
            },
            "journaalpost": {
                "type": "object",
                "required": [
                    "grootboekrekening_id",
                    "transaction_id",
                    "is_automatisch_geboekt"
                ],
                "properties": {
                    "afspraak_id": {
                        "type": "integer"
                    },
                    "grootboekrekening_id": {
                        "type": "string"
                    },
                    "transaction_id": {
                        "type": "integer"
                    },
                    "is_automatisch_geboekt": {
                        "type": "boolean"
                    }
                }
            }
        },
        "$ref": "#/definitions/one_or_more_journaalposten"
    }

    def extend_get(self, **kwargs):
        """ Extend the get function with extra filter """
        self.add_filter_transactions()
        self.add_filter_afspraken()

    def add_filter_transactions(self):
        filter_transactions = request.args.get('filter_transactions')
        if filter_transactions:
            self.hhb_query.query = self.hhb_query.query.filter(
                Journaalpost.transaction_id.in_(filter_transactions.split(","))
            )

    def add_filter_afspraken(self):
        filter_afspraken = request.args.get('filter_afspraken')
        if filter_afspraken:
            self.hhb_query.query = self.hhb_query.query.filter(
                Journaalpost.afspraak_id.in_(filter_afspraken.split(","))
            )
