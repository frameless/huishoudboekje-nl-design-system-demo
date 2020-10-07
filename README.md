#  Huishoudboekje
The scalable version of Huishoudboekje the software, usable for all Dutch municipalities.
Huishoudboekje is developed based on the vision of [Common Ground](https://commonground.nl).

## Installation
To install Huishoudboekje follow [installation instructions](docs/docs/documentatie/installatie.md)

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
- [Huishoudboekje Service](huishoudboekje-service/)

## Development

Local development is easy and is described [here](docs/docs/developers/local-development.md)

### Minikube
To run the full Huishoudboekje stack on a local kubernetes development stack using [minikube](docs/docs/developers/minikube.md)

#### Database

All data for our own services is stored in a single database that is managed by the [zalando postgres operator](https://postgres-operator.readthedocs.io/en/latest/)
 
Every service receives it's own user and database to keep the data separated.\
The credentials are stored in secrets and can be mounted to build the connection.

In the installation instructions and review apps the operator is deployed to every namespace to be independent of
cluster level configuration. The parameters that are passed to it make this possible. 
