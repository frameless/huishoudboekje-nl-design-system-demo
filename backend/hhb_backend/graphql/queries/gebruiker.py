import graphene
from flask import g

from hhb_backend.graphql.models.gebruiker import Gebruiker


class GebruikerQuery:
    return_type = graphene.Field(Gebruiker)

    @staticmethod
    def resolver(_root, _info):
        return g.current_user
