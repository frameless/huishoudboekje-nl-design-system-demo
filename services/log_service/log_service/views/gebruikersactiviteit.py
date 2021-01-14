""" MethodView for /gebruikersactiviteiten/ path """
from flask import request, abort, make_response
from models.gebruikersactiviteit import GebruikersActiviteit
from core_service.views.hhb_view import HHBView


class GebruikersActiviteitView(HHBView):
    """ Methods for /gebruikersactiviteiten/(<gebruikersactiviteit_id>) path """
    hhb_model = GebruikersActiviteit
    validation_data = {
        "type": "object",
        "properties": {
            "customer_statement_message_id": {
                "type": "integer",
            },
            "statement_line": {
                "type": "string",
            },
            "information_to_account_owner": {
                "type": "string",
            }
        },
        "required": ["customer_statement_message_id"]
    }
