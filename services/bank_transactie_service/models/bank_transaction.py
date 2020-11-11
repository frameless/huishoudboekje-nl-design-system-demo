from sqlalchemy import Column, Integer, String, Sequence, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from core_service.database import db


class BankTransaction(db.Model):
    __tablename__ = 'bank_transactions'

    id = Column(Integer, Sequence("bank_transactions_id_seq"), primary_key=True)

    # 20
    customer_statement_message_id = Column(Integer, 
        ForeignKey('customer_statement_messages.id'), nullable=False)
    customer_statement_message = relationship("CustomerStatementMessage", 
        back_populates="bank_transactions")

    statement_line = Column(String) # 61
    information_to_account_owner = Column(String) # 86
    