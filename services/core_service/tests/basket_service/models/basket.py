from sqlalchemy import Column, Integer, Sequence, String
from sqlalchemy.orm import relationship

from core_service.database import db


class Basket(db.Model):
    __tablename__ = 'basket'

    id = Column(Integer, Sequence('basket_id_seq'), primary_key=True)
    name = Column(String)

    fruits = relationship("Fruit", back_populates="basket", cascade="all, delete")
