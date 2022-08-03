import json
from flask import Response
from graphql import GraphQLError

class UpstreamError(GraphQLError):
    def __init__(self, response: Response, customMessage: str):
        errorMessage = self.__makePrettyMessage(customMessage, response)
        GraphQLError.__init__(self, errorMessage)

    def __makePrettyMessage(self, customMessage: str, response: Response):
        try:
            resp = json.loads(response.content.decode('utf-8')) # response.json() can also be used, but sometimes it is a dict which can be transformed into json and the header does not always specify it is json and then the json content will not be returned either.
        except json.decoder.JSONDecodeError:
            return f"{customMessage} Upstream API responded: [{response.status_code}] {response.text}"
        
        if resp:
            if resp.get("errors"):
                errorMessage = ",".join(resp["errors"])
            elif resp.get("message"):
                respMessage = resp["message"]
                errorInfo = json.loads(respMessage['message'])[0]
                path = ".".join(errorInfo["path"])
                message = errorInfo["message"]
                errorMessage = f"{customMessage} [{response.status_code}] {path}: {message}"
            else:
                return f"No json error message found. [{response.status_code}] {response.text}"
            
        else:
            errorMessage = f"No json error message. [{response.status_code}] {response.text}"

        return errorMessage