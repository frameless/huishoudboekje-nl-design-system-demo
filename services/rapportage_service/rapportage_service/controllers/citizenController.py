import calendar
from datetime import datetime, timedelta
from decimal import ROUND_HALF_DOWN, Context, Decimal
import logging
from time import strptime
import time
from core_service.utils import valid_date_range
from injector import inject
from rapportage_service.repositories.banktransactieservice_repository import BanktransactieServiceRepository
from rapportage_service.repositories.huishoudboekjeservice_repository import HuishoudboekjeserviceRepository
from rapportage_service.controllers.saldoController import SaldoController
import pandas as pd


class CitizenController():
    _hhb_repository: HuishoudboekjeserviceRepository
    _banktransactionservice_repository: BanktransactieServiceRepository

    @inject
    def __init__(self, hhb_repository: HuishoudboekjeserviceRepository) -> None:
        self._hhb_repository = hhb_repository

    def get_citizens_for_alarms(self, alarmIds):
        return self._hhb_repository.get_citizen_ids_for_alarms(alarmIds)
