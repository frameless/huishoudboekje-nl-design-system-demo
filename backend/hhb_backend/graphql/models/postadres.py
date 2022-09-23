""" Postadres model as used in GraphQL queries """

import graphene


class Postadres(graphene.ObjectType):
    id = graphene.String()
    straatnaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    plaatsnaam = graphene.String()

    def resolve_huisnummer(self, _info):
        return self.get("houseNumber")

    def resolve_postcode(self, _info):
        return self.get("postalCode")

    def resolve_straatnaam(self, _info):
        return self.get("street")

    def resolve_plaatsnaam(self, _info):
        return self.get("locality")
