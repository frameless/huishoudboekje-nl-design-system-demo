""" MethodView for /organisaties/<organisatie_id>/rekeningen path """
from flask import request, abort, make_response
from sqlalchemy.orm.exc import FlushError

from core_service.utils import row2dict, one_or_none
from core_service.views.hhb_view import HHBView
from models import RekeningAfdeling, Afdeling


class RekeningAfdelingView(HHBView):
    """ Methods for /afdelingen/<afdeling_id>/rekeningen path """

    hhb_model = Afdeling
    validation_data = {
        "type": "object",
        "properties": {
            "rekening_id": {
                "type": "integer",
            },
            "afdeling_id": {
                "type": "integer"
            }
        },
        "required": []
    }

    def get(self, **kwargs):
        """ GET /afdelingen/<afdeling_id>/rekeningen

        returns
        """
        object_id = self.get_object_id_from_kwargs(**kwargs)
        self.hhb_object.get_or_404(object_id)
        rekeningen = [row2dict(o.rekening) for o in self.hhb_object.hhb_object.rekeningen]
        return {"data": rekeningen}, 200

    def post(self, **kwargs):
        """ Add a rekening to a afdeling """
        self.input_validate()
        object_id = self.get_object_id_from_kwargs(**kwargs)
        self.hhb_object.get_or_404(object_id)
        afdeling_id = self.hhb_object.hhb_object.id
        rekening_id = request.json["rekening_id"]
        relation = RekeningAfdeling(
            afdeling_id=afdeling_id,
            rekening_id=rekening_id
        )
        self.db.session.add(relation)
        try:
            self.hhb_object.commit_changes()
        except FlushError:
            return {"errors": ["Afdeling / Rekening relation already exsists."]}, 409
        return {}, 201

    def delete(self, **kwargs):
        self.input_validate()
        object_id = self.get_object_id_from_kwargs(**kwargs)
        self.hhb_object.get_or_404(object_id)
        afdeling_id = self.hhb_object.hhb_object.id
        rekening_id = request.json["rekening_id"]
        rekening_afdeling_relation = one_or_none(RekeningAfdeling.query.filter(
                RekeningAfdeling.afdeling_id == afdeling_id
            ).filter(RekeningAfdeling.rekening_id == rekening_id))
        if not rekening_afdeling_relation:
            abort(make_response({"errors": [f"Rekening / Afdeling relation not found."]}, 404))
        self.db.session.delete(rekening_afdeling_relation)
        self.hhb_object.commit_changes()
        return {}, 202
