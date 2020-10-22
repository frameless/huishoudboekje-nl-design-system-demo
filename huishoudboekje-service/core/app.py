""" Main app for core """
import os
from flask import Flask, Response
from core.views import (
    GebruikerView,
    GebruikerDetailView,
    OrganisatieView,
    AfspraakView,
    RekeningView
)
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
        '/gebruikers',
        view_func=GebruikerView.as_view('gebruiker_view'),
        strict_slashes=False
    )
    app.add_url_rule(
        '/gebruikers/<gebruiker_id>',
        view_func=GebruikerDetailView.as_view('gebruiker_detail_view'),
        strict_slashes=False
    )
    app.add_url_rule(
        '/organisaties',
        view_func=OrganisatieView.as_view('organisatie_view'),
        strict_slashes=False
    )
    app.add_url_rule(
        '/organisaties/<organisatie_id>',
        view_func=OrganisatieView.as_view('organisatie_detail_view'),
        strict_slashes=False
    )
    app.add_url_rule(
        '/afspraken',
        view_func=AfspraakView.as_view('afspraak_view'),
        strict_slashes=False
    )
    app.add_url_rule(
        '/afspraken/<afspraak_id>',
        view_func=AfspraakView.as_view('afspraak_detail_view'),
        strict_slashes=False
    )
    app.add_url_rule(
        '/rekeningen',
        view_func=RekeningView.as_view('rekening_view'),
        strict_slashes=False
    )
    return app

if __name__ == '__main__':
    create_app().run()
