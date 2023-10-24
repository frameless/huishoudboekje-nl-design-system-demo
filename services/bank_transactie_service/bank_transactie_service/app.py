""" Main app for bank_transactie_service """
import logging
import logging.config

from flask import Flask, Response
from flask_migrate import Migrate

from bank_transactie_service.views.bank_transaction import BankTransactionView
from bank_transactie_service.views.customer_statement_message import CustomerStatementMessageView
from core_service import database
from bank_transactie_service.views.bank_transaction_range import BanktransactionRangeView
from bank_transactie_service.views.transactions_filter_view import BanktransactionFilterView
from bank_transactie_service.views.bank_transaction_sum import BanktransactionSumView
from core_service.statsd_metrics import add_statsd_metrics

db = database.db


def create_app(config_name='bank_transactie_service.config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_name)

    db.init_app(app)
    Migrate(app, db)

    logging.basicConfig(
        format='%(asctime)s %(levelname)-8s %(message)s',
        level=app.config["LOG_LEVEL"],
        datefmt='%Y-%m-%d %H:%M:%S')
    # logging.config.dictConfig(
    #     {
    #         "version": 1,
    #         "incremental": True,
    #         "loggers": {"sqlalchemy.engine": {"level": app.config["LOG_LEVEL"]}},
    #     }
    # )
    logging.info(f"Starting {__name__} with {config_name}")

    # Werkzeug has their own logger which outputs info level URL calls.
    # This can also cause parameters that are normally hidden to be logged
    logging.getLogger('werkzeug').setLevel(app.config["LOG_LEVEL"])

    add_statsd_metrics(app)


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
        {"path": "/banktransactions/filter", "view": BanktransactionFilterView,
            "name": "banktransaction_filter_view"},
        {"path": "/banktransactions/range", "view": BanktransactionRangeView,
            "name": "banktransaction_range_view"},
        {"path": "/banktransactions/sum", "view": BanktransactionSumView,
            "name": "banktransaction_sum_view"},
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
