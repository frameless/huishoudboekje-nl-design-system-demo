""" GraphQL mutation for creating a new Afdeling """
import logging
import graphene
import requests
from graphql import GraphQLError

import hhb_backend.graphql.mutations.postadressen.create_postadres as create_postadres
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
import hhb_backend.graphql.models.afdeling as graphene_afdeling
from hhb_backend.graphql.mutations.postadressen.utils import create_afdeling_postadres
from hhb_backend.graphql.mutations.rekeningen.utils import create_afdeling_rekening
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator


class CreateAfdelingInput(graphene.InputObjectType):
    # hhb_service elements (required)
    organisatie_id = graphene.Int(required=True)
    naam = graphene.String(required=True)
    rekeningen = graphene.List(lambda: rekening_input.RekeningInput)
    postadressen = graphene.List(lambda: create_postadres.CreatePostadresInput)


class CreateAfdeling(graphene.Mutation):
    """Mutatie om een afdeling aan een organisatie toe te voegen."""

    class Arguments:
        input = graphene.Argument(CreateAfdelingInput)

    ok = graphene.Boolean()
    afdeling = graphene.Field(lambda: graphene_afdeling.Afdeling)

    def mutate(root, info, **kwargs):
        """ Create the new Afdeling """
        logging.info("Creating afdeling")

        validation_schema = {
            "type": "object",
            "properties": {
                "naam": {"type": "string", "minLength": 1},
                "rekeningen": {
                    "oneOf": [
                        {"type": "array", "items": {
                            "type": "object",
                            "properties": {
                                "rekeninghouder": {"type": "string","minLength": 1,"maxLength": 100}
                            },
                        }
                    },
                    { "type": "null" }
                ]},
                "postadressen":  {
                    "oneOf": [
                        {"type": "array", "items": {
                            "type": "object",
                            "properties": {
                                "straatnaam": {"type": "string", "minLength": 1},
                                "huisnummer": {"type": "string", "minLength": 1},
                                "postcode": {"type": "string","pattern": "^[1-9][0-9]{3}[A-Za-z]{2}$"}, #ZipcodeNL
                                "plaatsnaam": {"type": "string", "minLength": 1},
                            },
                        }
                    },
                    { "type": "null" }
                ]},
            },
            "required": []
        }

        input = kwargs.pop("input")        
        JsonInputValidator(validation_schema).validate(input)

        rekeningen = input.pop("rekeningen", None)
        postadressen = input.pop("postadressen", None)

        hhb_service_data = {
            "organisatie_id": input.organisatie_id,
        }

        previous = hhb_dataloader().organisaties.load_one(input.organisatie_id)
        if not previous:
            raise GraphQLError("Organisatie not found")

        hhb_service_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afdelingen/",
            json=hhb_service_data,
            headers={"Accept": "application/json", "Content-type": "application/json"},
        )
        if hhb_service_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {hhb_service_response.json()}")

        org_service_response = requests.post(
            f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/",
            json=input,
            headers={"Accept": "application/json", "Content-type": "application/json"},
        )
        if org_service_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {org_service_response.json()}")

        result = org_service_response.json()["data"]
        afdeling_id = result["id"]

        # rekeningen maken en meegeven aan result
        if rekeningen:
            rekening_ids = []
            for rekening in rekeningen:
                created_rekening = create_afdeling_rekening(afdeling_id, rekening)
                rekening_ids.append(created_rekening.get("id"))
            # update afdeling with rekening
            update_response = requests.post(
                f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{afdeling_id}",
                json={"Accept": "application/json", "rekeningen_ids": rekening_ids},
                headers={"Content-type": "application/json"},
            )
            if update_response.status_code != 200:
                raise GraphQLError(f"Upstream API responded: {update_response.json()}")

        # postadressen maken en meegeven aan result
        if postadressen:
            result["postadressen_ids"] = [
                create_afdeling_postadres(postadres, afdeling_id)["id"]
                for postadres in postadressen
            ]

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="afdeling", entityId=afdeling_id),
                GebruikersActiviteitEntity(entityType="organisatie", entityId=input.organisatie_id)
            ],
            after=dict(afspraak=result)
        )

        return CreateAfdeling(afdeling=result, ok=True)
