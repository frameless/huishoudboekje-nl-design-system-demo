""" Test DELETE /burgers/<burgers_id> """
from models import Burger, RekeningBurger


def test_burgers_detail_delete_success(client, session, burger_factory):
    """ Test a succesfull DELETE on burgers_detail """
    burger = burger_factory.createBurger()
    assert session.query(Burger).count() == 1
    response = client.delete(f'/burgers/{burger.id}')
    assert response.status_code == 204
    assert session.query(Burger).count() == 0

def test_burgers_delete_cascade_rekening_relation(client, session, rekening_burger_factory):
    """ Test a succesfull DELETE on burger with cascading rekening relation """
    rekening_burger = rekening_burger_factory.create_rekening_burger()
    assert session.query(Burger).count() == 1
    assert session.query(RekeningBurger).count() == 1
    response = client.delete(f'/burgers/{rekening_burger.burger.id}')
    assert response.status_code == 204
    assert session.query(Burger).count() == 0
    assert session.query(RekeningBurger).count() == 0
