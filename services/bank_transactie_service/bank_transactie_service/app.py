""" Main app for bank_transactie_service """
import os
from flask import Flask, Response
from core_service import database
from bank_transactie_service import config
from bank_transactie_service.views.customer_statement_message import CustomerStatementMessageView
from bank_transactie_service.views.bank_transaction import BankTransactionView

db = database.db
from models import *


def create_app(config_name=os.getenv('APP_SETTINGS', 'bank_transactie_service.config.DevelopmentConfig')):
    app = Flask(__name__)
    app.config.from_object(config_name)

    db.init_app(app)

    @app.route('/health')
    def health():
        return Response()

    # Views
    routes = [
        {"path": "/customerstatementmessages", "view": CustomerStatementMessageView,
         "name": "customer_statement_message_view"},
        {"path": "/customerstatementmessages/<object_id>", "view": CustomerStatementMessageView,
         "name": "customer_statement_message_detail_view"},
        {"path": "/banktransaction", "view": BankTransactionView,
         "name": "banktransaction_view"},
        {"path": "/banktransaction/<object_id>", "view": BankTransactionView,
         "name": "banktransaction_detail_view"},
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
