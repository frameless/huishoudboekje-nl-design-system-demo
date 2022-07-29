# Transactieservice
This service contains the functionality needed to access data from banktransactions.

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
    export FLASK_APP="bank_transactie_service.app"
    export FLASK_RUN_PORT="8002"
    export FLASK_ENV="development"
    export JWT_SECRET="local-secret"
    export DATABASE_URL="postgresql://transactieservice:transactieservice@localhost/transactieservice"
    ```

- Setup your database (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)
    ```shell
    createuser --echo --login --host localhost --username postgres transactieservice
    createdb --echo --owner transactieservice --host localhost --username postgres transactieservice
    psql --host localhost --username postgres --dbname postgres --command "ALTER USER transactieservice WITH ENCRYPTED PASSWORD 'transactieservice';"
    python manage.py db upgrade
    ```

- Start the app
    ```shell script
    flask run
    ```

## Manual setup of a development environment (Windows)
- Install a virtual environment

    ```shell
    virtualenv bank_transactie_service
    cd bank_transacties_service
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
    set FLASK_APP=bank_transactie_service.app
    set FLASK_RUN_PORT=8002
    set FLASK_ENV="development"
    set JWT_SECRET="local-secret"
    set DATABASE_URL=postgresql://transactieservice:transactieservice@localhost/transactieservice
    ```

- Activate the virtual environment
    ```shell
    Scripts\\activate
    ```

- Setup your database (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)

- Using [pgAdmin](https://www.pgadmin.org/):
  - Create login/Group ROLE:
    ```text
    Name = transactieservice
    Password = transactieservice
    Privileges: Can login ON
                Superuser ON
    ```

  - Create Database:
    ```text
    name = transactieservice
    Owner = transactieservice
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
Contains ORM models for the Transactionservice

#### Migrations
Database migration schema

##### Create new migration
```shell script
python manage.py db migrate
```

### Layer 2 (services)

#### bank_transactie_service
[API documentation](docs/openapi.yaml)
