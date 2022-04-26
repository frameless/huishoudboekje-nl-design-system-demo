# Huishoudboekje Changelog

## 1.0.0

### Minor Changes

- c22078e5: Fixed #879: Feature flags are now following OTAP, and can be enabled per environment type.

  ### Migration

  Please add the following enviroment variables to the Unleash service:

  ```shell
  # For production environment
  UNLEASH_OTAP = production

  # For acceptance environment
  UNLEASH_OTAP = acceptance
  ```

### Patch Changes

- d816516b: Fixed #724: Postadres cannot be removed when it is in use.
- a094c25d: Fixed #721: Afspraak cannot be deleted when coupled to a journaalpost.
- 1f33b43f: Added error handling for deleting rubrieken and configuraties
- 3553403d: Added error handling for deleting afspraken
- ff4d8e91: Added CI job that fails if there are no added changesets. Every Merge Request now requires a changeset.
- 15e44ba2: Afdeling verwijderen verbeteren
- 9a2813ca: Fixed #899: Banktransactions are now being refreshed in the overview after manual matching.
- d76350c0: Added license compliance job to GitLab CI
- dd774aa5: Fixed #876: Parsing dates coming from services with datetime first before returning only the date.
- 898165d3: Updated docs about changesets
- 2f92d9c7: Fixed #913: Added a feature that allows a user to download an error report when a GraphQL error occurs
- 2780e915: Fixed #700: Rubrieken cannot be removed if they are used in afspraken or journaalposten.
- 898165d3: Added a job "changeset" to the CI that requires that a Merge requests include a changeset.
- 484e361c: Unleash service now has a new route that provides a list of all available featureflags and their current state. Frontend now uses this route at the start and now doesn't need to request the unleash service for single featureflags states.

## Upcoming release

### New features

- Alarmen en signalen

## 1.0.0-beta.1

Met hulp van deze applicatie voer je het dienstverleningsconcept Huishoudboekje uit. Deze gegevens kun je beheren en gebruiken: organisaties, afdelingen, postadressen, bankrekeningnummers, burgers, huishoudens, afspraken, betaalkenmerken, betaalinstructies en bankafschriften.

### New features

- Added changesets

### Improvements

- Reset version to 1.0.0-beta.1
