""" Main app for organisatie_service """
import os
from flask import Flask, Response
from organisatie_service.views.organisaties import OrganisatieView
from core_service import database
from organisatie_service import config
db = database.db
from models import *

def create_app(config_name=os.getenv('APP_SETTINGS', 'organisatie_service.config.DevelopmentConfig')):
    app = Flask(__name__)
    app.config.from_object(config_name)

    db.init_app(app)

    @app.route('/health')
    def health():
        return Response()

    # Views
    app.add_url_rule(
        '/organisaties',
        view_func=OrganisatieView.as_view('organisatie_view'),
        strict_slashes=False
    )
    app.add_url_rule(
        '/organisaties/<kvk_nummer>',
        view_func=OrganisatieView.as_view('organisatie_detail_view'),
        strict_slashes=False
    )

    return app

if __name__ == '__main__':
    create_app().run()
