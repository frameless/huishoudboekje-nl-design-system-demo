""" Test POST /rekeningen/(<rekening_id>/) """
import json
from core_service.utils import row2dict

def test_gebruiker_rekeningen_post_success(client, gebruiker_factory, rekening_factory):
    """ Test /gebruikers/<object_id>/rekeningen/ path """
    gebruiker = gebruiker_factory.createGebruiker()
    rekening = rekening_factory.create_rekening()
    assert len(gebruiker.rekeningen) == 0
    response = client.post(
        f'/gebruikers/{gebruiker.id}/rekeningen/',
        data=json.dumps({"rekening_id": rekening.id}),
        content_type='application/json'
    )
    assert response.status_code == 201
    assert len(gebruiker.rekeningen) == 1
    assert gebruiker.rekeningen[0].rekening == rekening

def test_gebruiker_rekeningen_post_realtion_already_exsists(client, rekening_gebruiker_factory):
    """ Test /gebruikers/<object_id>/rekeningen/ path """
    rekening_gebruiker = rekening_gebruiker_factory.create_rekening_gebruiker()
    response = client.post(
        f'/gebruikers/{rekening_gebruiker.gebruiker.id}/rekeningen/',
        data=json.dumps({"rekening_id": rekening_gebruiker.rekening.id}),
        content_type='application/json'
    )
    assert response.status_code == 409
    assert response.json["errors"][0] == "Gebruiker / Rekening relation already exsists."
