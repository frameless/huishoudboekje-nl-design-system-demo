# Logservice
This service contains the functionality needed to access data from the application logging.

## Setup development with Docker Compose
- This service will automatically start when running `docker-compose up`.

## Manual setup of a development environment (Mac and UNIX)
- Install dependencies
    ```shell
    pip install -r requirements.txt
    ```

- Put in `.envrc`:
    ```shell
    export PATH=/Applications/Postgres.app/Contents/Versions/13/bin:$PATH
    export FLASK_APP="log_service.app"
    export FLASK_RUN_PORT="8004"
    export FLASK_ENV="development"
    export JWT_SECRET="local-secret"
    export LOG_DATABASE_URL="postgresql://logservice:logservice@localhost/logservice"
    export APP_SETTINGS="log_service.config.DevelopmentConfig"
    ```

- Setup your database (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)
    ```shell
    createuser --echo --login --host localhost --username postgres logservice
    createdb --echo --owner logservice --host localhost --username postgres logservice
    psql --host localhost --username postgres --dbname postgres --command "ALTER USER logservice WITH ENCRYPTED PASSWORD 'logservice';"
    python manage.py db upgrade
    ```

- Start the app
    ```shell script
    flask run
    ```

## Manual setup of a development environment (Windows)
- Install a virtual environment

    ```shell
    virtualenv log_service
    cd log_service
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
    set FLASK_APP=log_service.app
    set FLASK_RUN_PORT=8004
    set FLASK_ENV=development
    set JWT_SECRET="local-secret"
    set LOG_DATABASE_URL=postgresql://logservice:logservice@localhost/logservice
    set APP_SETTINGS=log_service.config.DevelopmentConfig
    ```

- Activate the virtual environment
    ```shell
    Scripts\\activate
    ```

- Setup your database (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)

- Using [pgAdmin](https://www.pgadmin.org/):
  - Create login/Group ROLE:
    ```text  
    Name = logservice
    Password = logservice
    Privileges: Can login ON
                Superuser ON
    ```
    - Create Database:
    ```text
    name = logservice
    Owner = logservice
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

#### Models
Contains ORM models for the Logservice

#### Migrations
Database migration schema

##### Create new migration
```shell script
python manage.py db migrate
```


### Layer 2 (services)

#### log_service
[API documentation](docs/openapi.yaml)
