""" Test DELETE /export/(<export_id>/) """
from models.export import Export

def test_exports_delete_success(client, session, export_factory):
    """ Test a succesfull DELETE on exports """
    export = export_factory.createExport()
    assert session.query(Export).count() == 1
    response = client.delete(f'/export/{export.id}')
    assert response.status_code == 204
    assert session.query(Export).count() == 0

def test_exports_delete_method_not_allowed(client):
    """ Test 405 error for DELETE on organisaties """
    response = client.delete('/export/')
    assert response.status_code == 405
    
def test_exports_delete_not_found(client):
    """ Test 404 error for DELETE on exports """
    response = client.delete('/export/1337')
    assert response.status_code == 404