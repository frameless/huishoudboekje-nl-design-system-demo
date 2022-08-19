""" GraphQL Gebruikers query """
import graphene

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.afdeling import Afdeling
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class AfdelingQuery:
    return_type = graphene.Field(Afdeling, id=graphene.Int(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="afdeling", result=id
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, id):
        return hhb_dataloader().afdelingen.load_one(id)


class AfdelingenQuery:
    return_type = graphene.List(
        Afdeling, ids=graphene.List(graphene.Int, default_value=[])
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="afdeling", result=ids
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, ids=None):
        if ids:
            return hhb_dataloader().afdelingen.load(ids)
        return hhb_dataloader().afdelingen.load_all()
