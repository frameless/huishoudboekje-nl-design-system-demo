// cypress/support/step_definitions/Signals/create-signal-on-no-payment.js

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

//#region Scenario: no transaction within timeframe

When('the alarm timeframe expires', () => {

  // Add alarm to database

    // Run query
    cy.task("dbQuery", {"query":`INSERT INTO public."Alarm"
    (id, "afspraakId", "afspraakUuid", "signaalId", "signaalUuid", "isActive", "datumMargin", bedrag, "bedragMargin", "byDay", "byMonth", "byMonthDay", "startDate", "endDate")
    VALUES('7aede5fa-6aa3-44cd-997d-995c58b41779', 1, NULL, NULL, NULL, true, 1, 76532.0, 1000.0, '{}', '{1,2,3,4,5,6,7,8,9,10,11,12}', '{1}', '2024-01-01', '');`,"connection":connectionAlarm}).then(queryResponse => {
      cy.log(queryResponse)
      });

  // Run command to trigger alarm
  cy.exec('docker-compose exec -T backend flask alarms evaluate')
  cy.wait(1000)

  // Check whether notification is set
    // [TO-DO] Will be checked by alarmservice in new version
      // Run query
      cy.task("dbQuery", {"query":`SELECT NOW()`,"connection":connectionSignal}).then(queryResponse => {
        cy.log(queryResponse)
        });

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
 
Then('a "Payment missing" signal is created', () => {
  
  // Add alarm to database

    // Run query
    cy.task("dbQuery", {"query":`INSERT INTO public."Alarm"
    (id, "afspraakId", "afspraakUuid", "signaalId", "signaalUuid", "isActive", "datumMargin", bedrag, "bedragMargin", "byDay", "byMonth", "byMonthDay", "startDate", "endDate")
    VALUES('7aede5fa-6aa3-44cd-997d-995c58b41779', 1, NULL, NULL, NULL, true, 1, 76532.0, 1000.0, '{}', '{1,2,3,4,5,6,7,8,9,10,11,12}', '{1}', '2024-01-01', '');`,"connection":connectionAlarm}).then(queryResponse => {
      cy.log(queryResponse)
      });

  // Run command to trigger alarm
  cy.exec('docker-compose exec -T backend flask alarms evaluate')
  cy.wait(1000)

  // Check whether notification is set
    // [TO-DO] Will be checked by alarmservice in new version
      // Run query
      cy.task("dbQuery", {"query":`SELECT NOW()`,"connection":connectionSignal}).then(queryResponse => {
        cy.log(queryResponse)
        });

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

//#endregion

//#region Scenario: multiple payments within timeframe

When('1 or more bank transactions with a transaction date within the alarm timeframe are linked to the agreement', () => {

  // Add alarm to database

    // Run query
    cy.task("dbQuery", {"query":`INSERT INTO public."Alarm"
    (id, "afspraakId", "afspraakUuid", "signaalId", "signaalUuid", "isActive", "datumMargin", bedrag, "bedragMargin", "byDay", "byMonth", "byMonthDay", "startDate", "endDate")
    VALUES('7aede5fa-6aa3-44cd-997d-995c58b41779', 1, NULL, NULL, NULL, true, 1, 76532.0, 1000.0, '{}', '{1,2,3,4,5,6,7,8,9,10,11,12}', '{1}', '2024-01-01', '');`,"connection":connectionAlarm}).then(queryResponse => {
      cy.log(queryResponse)
      });

  // Run command to trigger alarm
  cy.exec('docker-compose exec -T backend flask alarms evaluate')
  cy.wait(1000)

  // Check whether notification is set
    // [TO-DO] Will be checked by alarmservice in new version
      // Run query
      cy.task("dbQuery", {"query":`SELECT NOW()`,"connection":connectionSignal}).then(queryResponse => {
        cy.log(queryResponse)
        });

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
 
Then('a "Multiple payments" signal is created', () => {
  
  // Add alarm to database

    // Run query
    cy.task("dbQuery", {"query":`INSERT INTO public."Alarm"
    (id, "afspraakId", "afspraakUuid", "signaalId", "signaalUuid", "isActive", "datumMargin", bedrag, "bedragMargin", "byDay", "byMonth", "byMonthDay", "startDate", "endDate")
    VALUES('7aede5fa-6aa3-44cd-997d-995c58b41779', 1, NULL, NULL, NULL, true, 1, 76532.0, 1000.0, '{}', '{1,2,3,4,5,6,7,8,9,10,11,12}', '{1}', '2024-01-01', '');`,"connection":connectionAlarm}).then(queryResponse => {
      cy.log(queryResponse)
      });

  // Run command to trigger alarm
  cy.exec('docker-compose exec -T backend flask alarms evaluate')
  cy.wait(1000)

  // Check whether notification is set
    // [TO-DO] Will be checked by alarmservice in new version
      // Run query
      cy.task("dbQuery", {"query":`SELECT NOW()`,"connection":connectionSignal}).then(queryResponse => {
        cy.log(queryResponse)
        });

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

//#endregion