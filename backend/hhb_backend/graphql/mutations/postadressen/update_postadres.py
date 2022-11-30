""" GraphQL mutation for updating a Postadres """
import graphene
import requests
from graphql import GraphQLError

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
import hhb_backend.graphql.models.postadres as graphene_postadres
from hhb_backend.graphql.utils.gebruikersactiviteiten import gebruikers_activiteit_entities


class UpdatePostadres(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        straatnaam = graphene.String()
        huisnummer = graphene.String()
        postcode = graphene.String()
        plaatsnaam = graphene.String()

    ok = graphene.Boolean()
    postadres = graphene.Field(lambda: graphene_postadres.Postadres)
    previous = graphene.Field(lambda: graphene_postadres.Postadres)

    @staticmethod
    def mutate(self, info, id, **kwargs):
        """ Update the current Postadres """
        previous = hhb_dataloader().postadressen.load_one(id)
        if not previous:
            raise GraphQLError("Postadres not found")

        postadres_input = {
            "street": kwargs.get("straatnaam", previous['street']),
            "houseNumber": kwargs.get("huisnummer", previous['houseNumber']),
            "postalCode": kwargs.get("postcode", previous['postalCode']),
            "locality": kwargs.get("plaatsnaam", previous['locality'])
        }

        postadres_response = requests.put(
            f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/{id}",
            json=postadres_input,
            headers={"Accept": "application/json"}
        )
        if postadres_response.status_code != 200:
            raise GraphQLError(
                f"Upstream API responded: {postadres_response.text}"
            )

        postadres = postadres_response.json()['data']

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="postadres", result=postadres
            ),
            before=dict(postadres=previous),
            after=dict(postadres=postadres),
        )

        return UpdatePostadres(postadres=postadres, previous=previous, ok=True)
