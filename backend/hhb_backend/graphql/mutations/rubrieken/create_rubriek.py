""" GraphQL mutation for creating a new Rubriek """

import json
import graphene
from graphql import GraphQLError
import requests
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.rubriek import Rubriek

class CreateRubriek(graphene.Mutation):
    class Arguments:
        naam = graphene.String()
        grootboekrekening_id = graphene.String()

    ok = graphene.Boolean()
    rubriek = graphene.Field(lambda: Rubriek)

    def mutate(root, info, **kwargs):
        """ Create the new Rubriek """
        if kwargs["grootboekrekening_id"]:
            grootboek_check = requests.get(f"{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/{kwargs['grootboekrekening_id']}")
            if grootboek_check.status_code != 200:
                raise GraphQLError(f"Grootboekrekening id [{kwargs['grootboekrekening_id']}] not found.")
        post_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/rubrieken/",
            data=json.dumps(kwargs, default=str),
            headers={'Content-type': 'application/json'}
        )
        if post_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {post_response.json()}")
        return CreateRubriek(rubriek=post_response.json()["data"], ok=True)