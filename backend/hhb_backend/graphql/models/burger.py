""" Burger model as used in GraphQL queries """
import graphene
from flask import request

import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.models.gebruikersactiviteit as gebruikersactiviteit
import hhb_backend.graphql.models.huishouden as huishouden
from hhb_backend.graphql.models.pageinfo import PageInfo
from graphql import GraphQLError


class Burger(graphene.ObjectType):
    id = graphene.Int()
    bsn = graphene.Int()
    voorletters = graphene.String()
    voornamen = graphene.String()
    achternaam = graphene.String()
    geboortedatum = graphene.String()
    telefoonnummer = graphene.String()
    email = graphene.String()
    straatnaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    plaatsnaam = graphene.String()
    rekeningen = graphene.List(lambda: rekening.Rekening)
    afspraken = graphene.List(lambda: afspraak.Afspraak)
    huishouden = graphene.Field(lambda: huishouden.Huishouden)
    gebruikersactiviteiten = graphene.List(lambda: gebruikersactiviteit.GebruikersActiviteit)

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
        return request.dataloader.gebruikersactiviteiten_by_burgers.get_by_id(root.get('id')) or []

    async def resolve_huishouden(root, info):
        return await request.dataloader.huishoudens_by_id.load(root.get('huishouden_id'))

    def bsn_length(self, bsn):
        if len(str(bsn)) != 9 and len(str(bsn)) != 8 :
            raise GraphQLError("BSN is not valid: BSN should consist of 8 or 9 digits.")

    def bsn_elf_proef(self, bsn):
        total_sum = 0
        length = int(len(str(bsn)))
        for digit in str(bsn):
            total_sum = total_sum + (int(digit) * length)
            if length == 2:
                length = -1
            else:
                length = length - 1
        if total_sum % 11 != 0:
            raise GraphQLError("BSN is not valid: BSN does not meet the 11-proef requirement.")


class BurgersPaged(graphene.ObjectType):
    burgers = graphene.List(
        Burger
    )
    page_info = graphene.Field(lambda: PageInfo)
