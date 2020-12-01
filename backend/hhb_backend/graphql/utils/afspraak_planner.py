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
        payment_per_period = floor(afspraak["bedrag"] / afspraak["aantal_betalingen"])
        rest_payment = afspraak["bedrag"] % afspraak["aantal_betalingen"]
        for payment_id in range(afspraak["aantal_betalingen"]):
            payment_amount = payment_per_period
            if payment_id == afspraak["aantal_betalingen"] - 1:
                payment_amount += rest_payment
            if not start_datum or payment_date >= start_datum:
                payments.append({
                    "id": payment_id,
                    "bedrag": payment_amount,
                    "datum": payment_date,
                })
            payment_date = payment_date + time_delta
            if eind_datum and payment_date > eind_datum:
                break
    else:
        payment_id = 0
        while payment_date <= eind_datum:
            if not start_datum or payment_date >= start_datum:
                payments.append({
                    "id": payment_id,
                    "bedrag": afspraak["bedrag"],
                    "datum": payment_date,
                })
            payment_date = payment_date + time_delta
            payment_id += 1
    return payments