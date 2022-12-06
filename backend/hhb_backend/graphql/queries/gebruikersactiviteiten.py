""" GraphQL GebruikersActiviteiten query """
import logging

import graphene

import hhb_backend.graphql.models.gebruikersactiviteit as gebruikersactiviteit
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class GebruikersActiviteitQuery:
    return_type = graphene.Field(gebruikersactiviteit.GebruikersActiviteit, id=graphene.Int(required=True))

    @staticmethod
    def resolver(self, info, **kwargs):
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="gebruikersactiviteit", entityId=kwargs.get("id"))
            ]
        )

        return hhb_dataloader().gebruikersactiviteiten.load_one(kwargs.get("id"))


class GebruikersActiviteitenQuery:
    return_type = graphene.List(
        gebruikersactiviteit.GebruikersActiviteit,
        ids=graphene.List(graphene.Int),
        burgerIds=graphene.List(graphene.Int),
        afsprakenIds=graphene.List(graphene.Int),
        huishoudenIds=graphene.List(graphene.Int),
    )

    @staticmethod
    def resolver(self, info, *args, **kwargs):
        print(f"GebruikersActiviteitenQuery.resolver: info: {info}, args: {args}, kwargs: {kwargs}")

        if (
            not kwargs.get("ids")
            and not kwargs.get("burgerIds")
            and not kwargs.get("afsprakenIds")
            and not kwargs.get("huishoudenIds")
        ):
            gebruikersactiviteiten = hhb_dataloader().gebruikersactiviteiten.load_all()
            entities = []
        else:
            gebruikersactiviteiten = []
            if kwargs.get("burgerIds"):
                gebruikersactiviteiten = (
                    hhb_dataloader().gebruikersactiviteiten.by_burgers(
                        kwargs.get("burgerIds")
                    )
                )
            if kwargs.get("afsprakenIds"):
                afspraken_list = hhb_dataloader().gebruikersactiviteiten.by_afspraak(kwargs.get("afsprakenIds"))
                gebruikersactiviteiten.extend(
                    afspraak
                    for afspraak in afspraken_list
                    if afspraak not in gebruikersactiviteiten
                )
            if kwargs.get("ids"):
                logging.debug(f"GebruikersactiviteitenIds: {kwargs['ids']}")
                ids_list = hhb_dataloader().gebruikersactiviteiten.load(kwargs.get("ids"))
                gebruikersactiviteiten.extend(x for x in ids_list if x not in gebruikersactiviteiten)
            if kwargs.get("huishoudenIds"):
                afspraken_list = hhb_dataloader().gebruikersactiviteiten.by_huishouden(kwargs.get("huishoudenIds"))
                gebruikersactiviteiten.extend(x for x in afspraken_list if x not in gebruikersactiviteiten)

            entities = [
                GebruikersActiviteitEntity(entityType="gebruikersactiviteit", entityId=g["id"])
                for g in gebruikersactiviteiten
            ]

        AuditLogging.create(
            action=info.field_name,
            entities=entities
        )

        return gebruikersactiviteiten


class GebruikersActiviteitenPagedQuery:
    return_type = graphene.Field(
        gebruikersactiviteit.GebruikersActiviteitenPaged,
        start=graphene.Int(),
        limit=graphene.Int(),
        burgerIds=graphene.List(graphene.Int),
        afsprakenIds=graphene.List(graphene.Int),
        huishoudenIds=graphene.List(graphene.Int),
    )

    @staticmethod
    def resolver(self, info, **kwargs):
        if "start" not in kwargs or "limit" not in kwargs:
            raise GraphQLError(f"Query needs params 'start', 'limit'. ")

        if not kwargs.get("burgerIds") and not kwargs.get("afsprakenIds") and not kwargs.get("huishoudenIds"):
            result = hhb_dataloader().gebruikersactiviteiten.load_paged(
                start=kwargs.get("start"), limit=kwargs.get("limit"), desc=True, sorting_column="timestamp"
            )
        else:
            if kwargs.get("burgerIds") and kwargs.get("afsprakenIds") and kwargs.get("huishoudenIds"):
                raise GraphQLError(f"Only burgerIds, afsprakenIds or huishoudenIds is supported. ")
            elif kwargs.get("burgerIds"):
                result = hhb_dataloader().gebruikersactiviteiten.by_burgers_paged(
                    keys=kwargs.get("burgerIds"), start=kwargs.get("start"), limit=kwargs.get("limit"),
                    desc=True, sorting_column="timestamp"
                )
            elif kwargs.get("afsprakenIds"):
                result = hhb_dataloader().gebruikersactiviteiten.by_afspraken_paged(
                    keys=kwargs.get("afsprakenIds"), start=kwargs.get("start"), limit=kwargs.get("limit"),
                    desc=True, sorting_column="timestamp"
                )
            elif kwargs.get("huishoudenIds"):
                result = hhb_dataloader().gebruikersactiviteiten.by_huishouden_paged(
                    keys=kwargs.get("huishoudenIds"), start=kwargs.get("start"), limit=kwargs.get("limit"),
                    desc=True, sorting_column="timestamp"
                )
            else:
                result = []

        logging.debug(f"result {result}")

        AuditLogging.create(
            action=info.field_name,
        )

        return result
