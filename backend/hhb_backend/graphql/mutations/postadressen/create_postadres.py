""" GraphQL mutation for creating a new Postadres """
import logging
import graphene
import requests

import hhb_backend.graphql.models.afdeling as graphene_afdeling
import hhb_backend.graphql.models.postadres as graphene_postadres
from graphql import GraphQLError
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator

class CreatePostadresInput(graphene.InputObjectType):
    # hhb_service elements (required)
    straatnaam = graphene.String(required=True)
    huisnummer = graphene.String(required=True)
    postcode = graphene.String(required=True)
    plaatsnaam = graphene.String(required=True)
    afdeling_id = graphene.Int()


class CreatePostadres(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreatePostadresInput)

    ok = graphene.Boolean()
    postadres = graphene.Field(lambda: graphene_postadres.Postadres)
    afdeling = graphene.Field(lambda: graphene_afdeling.Afdeling)

    @staticmethod
    def mutate(self, info, **kwargs):
        """ Create the new Postadres """
        logging.info(f"Creating postadres")
        input = kwargs.pop("input")

        validation_schema = {
            "type": "object",
            "properties": {
                "straatnaam": {"type": "string", "minLength": 1},
                "huisnummer": {"type": "string", "minLength": 1},
                "postcode": {"type": "string","pattern": "^[1-9][0-9]{3}[A-Za-z]{2}$"}, #ZipcodeNL
                "plaatsnaam": {"type": "string", "minLength": 1},
            },
            "required": []
        }
        JsonInputValidator(validation_schema).validate(input)

        ## check if afdeling exists
        previous_afdeling = hhb_dataloader().afdelingen.load_one(input.get('afdeling_id'))
        if not previous_afdeling:
            raise GraphQLError("Afdeling not found")

        postadres_input = {
            "street": input.straatnaam,
            "houseNumber": input.huisnummer,
            "postalCode": input.postcode,
            "locality": input.plaatsnaam
        }

        postadres_response = requests.post(
            f"{settings.POSTADRESSEN_SERVICE_URL}/addresses",
            json=postadres_input,
            headers={"Accept": "application/json"}
        )
        if postadres_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {postadres_response.json()}")

        result = postadres_response.json()['data']

        postadressen_ids = list(previous_afdeling.postadressen_ids)
        postadressen_ids.append(result['id'])

        afdeling_input = {
            **previous_afdeling,
            "postadressen_ids": postadressen_ids
        }

        afdeling_id = input.get('afdeling_id')
        update_afdeling_response = requests.post(
            f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{afdeling_id}",
            json=afdeling_input,
            headers={"Content-type": "application/json"},
        )
        if update_afdeling_response.status_code != 200:
            raise GraphQLError(
                f"Upstream API responded: {update_afdeling_response.json()}"
            )

        new_afdeling = update_afdeling_response.json()["data"]

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="postadres", entityId=result['id']),
                GebruikersActiviteitEntity(entityType="afdeling", entityId=afdeling_id),
            ],
            after=dict(postadres=result),
        )

        return CreatePostadres(postadres=result, afdeling=new_afdeling, ok=True)
