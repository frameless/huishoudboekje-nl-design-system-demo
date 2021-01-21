""" GraphQL mutation for updating a Gebruiker/Burger """
import json

import graphene
import requests
from flask import request
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker
from hhb_backend.graphql.utils.gebruikersactiviteiten import gebruikers_activiteit_entities, log_gebruikers_activiteit


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
    previous = graphene.Field(lambda: Gebruiker)

    @property
    def gebruikers_activiteit(self):
        return dict(
            action="Update",
            entities=[dict(entity_type="burger", entity_id=self.gebruiker['id'])] +
                     gebruikers_activiteit_entities(result=self.gebruiker, key='rekeningen', entity_type='rekening'),
            before={"burger": self.previous},
            after={"burger": self.gebruiker},
        )


    @log_gebruikers_activiteit
    async def mutate(root, info, id, **kwargs):
        """ Update the current Gebruiker/Burger """
        previous = await request.dataloader.gebruikers_by_id.load(id)

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/gebruikers/{id}",
            data=json.dumps(kwargs),
            headers={'Content-type': 'application/json'}
        )
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        request.dataloader.gebruikers_by_id.clear(id)

        gebruiker = response.json()["data"]

        return UpdateGebruiker(ok=True, gebruiker=gebruiker, previous=previous)
