#  Huishoudboekje
The scalable version of Huishoudboekje the software, usable for all Dutch municipalities.
Huishoudboekje is developed based on the vision of [Common Ground](https://commonground.nl).

## Installation
To install Huishoudboekje follow [installation instructions](https://gitlab.com/commonground/huishoudboekje/app-new/-/wikis/Handleidingen/Installatie)

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

### Minikube
To run the full Huishoudboekje stack on a local kubernetes development stack using [minikube](https://gitlab.com/commonground/huishoudboekje/app-new/-/wikis/Ontwikkeling/Minikube)

#### Database

All data for our own services is stored in a single PostgreSQL server. 
 
Every service receives it's own user and database to keep the data separated.\
The credentials are stored in secrets and can be mounted to build the connection.

The data models are managed using Alembic migration scripts that are executed using init containers.
