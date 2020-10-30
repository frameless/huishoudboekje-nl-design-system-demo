# Transactie Service

This service contains the functionality needed to access data from banktransactions
 
## Setup

- Python environment
    ```shell script
    pip install -r requirements.txt
    ```

- Postgres
  > for macOS you can use [Postgres.app](https://postgresapp.com/)
    ```
    PATH=/Applications/Postgres.app/Contents/Versions/13/bin:$PATH
    createuser --echo --login --host localhost --username postgres huishoudboekjeservice
    createdb --echo --owner huishoudboekjeservice --host localhost --username postgres transacties
    psql --host localhost --username postgres --dbname postgres --command "ALTER USER huishoudboekjeservice WITH ENCRYPTED PASSWORD 'huishoudboekjeservice';"
    ```

## Project Layout

### Layer 1 (database)

#### models
Contains ORM models for the Transaction Service

#### migrations
Database migration schema

##### Create new migration
```shell script
python manage.py db migrate
```

##### Apply migrations on database
```shell script
export TRANSACTIE_DATABASE_URL="postgresql://huishoudboekjeservice:huishoudboekjeservice@localhost/huishoudboekjeservice"
python manage.py db upgrade
```
### Layer 2 (services)

#### core
[API documentation](docs/openapi.yaml)

Prerequisites:

```shell script
export FLASK_APP="core.app"
export FLASK_RUN_PORT="8001"
export FLASK_ENV="development"
export HHB_SECRET="local-secret"
export ORGANISATIE_DATABASE_URL="postgresql://huishoudboekjeservice:huishoudboekjeservice@localhost/huishoudboekjeservice"
export APP_SETTINGS="core.config.DevelopmentConfig"

flask run
```

