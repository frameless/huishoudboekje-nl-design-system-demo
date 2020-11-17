""" Main app for grootboek_service """
import os
from flask import Flask, Response
from core_service import database
from grootboek_service.views.grootboekrekeningen import GrootboekrekeningenView

db = database.db
from models import *


def create_app(config_name=os.getenv('APP_SETTINGS', 'grootboek_service.config.DevelopmentConfig')):
    app = Flask(__name__)
    app.config.from_object(config_name)

    db.init_app(app)

    @app.route('/health')
    def health():
        return Response()

    # Views
    routes = [
        {"path": "/grootboekrekeningen", "view": GrootboekrekeningenView,
         "name": "grootboekrekening_view"},
        {"path": "/grootboekrekeningen/<object_id>", "view": GrootboekrekeningenView,
         "name": "grootboekrekening_detail_view"}
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
