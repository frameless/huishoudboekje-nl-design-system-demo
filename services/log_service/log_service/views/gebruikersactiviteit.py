""" MethodView for /gebruikersactiviteiten/ path """

from core_service.views.hhb_view import HHBView

from models.gebruikersactiviteit import GebruikersActiviteit


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
