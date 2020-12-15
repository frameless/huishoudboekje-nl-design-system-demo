from datetime import datetime
from math import floor

from dateutil.parser import isoparse
from datetime import datetime, date
from hhb_backend.graphql.utils import convert_hhb_interval_to_relativetime

class PlannedOverschijvingenInput():
    afspraak_start_datum = None
    interval = None
    aantal_betalingen = None
    bedrag = None

    def __init__(self, afspraak_start_datum: str, interval: str, aantal_betalingen: int, bedrag: int):
        self.afspraak_start_datum = isoparse(afspraak_start_datum).date()
        self.interval = convert_hhb_interval_to_relativetime(interval)
        self.aantal_betalingen = aantal_betalingen
        self.bedrag = bedrag

def get_planned_overschrijvingen(input: PlannedOverschijvingenInput, start_datum: date=None, eind_datum: date=None):
    if not eind_datum:
        eind_datum = datetime.now().date()
    if not start_datum:
        start_datum = input.afspraak_start_datum
                                                              eind_datum)

    if input.aantal_betalingen > 0:
        return get_normal_afspraak_overschrijvingen(input, start_datum, eind_datum)
    else:
        return get_doorlopende_afspraak_overschrijvingen(input, start_datum, eind_datum)

def get_normal_afspraak_overschrijvingen(input: PlannedOverschijvingenInput, start_datum: date, eind_datum: date):
    payments = {}
    payment_date = input.afspraak_start_datum
    payment_per_period = floor(input.bedrag / input.aantal_betalingen)
    rest_payment = input.bedrag % input.aantal_betalingen
    for payment_id in range(input.aantal_betalingen):
        if payment_date > eind_datum:
            break
        payment_amount = payment_per_period
        if payment_id == input.aantal_betalingen - 1:
            payment_amount += rest_payment
        if payment_date >= start_datum:
            payments[payment_date.isoformat()] = make_overschrijving_dict(payment_amount, payment_date)
        payment_date = payment_date + input.interval
    return payments

def get_doorlopende_afspraak_overschrijvingen(input: PlannedOverschijvingenInput, start_datum: date , eind_datum: date=None):
    payments = {}
    payment_date = input.afspraak_start_datum
    while payment_date <= eind_datum:
        if not start_datum or payment_date >= start_datum:
            payments[payment_date.isoformat()] = make_overschrijving_dict(input.bedrag, payment_date)
        payment_date += input.interval
    return payments


def make_overschrijving_dict(bedrag, date, afspraak_id):
    return {
        "id": None,
        "afspraak_id": afspraak_id,
        "bedrag": bedrag,
        "datum": date,
        "bank_transaction_id": None,
        "export_id": None
    }
