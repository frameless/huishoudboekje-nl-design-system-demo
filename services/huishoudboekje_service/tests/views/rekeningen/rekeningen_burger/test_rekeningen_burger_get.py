""" Test GET /rekeningen/(<rekening_id>/) """
from core_service.utils import row2dict


def test_burger_rekeningen_get_success(client, rekening_burger_factory, rekening_factory):
    """ Test /burgers/<object_id>/rekeningen/ path """
    rekening_burger = rekening_burger_factory.create_rekening_burger()
    not_used_rekening = rekening_factory.create_rekening()

    response = client.get(f'/burgers/{rekening_burger.burger.id}/rekeningen/')
    assert response.status_code == 200
    assert row2dict(rekening_burger.rekening) in response.json["data"]
    assert row2dict(not_used_rekening) not in response.json["data"]
