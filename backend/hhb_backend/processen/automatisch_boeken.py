async def automatisch_boeken(customer_statement_message_id: int):
    # TODO implement
    # with hhb_dataloader()...
    # fetch transactions (is this a list attribute on customer_statement_message?)
    # transaction_ids = [t["id"] for t in transactions]
    # transactie_suggesties(transaction_ids)
    # for every transaction:
    #    that has a single suggestion
    #    that has is_automatisch_boeken set to True
    #    create journaalpost

    # TODO can journaalpost be created with a single POST?
    # return journaalposten
    return []


async def transactie_suggesties(transactie_ids):
    # TODO implement
    # with hhb_dataloader()...
    # fetch transactions
    # and afspraken for tegen_rekening.ibans of those transactions
    # match afspraken by iban and zoekterm

    # bulk return type dict with transaction_id as key and afspraken list as valie
    if type(transactie_ids) == list:
        return {key: [] for key in list}

    # singular return type
    return []
