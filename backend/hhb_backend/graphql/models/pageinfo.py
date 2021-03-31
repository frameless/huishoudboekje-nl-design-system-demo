import graphene


class PageInfo(graphene.ObjectType):
    count = graphene.Int()
    start = graphene.Int()
    limit = graphene.Int()
