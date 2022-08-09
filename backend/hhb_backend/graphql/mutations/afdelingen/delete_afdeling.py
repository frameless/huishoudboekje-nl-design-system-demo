""" GraphQL mutation for deleting a Afdeling """
import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.afdeling import Afdeling
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class DeleteAfdeling(graphene.Mutation):
    """Mutatie om een afdeling van een organisatie te verwijderen."""

    class Arguments:
        # afdeling arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Afdeling)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="afdeling", result=self, key="previous"
            ),
            before=dict(afdeling=self.previous),
        )

    @log_gebruikers_activiteit
    async def mutate(root, _info, id):
        """ Delete current afdeling """
        previous = hhb_dataloader().afdeling_by_id.load(id)
        if not previous:
            raise GraphQLError("Afdeling not found")

        # do not remove when attached postadressen are found
        postadressen_ids = previous.get("postadressen_ids")
        if postadressen_ids:
            raise GraphQLError("Afdeling heeft postadressen - verwijderen is niet mogelijk.")

        # do not remove when attached rekeningen are found
        rekeningen_ids = previous.get("rekeningen_ids")
        if rekeningen_ids: 
            raise GraphQLError("Afdeling heeft rekeningen - verwijderen is niet mogelijk.")

        # do not remove when attached afpraken are found
        afspraken = previous.get("afspraken")
        if afspraken:
            raise GraphQLError("Afdeling wordt gebruikt in afpraken - verwijderen is niet mogelijk.")

        # remove afdeling itself
        response_organisatie = requests.delete(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{id}")
        if response_organisatie.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response_organisatie.text}")

        response_hhb = requests.delete(f"{settings.HHB_SERVICES_URL}/afdelingen/{id}")
        if response_hhb.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response_hhb.text}")

        return DeleteAfdeling(ok=True, previous=previous)
