import logging
from core_service.database import db
from models.huishouden import Huishouden
from models.saldo import Saldo
from sqlalchemy import Boolean, Column, DateTime, event, ForeignKey, Integer, Sequence, String, func
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import relationship, Session
from sqlalchemy.dialects.postgresql import UUID


class Burger(db.Model):
    __tablename__ = "burgers"

    id = Column(Integer, Sequence("burgers_id_seq"), primary_key=True)
    uuid = Column(UUID, default = func.gen_random_uuid(), nullable = False, unique = True, index = True)

    # Name fields
    voornamen = Column(String)
    voorletters = Column(String)
    achternaam = Column(String)

    # Adress fields
    straatnaam = Column(String)
    huisnummer = Column(String)
    postcode = Column(String)
    plaatsnaam = Column(String)

    # Gebruiker fields
    telefoonnummer = Column(String)
    email = Column(String)
    geboortedatum = Column(DateTime)

    saldo_alarm = Column(
        Boolean,
        nullable=False,
        server_default='True')

    huishouden_id = Column(
        Integer,
        ForeignKey("huishoudens.id"), 
        nullable=False
    )
    # huishouden_uuid = Column(
    #     UUID,
    #     ForeignKey("huishoudens.uuid"), 
    #     nullable=False
    # )

    bsn = Column(Integer, unique=True)

    saldo = Column(Integer, nullable=False, server_default='0')

    # Relations from other models
    rekeningen = relationship(
        "RekeningBurger",
        back_populates="burger",
        cascade="all, delete",  # cascade only deletes relationship, not the rekening
    )
    afspraken = relationship("Afspraak")
    huishouden = relationship("Huishouden", back_populates="burgers")
    saldos = relationship("Saldo", back_populates="burger")


"""
Event hooks for ensuring huishouden orphanage removal. 
Inspired by:
https://stackoverflow.com/questions/51419186/delete-parent-object-when-all-children-have-been-deleted-in-sqlalchemy#answer-51773089 
"""


# TODO: these events are fairly rigorous and could possibly be improved.
def delete_orphaned_huishoudens(session):
    # don't let the request that updates/deletes a burger fail if the orphans can't be removed
    try:
        huishouden_ids = session.query(Burger.huishouden_id).all()
        huishouden_ids = {id for (id,) in huishouden_ids}
        session.query(Huishouden).filter(
            Huishouden.id.not_in(huishouden_ids)).delete()
    except OperationalError as error:
        logging.exception("An error occurred while deleting orphaned huishoudens")
        logging.debug(error)


@event.listens_for(Burger, "after_update")
def receive_after_update(mapper, connection, target):
    @event.listens_for(Session, "after_flush", once=True)
    def receive_after_flush(session, context):
        delete_orphaned_huishoudens(session=session)
        # delete_orphaned_saldos(session=session)


@event.listens_for(Burger, "after_delete")
def receive_after_delete(mapper, connection, target):
    @event.listens_for(Session, "after_flush", once=True)
    def receive_after_flush(session, context):
        delete_orphaned_huishoudens(session=session)
        # delete_orphaned_saldos(session=session)
