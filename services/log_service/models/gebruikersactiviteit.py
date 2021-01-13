from core_service.database import db
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Date, Boolean


class GebruikersActiviteit(db.Model):
    __tablename__ = 'gebruikersactiviteiten'

    id = Column(Integer, Sequence("gebruikersactiviteiten_id_seq"), primary_key=True)
    # COLUMNS!!
    transactie_datum = Column(Date)
    tegen_rekening = Column(String)
    is_credit = Column(Boolean)
    bedrag = Column(Integer)
