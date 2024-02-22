// cypress/support/step_definitions/Signals/list-signals.js

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

//#region Scenario: no signal exists

Given('0 active signals exist', () => {

  // Skip unfinished test

});
 
When('I view the "Signals" page', () => {

  // Skip unfinished test

});

Then('the "Er zijn geen signalen gevonden." text is displayed', () => {

  // Skip unfinished test

});

//#endregion

//#region Scenario: active signals exist

Given('1 or more active signals exist', () => {

  // Skip unfinished test

});
 
// When('I view the "Signals" page', () => {});
  // Part of previous scenario

Then('the signal description is displayed', () => {

  // Skip unfinished test

});

Then('the signal date is displayed', () => {

  // Skip unfinished test

});

Then('the "Suppress signal" button is displayed', () => {

  // Skip unfinished test

});

Then('the signal status is displayed', () => {

  // Skip unfinished test

});

//#endregion

//#region Scenario: suppressed signals exist

Given('1 or more suppressed signals exist', () => {

  // Skip unfinished test

});
 
// When('I view the "Signals" page', () => {});
  // Part of previous scenario

Then('I enable the suppressed signals filter', () => {

  // Skip unfinished test

});

Then('all suppressed signals are displayed', () => {

  // Skip unfinished test

});

//#endregion
