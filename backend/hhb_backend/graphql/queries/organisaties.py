""" GraphQL Gebruikers query """
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.organisatie import Organisatie
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class OrganisatieQuery:
    return_type = graphene.Field(Organisatie, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, root, info, id):
        AuditLogging().create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="organisatie", entityId=id)
            ]
        )
        return hhb_dataloader().organisaties.load_one(id)


class OrganisatiesQuery:
    return_type = graphene.List(
        Organisatie, ids=graphene.List(graphene.Int)
    )

    @classmethod
    def resolver(cls, root, info, ids=None):
        if ids:
            result = hhb_dataloader().organisaties.load(ids)
        else:
            result = hhb_dataloader().organisaties.load_all()

        AuditLogging().create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="organisatie", entityId=id)
                for id in ids
            ] if ids else []
        )

        return result
