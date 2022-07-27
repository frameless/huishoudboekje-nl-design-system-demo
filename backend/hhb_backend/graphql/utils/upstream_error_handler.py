import json
from flask import Response
from graphql import GraphQLError

class UpstreamError(GraphQLError):
    def __init__(self, response: Response, customMessage: str):
        errorMessage = self.__makePrettyMessage(customMessage, response)
        GraphQLError.__init__(self, errorMessage)

    def __makePrettyMessage(self, customMessage: str, response: Response):
        errorMessage = f"No error message found. {response.json}"
        respMessage = json.loads(response.content.decode('utf-8'))["message"]
        if respMessage:
            errorInfo = json.loads(respMessage)[0]
            path = errorInfo['path'][-1] 
            message = errorInfo['message']
            errorMessage = f"{customMessage} {response.status_code}, {path}: {message}"

        return errorMessage