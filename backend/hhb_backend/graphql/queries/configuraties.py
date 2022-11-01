import graphene

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.configuratie import Configuratie
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class ConfiguratieQuery:
    return_type = graphene.Field(Configuratie, id=graphene.String(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id=None, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="configuratie", result=id
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    def resolver(cls, _root, _info, id):
        return hhb_dataloader().configuraties.load_one(id)


class ConfiguratiesQuery:
    return_type = graphene.List(
        Configuratie, ids=graphene.List(graphene.String)
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids=None, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="configuratie", result=ids
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    def resolver(cls, _root, _info, ids=None):
        if ids:
            return hhb_dataloader().configuraties.load(ids)
        return hhb_dataloader().configuraties.load_all()
