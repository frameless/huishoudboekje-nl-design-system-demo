import graphene

from ..scalars.complex_filter import ComplexFilterType


class BurgerFilter(graphene.InputObjectType):
    OR = graphene.Field(lambda: BurgerFilter)
    AND = graphene.Field(lambda: BurgerFilter)
    id = ComplexFilterType()
    telefoonnummer = ComplexFilterType()
    email = ComplexFilterType()
    geboortedatum = ComplexFilterType()
    iban = ComplexFilterType()
    achternaam = ComplexFilterType()
    huisnummer = ComplexFilterType()
    postcode = ComplexFilterType()
    straatnaam = ComplexFilterType()
    voorletters = ComplexFilterType()
    voornamen = ComplexFilterType()
    plaatsnaam = ComplexFilterType()
    huishouden = ComplexFilterType()
