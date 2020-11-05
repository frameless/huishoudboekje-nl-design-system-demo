""" MethodView for /organisaties/<organisatie_id>/rekeningen path """
from flask import request, abort, make_response
from sqlalchemy.orm.exc import FlushError
from core_service.utils import row2dict
from core_service.views.hhb_view import HHBView
from models import RekeningOrganisatie, Organisatie, Rekening

class RekeningOrganisatieView(HHBView):
    """ Methods for /organisaties/<organisatie_id>/rekeningen path """

    hhb_model = Organisatie
    validation_data = {
        "type": "object",
        "properties": {
            "rekening_id": {
                "type": "integer",
            },
        },
        "required": []
    }

    def get(self, **kwargs):
        """ GET /organisaties/<organisatie_id>/rekeningen

        returns
        """
        object_id = self.get_object_id_from_kwargs(**kwargs)
        self.hhb_object.get_or_404(object_id)
        rekeningen = [row2dict(o.rekening) for o in self.hhb_object.hhb_object.rekeningen]
        return {"data": rekeningen}, 200

    def post(self, **kwargs):
        """ Add a rekening to a organisatie """
        self.input_validate()
        object_id = self.get_object_id_from_kwargs(**kwargs)
        self.hhb_object.get_or_404(object_id)
        organisatie_id = self.hhb_object.hhb_object.id
        rekening_id = request.json["rekening_id"]
        relation = RekeningOrganisatie(
            organisatie_id=organisatie_id,
            rekening_id=rekening_id
        )
        self.db.session.add(relation)
        try:
            self.hhb_object.commit_changes()
        except FlushError:
            return {"errors": ["Organisatie / Rekening relation already exsists."]}, 409
        return {}, 201

    def delete(self, **kwargs):
        self.input_validate()
        object_id = self.get_object_id_from_kwargs(**kwargs)
        self.hhb_object.get_or_404(object_id)
        organisatie_id = self.hhb_object.hhb_object.id
        rekening_id = request.json["rekening_id"]
        rekening_organisatie_relation = RekeningOrganisatie.query.filter(
                RekeningOrganisatie.organisatie_id == organisatie_id
            ).filter(RekeningOrganisatie.rekening_id == rekening_id).one_or_none()
        if not rekening_organisatie_relation:
            abort(make_response({"errors": [f"Rekening / Organisatie relation not found."]}, 404))
        self.db.session.delete(rekening_organisatie_relation)
        self.hhb_object.commit_changes()
        return {}, 202