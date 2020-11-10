""" Test GET /rekeningen/(<rekening_id>/) """
from core_service.utils import row2dict

def test_rekeningen_organisatie_get_success(client, rekening_organisatie_factory, rekening_factory):
    """ Test /gebruikers/<object_id>/rekeningen/ path """
    rekening_organisatie = rekening_organisatie_factory.create_rekening_organisatie()
    not_used_rekening = rekening_factory.create_rekening()
    
    response = client.get(f'/organisaties/{rekening_organisatie.organisatie.id}/rekeningen/')
    assert response.status_code == 200
    assert row2dict(rekening_organisatie.rekening) in response.json["data"]
    assert row2dict(not_used_rekening) not in response.json["data"]
