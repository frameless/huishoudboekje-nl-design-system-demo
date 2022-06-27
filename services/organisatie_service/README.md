# Organisatieservice
This service contains the functionality needed to access data that belongs to the Organisatie processes.

## Setup development with Docker Compose
- This service will automatically start when running `docker-compose up`.

## Manual setup of a development environment (Mac and Unix)
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
    export JWT_SECRET="local-secret"
    export ORGANISATIE_DATABASE_URL="postgresql://organisatieservice:organisatieservice@localhost/organisatieservice"
    export APP_SETTINGS="organisatie_service.config.DevelopmentConfig"
    ```

- Setup your database (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)
    ```shell
    createuser --echo --login --host localhost --username postgres organisatieservice
    createdb --echo --owner organisatieservice --host localhost --username postgres organisatieservice
    psql --host localhost --username postgres --dbname postgres --command "ALTER USER organisatieservice WITH ENCRYPTED PASSWORD 'organisatieservice';"
    python manage.py db upgrade
    ```

- Start the app
    ```shell script
    flask run
    ```

## Manual setup of a development environment (Windows)
- Install a virtual environment \
    ```shell
    virtualenv organisatie_service
    cd organisatie_service
    Scripts\\activate
    ```

- Install dependencies in the virtual environment
    ```shell
    pip install -e .
    ```
    or
    ```shell
    pip install -r requirements.txt
    ```

- Deactivate the virtual environment
    ```shell
    deactivate
    ```

- Put in `Scripts\activate.bat`:
    ```shell
    set PATH=/Applications/Postgres.app/Contents/Versions/13/bin;%PATH%
    set FLASK_APP=organisatie_service.app
    set FLASK_RUN_PORT=8001
    set FLASK_ENV="development"
    set JWT_SECRET="local-secret"
    set ORGANISATIE_DATABASE_URL=postgresql://organisatieservice:organisatieservice@localhost/organisatieservice
    set APP_SETTINGS=organisatie_service.config.DevelopmentConfig
    ```

- Activate the virtual environment
    ```shell
    Scripts\\activate
    ```

- Setup your database (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)

- Using [pgAdmin](https://www.pgadmin.org/):
  - Create login/Group ROLE:
    ```text
    Name = organisatieservice
    Password = organisatieservice
    Privileges: Can login ON
                Superuser ON
    ```
  - Create Database:
    ```text  
    name = organisatieservice
    Owner = organisatieservice
    ```

- Run database upgrade
    ```shell
    py manage.py db upgrade
    ```

- Start the app
    ```shell script
    flask run
    ```

## Project Layout

### Layer 1 (database)

#### models
Contains ORM models for Organisatieservice

#### migrations
Database migration schema

##### Create new migration
```shell script
python manage.py db migrate
```


### Layer 2 (services)

#### organisatie_service
[API documentation](docs/openapi.yaml)
