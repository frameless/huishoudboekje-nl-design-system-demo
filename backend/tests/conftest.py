# """ Fixtures for core testing """
import logging

import pytest
from hhb_backend.app import create_app


@pytest.fixture(scope="function")
def test_request_context(event_loop):
    """
    Returns session-wide application.
    """
    app = create_app(config_name='hhb_backend.config.TestingConfig', loop=event_loop)

    with app.test_request_context('/graphql') as ctx:
        app.preprocess_request()
        yield ctx


@pytest.fixture(scope="session")
def client(request):
    """
    Returns session-wide application.
    """
    app = create_app(config_name='hhb_backend.config.TestingConfig')
    logging.getLogger("faker").setLevel(logging.INFO)
    yield app.test_client()
