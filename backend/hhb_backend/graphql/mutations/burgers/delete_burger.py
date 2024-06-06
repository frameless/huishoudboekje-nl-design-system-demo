""" GraphQL mutation for deleting a Burger """

from datetime import datetime
import logging

from hhb_backend.delete_alarms_producer import DeleteAlarmsProducer
import graphene
import requests

import hhb_backend.graphql.models.burger as graphene_burger
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class DeleteBurger(graphene.Mutation):
    class Arguments:
        # burger arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: graphene_burger.Burger)

    @staticmethod
    def mutate(self, info, id):
        """Delete current burger"""
        logging.info(f"Deleting burger {id}")
        previous = hhb_dataloader().burgers.load_one(id)
        if not previous:
            raise GraphQLError(f"Burger with id {id} not found")

        afspraken = hhb_dataloader().afspraken.by_burger(id)
        alarm_ids = []
        input = {'valid_through': datetime.now().strftime("%Y-%m-%d")}
        for afspraak in afspraken:
            alarm_ids.append(afspraak.alarm_id)
            response = requests.post(
                f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak.id}",
                json=input,
            )
            try:
                if not response.ok:
                    raise GraphQLError(f"Upstream API responded: {response.text}")
            except:
                if response.status_code != 201:
                    raise GraphQLError(f"Upstream API responded: {response.text}")

        try:
            deleteAlarmsProducer = DeleteAlarmsProducer.create(alarm_ids, [previous.uuid], True)
        except:
            raise GraphQLError(f"Failed deleting alarms for this citizen")

        response = requests.delete(f"{settings.HHB_SERVICES_URL}/burgers/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="burger", entityId=id)
            ],
            before=dict(burger=previous),
        )

        return DeleteBurger(ok=True, previous=previous)
