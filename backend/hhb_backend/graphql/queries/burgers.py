""" GraphQL Burgers query """
import graphene

import hhb_backend.graphql.models.burger as burger
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.scalars.dynamic_types import DynamicType
from hhb_backend.graphql.utils.dates import valid_afspraak
from hhb_backend.graphql.utils.gebruikersactiviteiten import gebruikers_activiteit_entities


class BurgerQuery:
    return_type = graphene.Field(burger.Burger, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, _, info, id):
        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="burger", result=id),
        )
        return hhb_dataloader().burgers.load_one(id)


class BurgersQuery:
    return_type = graphene.List(
        burger.Burger,
        ids=graphene.List(graphene.Int),
        search=DynamicType()
    )

    @classmethod
    def resolver(cls, _, info, **kwargs):
        if "ids" in kwargs:
            burgers = hhb_dataloader().burgers.load(kwargs["ids"])
            AuditLogging.create(
                action=info.field_name,
                entities=gebruikers_activiteit_entities(entity_type="burger", result=burgers),
            )
            return burgers

        if "search" in kwargs:
            burger_ids = set()
            afspraken_ids = set()
            search = str(kwargs["search"]).lower()

            burgers = hhb_dataloader().burgers.load_all(filters=kwargs.get("filters", None))
            for burger in burgers:
                if search in str(burger['achternaam']).lower() or \
                    search in str(burger['voornamen']).lower() or \
                    search in str(burger['bsn']).lower():
                    burger_ids.add(burger["id"])

            rekeningen = hhb_dataloader().rekeningen.load_all(filters=kwargs.get("filters", None))
            for rekening in rekeningen:
                if search in str(rekening['iban']).lower() or \
                    search in str(rekening['rekeninghouder']).lower():
                    for burger_id in rekening["burgers"]:
                        if burger_id:
                            burger_ids.add(burger_id)
                    for afspraak_id in rekening["afspraken"]:
                        afspraken_ids.add(afspraak_id)

            afspraken = hhb_dataloader().afspraken.load_all(filters=kwargs.get("filters", None))
            for afspraak in afspraken:
                if valid_afspraak(afspraak) and afspraak["burger_id"]:
                    if afspraak["id"] in afspraken_ids or search in str(afspraak['zoektermen']).lower():
                        burger_ids.add(afspraak["burger_id"])

            result = []
            for burger in burgers:
                if burger["id"] in burger_ids:
                    result.append(burger)

            AuditLogging.create(
                action=info.field_name,
                entities=gebruikers_activiteit_entities(entity_type="burger", result=[b.id for b in result]),
            )
            return result

        burgers = hhb_dataloader().burgers.load_all(filters=kwargs.get("filters", None))
        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="burger", result=burgers),
        )
        return burgers


class BurgersPagedQuery:
    return_type = graphene.Field(
        burger.BurgersPaged,
        start=graphene.Int(),
        limit=graphene.Int()
    )

    @classmethod
    def resolver(cls, _, info, **kwargs):
        burgers = []
        if "start" in kwargs and "limit" in kwargs:
            burgers = hhb_dataloader().burgers.load_paged(start=kwargs["start"], limit=kwargs["limit"])
        else:
            burgers = hhb_dataloader().burgers.load_all()

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="burger", result=burgers),
        )

        return burgers
