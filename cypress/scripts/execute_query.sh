#!/bin/bash

# Define variables
PG_HOST="localhost"
PG_PORT="5432"
PG_DATABASE="alarmenservice"
PG_USER="postgres"
PG_PASSWORD="postgres"
QUERY="$1"

# Execute query
PGPASSWORD="$PG_PASSWORD" psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DATABASE" -c "$QUERY"