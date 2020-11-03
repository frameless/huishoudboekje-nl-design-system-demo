""" Main app for core """
import os
from flask import Flask, Response
from core import database, config

db = database.db
from models import customer_statement_message


def create_app(config_name=os.getenv('APP_SETTINGS', 'core.config.DevelopmentConfig')):
    app = Flask(__name__)
    app.config.from_object(config_name)

    db.init_app(app)

    @app.route('/health')
    def health():
        return Response()

    # Views
    # routes = [
    #     {"path": "/gebruikers", "view": GebruikerView, "name": "gebruiker_view"},
    #     {"path": "/gebruikers/<object_id>", "view": GebruikerView, "name": "gebruiker_detail_view"},
    # ]
    # for route in routes:
    #     app.add_url_rule(
    #         route["path"],
    #         view_func=route["view"].as_view(route["name"]),
    #         strict_slashes=False
    #     )
    return app


if __name__ == '__main__':
    create_app().run()
