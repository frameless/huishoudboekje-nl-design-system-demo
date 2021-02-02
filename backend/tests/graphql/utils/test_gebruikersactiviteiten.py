import graphene
import pytest
import requests_mock

from hhb_backend.graphql import settings
from hhb_backend.graphql.utils.gebruikersactiviteiten import gebruikers_activiteit_entities, GebruikersActiviteitEntity, \
    extract_gebruikers_activiteit, GebruikersActiviteit, log_gebruikers_activiteit


class TestEntity(graphene.ObjectType):
    id: graphene.Int()
    attribute: graphene.String()


class TestEntityResponse(graphene.Mutation):
    entity = graphene.Field(lambda: TestEntity)
    previous = graphene.Field(lambda: TestEntity)

    @property
    def gebruikers_activiteit(self):
        return dict(
            action="Test",
            entities=gebruikers_activiteit_entities(result=self, key="entity", entity_type="entity"),
            before=dict(entity=self.previous),
            after=dict(entity=self.entity)
        )

    @log_gebruikers_activiteit
    async def mutate(root, info):
        return TestEntityResponse(entity=dict(id=1, attribute='new'), previous=dict(id=1, attribute='old'))


def test_gebruikers_activiteit_entities_mutation():
    result = TestEntityResponse(entity=dict(id=1, attribute="test"))
    assert gebruikers_activiteit_entities(result=result, key='entity', entity_type='entity') == [
        GebruikersActiviteitEntity(entity_type='entity', entity_id=1)]


def test_gebruikers_activiteit_entities_dict():
    result = dict(entity=dict(id=2, attribute="test"))
    assert gebruikers_activiteit_entities(result=result, key='entity', entity_type='entity') == [
        GebruikersActiviteitEntity(entity_type='entity', entity_id=2)]


def test_gebruikers_activiteit_entities_nested_relation():
    result = dict(
        entity=dict(
            id=1,
            relation=dict(id=11, name='related'),
            attribute="test"))
    assert gebruikers_activiteit_entities(result=result["entity"], key='relation', entity_type='relation') == [
        GebruikersActiviteitEntity(entity_type='relation', entity_id=11)]


def test_gebruikers_activiteit_entities_nested_relations():
    result = dict(
        entity=dict(
            id=1,
            relation=[
                dict(id=11, name='related'),
                dict(id=12, name='related too'),
            ],
            attribute="test"))
    assert gebruikers_activiteit_entities(result=result["entity"], key='relation', entity_type='relation') == [
        GebruikersActiviteitEntity(entity_type='relation', entity_id=11),
        GebruikersActiviteitEntity(entity_type='relation', entity_id=12)]


def test_gebruikers_activiteit_entities_relation_id():
    entity = dict(
        id=1,
        relation_id=13,
        attribute="test")
    assert gebruikers_activiteit_entities(result=entity, key='relation_id', entity_type='relation') == [
        GebruikersActiviteitEntity(entity_type='relation', entity_id=13)]


def test_gebruikers_activiteit_entities_none():
    assert gebruikers_activiteit_entities(result=None, key='entity', entity_type='entity') == []


def test_gebruikers_activiteit_entities_empty_dict():
    assert gebruikers_activiteit_entities(result=dict(), key='entity', entity_type='entity') == []


def test_gebruikers_activiteit_entities_empty_object():
    assert gebruikers_activiteit_entities(result=TestEntityResponse(), key='entity', entity_type='entity') == []


def test_extract_gebruikers_activiteit():
    result = TestEntityResponse(entity=dict(id=1, attribute="after test"), previous=dict(id=-1, attribute="before test"))
    assert extract_gebruikers_activiteit(result) == dict(
        action="Test",
        entities=[dict(entityType="entity", entityId=1)],
        snapshot_before=dict(entity=dict(id=-1, attribute="before test")),
        snapshot_after=dict(entity=dict(id=1, attribute="after test"))
    )

@pytest.mark.asyncio
async def test_log_gebruikers_activiteit(client):
    # result = TestEntityResponse(entity=dict(id=1, attribute="after test"), previous=dict(id=-1, attribute="before test"))
    with requests_mock.Mocker() as mock:
        log_request = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data":{"id":1}}, status_code=201)

        # TODO properly mock flask.request and flask.g
        await TestEntityResponse.mutate(None, None)

        assert log_request.call_count == 1

