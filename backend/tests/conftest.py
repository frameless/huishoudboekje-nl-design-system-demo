# """ Fixtures for core testing """
import pytest
from hhb_backend.app import create_app


@pytest.yield_fixture(scope="session")
def client(request):
    """
    Returns session-wide application.
    """
    yield create_app(config_name='hhb_backend.config.TestingConfig').test_client()
