""" MethodView for /organisaties/<organisatie_id>/ path """
from flask import request
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
                    "transaction_uuid",
                    "is_automatisch_geboekt"
                ],
                "properties": {
                    "afspraak_id": {
                        "type": "integer"
                    },
                    "grootboekrekening_id": {
                        "type": "string"
                    },
                    "transaction_uuid": {
                        "type": "string"
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
        self.add_filter_grootboekrekeningen()
        self.add_filter_filter_uuids()

    def add_filter_transactions(self):
        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(
                Journaalpost.transaction_uuid.in_(ids)
            )

        JournaalpostView.filter_in_string('filter_transactions', add_filter)

    def add_filter_afspraken(self):
        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(
                Journaalpost.afspraak_id.in_(ids)
            )

        JournaalpostView.filter_in_string('filter_afspraken', add_filter)

    def add_filter_grootboekrekeningen(self):
        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(
                Journaalpost.grootboekrekening_id.in_(ids)
            )

        JournaalpostView.filter_in_string(
            'filter_grootboekrekeningen', add_filter)
        
    def add_filter_filter_uuids(self):
        """ Add filter_uuid filter based on the uuid of journaalpost """

        def add_filter(uuids):
            self.hhb_query.query = self.hhb_query.query.filter(
                Journaalpost.uuid.in_(uuids)
            )

        JournaalpostView.filter_in_string('filter_uuid', add_filter)
