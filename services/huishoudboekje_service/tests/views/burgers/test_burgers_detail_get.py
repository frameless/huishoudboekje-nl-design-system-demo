""" Test GET /burgers/<burgers_id> """
import pytest
from core_service.utils import row2dict

def test_burgers_detail_get_success(client, burger_factory):
    """ Test a succesfull GET on burgers_detail """
    burger = burger_factory.createBurger()
    response = client.get('/burgers/1')
    assert response.status_code == 200
    assert response.json["data"] == row2dict(burger)


@pytest.mark.parametrize("burger, statuscode, message", [
    ("1337", 404, "Burger not found."),
    ("a", 400, "Supplied id 'a' is not valid.")
])
def test_burgers_detail_get_invalid_burger(app, burger, statuscode, message):
    """ Test a GET on burgers_detail with a invalid burger. """
    client = app.test_client()
    response = client.get(f'/burgers/{burger}')
    assert response.status_code == statuscode
    assert response.json["errors"][0] == message
