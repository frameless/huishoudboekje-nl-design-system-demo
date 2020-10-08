def test_gebruikers_success(client):
    response = client.post(
        "/graphql",
        data='{"query": "{ gebruikers { email }}"}',
        content_type='application/json'
    )
    print(response.json)

