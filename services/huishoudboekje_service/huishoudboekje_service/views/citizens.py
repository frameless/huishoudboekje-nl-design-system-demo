""" MethodView for /burgers/ path """
from datetime import date
import logging
from models.burger import Burger
from core_service.views.hhb_view import HHBView
from flask import request, abort, make_response
from sqlalchemy import or_, func, and_, cast, String, any_, select
from core_service.utils import row2dict
from models.rekening_burger import RekeningBurger
from core_service.database import db
from models.afspraak import Afspraak
from models.rekening import Rekening

from sqlalchemy.dialects import postgresql


class CitizenView(HHBView):
    """ Methods for /citizens/ path """
    hhb_model = Burger
    validation_data = {
        "type": "object",
        "properties": {
        },
        "required": []
    }

    def get(self, **kwargs):
        alarm_ids = request.json.get("alarm_ids", None)
        if alarm_ids != None:
            data = self.__get_citizen_uuids_by_alarm_id(alarm_ids)
            if data != None:
                return [self.__create_json_response(row) for row in data]
        return []

    def __get_citizen_uuids_by_alarm_id(self, alarm_ids):
        query = (select(Afspraak.uuid, Afspraak.alarm_id, Burger.uuid).join(
            Afspraak.burger).where(Afspraak.alarm_id.in_(alarm_ids)))
        return db.session.execute(query).all()

    def __create_json_response(self, row):
        (afspraak_id, alarm_id, burger_uuid) = row
        return {"agreement": afspraak_id, "alarm": alarm_id, "citizen": burger_uuid}
