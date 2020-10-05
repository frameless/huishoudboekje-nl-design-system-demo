from graphene import Schema
from .queries import RootQuery
from .mutations import RootMutation

schema = Schema(
    query=RootQuery,
    mutation=RootMutation
)
