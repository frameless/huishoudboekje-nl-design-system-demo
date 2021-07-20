### Service Components
Huishoudboekje uses independent service components, packages as Docker containers.\
These are:
- [Banktransactieservice](bank_transactie_service/)
- [Grootboekservice](grootboek_service/)
- [Huishoudboekjeservice](huishoudboekje_service/)
- [Logservice](log_service/)
- [Organisatieservice](organisatie_service/)

Services above are all dependent on the core service through symbolic links.
- [Core Service](core_service/)