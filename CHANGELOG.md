# Huishoudboekje Changelog

## 1.10.3

### Patch Changes

- 7cbac2d3: properly assign scopes

## 1.10.2

Deze versie omvat verbeteringen bij inloggen met Azure Active Directory (Azure AD), invullen van invoervelden met een browser welke opgeslagen gegevens suggereert, exporteren voor brieven, filteren van banktransacties, afletteren van een banktransactie, zoeken van burgers en sortering in rapportage. Er zijn problemen opgelost bij verwijderen van een bankafschrift en weergave van labels in rapportage.

### Patch Changes

- 5b31f7af7: In export for letters column burger.naam is now divided into columns burger.voorletters, burger.voornamen and burger.achternaam
- 8e9fb9982: Combined suggesties and search afspraken field into one component
- 8a35a0dbb: Added afspraak.omschrijving to export for letters
- d90351e16: added burger searching on postadress/streetname
- 239143fa9: Check and fix unnecessary forced reloads to improve user experience
- f508176d3: XML Parser change
  Due to vulnerabilities, the parser for CAMT XML files had been changed from lxml to defusedxml
- 8b3d3c86e: Changed date format status.afspraak and nu.datum to day-month-year no leading 0
- 89ed9e505: Bugfix: Afspraak can now be updated with an end date (was caused by fix for previous bug with afspraak invut validation)
- 2af63434e: Bugfix: All journaalposten are no longer deleted on delete csm request with not existing csm id.
- c48981aa5: Changed sorting balance table rapportage(Wwithin income or expenses the sorting is now alphabetical on statements, within statments the rows are sorted on date then amount)
- 7043ef6ef: Bugfix: addd missing translations rapportagepagina
- 82878b835: Add OIDC_SCOPES environment variable that allows custom OIDC scopes to be requested. profile email openid offline_access are always requested because they are required by our app
- 5013d75fc: Removing all autocomplete capabilities from all input fields
- 6e5976305: Fixed bug that showed items twice in paged lists.
- a431734fb: Added filter rekeningen option when searching afspraken transaction page
- 73e0b8bbd: Fixed bug input validation, create and update afspraak with burger as tegenrekening is now possible again.
- 85ad20e85: Added hhbnummer to export for letters

## Migration Guide

A new ENV variable is added: OIDC_SCOPES

## 1.10.1

Deze versie omvat een oplossing voor een probleem met het bijwerken van gegevens van een burger.

### Patch Changes

- 61a46da9: Edit for env variables
- 8db7a3ab: Fixed input validation update burger, non required fields can now be null.
- 8b204016: Removed logging clutter and added warning logging instead of info when users are not authenticated correctly/not found

## 1.10.0

Deze versie omvat verbeteringen aan functies voor inloggen en uitloggen.

### Minor Changes

- 3a7543e7: Auth service was not up-to-par with current security standards and required a rework on the flow to properly handle JWT tokens of different OIDC providers

  Changes:

  - JWT tokens are not re-signed by the authservice, but are inherited from the incoming JWT
  - JWT encoding now supports both symetric and asymetric algorithms (HSA(HS), RSA(RS), RSA-PSS(PS), EC(ES)) in 256, 384 and 512 format.
    - By default the app allows no algorithm, the allowed algorithms should be set in the JWT_ALGORITHMS env var for both authservice and backend.
  - Tokens are verified on /me calls instead of only app-token verify by the backend
  - If an asymetric algorithm is used, the authservice and backend will get the public key from the oidc provider's JWKS endpoint
  - Authservice and Backend wil both verify the token seperately to ensure safety of the data.
  - Added JWT_ISSUER env var to backend (already available in authservice)
  - Better handling of session logout and cookie removal

  Removed:

  - Auth-service will no longer refresh tokens because this is handled by express-openid-connect in the background
  - Backend will no longer verify self-signed cookies
  - auth app will no longer sign jwt tokens by getting user info from the previous token
  - app-token cookies will no longer be valid for 30d even when the JWT_VALIDITY env var was set to something else

### Patch Changes

