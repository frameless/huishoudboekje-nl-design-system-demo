import logging
import requests
from typing import List

from hhb_backend.graphql.settings import UNLEASHSERVICE_URL


class Unleash:
    def __init__(self):
        logging.debug(f"Unleash initialized")

    def is_enabled(self, name: str) -> bool:
        """Method that returns a boolean with the status of the feature flag"""
        result = self._fetch_flag(name)
        name, enabled = result
        logging.debug(f"Unleash is_enabled: name: {name}, enabled: {enabled}")
        return enabled

    def _fetch_flag(self, name: str):
        flags = self._fetch_flags([name])

        # If the flag is found return its value else return False
        enabled = flags[name] if name in flags else False

        logging.debug(f"Unleash fetch_feature_flag, name: {name}, enabled: {enabled}")
        return name, enabled

    def _fetch_flags(self, names: List[str]):
        """Fetch one or more specific feature flags from the Unleashservice"""
        names = ','.join([name for name in names])
        url = f"{UNLEASHSERVICE_URL}/{names}"
        data = self._send_request("GET", url)

        feature_flags = {}

        for name, enabled in data.items():
            logging.debug(f"Unleash fetch_flags: name {name}, enabled: {enabled}")
            feature_flags[name] = enabled

        logging.debug(f"Unleash fetch_flags: result {feature_flags}")
        return feature_flags

    def _send_request(self, method, url):
        try:
            response = requests.request(method, url)
            if response.status_code == 200:
                return response.json()
            return {}
        except requests.exceptions.ConnectionError:
            raise RuntimeError(f"Request to {url} failed.")
