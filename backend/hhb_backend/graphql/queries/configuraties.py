import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.configuratie import Configuratie
from hhb_backend.graphql.utils.gebruikersactiviteiten import gebruikers_activiteit_entities


class ConfiguratieQuery:
    return_type = graphene.Field(Configuratie, id=graphene.String(required=True))

    @classmethod
    def resolver(cls, _, info, id):
        result = hhb_dataloader().configuraties.load_one(id)
        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="configuratie", result=result),
        )
        return result


class ConfiguratiesQuery:
    return_type = graphene.List(
        Configuratie, ids=graphene.List(graphene.String)
    )

    @classmethod
    def resolver(cls, _root, info, ids=None):
        result = []
        if ids:
            result = hhb_dataloader().configuraties.load(ids)
        else:
            result = hhb_dataloader().configuraties.load_all()

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="configuratie", result=result)
        )

        return result