- ba0792a7: updated js packages
- 51291ed6: Added ENV variables INTERNAL_CONNECTION_TIMEOUT and INTERNAL_READ_TIMEOUT to the backend. These ENV variables are used to set the timeout value (in seconds) for the get requests used inside the application. The default values are 10 and 30 (conenction and read). To set no timout set the value to 0.
- 3c9fb546: Added extra input validation in the backend

## 1.9.10

Deze versie omvat gewijzigde functionaliteit voor het berekenen en weergeven van saldo op een pagina met een burger.

### Patch Changes

- 52a63a0e: Implemented saldos differently, saldos are now calculated on each request
- 5d6f040f: Added statsd metrics to python services and gunicorn

## 1.9.9

Deze versie omvat oplossingen voor kwetsbaarheden in beveiliging en logging van Gunicorn en SQLAlchemy.

### Patch Changes

- ad6df36c: Removed source maps from builds
- 3568c420: Added ALLOW_INTROSPECTION variable (Default is 0, to allow set to 1). Graphql introspection should be disabled on production environments.
- 965a4892: Update python packages

## Migration guide

> ⚠️ Added statsd metrics support to use it add statsd support in the hosting and configure the new env variables:

- STATS_DPREFIX, default values are hhb.naam (hhb.backend etc.)
- STATSD_HOST, default value is None, expects values like "hostname:port" ("localhost:9125")

## 1.9.8

Deze versie omvat verbeteringen voor de verwerking van bestanden met het formaat CAMT.053.

### Patch Changes

- d6a12cb7: Fixed bug rounding error CAMT files
- 1cc7a0e8: fixed missing transaction details when NtryDtls is not in CAMT file
- f4ea6266: Security update
- 22e09eab: Betaalisnctructies now shows totaalbedrag
- b737094d: 1382
- c460efa5: After submitting an afspraak, burger or organisatie form, when the back button is pressed you dont go back to the form.
- 41107189: signalen service fix
- 8003d38a: Updated security flags cookie
- e9f11d7a: uuid
- b10ea252: If present EndToEndId and MndtId tags in CAMT file added to transactie omschrijving
- de319add: Add name of afdeling to afspraken overview
- 35d8d48c: moved balance table to show first on the rapportage page
- 85ae0cd5: Improved rapportage when no transactions
- 0a6d530e: Rapportage page filters are now displayed on the page inestead of in a modal
- 435c9eaa: Added buttons for default values date range rapportage
- 341a37ff: Improved afspraken readability in search section of a transactie

## Migration guide

> ⚠️ To rectify the rounding problem of the CAMT files, an SQL statement must be executed. In the folder SQL there is a file named CAMT rounding error fix in database.txt. Use the provided update statement in the banktransaction service database. This will find the rounding errors and correct them.

## 1.9.7

### Patch Changes

- Fixed manual booking ignoring previous saldo when creating a new saldo

## 1.9.6

### Patch Changes

- 48a9c16a: Betaalisnctructies now shows totaalbedrag
- 76740df6: Exports now allow for custom payment dates to allow for payments before the weekend/bankholidays. This due to customary practices of paying before the weekend if a payment day would be in the weekend and banks not processing payments during bankholidays
- 8bca2057: SEPA Exports now correctly removes transactions where the afspraak has a startdate older then the transaction day being calculated

## 1.9.5

### Patch Changes

- Fixed saldo's not updating properly due to incorrect table auto increment
- Afspraken now allows for payment amounts between (and including) 0 and 1
- 6e21c235: Changed batch to true so that transactions are batched, set BtchBookg = false so that transactions are individual in MT940"

## 1.9.4

Deze versie omvat verbeteringen aan functionaliteit bij het navigeren in de context van een burger, het exporteren van gegegvens, het beheren van afspraken, betaalinstructies en alarmen.

### Patch Changes

