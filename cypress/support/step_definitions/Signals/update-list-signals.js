// cypress/support/step_definitions/Signals/update-list-signals.js

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

//#region Scenario: view signals refresh timestamp

//When('I view the "Signals" page', () => {});
  // Part of list-signals.feature

Then('the signals refresh timestamp is displayed', () => {

  // Skip unfinished test

});

Then('the "Refresh signals" button is displayed', () => {

  // Skip unfinished test

});

//#endregion

//#region Scenario: automatically refresh signals

//When('I view the "Signals" page', () => {});
  // Part of list-signals.feature

  Then('5 minutes pass', () => {

    cy.wait(300000)
  
  });
  
  Then('the "Signals" page is refreshed', () => {
  
    // Skip unfinished test
  
  });

  //Then('the signals refresh timestamp is displayed', () => {});
    // Part of previous scenario
  
  //#endregion

  //#region Scenario: manually refresh signals

//When('I view the "Signals" page', () => {});
  // Part of list-signals.feature

  Then('I click the "Refresh signals" button', () => {

    // Skip unfinished test
  
  });
  
  //Then('the "Signals" page is refreshed', () => {});
    // Part of previous scenario

  //Then('the signals refresh timestamp is displayed', () => {});
    // Part of previous scenario
  
  //#endregion
