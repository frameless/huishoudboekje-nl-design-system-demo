""" GraphQL Saldo query"""
import graphene
from hhb_backend.graphql.models.saldo import Saldo
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)
from hhb_backend.processen.saldo_berekenen import saldo_berekenen


class SaldoQuery:
    return_type = graphene.Field(Saldo, burger_ids=graphene.List(graphene.Int, default_value=[]))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, burger_ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="saldo", result=burger_ids
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, burger_ids):
        return await saldo_berekenen(burger_ids)
