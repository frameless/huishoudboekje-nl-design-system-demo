import re
import logging
from collections import Counter
from datetime import date

import hhb_backend.graphql as graphql
import hhb_backend.graphql.dataloaders as dataloaders
import hhb_backend.graphql.models.bank_transaction as bank_transaction
import hhb_backend.graphql.models.afspraak as afspraak
from hhb_backend.graphql.utils.dates import afspraken_intersect, to_date


async def automatisch_boeken(customer_statement_message_id: int = None):
    logging.info(f"automatisch_boeken: customer_statement_message_id={customer_statement_message_id}")
    if customer_statement_message_id is not None:
        transactions = [t
                        for t in (await dataloaders.hhb_dataloader().bank_transactions_by_csm.load(
                customer_statement_message_id))
                        if t["is_geboekt"] is False]
    else:
        transactions = await dataloaders.hhb_dataloader().bank_transactions_by_is_geboekt.load(False)

    transaction_ids = [t["id"] for t in transactions]

    suggesties = await transactie_suggesties(transaction_ids)

    automatische_transacties = [
        {"transactionId": transactie_id, "afspraakId": afspraken[0]["id"], "isAutomatischGeboekt": True}
        for transactie_id, afspraken in suggesties.items()
        if len(afspraken) == 1 and afspraken[0]["zoektermen"]]

    stats = Counter(len(s) for s in suggesties.values())
    logging.info(
        f"automatisch_boeken: {', '.join([f'{transactions_count} transactions with {suggestion_count} suggestions' for suggestion_count, transactions_count in stats.items() if suggestion_count != 1])} were not processed.")

    if len(automatische_transacties) == 0:
        return None

    result = await graphql.schema.execute("""
mutation AutomatischBoeken($input: [CreateJournaalpostAfspraakInput!]!) {
  createJournaalpostPerAfspraak(input: $input) {
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

    journaalposten_ = result.data['createJournaalpostPerAfspraak']['journaalposten']
    logging.info(f"automatisch boeken completed with {len(journaalposten_)}")
    return journaalposten_


def valid_afspraak(afspraak, transactie_datum):
    if "valid_through" in afspraak and afspraak["valid_through"]:
        afspraak_valid_through = date.fromisoformat(afspraak["valid_through"])
        transaction_date = date.fromisoformat(transactie_datum)
        if transaction_date > afspraak_valid_through:
            return False
    return True


async def transactie_suggesties(transactie_ids):
    if type(transactie_ids) != list:
        transactie_ids = [transactie_ids]

    # fetch transactions
    transactions: [bank_transaction.BankTransaction] = (
        await dataloaders.hhb_dataloader().bank_transactions_by_id.load_many(
            transactie_ids
        )
    )
    if transactions == [None] * len(transactions):
        return {key: [] for key in transactie_ids}

    # Rekeningen ophalen adhv iban
    rekening_ibans = [t["tegen_rekening"] for t in transactions if t["tegen_rekening"]]
    rekeningen = await dataloaders.hhb_dataloader().rekeningen_by_iban.load_many(rekening_ibans)
    if rekeningen == [None] * len(rekeningen):
        return {key: [] for key in transactie_ids}

    rekening_ids = [r["id"] if r is not None else -1 for r in rekeningen]

    # and afspraken for tegen_rekening.ibans of those transactions
    afspraken: [afspraak.Afspraak] = (
        await dataloaders.hhb_dataloader().afspraken_by_rekening.load_many(
            rekening_ids
        )
    )
    if afspraken == [None] * len(afspraken):
        return {key: [] for key in transactie_ids}

    transactie_ids_with_afspraken = {}
    for transaction, suggesties in zip(transactions, afspraken):
        transactie_ids_with_afspraken[transaction["id"]] = [afspraak for afspraak in suggesties if
                                                            match_zoekterm(afspraak,
                                                                           transaction["information_to_account_owner"]) and valid_afspraak(afspraak, transaction["transactie_datum"])]

    return transactie_ids_with_afspraken


def match_zoekterm(afspraak, target_text):
    if afspraak["zoektermen"] and all(
            [re.search(zoekterm, target_text, re.IGNORECASE) for zoekterm in afspraak["zoektermen"]]):
        return True

    return False


async def find_matching_afspraken_by_afspraak(main_afspraak):
    matching_afspraken = list()
    if not main_afspraak["zoektermen"]:
        return matching_afspraken

    afspraken = await dataloaders.hhb_dataloader().afspraken_by_rekening.load(
        main_afspraak["tegen_rekening_id"])

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
