""" GraphQL GebruikersActiviteiten query """
import logging
import graphene
from graphql import GraphQLError

import hhb_backend.graphql.models.gebruikersactiviteit as gebruikersactiviteit
from hhb_backend.graphql.dataloaders import hhb_dataloader


class GebruikersActiviteitQuery:
    return_type = graphene.Field(gebruikersactiviteit.GebruikersActiviteit, id=graphene.Int(required=True))

    @staticmethod
    def resolver(_root, _info, **kwargs):
        return hhb_dataloader().gebruikersactiviteiten.load_one(kwargs["id"])


class GebruikersActiviteitenQuery:
    return_type = graphene.List(
        gebruikersactiviteit.GebruikersActiviteit,
        ids=graphene.List(graphene.Int),
        burgerIds=graphene.List(graphene.Int),
        afsprakenIds=graphene.List(graphene.Int),
        huishoudenIds=graphene.List(graphene.Int),
    )

    @staticmethod
    def resolver(_root, _info, **kwargs):
        if (
                not kwargs["ids"]
                and not kwargs["burgerIds"]
                and not kwargs["afsprakenIds"]
                and not kwargs["huishoudenIds"]
        ):
            gebruikersactiviteiten = hhb_dataloader().gebruikersactiviteiten.load_all()
        else:
            gebruikersactiviteiten = []
            if kwargs["burgerIds"]:
                gebruikersactiviteiten = (
                    hhb_dataloader().gebruikersactiviteiten.by_burgers(
                        kwargs["burgerIds"]
                    )
                )
            if kwargs["afsprakenIds"]:
                afspraken_list = hhb_dataloader().gebruikersactiviteiten.by_afspraak(kwargs["afsprakenIds"])
                gebruikersactiviteiten.extend(
                    afspraak
                    for afspraak in afspraken_list
                    if afspraak not in gebruikersactiviteiten
                )
            if kwargs["ids"]:
                logging.debug(f"GebruikersactiviteitenIds: {kwargs['ids']}")
                ids_list = hhb_dataloader().gebruikersactiviteiten.load(kwargs["ids"])
                gebruikersactiviteiten.extend(x for x in ids_list if x not in gebruikersactiviteiten)
            if kwargs["huishoudenIds"]:
                afspraken_list = hhb_dataloader().gebruikersactiviteiten.by_huishouden(kwargs["huishoudenIds"])
                gebruikersactiviteiten.extend(x for x in afspraken_list if x not in gebruikersactiviteiten)

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
            if not kwargs["burgerIds"] and not kwargs["afsprakenIds"] and not kwargs["huishoudenIds"]:
                return hhb_dataloader().gebruikersactiviteiten.load_paged(
                    start=kwargs["start"], limit=kwargs["limit"], desc=True, sorting_column="timestamp"
                )
            else:
                if kwargs["burgerIds"] and kwargs["afsprakenIds"] and kwargs["huishoudenIds"]:
                    raise GraphQLError(f"Only burgerIds, afsprakenIds or huishoudenIds is supported. ")
                if kwargs["burgerIds"]:
                    return hhb_dataloader().gebruikersactiviteiten.by_burgers_paged(
                        keys=kwargs["burgerIds"], start=kwargs["start"], limit=kwargs["limit"],
                        desc=True, sorting_column="timestamp"
                    )
                if kwargs["afsprakenIds"]:
                    return hhb_dataloader().gebruikersactiviteiten.by_afspraken_paged(
                        keys=kwargs["afsprakenIds"], start=kwargs["start"], limit=kwargs["limit"],
                        desc=True, sorting_column="timestamp"
                    )
                if kwargs["huishoudenIds"]:
                    return hhb_dataloader().gebruikersactiviteiten.by_huishouden_paged(
                        keys=kwargs["huishoudenIds"], start=kwargs["start"], limit=kwargs["limit"],
                        desc=True, sorting_column="timestamp"
                    )
        else:
            raise GraphQLError(f"Query needs params 'start', 'limit'. ")

