import logging
from sqlalchemy import event
from sqlalchemy.engine import Engine
from sqlalchemy.pool import Pool
import time
from statsd import StatsClient

def add_sqlalchemy_statsd_metrics(app):
    if app.config["STATSD_HOSTPORT"] is not None and type(app.config["STATSD_HOSTPORT"]) is str:
        statsd = None
        try:
            statsd_host_port = app.config["STATSD_HOSTPORT"].split(':')
            statsd = StatsClient(host=statsd_host_port[0], port=int(statsd_host_port[1]), prefix=app.config["STATSD_PREFIX"])
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
                statsd.timing("sqlalchemy.query.execution.duration", total)
                logging.info(f"Exexcuted query in {total} miliseconds:\n{statement} ")

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
            def receive_close(dbapi_connection, connection_record):
                # Called when a DBAPI connection is closed.
                statsd.gauge('sqlalchemy.pool.connections', -1, delta=True)
                logging.debug(f"close")

            @event.listens_for(Pool, "detach")
            def receive_detach(dbapi_connection, connection_record):
                # Called when a DBAPI connection is “detached” from a pool.
                statsd.gauge('sqlalchemy.pool.connections', -1, delta=True)
                statsd.gauge('sqlalchemy.detached.connections', 1, delta=True)
                logging.debug(f"detach")

            @event.listens_for(Pool, "close_detached")
            def receive_close_detached(dbapi_connection):
                # Called when a detached DBAPI connection is closed.
                statsd.gauge('sqlalchemy.detached.connections', -1, delta=True)
                logging.debug(f"close_detached")