# Huishoudboekje Changelog

## 1.2.3

### Patch Changes

- 1dcf3231: Fixed #1095: Explicity create SEPA exports in PAIN.001.001.03 schema

## 1.2.2

In deze release is een fout opgelost die ervoor zorgde dat het uploaden van een bankafschrift niet goed werkte.

### Patch Changes

- 8fe5249c: Fixed #1084: Fixed a bug where the value of a field "bedrag" would change in some situations.
- 53959905: Fixed #1089: Put unreleased functionalities behind feature flag.

## 1.2.1

In deze release zijn kwetsbaarheden opgelost en verbeteringen aan de user interface gedaan.

### Patch Changes

- 5a099abb: Fixed #1019: Fixed vulnerability to XXE attacks.
- 82da159a: All Node services are now running on Node.js 18
- b5245f5d: Fixed #853: Als er een alarm is ingesteld voor een afspraak die is afgeletterd met een banktransactie, dan wordt dit alarm op dat moment afgetrapt.
- bffb945e: We've moved loading spinners to the smallest possible elements, so that UI that doesn't require to be waited for will be visible from the start.
- dd1bf7a0: Fixed #1020: Updated dependencies, fixing several CVEs.
- 593e702a: Fixed #991: Added the difference in expected and actual value of afspraak and transaction in the signal.
- 61c63047: Fixed #998: Errors that occur when uploading files are now properly handled and an error message will be visible below the filename.
- 8acf22a2: Fixed #1045: Moved the sampledata tool outside the repository.
- 9a782300: Fixed #630: Aligned the names of the environment variable for the database url to `DATABASE_URL` for all services.

  ## Migration guide

  Every service now uses the same `DATABASE_URL` environment variable for its connection to a database.

  Change the following environment variables in the following deployments:

  - Change the name `HHB_DATABASE_URL` to `DATABASE_URL` in the deployment for the Huishoudboekjeservice.
  - Change the name `GROOTBOEK_DATABASE_URL` to `DATABASE_URL` in the deployment for the Grootboekservice.
  - Change the name `TRANASCTIE_DATABASE_URL` to `DATABASE_URL` in the deployment for the Banktransactieservice.
  - Change the name `LOG_DATABASE_URL` to `DATABASE_URL` in the deployment for the Logservice.
  - Change the name `ORGANISATIE_DATABASE_URL` to `DATABASE_URL` in the deployment for the Organisatieservice.

- b0615c62: Fixed #1034: Toast message after un-matching a transaction is now correct.
- b0615c62: Fixed #1035: Added audit log template for updating a signal.
- c2110ae7: Fixed #742: All services now use a pre ping to determine if the connection with the database is still up. If not, a new connection will be made.
- 55652696: Fixed #786: It is now possible to set a default value for the margin in days for date and for the margin in euros for bedrag when creating an alarm.
- 2befd6a7: Fixed #982: Removed version endpoints from services and backend as they are currently not used.
- d0f435f6: Fixed #995: A user-friendly error message will now be shown when there is a problem with the authservice.
- df7061e4: Fixed 980: Error handling when not accepted file format is uploaded.
- f1d21297: We're now using a standardized library for state mangement, which improves performance.
- f3861b56: Fixed #1000: Getting one postadres by its ID now properly returns it.
- fc7c7424: Fixed #630: Return data as plain text and not as error.
- 1a2ea880: Fixed #1039: Fixed an issue where the end date of an alarm was not saved correctly.
- 38f6fe61: Fixed #1021: Fixed an issue where creating an alarm resulted in an error.
- 041bb40c: Fixed #1040: Fixed an issue where the start date of an alarm was not saved correctly.

## 1.2.0

Een probleem waarbij sommige gebruikers niet konden inloggen is opgelost.

### Minor Changes

