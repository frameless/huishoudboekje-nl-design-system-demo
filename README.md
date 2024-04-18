# Huishoudboekje

The scalable version of Huishoudboekje the software, usable for all Dutch municipalities. Huishoudboekje is developed
using the principles of [Common Ground](https://commonground.nl).

## Technical Stack

Huishoudboekje uses the following technical stack:

- Typescript, React
- Python, Flask
- NodeJS, Express
- Docker, Kubernetes

### Components

Huishoudboekje consists of several independent software components, packages as Docker containers.
These are:

- [Medewerker Frontend](frontend/)
- [Medewerker Backend](backend/)
- [Huishoudboekje Services](services/)

The architecture is currently undergoing improvements. 
New components:
- [Huishoudboekje Services](huishoudboekje_services/)

### Database

All data for our own services is stored in a single PostgreSQL server.

Every service receives its own user and database to keep the data separated.
The credentials are stored in secrets and can be mounted to build the connection.

The data models are managed using Alembic and Prisma migration scripts and that are executed using init containers.

## Development

> ### ⚠️ Note to Windows users
> Huishoudboekje uses symbolic links. If you're working on Windows, you need to explicitly enable symbolic links in Git,
> otherwise these links will just appear as text files and things will not work as expected.
>
> Once symbolic links are enabled, please use `git clone -c core.symlinks=true` when you clone this repository, and
> symlinks should be working.
> ![afbeelding](https://gitlab.com/commonground/huishoudboekje/app-new/uploads/faccef92aea1ada494d3384de02103d8/afbeelding.png)

Also, do make sure that (at least from Windows 11 onwards) Developer Mode had been turned on. See: [Microsoft](https://learn.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development)

To setup the frontend application, see the [Frontend README](./frontend/app/README.md). \
To setup the backend applications, there are a few different ways you can set up your local backend development
environment:

### Setup development with Docker Compose (Recommended)

#### Running all applications

- Please make sure you have `docker-compose` installed. It comes
  with [Docker Desktop](https://docs.docker.com/compose/install/).

- Run `docker-compose up -d` to launch all the services and the backend. This might take a few moments as the services
  execute some migrations on the database.
- Run `docker-compose -f docker-compose.dev.yaml up -d` to launch all the services except the csharp services. For local development its easier to debug when these are run locally.
- Add the --build tag when you want all the containers to rebuild
- It's best to run the frontend application natively on your system using [NodeJS](https://nodejs.org/nl/).
  For instructions see [frontend/app/README.md](./frontend/app/README.md)
- Run `docker-compose up sampledata` to insert a small dataset into your system. Make sure you have all your services, a
  database and the backend running.
- Run `docker-compose up evaluate-alarms` to run the timed alarm evaluation.

#### Testing

- Run `docker-compose --profile tests up` to run all tests.
- Run `docker-compose run huishoudboekjeservice-test` to run only tests for the huishoudboekjeservice.
  You can put any application that has tests here.

### Manual local setup (MacOS and Unix)

We really recommend using the Docker Compose setup, but if you want to run everything locally and manually, you can do
so. To set up the backend manually you could also run the database locally and run the backend and services in separate
virtual environments.

1. Install a local PostgreSQL database.
   On MacOS, you can use [Postgres.app](https://postgresapp.com/). Run `brew install libpq` to be able to use `psql`.
1. To make dealing with environment variables as easy as possible, install [direnv](https://direnv.net/).
1. To start an application, see the README in the subdirectory of that application.

## Manual local setup (Windows)

You need python virtualenv, a Ubuntu shell with `zsh` and you need to make sure your symlinks work correctly.

1. To make sure your git installation had enabled symbolic links,
   run `git clone -c core.symlinks=true https://gitlab.com/commonground/huishoudboekje/app-new.git`.
1. Install [PostgreSQL](https://www.postgresql.org/download/windows/) to setup a local database. Make sure to also
   install a database management application like [pgAdmin](https://www.pgadmin.org/), if you need a web client to
   manage your databases.
1. Create virtual environments for the services and the backend. Please see each of their `README.md` for instructions.

### Production-like installation

To install Huishoudboekje in production, the community
provides [Helm charts](https://gitlab.com/commonground/huishoudboekje/helm-charts).
