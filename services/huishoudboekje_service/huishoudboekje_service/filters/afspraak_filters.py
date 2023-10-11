""" Filters that can be used on the Afspraak model"""

from datetime import datetime
from sqlalchemy import  func, or_, and_ , String
from models.afspraak import Afspraak          
        
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
        new_query = query.filter(and_(today >= Afspraak.valid_from, or_(today <= Afspraak.valid_through, Afspraak.valid_through == None)))
    else:
        new_query = query.filter(and_(Afspraak.valid_through != None, Afspraak.valid_through < today))
    return new_query
    
def add_afspraak_min_bedrag_filter( min_bedrag, query):
    return query.filter(Afspraak.bedrag > min_bedrag)

def add_afspraak_max_bedrag_filter(max_bedrag, query):
    return query.filter(Afspraak.bedrag < max_bedrag)

def add_afspraak_text_zoektermen_filter(zoektermen, query):
    clauses = [or_(func.lower(Afspraak.omschrijving).like(f"%{term.lower()}%"), func.lower(Afspraak.zoektermen.cast(String)).like(f"%{term.lower()}%")) for term in zoektermen]
    return query.filter(and_(*clauses))
