""" Main app for core """
import os
from flask import Flask, Response
from core.views import (
    GebruikerView,
    GebruikerDetailView,
    BurgerView
)
from database import database, config
db = database.db
from models import *

def create_app(config_name=os.getenv('APP_SETTINGS', 'database.config.DevelopmentConfig')):
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
        '/gebruikers/<gebruiker_id>/burger',
        view_func=BurgerView.as_view('burger_view'),
        strict_slashes=False
    )
    return app

if __name__ == '__main__':
    create_app(config.DevelopmentConfig).run()
