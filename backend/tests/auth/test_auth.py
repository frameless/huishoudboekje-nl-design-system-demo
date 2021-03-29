import logging
import uuid
from time import time

import jwt
import pytest
from flask import Flask, testing
from flask.testing import FlaskClient
from pydash import omit
from werkzeug.datastructures import Headers

from hhb_backend.app import create_app


def test_login_redirects_to_oidc(no_auth_client: FlaskClient):
    response = no_auth_client.get('/login')

    assert response.status_code == 302
    assert response.headers["Location"].startswith(
        'http://localhost:6556/auth?client_id=huishoudboekje&redirect_uri=http%3A%2F%2Flocalhost%2Fapi%2Foidc_callback&scope=openid+email+profile+offline_access&')


def test_login_with_token(oidc_client):
    response = oidc_client.get('/login')

    assert response.status_code == 302
    assert response.headers["Location"].startswith('http://localhost/')


def test_me(client):
    response = client.get('/me')

    assert response.status_code == 200
    assert 'token' in response.json
    assert omit(response.json, ['token']) == {'email': 'test@example.com'}


def test_me_unauthenticated(no_auth_client):
    response = no_auth_client.get('/me')

    assert response.status_code == 401
    assert response.json == {'message': 'Not logged in'}


def test_me_api_client(api_client):
    response = api_client.get('/me')

    assert response.status_code == 200
    assert 'token' in response.json
    assert omit(response.json, ['token']) == {'email': 'test@example.com'}


def test_logout(oidc_client):
    assert [c.name for c in oidc_client.cookie_jar] == ['oidc_id_token']

    response = oidc_client.get('/logout')

    assert response.status_code == 200
    assert response.data == b'ok'

    assert [c.name for c in oidc_client.cookie_jar] == []


class TokenTestClient(testing.FlaskClient):
    aud: str
    iss: str
    exp: int
    secret: str

    def __init__(self, *args, sub='test@example.com', aud=None, iss=None, exp_offset=None, secret=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.sub = sub
        self.aud = aud or self.application.auth.audience
        self.iss = iss or self.application.auth.audience
        self.exp_offset = exp_offset or self.application.auth.exp_offset
        self.secret = secret or self.application.auth.secret


    def token(self):
        payload = {
            "sub": self.sub,
            "iat": int(time()),
            "exp": int(time()) + self.exp_offset,
            "iss": self.iss,
            "aud": self.aud,
            "jti": str(uuid.uuid4())
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
def token_app(request) -> Flask:
    """
    Returns session-wide application.
    """
    app = create_app(config_name='hhb_backend.config.TestingConfig')
    app.test_client_class = TokenTestClient
    logging.getLogger("faker").setLevel(logging.INFO)

    yield app

def test_invalid_signature(token_app: Flask):
    with token_app.test_client(secret='invalid') as client:
        response = client.get('/me')

        assert response.status_code == 401
        assert response.json == {'message': 'Not logged in'}


def test_invalid_audience(token_app: Flask):
    with token_app.test_client(aud='invalid') as client:
        response = client.get('/me')

        assert response.status_code == 401
        assert response.json == {'message': 'Not logged in'}


def test_invalid_issuer(token_app: Flask):
    with token_app.test_client(iss='invalid') as client:
        response = client.get('/me')

        assert response.status_code == 401
        assert response.json == {'message': 'Not logged in'}


def test_invalid_exp(token_app: Flask):
    with token_app.test_client(exp_offset=-60) as client:
        response = client.get('/me')

        assert response.status_code == 401
        assert response.json == {'message': 'Not logged in'}
