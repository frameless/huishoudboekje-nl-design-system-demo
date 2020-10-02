# # """ Fixtures for gebruikers_service testing """
# import pytest
# from testing.postgresql import Postgresql
# from gebruikers_service.app import create_app
# from gebruikers_service.app import db
# from hhb_services.config import TestingConfig

# @pytest.yield_fixture(scope="session")
# def database():
#     print("Creating postgres database")
#     with Postgresql() as postgresql:
#         print(f"Creating postgres database at {postgresql.url()}")
#         yield postgresql

# @pytest.yield_fixture(scope="session")
# def gebruikers_app(database):
#     app = create_app(TestingConfig)
#     app.config['SQLALCHEMY_DATABASE_URI'] = database.url()
#     with app.app_context():
#         yield app

# @pytest.yield_fixture(scope='function')
# def gebruikers_app_client(gebruikers_app):
#     db.app = gebruikers_app
#     db.create_all()
#     yield gebruikers_app.test_client()
#     db.drop_all()

# module conftest.py
import pytest

from gebruikers_service.app import create_app
from gebruikers_service.app import db as _db
from sqlalchemy import event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.session import close_all_sessions
from testing.postgresql import Postgresql
from hhb_services.config import TestingConfig

@pytest.yield_fixture(scope="session")
def app(request):
    """
    Returns session-wide application.
    """
    with Postgresql() as postgresql:
        app = create_app(TestingConfig)
        app.config['SQLALCHEMY_DATABASE_URI'] = postgresql.url()
        yield app


@pytest.fixture(scope="function")
def db(app, request):
    """
    Returns session-wide initialised database.
    """
    with app.app_context():
        close_all_sessions()
        _db.drop_all()
        _db.create_all()


@pytest.fixture(scope="function", autouse=True)
def session(app, db, request):
    """
    Returns function-scoped session.
    """
    with app.app_context():
        conn = _db.engine.connect()
        txn = conn.begin()

        options = dict(bind=conn, binds={})
        sess = _db.create_scoped_session(options=options)

        # establish  a SAVEPOINT just before beginning the test
        # (http://docs.sqlalchemy.org/en/latest/orm/session_transaction.html#using-savepoint)
        sess.begin_nested()

        @event.listens_for(sess(), 'after_transaction_end')
        def restart_savepoint(sess2, trans):
            # Detecting whether this is indeed the nested transaction of the test
            if trans.nested and not trans._parent.nested:
                # The test should have normally called session.commit(),
                # but to be safe we explicitly expire the session
                sess2.expire_all()
                sess.begin_nested()

        _db.session = sess
        yield sess

        # Cleanup
        sess.remove()
        # This instruction rollsback any commit that were executed in the tests.
        txn.rollback()
        conn.close()
    