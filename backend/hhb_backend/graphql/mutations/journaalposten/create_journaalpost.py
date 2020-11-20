""" GraphQL mutation for creating a new Journaalpost """

import graphene
from flask import request
from graphql import GraphQLError
import requests
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.journaalpost import Journaalpost
import json


class CreateJournaalpostAfspraakInput(graphene.InputObjectType):
    transaction_id = graphene.Int(required=True)
    afspraak_id = graphene.Int(required=True)


class CreateJournaalpostGrootboekrekeningInput(graphene.InputObjectType):
    transaction_id = graphene.Int(required=True)
    grootboekrekening_id = graphene.String(required=True)


class CreateJournaalpostAfspraak(graphene.Mutation):
    """Create a Journaalpost with an Afspraak"""
    class Arguments:
        input = graphene.Argument(CreateJournaalpostAfspraakInput)

    ok = graphene.Boolean()
    journaalpost = graphene.Field(lambda: Journaalpost)

    async def mutate(root, info, input, **kwargs):
        """ Create the new Journaalpost """
        # Validate that the references exist
        transaction = await request.dataloader.bank_transactions_by_id.load(input.get('transaction_id'))
        if not transaction:
            raise GraphQLError("transaction not found")

        afspraak = await request.dataloader.afspraken_by_id.load(input.get('afspraak_id'))
        if not afspraak:
            raise GraphQLError("afspraak not found")

        # TODO validate that the debet/credit matches
        # TODO add grootboekrekening_id from afspraak
        post_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/journaalposten/",
            data=json.dumps(input, default=str),
            headers={'Content-type': 'application/json'}
        )
        if not post_response.ok:
            raise GraphQLError(f"Upstream API responded: {post_response.text}")
        return CreateJournaalpostAfspraak(journaalpost=post_response.json()["data"], ok=True)


class CreateJournaalpostGrootboekrekening(graphene.Mutation):
    """Create a Journaalpost with a Grootboekrekening"""
    class Arguments:
        input = graphene.Argument(CreateJournaalpostGrootboekrekeningInput)

    ok = graphene.Boolean()
    journaalpost = graphene.Field(lambda: Journaalpost)

    async def mutate(root, info, input, **kwargs):
        """ Create the new Journaalpost """
        # Validate that the references exist
        transaction = await request.dataloader.bank_transactions_by_id.load(input.get('transaction_id'))
        if not transaction:
            raise GraphQLError("transaction not found")

        grootboekrekening = await request.dataloader.grootboekrekeningen_by_id.load(input.get('grootboekrekening_id'))
        if not grootboekrekening:
            raise GraphQLError("grootboekrekening not found")

        # TODO validate that the debet/credit matches
        post_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/journaalposten/",
            data=json.dumps(input, default=str),
            headers={'Content-type': 'application/json'}
        )
        if not post_response.ok:
            raise GraphQLError(f"Upstream API responded: {post_response.text}")
        return CreateJournaalpostGrootboekrekening(journaalpost=post_response.json()["data"], ok=True)
