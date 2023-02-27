from rapportage_service.repositories.huishoudboekjeservice_repository import HuishoudboekjeserviceRepository


class RapportageController():
    def get_rapportage_burger(self,burger_id, start, end):
        hhb_repository = HuishoudboekjeserviceRepository()
        burger_transactions = hhb_repository.get_afspraken_burger(burger_id)
        return {"data": burger_transactions}, 200

