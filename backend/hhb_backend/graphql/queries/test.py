""" GraphQL Signalen query """
import graphene
import random

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.signaal import Signaal
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)


class TestQueryResult(graphene.ObjectType):
    ok = graphene.Boolean()


class TestQuery:
    return_type = graphene.Field(TestQueryResult)

    @classmethod
    def resolver(cls, _root, _info):
        return {
            "ok": randomly_failing()
        }


def randomly_failing():
    if get_random_boolean():
        raise Exception("Something went wrong")
    return get_random_boolean()


def get_random_boolean():
    return random.choice([True, False])
