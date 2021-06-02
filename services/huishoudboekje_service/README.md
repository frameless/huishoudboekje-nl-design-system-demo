# Huishoudboekje Service

This service contains the functionality needed to access data that belongs to the Huishoudboekje processes.
 
## Setup

- Install dependencies
    ```shell
    pip install -r requirements.txt
    ```

- Put in `.envrc`:
    ```shell
    export PATH=/Applications/Postgres.app/Contents/Versions/13/bin:$PATH
    export FLASK_APP="huishoudboekje_service.app"
    export FLASK_RUN_PORT="8000"
    export FLASK_ENV="development"
    export HHB_SECRET="local-secret"
    export HHB_DATABASE_URL="postgresql://huishoudboekjeservice:huishoudboekjeservice@localhost/huishoudboekjeservice"
    export APP_SETTINGS="huishoudboekje_service.config.DevelopmentConfig"
    ```

- setup db (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)
    ```shell
    createuser --echo --login --host localhost --username postgres huishoudboekjeservice
    createdb --echo --owner huishoudboekjeservice --host localhost --username postgres huishoudboekjeservice
    psql --host localhost --username postgres --dbname postgres --command "ALTER USER huishoudboekjeservice WITH ENCRYPTED PASSWORD 'huishoudboekjeservice';"
    python manage.py db upgrade
    ```

- run app
    ```shell script
    flask run
    ```


## Project Layout

### Layer 1 (database)

#### models
Contains ORM models for Huishoudboekje Service

#### migrations
Database migration schema

##### Create new migration
```shell script
python manage.py db migrate
```


### Layer 2 (services)

#### core
[API documentation](docs/openapi.yaml)
