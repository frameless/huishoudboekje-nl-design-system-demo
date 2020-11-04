from sqlalchemy import Column, Integer, String, Sequence, DateTime

from core.database import db


class CustomerStatementMessage(db.Model):
    __tablename__ = 'customer_statement_messages'

    id = Column(Integer, Sequence("customer_statement_messages_id_seq"), primary_key=True)
    upload_date = Column(DateTime, nullable=False)
    raw_data = Column(String, nullable=False)

    # Tag 20
    transaction_reference_number = Column(String)
    # Tag 21
    related_reference = Column(String)
    # Tag 25
    account_identification = Column(String)
    # Tag 28C
    sequence_number = Column(String)
    # Tag 60f
    opening_balance = Column(Integer)
    # Tag 62f
    closing_balance = Column(Integer)
    # Tag 64
    closing_available_funds = Column(Integer)
    # Tag 65
    forward_available_balance = Column(Integer)
