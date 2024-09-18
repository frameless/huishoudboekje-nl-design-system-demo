""" Filters that can be used on the Afspraak model"""

from datetime import datetime
import logging
from sqlalchemy import asc, case, column, desc, func, literal, literal_column, or_, and_, String, text
from models.rekening import Rekening
from models.afspraak import Afspraak
from core_service.database import db


def add_afspraak_afspraak_ids_filter(afspraak_ids, query):
    return query.filter(Afspraak.id.in_(afspraak_ids))


def add_afspraak_burger_ids_filter(burger_ids, query):
    return query.filter(Afspraak.burger_id.in_(burger_ids))


def add_afspraak_afdeling_ids_filter(afdeling_ids, query):
    return query.filter(Afspraak.afdeling_id.in_(afdeling_ids))


def add_afspraak_tegen_rekening_ids_filter(tegen_rekening_ids, query):
    return query.filter(Afspraak.tegen_rekening_id.in_(tegen_rekening_ids))


def add_afspraak_only_valid_filter(only_valid, query):
    today = datetime.now()
    if only_valid:
        new_query = query.filter(and_(today >= Afspraak.valid_from, or_(
            today <= Afspraak.valid_through, Afspraak.valid_through == None)))
    else:
        new_query = query.filter(
            and_(Afspraak.valid_through != None, Afspraak.valid_through < today))
    return new_query


def add_afspraak_min_bedrag_filter(min_bedrag, query):
    return query.filter(Afspraak.bedrag > min_bedrag)


def add_afspraak_max_bedrag_filter(max_bedrag, query):
    return query.filter(Afspraak.bedrag < max_bedrag)


def add_afspraak_text_zoektermen_filter(zoektermen, query):
    clauses = [or_(func.lower(Afspraak.omschrijving).like(f"%{term.lower()}%"), func.lower(
        Afspraak.zoektermen.cast(String)).like(f"%{term.lower()}%")) for term in zoektermen]
    return query.filter(and_(*clauses))


def add_afspraak_transaction_description_filter(transaction_description: str, query, matches_only=False):
    # This is not the cleanest way of doing this, but my knowledge of sqlalchemy is not in depth enough to properly translate a complex query like this to their builder.
    sql = text(f"SELECT afspraken.uuid AS uuid, COUNT(CASE WHEN " +
               ":transaction_description" +
               " ILIKE concat('%', terms.zoekterm, '%')"
               + " THEN 1 ELSE NULL END) AS zoekterm_count FROM afspraken CROSS JOIN LATERAL unnest(afspraken.zoektermen) AS terms(zoekterm) GROUP BY afspraken.uuid ORDER BY zoekterm_count DESC")
    sql = sql.columns(Afspraak.uuid, column("zoekterm_count"))
    sql = sql.bindparams(transaction_description=transaction_description)
    subquery = sql.subquery()

    query = query.outerjoin(subquery, subquery.c.uuid == Afspraak.uuid)

    query = query.order_by(desc(func.coalesce(subquery.c.zoekterm_count, 0)))

    if matches_only:
        query = query.filter(subquery.c.zoekterm_count > 0)

    return query


def add_afspraak_payment_instruction_filter(query):
    return query.filter(Afspraak.betaalinstructie != None)


def add_offset_accounts(query):
    return query.join(Rekening, Afspraak.tegen_rekening_id == Rekening.id).with_entities(
        Afspraak.id, Afspraak.uuid, Rekening.uuid.label("offset_account"),
        Afspraak.afdeling_id, Afspraak.bedrag, Afspraak.betaalinstructie,
        Afspraak.credit, Afspraak.valid_from, Afspraak.valid_through)


def add_offset_account_info(query):
    return query.join(Rekening, Afspraak.tegen_rekening_id == Rekening.id).with_entities(
        Afspraak.id, Afspraak.uuid, Rekening.iban.label(
            "offset_account_iban"), Rekening.rekeninghouder.label("offset_account_name"),
        Afspraak.bedrag, Afspraak.betaalinstructie, Afspraak.credit, Afspraak.valid_from, Afspraak.valid_through, Afspraak.omschrijving)
