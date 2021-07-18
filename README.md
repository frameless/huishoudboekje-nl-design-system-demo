#  Huishoudboekje
The scalable version of Huishoudboekje the software, usable for all Dutch municipalities.
Huishoudboekje is developed based on the vision of [Common Ground](https://commonground.nl).

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
 
Every service receives its own user and database to keep the data separated.\
The credentials are stored in secrets and can be mounted to build the connection.

The data models are managed using Alembic migration scripts that are executed using init containers.


## Development
For the frontend, see the [Frontend README](./frontend/app/README.md). \
For the backend, there are a few different ways you can set up your local backend development environment:

### 1. Local setup (MacOS)
For now, the easiest way to set up the backend is to run the database locally and run the backend and services 
in separate virtual environments. \
If you are on a Mac, make sure you have [Brew](https://brew.sh/) installed. 

1. Install a local PostgreSQL database.  
   On MacOS, you can use [Postgres.app](https://postgresapp.com/). Run `brew install libpq` to be able to use `psql`.  
2. To make dealing with environment variables as easy as possible, install [direnv](https://direnv.net/).
3. For setting up a service, see the README in the service's subdirectory.

### 1.B Local setup windows
For now, the easiest way to set up the backend is to run the database locally and run the backend and services 
in separate virtual environments. \
If you are on windows, you need python virtualenv and an ubuntu shell with zsh

1. Instal a local PostgreSQL database by downloading postgreSQL, make sure to add pgAdmin to the installation
2. Then you need to make virtual environments for the services and the backend, further instructions are in those readme's
3. For the frontend you need to use the ubuntu zsh shell
4. For setting up dex you need ubuntu

### 2. Setting up dex locally
To log in locally you need to run dex locally as well. On windows you need ubuntu.

1. download dex from [dex](https://dexidp.io/)
2. Make sure you are able to run the dex command
3. make sure you are at you home directory and excute:
```shell
   /dex/bin/dex serve {aboslute path to app-new/dex.dev.yaml}
```

### 3. Minikube
It is also possible to run the entire stack in a local [Kubernetes](https://kubernetes.io/) cluster with the help of 
[minikube](https://minikube.sigs.k8s.io/docs/). \
See the [installation instructions here](https://gitlab.com/commonground/huishoudboekje/app-new/-/wikis/Ontwikkeling/Minikube).

### Production-like installation
To install Huishoudboekje in production, follow [these installation instructions](https://gitlab.com/commonground/huishoudboekje/app-new/-/wikis/Handleidingen/Installatie).