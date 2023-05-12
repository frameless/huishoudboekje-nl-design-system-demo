""" MethodView for /customerstatementmessages/ path """
import logging
from flask import request, abort, make_response
from sqlalchemy import func
from sqlalchemy.orm.exc import NoResultFound

from models.bank_transaction import BankTransaction
from core_service.views.hhb_view import HHBView


class BankTransactionView(HHBView):
    """ Methods for /banktransactions/(<banktransaction_id>) path """
    hhb_model = BankTransaction
    validation_data = {
        "definitions": {
            "one_or_more_banktransactions": {
                "anyOf": [
                    {
                        "type": "object",
                        "$ref": "#/definitions/banktransaction"
                    },
                    {
                        "type": "array",
                        "items": {"$ref": "#/definitions/banktransaction"}
                    }
                ]
            },
            "banktransaction": {
                "type": "object",
                "required": ["customer_statement_message_id"],
                "properties": {
                    "customer_statement_message_id": {
                        "type": "integer",
                    },
                    "statement_line": {
                        "type": "string",
                    },
                    "information_to_account_owner": {
                        "type": "string",
                    },
                    "is_geboekt": {
                        "oneOf": [
                            {"type": "null"},
                            {"type": "boolean"},
                        ],
                    },
                },
            }
        },
        "$ref": "#/definitions/one_or_more_banktransactions"
    }

    def extend_get(self, **kwargs):
        """ Extend the get function with a filter on csm id's """
        self.add_filter_filter_customer_statement_message()
        self.add_filter_filter_is_geboekt()

    def add_filter_filter_customer_statement_message(self):
        """ Add filter_csms filter """

        def add_filter(csms):
            self.hhb_query.query = self.hhb_query.query.filter(
                self.hhb_model.customer_statement_message_id.in_(csms))

        BankTransactionView.filter_in_string('filter_csms', add_filter)

    def add_filter_filter_is_geboekt(self):
        """ Add filter_is_geboekt filter """
        def to_bool(v):
            return str(v).lower() in ("yes", "true", "t", "1")
        if (filter_is_geboekt := request.args.get('filter_is_geboekt', type=to_bool)) is not None:
            self.hhb_query.query = self.hhb_query.query.filter(
                func.coalesce(self.hhb_model.is_geboekt, False) == filter_is_geboekt)

    def put(self, **kwargs):
        ids = []
        items = []
        if (isinstance(request.json, list)):
            for item in request.json:
                try:
                    id = item.get("id")
                    ids.append(id)
                    items.append(item)
                except NoResultFound:
                    return {}, 404

        else:
            try:
                ids.append(request.json.get("id"))
                items.append(request.json)
            except NoResultFound:
                return {}, 404

        index = 0
        for id in ids:
            self.__update_bank_transaction(id, items[index])
            index += 1
        self.hhb_object.commit_changes()

        return {}, 201

    def __update_bank_transaction(self, id, values):
        result = BankTransaction.query\
            .filter(BankTransaction.id == id)\
            .update(values, synchronize_session='evaluate')

        return result
