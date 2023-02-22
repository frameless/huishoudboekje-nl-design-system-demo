""" Main app for rapportage_service """
import logging
import logging.config

from flask import Flask, Response

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

    return app


if __name__ == '__main__':
    create_app().run()
