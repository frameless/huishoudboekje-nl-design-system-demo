import graphene

from ..scalars.complex_filter import ComplexFilterType, ComplexBedragFilterType


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
    huishouden_id = ComplexFilterType()

    bedrag = ComplexBedragFilterType()
    tegen_rekening_id = ComplexFilterType()
    zoektermen = ComplexFilterType()
    iban = ComplexFilterType()
    rekeninghouder = ComplexFilterType()
