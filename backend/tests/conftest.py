# """ Fixtures for core testing """
import logging

import pytest
from hhb_backend.app import create_app


@pytest.yield_fixture(scope="session")
def client(request):
    """
    Returns session-wide application.
    """
    app = create_app(config_name='hhb_backend.config.TestingConfig')
    logging.getLogger("faker").setLevel(logging.INFO)
    yield app.test_client()
