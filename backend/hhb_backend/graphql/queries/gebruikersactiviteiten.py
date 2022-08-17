""" GraphQL GebruikersActiviteiten query """
import graphene
from graphql import GraphQLError

import hhb_backend.graphql.models.gebruikersactiviteit as gebruikersactiviteit
from hhb_backend.graphql.dataloaders import hhb_dataloader


class GebruikersActiviteitQuery:
    return_type = graphene.Field(gebruikersactiviteit.GebruikersActiviteit, id=graphene.Int(required=True))

    @staticmethod
    async def resolver(_root, _info, **kwargs):
        return hhb_dataloader().gebruikersactiviteiten_by_id.load(kwargs["id"])


class GebruikersActiviteitenQuery:
    return_type = graphene.List(
        gebruikersactiviteit.GebruikersActiviteit,
        ids=graphene.List(graphene.Int, default_value=[]),
        burgerIds=graphene.List(graphene.Int, default_value=[]),
        afsprakenIds=graphene.List(graphene.Int, default_value=[]),
        huishoudenIds=graphene.List(graphene.Int, default_value=[]),
    )

    @staticmethod
    async def resolver(_root, _info, **kwargs):
        if (
                not kwargs["ids"]
                and not kwargs["burgerIds"]
                and not kwargs["afsprakenIds"]
                and not kwargs["huishoudenIds"]
        ):
            gebruikersactiviteiten = (
                hhb_dataloader().gebruikersactiviteiten_by_id.load_all()
            )
        else:
            gebruikersactiviteiten = []
            if kwargs["burgerIds"]:
                gebruikersactiviteiten = (
                    hhb_dataloader().gebruikersactiviteiten_by_burger.load_many(
                        kwargs["burgerIds"]
                    )
                )
            if kwargs["afsprakenIds"]:
                afspraken_list = (
                    hhb_dataloader().gebruikersactiviteiten_by_afspraken.load(
                        kwargs["afsprakenIds"]
                    )
                )
                gebruikersactiviteiten.extend(
                    x for x in afspraken_list if x not in gebruikersactiviteiten
                )
            if kwargs["ids"]:
                ids_list = (
                    hhb_dataloader().gebruikersactiviteiten_by_id.load_many(
                        kwargs["ids"]
                    )
                )
                gebruikersactiviteiten.extend(
                    x for x in ids_list if x not in gebruikersactiviteiten
                )
            if kwargs["huishoudenIds"]:
                afspraken_list = (
                    hhb_dataloader().gebruikersactiviteiten_by_huishouden.load(
                        kwargs["huishoudenIds"]
                    )
                )
                gebruikersactiviteiten.extend(
                    x for x in afspraken_list if x not in gebruikersactiviteiten
                )

        return gebruikersactiviteiten


class GebruikersActiviteitenPagedQuery:
    return_type = graphene.Field(
        gebruikersactiviteit.GebruikersActiviteitenPaged,
        start=graphene.Int(),
        limit=graphene.Int(),
        burgerIds=graphene.List(graphene.Int, default_value=[]),
        afsprakenIds=graphene.List(graphene.Int, default_value=[]),
        huishoudenIds=graphene.List(graphene.Int, default_value=[]),
    )

    @staticmethod
    async def resolver(_root, _info, **kwargs):
        if "start" in kwargs and "limit" in kwargs:
            if not kwargs["burgerIds"] and not kwargs["afsprakenIds"] and not kwargs["huishoudenIds"]:
                return hhb_dataloader().gebruikersactiviteiten_by_id.load_paged(
                    start=kwargs["start"], limit=kwargs["limit"], desc=True, sorting_column="timestamp"
                )
            else:
                if kwargs["burgerIds"] and kwargs["afsprakenIds"] and kwargs["huishoudenIds"]:
                    raise GraphQLError(f"Only burgerIds, afsprakenIds or huishoudenIds is supported. ")
                if kwargs["burgerIds"]:
                    return hhb_dataloader().gebruikersactiviteiten_by_burgers.load_paged(
                        keys=kwargs["burgerIds"], start=kwargs["start"], limit=kwargs["limit"],
                        desc=True, sorting_column="timestamp"
                    )
                if kwargs["afsprakenIds"]:
                    return hhb_dataloader().gebruikersactiviteiten_by_afspraken.load_paged(
                        keys=kwargs["afsprakenIds"], start=kwargs["start"], limit=kwargs["limit"],
                        desc=True, sorting_column="timestamp"
                    )
                if kwargs["huishoudenIds"]:
                    return hhb_dataloader().gebruikersactiviteiten_by_huishouden.load_paged(
                        keys=kwargs["huishoudenIds"], start=kwargs["start"], limit=kwargs["limit"],
                        desc=True, sorting_column="timestamp"
                    )
        else:
            raise GraphQLError(f"Query needs params 'start', 'limit'. ")

