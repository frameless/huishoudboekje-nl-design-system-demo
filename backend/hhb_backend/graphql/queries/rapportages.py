""" GraphQL Rapportage query """
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.rapportage import BurgerRapportage
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity

class BurgerRapportageQuery:
    return_type = graphene.Field(BurgerRapportage, burger_id=graphene.Int(required=True), start_date=graphene.String(required=True), end_date=graphene.String(required=True))

    @classmethod
    def resolver(cls, _, info, burger_id, start_date, end_date):
        result = hhb_dataloader().rapportage.load_rapportage_burger(burger_id, start_date, end_date)
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="burger_rapportage", entityId=burger_id)
            ]
        )
        return result