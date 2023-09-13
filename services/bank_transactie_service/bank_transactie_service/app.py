""" Main app for bank_transactie_service """
import logging
import logging.config

from flask import Flask, Response
from flask_migrate import Migrate
from sqlalchemy import event
from sqlalchemy.engine import Engine
from sqlalchemy.pool import Pool
import time
from statsd import StatsClient

from bank_transactie_service.views.bank_transaction import BankTransactionView
from bank_transactie_service.views.customer_statement_message import CustomerStatementMessageView
from core_service import database
from bank_transactie_service.views.bank_transaction_range import BanktransactionRangeView
from bank_transactie_service.views.transactions_filter_view import BanktransactionFilterView

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

    if app.config["STATSD_HOSTPORT"] is not None and type(app.config["STATSD_HOSTPORT"]) is str:
        statsd = None
        try:
            statsd_host = app.config["STATSD_HOSTPORT"].split(':')
            statsd = StatsClient(host=statsd_host[0], port=int(statsd_host[1]), prefix=app.config["STATSD_PREFIX"])
            logging.info(f"Connected to statsd host {app.config['STATSD_HOSTPORT']}")
        except:
            logging.warning("could not connect to statsd host")

        if statsd:
            statsd.set('sqlalchemy.pool.connections', 0)
            statsd.set('sqlalchemy.used.connections', 0)
            statsd.set('sqlalchemy.detached.connections', 0)

            @event.listens_for(Engine, "before_cursor_execute")
            def before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
                conn.info.setdefault("query_start_time", []).append(time.time())

            @event.listens_for(Engine, "after_cursor_execute")
            def after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
                total = int((time.time() - conn.info["query_start_time"].pop(-1)) * 1000) #time in miliseconds
                statsd.timing("query.execution.duration", total)
                logging.info(f"Exexcuted query {statement} in {total} miliseconds")

            @event.listens_for(Pool, "connect")
            def receive_connect(dbapi_connection, connection_record):
                # Called at the moment a particular DBAPI connection is first created for a given Pool.
                statsd.gauge('sqlalchemy.pool.connections', 1, delta=True)
                logging.debug(f"Connect")

            @event.listens_for(Pool, "checkin")
            def receive_checkin(dbapi_connection, connection_record):
                # Called when a connection returns to the pool.
                statsd.gauge('sqlalchemy.pool.connections', 1, delta=True)
                statsd.gauge('sqlalchemy.used.connections', -1, delta=True)
                logging.debug(f"checkin")

            @event.listens_for(Pool, "checkout")
            def receive_checkout(dbapi_connection, connection_record, connection_proxy):
                # Called when a connection is retrieved from the Pool.
                statsd.gauge('sqlalchemy.pool.connections', -1, delta=True)
                statsd.gauge('sqlalchemy.used.connections', 1, delta=True)
                logging.debug(f"checkout")

            @event.listens_for(Pool, "close")
            def receive_close(dbapi_connection, connection_record, connection_proxy):
                # Called when a DBAPI connection is closed.
                statsd.gauge('sqlalchemy.pool.connections', -1, delta=True)
                logging.debug(f"close")

            @event.listens_for(Pool, "detach")
            def receive_detach(dbapi_connection, connection_record, connection_proxy):
                # Called when a DBAPI connection is “detached” from a pool.
                statsd.gauge('sqlalchemy.pool.connections', -1, delta=True)
                statsd.gauge('sqlalchemy.detached.connections', 1, delta=True)
                logging.debug(f"chedetachckin")

            @event.listens_for(Pool, "close_detached")
            def receive_close_detached(dbapi_connection, connection_record, connection_proxy):
                # Called when a detached DBAPI connection is closed.
                statsd.gauge('sqlalchemy.detached.connections', -1, delta=True)
                logging.debug(f"close_detached")


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
