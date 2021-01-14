from core_service.database import db
from sqlalchemy import Column, Integer, String, Sequence, DateTime
from sqlalchemy.dialects.postgresql import JSONB


class GebruikersActiviteit(db.Model):
    __tablename__ = 'gebruikersactiviteiten'

    id = Column(Integer, Sequence("gebruikersactiviteiten_id_seq"), primary_key=True)
    timestamp = Column(DateTime, nullable=False)
    gebruiker_id = Column(Integer)
    action = Column(String, nullable=False)
    entities = Column(JSONB, nullable=False)
    snapshot_before = Column(JSONB)
    snapshot_after = Column(JSONB)
    meta = Column(JSONB, nullable=False)
