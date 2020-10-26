""" Test POST /rekeningen/(<rekening_id>/) """
import json

def test_rekeningen_organisatie_delete_success(client, rekening_organisatie_factory):
    """ Test /gebruikers/<object_id>/rekeningen/ path """
    rekening_organisatie = rekening_organisatie_factory.create_rekening_organisatie()
    assert len(rekening_organisatie.organisatie.rekeningen) == 1
    response = client.delete(
        f'/organisaties/{rekening_organisatie.organisatie.id}/rekeningen/',
        data=json.dumps({"rekening_id": rekening_organisatie.rekening.id}),
        content_type='application/json'
    )
    assert response.status_code == 202
    assert len(rekening_organisatie.organisatie.rekeningen) == 0

def test_rekeningen_organisatie_delete_relation_not_found(client, organisatie_factory, rekening_factory):
    """ Test /gebruikers/<object_id>/rekeningen/ path """
    organisatie = organisatie_factory.createOrganisatie()
    rekening = rekening_factory.create_rekening()
    response = client.delete(
        f'/organisaties/{organisatie.id}/rekeningen/',
        data=json.dumps({"rekening_id": rekening.id}), 
        content_type='application/json'
    )
    assert response.status_code == 404
    assert response.json["errors"][0] == "Rekening / Organisatie relation not found."
