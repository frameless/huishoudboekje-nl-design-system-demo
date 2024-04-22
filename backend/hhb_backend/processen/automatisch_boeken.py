import logging
from collections import Counter
from operator import itemgetter
from typing import List, Dict

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.dates import to_date, valid_afspraak
from hhb_backend.graphql.utils.find_matching_afspraken import match_zoekterm, match_similar_zoekterm, matching_zoektermen_count
from hhb_backend.service.model.afspraak import Afspraak
from hhb_backend.service.model.rekening import Rekening
from hhb_backend.service.model.bank_transaction import BankTransaction
from hhb_backend.graphql.mutations.journaalposten.create_journaalpost import create_journaalposten
from hhb_backend.notifications import Notificator

def automatisch_boeken(customer_statement_message_id: int = None):
    logging.info(f"Start automatisch boeken")
    transactions = get_transactions_to_write_off(customer_statement_message_id)
    suggesties = transactie_suggesties(transactions=transactions)
    _afspraken = {}
    _automatische_transacties = []
    _matching_transaction_ids = []
    for transactie_id, afspraken in suggesties.items():
        matching_afspraak = None
        if len(afspraken) == 1 and afspraken[0].zoektermen:
            matching_afspraak = afspraken[0]
        if len(afspraken) > 1 and all(afspraak.zoektermen and afspraak.burger_id == afspraken[0].burger_id and afspraak.tegen_rekening_id == afspraken[0].tegen_rekening_id for afspraak in afspraken):
            matching_afspraak = min(afspraken, key=itemgetter('valid_from'))
        if matching_afspraak:
            _afspraken[matching_afspraak.id] = matching_afspraak
            _automatische_transacties.append(
                {"transaction_id": transactie_id, "afspraak_id": matching_afspraak.id, "is_automatisch_geboekt": True})
            _matching_transaction_ids.append(transactie_id)

    stats = Counter(len(s) for s in suggesties.values())
    logging.info(
        f"Automatisch_boeken: {', '.join([f'{transactions_count} transactions with {suggestion_count} suggestions' for suggestion_count, transactions_count in stats.items() if suggestion_count != 1])} were not processed.")

    if not _automatische_transacties:
        return None

    rubrieken = hhb_dataloader().rubrieken.load(
        [afspraak.rubriek_id for afspraak in _afspraken.values()],
        return_indexed="id"
    )

    json = []
    for item in _automatische_transacties:
        afspraak = _afspraken[item["afspraak_id"]]
        rubriek = rubrieken[afspraak.rubriek_id]
        json.append(
            {**item, "grootboekrekening_id": rubriek.grootboekrekening_id})

    _matching_transactions = [
        t for t in transactions if t.id in _matching_transaction_ids]

    logging.info("Creating journaalposten")
    journaalposten_ = create_journaalposten(
        json, _afspraken, _matching_transactions)

    logging.info(f"automatisch boeken completed with {len(journaalposten_)}")

    Notificator.create("messages.csm.evaluated", None, {
                       "transactions": f"{len(journaalposten_)}", "reconciled": f"{len(_automatische_transacties)}"})

    return journaalposten_


def get_transactions_to_write_off(customer_statement_message_id):
    logging.info(
        f"Automatisch_boeken: customer_statement_message_id={customer_statement_message_id}")
    if customer_statement_message_id is not None:
        transactions = [
            transaction for
            transaction in hhb_dataloader().bank_transactions.by_csm(
                customer_statement_message_id)
            if not transaction.is_geboekt
        ]
    else:
        transactions = hhb_dataloader().bank_transactions.by_is_geboekt(False)
    return transactions


