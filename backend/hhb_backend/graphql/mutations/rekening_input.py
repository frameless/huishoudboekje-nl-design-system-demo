import graphene


class RekeningInput(graphene.InputObjectType):
    iban = graphene.String()
    rekeninghouder = graphene.String()
