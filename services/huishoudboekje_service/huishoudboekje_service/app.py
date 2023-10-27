""" Main app for huishoudboekje_service """
import logging
from flask import Flask, Response
from flask_migrate import Migrate
from core_service.statsd_metrics import add_statsd_metrics
from core_service.seed import seed_database_with_test_data


from huishoudboekje_service.views import (
    BurgerView,
    AfspraakView,
    RekeningView,
    RekeningBurgerView,
    RekeningAfdelingView,
    JournaalpostView,
    JournaalpostRubriekView,
    RubriekView,
    ConfiguratieView,
    OverschrijvingView,
    ExportView,
    HuishoudenView,
    AfdelingView,
    BurgerTransactiesView,
    SaldoView,
    AfsprakenFilterView,
    JournaalpostenFilterView,
    BurgerTransactieIdsView
)
from core_service import database
from core_service.seed import seed_database_with_test_data

db = database.db


def FilterOutUrlLogging(record):
    return False


def create_app(config_name='huishoudboekje_service.config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_name)
    logging.basicConfig(
        format='%(asctime)s %(levelname)-8s %(message)s',
        level=app.config["LOG_LEVEL"],
        datefmt='%Y-%m-%d %H:%M:%S')
    logging.info(f"Starting {__name__} with {config_name}")

    # Werkzeug has their own logger which outputs info level URL calls.
    # This can also cause parameters that are normally hidden to be logged
    logging.getLogger('werkzeug').setLevel(app.config["LOG_LEVEL"])

    db.init_app(app)
    Migrate(app, db)

    @app.cli.command("seed-db-with-test-data")
    def seed_database():
        if app.config["SEED_TESTDATA"]:
            seed_database_with_test_data('huishoudboekje.sql', app.config["SQLALCHEMY_DATABASE_URI"])
        else:
            logging.warning("Did not seed the db with test data, make sure to set the SEED_TESTDATA env variable")

    add_statsd_metrics(app)

    @app.route('/health')
    def health():
        return Response()

    # Views
    routes = [
        {"path": "/burgers", "view": BurgerView, "name": "burger_view"},
        {"path": "/burgers/<object_id>", "view": BurgerView,
            "name": "burger_detail_view"},
        {"path": "/burgers/<object_id>/rekeningen", "view": RekeningBurgerView,
            "name": "burger_rekeningen_view"},
        {"path": "/burgers/transacties",
            "view": BurgerTransactiesView, "name": "burger_transacties"},
        {"path": "/burgers/transacties/ids",
            "view": BurgerTransactieIdsView, "name": "burger_transactie_ids"},
        {"path": "/afspraken", "view": AfspraakView, "name": "afspraak_view"},
        {"path": "/afspraken/filter", "view": AfsprakenFilterView, "name": "afspraak_filter_view"},
        {"path": "/afspraken/<object_id>", "view": AfspraakView,
            "name": "afspraak_detail_view"},
        {"path": "/rekeningen", "view": RekeningView, "name": "rekening_view"},
        {"path": "/rekeningen/<object_id>", "view": RekeningView,
            "name": "rekening_detail_view"},
        {"path": "/journaalposten", "view": JournaalpostView,
            "name": "journaalpost_view"},
        {"path": "/transacties_journaalpost_rubriek",
            "view": JournaalpostRubriekView, "name": "journaalpost_rubriek_view"},
        {"path": "/journaalposten/<object_id>", "view": JournaalpostView,
            "name": "journaalpost_detail_view"},
        {"path": "/journaalposten/filter", "view": JournaalpostenFilterView,
            "name": "journaalpost_filter_view"},
        {"path": "/rubrieken", "view": RubriekView, "name": "rubriek_view"},
        {"path": "/rubrieken/<object_id>", "view": RubriekView,
            "name": "rubriek_detail_view"},
        {"path": "/configuratie", "view": ConfiguratieView,
            "name": "configuratie_view"},
        {"path": "/configuratie/<object_id>", "view": ConfiguratieView,
            "name": "configuratie_detail_view"},
        {"path": "/overschrijvingen", "view": OverschrijvingView,
            "name": "overschrijving_view"},
        {"path": "/overschrijvingen/<object_id>", "view": OverschrijvingView,
            "name": "overschrijving_detail_view"},
        {"path": "/export", "view": ExportView, "name": "export_view"},
        {"path": "/export/<object_id>", "view": ExportView,
            "name": "export_detail_view"},
        {"path": "/huishoudens", "view": HuishoudenView, "name": "huishouden_view"},
        {"path": "/huishoudens/<object_id>", "view": HuishoudenView,
            "name": "huishouden_detail_view"},
        {"path": "/afdelingen", "view": AfdelingView, "name": "afdeling_view"},
        {"path": "/afdelingen/<object_id>", "view": AfdelingView,
            "name": "afdeling_detail_view"},
        {"path": "/afdelingen/<object_id>/rekeningen", "view": RekeningAfdelingView,
            "name": "afdeling_rekeningen_view"},
        {"path": "/saldo", "view": SaldoView, "name": "saldo_view"}
    ]
    for route in routes:
        app.add_url_rule(
            route["path"],
            view_func=route["view"].as_view(route["name"]),
            strict_slashes=False
        )
    return app
