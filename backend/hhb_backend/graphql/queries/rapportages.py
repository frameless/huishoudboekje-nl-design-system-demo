""" GraphQL Rapportage query """
import logging
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.rapportage import BurgerRapportage
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity

class BurgerRapportagesQuery:
    return_type = graphene.Field(graphene.List(BurgerRapportage), burger_ids=graphene.List(graphene.Int, required=True), start_date=graphene.String(required=True), end_date=graphene.String(required=True), rubrieken_ids=graphene.List(graphene.Int))

    @classmethod
    def resolver(cls, _, info, burger_ids, start_date, end_date, rubrieken_ids):
        logging.info(f"Get rapportages")
        result = hhb_dataloader().rapportage.load_rapportage_burger(burger_ids, start_date, end_date, rubrieken_ids)
        AuditLogging.create(
            action=info.field_name,
            entities=[GebruikersActiviteitEntity(entityType="burger_rapportage", entityId=burger_id) for burger_id in burger_ids] if len(burger_ids) > 0 else []
        )
        return result