from typing import List
from hhb_backend.graphql.dataloaders.request_object import GetRequestObject
from graphql import GraphQLError
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError
import requests
from hhb_backend.graphql.settings import INTERNAL_CONNECTION_TIMEOUT, INTERNAL_READ_TIMEOUT


class DataLoaderConcept():
    """
    New concept for the dataloader to make the requests more flexible and less complicated
    Currently only works for the Afspraken Search query

    https://docs.graphene-python.org/en/latest/execution/dataloader/

    later it should get the - async def batch_load_fn(self, keys) - method for each model,
        and no imlementation for the load function.

    the batch_load_fn will be a function that can load one or many objects.
    I think this should make the implementation of the batching later easier

    """

    def load_request(self, request: GetRequestObject) -> dict:
        """
         Loads the request object
         """
        try:
            response = requests.get(request.get_url(), json=request.get_body(), params=request.get_params(), timeout=(INTERNAL_CONNECTION_TIMEOUT,INTERNAL_READ_TIMEOUT))


        except requests.exceptions.ReadTimeout:
            raise GraphQLError(f"Failed to read data from {request.get_service()} in time ")
        except requests.exceptions.ConnectTimeout:
            raise GraphQLError(f"Failed to connect to {request.get_service()} in time")
        except requests.exceptions.ConnectionError:
            raise GraphQLError(f"Failed to execute request to url {request.get_service()}")
        
        if response.status_code != 200:
            raise UpstreamError(response, f"Request to {request.get_url()} failed.")
        
        return  response.json()