import graphene
import hhb_backend.graphql.models.huishouden as huishouden
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.filters.burgers import BurgerFilter
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class HuishoudenQuery:
    return_type = graphene.Field(huishouden.Huishouden, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, _root, info, id):
        result = hhb_dataloader().huishoudens.load_one(id)
        AuditLogging.create(
            action=info.field_name,
            entities=(GebruikersActiviteitEntity(entityType="huishouden", entityId=id))
        )
        return result


class HuishoudensQuery:
    return_type = graphene.List(
        huishouden.Huishouden,
        ids=graphene.List(graphene.Int),
        filters=BurgerFilter(),
    )

    @classmethod
    def resolver(cls, _root, info, ids=None, **kwargs):
        if ids:
            result = hhb_dataloader().huishoudens.load(ids)
        else:
            result = hhb_dataloader().huishoudens.load_all(filters=kwargs.get("filters", None))

        AuditLogging().create(
            action=info.field_name, 
            entities=[
                GebruikersActiviteitEntity(entityType="huishouden", entityId=id)
                for id in ids
            ] if ids or "filters" in kwargs else []
        )

        return result


class HuishoudensPagedQuery:
    return_type = graphene.Field(
        huishouden.HuishoudensPaged,
        start=graphene.Int(),
        limit=graphene.Int(),
        filters=BurgerFilter()
    )

    @classmethod
    def resolver(cls, _root, info, **kwargs):
        if "start" in kwargs and "limit" in kwargs:
            result = hhb_dataloader().huishoudens.load_paged(
                start=kwargs["start"],
                limit=kwargs["limit"],
                desc=True,
                sorting_column="id",
                filters=kwargs.get("filters")
            )
        else:
            raise GraphQLError(f"Query needs params 'start', 'limit'. ")

        AuditLogging().create(
            action=info.field_name, 
            entities=[
                GebruikersActiviteitEntity(entityType="huishouden", entityId=huishouden["id"])
                for huishouden in result
            ]
        )

        return result
