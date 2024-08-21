""" Burger model as used in GraphQL queries """
import graphene
from graphql import GraphQLError

import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.gebruikersactiviteit as gebruikersactiviteit
import hhb_backend.graphql.models.huishouden as huishouden
import hhb_backend.graphql.models.rekening as rekening
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.pageinfo import PageInfo
from hhb_backend.graphql.utils.dates import to_date


class Burger(graphene.ObjectType):
    id = graphene.Int()
    uuid = graphene.UUID()
    bsn = graphene.Int()
    voorletters = graphene.String()
    voornamen = graphene.String()
    achternaam = graphene.String()
    geboortedatum = graphene.Date()
    end_date = graphene.String()
    telefoonnummer = graphene.String()
    email = graphene.String()
    straatnaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    plaatsnaam = graphene.String()
    saldo_alarm = graphene.Boolean()
    rekeningen = graphene.List(lambda: rekening.Rekening)
    afspraken = graphene.List(lambda: afspraak.Afspraak)
    huishouden_id = graphene.Int()
    huishouden = graphene.Field(lambda: huishouden.Huishouden)
    gebruikersactiviteiten = graphene.List(
        lambda: gebruikersactiviteit.GebruikersActiviteit)

    def resolve_iban(self, info):
        rekeningen = Burger.resolve_rekeningen(self, info)
        if rekeningen:
            return rekeningen[0].get('iban')
        return None

    def resolve_rekeningen(self, _info):
        """ Get rekeningen when requested """
        return hhb_dataloader().rekeningen.by_burger(self.get('id')) or []

    def resolve_afspraken(self, _info):
        return hhb_dataloader().afspraken.by_burger(self.get('id')) or []

    def resolve_gebruikersactiviteiten(self, _info):
        return hhb_dataloader().gebruikersactiviteiten.by_burger(self.get('id')) or []

    def resolve_huishouden(self, _info):
        return hhb_dataloader().huishoudens.load_one(self.get('huishouden_id'))

    def resolve_geboortedatum(self, _info):
        if value := self.get('geboortedatum'):
            return to_date(value)

    @staticmethod
    def bsn_length(bsn):
        if len(str(bsn)) != 9 and len(str(bsn)) != 8:
            raise GraphQLError(
                "BSN is not valid: BSN should consist of 8 or 9 digits.")

    @staticmethod
    def bsn_elf_proef(bsn):
        total_sum = 0
        length = int(len(str(bsn)))
        for digit in str(bsn):
            total_sum = total_sum + (int(digit) * length)
            if length == 2:
                length = -1
            else:
                length = length - 1
        if total_sum % 11 != 0:
            raise GraphQLError(
                "BSN is not valid: BSN does not meet the 11-proef requirement.")


class BurgersPaged(graphene.ObjectType):
    burgers = graphene.List(
        Burger
    )
    page_info = graphene.Field(lambda: PageInfo)
