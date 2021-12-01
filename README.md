# Huishoudboekje

The scalable version of Huishoudboekje the software, usable for all Dutch municipalities. Huishoudboekje is developed based on the vision
of [Common Ground](https://commonground.nl).

## Technical Stack

Huishoudboekje uses the following technical stack

- React (CRA)
- Python Flask
- Docker

### Components

Huishoudboekje consists of several independent software components, packages as Docker containers.\
These are:

- [Medewerker Frontend](frontend/)
- [Medewerker Backend](backend/)
- [Huishoudboekje Services](services/)

### Database

All data for our own services is stored in a single PostgreSQL server.

Every service receives its own user and database to keep the data separated. \
The credentials are stored in secrets and can be mounted to build the connection.

The data models are managed using Alembic migration scripts that are executed using init containers.

## Development

For the frontend, see the [Frontend README](./frontend/app/README.md). \
For the backend, there are a few different ways you can set up your local backend development environment:

## Setup development with Docker Compose

- Please make sure you have `docker-compose` installed.
- Run `docker-compose up -d db` to start the database.
- Run `docker-compose up` to launch all the services and the backend. This might take a few moments as the services might execute some migrations on the database.
- It's best to run the frontend-application natively on your system because of performace issues with running a development setup in Docker. For instructions
  see [frontend/app/README.md](./frontend/app/README.md)
- Run `docker-compose --profile tests up` to run all tests.
- Run `docker-compose huishoudboekjeservice-test up` to run only tests for the huishoudboekjeservice. You can put any service here.

### Manual local setup (MacOS and Unix)

To set up the backend manually you could also run the database locally and run the backend and services in separate virtual environments.

1. Install a local PostgreSQL database.  
   On MacOS, you can use [Postgres.app](https://postgresapp.com/). Run `brew install libpq` to be able to use `psql`.
1. To make dealing with environment variables as easy as possible, install [direnv](https://direnv.net/).
1. For setting up a service, see the README in the service's subdirectory.

### Manual local setup (Windows)

You need python virtualenv, a Ubuntu shell with `zsh` and you need to make sure your symlinks work correctly.

1. To make sure your git installation had enabled symbolic links, run `git clone -c core.symlinks=true https://gitlab.com/commonground/huishoudboekje/app-new.git`.
1. Install [PostgreSQL](https://www.postgresql.org/download/windows/) to setup a local database. Make sure to also install pgAdmin as well, if you need a web client to manage your
   databases.
1. Create virtual environments for the services and the backend. Please see their `README.md` for instructions.
1. For the frontend you need to use the ubuntu zsh shell.
1. Setting up dex should be done in ubuntu.

### 2. Minikube

It is also possible to run the entire stack in a local [Kubernetes](https://kubernetes.io/) cluster with the help of
[minikube](https://minikube.sigs.k8s.io/docs/). Please follow [these instructions](k8s/README.md).

### Production-like installation

To install Huishoudboekje in production, follow [these instructions](k8s/README.md).
