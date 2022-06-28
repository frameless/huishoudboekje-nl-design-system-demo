# Huishoudboekje Backend
Layer 4 in the Common Ground-layermodel. GraphQL-backendserver.

## Installation
Normal installation

```
python3 setup.py install
```

## Setup development with Docker Compose
- The backend will automatically start when running `docker-compose up`.

## Manual setup of a development environment (Mac and UNIX)
- Install dependencies
  ```shell
  pip install -e .
  ```
  or
  ```shell
  pip install -r requirements.txt
  ```

- Put in `.envrc`:
    ```shell
    export FLASK_APP="hhb_backend.app"
    export FLASK_ENV="development"
    export FLASK_RUN_PORT="5000"
    export PREFIX=/api
    export HHB_SERVICE_URL=http://localhost:8000
    export ORGANISATIE_SERVICE_URL=http://localhost:8001
    export TRANSACTIE_SERVICE_URL=http://localhost:8002
    export GROOTBOEK_SERVICE_URL=http://localhost:8003
    export LOG_SERVICE_URL=http://localhost:8004
    ```

- run app
  ```shell script
  flask run
  ```

## Manual setup of a development environment (Windows)

### Local
- Install a virtual environment

Make sure your working directory is ~\backend

  ```shell
  cd ..
  virtualenv backend
  cd backend
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
  set FLASK_APP=hhb_backend.app
  set FLASK_ENV="development"
  set FLASK_RUN_PORT=5000
  set PREFIX=/api
  set HHB_SERVICE_URL=http://localhost:8000
  set ORGANISATIE_SERVICE_URL=http://localhost:8001
  set TRANSACTIE_SERVICE_URL=http://localhost:8002
  set GROOTBOEK_SERVICE_URL=http://localhost:8003
  set LOG_SERVICE_URL=http://localhost:8004
  ```

- Activate the virtual environment
  ```shell
  Scripts\\activate
  ```

- run app
  ```shell script
  flask run
  ```

### Adding Packages

Dependencies have to be defined in `setup.py`.

