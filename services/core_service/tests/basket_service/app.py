import logging
import logging.config
import os

from flask import Flask, Response

from core_service import database
from tests.basket_service.views.basket_view import BasketView
from tests.basket_service.views.fruit_view import FruitView

db = database.db


def create_app(config_name=os.getenv('APP_SETTINGS', 'tests.basket_service.config.TestingConfig')):
    app = Flask(__name__)
    app.config.from_object(config_name)

    db.init_app(app)
    logging.basicConfig(
        level=app.config["LOG_LEVEL"],
    )
    logging.info(f"Starting {__name__} with {config_name}")

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
