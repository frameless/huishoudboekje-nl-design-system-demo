import logging
from flask import request
from sqlalchemy import event
from sqlalchemy.engine import Engine
from sqlalchemy.pool import Pool
import time
from statsd import StatsClient


def add_statsd_metrics(app):
    if app.config["STATSD_HOSTPORT"] is not None and type(app.config["STATSD_HOSTPORT"]) is str:
        statsd = None
        try:
            statsd_host_port = app.config["STATSD_HOSTPORT"].split(':')
            statsd = StatsClient(host=statsd_host_port[0], port=int(
                statsd_host_port[1]), prefix=app.config["STATSD_PREFIX"])
            logging.info(
                f"Connected to statsd host {app.config['STATSD_HOSTPORT']}")
        except:
            logging.warning("could not connect to statsd host")

        if statsd:

            #
            # Query execution time
            #

            @event.listens_for(Engine, "before_cursor_execute")
            def before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
                conn.info.setdefault("query_start_time",
                                     []).append(time.time())

            @event.listens_for(Engine, "after_cursor_execute")
            def after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
                # time in miliseconds
                total = int(
                    (time.time() - conn.info["query_start_time"].pop(-1)) * 1000)
                statsd.timing("sqlalchemy.query.execution.duration", total)
                logging.debug(
                    f"Exexcuted query in {total} miliseconds:\n{statement} ")

            #
            # Pool events
            #

            @event.listens_for(Pool, "checkin")
            def receive_checkin(dbapi_connection, connection_record):
                # Called when a connection returns to the pool.
                statsd.incr('sqlalchemy.events.connections.pool.checkin')
                logging.debug(f"checkin")

            @event.listens_for(Pool, "checkout")
            def receive_checkout(dbapi_connection, connection_record, connection_proxy):
                # Called when a connection is retrieved from the Pool.
                statsd.incr('sqlalchemy.events.connections.pool.checkout')
                logging.debug(f"checkout")

            @event.listens_for(Pool, "close")
            def receive_close(dbapi_connection, connection_record):
                # Called when a DBAPI connection is closed.
                statsd.incr('sqlalchemy.events.connections.closed')
                logging.debug(f"close")

            @event.listens_for(Pool, "close_detached")
            def receive_close_detached(dbapi_connection):
                # Called when a detached DBAPI connection is closed.
                statsd.incr('sqlalchemy.events.conections.detached.close')
                logging.debug(f"close_detached")

            @event.listens_for(Pool, "connect")
            def receive_connect(dbapi_connection, connection_record):
                # Called at the moment a particular DBAPI connection is first created for a given Pool.
                statsd.incr('sqlalchemy.events.connections.pool.connect')
                logging.debug(f"Connect")

            @event.listens_for(Pool, "detach")
            def receive_detach(dbapi_connection, connection_record):
                # Called when a DBAPI connection is “detached” from a pool.
                statsd.incr('sqlalchemy.events.connections.detatched')
                logging.debug(f"detach")

            @event.listens_for(Pool, 'first_connect')
            def receive_first_connect(dbapi_connection, connection_record):
                # Called exactly once for the first time a DBAPI connection is checked out from a particular Pool.
                statsd.incr('sqlalchemy.events.connections.first_connect')
                logging.debug(f"first_connect")

            @event.listens_for(Pool, 'invalidate')
            def receive_invalidate(dbapi_connection, connection_record, exception):
                # Called when a DBAPI connection is to be “invalidated”.
                statsd.incr('sqlalchemy.events.connections.invalidated')
                logging.error(exception)
                logging.debug(f"invalidate")

            @event.listens_for(Pool, 'reset')
            def receive_reset(dbapi_connection, connection_record):
                # Called before the “reset” action occurs for a pooled connection.
                statsd.incr('sqlalchemy.events.connections.reset')
                logging.debug(f"reset")

            @event.listens_for(Pool, 'soft_invalidate')
            def receive_soft_invalidate(dbapi_connection, connection_record, exception):
                # Called when a DBAPI connection is to be “soft invalidated”.
                statsd.incr('sqlalchemy.events.connections.invalidated.soft')
                logging.debug(f"soft_invalidate")

            #
            # Connection events
            #

            @event.listens_for(Engine, 'engine_connect')
            def receive_engine_connect(conn, branch):
                # Intercept the creation of a new Connection.
                statsd.incr('sqlalchemy.events.engine.connect')
                logging.debug(f"engine_connect")

            @event.listens_for(Engine, 'engine_disposed')
            def receive_engine_disposed(engine):
                # Intercept when the Engine.dispose() method is called.
                statsd.incr('sqlalchemy.events.engine.dispose')
                logging.debug(f"engine_disposed")

            @event.listens_for(Engine, 'handle_error')
            def receive_handle_error(exception_context):
                # Intercept all exceptions processed by the Connection.
                statsd.incr('sqlalchemy.events.connections.exceptions')
                logging.debug(f"handle_error")
                    
                if(app.config["DATABASE_LOG_HANDLE_ERROR_EVENT"]):
                    logging.error(exception_context)

            #
            # Flask metrics
            #

            @app.before_request
            def metrics_before():
                request.start_time = time.time()
                endpoint = request.endpoint
                statsd.incr('flask.requests.started')
                statsd.incr('flask.requests.started.' + endpoint)
                logging.debug(f"started_request")

            @app.after_request
            def metrics_after(response):
                endpoint = request.endpoint
                statsd.incr('flask.requests.finished')
                statsd.incr('flask.requests.finished.' + endpoint)
                # time in miliseconds
                total = int((time.time() - request.start_time * 1000))
                statsd.timing('flask.requests.' +
                              endpoint + '.duration', total)
                logging.debug(f"finished_request")
                return response
