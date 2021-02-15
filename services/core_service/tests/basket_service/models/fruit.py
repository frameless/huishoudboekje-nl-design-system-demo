from sqlalchemy import Column, ForeignKey, Integer, Sequence, String
from sqlalchemy.orm import relationship

from core_service.database import db


class Fruit(db.Model):
    __tablename__ = 'fruit'

    id = Column(Integer, Sequence('fruit_id_seq'), primary_key=True)
    name = Column(String)

    basket_id = Column(Integer, ForeignKey('basket.id'), nullable=False)
    basket = relationship("Basket", back_populates="fruits")
