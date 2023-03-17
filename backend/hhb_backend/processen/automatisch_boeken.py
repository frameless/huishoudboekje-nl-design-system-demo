import logging
from collections import Counter
from operator import itemgetter
from typing import List, Dict

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.dates import to_date, valid_afspraak
from hhb_backend.graphql.utils.find_matching_afspraken import match_zoekterm
from hhb_backend.service.model.afspraak import Afspraak
from hhb_backend.service.model.bank_transaction import BankTransaction
from hhb_backend.graphql.mutations.journaalposten.create_journaalpost import create_journaalposten


def automatisch_boeken(customer_statement_message_id: int = None):
    transactions = get_transactions_to_write_off(customer_statement_message_id)
    suggesties = transactie_suggesties(transactions=transactions)
    _afspraken = {}
    _automatische_transacties = []
    _matching_transaction_ids = []
    for transactie_id, afspraken in suggesties.items():  
        matching_afspraak = None
        if len(afspraken) == 1 and afspraken[0].zoektermen:
            matching_afspraak = afspraken[0]
        if len(afspraken) > 1 and all(afspraak.zoektermen and afspraak.burger_id == afspraken[0].burger_id for afspraak in afspraken):
            matching_afspraak = min(afspraken, key=itemgetter('valid_from'))
        if matching_afspraak:
            _afspraken[matching_afspraak.id] = matching_afspraak
            _automatische_transacties.append({"transaction_id": transactie_id, "afspraak_id": matching_afspraak.id, "is_automatisch_geboekt": True})
            _matching_transaction_ids.append(transactie_id)

    stats = Counter(len(s) for s in suggesties.values())
    logging.info(
        f"automatisch_boeken: {', '.join([f'{transactions_count} transactions with {suggestion_count} suggestions' for suggestion_count, transactions_count in stats.items() if suggestion_count != 1])} were not processed.")

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
        json.append({**item, "grootboekrekening_id": rubriek.grootboekrekening_id})

    _matching_transactions = [t for t in transactions if t.id in _matching_transaction_ids]
    
    journaalposten_ = create_journaalposten(json, _afspraken, _matching_transactions)
    
    logging.info(f"automatisch boeken completed with {len(journaalposten_)}")
    return journaalposten_

def get_transactions_to_write_off(customer_statement_message_id):
    logging.info(f"automatisch_boeken: customer_statement_message_id={customer_statement_message_id}")
    if customer_statement_message_id is not None:
        transactions = [
            transaction for
            transaction in hhb_dataloader().bank_transactions.by_csm(customer_statement_message_id)
            if not transaction.is_geboekt
        ]
    else:
        transactions = hhb_dataloader().bank_transactions.by_is_geboekt(False)
    return transactions


def transactie_suggesties(transactie_ids: List[int] = None, transactions: List[BankTransaction] = None) -> Dict[int, List[Afspraak]]:
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
    rekening_ibans = [transaction.tegen_rekening for transaction in transactions]
    rekeningen = hhb_dataloader().rekeningen.by_ibans(rekening_ibans)
    if not rekeningen:
        return {key: [] for key in transactie_ids}
    

    # orginisaties rekeningen ophalen

    iban_to_rekening_id = {}
    for rekening in rekeningen:
        iban_to_rekening_id[rekening.iban] = rekening.id

    rekening_ids = [rekening.id if rekening is not None else -1 for rekening in rekeningen]

    afspraken = hhb_dataloader().afspraken.by_rekeningen(rekening_ids)
    if not afspraken:
        return {key: [] for key in transactie_ids}

    transactie_ids_with_afspraken = {}
    for transaction in transactions:
        if not transaction.tegen_rekening:
            continue
        
        rekening_id: int = iban_to_rekening_id[transaction.tegen_rekening]

        transactie_ids_with_afspraken[transaction.id] = [
            afspraak
            for afspraak in afspraken
            if afspraak.tegen_rekening_id == rekening_id # verander organisatie id
            and match_zoekterm(afspraak, transaction.information_to_account_owner)
            and valid_afspraak(afspraak, to_date(transaction.transactie_datum))
        ]

    return transactie_ids_with_afspraken
