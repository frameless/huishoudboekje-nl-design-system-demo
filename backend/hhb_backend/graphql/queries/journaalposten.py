""" GraphQL Journaalpost query """
import graphene
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.journaalpost import Journaalpost
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
)


class JournaalpostQuery:
    return_type = graphene.Field(Journaalpost, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, _root, _info, id):
        result = hhb_dataloader().journaalposten.load_one(id)
        AuditLogging().create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="journaalpost", result=id
            )
        )
        return result


class JournaalpostenQuery:
    return_type = graphene.List(
        Journaalpost, ids=graphene.List(graphene.Int)
    )

    @classmethod
    def resolver(cls, _root, _info, ids=None):
        if ids:
            result = hhb_dataloader().journaalposten.load(ids)
        result = hhb_dataloader().journaalposten.load_all()

        AuditLogging().create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="journaalpost", result=ids
            )
        )

        return result
