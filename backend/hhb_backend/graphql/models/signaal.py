""" Signaal om kenbaar te maken wanneer een alarm is afgegaan """
import graphene

import hhb_backend.graphql.models.alarm as alarm
import hhb_backend.graphql.models.bank_transaction as banktransactie
from hhb_backend.graphql.dataloaders import hhb_dataloader


class Signaal(graphene.ObjectType):
    id = graphene.String()
    alarm = graphene.Field(lambda: alarm.Alarm)
    bank_transactions = graphene.List(lambda: banktransactie.BankTransaction)
    isActive = graphene.Boolean()
    type = graphene.String()
    actions = graphene.List(graphene.String, default_value=[])
    context = graphene.String()
    bedragDifference = graphene.String()
    timeUpdated = graphene.String()

    async def resolve_alarm(self, _info):
        alarm_id = self.get("alarmId")
        if alarm_id is not None:
            return hhb_dataloader().alarms.load_one(alarm_id)

    async def resolve_bank_transactions(self, _info):
        if transactionIds := self.get("banktransactieIds"):
            return hhb_dataloader().bank_transactions.load(transactionIds) or []
