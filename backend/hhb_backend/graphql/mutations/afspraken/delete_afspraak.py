""" GraphQL mutation for deleting a Afspraak """

import logging
from hhb_backend.delete_alarms_producer import DeleteAlarmsProducer
import graphene
import requests

import hhb_backend.graphql.models.afspraak as graphene_afspraak
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class DeleteAfspraak(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    previous = graphene.Field(lambda: graphene_afspraak.Afspraak)

    @staticmethod
    def mutate(self, info, id):
        """ Delete current afspraak """
        logging.info(f"Deleting afspraak: {id}")
        previous = hhb_dataloader().afspraken.load_one(id)
        if not previous:
            raise GraphQLError("Afspraak not found")

        # Check if afspraak in use by journaalposten
        if previous.journaalposten:
            raise GraphQLError(
                "Afspraak is linked to one or multiple journaalposten - deletion is not possible.")

        try:
            deleteAlarmsProducer = DeleteAlarmsProducer.create(
                [previous.alarm_id], [], True)
        except:
            raise GraphQLError(f"Failed deleting alarms for this citizen")

        response = requests.delete(
            f"{settings.HHB_SERVICES_URL}/afspraken/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        entities = [GebruikersActiviteitEntity(entityType="afspraak", entityId=id),
                    GebruikersActiviteitEntity(
            entityType="burger", entityId=previous["burger_id"])]
        if previous["afdeling_id"] != None:
            entities.append(GebruikersActiviteitEntity(
                entityType="afdeling", entityId=previous["afdeling_id"]))

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(
                    entityType="afspraak", entityId=previous["id"]),
                GebruikersActiviteitEntity(
                    entityType="burger", entityId=previous["burger_id"]),
                GebruikersActiviteitEntity(
                    entityType="afdeling", entityId=previous["afdeling_id"])
            ],
            before=dict(afspraak=previous),
        )

        return DeleteAfspraak(ok=True, previous=dict(previous))
