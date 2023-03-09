# # """ Fixtures for rapportage_service testing """
import pytest
from flask_injector import request
from unittest.mock import Mock
from rapportage_service.app import create_app
from rapportage_service.controllers.rapportageController import RapportageController


@pytest.fixture(scope="session")
def client(app):
    """
    Returns session-wide test client
    """
    yield app.test_client()


@pytest.fixture(scope="session")
def app(rapportage_controller_mock):
    """
    Returns session-wide application.
    """

    def dependency_injection(binder):
        binder.bind(RapportageController, to=rapportage_controller_mock, scope=request)
    app = create_app(dependency_injection_configuration=dependency_injection)
    yield app

@pytest.fixture(scope="session")
def rapportage_controller_mock():
    """
    Returns  rapportage_controller_mock.
    """

    rapportage_controller_mock=Mock()
    yield rapportage_controller_mock

