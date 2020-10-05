import graphene

class Gebruiker(graphene.ObjectType):
    telefoonnummer = graphene.String()
    email = graphene.String()
    geboortedatum = graphene.Date()