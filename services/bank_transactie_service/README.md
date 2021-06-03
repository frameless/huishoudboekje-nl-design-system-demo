# Transactie Service

This service contains the functionality needed to access data from banktransactions
 
## Setup

- Install dependencies
    ```shell
    pip install -r requirements.txt
    ```

- Put in `.envrc`:
    ```shell
    export PATH=/Applications/Postgres.app/Contents/Versions/13/bin:$PATH
    export FLASK_APP="bank_transactie_service.app"
    export FLASK_RUN_PORT="8002"
    export FLASK_ENV="development"
    export HHB_SECRET="local-secret"
    export TRANSACTIE_DATABASE_URL="postgresql://transactieservice:transactieservice@localhost/transactieservice"
    export APP_SETTINGS="bank_transactie_service.config.DevelopmentConfig"
    ```

- setup db (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)
    ```shell
    createuser --echo --login --host localhost --username postgres transactieservice
    createdb --echo --owner transactieservice --host localhost --username postgres transactieservice
    psql --host localhost --username postgres --dbname postgres --command "ALTER USER transactieservice WITH ENCRYPTED PASSWORD 'transactieservice';"
    python manage.py db upgrade
    ```

- run app
    ```shell script
    flask run
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


### Layer 2 (services)

#### bank_transactie_service
[API documentation](docs/openapi.yaml)
