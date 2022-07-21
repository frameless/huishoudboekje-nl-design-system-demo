""" Signaal om kenbaar te maken wanneer een alarm is afgegaan """
import graphene
from flask import request
import hhb_backend.graphql.models.Alarm as alarm
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

    async def resolve_alarm(root, info):
        alarm_id = root.get("alarmId")
        if alarm_id is not None:
            return await request.dataloader.alarmen_by_id.load(alarm_id)

    async def resolve_bank_transactions(root, info):
        if transactionIds := root.get("banktransactieIds"):
            return (
                await hhb_dataloader().bank_transactions_by_id.load_many(transactionIds)
                or []
            )