from math import floor
from dateutil.parser import isoparse
from datetime import datetime
from hhb_backend.graphql.utils import convert_hhb_interval_to_relativetime

def planned_overschrijvingen(afspraak, start_datum=None, eind_datum=None):
    if not eind_datum:
        eind_datum = datetime.now().date()
    payments = []
    payment_date = isoparse(afspraak["start_datum"]).date()
    time_delta = convert_hhb_interval_to_relativetime(afspraak["interval"])
    if afspraak["aantal_betalingen"] > 0:
        payments += get_normal_afspraak_overschrijvingen(afspraak, payment_date, time_delta, start_datum, eind_datum)
    else:
        payments += get_doorlopende_afspraak_overschrijvingen(afspraak, payment_date, time_delta, start_datum, eind_datum)

    return payments

def get_normal_afspraak_overschrijvingen(afspraak, payment_date, time_delta, start_datum=None, eind_datum=None):
    payments = []
    payment_per_period = floor(afspraak["bedrag"] / afspraak["aantal_betalingen"])
    rest_payment = afspraak["bedrag"] % afspraak["aantal_betalingen"]
    for payment_id in range(afspraak["aantal_betalingen"]):
        payment_amount = payment_per_period
        if payment_id == afspraak["aantal_betalingen"] - 1:
            payment_amount += rest_payment
        if not start_datum or payment_date >= start_datum:
            payments.append(make_overschrijving_dict(payment_amount, payment_date))
        payment_date = payment_date + time_delta
        if eind_datum and payment_date > eind_datum:
            break
    return payments

def get_doorlopende_afspraak_overschrijvingen(afspraak, payment_date, time_delta, start_datum=None, eind_datum=None):
    payments = []
    payment_id = 0
    while payment_date <= eind_datum:
        if not start_datum or payment_date >= start_datum:
            payments.append(make_overschrijving_dict(afspraak["bedrag"], payment_date))
        payment_date = payment_date + time_delta
        payment_id += 1
    return payments

def make_overschrijving_dict(bedrag, date):
    return {
        "id": None,
        "bedrag": bedrag,
        "datum": date,
    }
