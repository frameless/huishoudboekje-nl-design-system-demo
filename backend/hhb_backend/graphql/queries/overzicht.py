""" GraphQL Overzicht query """
import logging
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.overzicht import Overzicht
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class OverzichtQuery:
    return_type = graphene.Field(Overzicht, burger_ids=graphene.List(graphene.Int, required=True), start_date=graphene.String(
        required=True), end_date=graphene.String(required=True))

    @classmethod
    def resolver(cls, _, info, burger_ids, start_date, end_date):
        logging.info(f"Get overzicht")
        result = hhb_dataloader().overzicht.load_huishouden_overzicht(
            burger_ids, start_date, end_date)
        AuditLogging.create(
            action=info.field_name,
            entities=[GebruikersActiviteitEntity(entityType="burger_overzicht", entityId=burger_id)
                      for burger_id in burger_ids] if len(burger_ids) > 0 else []
        )
        return result
