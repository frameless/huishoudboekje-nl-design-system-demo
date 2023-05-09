import logging
from hhb_backend.graphql.dataloaders import hhb_dataloader
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.models.saldo import Saldo
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class SaldoQuery:
    return_type = graphene.Field(graphene.List(Saldo), burger_ids=graphene.List(
        graphene.Int), date=graphene.String())

    @classmethod
    def resolver(cls, _root, info, burger_ids, date):
        result = hhb_dataloader().saldo.get_saldo(burger_ids, date)
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(
                    entityType="saldo", entityId=entry["id"])
                for entry in result
            ]
        )
        return result


class SaldoClosestQuery:
    return_type = graphene.Field(graphene.List(Saldo), burger_ids=graphene.List(
        graphene.Int), date=graphene.String())

    @classmethod
    def resolver(cls, _root, info, burger_ids, date):
        result = hhb_dataloader().saldo.get_closest_saldo(burger_ids, date)
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(
                    entityType="saldo", entityId=entry["id"])
                for entry in result
            ]
        )
        return result


class SaldoRangeQuery:
    return_type = graphene.Field(graphene.List(Saldo), burger_ids=graphene.List(
        graphene.Int), startdate=graphene.String(), enddate=graphene.String())

    @classmethod
    def resolver(cls, _root, info, burger_ids, startdate, enddate):
        result = hhb_dataloader().saldo.get_saldo_range(burger_ids, startdate, enddate)
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(
                    entityType="saldo", entityId=entry["id"])
                for entry in result
            ]
        )
        return result


class SaldosQuery:
    return_type = graphene.Field(graphene.List(Saldo), burger_ids=graphene.List(
        graphene.Int))

    @classmethod
    def resolver(cls, _root, info, burger_ids, date):
        result = hhb_dataloader().saldo.get_saldos(burger_ids)
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(
                    entityType="saldo", entityId=entry["id"])
                for entry in result
            ]
        )
        return result
