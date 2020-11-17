""" Factories to generate objects within a test scope """
from datetime import date

import pytest
from models import BankTransaction


class BankTransactionFactory:
    """ Factory for BankTransaction objects """

    def __init__(self, session, csm_factory):
        self.csm_factory = csm_factory
        self.dbsession = session

    def createBankTransaction(
            self,
            customer_statement_message_id=None,
            statement_line="statement_line",
            information_to_account_owner="information_to_account_owner",
            transactie_datum: date = date(2020, 10, 10),
            tegen_rekening: str = "NL02ABNA0123456789",
            is_credit: bool = True,
            bedrag: int = 100
    ):
        if not customer_statement_message_id:
            csm = self.csm_factory.create_customer_statement_message()
            self.dbsession.add(csm)
            self.dbsession.flush()
            customer_statement_message_id = csm.id
        bank_transaction = BankTransaction(
            customer_statement_message_id=customer_statement_message_id,
            statement_line=statement_line,
            information_to_account_owner=information_to_account_owner,
            transactie_datum=transactie_datum,
            tegen_rekening=tegen_rekening,
            is_credit=is_credit,
            bedrag=bedrag
        )
        self.dbsession.add(bank_transaction)
        self.dbsession.flush()
        return bank_transaction


@pytest.fixture(scope="function")
def bank_transaction_factory(session, request, csm_factory):
    """
    creates an instance of the BankTransactionFactory with function scope dbsession
    """
    return BankTransactionFactory(session, csm_factory)
