import logging

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.datawriters import hhb_datawriter
import calendar
from datetime import datetime
from hhb_backend.service.model import journaalpost
from hhb_backend.service.model import afspraak
from hhb_backend.service.model import bank_transaction
from hhb_backend.service.model import saldo


def update_or_create_saldo(journaalpost, undo_saldo=False):
    """ update or create the saldo based on transaction """
    transaction = hhb_dataloader().bank_transactions.load_one(
        journaalpost['transaction_id'])

    if transaction:
        if "afspraak" in transaction.keys():
            burger_id = journaalpost["afspraak"]["burger_id"]
        else:
            burger_id = hhb_dataloader().afspraken.load_one(
                journaalpost["afspraak_id"])["burger_id"]
        date = datetime.strptime(
            transaction.transactie_datum, '%Y-%m-%dT%H:%M:%S')
        existing_saldo = hhb_dataloader().saldo.get_saldo(
            [burger_id], date.strftime("%Y-%m-%d"))
        if len(existing_saldo) == 1:
            __update_existing_saldo(transaction, existing_saldo, undo_saldo)
        if len(existing_saldo) == 0:
            __create_new_saldo(
                transaction, burger_id, date, undo_saldo)


def __create_new_saldo(transaction, burger_id, date, undo_saldo):
    days_in_month = calendar.monthrange(date.year, date.month)[1]
    startdate = f'{date.strftime("%Y-%m")}-01'
    enddate = f'{date.strftime("%Y-%m")}-{days_in_month}'
    json = []
    closest_saldo = hhb_dataloader().saldo.get_closest_saldo([
        burger_id], date)

    prev_saldo = closest_saldo[0]["saldo"] if len(closest_saldo) > 0 else 0
    saldo = prev_saldo - transaction.bedrag if undo_saldo else prev_saldo + transaction.bedrag

    json.append({"burger_id": burger_id, "saldo": saldo,
                "einddatum": enddate, "begindatum": startdate})
    hhb_datawriter().saldo.post(json[0])


def __update_existing_saldo(transaction, existing_saldo, undo_saldo):
    new_saldo = existing_saldo[0]['saldo'] - transaction.bedrag if (
        undo_saldo) else existing_saldo[0]['saldo'] + transaction.bedrag

    id = existing_saldo[0]['id']
    hhb_datawriter().saldo.put({"id": id, "saldo": new_saldo})

# def __has_attached_afspraak(journaalpost)
