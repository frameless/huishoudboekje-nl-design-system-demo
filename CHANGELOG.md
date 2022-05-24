# Huishoudboekje Changelog

## Upcoming release

### New features

- Alarmen en signalen

## 1.1.1

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
