# Rapportageservice
This service contains the functionality needed to generate reports

## Setup development with Docker Compose
- This service will automatically start when running `docker-compose up`.

## Manual setup of a development environment (Mac and UNIX)
- Install dependencies
    ```shell
    pip install -r requirements.txt
    ```

- Put in `.envrc`:
    ```shell
    export FLASK_APP="rapportage_service.app"
    export FLASK_RUN_PORT="8011"
    export FLASK_DEBUG="1"
    export JWT_SECRET="local-secret"
    ```


- Start the app
    ```shell script
    flask run
    ```

## Manual setup of a development environment (Windows)
- Install a virtual environment

    ```shell
    virtualenv rapportage_service
    cd rapportage_service
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
    set FLASK_APP=rapportage_service.app
    set FLASK_RUN_PORT=8011
    set FLASK_DEBUG="1"
    set JWT_SECRET="local-secret"
    ```

- Activate the virtual environment
    ```shell
    Scripts\\activate
    ```

- Start the app
    ```shell script
    flask run
    ```

## Project Layout

### Layer 1 (database)

#TODO

### Layer 2 (services)

#### rapportage_service
[API documentation](docs/openapi.yaml)