- 83cfe850: Fixed bug eenmalig alarm day greater then 28 could not be used
- 88c68027: Burger page is now refreshed automatically after adding a new afspraak
- 49549c2c: Changed order brieven export fields
- 6af09493: Incorrect validation error after submiting afspraak form fixed.
- 7d67d677:
- 5f7a0350: Startdate rapportage no longer has an effect on the saldo
- 8f35e210: Startdate alarm can now be manually set
- 6bfbe005: Voor het toevoegen van alarmen is het nu standaard maandelijks, elke maand. Dit kan gewijzigd worden met een Aanpassen sectie.
- fcc35561: added icon for nav to burger specific page from added afspraak
- 541851b6: Follow up afspraak: organisatie now filled in form automatically
- 3ec7f0ca: Alarm can be added to future afspraak if the start date of the alarm is in the afspraak period"
- 247704eb: betaalinstructie weekly day and monthly day is automatically filled based on startDate when selecting type
- 1faf772a: Follow up start date automatically filled in with previous end date plus 1

## 1.9.3

Deze versie omvat verbeteringen voor de laadtijd van een aantal schermen.

## Migration guide

> ⚠️ The backend now uses the environment variable USE_GRAPHIQL that will determine the use of the graphiql interface. This will default to "0" if not set. For production environments this should be set to "0"!

### Patch Changes

- 04608ee9: Added USE_GRAPHIQL environment variable for the backend that will determine the use of the graphiql interface. If set to "1" the interface will be enabled, otherwise disabled. Defaults to "0" on k8s and "1" for docker local development
- 1e4976bd: Improved loeading speed create and edit afspraak pages
- 8b04312a: Optimized burger search functionality to increase performance

## 1.9.2

Bugfix

### Patch Changes

- bugfix weekelijkse betalingen

## 1.9.1

Deze versie omvat een oplossing voor een probleem bij het periodiek beoordelen van alarmen. Daarnaast is het duidelijker gemaakt bij welke burger je werkt door naam en Huishoudboekje-identificatienummer op diverse plekken te tonen.

### Patch Changes

- 9d09818b: bugfix - afspraken search result was empty when transaction had no suggestions
- b0e12170: Added burger context card
- 312bc4ff: Added burger huishoudboekje id afgeletterde transactie
- eef2c6d8: Added extra check in evaluating alarms to prevent error from stopping the evaluation of other alarms. Note: error is not fixed yet.
- bc1af70c: Fixed possible rouding issue when creating afspraken
- d8034910: Added hhb id in afsprakenand transaction filter burger option

## 1.9.0

Deze versie omvat weergave van saldo en diverse opties voor zoeken en filteren.

Je bekijkt het saldo op de balans van een deelnemende inwoner op het scherm van deze deelnemer. Het saldo omvat alle banktransacties die afgeletterd zijn op een afspraak van die deelnemer.

Het totale saldo op de balans en een saldo van meerdere deelnemers bekijk je op het scherm rapportage. Standaard wordt het totale saldo getoond.

In het overzicht met alle banktransacties kun je zoeken naar tekst in omschrijvingen van banktransacties en filteren op: status aflettering, betaalrichting, boekdatum, tegenrekening, tegenrekeninghouder, gekoppelde burger en bedrag. Standaard worden alleen niet-afgeletterde banktransacties getoond en zijn uitgebreide opties voor zoeken en filteren verborgen.

### Minor Changes

- 61915508: Saldo implementatie toegevoegd aan de applicatie. De applicatie houdt nu (per maand) een saldo bij op het moment dat er transacties
  zijn aangemaakt of verwijderd. Saldo is zichtbaar op burgerpagina (momentopname) en in rapportage ( per geselcteerde periode)

### Patch Changes

- d341c729: Added search functionality transactions page
- d90bdd38: Fixed bug rapportage not showing data
- 0378de32: Detail transaction page now has a button to load extra afspraken instead of loading them right away
- e93baba2: Added the option to search afspraken on the transaction page
- 05b8aea3: typescript services now should use the given LOG_LEVEL
- b7448b7e: Added new migration grootboekservice with (re)load data, comma seperation replaced with semicolon
- 19b29b0c: Added a time indecation when the data was last loaded with a refresh button on the transactions page
- 062fbece: Fixed bug with betaalinstructies
- 10216503: hhb nummer toegevoegd onder rapportage en burgers
- d90bdd38: Fixed bug query paramater rappartage url after updating versions
- d90bdd38: Fixed bug unexpected behaviour bsn check when adding huishoudens
- 37a0ea48: Formfields are now also validated before submit if they have a (new) value
- 04186cc7: Updated dependencies of root package.

