# """ Fixtures for core testing """
import logging
from time import time
import uuid

import pytest
import jwt
from flask import testing
from itsdangerous import TimedJSONWebSignatureSerializer
from werkzeug.datastructures import Headers

from hhb_backend.app import create_app


@pytest.fixture(scope="function")
def test_request_context(event_loop):
    """
    Returns session-wide application.
    """
    app = create_app(config_name='hhb_backend.config.Config', loop=event_loop)

    with app.test_request_context('/graphql') as ctx:
        app.preprocess_request()
        yield ctx

class TokenTestClient(testing.FlaskClient):
    aud: str
    exp: int
    secret: str

    def __init__(self, *args, aud=None, exp_offset=None, secret=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.aud = aud or self.application.config["JWT_AUDIENCE"]
        self.exp_offset = exp_offset or 3600
        self.secret = secret or self.application.config["JWT_SECRET"]


    def token(self):
        payload = {
            "iat": int(time()),
            "exp": int(time()) + self.exp_offset,
            "aud": self.aud,
            "jti": str(uuid.uuid4()),
            "email": "test@mail.com", 
            "name": "tester"
        }
        token = jwt.encode(
            payload=payload,
            key=self.secret,
            algorithm="HS256")
        return token


    def open(self, *args, **kwargs):
        headers = kwargs.pop('headers', Headers())
        token = self.token()
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
    app = create_app(config_name='hhb_backend.config.Config')
    app.test_client_class = TokenTestClient
    logging.getLogger("faker").setLevel(logging.INFO)

    yield app.test_client()

@pytest.fixture(scope="session")
def cookie_client(request):
    """
    Returns session-wide application.
    """
    app = create_app(config_name='hhb_backend.config.Config')

    logging.getLogger("faker").setLevel(logging.INFO)

    with app.test_client() as client:
        secret = app.config["JWT_SECRET"]
        audience = app.config["JWT_AUDIENCE"]
        token = jwt.encode({"email": "test@mail.com", "name": "tester", "aud": audience}, secret, algorithm="HS256")
        client.set_cookie('localhost', 'app-token', token)

        yield client

@pytest.fixture(scope="session")
def no_auth_client(request):
    """
    Returns session-wide application.
    """
    app = create_app(config_name='hhb_backend.config.Config')
    logging.getLogger("faker").setLevel(logging.INFO)
    yield app.test_client()