- ec866338: Fixed #950: Moved configuration for client secrets to environment variables
- ec866338: Fixed #975: Extracted authorization to a separate service that is compatible with OpenID Connect

  ## Migration guide

  **⚠️ The redirect URI for OpenID Connect has been changed to `/auth/callback`. Please update the client settings in your Identity Provider.**

  ### Authservice

  A new application called `authservice` has been added to the deployment. Please see k8s/authservice for the Kubernetes specification.
  The following environment variables should be added to your deployment for the `authservice`:

  ```shell
  OIDC_ISSUER_URL=https://your-identity-provider.example.com/auth
  OIDC_CLIENT_ID=huishoudboekje-medewerkers
  OIDC_CLIENT_SECRET=your-idp-client-secret
  OIDC_BASE_URL=https://your-app.example.com
  JWT_ISSUER=your-app-issuer
  JWT_EXPIRES_IN=30d
  JWT_AUDIENCE=your-app-audience # <-- This value must be the same for authservice and backend.
  JWT_SECRET=long-random-string # <-- This value must be the same for authservice and backend.
  ```

  ### Backend

  The following environment variables should be added to your deployment for the `backend`:

  ```shell
  JWT_SECRET=long-random-string # <-- This value must be the same for authservice and backend.
  JWT_AUDIENCE=your-app-audience # <-- This value must be the same for authservice and backend.
  ```

  The following environment variables have become obsolete and should be removed from this deployment:

  ```shell
  APP_SETTINGS
  OIDC_ISSUER
  OIDC_AUTHORIZATION_ENDPOINT
  OIDC_TOKEN_ENDPOINT
  OIDC_TOKENINFO_ENDPOINT
  OIDC_USERINFO_ENDPOINT
  OIDC_CLOCK_SKEW
  OIDC_CLIENT_SECRETS
  AUTH_AUDIENCE
  HHB_SECRET
  SECRET_KEY
  ```

  ## Services

  The following environment variables have become obsolete and should be removed from the deployments of the alarmenservice, banktransactieservice,
  grootboekservice, huishoudboekjeservice, logservice, organisatieservice, postadressenservice and the signalenservice:

  ```shell
  APP_SETTINGS
  HHB_SECRET
  SECRET_KEY
  ```

- 6f4b4512: Updated the command for migrating the database schema.

  ## Migration guide

  Please make the following changes to your deployment scripts:

  ### Postadressenservice

  Change `npm run db:push` to `npm run db:deploy`.

  Also, run the following command inside the container to perform some updates to the database. This should not cause any data loss.

  ```shell
  npx prisma migrate resolve --applied 20211206090356_initial
  ```

  ### Alarmenservice

  Change `npm run db:push` to `npm run db:deploy`.

  Also, run the following commands to perform some updates to the database. These commands should not cause any data loss.

  ```shell
  npx prisma migrate resolve --applied 20211201095236_replace_datetime_with_string_type
  npx prisma migrate resolve --applied 20211202103158_add_afspraak_id
  npx prisma migrate resolve --applied 20211206090910_simplify_alarm_schema
  npx prisma migrate resolve --applied 20211206101225_bedrag_is_int_not_string
  npx prisma migrate resolve --applied 20211210113917_status_to_boolean
  npx prisma migrate resolve --applied 20211215125312_added_optional_signaal_field_to_alarm
  npx prisma migrate resolve --applied 20211216092700_added_by_day_by_month_by_month_day
  npx prisma migrate resolve --applied 20211216093009_removed_signaal_id
  npx prisma migrate resolve --applied 20211216093237_save_bedrag_as_float
  npx prisma migrate resolve --applied 20211216103358_add_by_day_by_month_by_month_day_and_readd_signalid
  ```

  ### Signalenservice

  Change `npm run db:push` to `npm run db:deploy`.

  Also, run the following commands to perform some updates to the database. These commands should not cause any data loss.

  ```shell
  npx prisma migrate resolve --applied 20211213120212_added_model_signal
  npx prisma migrate resolve --applied 20211213120752_time_created_is_now_by_default
  npx prisma migrate resolve --applied 20211213121354_context_is_optional
  npx prisma migrate resolve --applied 20220221163146_removed_time_created_added_time_updated
  ```

  Please read this Wiki article for more information: https://gitlab.com/commonground/huishoudboekje/app-new/-/wikis/Handleidingen/Probleemoplossing/Update-naar-1.2.0

