""" GraphQL GebruikersActiviteiten query """
import graphene
from flask import request
from graphql import GraphQLError

import hhb_backend.graphql.models.gebruikersactiviteit as gebruikersactiviteit


class GebruikersActiviteitQuery:
    return_type = graphene.Field(gebruikersactiviteit.GebruikersActiviteit, id=graphene.Int(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.gebruikersactiviteiten_by_id.load(kwargs["id"])


class GebruikersActiviteitenQuery:
    return_type = graphene.List(
        gebruikersactiviteit.GebruikersActiviteit,
        ids=graphene.List(graphene.Int, default_value=[]),
        burgerIds=graphene.List(graphene.Int, default_value=[]),
        afsprakenIds=graphene.List(graphene.Int, default_value=[]),
        huishoudenIds=graphene.List(graphene.Int, default_value=[]),
    )

    @staticmethod
    async def resolver(root, info, **kwargs):
        if (
                not kwargs["ids"]
                and not kwargs["burgerIds"]
                and not kwargs["afsprakenIds"]
                and not kwargs["huishoudenIds"]
        ):
            gebruikersactiviteiten = (
                request.dataloader.gebruikersactiviteiten_by_id.get_all_and_cache()
            )
        else:
            gebruikersactiviteiten = []
            if kwargs["burgerIds"]:
                gebruikersactiviteiten = (
                    request.dataloader.gebruikersactiviteiten_by_burgers.get_by_ids(
                        kwargs["burgerIds"]
                    )
                )
            if kwargs["afsprakenIds"]:
                afspraken_list = (
                    request.dataloader.gebruikersactiviteiten_by_afspraken.get_by_ids(
                        kwargs["afsprakenIds"]
                    )
                )
                gebruikersactiviteiten.extend(
                    x for x in afspraken_list if x not in gebruikersactiviteiten
                )
            if kwargs["ids"]:
                ids_list = (
                    await request.dataloader.gebruikersactiviteiten_by_id.load_many(
                        kwargs["ids"]
                    )
                )
                gebruikersactiviteiten.extend(
                    x for x in ids_list if x not in gebruikersactiviteiten
                )
            if kwargs["huishoudenIds"]:
                afspraken_list = (
                    request.dataloader.gebruikersactiviteiten_by_huishouden.get_by_ids(
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
    async def resolver(root, info, **kwargs):
        if "start" in kwargs and "limit" in kwargs:
            if not kwargs["burgerIds"] and not kwargs["afsprakenIds"] and not kwargs["huishoudenIds"]:
                return request.dataloader.gebruikersactiviteiten_by_id.get_all_paged \
                    (start=kwargs["start"], limit=kwargs["limit"], desc=True, sortingColumn="timestamp")
            else:
                if kwargs["burgerIds"] and kwargs["afsprakenIds"] and kwargs["huishoudenIds"]:
                    raise GraphQLError(f"Only burgerIds, afsprakenIds or huishoudenIds is supported. ")
                if kwargs["burgerIds"]:
                    return request.dataloader.gebruikersactiviteiten_by_burgers.get_by_ids_paged(
                            kwargs["burgerIds"], start=kwargs["start"], limit=kwargs["limit"], desc=True, sortingColumn="timestamp")
                if kwargs["afsprakenIds"]:
                    return request.dataloader.gebruikersactiviteiten_by_afspraken.get_by_ids_paged(
                            kwargs["afsprakenIds"], start=kwargs["start"], limit=kwargs["limit"], desc=True, sortingColumn="timestamp")
                if kwargs["huishoudenIds"]:
                    return request.dataloader.gebruikersactiviteiten_by_huishouden.get_by_ids_paged(
                            kwargs["huishoudenIds"], start=kwargs["start"], limit=kwargs["limit"], desc=True, sortingColumn="timestamp")
        else:
            raise GraphQLError(f"Query needs params 'start', 'limit'. ")

