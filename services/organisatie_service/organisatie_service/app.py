""" Main app for organisatie_service """
import os
import logging
from flask import Flask, Response
from organisatie_service.views.organisaties import OrganisatieView
from organisatie_service.views.afdelingen import AfdelingView
from core_service import database
from organisatie_service import config
db = database.db
from models import *

def create_app(config_name=os.getenv('APP_SETTINGS', 'organisatie_service.config.DevelopmentConfig')):
    app = Flask(__name__)
    app.config.from_object(config_name)

    logging.basicConfig(
        format='%(asctime)s %(levelname)-8s %(message)s',
        level=app.config["LOG_LEVEL"],
        datefmt='%Y-%m-%d %H:%M:%S')
    logging.info(f"Starting {__name__} with {config_name}")
    
    db.init_app(app)

    @app.route('/health')
    def health():
        return Response()

    routes = [
        {"path": "/organisaties", "view": OrganisatieView, "name": "organisatie_view"},
        {"path": "/organisaties/<object_id>", "view": OrganisatieView, "name": "organisatie_detail_view"},
        {"path": "/afdelingen", "view": AfdelingView,"name": "afdeling_view"},
        {"path": "/afdelingen/<object_id>", "view": AfdelingView, "name": "afdeling_detail_view"},
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
