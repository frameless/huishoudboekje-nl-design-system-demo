""" GraphQL Postadressen query """
import graphene

import hhb_backend.graphql.models.postadres as postadres
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class PostadresQuery:
    return_type = graphene.Field(postadres.Postadres, id=graphene.String(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="postadres", result=id)
        )

    @classmethod
    @log_gebruikers_activiteit
    def resolver(cls, _root, _info, id):
        return hhb_dataloader().postadressen.load_one(id)


class PostadressenQuery:
    return_type = graphene.List(
        postadres.Postadres, ids=graphene.List(graphene.String)
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids=None, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="postadres", result=ids),
        )

    @classmethod
    @log_gebruikers_activiteit
    def resolver(cls, _root, _info, ids=None):
        if ids:
            return hhb_dataloader().postadressen.load(ids)
        return hhb_dataloader().postadressen.load_all()
