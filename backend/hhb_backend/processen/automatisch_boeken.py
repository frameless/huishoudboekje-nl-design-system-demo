import logging
import re
from collections import Counter
from typing import List

import hhb_backend.graphql as graphql
import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.bank_transaction as bank_transaction
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.dates import afspraken_intersect, to_date, valid_afspraak


async def automatisch_boeken(customer_statement_message_id: int = None):
    logging.info(f"automatisch_boeken: customer_statement_message_id={customer_statement_message_id}")
    if customer_statement_message_id is not None:
        transactions = [
            t
            for t in hhb_dataloader().bank_transactions.by_csm(customer_statement_message_id)
            if t["is_geboekt"] is False
        ]
    else:
        transactions = hhb_dataloader().bank_transactions.by_is_geboekt(False)

    transaction_ids = [t["id"] for t in transactions]

    suggesties = await transactie_suggesties(transaction_ids)

    automatische_transacties = [
        {"transactionId": transactie_id, "afspraakId": afspraken[0]["id"], "isAutomatischGeboekt": True}
        for transactie_id, afspraken in suggesties.items()
        if len(afspraken) == 1 and afspraken[0]["zoektermen"]
    ]

    stats = Counter(len(s) for s in suggesties.values())
    logging.info(
        f"automatisch_boeken: {', '.join([f'{transactions_count} transactions with {suggestion_count} suggestions' for suggestion_count, transactions_count in stats.items() if suggestion_count != 1])} were not processed.")

    if len(automatische_transacties) == 0:
        return None

    result = await graphql.schema.execute("""
mutation AutomatischBoeken($input: [CreateJournaalpostAfspraakInput!]!) {
  createJournaalpostAfspraak(input: $input) {
    ok
    journaalposten {
      id
      afspraak {
        id
      }
      transaction {
        id
      }
      isAutomatischGeboekt
    }
  }
}
""", variables={"input": automatische_transacties}, return_promise=True)
    if result.errors is not None:
        logging.warning(f"create journaalposten failed: {result.errors}")
        return None

    journaalposten_ = result.data['createJournaalpostAfspraak']['journaalposten']
    logging.info(f"automatisch boeken completed with {len(journaalposten_)}")
    return journaalposten_


async def transactie_suggesties(transactie_ids):
    if type(transactie_ids) != list:
        transactie_ids = [transactie_ids]

    # fetch transactions
    transactions: List[bank_transaction.BankTransaction] = \
        hhb_dataloader().bank_transactions.load(transactie_ids)
    if not transactions:
        return {key: [] for key in transactie_ids}

    # Rekeningen ophalen adhv iban
    rekening_ibans = [t["tegen_rekening"] for t in transactions if t["tegen_rekening"]]
    rekeningen = hhb_dataloader().rekeningen.by_ibans(rekening_ibans)
    if not rekeningen:
        return {key: [] for key in transactie_ids}

    iban_to_rekening_id = {}
    for rekening in rekeningen:
        iban_to_rekening_id[rekening["iban"]] = rekening["id"]

    rekening_ids = [r["id"] if r is not None else -1 for r in rekeningen]

    afspraken: List[afspraak.Afspraak] = hhb_dataloader().afspraken.by_rekeningen(rekening_ids)
    if not afspraken:
        return {key: [] for key in transactie_ids}

    transactie_ids_with_afspraken = {}
    for transaction in transactions:
        rekening_id: int = iban_to_rekening_id[transaction["tegen_rekening"]]

        transactie_ids_with_afspraken[transaction["id"]] = [
            afspraak
            for afspraak in afspraken
            if afspraak["tegen_rekening_id"] == rekening_id
            and match_zoekterm(afspraak, transaction["information_to_account_owner"])
            and valid_afspraak(afspraak, to_date(transaction["transactie_datum"]))
        ]

    return transactie_ids_with_afspraken


def match_zoekterm(afspraak, target_text):
    return afspraak["zoektermen"] and all([
        re.search(zoekterm, target_text, re.IGNORECASE)
        for zoekterm in afspraak["zoektermen"]
    ])


async def find_matching_afspraken_by_afspraak(main_afspraak):
    matching_afspraken = list()
    if not main_afspraak["zoektermen"]:
        return matching_afspraken

    afspraken = hhb_dataloader().afspraken.by_rekening(main_afspraak["tegen_rekening_id"])

    zoektermen_main = ' '.join(main_afspraak["zoektermen"])
    main_afspraak_valid_from = to_date(main_afspraak["valid_from"])
    main_afspraak_valid_through = to_date(main_afspraak["valid_through"])

    for afspraak in afspraken:
        if afspraak["zoektermen"]:
            zoektermen_afspraak = ' '.join(afspraak["zoektermen"])

            not_main_afspraak = (afspraak["id"] != main_afspraak["id"])
            matching_zoekterm = match_zoekterm(afspraak, zoektermen_main) or match_zoekterm(main_afspraak, zoektermen_afspraak)

            afspraak_valid_from = to_date(afspraak["valid_from"])
            afspraak_valid_through = to_date(afspraak["valid_through"])
            afspraken_overlap = afspraken_intersect(
                valid_from1=main_afspraak_valid_from,
                valid_from2=afspraak_valid_from,
                valid_through1=main_afspraak_valid_through,
                valid_through2=afspraak_valid_through
            )

            if not_main_afspraak and matching_zoekterm and afspraken_overlap:
                matching_afspraken.append(afspraak)

    return matching_afspraken
