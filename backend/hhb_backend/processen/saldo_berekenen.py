import logging

from hhb_backend.graphql.dataloaders import hhb_dataloader


async def saldo_berekenen(burger_ids):
    """ Get saldo for burger_ids together """
    transaction_ids = []

    if burger_ids:
        for burger_id in burger_ids:
            afspraken = hhb_dataloader().afspraken_by_burger.load(burger_id)
            if afspraken:
                for afspraak in afspraken:
                    journaalposten_afspraak = hhb_dataloader().journaalposten_by_afspraak.load(afspraak.get('id'))
                    if journaalposten_afspraak:
                        for post in journaalposten_afspraak:
                            id = post.get('transaction_id')
                            transaction_ids.append(id)
                    else:
                        logging.info("Geen journaalposten_by_afspraak.")
            
        if not transaction_ids:
            return {"bedrag": 0}

    return hhb_dataloader().bank_transaction_by_id.saldo_many(transaction_ids)
    