## 1.8.4

Deze versie omvat verbeteringen in gebruikerservaring en oplossingen voor een aantal problemen.

### Patch Changes

- 56f22159: Mogelijkheid voor het toevoegen en wijzigen van de startdatum van een afspraak en zichtbaar maken in de detail view.
- 36d7812a: When getting rekeningen by iban without adding an iban to the filter now returns nothing all rekeningen
- f56ff5f5: Fixed wrong use of array slicing that caused unexpected behaviour when requesting data count is larger then the batch size
- dd288bfb: Improved check if bsn is unique
- 124b1bab: Fixed bug: wrong way adding gebruikersactiviteiten burger rapportage is now fixed
- 4ca3d8ab: Geboortedatum is now optional
- 10c3cbca: Fixed bug: wrong way adding transactions during creation of csm to auditlog is now fixed
- a692aac6: Added logging in backend to get a better idea what is happening in the backend for debugging purposes (Logging level in backend can now be info, other services should stay on level warning)
- 641f90ff: Transactie detail page now shows afspraken that have at least one matching zoekterm, ordered by matching zoekterm count.
- d05859e4: Fixed bug in active afspraak filter burger pagina

## Migration guide

> ⚠️ The backend log level can be info, all other log levels should remain at level warning! If you do notice unwanted logs in the backend please let us know!

## 1.8.3

Deze versie maakt het mogelijk inkomsten en uitgaven van meerdere burgers te bekijken in rapportage.

### Patch Changes

- 88d13292: #1270 Rapportage now works for more then one burger and can be filtered on rubriek
- bfc6f395: Added saldo to burgers table of huishoudboekjeservice database, defaults to 0
- dc488a96: Fixed automatisch afboeken error when there is an unknown iban

## 1.8.2

Deze versie omvat een bugfix bij het automatisch afboeken. De opmaak en laadtijd van de rapportagepagina zijn verbeterd. Ook is een printweergave toegevoegd.

### Patch Changes

- f3b47ba9: changed UI for rapportage to fit the new data, changed balance section to reflect the designed printable version
- fab19fbf: fixed totaal inkomsten en uitgaven section in rapportage balans not matching up with the rest of the page
- 84379ef4: #1264 added better printweergave rapportage
- 80f2528e: fixed bug with array_agg by creating a custom aggreagation

## Migration guide

> ⚠️ The organisatieservice database has a new migration. This should go fine automatically.

## 1.8.1

Deze versie omvat minimale rapportage mogelijkheden in de front-end en aanpassingen in het automatisch boeken. Bij het automatisch boeken wordt nu ook gekeken naar de organisatie die bij een transactie hoort.

### Patch Changes

- 8e7ec0d6: transactie sugegsties now include afspraken with other tegenrekeningen but with the same organisatie that uses the tegenrekening from the transaction
- 8e7ec0d6: organisatie service now has a endpoint to get organisaties and its afdelingen and rekeningen based on rekeningen ids
- 9a090096: #1228 frontend can now request rapportage data for one burger
- 0092247d: #1227 Implemented a graphql query in the backend so that rapportages for a burger can be requested. (!NOTE: backend now requires RAPPORTAGE_SERVICE_URL as env var to communicate with the rapportage service)
- 743ac3b8: fixed gebruikersactiviteiten not updating the timestamp and iban being used as the entityId for rekeningenByIbans

  ## Migration guide

  > ⚠️ The rapportage service is now in use

  The container for the backend requires an extra environment variables.

  ```shell
  RAPPORTAGE_SERVICE_URL="http://hhb-rapportageservice"
  ```

## 1.8.0

