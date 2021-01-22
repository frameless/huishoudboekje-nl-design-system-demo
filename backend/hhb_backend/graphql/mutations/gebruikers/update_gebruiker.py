""" GraphQL mutation for updating a Gebruiker/Burger """
import json
from flask import request

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteit, GebruikersActiviteitEntity, \
    gebruikers_activiteit_entities, log_gebruikers_activiteit


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
    previous_gebruiker = graphene.Field(lambda: Gebruiker)

    @property
    def gebruikers_activiteit(self):
        return GebruikersActiviteit(
            action="Update",
            entities=[GebruikersActiviteitEntity(entity_type="burger", entity_id=self.gebruiker['id'])] +
                     gebruikers_activiteit_entities(result=self.gebruiker, key='rekeningen', entity_type='rekening'),
            before=self.previous_gebruiker,
            after=self.gebruiker,
        )


    @log_gebruikers_activiteit
    async def mutate(root, info, id, **kwargs):
        """ Update the current Gebruiker/Burger """
        previous_gebruiker = await request.dataloader.gebruikers_by_id.load(id)

        gebruiker_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/gebruikers/{id}",
            data=json.dumps(kwargs),
            headers={'Content-type': 'application/json'}
        )
        if gebruiker_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {gebruiker_response.json()}")

        request.dataloader.gebruikers_by_id.clear(id)

        result = gebruiker_response.json()["data"]

        return UpdateGebruiker(gebruiker=result, ok=True, previous_gebruiker=previous_gebruiker)
