""" GraphQL Burgers query """
import logging
import graphene

import hhb_backend.graphql.models.burger as burger
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.scalars.dynamic_types import DynamicType
from hhb_backend.graphql.utils.dates import valid_afspraak
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class BurgerQuery:
    return_type = graphene.Field(burger.Burger, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, _, info, id):
        logging.info(f"Get burger")
        result = hhb_dataloader().burgers.load_one(id)
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="burger", entityId=id)
            ],
        )
        return result


class BurgersQuery:
    return_type = graphene.List(
        burger.Burger,
        ids=graphene.List(graphene.Int),
        search=DynamicType()
    )

    @classmethod
    def resolver(cls, _, info, **kwargs):
        logging.info(f"Get burgers")
        if "ids" in kwargs:
            burgers = hhb_dataloader().burgers.load(kwargs["ids"])
            AuditLogging.create(
                action=info.field_name,
                entities=[
                    GebruikersActiviteitEntity(entityType="burger", entityId=id)
                    for id in kwargs["ids"]
                ]
            )
            return burgers

        if "search" in kwargs:
            search = str(kwargs["search"]).lower()
            if search:            
                burger_ids = set()
                afspraken_ids = set()

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
                    entities=[
                        GebruikersActiviteitEntity(entityType="burger", entityId=burger["id"])
                        for burger in result
                    ]
                )
                return result

        burgers = hhb_dataloader().burgers.load_all(filters=kwargs.get("filters", None))
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="burger", entityId=burger.id)
                for burger in burgers
            ] if "filters" in kwargs else []
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
        logging.info(f"Get burgers paged")
        if "start" in kwargs and "limit" in kwargs:
            burgers = hhb_dataloader().burgers.load_paged(start=kwargs["start"], limit=kwargs["limit"])
        else:
            burgers = hhb_dataloader().burgers.load_all()

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="burger", entityId=burger["id"])
                for burger in burgers["burgers"]
            ] if "start" in kwargs and "limit" in kwargs else []
        )

        return burgers
