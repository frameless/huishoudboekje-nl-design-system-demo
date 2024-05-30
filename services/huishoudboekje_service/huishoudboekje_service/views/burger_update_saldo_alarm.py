""" MethodView for /burgers/ path """
from datetime import date
import logging
from models.burger import Burger
from core_service.views.hhb_view import HHBView
from flask import request, abort, make_response
from sqlalchemy import or_, func, and_, cast, String, any_
from core_service.utils import row2dict
from models.rekening_burger import RekeningBurger
from core_service.database import db
from models.afspraak import Afspraak
from models.rekening import Rekening

from sqlalchemy.dialects import postgresql


class BurgerUpdateSaldoAlarmView(HHBView):
    """ Methods for /burgers/saldo_alarm/(<burger_id>) path """
    hhb_model = Burger
    validation_data = {
        "type": "object",
        "properties": {
            "saldo_alarm": {
                "type": ["boolean"]
            }
        },
        "required": []
    }

    def post(self, **kwargs):
        id = request.json.get("id")
        saldo_alarm = request.json.get("saldo_alarm")
        if id and saldo_alarm != None:
            query = Burger.query.filter(Burger.id == id)\
                .update({Burger.saldo_alarm: saldo_alarm}, synchronize_session="auto")

            self.hhb_object.commit_changes()

            new_citizen = Burger.query.filter(Burger.id == id)

            return {"data": row2dict(row) for row in new_citizen}
        return {}, 400
