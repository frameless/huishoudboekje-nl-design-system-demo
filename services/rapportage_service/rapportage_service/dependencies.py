from flask_injector import request
from rapportage_service.controllers.rapportageController import RapportageController
from rapportage_service.repositories.banktransactieservice_repository import BanktransactieServiceRepository
from rapportage_service.repositories.huishoudboekjeservice_repository import HuishoudboekjeserviceRepository


def configure(binder):
    binder.bind(RapportageController, to=RapportageController, scope=request)
    binder.bind(HuishoudboekjeserviceRepository, to=HuishoudboekjeserviceRepository, scope=request)
    binder.bind(BanktransactieServiceRepository, to=BanktransactieServiceRepository, scope=request)