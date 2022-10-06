import json
from flask import Response
from graphql import GraphQLError

class UpstreamError(GraphQLError):
    def __init__(self, response: Response, custom_message: str):
        error_message = self._make_pretty_message(custom_message, response)
        GraphQLError.__init__(self, error_message)

    @staticmethod
    def _make_pretty_message(custom_message: str, response: Response):
        try:
            response_json = response.json()
        except json.decoder.JSONDecodeError:
            return f"{custom_message} Upstream API responded: [{response.status_code}] {response.text}"

        error_message = f"No error message found. [{response.status_code}] {response.text}"
        if response_json:
            response_message = ""
            if response_json.get("errors"):
                response_message = ",".join(response_json["errors"])
            elif response_json.get("message"):
                response_message = response_json["message"]

            error_message = f"{custom_message} [{response.status_code}] {response_message}"

        return error_message
