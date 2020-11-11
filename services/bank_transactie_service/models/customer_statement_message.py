from sqlalchemy import Column, Integer, String, Sequence, DateTime
from sqlalchemy.orm import relationship
from core_service.database import db


class CustomerStatementMessage(db.Model):
    __tablename__ = 'customer_statement_messages'

    id = Column(Integer, Sequence("customer_statement_messages_id_seq"), primary_key=True)
    upload_date = Column(DateTime, nullable=False)
    raw_data = Column(String, nullable=False)

    transaction_reference_number = Column(String) # Tag 20
    related_reference = Column(String) # Tag 21
    account_identification = Column(String) # Tag 25
    sequence_number = Column(String) # Tag 28C
    opening_balance = Column(Integer) # Tag 60f
    closing_balance = Column(Integer) # Tag 62f
    closing_available_funds = Column(Integer) # Tag 64
    forward_available_balance = Column(Integer) # Tag 65

    bank_transactions = relationship("BankTransaction", back_populates="customer_statement_message")