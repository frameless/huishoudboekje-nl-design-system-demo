""" Main app for grootboek_service """
from models import *
import logging
from flask import Flask, Response
from flask_migrate import Migrate
from core_service import database
from grootboek_service.views.grootboekrekeningen import GrootboekrekeningenView
from core_service.statsd_metrics import add_statsd_metrics

db = database.db


def create_app(config_name='grootboek_service.config.Config'):
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

    add_statsd_metrics(app)

    @app.route('/health')
    def health():
        return Response()

    # Views
    routes = [
        {"path": "/grootboekrekeningen", "view": GrootboekrekeningenView,
         "name": "grootboekrekening_view"},
        {"path": "/grootboekrekeningen/<object_id>", "view": GrootboekrekeningenView,
         "name": "grootboekrekening_detail_view"}
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
