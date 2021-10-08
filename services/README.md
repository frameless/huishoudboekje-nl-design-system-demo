# Service Components
Huishoudboekje uses independent service components, packages as Docker containers.\
These are:
- [Banktransactieservice](bank_transactie_service/)
- [Grootboekservice](grootboek_service/)
- [Huishoudboekjeservice](huishoudboekje_service/)
- [Logservice](log_service/)
- [Organisatieservice](organisatie_service/)

Services above are all dependent on the core service through symbolic links.
- [Core Service](core_service/)

## Setup development with Docker Compose
- Please set up a local running PostgreSQL that is available on `localhost:5432` and has a user `postgres` with password `postgres`.
- Please make sure you have `docker-compose` installed.
- Run `docker-compose run db-init` to initialize the databases.
- Run `docker-compose up` to launch all the services.