""" Main app for log_service """
import os
from flask import Flask, Response
from core_service import database
from log_service import config
from log_service.views.gebruikersactiviteit import GebruikersActiviteitView
import logging

db = database.db
from models import gebruikersactiviteit


def create_app(config_name=os.getenv('APP_SETTINGS', 'log_service.config.DevelopmentConfig')):
    app = Flask(__name__)
    app.config.from_object(config_name)

    db.init_app(app)

    logging.basicConfig(level=app.config["LOG_LEVEL"], )
    logging.info(f"Starting {__name__} with {config_name}")

    @app.route('/health')
    def health():
        return Response()

    # Views
    routes = [
        {"path": "/gebruikersactiviteiten", "view": GebruikersActiviteitView,
         "name": "gebruikersactiviteit_view"},
        {"path": "/gebruikersactiviteiten/<object_id>", "view": GebruikersActiviteitView,
         "name": "gebruikersactiviteit_detail_view"},
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
