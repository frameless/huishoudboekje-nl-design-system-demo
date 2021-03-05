#!/bin/sh

#set -x

: "${DATABASE_URL:?DATABASE_URL not set}"
: "${DATABASE_NAME:?DATABASE_NAME not set}"

psql -d "${DATABASE_URL}" -f "${DATABASE_NAME}_clean".sql

echo "Sample data cleaned from '${DATABASE_NAME}'"
