import logging

import pytest
from flask import Flask

from hhb_backend.app import create_app
from tests.conftest import TokenTestClient

def test_graphql_unauthenticated(no_auth_client):
    response = no_auth_client.get('/api/graphql?query=%7B%20__typename%20%7D')

    assert response.status_code == 401
    assert response.json == {'message': 'Not logged in'}

def test_graphql_authenticated_cookie(cookie_client):
    response = cookie_client.get('/api/graphql?query=%7B%20__typename%20%7D')

    assert response.status_code == 200

def test_graphql_authenticated_token(client):
    response = client.get('/api/graphql?query=%7B%20__typename%20%7D')

    assert response.status_code == 200


@pytest.fixture(scope="session")
def token_app(request) -> Flask:
    """
    Returns session-wide application.
    """
    app = create_app(config_name='hhb_backend.config.Config')
    app.test_client_class = TokenTestClient
    logging.getLogger("faker").setLevel(logging.INFO)

    yield app

def test_invalid_signature(token_app: Flask):
    with token_app.test_client(secret='invalid') as client:
        response = client.get('/api/graphql?query=%7B%20__typename%20%7D')

        assert response.status_code == 401
        assert response.json == {'message': 'Not logged in'}


def test_invalid_audience(token_app: Flask):
    with token_app.test_client(aud='invalid') as client:
        response = client.get("/api/graphql?query=%7B%20__typename%20%7D")

        assert response.status_code == 401
        assert response.json == {'message': 'Not logged in'}


def test_invalid_exp(token_app: Flask):
    with token_app.test_client(exp_offset=-60) as client:
        response = client.get('/api/graphql?query=%7B%20__typename%20%7D')

        assert response.status_code == 401
        assert response.json == {'message': 'Not logged in'}
