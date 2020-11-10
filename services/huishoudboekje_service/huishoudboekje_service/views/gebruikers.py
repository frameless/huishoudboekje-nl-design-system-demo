""" MethodView for /gebruiker/ path """
from models.gebruiker import Gebruiker
from core_service.views.hhb_view import HHBView


class GebruikerView(HHBView):
    """ Methods for /gebruiker/(<gebruiker_id>) path """
    hhb_model = Gebruiker
    validation_data = {
        "type": "object",
        "properties": {
            "telefoonnummer": {
                "type": "string",
            },
            "email": {
                "type": "string",
            },
            "geboortedatum": {
                "type": "string",
                "pattern": "^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$"
            },
            "iban": {
                "type": "string",
            },
            "voornamen": {
                "type": "string",
            },
            "voorletters": {
                "type": "string",
            },
            "achternaam": {
                "type": "string",
            },
            "straatnaam": {
                "type": "string",
            },
            "huisnummer": {
                "type": "string",
            },
            "postcode": {
                "type": "string",
            },
            "plaatsnaam": {
                "type": "string",
            }
        },
        "required": []
    }
