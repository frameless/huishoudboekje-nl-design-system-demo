""" GraphQL mutation for creating a new Gebruiker/Burger """
import json
import logging
from datetime import datetime

import graphene
import requests
from dateutil import tz
from graphql import GraphQLError
from flask import request, g

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.graphql.mutations.rekeningen.utils import create_gebruiker_rekening


class CreateGebruikerInput(graphene.InputObjectType):
    # gebruiker arguments
    email = graphene.String()
    geboortedatum = graphene.Date()
    telefoonnummer = graphene.String()
    rekeningen = graphene.List(lambda: rekening_input.RekeningInput)

    # burger arguments
    achternaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    straatnaam = graphene.String()
    voorletters = graphene.String()
    voornamen = graphene.String()
    plaatsnaam = graphene.String()


def gebruikersactiviteit(action: str, entities: list, before: dict, after: dict):
    logging.debug(f"action={action}, entities={entities}")
    json = {
        'timestamp': datetime.now(tz=tz.tzlocal()).replace(microsecond=0).isoformat(),
        'meta': {
            'userAgent': str(request.user_agent),
            'ip': ','.join(request.access_route),
            'applicationVersion': '0.0.0-mock',
        },

        'gebruiker_id': g.oidc_id_token["email"] if g.oidc_id_token is not None else None,
        'action': action,
        'entities': entities,
        'snapshot_before': before,
        'snapshot_after': after,
    }
    # TODO use a Queue and asyncio.run_task
    response = requests.post(
        f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
        json=json,
    )
    logging.debug(f"logged gebruikersactiviteit(status={response.text}) {gebruikersactiviteit}")


class CreateGebruiker(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateGebruikerInput)

    ok = graphene.Boolean()
    gebruiker = graphene.Field(lambda: Gebruiker)

    def mutate(root, info, **kwargs):
        """ Create the new Gebruiker/Burger """
        input = kwargs.pop("input")
        rekeningen = input.pop("rekeningen", None)
        gebruiker_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/gebruikers/",
            data=json.dumps(input, default=str),
            headers={'Content-type': 'application/json'}
        )
        if gebruiker_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {gebruiker_response.json()}")

        result = gebruiker_response.json()["data"]

        if rekeningen:
            result['rekeningen'] = [create_gebruiker_rekening(result['id'], rekening) for rekening in rekeningen]

        gebruikersactiviteit(
            action='create',
            entities=[{"entityType": "burger", "entityId": result['id']}] +
                     [
                         ({"entityType": "rekening", "entityId": rekening['id'], })
                         for rekening in (result['rekeningen'] or [])
                     ] if 'rekeningen' in result is not None else [],
            before=None,
            after={
                'burger': result,
            })
        return CreateGebruiker(gebruiker=result, ok=True)
