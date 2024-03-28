import logging

import pytest
from flask import Flask

from hhb_backend.app import create_app
from pytest_mock import MockerFixture
from tests.conftest import TokenTestClient


def test_graphql_unauthenticated(no_auth_client, mocker: MockerFixture):
    mocker.patch(
        'hhb_backend.content_type_validation.ContentTypeValidator.is_valid', return_value=True)
    response = no_auth_client.post('/api/graphql?query=%7B%20__typename%20%7D')

    assert response.status_code == 401
    assert response.json == {'message': 'Unauthorized'}


def test_graphql_authenticated_cookie(client, mocker: MockerFixture):
    mocker.patch(
        'hhb_backend.content_type_validation.ContentTypeValidator.is_valid', return_value=True)
    body = {"query": "{grootboekrekening(id:\"adawdad\") {id}}"}
    response = client.post('/api/graphql', json=body)

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


def test_invalid_signature(token_app: Flask, mocker: MockerFixture):
    with token_app.test_client(secret='invalid') as client:
        mocker.patch(
            'hhb_backend.content_type_validation.ContentTypeValidator.is_valid', return_value=True)
        response = client.post('/api/graphql?query=%7B%20__typename%20%7D')

        assert response.status_code == 401
        assert response.json == {'message': 'Unauthorized'}


def test_invalid_audience(token_app: Flask, mocker: MockerFixture):
    with token_app.test_client(aud='invalid') as client:
        mocker.patch(
            'hhb_backend.content_type_validation.ContentTypeValidator.is_valid', return_value=True)
        response = client.post("/api/graphql?query=%7B%20__typename%20%7D")

        assert response.status_code == 401
        assert response.json == {'message': 'Unauthorized'}


def test_invalid_exp(token_app: Flask, mocker: MockerFixture):
    with token_app.test_client(exp_offset=-60) as client:
        mocker.patch(
            'hhb_backend.content_type_validation.ContentTypeValidator.is_valid', return_value=True)
        response = client.post('/api/graphql?query=%7B%20__typename%20%7D')

        assert response.status_code == 401
        assert response.json == {'message': 'Unauthorized'}
