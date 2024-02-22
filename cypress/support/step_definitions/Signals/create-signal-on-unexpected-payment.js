// cypress/support/step_definitions/Signals/create-signal-on-unexpected-payment.js

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

//#region Scenario: payment amount too high

When('a bank transaction is booked to an agreement', () => {

  // Skip unfinished test
 
});

Then('the bank transaction date is within the alarm timeframe', () => {

  // Skip unfinished test
 
});

Then('the bank transaction amount is greater than the sum of the expected amount plus the allowed amount deviation', () => {

  // Skip unfinished test
 
});

Then('a "Payment amount too high" signal is created', () => {

  // Skip unfinished test
 
});

//#endregion

//#region Scenario: payment amount too low

//When('a bank transaction is booked to an agreement', () => {});
  // Part of previous scenario

//Then('the bank transaction date is within the alarm timeframe', () => {});
  // Part of previous scenario

Then('the bank transaction amount is smaller than the sum of the expected amount minus the allowed amount deviation', () => {

  // Skip unfinished test
 
});

Then('a "Payment amount too low" signal is created', () => {

  // Skip unfinished test
 
});

//#endregion

//#region Scenario: expected payment amount

//When('a bank transaction is booked to an agreement', () => {});
  // Part of previous scenario

//Then('the bank transaction date is within the alarm timeframe', () => {});
  // Part of previous scenario

  Then('the bank transaction amount is smaller than the sum of the expected amount plus the allowed amount deviation or greater than the sum of the expected amount minus the allowed amount deviation', () => {

    // Skip unfinished test
   
  });
  
  Then('no signal is created', () => {
  
    // Skip unfinished test
   
  });
  
  //#endregion
