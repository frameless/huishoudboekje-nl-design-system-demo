#!/bin/sh

#set -x

: "${DATABASE_URL:?DATABASE_URL not set}"
: "${DATABASE_NAME:?DATABASE_NAME not set}"

RUBRIEKEN=$(psql -d "${DATABASE_URL}" -At -c "SELECT COUNT(*) FROM rubrieken;")

if [ "${RUBRIEKEN}" -gt 0 ]; then
  echo "Sample data already loaded for '${DATABASE_NAME}'"
  exit 0 # not an error, loading only works on a new database
fi

psql -d "${DATABASE_URL}" -f "${DATABASE_NAME}".sql

echo "Sample data loaded for '${DATABASE_NAME}'"
