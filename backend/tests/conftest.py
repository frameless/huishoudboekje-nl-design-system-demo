# """ Fixtures for core testing """
import pytest
from hhb_backend.app import app

@pytest.yield_fixture(scope="session")
def client(request):
    """
    Returns session-wide application.
    """
    yield app.test_client()
    