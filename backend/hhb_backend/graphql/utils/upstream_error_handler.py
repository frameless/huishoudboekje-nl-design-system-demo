import json
from flask import Response
from graphql import GraphQLError

class UpstreamError(GraphQLError):
    def __init__(self, response: Response, customMessage: str):
        errorMessage = self.__makePrettyMessage(customMessage, response)
        GraphQLError.__init__(self, errorMessage)

    def __makePrettyMessage(self, customMessage: str, response: Response):
        respMessage = response.json() 
        if respMessage:
            errorInfo = json.loads(respMessage['message'])[0]
            path = ".".join(errorInfo["path"])
            message = errorInfo["message"]
            errorMessage = f"{customMessage} [{response.status_code}] {path}: {message}"
        else:
            errorMessage = f"No json error message found. {response.text}"

        return errorMessage