Deze versie omvat het oplossen van kleine problemen en de eerste stappen richting nieuwe rapportage functionaliteit.

### Minor Changes

- a0d124b2: #1239 end and start date are now used better to search matching afspraken, when 1 transaction has more afspraken from one burger it uses the oldest start date
- 83adefa1: #1224 Added endpoint to get banktransactions in a date range
- dffa92a6: #1219 Added a new service. the rapportageservice
- 4545288b: Added endpoint hhb service to get transactions from a burger
- 4f2faa05: #1221 &1223 Added rapportage endpoint in rapportage service that generates a rapportage for a burger in a date range
- a27e24bf: #1226 Implemented dependency injection in rapportage service using flask-injector

### Patch Changes

- ca688702: #1206 better loading speed rapportage
- 39e0188f: fixed burgers not being properly fetched and missing in transactions for the rapportage filter
- f6adcbe3: Changed fetch policies of queries to allow for refreshing components on refetch
- 83b51346: Changed werkzeug logging to adhere to the LOG_LEVEL set in the environment and changed javascript apps to only add logging on 'dev' environment
- 12d612e4: added grootboekrekening id to transactie query for rubriek section in transactie booking section
- f14affe1: Changed default loging to `WARNING` instead of `INFO` due to database logs containing personal information

## 1.7.0

Deze versie omvat verbeteringen voor snelheid voor de pagina's: gebeurtenissen, afspraak, burger overzicht, signalen en huishoudens. Ook is de snelheid verbeterd van de teller met signalen in het navigatiemenu en het importeren van banktransacties. Daarnaast zijn een aantal bugs verholpen.

### Minor Changes

- a966332d: #1205 Improved loading speed when gebeurtenissen contains afspraken
- fc3e824a: #1211 Removed unused requested data from afspraak request to improve loading speed
- c02eedf5: #1201 When loading burger overzicht with empty search string it returns all burgers instantly
- 1071ab76: #1203 Minimized data requested while loading signalen
- a0264503: #1212 Improved loading speed signalen teller sidebar menu
- d28d7eef: #1208 Improved importing speed bankafscriften
- 2c82de87: #1204 improved speed huishouden overzicht

### Patch Changes

- bf14555e: #1213 & #1209 fixed bug in code that made large datasets error
- f15b3ad9: Patch for bug that the banktransactionservice cant handle large request urls by changing its server settings. This is necessary the way it is implemented right now, this can be improved later when put functionality is added in the service
- f15b3ad9: Increased resources k8s banktransactionservice and huishoudboekjeservice

## 1.6.0

Deze versie omvat verbeteringen voor snelheid bij het weergeven van een individuele banktransactie.

### Minor Changes

- 8055dd79: #1200 Improved loading speed banktransaction detail page

## 1.5.0

Deze versie omvat verbeteringen voor snelheid bij het weergeven van banktransacties.

### Minor Changes

- 9cf1132a: #1102: Updated to Graphene 3.
- 41b8cfc4: Improved performance transaction page, it now collects only the data it needs and changed the way it is collected to minimize calls made to the services

### Patch Changes

- 1883df50: #1128: Moved audit logs for burger to separate page. This will improve performance on first page load.
- af22175d: #1134: Fixed an issue where the banktransactieservice would stop working when bankstatements were retrieved with a high volume of transactions in the system.
- 00a4af4f: Fixes #1108 and #1100: Only evaluate alarms for the new journaalposten.
- 20deff19: #1072: Huishoudboekje now accepts burgers without a phone number and/or email address.
- 119b23b5: Fixed #1158: Fixed issue for transactions without tegenrekening.

## 1.4.0

Deze versie omvat nieuwe functionaliteit voor het signaleren van afwijkingen op verwachte inkomsten of uitgaven. Ook omvat het verbeteringen voor snelheid en stabiliteit.

### Minor changes

- Introducing alarms and signals!

### Patch Changes

