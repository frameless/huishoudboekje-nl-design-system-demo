# Grootboek Service

This service contains the functionality needed to access data from grootboeken
 
## Setup

- Install dependencies
    ```shell
    pip install -r requirements.txt
    ```

- Put in `.envrc`:
    ```shell
    export PATH=/Applications/Postgres.app/Contents/Versions/13/bin:$PATH
    export FLASK_APP="grootboek_service.app"
    export FLASK_RUN_PORT="8003"
    export FLASK_ENV="development"
    export HHB_SECRET="local-secret"
    export GROOTBOEK_DATABASE_URL="postgresql://grootboekservice:grootboekservice@localhost/grootboekservice"
    export APP_SETTINGS="grootboek_service.config.DevelopmentConfig"
    ```

- setup db (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)
    ```shell
    createuser --echo --login --host localhost --username postgres grootboekservice
    createdb --echo --owner grootboekservice --host localhost --username postgres grootboekservice
    psql --host localhost --username postgres --dbname postgres --command "ALTER USER grootboekservice WITH ENCRYPTED PASSWORD 'grootboekservice';"
    python manage.py db upgrade
    ```

- run app
    ```shell script
    flask run
    ```


## Project Layout

### Layer 1 (database)

#### models
Contains ORM models for the Grootboek Service

#### migrations
Database migration schema

##### Create new migration
```shell script
python manage.py db migrate
```


### Layer 2 (services)

#### grootboek_service
[API documentation](docs/openapi.yaml)
