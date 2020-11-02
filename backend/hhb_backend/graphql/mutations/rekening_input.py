import graphene


class RekeningInput(graphene.InputObjectType):
    id = graphene.Int()
    iban = graphene.String()
    rekeninghouder = graphene.String()
