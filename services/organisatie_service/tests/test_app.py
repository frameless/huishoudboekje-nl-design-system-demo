""" Test app organisatie_service features """

def test_app_health(client):
    """ Test health response from app """
    response = client.get("/health")
    assert response.status_code == 200
