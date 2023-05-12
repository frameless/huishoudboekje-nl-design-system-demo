import graphene

from ..scalars.complex_filter import ComplexFilterType, ComplexBedragFilterType


class BankTransactionFilter(graphene.InputObjectType):
    OR = graphene.Argument(lambda: BankTransactionFilter)
    AND = graphene.Argument(lambda: BankTransactionFilter)
    is_geboekt = graphene.Boolean()
    is_credit = graphene.Boolean()
    id = ComplexFilterType()
    bedrag = ComplexBedragFilterType()
    tegen_rekening = ComplexFilterType()
    statement_line = ComplexFilterType()
    transactie_datum = ComplexFilterType()


class BankTransactionSearchFilter(graphene.InputObjectType):
    burger_ids = graphene.List(graphene.Int)
    automatisch_geboekt = graphene.Boolean()
    min_bedrag = graphene.Int()
    max_bedrag = graphene.Int()
    start_date = graphene.String()
    end_date = graphene.String()
    ibans = graphene.List(graphene.String)
    only_booked = graphene.Boolean()
    only_credit = graphene.Boolean()
    zoektermen = graphene.List(graphene.String)
    organisatie_ids = graphene.List(graphene.Int)