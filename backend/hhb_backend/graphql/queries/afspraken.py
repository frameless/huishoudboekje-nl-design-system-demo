""" GraphQL Afspraken query """
import graphene

import hhb_backend.graphql.models.afspraak as afspraak
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class AfspraakQuery:
    return_type = graphene.Field(afspraak.Afspraak, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, _, info, id):
        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="afspraak", result=id)
        )
        return hhb_dataloader().afspraken.load_one(id)


class AfsprakenQuery:
    return_type = graphene.List(afspraak.Afspraak, ids=graphene.List(graphene.Int))

    @classmethod
    def resolver(cls, _, info, ids=None):
        entities = None

        if ids:
            entities = gebruikers_activiteit_entities(entity_type="afspraak", result=ids),
            result = hhb_dataloader().afspraken.load(ids)
        else:
            result = hhb_dataloader().afspraken.load_all()

        AuditLogging.create(action=info.field_name, entities=entities)
        return result
