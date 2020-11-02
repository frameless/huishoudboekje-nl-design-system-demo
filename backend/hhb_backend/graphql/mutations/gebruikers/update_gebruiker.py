""" GraphQL mutation for updating a Gebruiker/Burger """
import json

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker


class UpdateGebruiker(graphene.Mutation):
    class Arguments:
        # gebruiker arguments
        id = graphene.Int(required=True)
        email = graphene.String()
        geboortedatum = graphene.String()
        telefoonnummer = graphene.String()

        # burger arguments
        achternaam = graphene.String()
        huisnummer = graphene.String()
        postcode = graphene.String()
        straatnaam = graphene.String()
        voorletters = graphene.String()
        voornamen = graphene.String()
        plaatsnaam = graphene.String()

    ok = graphene.Boolean()
    gebruiker = graphene.Field(lambda: Gebruiker)

    def mutate(root, info, id, **kwargs):
        """ Update the current Gebruiker/Burger """

        gebruiker_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/gebruikers/{id}",
            data=json.dumps(kwargs),
            headers={'Content-type': 'application/json'}
        )
        if gebruiker_response.status_code != 202:
            raise GraphQLError(f"Upstream API responded: {gebruiker_response.json()}")

        return UpdateGebruiker(gebruiker=gebruiker_response.json()["data"], ok=True)
