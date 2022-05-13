
from hhb_backend.graphql import settings
import hhb_backend.graphql.dataloaders as dataloaders

from graphql import GraphQLError
import logging
import requests


async def saldo_berekenen(burger_ids):
    """ Get saldo for burger_ids together """
    transaction_ids = []
    if len(burger_ids) > 0:
        for burger_id in burger_ids:
            afspraken = await dataloaders.hhb_dataloader().afspraken_by_burger.load(burger_id)
            if afspraken:
                for afspraak in afspraken:
                    journaalposten_afspraak = await dataloaders.hhb_dataloader().journaalposten_by_afspraak.load(afspraak.get('id'))
                    if journaalposten_afspraak:
                        for post in journaalposten_afspraak:
                            id = post.get('transaction_id')
                            transaction_ids.append(id)
                    else: 
                        logging.info("Geen journaalposten_by_afspraak.")
            else: 
                logging.info("Geen afspraken.")
            
        if len(transaction_ids) == 0:
            return { "bedrag": 0 }
        
    transaction_ids_string = str(transaction_ids)[1:-1].replace(" ", "")

    return get_saldo(transaction_ids_string)
   
def get_saldo(transaction_ids):
    saldo_response = requests.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/saldo/{transaction_ids}", headers={"Content-type": "application/json"})
    if saldo_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {saldo_response.text}")

    return saldo_response.json()["data"]
    