import logging
from collections import Counter

import hhb_backend.graphql as graphql
import hhb_backend.graphql.dataloaders as dataloaders


async def automatisch_boeken(customer_statement_message_id: int = None):
    if customer_statement_message_id is not None:
        transactions = [t
                        for t in (await dataloaders.hhb_dataloader().bank_transactions_by_csm.load(customer_statement_message_id))
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
    logging.info(f"automatisch_boeken: {', '.join([f'{transactions_count} transactions with {suggestion_count}' for suggestion_count, transactions_count in stats.items() if suggestion_count != 1])} were not processed.")

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


async def transactie_suggesties(transactie_ids):
    # TODO add is_geboekt to bank_transaction
    # TODO add index on is_geboekt to bank_transaction

    # TODO add dataloader with filter on is_geboekt and use with false(mind the nulls)

    # TODO implement
    # with hhb_dataloader()...
    # fetch transactions
    # and afspraken for tegen_rekening.ibans of those transactions
    # match afspraken by iban and zoekterm

    # bulk return type dict with transaction_id as key and afspraken list as valie
    if type(transactie_ids) == list:
        return {key: [] for key in transactie_ids}

    # singular return type
    return []
