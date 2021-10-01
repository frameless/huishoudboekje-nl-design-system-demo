""" Postadres model as used in GraphQL queries """
import graphene


class Postadres(graphene.ObjectType):
    """ GraphQL Burger model """
    id = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    straatnaam = graphene.String()
    plaatsnaam = graphene.String()

    def resolve_huisnummer(root, info):
        return root.get("houseNumber")

    def resolve_postcode(root, info):
        return root.get("postalCode")

    def resolve_straatnaam(root, info):
        return root.get("street")

    def resolve_plaatsnaam(root, info):
        return root.get("locality")
