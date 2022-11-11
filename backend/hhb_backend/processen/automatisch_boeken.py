import logging
import re
from collections import Counter
from typing import List, Union, Dict

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.dates import to_date, valid_afspraak
from hhb_backend.graphql.utils.find_matching_afspraken import match_zoekterm
from hhb_backend.service.model.afspraak import Afspraak
from hhb_backend.graphql.mutations.journaalposten.create_journaalpost import create_journaalposten


async def automatisch_boeken(customer_statement_message_id: int = None):
    logging.info(f"automatisch_boeken: customer_statement_message_id={customer_statement_message_id}")
    if customer_statement_message_id is not None:
        transactions = [
            t
            for t in hhb_dataloader().bank_transactions.by_csm(customer_statement_message_id)
            if not t.is_geboekt
        ]
    else:
        transactions = hhb_dataloader().bank_transactions.by_is_geboekt(False)

    suggesties = await transactie_suggesties([t.id for t in transactions])
    _afspraken = {}
    _automatische_transacties = []
    for transactie_id, afspraken in suggesties.items():
        if len(afspraken) == 1 and afspraken[0].zoektermen:
            _afspraken[afspraken[0].id] = afspraken[0]
            _automatische_transacties.append({"transactionId": transactie_id, "afspraakId": afspraken[0].id, "isAutomatischGeboekt": True})

    print(f"afspraken dict: {_afspraken}")
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
        afspraak = _afspraken[item["afspraakId"]]
        rubriek = rubrieken[afspraak.rubriek_id]
        json.append({**item, "grootboekrekening_id": rubriek.grootboekrekening_id})
    
    journaalposten_ = await create_journaalposten(json, _afspraken, transactions)
    
    logging.info(f"automatisch boeken completed with {len(journaalposten_)}")
    return journaalposten_


async def transactie_suggesties(transactie_ids: Union[List[int], int]) -> Dict[int, List[Afspraak]]:
    if type(transactie_ids) != list:
        transactie_ids = [transactie_ids]

    # fetch transactions
    transactions = hhb_dataloader().bank_transactions.load(transactie_ids)
    if not transactions:
        return {key: [] for key in transactie_ids}

    # Rekeningen ophalen adhv iban
    rekening_ibans = [t.tegen_rekening for t in transactions]
    rekeningen = hhb_dataloader().rekeningen.by_ibans(rekening_ibans)
    if not rekeningen:
        return {key: [] for key in transactie_ids}

    iban_to_rekening_id = {}
    for rekening in rekeningen:
        iban_to_rekening_id[rekening.iban] = rekening.id

    rekening_ids = [r.id if r is not None else -1 for r in rekeningen]

    afspraken = hhb_dataloader().afspraken.by_rekeningen(rekening_ids)
    if not afspraken:
        return {key: [] for key in transactie_ids}

    transactie_ids_with_afspraken = {}
    for transaction in transactions:
        rekening_id: int = iban_to_rekening_id[transaction.tegen_rekening]

        transactie_ids_with_afspraken[transaction.id] = [
            afspraak
            for afspraak in afspraken
            if afspraak.tegen_rekening_id == rekening_id
            and match_zoekterm(afspraak, transaction.information_to_account_owner)
            and valid_afspraak(afspraak, to_date(transaction.transactie_datum))
        ]

    return transactie_ids_with_afspraken
