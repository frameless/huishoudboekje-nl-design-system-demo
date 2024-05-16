import logging
import graphene

import hhb_backend.graphql.models.huishouden as huishouden
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.filters.burgers import BurgerFilter
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.utils.sort_result import sort_result


class HuishoudenQuery:
    return_type = graphene.Field(huishouden.Huishouden, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, _root, info, id):
        logging.info(f"Get huishouden")
        result = hhb_dataloader().huishoudens.load_one(id)
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="huishouden", entityId=id)
            ]
        )
        return result


class HuishoudensQuery:
    return_type = graphene.List(
        huishouden.Huishouden,
        ids=graphene.List(graphene.Int),
        filters=BurgerFilter(), 
        isLogRequest=graphene.Boolean(required=False),
    )

    @classmethod
    def resolver(cls, _root, info, ids=None, isLogRequest=False, **kwargs):
        logging.info(f"Get huishoudens")
        if ids:
            result = sort_result(ids,  hhb_dataloader().huishoudens.load(ids))
            entities = [
                GebruikersActiviteitEntity(entityType="huishouden", entityId=huishoudenId)
                for huishoudenId in ids
            ]
        else:
            result = hhb_dataloader().huishoudens.load_all(filters=kwargs.get("filters", None))
            entities = None

        AuditLogging().create(
            logRequest=isLogRequest,
            action=info.field_name,
            entities=entities
        )

        return result if not isLogRequest or isLogRequest and len(result) > 0 else None


class HuishoudensPagedQuery:
    return_type = graphene.Field(
        huishouden.HuishoudensPaged,
        start=graphene.Int(),
        limit=graphene.Int(),
        filters=BurgerFilter()
    )

    @classmethod
    def resolver(cls, _root, info, **kwargs):
        logging.info(f"Get huishoudens paged")
        if "start" not in kwargs or "limit" not in kwargs:
            raise GraphQLError(f"Query needs params 'start', 'limit'. ")

        result = hhb_dataloader().huishoudens.load_paged(
            start=kwargs["start"],
            limit=kwargs["limit"],
            desc=True,
            sorting_column="id",
            filters=kwargs.get("filters")
        )

        AuditLogging().create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="huishouden", entityId=huishouden["id"])
                for huishouden in result["huishoudens"]
            ]
        )

        return result
