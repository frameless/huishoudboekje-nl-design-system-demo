""" Main app for core """
import os
from flask import Flask, Response
from core.views.organisaties import OrganisatieView
from core import database, config
db = database.db
from models import *

def create_app(config_name=os.getenv('APP_SETTINGS', 'core.config.DevelopmentConfig')):
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
