""" Burger model as used in GraphQL queries """
import graphene
from flask import request

import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.models.gebruikersactiviteit as gebruikersactiviteit
import hhb_backend.graphql.models.huishouden as huishouden
from hhb_backend.graphql.models.pageinfo import PageInfo


class Burger(graphene.ObjectType):
    """ GraphQL Burger model """
    id = graphene.Int()
    telefoonnummer = graphene.String()
    email = graphene.String()
    geboortedatum = graphene.String()
    iban = graphene.String(deprecation_reason="Please use 'rekeningen'")
    achternaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    straatnaam = graphene.String()
    voorletters = graphene.String()
    voornamen = graphene.String()
    plaatsnaam = graphene.String()
    rekeningen = graphene.List(lambda: rekening.Rekening)
    afspraken = graphene.List(lambda: afspraak.Afspraak)
    gebruikersactiviteiten = graphene.List(lambda: gebruikersactiviteit.GebruikersActiviteit)
    huishouden = graphene.Field(lambda: huishouden.Huishouden)

    def resolve_iban(root, info):
        rekeningen = Burger.resolve_rekeningen(root, info)
        if rekeningen:
            return rekeningen[0].get('iban')
        return None

    async def resolve_rekeningen(root, info):
        """ Get rekeningen when requested """
        return await request.dataloader.rekeningen_by_burger.load(root.get('id')) or []

    async def resolve_afspraken(root, info):
        return await request.dataloader.afspraken_by_burger.load(root.get('id')) or []

    async def resolve_gebruikersactiviteiten(root, info):
        return request.dataloader.gebruikersactiviteiten_by_gebruikers.get_by_id(root.get('id')) or []

    async def resolve_huishouden(root, info):
        return await request.dataloader.huishoudens_by_id.load(root.get('huishouden_id'))


class BurgersPaged(graphene.ObjectType):
    burgers = graphene.List(
        Burger
    )
    page_info = graphene.Field(lambda: PageInfo)