- 3b9eb21c: Fixed #955: We've removed the bundled Keycloak from the repository, as we're using a separately deployed Keycloak for our own testing purposes.
  This change should not affect your current deployment configuration if you were already not using the bundled Keycloak as the authentication provider.

  ## Migration guide

  The following environment variables have become obsolete and should be removed from your deployment configuration:

  ```shell
  USE_KEYCLOAK
  KEYCLOAK_DB_DATABASE
  KEYCLOAK_DB_USER
  KEYCLOAK_DB_SCHEMA
  KEYCLOAK_DB_PASSWORD
  KEYCLOAK_AUTH_USERNAME
  KEYCLOAK_AUTH_PASSWORD
  KEYCLOAK_AUTH_KEYCLOAK_URL
  KEYCLOAK_CLIENT_ROOT_URL
  KEYCLOAK_CLIENT_SECRET
  KEYCLOAK_CLIENT_USERS
  ```

### Patch Changes

- 82b743fb: Fixed an issue where Node dependencies didn't quite match.
- df1a9108: Fixed #976: We've added audit logging when a Betaalinstructie is exported.
- f7be1625: Fixed #988: Moved CI-tool python-postgres out of the repository.
- f45696a4: Fixed #878: Add a timestamp to log lines.
- c2b952e7: Fixed #781: Deleted gebruikerEmail from Alarm.
- 41706043: Fixed #803: Fixed an issue where Customer Statement Message were marked as unknown in audit logs.
- 1c6555f4: Fixed #986: Removed burgersIds from output in AddHuishoudenBurger mutation.
- 06200d55: Fixed #990: Changed the `/auth/logout_callback` endpoint to `/auth/callback`, so that only one redirect URI needs to be setup in the Identity Provider.
- ac286e84: Fixed #987: Don't repeat yourself! Merged CreateJournaalpostAfspraak and CreateJournaalpostPerAfspraak mutations.
- 93cee7a3: Fixed #782: Refactoring for better audit logs.
- a13ce296: Fixed #962: Empty search term gives back all existing burgers, also when burgers have been deleted.
- 32c66cfb: Fixed #989: Fixed an issue where in specific cases the IDP's token wouldn't provide enough information about the user and couldn't log in to Huishoudboekje.
- e588f82f: Fixed #966: Updated to React 18.
- 21709358: Fixed #960: We now only check for duplicate Zoektermen between Afspraken that are active.
- 77da8ecd: Fixed #984: We now update an afspraak with just the new values and not the entire afspraak.
- 84583ae0: Fixed #953: Inserted padding between form and submit button in AddAlarmModal.
- 514c1a23: Fixed #856: It is now possible to define a start date and end date for an Alarm to make it valid for a length of a period.
- 6348af98: Removed complexity from configuration and made logging easier configurable.

  ## Migration guide

  We've made log levels configurable for every application. With no additional configuration, `LOG_LEVEL` is set to `info`. No debug messages will be logged.
  If you wish to have more verbose logging you can set an environment variable `LOG_LEVEL` to `debug` for all of the services and backend:

  ```shell
  LOG_LEVEL=debug
  ```

## 1.1.2

Een update van afhankelijkheden is teruggedraaid.

### Patch Changes

- 98ff514f: Fixed #943: Added unit tests for backend-burgers.
- 9141a7a8: Fixed #954: An unknown issue with OpenShift causes all services that use NodeJS 18 to not work. We're still looking into it, but for now we've downgraded all of them to NodeJS 16.

## 1.1.1

Een probleem met het starten van de service Unleash is opgelost.

### Patch Changes

- a4857085: Fixed #937: Added unit tests for signalenservice.
- f7a7f18a: Fixed #945: Added year selector to date picker in Rapportage.
- 09ce7007: Fixed #951: Fixed a bug in the Unleashservice which caused it to crash during startup.

## 1.1.0

Een probleem met een datumveld in een database is opgelost.

### Minor Changes

- 96fd9a68: Fixed #708: Added a button that allows the user to delete a Betaalinstructie.

### Patch Changes