- bb28672f: Fixed #1109: Improved performance for automated imports. Zoektermen can now be directly saved on create or update of an Afspraak.
- ec98eab6: Fixed #1119: Fixed a bug where matching afspraken would be found when a zoekterm contained by Regex escapable characters.
- 960e0288: Fixed #1115: Improved performance of automatisch boeken. All transactions are now created in batch.

## 1.3.0

Deze versie omvat verbeteringen van snelheid en een voorbereiding op aankomende functionaliteit.

### Minor Changes

- 54274588: All services that use Prisma now include the generated PrismaClient. It is no longer required to generate the PrismaClient on runtime.
- d30a14ee: Fixed #1092: Added the ability to use feature flags in the backend.
- 448db072: Updated to Flask 2.

  ## Migration guide

  The way that services migrate their databases has changed.
  In your deployment scripts, please find every instance of the following command:

  ```shell
  python manage.py db upgrade
  ```

  And change it to the following command:

  ```shell
  flask db upgrade
  ```

  To see the exact change in the context of a Kubernetes configuration file, please see `/k8s/base/organisatieservice/deployment.yaml`, lines 69-70.

- d0bc03e8: #1076: A cronjob that checks alarms has been added.

  ## Migration guide

  > ⚠️ This feature has not been officially released yet. These instructions are a draft, and not required for this release to work if you don't use the alarms feature.
  > A later release will include a reference to these instructions in the release notes.

  Please add the cronjob to your deployments. It should be scheduled to be executed some time at night, for example at 3am.
  The container for the cronjob requires the same environment variables as the container for the backend.

  ```shell
  HHB_SERVICE_URL="http://hhb-huishoudboekjeservice"
  ORGANISATIE_SERVICE_URL="http://hhb-organisatieservice"
  TRANSACTIE_SERVICE_URL="http://hhb-banktransactieservice"
  GROOTBOEK_SERVICE_URL="http://hhb-grootboekservice"
  LOG_SERVICE_URL="http://hhb-logservice"
  POSTADRESSENSERVICE_URL="http://hhb-postadressenservice"
  ALARMENSERVICE_URL="http://hhb-alarmenservice"
  SIGNALENSERVICE_URL="http://hhb-signalenservice"
  ```

  As the command inside the cronjob is a background job, no authorization is required. Authorization is disabled by adding the following environment variable to the container:

  ```shell
  REQUIRE_AUTH="0"
  ```

  See `k8s/base/backend/cronjob.yaml` in this repository for an example.

### Patch Changes

- e406a0f2: Performance improvements by only fetching fields we actually need.
- a847c731: Fixed #1113: Feature flags are now fetched only once upon page load.
- e5864c08: Fixed #1106: The upload modal now stays open after all uploads have finished.
- bee17715: Fixed #1023: Connection errors are now better readable.
- da541262: Fixed #1047: Form for configuratie is now also visible when there are no results.
- 64a0cf04: Added runtime validation for the theme file. This makes it easier to verify if the theme file has all the required settings, and if it doesn't, a more verbose error will now be visible.
- 019f84e5: Fixed #371: Improved error handling.
- 1375a342: Fixes 1066: Added support for saving Dates as Timestamp without timezone.
- 2707b181: Fixed #996: It is now possible to click through to the details of a transaction from a signaal.
- 4f9b14bb: Fixed #1043: It is now possible to click through to a burger and afspraak on audit logs for alarms.
- dbec1807: Fixed #1040: Optimalizations for data requests to services.
- 579bd2f4: Fixed #1051: Time to reload the data after creating an alarm has been improved.
- 1cc8f27f: Fixed #1032: Updated Python to 3.10.7
- 53d8971e: Fixes #1068: Date to DateTime in banktransactieservice
- 5e73ad91: Fixed #1104: Fixed a problem where removing a zoekterm did not work as expected.
- ad873905: Fixed #1067: Added support for timestamp without timezone fields in Postgres.
- 09988cc3: Fixed #1105: Fixed some issues that caused errors when alarmen feature was disabled.
- e59a70be: Fixes #1001: Test for brieven export
- 48cfb52c: Fixed #1017: Improved consistency in error messages.

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
