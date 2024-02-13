// cypress/support/step_definitions/Alarms/read-alarm-settings.js

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

// Before *all* tests, run this (so this runs once)
before(() => {

// Clean up
  // Truncate alarms
  cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Alarm"`,"connection":connectionAlarm}).then(queryResponse => {
    cy.log(queryResponse)
    });

  // Truncate signals
  cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Signal"`,"connection":connectionSignal}).then(queryResponse => {
    cy.log(queryResponse)
    });

});

// Before *each* test, run this (so this runs equal to the amount of tests)
beforeEach(() => {

  // If not on localhost, log out of application

  // If not on localhost, log into application
  
  });

//#region Scenario: no alarm exists

//When('I view the "Agreement" page', () => {});
// Is already defined in other test

//Then('the "Er is geen alarm ingesteld." text is displayed', () => {
// Is already defined in other test

//Then('the "Add alarm" button is displayed', () => {
// Is already defined in other test

//#endregion

//#region Scenario: monthly recurring alarm exists

//When('I view the "Agreement" page', () => {});
// Is already defined in other test

Then('the alarm recurrency is displayed', () => {

  // Skip test

});

Then('the alarm day of the month is displayed', () => {

  // Skip test

});

Then('the alarm allowed deviation in days is displayed', () => {

  // Skip test

});

Then('the alarm next date is displayed', () => {

  // Skip test

});

Then('the alarm expected amount is displayed', () => {

  // Skip test

});

Then('the alarm allowed deviation of the expected amount is displayed', () => {

  // Skip test

});

Then('the alarm status is displayed', () => {

  // Skip test

});

//Then('the "Delete alarm" button is displayed', () => {
// Is already defined in other test

//#endregion