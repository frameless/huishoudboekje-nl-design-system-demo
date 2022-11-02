""" GraphQL GebruikersActiviteiten query """
import graphene
import logging
from graphql import GraphQLError

import hhb_backend.graphql.models.gebruikersactiviteit as gebruikersactiviteit
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader


class GebruikersActiviteitQuery:
    return_type = graphene.Field(gebruikersactiviteit.GebruikersActiviteit, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, _info, **kwargs):
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
    def resolver(root, info, *args, **kwargs):
        print(f"GebruikersActiviteitenQuery.resolver: info: {info}, args: {args}, kwargs: {kwargs}")

        if (
            not kwargs.get("ids")
            and not kwargs.get("burgerIds")
            and not kwargs.get("afsprakenIds")
            and not kwargs.get("huishoudenIds")
        ):
            gebruikersactiviteiten = hhb_dataloader().gebruikersactiviteiten.load_all()
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

        AuditLogging.create(action=info.field_name)

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
    def resolver(_root, _info, **kwargs):
        if "start" in kwargs and "limit" in kwargs:
            if not kwargs.get("burgerIds") and not kwargs.get("afsprakenIds") and not kwargs.get("huishoudenIds"):
                return hhb_dataloader().gebruikersactiviteiten.load_paged(
                    start=kwargs.get("start"), limit=kwargs.get("limit"), desc=True, sorting_column="timestamp"
                )
            else:
                if kwargs.get("burgerIds") and kwargs.get("afsprakenIds") and kwargs.get("huishoudenIds"):
                    raise GraphQLError(f"Only burgerIds, afsprakenIds or huishoudenIds is supported. ")
                if kwargs.get("burgerIds"):
                    return hhb_dataloader().gebruikersactiviteiten.by_burgers_paged(
                        keys=kwargs.get("burgerIds"), start=kwargs.get("start"), limit=kwargs.get("limit"),
                        desc=True, sorting_column="timestamp"
                    )
                if kwargs.get("afsprakenIds"):
                    return hhb_dataloader().gebruikersactiviteiten.by_afspraken_paged(
                        keys=kwargs.get("afsprakenIds"), start=kwargs.get("start"), limit=kwargs.get("limit"),
                        desc=True, sorting_column="timestamp"
                    )
                if kwargs.get("huishoudenIds"):
                    return hhb_dataloader().gebruikersactiviteiten.by_huishouden_paged(
                        keys=kwargs.get("huishoudenIds"), start=kwargs.get("start"), limit=kwargs.get("limit"),
                        desc=True, sorting_column="timestamp"
                    )
        else:
            raise GraphQLError(f"Query needs params 'start', 'limit'. ")
