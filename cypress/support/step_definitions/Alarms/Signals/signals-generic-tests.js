// cypress/support/step_definitions/Generic/generic-tests.js

import { Before, After, When, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

// Set database query
const queryTruncateAlarm = `mutation Truncate {
  truncateTable(databaseName: "alarmenservice", tableName: "Alarm")
}`

const queryTruncateSignal = `mutation Truncate {
  truncateTable(databaseName: "alarmenservice", tableName: "signals")
}`

const queryTruncateBankTransactions = `mutation Truncate {
  truncateTable(databaseName: "banktransactieservice", tableName: "bank_transactions")
}`

const queryTruncateCustomerStatements = `mutation Truncate {
  truncateTable(databaseName: "banktransactieservice", tableName: "customer_statement_messages")
}`

const queryTruncateJournaalposten = `mutation Truncate {
  truncateTable(databaseName: "huishoudboekjeservice", tableName: "journaalposten")
}`

Before({ tags: "@beforeTruncateSignals" }, function (){

  // Clean up
  Step(this, 'I truncate the signals table in alarmenservice');

});

// After *all* tests, run this (so this runs once at the start)
After({ tags: "@cleanupSignal" }, function (){

  // Clean up
  Step(this, 'I truncate the alarms table in alarmenservice');
  Step(this, 'I truncate the signals table in alarmenservice');
  Step(this, 'I truncate the bank transaction tables');

  // Remove latest agreement
  Step(this, 'I open the citizen overview page for "Dingus Bingus"');

  cy.get('tbody')
    .find('tr')
    .last()
    .children()
    .last()
    .find('a[aria-label="Bekijken"]:visible')
    .click();
  cy.url().should('contains', Cypress.config().baseUrl + '/afspraken/')
  cy.get('[data-test="agreement.menuKebab"]')
    .click();
  cy.get('[data-test="agreement.menuDelete"]')
    .click();
  cy.get('[data-test="button.AlertDelete"]')
    .click();
  
  // Check success message
  Step(this, "a success notification containing 'afspraak' is displayed");

});

After({ tags: "@cleanupTwoSignals" }, function (){

  // Clean up
  Step(this, 'I truncate the alarms table in alarmenservice');
  Step(this, 'I truncate the signals table in alarmenservice');
  Step(this, 'I truncate the bank transaction tables');

  // Remove latest agreement
  Step(this, 'I open the citizen overview page for "Dingus Bingus"');

  cy.get('tbody')
    .find('tr')
    .last()
    .children()
    .last()
    .find('a[aria-label="Bekijken"]:visible')
    .click();
  cy.url().should('contains', Cypress.config().baseUrl + '/afspraken/')
  cy.get('[data-test="agreement.menuKebab"]')
    .click();
  cy.get('[data-test="agreement.menuDelete"]')
    .click();
  cy.get('[data-test="button.AlertDelete"]')
    .click();
  
  // Check success message
  Step(this, "a success notification containing 'afspraak' is displayed");

});

After({ tags: "@cleanupAlarmSignal" }, function (){

  // Clean up
  Step(this, 'I truncate the alarms table in alarmenservice');
  Step(this, 'I truncate the signals table in alarmenservice');

  // Remove latest agreement
  Step(this, 'I open the citizen overview page for "Dingus Bingus"');

  cy.get('tbody')
    .find('tr')
    .last()
    .children()
    .last()
    .find('a[aria-label="Bekijken"]:visible')
    .click();
  cy.url().should('contains', Cypress.config().baseUrl + '/afspraken/')
  cy.get('[data-test="agreement.menuKebab"]')
    .click();
  cy.get('[data-test="agreement.menuDelete"]')
    .click();
  cy.get('[data-test="button.AlertDelete"]')
    .click();
  
  // Check success message
  Step(this, "a success notification containing 'afspraak' is displayed");

});

After({ tags: "@truncateStatements" }, function (){

  // Clean up
  Step(this, 'I truncate the alarms table in alarmenservice');
  Step(this, 'I truncate the signals table in alarmenservice');
  Step(this, 'I truncate the bank transaction tables');
  
});