- f35b0e01: Fixed #859: Fixed not working resolvers in burger backend under Journaalpost and Banktransactie.
- d039aa28: Fixed #859: Get journaalposten filtered by afspraak ids.
- 2246725b: Fixed #707: Created a mutation for deleting a betaalinstructie from an afspraak.
- 2bd56a4e: Fixed #753: The Modal is now a standardized component for the entire application. Added Modal to storybook and a unit test.
- f9c6dcf1: Fixed #811: Added a query for getting the current "saldo" for one or more burgers.
- c2167c0b: Fixed #927: Now showing the name of the organization instead of the account holder.
- 82c26ce7: Fixed #931: Fixed a CI issue with Cobertura reporting.
- 454191ba: Fixed #936: Added unit tests for alarmenservice.
- fc36d89d: Fixed #938: Added unit tests for unleashservice.
- c225307d: Fixed #934: Fixed an issue where transactions weren't filtered correctly which resulted in an incomplete list of transactions.
- 18c989e2: Fixed #857: Added front-end testing for DashedAddButton, AddButton, Alert, Asterisk, NumberBadge & Page.
- 3cc0b393: Fixed #926: Improved startup time by implementing startupProbe for every container.
- 2bd4b6e9: Fixed #918: Version number is now also visible in the login screen.
- 7386ce43: Fixed #929: Added template and translation for rekeningen query.
- 7386ce43: Fixed #928: Added template and translation for deleteAfspraakBetaalinstructie mutation.
- caec1690: Fixed #839: Afdeling can now be resolved in Rekening. Organisatie can now be resolved in Afdeling.
- 660e30e5: Fixed #938: Added unit tests for postadressenservice.
- 6a6b3a45: Fixed #920: Resolve dates from datetime.
- abde1028: Fixed #753: All fields that use Chakra UI's Editable component have been replaced by a modal.
- 169e264d: Fixed #924: Fixed an issue where a validation error would appear after submitting a valid form.
- 9e99f5e3: Fixed #879: Fixed an issue where feature flags would always evaluate to false even when enabled.
- 91c0146b: Increased resources for backend-burger container.
- fd9797be: Added test coverage reports for backend-burgers in GitLab CI.

## 1.0.0

Om vereiste relaties tussen gegevens in tact te houden is het verwijderen van gegevens beperkt.

### Migration guide

Please add the following enviroment variables to the Unleash service:

```shell
# For production environments
UNLEASH_OTAP = production

# For acceptance environments
UNLEASH_OTAP = acceptance
```

### New features

- 1f33b43f: #700: Added error handling for deleting rubrieken and configuraties
- 3553403d: #721: Added error handling for deleting afspraken
- d76350c0: #873: Added license compliance job to GitLab CI
- ff4d8e91: #22: Added CI job that fails if there are no added changesets. Every Merge Request now requires a changeset.
- 898165d3: #22: Added a job "changeset" to the CI that requires that a Merge requests include a changeset.

### Improvements

- c22078e5: #879: Feature flags are now following OTAP, and can be enabled per environment type.
- d816516b: #724: Postadres cannot be removed when it is in use.
- a094c25d: #721: Afspraak cannot be deleted when coupled to a journaalpost.
- 15e44ba2: #723: Afdeling cannot be removed when it is in use.
- 9a2813ca: #899: Banktransactions are now being refreshed in the overview after manual matching.
- dd774aa5: #876: Parsing dates coming from services with datetime first before returning only the date.
- 898165d3: #22: Updated docs about changesets
- 2f92d9c7: #913: Added a feature that allows a user to download an error report when a GraphQL error occurs
- 2780e915: #700: Rubrieken cannot be removed if they are used in afspraken or journaalposten.
- 484e361c: #879: Unleash service now has a new route that provides a list of all available featureflags and their current state. Frontend now uses this route at the start and now doesn't need to request the unleash service for single featureflags states.

## 1.0.0-beta.1

Met hulp van deze applicatie voer je het dienstverleningsconcept Huishoudboekje uit. Deze gegevens kun je beheren en gebruiken: organisaties, afdelingen, postadressen, bankrekeningnummers, burgers, huishoudens, afspraken, betaalkenmerken, betaalinstructies en bankafschriften.

### New features

- Added changesets

### Improvements

- Reset version to 1.0.0-beta.1
