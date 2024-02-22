// cypress/support/step_definitions/Signals/suppress-signal.js

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

// Set database connections
const connectionAlarm =
{
  "user": Cypress.config().databaseAlarmUser,
  "host": Cypress.config().databaseAlarmHost,
  "database": Cypress.config().databaseAlarm,
  "password": Cypress.config().databaseAlarmPassword,
  "port": Cypress.config().databasePort
};

const connectionSignal =
{
  "user": Cypress.config().databaseSignalUser,
  "host": Cypress.config().databaseSignalHost,
  "database": Cypress.config().databaseSignal,
  "password": Cypress.config().databaseSignalPassword,
  "port": Cypress.config().databasePort
};

//#region Scenario: active signals exist

//Given('1 or more active signals exist', () => {});
  // Part of list-signals.feature

//When('I view the "Signals" page', () => {});
  // Part of list-signals.feature

Then('I enable the active signals filter', () => {

  // Skip unfinished test

});

Then('I disable the suppressed signals filter', () => {

  // Skip unfinished test

});

Then('I click the "Suppress signal" button of a signal', () => {

  // Skip unfinished test

});

Then('that signal is closed', () => {

  // Skip unfinished test

});

//#endregion
