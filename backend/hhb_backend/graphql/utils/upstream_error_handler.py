import json
from flask import Response
from graphql import GraphQLError

class UpstreamError(GraphQLError):
    def __init__(self, response: Response, customMessage: str):
        errorMessage = self.__makePrettyMessage(customMessage, response)
        GraphQLError.__init__(self, errorMessage)

    def __makePrettyMessage(self, customMessage: str, response: Response):
        try:
            resp = response.json()
        except json.decoder.JSONDecodeError:
            return f"{customMessage} Upstream API responded: [{response.status_code}] {response.text}"
        
        errorMessage = f"No error message found. [{response.status_code}] {response.text}"
        if resp:
            respMessage = ""
            if resp.get("errors"):
                respMessage = ",".join(resp["errors"])
            elif resp.get("message"):
                respMessage = resp["message"]
            
            errorMessage = f"{customMessage} [{response.status_code}] {respMessage}"

        return errorMessage