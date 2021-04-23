import datetime
import time
from datetime import date

from dateutil.parser import isoparse


class PlannedOverschijvingenInput():
    betaalinstructie = None
    bedrag = None
    afspraak_id = None

    def __init__(self, betaalinstructie, bedrag: int, afspraak_id: int):
        self.betaalinstructie = betaalinstructie
        self.bedrag = bedrag
        self.afspraak_id = afspraak_id


def get_planned_overschrijvingen(input: PlannedOverschijvingenInput, start_datum: date = None, eind_datum: date = None):
    if not eind_datum:
        eind_datum = datetime.datetime.now().date()
    if not start_datum:
        start_datum = isoparse(input.betaalinstructie["start_date"]).date()

    return get_doorlopende_afspraak_overschrijvingen(input, start_datum, eind_datum)


def get_doorlopende_afspraak_overschrijvingen(input: PlannedOverschijvingenInput, start_datum: date,
                                              eind_datum: date = None):
    payments = {}
    except_dates = []
    if "except_dates" in input.betaalinstructie:
        except_dates = input.betaalinstructie["except_dates"] or []

    if "by_day" in input.betaalinstructie and input.betaalinstructie["by_day"]:
        for weekday in input.betaalinstructie["by_day"]:
            weekday_int = time.strptime(weekday, "%A").tm_wday
            payment_date = start_datum
            while payment_date <= eind_datum:
                if (not start_datum or payment_date >= start_datum) and payment_date.weekday() == weekday_int \
                        and payment_date.isoformat() not in except_dates:
                    payments[payment_date.isoformat()] = make_overschrijving_dict(input.bedrag, payment_date,
                                                                                  input.afspraak_id)
                payment_date = next_weekday(payment_date, weekday_int)
    elif "by_month_day" in input.betaalinstructie and input.betaalinstructie["by_month_day"]:
        date_list = [start_datum + datetime.timedelta(days=x) for x in
                     range(0, (eind_datum - (start_datum - datetime.timedelta(days=1))).days)]
        pay_days = input.betaalinstructie["by_month_day"]
        pay_months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        if "by_month" in input.betaalinstructie and input.betaalinstructie["by_month"]:
            pay_months = input.betaalinstructie["by_month"]
        for possible_date in date_list:
            if possible_date.day in pay_days and possible_date.month in pay_months \
                    and possible_date.isoformat() not in except_dates:
                payments[possible_date.isoformat()] = make_overschrijving_dict(input.bedrag, possible_date,
                                                                               input.afspraak_id)

    if payments:
        return dict(sorted(payments.items()))
    else:
        return payments


def next_weekday(d, weekday):
    days_ahead = weekday - d.weekday()
    if days_ahead <= 0:  # Target day already happened this week
        days_ahead += 7
    return d + datetime.timedelta(days_ahead)


def make_overschrijving_dict(bedrag, date, afspraak_id):
    return {
        "id": None,
        "afspraak_id": afspraak_id,
        "bedrag": bedrag,
        "datum": date,
        "bank_transaction_id": None,
        "export_id": None
    }
