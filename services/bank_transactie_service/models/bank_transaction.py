from core_service.database import db
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, DateTime, Boolean, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID


class BankTransaction(db.Model):
    __tablename__ = 'bank_transactions'

    id = Column(Integer, Sequence("bank_transactions_id_seq"), primary_key=True)
    uuid = Column(UUID, default = func.gen_random_uuid(), nullable = False, unique = True, index = True)

    # 20
    customer_statement_message_id = Column(
        Integer,
        ForeignKey('customer_statement_messages.id'), 
        nullable=False
    )

    # customer_statement_message_uuid = Column(
    #     UUID,
    #     ForeignKey('customer_statement_messages.uuid'),
    #     nullable=False
    # )
    customer_statement_message = relationship("CustomerStatementMessage", back_populates="bank_transactions")

    statement_line = Column(String)  # 61
    information_to_account_owner = Column(String)  # 86

    transactie_datum = Column(DateTime)
    tegen_rekening = Column(String)
    is_credit = Column(Boolean)
    bedrag = Column(Integer)
    is_geboekt = Column(Boolean, index=True, default=False)
