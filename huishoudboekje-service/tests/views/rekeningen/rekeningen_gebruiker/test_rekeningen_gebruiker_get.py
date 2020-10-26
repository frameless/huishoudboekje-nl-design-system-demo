""" Test GET /rekeningen/(<rekening_id>/) """
from core.utils import row2dict

def test_gebruiker_rekeningen_get_success(client, rekening_gebruiker_factory, rekening_factory):
    """ Test /gebruikers/<object_id>/rekeningen/ path """
    rekening_gebruiker = rekening_gebruiker_factory.create_rekening_gebruiker()
    not_used_rekening = rekening_factory.create_rekening()
    
    response = client.get(f'/gebruikers/{rekening_gebruiker.gebruiker.id}/rekeningen/')
    assert response.status_code == 200
    assert row2dict(rekening_gebruiker.rekening) in response.json["data"]
    assert row2dict(not_used_rekening) not in response.json["data"]
