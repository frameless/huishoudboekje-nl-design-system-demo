import graphene
from flask import request
from graphql import GraphQLError
import requests
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.journaalpost import Journaalpost
import json


class UpdateJournaalpostGrootboekrekeningInput(graphene.InputObjectType):
    id = graphene.Int(required=True)
    grootboekrekening_id = graphene.String(required=True)


class UpdateJournaalpostGrootboekrekening(graphene.Mutation):
    """Update a Journaalpost with a Grootboekrekening"""
    class Arguments:
        input = graphene.Argument(UpdateJournaalpostGrootboekrekeningInput)

    ok = graphene.Boolean()
    journaalpost = graphene.Field(lambda: Journaalpost)

    async def mutate(root, info, input, **kwargs):
        """ Create the new Journaalpost """

        # Validate that the references exist
        journaalpost = await request.dataloader.journaalposten_by_id.load(input.get('id'))
        if not journaalpost:
            raise GraphQLError(f"journaalpost not found")

        grootboekrekening = await request.dataloader.grootboekrekeningen_by_id.load(input.get('grootboekrekening_id'))
        if not grootboekrekening:
            raise GraphQLError("grootboekrekening not found")

        # TODO validate that the debet/credit matches
        post_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/journaalposten/{input.get('id')}",
            data=json.dumps(input, default=str),
            headers={'Content-type': 'application/json'}
        )
        if not post_response.ok:
            raise GraphQLError(f"Upstream API responded: {post_response.text}")
        return UpdateJournaalpostGrootboekrekening(journaalpost=post_response.json()["data"], ok=True)