def transactie_suggesties(transactie_ids: List[int] = None, transactions: List[BankTransaction] = None, exact_zoekterm_matches=True) -> Dict[int, List[Afspraak]]:
    logging.info("Collecting matching afspraken for transactions")
    if transactie_ids:
        if type(transactie_ids) != list:
            transactie_ids = [transactie_ids]

    # fetch transactions
    if not transactions:
        transactions = hhb_dataloader().bank_transactions.load(transactie_ids)
        if not transactions:
            return {key: [] for key in transactie_ids}

    if transactions and not transactie_ids:
        transactie_ids = [transaction.id for transaction in transactions]

    # Rekeningen ophalen adhv iban
    rekening_ibans = [
        transaction.tegen_rekening for transaction in transactions]
    rekening_ibans = list(filter(lambda iban: iban, rekening_ibans))
    if len(rekening_ibans) == 0:
        return {key: [] for key in transactie_ids}

    rekeningen = hhb_dataloader().rekeningen.by_ibans(rekening_ibans)
    if not rekeningen:
        return {key: [] for key in transactie_ids}

    rekening_ids = [rekening.id if rekening is not None else -
                    1 for rekening in rekeningen]

    # Orginisaties ophalen (organisaties_id, afdeling_ids, rekening_ids)
    organisaties = hhb_dataloader(
    ).organisaties.organisatie_afdelingen_by_rekening_ids(rekening_ids)
    organisatie_rekeningen_ids = []
    for organisatie in organisaties:
        organisatie_rekeningen_ids.extend(organisatie["rekening_ids"])

    # Add new rekeningen ids
    organisatie_rekeningen_ids = list(
        filter(lambda id: id not in rekening_ids, organisatie_rekeningen_ids))
    rekening_ids.extend(organisatie_rekeningen_ids)

    # Nieuwe rekeningen ophalen van organisaties adhv ids
    if len(organisatie_rekeningen_ids) > 0:
        organisatie_rekeningen = hhb_dataloader().rekeningen.load(organisatie_rekeningen_ids)
        rekeningen.extend(organisatie_rekeningen)

    # Make a rekening searchable by iban
    iban_to_rekening = {}
    for rekening in rekeningen:
        iban_to_rekening[rekening.iban] = rekening

    # Afspraken ophalen adhv rekeningen
    afspraken = hhb_dataloader().afspraken.by_rekeningen(rekening_ids)
    if not afspraken:
        return {key: [] for key in transactie_ids}

    # Afspraken koppelen aan rekeningen
    rekening_afspraken = {rekening.id: list(filter(lambda afspraak: rekening_matches_afspraak(
        rekening.id, afspraak, organisaties), afspraken)) for rekening in rekeningen}

    # Transacties koppelen aan een afspraak
    transactie_ids_with_afspraken = {}
    for transaction in transactions:
        if not transaction.tegen_rekening:
            continue

        # Passende rekening bij transactie ophalen
        transactie_rekening: Rekening = iban_to_rekening.get(
            transaction.tegen_rekening, None)
        if not transactie_rekening:
            continue

        # Transactie koppelen aan afspraken
        transactie_ids_with_afspraken[transaction.id] = [
            afspraak
            for afspraak in rekening_afspraken[transactie_rekening.id]
            if valid_afspraak(afspraak, to_date(transaction.transactie_datum))
            and afspraak_matches_zoekterm(afspraak, transaction.information_to_account_owner, exact_zoekterm_matches)
        ]

        if not exact_zoekterm_matches:
            transactie_ids_with_afspraken[transaction.id].sort(key=lambda afspraak: matching_zoektermen_count(
                afspraak, transaction.information_to_account_owner), reverse=True)

    return transactie_ids_with_afspraken


def afspraak_matches_zoekterm(afspraak, target_text: str, exact_zoekterm_matches):
    if exact_zoekterm_matches:
        return match_zoekterm(afspraak, target_text)
    else:
        return match_similar_zoekterm(afspraak, target_text)


def rekening_matches_afspraak(rekening_id, afspraak: Afspraak, organisaties):
    if rekening_id == afspraak.tegen_rekening_id:
        return True

    filtered_organisaties = filter(
        lambda organisatie: rekening_id in organisatie["rekening_ids"], organisaties)
    afdelingen = []
    for organisatie in filtered_organisaties:
        afdelingen.extend(organisatie["afdeling_ids"])

    return afspraak.afdeling_id in afdelingen
