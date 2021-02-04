from dataclasses import dataclass

import graphene
import pytest
import requests_mock

from hhb_backend.graphql import settings
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    GebruikersActiviteitEntity,
    extract_gebruikers_activiteit,
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


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
            entities=gebruikers_activiteit_entities(
                entity_type="entity", result=self, key="entity"
            ),
            before=dict(entity=self.previous),
            after=dict(entity=self.entity),
        )

    @log_gebruikers_activiteit
    async def mutate(root, _):
        return TestEntityResponse(
            entity=dict(id=1, attribute="new"), previous=dict(id=1, attribute="old")
        )


class TestEntityQuery:
    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="entity", result=id),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolve(cls, _root, _info, id):
        return {"id": id}


class TestEntitiesQuery:
    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids=None, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="entity", result=ids),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolve(cls, _root, _info, ids=None):
        return [{"id": id} for id in (ids if ids else [1, 2, 3])]


def test_gebruikers_activiteit_entities_mutation():
    result = TestEntityResponse(entity=dict(id=1, attribute="test"))
    assert gebruikers_activiteit_entities(
        entity_type="entity", result=result, key="entity"
    ) == [GebruikersActiviteitEntity(entity_type="entity", entity_id=1)]


def test_gebruikers_activiteit_entities_dict():
    result = dict(entity=dict(id=2, attribute="test"))
    assert gebruikers_activiteit_entities(
        entity_type="entity", result=result, key="entity"
    ) == [GebruikersActiviteitEntity(entity_type="entity", entity_id=2)]


def test_gebruikers_activiteit_entities_nested_relation():
    result = dict(
        entity=dict(id=1, relation=dict(id=11, name="related"), attribute="test")
    )
    assert gebruikers_activiteit_entities(
        entity_type="relation", result=result["entity"], key="relation"
    ) == [GebruikersActiviteitEntity(entity_type="relation", entity_id=11)]


def test_gebruikers_activiteit_entities_nested_relations():
    result = dict(
        entity=dict(
            id=1,
            relation=[
                dict(id=11, name="related"),
                dict(id=12, name="related too"),
            ],
            attribute="test",
        )
    )
    assert gebruikers_activiteit_entities(
        entity_type="relation", result=result["entity"], key="relation"
    ) == [
        GebruikersActiviteitEntity(entity_type="relation", entity_id=11),
        GebruikersActiviteitEntity(entity_type="relation", entity_id=12),
    ]


def test_gebruikers_activiteit_entities_relation_id():
    entity = dict(id=1, relation_id=13, attribute="test")
    assert gebruikers_activiteit_entities(
        entity_type="relation", result=entity, key="relation_id"
    ) == [GebruikersActiviteitEntity(entity_type="relation", entity_id=13)]


def test_gebruikers_activiteit_entities_none():
    assert (
        gebruikers_activiteit_entities(entity_type="entity", result=None, key="entity")
        == []
    )


def test_gebruikers_activiteit_entities_empty_dict():
    assert (
        gebruikers_activiteit_entities(
            entity_type="entity", result=dict(), key="entity"
        )
        == []
    )


def test_gebruikers_activiteit_entities_empty_object():
    assert (
        gebruikers_activiteit_entities(
            entity_type="entity", result=TestEntityResponse(), key="entity"
        )
        == []
    )


def test_extract_gebruikers_activiteit():
    result = TestEntityResponse(
        entity=dict(id=1, attribute="after test"),
        previous=dict(id=-1, attribute="before test"),
    )
    assert extract_gebruikers_activiteit(result=result) == dict(
        action="Test",
        entities=[dict(entityType="entity", entityId=1)],
        snapshot_before=dict(entity=dict(id=-1, attribute="before test")),
        snapshot_after=dict(entity=dict(id=1, attribute="after test")),
    )


def test_extract_gebruikers_activiteit_classmethod():
    class TestEntityClass:
        @classmethod
        def gebruikers_activiteit(cls, *_args, **_kwargs):
            return dict(
                action="Test", entities=[dict(entity_type="entity", entity_id=1)]
            )

    o = TestEntityClass()
    assert extract_gebruikers_activiteit({}, o.__class__) == dict(
        action="Test",
        entities=[dict(entityType="entity", entityId=1)],
        snapshot_after=None,
        snapshot_before=None,
    )


@pytest.mark.asyncio
async def test_log_gebruikers_activiteit_mutation():
    with requests_mock.Mocker() as mock:
        log_request = mock.post(
            f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
            json={"data": {"id": 1}},
            status_code=201,
        )

        # TODO properly mock flask.request and flask.g
        await TestEntityResponse.mutate(None, None)

        assert log_request.call_count == 1


@dataclass
class MockResolveInfo:
    field_name: str


@pytest.mark.asyncio
async def test_log_gebruikers_activiteit_query():
    with requests_mock.Mocker() as mock:
        log_request = mock.post(
            f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
            json={"data": {"id": 1}},
            status_code=201,
        )

        # TODO properly mock flask.request and flask.g
        await TestEntityQuery.resolve(None, MockResolveInfo(field_name="entity"), 1)

        assert log_request.call_count == 1


@pytest.mark.asyncio
async def test_log_gebruikers_activiteit_query_list():
    with requests_mock.Mocker() as mock:
        log_request = mock.post(
            f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
            json={"data": {"id": 1}},
            status_code=201,
        )

        # TODO properly mock flask.request and flask.g
        await TestEntitiesQuery.resolve(None, MockResolveInfo(field_name="entity"))

        assert log_request.call_count == 1


@pytest.mark.asyncio
async def test_log_gebruikers_activiteit_query_list_ids():
    with requests_mock.Mocker() as mock:
        log_request = mock.post(
            f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
            json={"data": {"id": 1}},
            status_code=201,
        )

        # TODO properly mock flask.request and flask.g
        await TestEntitiesQuery.resolve(
            None, MockResolveInfo(field_name="entity"), ids=[2, 3]
        )

        assert log_request.call_count == 1
