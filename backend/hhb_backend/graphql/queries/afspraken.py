""" GraphQL Afspraken query """
from decimal import Decimal
import logging
from hhb_backend.graphql.dataloaders.afspraak_loader_concept import AfsprakenGetRequestBuilder
import graphene

import hhb_backend.graphql.models.afspraak as afspraak
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class AfspraakQuery:
    return_type = graphene.Field(afspraak.Afspraak, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, _, info, id):
        logging.info(f"Get afspraak")
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="afspraak", entityId=id)
            ]
        )
        return hhb_dataloader().afspraken.load_one(id)


class AfsprakenQuery:
    return_type = graphene.List(afspraak.Afspraak, ids=graphene.List(graphene.Int))

    @classmethod
    def resolver(cls, _, info, ids=None):
        logging.info(f"Get afspraken")
        if ids:
            result = hhb_dataloader().afspraken.load(ids)
        else:
            result = hhb_dataloader().afspraken.load_all()

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="afspraak", entityId=id)
                for id in ids
            ] if ids else []
        )
        return result
    

class SearchAfsprakenQuery:
    return_type = graphene.Field(afspraak.AfsprakenPaged, 
                                offset=graphene.Int(),
                                limit=graphene.Int(),
                                afspraak_ids=graphene.List(graphene.Int),
                                burger_ids=graphene.List(graphene.Int),
                                afdeling_ids=graphene.List(graphene.Int),
                                only_valid=graphene.Boolean(), 
                                min_bedrag=graphene.Int(),
                                max_bedrag=graphene.Int(),
                                zoektermen=graphene.List(graphene.String))

    @classmethod
    def resolver(cls, _, info, offset=None, limit=None, afspraak_ids=None, burger_ids=None, afdeling_ids=None, only_valid=None, min_bedrag=None, max_bedrag=None, zoektermen=None):
        logging.info(f"Get afspraken paged")

        afspraken_filter_builder = AfsprakenGetRequestBuilder()
        if limit is not None and offset is not None:
            afspraken_filter_builder.paged(limit, offset)

        if afspraak_ids is not None:
            afspraken_filter_builder.by_afspraak_ids(afspraak_ids)

        if burger_ids is not None:
            afspraken_filter_builder.by_burger_ids(burger_ids)

        if afdeling_ids is not None:
            afspraken_filter_builder.by_afdeling_ids(afdeling_ids)
        
        if only_valid is not None:
            afspraken_filter_builder.by_valid(only_valid)

        if min_bedrag is not None:
            afspraken_filter_builder.by_min_bedrag(min_bedrag)

        if max_bedrag is not None:
            afspraken_filter_builder.by_max_bedrag(max_bedrag)

        if zoektermen is not None:
            afspraken_filter_builder.by_zoektermen(zoektermen)

        result = hhb_dataloader().afspraken_concept.load_all(afspraken_filter_builder.request)
        
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="afspraak", entityId=resultAfspraak.get("id"))
                for resultAfspraak in result["afspraken"]
            ] if result else []
        )
        return result

