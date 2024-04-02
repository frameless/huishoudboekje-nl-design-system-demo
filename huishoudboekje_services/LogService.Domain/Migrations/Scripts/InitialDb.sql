--
-- var sqlFile = Path.Combine("Migrations/Scripts/InitialDb.sql");
--       migrationBuilder.Sql(File.ReadAllText(sqlFile));


-- migrationBuilder.Sql(
--         "INSERT INTO user_activity_entities (\"UserActivitiesUuid\", \"entity_id\", \"entity_type\") " +
--         "SELECT " +
--           "uuid::UUID," +
--           "(json->>'entityId')::TEXT," +
--           "(json->>'entityType')::TEXT " +
--         "FROM (" +
--           "SELECT " +
--             "uuid," +
--             "jsonb_array_elements(REPLACE(BTRIM(entities::TEXT, '\"'),'''', '\"')::jsonb) AS json " +
--           "FROM user_activities " +
--         ") AS subquery;");

 TABLE IF NOT EXISTS alembic_version
(
    version_num character varying
(
    32
) NOT NULL,
    CONSTRAINT alembic_version_pkc PRIMARY KEY
(
    version_num
)
    );

CREATE TABLE IF NOT EXISTS gebruikersactiviteiten
(
    id
    integer
    GENERATED
    BY
    DEFAULT AS
    IDENTITY,
    timestamp
    timestamp
    with
    time
    zone
    NOT
    NULL,
    gebruiker_id
    character
    varying
    NULL,
    action
    character
    varying
    NOT
    NULL,
    entities
    jsonb
    NOT
    NULL,
    snapshot_before
    jsonb
    NULL,
    snapshot_after
    jsonb
    NULL,
    meta
    jsonb
    NOT
    NULL,
    uuid
    uuid
    NOT
    NULL
    DEFAULT (
    gen_random_uuid
(
)),
    CONSTRAINT gebruikersactiviteiten_pkey PRIMARY KEY
(
    id
)
    );

CREATE UNIQUE INDEX IF NOT EXISTS ix_gebruikersactiviteiten_uuid ON gebruikersactiviteiten (uuid);
