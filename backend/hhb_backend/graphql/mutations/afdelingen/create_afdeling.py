""" GraphQL mutation for creating a new Afdeling """
import graphene
import requests
from graphql import GraphQLError

import hhb_backend.graphql.mutations.postadressen.create_postadres as create_postadres
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.afdeling import Afdeling
from hhb_backend.graphql.mutations.postadressen.utils import create_afdeling_postadres
from hhb_backend.graphql.mutations.rekeningen.utils import create_afdeling_rekening
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


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
    afdeling = graphene.Field(lambda: Afdeling)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="afdeling", result=self, key="afdeling"
            ),
            after=dict(afdeling=self.afdeling),
        )

    @log_gebruikers_activiteit
    async def mutate(root, _info, **kwargs):
        """ Create the new Afdeling """
        input = kwargs.pop("input")
        rekeningen = input.pop("rekeningen", None)
        postadressen = input.pop("postadressen", None)

        hhb_service_data = {
            "organisatie_id": input["organisatie_id"],
        }

        previous = hhb_dataloader().organisaties.load_one(input['organisatie_id'])
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

        return CreateAfdeling(afdeling=result, ok=True)
