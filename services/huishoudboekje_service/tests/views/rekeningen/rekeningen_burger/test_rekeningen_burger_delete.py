""" Test POST /rekeningen/(<rekening_id>/) """
import json


def test_burger_rekeningen_delete_success(client, rekening_burger_factory):
    """ Test /burgers/<object_id>/rekeningen/ path """
    rekening_burger = rekening_burger_factory.create_rekening_burger()
    assert len(rekening_burger.burger.rekeningen) == 1
    response = client.delete(
        f'/burgers/{rekening_burger.burger.id}/rekeningen/',
        data=json.dumps({"rekening_id": rekening_burger.rekening.id}),
        content_type='application/json'
    )
    assert response.status_code == 202
    assert len(rekening_burger.burger.rekeningen) == 0


def test_burger_rekeningen_delete_relation_not_found(client, burger_factory, rekening_factory):
    """ Test /burgers/<object_id>/rekeningen/ path """
    burger = burger_factory.createBurger()
    rekening = rekening_factory.create_rekening()
    response = client.delete(
        f'/burgers/{burger.id}/rekeningen/',
        data=json.dumps({"rekening_id": rekening.id}),
        content_type='application/json'
    )
    assert response.status_code == 404
    assert response.json["errors"][0] == "Rekening / Burger relation not found."
