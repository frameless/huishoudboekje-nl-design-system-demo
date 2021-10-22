""" Fixtures for organisatie_service testing """
import pytest

from organisatie_service.app import create_app
from organisatie_service.app import db as _db
from sqlalchemy import event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.session import close_all_sessions
from testing.postgresql import Postgresql
from organisatie_service.config import TestingConfig

# TODO importing from ./factories seems broken, i gave up
from models.afdeling import Afdeling
from models.organisatie import Organisatie

class OrganisatieFactory:
    """ Factory for Organisatie objects """

    def __init__(self, dbsession):
        self.dbsession = dbsession

    def createOrganisatie(
        self,
        kvknummer: str = "12345",
        vestigingsnummer: str = "000001",
        naam: str = "Test Organisatie"
    ):
        organisatie = Organisatie(
            kvknummer=kvknummer,
            vestigingsnummer=vestigingsnummer,
            naam=naam
        )
        self.dbsession.add(organisatie)
        self.dbsession.flush()
        return organisatie

@pytest.fixture()
def organisatie_factory(dbsession, request):
    """
    creates an instance of the OrganisatieFactory with function scope dbsession
    """
    return OrganisatieFactory(dbsession)

class AfdelingFactory:
    """ Factory for Afdeling objects """
    def __init__(self, dbsession, organisatie_factory):
        self.organisatie_factory = organisatie_factory
        self.dbsession = dbsession

    def createAfdeling(
        self,
        postadressen_ids: str = None,
        naam: str = "Test Organisatie"
    ):
        organisatie = self.organisatie_factory.createOrganisatie()
        self.dbsession.add(organisatie)
        self.dbsession.flush()
        organisatie_id = organisatie.id

        afdeling = Afdeling(
            organisatie_id=organisatie_id,
            naam=naam,
            postadressen_ids=postadressen_ids
        )
        self.dbsession.add(afdeling)
        self.dbsession.flush()
        return afdeling

@pytest.fixture()
def afdeling_factory(dbsession, request, organisatie_factory):
    """
    creates an instance of the AfdelingFactory with function scope dbsession
    """
    return AfdelingFactory(dbsession, organisatie_factory)

@pytest.yield_fixture(scope="session")
def client(app, request):
    """
    Returns session-wide test client
    """
    yield app.test_client()

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
def dbsession(app, db, request):
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




