# Service Components

All services are located in the `services` directory. Each service is defined in its own directory, and can be run independently.
Each service has a `README.md` file that describes the service and how to run it.

- [Banktransactieservice](bank_transactie_service/)*
- [Grootboekservice](grootboek_service/)*
- [Huishoudboekjeservice](huishoudboekje_service/)*
- [Logservice](log_service/)*
- [Organisatieservice](organisatie_service/)*
- [Postadressenservice](postadressenservice/)
- [Alarmenservice](alarmenservice/)
- [Signalenservice](signalanservice/)

Services marked with an asterisk (*) all share various logic and therefor have a dependency on the core service through symbolic links.

- [Coreservice](core_service/)

To create a db dump to use in the seed commands you can execute this command (IN BASH! 👌):

docker exec -it <container_id> pg_dump -U postgres -d <db_name> --inserts --data-only > <filename>.sql

example:

docker exec -it 5ae8c868d982 pg_dump -U postgres -d postadressenservice --inserts --data-only > postadressen.sql

(You can find the docker container id using docker)