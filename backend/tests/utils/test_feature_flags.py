import pytest
import re
import requests_mock
import sys

from hhb_backend.feature_flags import Unleash
from hhb_backend.graphql import settings


def test_feature_flags():
    """This test checks if the feature flags are fetched correctly, and if the result is correct."""
    with requests_mock.Mocker() as rm:
        result = {
            "burgers": True,
            "signalen": False,
        }

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        req = rm.post(re.compile(f"{settings.UNLEASHSERVICE_URL}/.*"), json=result)

        # Initialize the Unleash client
        unleash = Unleash()

        assert req.call_count == 0
        assert unleash.is_enabled("burgers") == True
        assert req.call_count == 1
        assert unleash.is_enabled("signalen") == False
        assert req.call_count == 2
        assert unleash.is_enabled("does_not_exist") == False
        assert req.call_count == 3
        assert unleash.is_enabled("does_not_exist_as_well") == False
        assert req.call_count == 4

        # Always calls the API
        assert unleash.is_enabled("burgers") == True
        assert req.call_count == 5

        assert fallback.call_count == 0
