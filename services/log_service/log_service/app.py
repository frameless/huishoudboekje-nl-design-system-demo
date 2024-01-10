""" Main app for log_service """
import logging
import logging.config

from flask import Flask, Response
from flask_migrate import Migrate

from core_service import database
from log_service.views.gebruikersactiviteit import GebruikersActiviteitView
from core_service.statsd_metrics import add_statsd_metrics

db = database.db


def create_app(
    config_name="log_service.config.Config"
):
    app = Flask(__name__)
    app.config.from_object(config_name)

    db.init_app(app)
    Migrate(app, db)

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

    add_statsd_metrics(app)

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
