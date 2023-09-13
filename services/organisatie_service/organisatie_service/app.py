""" Main app for organisatie_service """
from models import *
import logging

from flask import Flask, Response
from flask_migrate import Migrate

from organisatie_service.views.organisaties import OrganisatieView
from organisatie_service.views.organisatie_rekeningen import OrganisatieRekeningenView
from organisatie_service.views.afdelingen import AfdelingView
from core_service import database
from core_service.sqlalchemy_statsd_metrics import add_sqlalchemy_statsd_metrics

db = database.db


def create_app(config_name='organisatie_service.config.Config'):
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

    add_sqlalchemy_statsd_metrics(app)

    @app.route('/health')
    def health():
        return Response()

    routes = [
        {"path": "/organisaties", "view": OrganisatieView, "name": "organisatie_view"},
        {"path": "/organisaties/<object_id>", "view": OrganisatieView,
            "name": "organisatie_detail_view"},
        {"path": "/organisaties/rekeningen", "view": OrganisatieRekeningenView, "name": "organisatie_rekeningen_view"},
        {"path": "/afdelingen", "view": AfdelingView, "name": "afdeling_view"},
        {"path": "/afdelingen/<object_id>", "view": AfdelingView,
            "name": "afdeling_detail_view"},
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
