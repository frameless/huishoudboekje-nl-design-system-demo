""" Main app for rapportage_service """
import logging
import logging.config

from flask import Flask, Response
from rapportage_service.views.RapportageView import RapportageView

def create_app(config_name='rapportage_service.config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_name)

    logging.basicConfig(
        format='%(asctime)s %(levelname)-8s %(message)s',
        level=app.config["LOG_LEVEL"],
        datefmt='%Y-%m-%d %H:%M:%S')
    logging.config.dictConfig(
        {
            "version": 1,
            "incremental": True,
            "loggers": {"sqlalchemy.engine": {"level": app.config["LOG_LEVEL"]}},
        }
    )
    logging.info(f"Starting {__name__} with {config_name}")

    @app.route('/health')
    def health():
        return Response()

    # Views
    routes = [
        {"path": "/rapportage/<burger_id>", "view": RapportageView,
         "name": "rapportage_burger"}
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
