import graphene
import requests
from hhb_backend.graphql.models.gebruiker import Gebruiker

result = graphene.List(Gebruiker)

def resolver(root, info):
    print("=== ROOT ===")
    print(root)
    print(dir(root))
    print("=== INFO ===")
    print(info.context)
    print(dir(info.context))
    # response = requests.get('gebruikers/')
    # print(response)
    # print(response.json)
    return []
