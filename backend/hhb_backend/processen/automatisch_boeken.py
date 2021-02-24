import logging
from collections import Counter

import hhb_backend.graphql as graphql
import hhb_backend.graphql.dataloaders as dataloaders
import hhb_backend.graphql.models.bank_transaction as bank_transaction
import hhb_backend.graphql.models.afspraak as afspraak
import re


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
        if len(afspraken) == 1 and afspraken[0]["automatisch_boeken"] == True]

    stats = Counter(len(s) for s in suggesties.values())
    logging.info(f"automatisch_boeken: {', '.join([f'{transactions_count} transactions with {suggestion_count} suggestions' for suggestion_count, transactions_count in stats.items() if suggestion_count != 1])} were not processed.")

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
    logging.info(
        f"automatisch_boeken completed for {len(automatische_transacties)} transactions. {[f'{transactions_count} transactions with {suggestion_count}' for suggestion_count, transactions_count in stats if suggestion_count != 1].join(', ')} were not processed.")

    journaalposten_ = result.data['createJournaalpostPerAfspraak']['journaalposten']
    logging.info(f"automatisch boeken completed with {len(journaalposten_)}")
    return journaalposten_


async def transactie_suggesties(transactie_ids):
    if type(transactie_ids) != list:
        transactie_ids = [transactie_ids]

    # fetch transactions
    transactions: [bank_transaction.BankTransaction] = (
        await dataloaders.hhb_dataloader().bank_transactions_by_id.load_many(
            transactie_ids
        )
    )
    if not transactions:
        return {key: [] for key in transactie_ids}

    #Rekeningen ophalen adhv iban
    rekening_ibans = [t["tegen_rekening"] for t in transactions]
    rekeningen = await dataloaders.hhb_dataloader().rekeningen_by_iban.load_many(rekening_ibans)
    if not rekeningen:
        return {key: [] for key in transactie_ids}

    rekening_ids = [r["id"] for r in rekeningen]

    # and afspraken for tegen_rekening.ibans of those transactions
    afspraken: [afspraak.Afspraak] = (
        await dataloaders.hhb_dataloader().afspraken_by_rekening.load_many(
            rekening_ids
        )
    )
    if not afspraken:
        return {key: [] for key in transactie_ids}

    # Flatten the afspraken list
    afspraken = [item for sublist in afspraken for item in sublist]

    # Sort the afspraken by iban
    iban_afspraken = {}
    for rekening in rekeningen:
        iban_afspraken[rekening["iban"]] = [afspraak for afspraak in afspraken if afspraak["tegen_rekening_id"] == rekening["id"]]

    transactie_ids_with_afspraken = {}
    # match afspraken by iban and zoekterm
    for transaction in transactions:
        afspraken_subset = iban_afspraken[transaction["tegen_rekening"]] or []
        transactie_ids_with_afspraken[transaction["id"]] = [afspraak
                                                            for afspraak in afspraken_subset
                                                            if match_zoekterm(afspraak, transaction)]

    return transactie_ids_with_afspraken


def match_zoekterm(afspraak, transaction):
    if afspraak["kenmerk"] and re.search(afspraak["kenmerk"], transaction["information_to_account_owner"], re.IGNORECASE):
        return True

    return False
