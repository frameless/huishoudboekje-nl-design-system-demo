import graphene


class Gebruiker(graphene.ObjectType):
    email = graphene.String()
    token = graphene.String()


    @staticmethod
    def resolve_email(root, _info):
        return root.email

    @staticmethod
    def resolve_token(root, _info):
        return root.token
