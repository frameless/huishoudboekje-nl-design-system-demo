# # """ Fixtures for rapportage_service testing """
import pytest
from rapportage_service.app import create_app


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
    app = create_app()
    yield app

