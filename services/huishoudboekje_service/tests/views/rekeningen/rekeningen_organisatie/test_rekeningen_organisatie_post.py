""" Test POST /rekeningen/(<rekening_id>/) """
import json
from core_service.utils import row2dict

def test_rekeningen_organisatie_post_success(client, organisatie_factory, rekening_factory):
    """ Test /gebruikers/<object_id>/rekeningen/ path """
    organisatie = organisatie_factory.createOrganisatie()
    rekening = rekening_factory.create_rekening()
    assert len(organisatie.rekeningen) == 0
    response = client.post(
        f'/organisaties/{organisatie.id}/rekeningen/',
        data=json.dumps({"rekening_id": rekening.id}),
        content_type='application/json'
    )
    assert response.status_code == 201
    assert len(organisatie.rekeningen) == 1
    assert organisatie.rekeningen[0].rekening == rekening

def test_rekeningen_organisaties_post_realtion_already_exists(client, rekening_organisatie_factory):
    """ Test /gebruikers/<object_id>/rekeningen/ path """
    rekening_organisatie = rekening_organisatie_factory.create_rekening_organisatie()
    response = client.post(
        f'/organisaties/{rekening_organisatie.organisatie.id}/rekeningen/',
        data=json.dumps({"rekening_id": rekening_organisatie.rekening.id}),
        content_type='application/json'
    )
    assert response.status_code == 409
    assert response.json["errors"][0] == "Key (rekening_id, organisatie_id)=(1, 1) already exists."
