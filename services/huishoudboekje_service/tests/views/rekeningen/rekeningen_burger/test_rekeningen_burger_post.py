""" Test POST /rekeningen/(<rekening_id>/) """
import json


def test_burger_rekeningen_post_success(client, burger_factory, rekening_factory):
    """ Test /burgers/<object_id>/rekeningen/ path """
    burger = burger_factory.createBurger()
    rekening = rekening_factory.create_rekening()
    assert len(burger.rekeningen) == 0
    response = client.post(
        f'/burgers/{burger.id}/rekeningen/',
        data=json.dumps({"rekening_id": rekening.id}),
        content_type='application/json'
    )
    assert response.status_code == 201
    assert len(burger.rekeningen) == 1
    assert burger.rekeningen[0].rekening == rekening


def test_burger_rekeningen_post_realtion_already_exsists(client, rekening_burger_factory):
    """ Test /burgers/<object_id>/rekeningen/ path """
    rekening_burger = rekening_burger_factory.create_rekening_burger()
    response = client.post(
        f'/burgers/{rekening_burger.burger.id}/rekeningen/',
        data=json.dumps({"rekening_id": rekening_burger.rekening.id}),
        content_type='application/json'
    )
    assert response.status_code == 409
    assert response.json["errors"][0] == "Burger / Rekening relation already exsists."
