""" GraphQL mutation for updating a Postadres """
import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
import hhb_backend.graphql.models.postadres as graphene_postadres
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


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

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="postadres", result=self, key="postadres"
            ),
            before=dict(postadres=self.previous),
            after=dict(postadres=self.postadres),
        )

    @staticmethod
    @log_gebruikers_activiteit
    def mutate(_root, _info, id, **kwargs):
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

        return UpdatePostadres(postadres=postadres, previous=previous, ok=True)
