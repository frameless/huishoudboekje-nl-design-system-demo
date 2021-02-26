""" GraphQL GebruikersActiviteiten query """
import graphene
from flask import request

from hhb_backend.graphql.models.gebruikersactiviteit import GebruikersActiviteit


class GebruikersActiviteitQuery:
    return_type = graphene.Field(GebruikersActiviteit, id=graphene.Int(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.gebruikersactiviteiten_by_id.load(kwargs["id"])


class GebruikersActiviteitenQuery:
    return_type = graphene.List(
        GebruikersActiviteit,
        ids=graphene.List(graphene.Int, default_value=[]),
        burgerIds=graphene.List(graphene.Int, default_value=[]),
        afsprakenIds=graphene.List(graphene.Int, default_value=[]),
    )

    @staticmethod
    async def resolver(root, info, **kwargs):
        if (
            not kwargs["ids"]
            and not kwargs["burgerIds"]
            and not kwargs["afsprakenIds"]
        ):
            gebruikersactiviteiten = (
                request.dataloader.gebruikersactiviteiten_by_id.get_all_and_cache()
            )
        else:
            gebruikersactiviteiten = []
            if kwargs["gebruikerIds"]:
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

        return gebruikersactiviteiten
