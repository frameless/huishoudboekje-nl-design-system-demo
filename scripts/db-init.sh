#!/bin/sh

# This script is used to initialize the database for the first time in docker-compose.yaml -> services.db-init

export PGUSER=postgres
export PGPASSWORD=postgres
export PGHOST=db

while true; do
  sleep 1;
  echo Waiting for database...;
  if nc -z $PGHOST 5432; then
      echo Database is up!;
      break 1;
  fi;
done

psql -c "CREATE USER hhb WITH PASSWORD 'hhb'" || true
psql -c "ALTER USER hhb WITH SUPERUSER" || true
psql -c "CREATE DATABASE huishoudboekjeservice" || true
psql -c "CREATE DATABASE organisatieservice" || true
psql -c "CREATE DATABASE banktransactieservice" || true
psql -c "CREATE DATABASE grootboekservice" || true
psql -c "CREATE DATABASE logservice" || true
psql -c "CREATE DATABASE postadressenservice" || true
psql -c "CREATE DATABASE alarmenservice" || true
psql -c "CREATE DATABASE signalenservice" || true
