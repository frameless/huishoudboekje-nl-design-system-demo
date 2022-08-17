""" GraphQL Burgers query """
import graphene

import hhb_backend.graphql.models.burger as burger
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.scalars.dynamic_types import DynamicType
from hhb_backend.graphql.utils.dates import valid_afspraak
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


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
        return hhb_dataloader().burger_by_id.load(id)


class BurgersQuery:
    return_type = graphene.List(
        burger.Burger,
        ids=graphene.List(graphene.Int, default_value=[]),
        search=DynamicType()
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
            return hhb_dataloader().burger_by_id.load_many(kwargs["ids"])

        if "search" in kwargs:
            burger_ids = set()
            afspraken_ids = set()
            search = str(kwargs["search"]).lower()

            burgers = hhb_dataloader().burger_by_id.load_all(filters=kwargs.get("filters", None))
            for burger in burgers:
                if search in str(burger['achternaam']).lower() or\
                        search in str(burger['voornamen']).lower() or\
                        search in str(burger['bsn']).lower():
                    burger_ids.add(burger["id"])

            rekeningen = hhb_dataloader().rekening_by_id.load_all(filters=kwargs.get("filters", None))
            for rekening in rekeningen:
                if search in str(rekening['iban']).lower() or \
                        search in str(rekening['rekeninghouder']).lower():
                    for burger_id in rekening["burgers"]:
                        if burger_id:
                            burger_ids.add(burger_id)
                    for afspraak_id in rekening["afspraken"]:
                        afspraken_ids.add(afspraak_id)

            afspraken = hhb_dataloader().afspraak_by_id.load_all(filters=kwargs.get("filters", None))
            for afspraak in afspraken:
                if valid_afspraak(afspraak) and afspraak["burger_id"]:
                    if afspraak["id"] in afspraken_ids or search in str(afspraak['zoektermen']).lower():
                        burger_ids.add(afspraak["burger_id"])

            result = []
            for burger in burgers:
                if burger["id"] in burger_ids:
                    result.append(burger)
            return result

        return hhb_dataloader().burger_by_id.load_all(filters=kwargs.get("filters", None))


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
            return hhb_dataloader().burger_by_id.load_paged(start=kwargs["start"], limit=kwargs["limit"])
        return hhb_dataloader().burger_by_id.load_all()
