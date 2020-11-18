from core_service.database import db
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship


class BankTransaction(db.Model):
    __tablename__ = 'bank_transactions'

    id = Column(Integer, Sequence("bank_transactions_id_seq"), primary_key=True)

    # 20
    customer_statement_message_id = Column(Integer,
        ForeignKey('customer_statement_messages.id', ondelete='CASCADE'), nullable=False)

    transactie_datum = Column(Date)
    tegen_rekening = Column(String)
    is_credit = Column(Boolean)
    bedrag = Column(Integer)
