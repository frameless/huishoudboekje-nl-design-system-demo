from sqlalchemy import Column, Integer, String, Sequence, Text, CheckConstraint
from core_service.database import db


class Configuratie(db.Model):
    __tablename__ = 'configuratie'

    id = Column(String, primary_key=True)
    waarde = Column(Text)
