# Organisatie Service

This service contains the functionality needed to access data that belongs to the Organisatie processes.
 
## Setup

- Install dependencies
    ```shell
    pip install -r requirements.txt
    ```

- Put in `.envrc`:
    ```shell
    export PATH=/Applications/Postgres.app/Contents/Versions/13/bin:$PATH
    export FLASK_APP="organisatie_service.app"
    export FLASK_RUN_PORT="8001"
    export FLASK_ENV="development"
    export HHB_SECRET="local-secret"
    export ORGANISATIE_DATABASE_URL="postgresql://organisatieservice:organisatieservice@localhost/organisatieservice"
    export APP_SETTINGS="organisatie_service.config.DevelopmentConfig"
    ```

- setup db (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)
    ```shell
    createuser --echo --login --host localhost --username postgres organisatieservice
    createdb --echo --owner organisatieservice --host localhost --username postgres organisatieservice
    psql --host localhost --username postgres --dbname postgres --command "ALTER USER organisatieservice WITH ENCRYPTED PASSWORD 'organisatieservice';"
    python manage.py db upgrade
    ```

- run app
    ```shell script
    flask run
    ```


## Project Layout

### Layer 1 (database)

#### models
Contains ORM models for Organisatie Service

#### migrations
Database migration schema

##### Create new migration
```shell script
python manage.py db migrate
```


### Layer 2 (services)

#### organisatie_service
[API documentation](docs/openapi.yaml)
