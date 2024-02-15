// cypress/support/step_definitions/Alarms/set-alarm-availability.js

import { BeforeStep, Before, BeforeAll, After, AfterAll, AfterStep } from "@badeball/cypress-cucumber-preprocessor";

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

// Before *all* tests, run this (so this runs once at the start)
Before(() => {

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
BeforeStep(() => {
  
  cy.visit('/');
  cy.get('body').then((body) => {
    if (body.find('\#menu\\-button\\-\\\:r7\\\:'))
    {
      // If logged in, first log out
      cy.get('\#menu\\-button\\-\\\:r7\\\:') // Get kebab-menu and click it
        .click()
      cy.get('\#menu\\-list\\-\\\:r7\\\:\\-menuitem\\-\\\:r9\\:') // Get 'log out' button and click it
        .click()
    }
    else
    {
      // If not logged in, do nothing
    }
  })

  cy.visit('/');
  cy.get('body').then((body) => {
    if (body.find('button:contains("Inloggen")').length > 0)
    {
      // If not logged in, log into application
      cy.get('button')
        .contains('Inloggen')
        .click()
    }
    else
    {
      // If logged in, do nothing
      // This is purely for localhost, as in that case it is impossible to log out
    }
  })

});