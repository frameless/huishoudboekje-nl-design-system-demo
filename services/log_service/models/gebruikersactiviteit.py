from core_service.database import db
from sqlalchemy import Column, Integer, String, Sequence, TIMESTAMP
from sqlalchemy.dialects.postgresql import JSONB


class GebruikersActiviteit(db.Model):
    __tablename__ = "gebruikersactiviteiten"

    id = Column(Integer, Sequence("gebruikersactiviteiten_id_seq"), primary_key=True)
    timestamp = Column(TIMESTAMP(timezone=True), nullable=False)
    gebruiker_id = Column(String)
    action = Column(String, nullable=False)
    entities = Column(JSONB, nullable=False)
    snapshot_before = Column(JSONB(none_as_null=True))
    snapshot_after = Column(JSONB(none_as_null=True))
    meta = Column(JSONB, nullable=False)
