import graphene
from graphql import GraphQLError

import hhb_backend.graphql.models.huishouden as huishouden
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.filters.burgers import BurgerFilter
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class HuishoudenQuery:
    return_type = graphene.Field(huishouden.Huishouden, id=graphene.Int(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="huishouden", result=id),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, id):
        return hhb_dataloader().huishoudens_by_id.load(id)


class HuishoudensQuery:
    return_type = graphene.List(
        huishouden.Huishouden,
        ids=graphene.List(graphene.Int, default_value=[]),
        filters=BurgerFilter(),
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="huishouden", result=ids),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, ids=None, **kwargs):
        if ids:
            return hhb_dataloader().huishoudens_by_id.load_many(ids)
        return hhb_dataloader().huishoudens_by_id.load_all(filters=kwargs.get("filters", None))


class HuishoudensPagedQuery:
    return_type = graphene.Field(
        huishouden.HuishoudensPaged,
        start=graphene.Int(),
        limit=graphene.Int(),
        filters=BurgerFilter()
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, *_args, **kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="huishouden",
                result=kwargs["result"] if "result" in kwargs else None,
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, **kwargs):
        if "start" in kwargs and "limit" in kwargs:
            return hhb_dataloader().huishoudens_by_id.get_all_paged(
                start=kwargs["start"],
                limit=kwargs["limit"],
                desc=True,
                sorting_column="id",
                filters=kwargs.get("filters")
            )
        else:
            raise GraphQLError(f"Query needs params 'start', 'limit'. ")
