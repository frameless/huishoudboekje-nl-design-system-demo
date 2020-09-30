""" Main app for gebruikers_service """
import os
from flask import Flask
from gebruikers_service.views import (
    GebruikerView,
    GebruikerDetailView,
    BurgerView
)
from hhb_services import database
db = database.db
from hhb_models import *

def create_app(test_config=None):
    app = Flask(__name__)
    if test_config:
        app.config.from_object(test_config)
    else:
        app.config.from_object(os.environ['APP_SETTINGS'])

    db.init_app(app)

    # Views
    app.add_url_rule(
        '/gebruikers/',
        view_func=GebruikerView.as_view('gebruiker_view')
    )
    app.add_url_rule(
        '/gebruikers/<gebruiker_id>',
        view_func=GebruikerDetailView.as_view('gebruiker_detail_view')
    )
    app.add_url_rule(
        '/gebruikers/<gebruiker_id>/burger/',
        view_func=BurgerView.as_view('burger_view')
    )
    return app
