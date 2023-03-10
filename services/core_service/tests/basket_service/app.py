import logging
import logging.config
import os

from flask import Flask, Response

from core_service import database
from tests.basket_service.views.basket_view import BasketView
from tests.basket_service.views.fruit_view import FruitView

db = database.db


def create_app(config_name='tests.basket_service.config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_name)

    db.init_app(app)
    logging.basicConfig(
        format='%(asctime)s %(levelname)-8s %(message)s',
        level=app.config["LOG_LEVEL"],
        datefmt='%Y-%m-%d %H:%M:%S')
    logging.info(f"Starting {__name__} with {config_name}")

    # Werkzeug has their own logger which outputs info level URL calls.
    # This can also cause parameters that are normally hidden to be logged
    logging.getLogger('werkzeug').setLevel(app.config["LOG_LEVEL"])

    @app.route('/health')
    def health():
        return Response()

    # Views
    routes = [
        {"path": "/baskets", "view": BasketView,
         "name": "basket_view"},
        {"path": "/baskets/<object_id>", "view": BasketView,
         "name": "basket_detail_view"},
        {"path": "/fruits", "view": FruitView,
         "name": "fruit_view"},
        {"path": "/fruits/<object_id>", "view": FruitView,
         "name": "fruit_detail_view"},
    ]
    for route in routes:
        app.add_url_rule(
            route["path"],
            view_func=route["view"].as_view(route["name"]),
            strict_slashes=False
        )
    return app
