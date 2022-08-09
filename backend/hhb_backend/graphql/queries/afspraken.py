""" GraphQL Afspraken query """
import graphene

import hhb_backend.graphql.models.afspraak as afspraak
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class AfspraakQuery:
    return_type = graphene.Field(afspraak.Afspraak, id=graphene.Int(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, result, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="afspraak", result=id)
            + gebruikers_activiteit_entities(
                entity_type="burger", result=result, key="burger_id"
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, id):
        return hhb_dataloader().afspraak_by_id.load(id)


class AfsprakenQuery:
    return_type = graphene.List(
        afspraak.Afspraak, ids=graphene.List(graphene.Int, default_value=[])
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids=None, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="afspraak", result=ids),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, ids=None):
        if ids:
            return hhb_dataloader().afspraak_by_id.load_many(ids)
        return hhb_dataloader().afspraak_by_id.load_all()
