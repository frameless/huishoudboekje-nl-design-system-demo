# """ Fixtures for core testing """
import logging

import pytest
from flask import request, testing
from werkzeug.datastructures import Headers

from hhb_backend.app import create_app


@pytest.fixture(scope="function")
def test_request_context(event_loop):
    """
    Returns session-wide application.
    """
    app = create_app(config_name='hhb_backend.config.TestingConfig', loop=event_loop)

    with app.test_request_context('/graphql') as ctx:
        app.auth.current_user = app.auth._default_role_user("test@example.com")
        app.preprocess_request()
        yield ctx

class TestClient(testing.FlaskClient):
    def open(self, *args, **kwargs):
        headers = kwargs.pop('headers', Headers())
        token = self.application.auth._default_role_user("test@example.com").token
        api_key_headers = Headers({
            'authorization': f"Bearer {token}"
        })
        headers.extend(api_key_headers)
        kwargs['headers'] = headers
        return super().open(*args, **kwargs)


@pytest.fixture(scope="session")
def client(request):
    """
    Returns session-wide application.
    """
    app = create_app(config_name='hhb_backend.config.TestingConfig')
    app.test_client_class = TestClient
    logging.getLogger("faker").setLevel(logging.INFO)
    yield app.test_client()
