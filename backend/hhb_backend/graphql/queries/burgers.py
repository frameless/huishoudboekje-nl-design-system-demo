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



class BurgersByUuidsQuery:
    return_type = graphene.List(
        burger.Burger,
        uuids=graphene.List(graphene.String),
    )

    @classmethod
    def resolver(cls, _, info, uuids=None):
        logging.info(f"Get burgers by uuid")
        if(uuids is None or len(uuids) == 0):
            return None
        
        burgers = hhb_dataloader().burgers.by_uuids(uuids)
        AuditLogging.create(
            action=info.field_name,
                entities=[
                    GebruikersActiviteitEntity(
                        entityType="burger", entityId=burger.id)
                    for burger in burgers
                ]
            )
        return sorted(burgers, key=lambda i: uuids.index(i.uuid))

class BurgersQuery:
    return_type = graphene.List(
        burger.Burger,
        search=graphene.String(),
        ids=graphene.List(graphene.Int),
        isLogRequest=graphene.Boolean(required=False),
    )

    @classmethod
    def resolver(cls, _, info, isLogRequest=False, **kwargs):
        logging.info(f"Get burgers")

        if "ids" in kwargs:
            burgers = hhb_dataloader().burgers.load(kwargs["ids"])
            AuditLogging.create(
            logRequest=isLogRequest,
            action=info.field_name,
                entities=[
                    GebruikersActiviteitEntity(
                        entityType="burger", entityId=id)
                    for id in kwargs["ids"]
                ]
            )
            return burgers

        if "search" in kwargs:
            search = str(kwargs["search"]).lower()
            if search:
                burgers = hhb_dataloader().burgers.get_burger_search(
                    search)
                AuditLogging.create(
                    action=info.field_name,
                    entities=[
                        GebruikersActiviteitEntity(
                            entityType="burger", entityId=burger["id"])
                        for burger in burgers
                    ]
                )
                return burgers

        burgers = hhb_dataloader().burgers.load_all(filters=kwargs.get("filters", None))
        
        AuditLogging.create(
            logRequest=isLogRequest,
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(
                    entityType="burger", entityId=burger.id)
                for burger in burgers
            ] if "filters" in kwargs else []
        )
        return burgers if not isLogRequest or isLogRequest and len(burgers) > 0 else None


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
            burgers = hhb_dataloader().burgers.load_paged(
                start=kwargs["start"], limit=kwargs["limit"])
        else:
            burgers = hhb_dataloader().burgers.load_all()

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(
                    entityType="burger", entityId=burger["id"])
                for burger in burgers["burgers"]
            ] if "start" in kwargs and "limit" in kwargs else []
        )

        return burgers
