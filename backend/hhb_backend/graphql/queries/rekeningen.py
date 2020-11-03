""" GraphQL Rekeningen query """
import graphene
import requests
from flask import request
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.rekening import Rekening


class RekeningQuery():
    return_type = graphene.Field(Rekening, id=graphene.Int(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.rekeningen_by_id.load(kwargs["id"])

class RekeningenQuery():
    return_type = graphene.List(Rekening, ids=graphene.List(graphene.Int, default_value=[]))

    async def resolver(root, info, **kwargs):
        if kwargs["ids"]:
            rekeningen = await request.dataloader.rekeningen_by_id.load_many(kwargs["ids"])
        else:
            response = requests.get(f"{settings.HHB_SERVICES_URL}/rekeningen/")
            if response.status_code != 200:
                raise GraphQLError(f"Upstream API responded: {response.json()}")
            rekeningen = response.json()["data"]
        return rekeningen