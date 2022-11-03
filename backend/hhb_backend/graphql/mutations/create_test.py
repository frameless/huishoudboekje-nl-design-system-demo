""" GraphQL mutatie voor het aanmaken van een Test """
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.queries.test import randomly_failing, get_random_boolean


class CreateTest(graphene.Mutation):
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, **kwargs):
        if randomly_failing():
            raise Exception("Something went wrong")

        AuditLogging.create(
            action=info.field_name,
        )
        return CreateTest(ok=get_random_boolean())
