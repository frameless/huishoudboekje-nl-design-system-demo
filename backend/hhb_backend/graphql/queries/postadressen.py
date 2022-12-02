import graphene
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.postadres import Postadres
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
)


class PostadresQuery:
    return_type = graphene.Field(Postadres, id=graphene.String(required=True))

    @classmethod
    def resolver(cls, _root, info, id):
        result = hhb_dataloader().postadressen.load_one(id)
        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="postadres", result=id)
        )
        return result


class PostadressenQuery:
    return_type = graphene.List(Postadres, ids=graphene.List(graphene.String))

    @classmethod
    def resolver(cls, _root, info, ids=None):
        if ids:
            result = hhb_dataloader().postadressen.load(ids)
        else:
            result = hhb_dataloader().postadressen.load_all()

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="postadres", result=ids),
        )

        return result
