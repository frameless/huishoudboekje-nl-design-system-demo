---
"huishoudboekje": patch
---

Fixed #630: Aligned the names of the environment variable for the database url to `DATABASE_URL` for all services.

## Migration guide

Every service now uses the same `DATABASE_URL` environment variable for its connection to a database.

Change the following environment variables in the following deployments:

- Change the name `HHB_DATABASE_URL` to `DATABASE_URL` in the deployment for the Huishoudboekjeservice.
- Change the name `GROOTBOEK_DATABASE_URL` to `DATABASE_URL` in the deployment for the Grootboekservice.
- Change the name `TRANASCTIE_DATABASE_URL` to `DATABASE_URL` in the deployment for the Banktransactieservice.
- Change the name `LOG_DATABASE_URL` to `DATABASE_URL` in the deployment for the Logservice.
- Change the name `ORGANISATIE_DATABASE_URL` to `DATABASE_URL` in the deployment for the Organisatieservice.
