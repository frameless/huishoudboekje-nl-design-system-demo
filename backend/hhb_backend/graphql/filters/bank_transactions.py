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
