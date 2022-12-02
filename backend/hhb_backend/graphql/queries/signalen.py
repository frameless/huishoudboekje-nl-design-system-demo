import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.signaal import Signaal
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities)


class SignaalQuery:
    return_type = graphene.Field(Signaal, id=graphene.String(required=True))

    @classmethod
    def resolver(cls, _root, _info, id):
        AuditLogging().create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="signaal", result=id),
        )
        return hhb_dataloader().signalen.load_one(id)


class SignalenQuery:
    return_type = graphene.List(Signaal, ids=graphene.List(graphene.String))

    @classmethod
    def resolver(cls, _root, _info, ids=None):
        entities = None

        if ids:
            entities = gebruikers_activiteit_entities(entity_type="signaal", result=ids)
            result = hhb_dataloader().signalen.load(ids)
        else:
            result = hhb_dataloader().signalen.load_all()

        AuditLogging().create(action=info.field_name, entities=entities)

        return result
