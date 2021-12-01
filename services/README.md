# Service Components

Huishoudboekje uses independent service components, packages as Docker containers.

- [Banktransactieservice](bank_transactie_service/)*
- [Grootboekservice](grootboek_service/)*
- [Huishoudboekjeservice](huishoudboekje_service/)*
- [Logservice](log_service/)*
- [Organisatieservice](organisatie_service/)*
- [Postadressenservice](postadressenservice/)
- [Unleashservice](unleashservice/)

Services above marked with an asterisk (*) are all dependent on the core service through symbolic links because they share various logic.

- [Coreservice](core_service/)