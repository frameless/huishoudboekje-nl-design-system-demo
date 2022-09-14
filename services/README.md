# Service Components

All services are located in the `services` directory. Each service is defined in its own directory, and can be run independently.
Each service has a `README.md` file that describes the service and how to run it.

- [Banktransactieservice](bank_transactie_service/)*
- [Grootboekservice](grootboek_service/)*
- [Huishoudboekjeservice](huishoudboekje_service/)*
- [Logservice](log_service/)*
- [Organisatieservice](organisatie_service/)*
- [Unleashservice](unleashservice/)
- [Postadressenservice](postadressenservice/)
- [Alarmenservice](alarmenservice/)
- [Signalenservice](signalanservice/)

Services marked with an asterisk (*) all share various logic and therefor have a dependency on the core service through symbolic links.

- [Coreservice](core_service/)
