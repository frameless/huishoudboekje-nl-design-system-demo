""" Main app for huishoudboekje_service """
import os
from flask import Flask, Response
from huishoudboekje_service.views import (
    GebruikerView,
    OrganisatieView,
    AfspraakView,
    RekeningView,
    RekeningGebruikerView,
    RekeningOrganisatieView
)
from core_service import database
from huishoudboekje_service import config

db = database.db
from models import *

def create_app(config_name=os.getenv('APP_SETTINGS', 'huishoudboekje_service.config.DevelopmentConfig')):
    app = Flask(__name__)
    app.config.from_object(config_name)

    db.init_app(app)

    @app.route('/health')
    def health():
        return Response()

    # Views
    routes = [
        {"path": "/gebruikers", "view": GebruikerView, "name": "gebruiker_view"},
        {"path": "/gebruikers/<object_id>", "view": GebruikerView, "name": "gebruiker_detail_view"},
        {"path": "/gebruikers/<object_id>/rekeningen", "view": RekeningGebruikerView, "name": "gebruiker_rekeningen_view"},
        {"path": "/organisaties", "view": OrganisatieView, "name": "organisatie_view"},
        {"path": "/organisaties/<object_id>", "view": OrganisatieView, "name": "organisatie_detail_view"},
        {"path": "/organisaties/<object_id>/rekeningen", "view": RekeningOrganisatieView, "name": "organisatie_rekeningen_view"},
        {"path": "/afspraken", "view": AfspraakView, "name": "afspraak_view"},
        {"path": "/afspraken/<object_id>", "view": AfspraakView, "name": "afspraak_detail_view"},
        {"path": "/rekeningen", "view": RekeningView, "name": "rekening_view"},
        {"path": "/rekeningen/<object_id>", "view": RekeningView, "name": "rekening_detail_view"},
    ]
    for route in routes:
        app.add_url_rule(
            route["path"],
            view_func=route["view"].as_view(route["name"]),
            strict_slashes=False
        )
    return app

if __name__ == '__main__':
    create_app().run()
