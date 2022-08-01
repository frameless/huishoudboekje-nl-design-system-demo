# Huishoudboekjeservice
This service contains the functionality needed to access data that belongs to the Huishoudboekje processes.

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
    export FLASK_APP="huishoudboekje_service.app"
    export FLASK_RUN_PORT="8000"
    export FLASK_ENV="development"
    export JWT_SECRET="local-secret"
    export DATABASE_URL="postgresql://huishoudboekjeservice:huishoudboekjeservice@localhost/huishoudboekjeservice"
    ```

- Setup your database (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)
    ```shell
    createuser --echo --login --host localhost --username postgres huishoudboekjeservice
    createdb --echo --owner huishoudboekjeservice --host localhost --username postgres huishoudboekjeservice
    psql --host localhost --username postgres --dbname postgres --command "ALTER USER huishoudboekjeservice WITH ENCRYPTED PASSWORD 'huishoudboekjeservice';"
    python manage.py db upgrade
    ```

- Start the app
    ```shell script
    flask run
    ```

## Manual setup of a development environment (Windows)
- Install a virtual environment \
    ```shell
    virtualenv huishoudboekje_service
    cd huishoudboekje_service
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
    set FLASK_APP=huishoudboekje_service.app
    set FLASK_RUN_PORT=8000
    set FLASK_ENV="development"
    set JWT_SECRET="local-secret"
    set DATABASE_URL=postgresql://huishoudboekjeservice:huishoudboekjeservice@localhost/huishoudboekjeservice
    ```

- Activate the virtual environment
    ```shell
    Scripts\\activate
    ```

- Setup your database (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)

- Using [pgAdmin](https://www.pgadmin.org/):
  - Create login/Group ROLE:
    ```text  
    Name = huishoudboekjeservice
    Password = huishoudboekjeservice
    Privileges: Can login ON
                Superuser ON
    ```
    - Create Database:
    ```text
    name = huishoudboekjeservice
    Owner = huishoudboekjeservice
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
Contains ORM models for Huishoudboekje Service

#### Migrations
Database migration schema

##### Create new migration
```shell script
python manage.py db migrate
```


### Layer 2 (services)

#### core
[API documentation](docs/openapi.yaml)
