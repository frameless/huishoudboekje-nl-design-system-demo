""" Main app for core """
import os
from flask import Flask, Response
# import views
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
    # ...

    return app

if __name__ == '__main__':
    create_app().run()