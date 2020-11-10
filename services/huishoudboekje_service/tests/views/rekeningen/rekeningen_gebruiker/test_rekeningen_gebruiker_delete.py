""" Test POST /rekeningen/(<rekening_id>/) """
import json

def test_gebruiker_rekeningen_delete_success(client, rekening_gebruiker_factory):
    """ Test /gebruikers/<object_id>/rekeningen/ path """
    rekening_gebruiker = rekening_gebruiker_factory.create_rekening_gebruiker()
    assert len(rekening_gebruiker.gebruiker.rekeningen) == 1
    response = client.delete(
        f'/gebruikers/{rekening_gebruiker.gebruiker.id}/rekeningen/',
        data=json.dumps({"rekening_id": rekening_gebruiker.rekening.id}),
        content_type='application/json'
    )
    assert response.status_code == 202
    assert len(rekening_gebruiker.gebruiker.rekeningen) == 0

def test_gebruiker_rekeningen_delete_relation_not_found(client, gebruiker_factory, rekening_factory):
    """ Test /gebruikers/<object_id>/rekeningen/ path """
    gebruiker = gebruiker_factory.createGebruiker()
    rekening = rekening_factory.create_rekening()
    response = client.delete(
        f'/gebruikers/{gebruiker.id}/rekeningen/',
        data=json.dumps({"rekening_id": rekening.id}), 
        content_type='application/json'
    )
    assert response.status_code == 404
    assert response.json["errors"][0] == "Rekening / Gebruiker relation not found."
