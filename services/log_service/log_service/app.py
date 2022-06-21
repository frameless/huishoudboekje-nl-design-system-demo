""" Main app for log_service """
import logging
import logging.config
import os

from flask import Flask, Response

from core_service import database
from log_service.views.gebruikersactiviteit import GebruikersActiviteitView

db = database.db


def create_app(
    config_name=os.getenv("APP_SETTINGS", "log_service.config.DevelopmentConfig")
):
    app = Flask(__name__)
    app.config.from_object(config_name)

    db.init_app(app)

    logging.basicConfig(
        format='%(asctime)s %(levelname)-8s %(message)s',
        level=app.config["LOG_LEVEL"],
        datefmt='%Y-%m-%d %H:%M:%S')
    if "DEVELOPMENT" in app.config and app.config["DEVELOPMENT"]:
        logging.config.dictConfig(
            {
                "version": 1,
                "incremental": True,
                "loggers": {"sqlalchemy.engine": {"level": "DEBUG"}},
            }
        )
    logging.info(f"Starting {__name__} with {config_name}")

    @app.route("/health")
    def health():
        return Response()

    # Views
    routes = [
        {
            "path": "/gebruikersactiviteiten",
            "view": GebruikersActiviteitView,
            "name": "gebruikersactiviteit_view",
        },
        {
            "path": "/gebruikersactiviteiten/<object_id>",
            "view": GebruikersActiviteitView,
            "name": "gebruikersactiviteit_detail_view",
        },
    ]
    for route in routes:
        app.add_url_rule(
            route["path"],
            view_func=route["view"].as_view(route["name"]),
            strict_slashes=False,
        )

    return app


if __name__ == "__main__":
    create_app().run()
