""" Test GET /burgers """
from core_service.utils import row2dict


def test_burgers_get_empty_db(app):
    """ Test burgers call with empty database. """
    response = app.test_client().get('/burgers')
    assert response.status_code == 200
    assert {'data': []} == response.json


def test_burgers_get_single_burger(client, burger_factory):
    """ Test burgers call with a single burger in database. """
    burger = burger_factory.createBurger()
    response = client.get('/burgers')
    assert response.status_code == 200
    assert response.json["data"] == [row2dict(burger)]
