""" Main app for huishoudboekje_service """
import logging
import os
from flask import Flask, Response
from flask_migrate import Migrate

from huishoudboekje_service.views import (
    BurgerView,
    AfspraakView,
    RekeningView,
    RekeningBurgerView,
    RekeningAfdelingView,
    JournaalpostView,
    RubriekView,
    ConfiguratieView,
    OverschrijvingView,
    ExportView,
    HuishoudenView,
    AfdelingView,
)
from core_service import database

db = database.db


def create_app(config_name='huishoudboekje_service.config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_name)

    logging.basicConfig(
        format='%(asctime)s %(levelname)-8s %(message)s',
        level=app.config["LOG_LEVEL"],
        datefmt='%Y-%m-%d %H:%M:%S')
    logging.info(f"Starting {__name__} with {config_name}")

    db.init_app(app)
    migrate = Migrate(app, db)

    @app.route('/health')
    def health():
        return Response()

    # Views
    routes = [
        {"path": "/burgers", "view": BurgerView, "name": "burger_view"},
        {"path": "/burgers/<object_id>", "view": BurgerView, "name": "burger_detail_view"},
        {"path": "/burgers/<object_id>/rekeningen", "view": RekeningBurgerView,
         "name": "burger_rekeningen_view"},
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
        {"path": "/huishoudens", "view": HuishoudenView, "name": "huishouden_view"},
        {"path": "/huishoudens/<object_id>", "view": HuishoudenView, "name": "huishouden_detail_view"},
        {"path": "/afdelingen", "view": AfdelingView, "name": "afdeling_view"},
        {"path": "/afdelingen/<object_id>", "view": AfdelingView, "name": "afdeling_detail_view"},
        {"path": "/afdelingen/<object_id>/rekeningen", "view": RekeningAfdelingView,
         "name": "afdeling_rekeningen_view"},
    ]
    for route in routes:
        app.add_url_rule(
            route["path"],
            view_func=route["view"].as_view(route["name"]),
            strict_slashes=False
        )
    return app
