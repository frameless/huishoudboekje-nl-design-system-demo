import graphene


class Configuratie(graphene.ObjectType):
    id = graphene.String()
    waarde = graphene.String()
