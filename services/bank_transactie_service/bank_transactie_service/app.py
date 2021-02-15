""" Main app for bank_transactie_service """
import logging
import logging.config
import os

from flask import Flask, Response

from bank_transactie_service.views.bank_transaction import BankTransactionView
from bank_transactie_service.views.customer_statement_message import CustomerStatementMessageView
from core_service import database

db = database.db


def create_app(config_name=os.getenv('APP_SETTINGS', 'bank_transactie_service.config.DevelopmentConfig')):
    app = Flask(__name__)
    app.config.from_object(config_name)

    db.init_app(app)
    logging.basicConfig(
        level=app.config["LOG_LEVEL"],
    )
    if "DEVELOPMENT" in app.config and app.config["DEVELOPMENT"]:
        logging.config.dictConfig(
            {
                "version": 1,
                "incremental": True,
                "loggers": {"sqlalchemy.engine": {"level": app.config["LOG_LEVEL"]}},
            }
        )
    logging.info(f"Starting {__name__} with {config_name}")

    @app.route('/health')
    def health():
        return Response()

    # Views
    routes = [
        {"path": "/customerstatementmessages", "view": CustomerStatementMessageView,
         "name": "customer_statement_message_view"},
        {"path": "/customerstatementmessages/<object_id>", "view": CustomerStatementMessageView,
         "name": "customer_statement_message_detail_view"},
        {"path": "/banktransactions", "view": BankTransactionView,
         "name": "banktransaction_view"},
        {"path": "/banktransactions/<object_id>", "view": BankTransactionView,
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
