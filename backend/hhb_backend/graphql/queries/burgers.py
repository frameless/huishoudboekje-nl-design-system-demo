""" GraphQL Burgers query """
import graphene
from flask import request

import hhb_backend.graphql.models.burger as burger
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)
from hhb_backend.graphql.filters.burgers import BurgerFilter
import hhb_backend.graphql.models.afspraak as afspraak

class BurgerQuery:
    return_type = graphene.Field(burger.Burger, id=graphene.Int(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="burger", result=id),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, id, *_args, **_kwargs):
        return await request.dataloader.burgers_by_id.load(id)


class BurgersQuery:
    return_type = graphene.List(
        burger.Burger,
        ids=graphene.List(graphene.Int, default_value=[]),
        filters=BurgerFilter()
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="burger", result=ids),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, **kwargs):
        if kwargs["ids"]:
            return await request.dataloader.burgers_by_id.load_many(kwargs["ids"])

        if "filters" in kwargs:
            if "bedrag" in kwargs['filters'] or "tegen_rekening_id" in kwargs['filters']  or "zoektermen" in kwargs['filters'] :
                afspraken = request.dataloader.afspraken_by_id.get_all_and_cache(filters=kwargs.get("filters", None))
                burger_ids = set([afspraak_dict['burger_id'] for afspraak_dict in afspraken if "burger_id" in afspraak_dict])
                return await request.dataloader.burgers_by_id.load_many(list(burger_ids))

            if "iban" in kwargs['filters'] or "rekeninghouder" in kwargs['filters']:
                rekeningen = request.dataloader.rekeningen_by_id.get_all_and_cache(filters=kwargs.get("filters", None))

                burger_ids = set()
                organisatie_ids = set()
                afspraken_ids = set()
                for rekening_dict in rekeningen:
                    if "burgers" in rekening_dict:
                        burger_ids.update(rekening_dict['burgers'])
                    if "organisaties" in rekening_dict:
                        organisatie_ids.update(rekening_dict['organisaties'])
                    if "afspraken" in rekening_dict:
                        afspraken_ids.update(rekening_dict['afspraken'])

                if burger_ids:
                    return await request.dataloader.burgers_by_id.load_many(list(burger_ids))
                if afspraken_ids:
                    afspraken = await request.dataloader.afspraken_by_id.load_many(list(afspraken_ids))
                    burger_ids = set([afspraak_dict['burger_id'] for afspraak_dict in afspraken if "burger_id" in afspraak_dict])
                    return await request.dataloader.burgers_by_id.load_many(burger_ids)
                if organisatie_ids:
                    organisaties = await request.dataloader.organisaties_by_id.load_many(list(organisatie_ids))
                    afspraken = await request.dataloader.afspraken_by_id.load_many(organisaties[0]['afspraken'])
                    burger_ids = set([afspraak_dict['burger_id'] for afspraak_dict in afspraken if "burger_id" in afspraak_dict])
                    return await request.dataloader.burgers_by_id.load_many(burger_ids)

                return await request.dataloader.burgers_by_id.load_many(burger_ids)

        return request.dataloader.burgers_by_id.get_all_and_cache(filters=kwargs.get("filters", None))


class BurgersPagedQuery:
    return_type = graphene.Field(
        burger.BurgersPaged,
        start=graphene.Int(),
        limit=graphene.Int()
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="burger", result=ids),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, **kwargs):
        if "start" in kwargs and "limit" in kwargs:
            return request.dataloader.burgers_by_id.get_all_paged(start=kwargs["start"], limit=kwargs["limit"])
        return request.dataloader.burgers_by_id.get_all_and_cache()
