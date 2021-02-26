""" Main app for huishoudboekje_service """
import logging
import os
from flask import Flask, Response

from huishoudboekje_service.views import (
    BurgerView,
    OrganisatieView,
    AfspraakView,
    RekeningView,
    RekeningBurgerView,
    RekeningOrganisatieView,
    JournaalpostView,
    RubriekView,
    ConfiguratieView,
    OverschrijvingView,
    ExportView,
)
from core_service import database

db = database.db


def create_app(config_name=os.getenv('APP_SETTINGS', 'huishoudboekje_service.config.DevelopmentConfig')):
    app = Flask(__name__)
    app.config.from_object(config_name)

    logging.basicConfig(level=app.config["LOG_LEVEL"])
    logging.info(f"Starting {__name__} with {config_name}")

    db.init_app(app)

    @app.route('/health')
    def health():
        return Response()

    # Views
    routes = [
        {"path": "/burgers", "view": BurgerView, "name": "burger_view"},
        {"path": "/burgers/<object_id>", "view": BurgerView, "name": "burger_detail_view"},
        {"path": "/burgers/<object_id>/rekeningen", "view": RekeningBurgerView,
         "name": "burger_rekeningen_view"},
        {"path": "/organisaties", "view": OrganisatieView, "name": "organisatie_view"},
        {"path": "/organisaties/<object_id>", "view": OrganisatieView, "name": "organisatie_detail_view"},
        {"path": "/organisaties/<object_id>/rekeningen", "view": RekeningOrganisatieView,
         "name": "organisatie_rekeningen_view"},
        {"path": "/afspraken", "view": AfspraakView, "name": "afspraak_view"},
        {"path": "/afspraken/<object_id>", "view": AfspraakView, "name": "afspraak_detail_view"},
        {"path": "/rekeningen", "view": RekeningView, "name": "rekening_view"},
        {"path": "/rekeningen/<object_id>", "view": RekeningView, "name": "rekening_detail_view"},
        {"path": "/journaalposten", "view": JournaalpostView, "name": "journaalpost_view"},
        {"path": "/journaalposten/<object_id>", "view": JournaalpostView, "name": "journaalpost_detail_view"},
        {"path": "/rubrieken", "view": RubriekView, "name": "rubriek_view"},
        {"path": "/rubrieken/<object_id>", "view": RubriekView, "name": "rubriek_detail_view"},
        {"path": "/configuratie", "view": ConfiguratieView, "name": "configuratie_view"},
        {"path": "/configuratie/<object_id>", "view": ConfiguratieView, "name": "configuratie_detail_view"},
        {"path": "/overschrijvingen", "view": OverschrijvingView, "name": "overschrijving_view"},
        {"path": "/overschrijvingen/<object_id>", "view": OverschrijvingView, "name": "overschrijving_detail_view"},
        {"path": "/export", "view": ExportView, "name": "export_view"},
        {"path": "/export/<object_id>", "view": ExportView, "name": "export_detail_view"},
    ]
    for route in routes:
        app.add_url_rule(
            route["path"],
            view_func=route["view"].as_view(route["name"]),
            strict_slashes=False
        )
    return app
