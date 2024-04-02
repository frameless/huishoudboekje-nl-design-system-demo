""" GraphQL Journaalpost query """
import logging
from hhb_backend.graphql.models.journaalpost import JournaalpostTransactieRubriek
import graphene
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.journaalpost import Journaalpost
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class JournaalpostQuery:
    return_type = graphene.Field(Journaalpost, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, _root, info, id):
        logging.info(f"Get journaalpost")
        result = hhb_dataloader().journaalposten.load_one(id)
        AuditLogging().create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="journaalpost", entityId=id)
            ]
        )
        return result

class JournaalpostenByUuidsQuery:
    return_type = graphene.List(
        Journaalpost,
        uuids=graphene.List(graphene.String),
    )

    @classmethod
    def resolver(cls, _, info, uuids=None):
        logging.info(f"Get journaalposten by uuid")
        if(uuids is None or len(uuids) == 0):
            return None
        
        journaalposten = hhb_dataloader().journaalposten.by_uuids(uuids)
        AuditLogging.create(
            action=info.field_name,
                entities=[
                    GebruikersActiviteitEntity(
                        entityType="journaalpost", entityId=journaalpost.id)
                    for journaalpost in journaalposten
                ]
            )
        return sorted(journaalposten, key=lambda i: uuids.index(i.uuid))

class JournaalpostenQuery:
    return_type = graphene.List(
        Journaalpost, ids=graphene.List(graphene.Int)
    )

    @classmethod
    def resolver(cls, _root, info, ids=None):
        logging.info(f"Get journaalposten")
        if ids:
            result = hhb_dataloader().journaalposten.load(ids)
        result = hhb_dataloader().journaalposten.load_all()

        AuditLogging().create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="journaalpost", entityId=id)
                for id in ids
            ] if ids else []
        )

        return result

class JournaalpostenTransactionRubriekQuery:
    return_type = graphene.List(
        JournaalpostTransactieRubriek, transaction_ids=graphene.List(graphene.Int)
    )

    @classmethod
    def resolver(cls, _root, info, transaction_ids=None):
        logging.info(f"Get journaalpsoten rubriek")
        if transaction_ids:
            result = hhb_dataloader().journaalposten_transactie_rubriek.load(transaction_ids)
        else:
            result = []

        AuditLogging().create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="journaalpostbytransactionid", entityId=id)
                for id in transaction_ids
            ] if transaction_ids else []
        )

        return result
