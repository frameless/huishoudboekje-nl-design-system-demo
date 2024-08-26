""" Main app for rapportage_service """
import logging
import logging.config

from flask import Flask, Response
from flask_injector import FlaskInjector
from rapportage_service.dependencies import configure
from rapportage_service.views.RapportageView import BurgerRapportageView
from rapportage_service.views.SaldoView import SaldoView
from rapportage_service.views.OverviewView import OverviewView
from rapportage_service.views.TransactionView import TransactionView
from rapportage_service.views.CitizenView import CitizenView
from core_service.statsd_metrics import add_statsd_metrics


def create_app(config_name='rapportage_service.config.Config', dependency_injection_configuration=configure):
    app = Flask(__name__)
    app.config.from_object(config_name)

    logging.basicConfig(
        format='%(asctime)s %(levelname)-8s %(message)s',
        level=app.config["LOG_LEVEL"],
        datefmt='%Y-%m-%d %H:%M:%S')
    # logging.config.dictConfig(
    #     {
    #         "version": 1,
    #         "incremental": True,
    #         "loggers": {"sqlalchemy.engine": {"level": app.config["LOG_LEVEL"]}},
    #     }
    # )
    logging.info(f"Starting {__name__} with {config_name}")

    # Werkzeug has their own logger which outputs info level URL calls.
    # This can also cause parameters that are normally hidden to be logged
    logging.getLogger('werkzeug').setLevel("WARNING")
    
    #Pika logs very much so default only warning so the logs stay readable
    logging.getLogger("pika").setLevel(logging.WARNING)

    add_statsd_metrics(app)

    @app.route('/health')
    def health():
        return Response()

    # Views
    routes = [
        {"path": "/rapportage", "view": BurgerRapportageView,
            "name": "rapportage_burger"},
        {"path": "/saldo", "view": SaldoView,
            "name": "saldo"},
        {"path": "/overzicht", "view": OverviewView,
            "name": "overzicht"},
        {"path": "/transactions", "view": TransactionView,
            "name": "transactions"},
        {"path": "/citizens", "view": CitizenView,
            "name": "citizens"}
    ]
    for route in routes:
        app.add_url_rule(
            route["path"],
            view_func=route["view"].as_view(route["name"]),
            strict_slashes=False
        )

    app.before_first_request_funcs = []  # added this to make test work

    # Initialize Flask-Injector. This needs to be run after you attached all
    # views, handlers, context processors and template globals.
    FlaskInjector(app=app, modules=[dependency_injection_configuration])
    return app


if __name__ == '__main__':
    create_app().run()
