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

  // Check whether modal is opened and visible
  cy.get('section[aria-modal="true"]', { timeout: 10000 })
    .scrollIntoView()
    .should('exist');
  cy.get('[data-test="button.AlertDelete"]', { timeout: 10000 })
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
  cy.get('[data-status="success"]')
    .contains('afspraak')
    .should('be.visible');
    
})

After({ tags: "@afterCleanupRemoveOption" }, function (){

  // Add back option 'Geen transactie gevonden'

  Step(this, 'I navigate to the page "/signalen"')
  Step(this, 'I select the option "Missende betaling"')
    
})

After({ tags: "@afterCleanupFilterSignalType" }, function (){

  // Clean up
    // Truncate alarms
    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateAlarm },
    }).then((res) => {
      console.log(res.body);
    });

    // Truncate signals
    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateSignal },
    }).then((res) => {
      console.log(res.body);
    });

  // Remove four bank statements
  var i = 0;
  for (i = 0; i < 4 ; i++) { 

    cy.visit('/bankzaken/bankafschriften');
    cy.waitForReact();
    cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')
    cy.wait(500);
    cy.get('[aria-label="Verwijderen"]')
      .first()
      .click();
    cy.wait(500);
    cy.get('[aria-label="Verwijderen"]')
      .first()
      .click();
    cy.wait(500);
    cy.get('[data-status="success"]', { timeout: 10000 })
      .contains('Het bankafschrift is verwijderd')
      .should('be.visible');

  }

  // Remove the four latest agreements
  var i = 0;
  for (i = 0; i < 4 ; i++) { 

    cy.visit('/burgers');
    cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
    cy.get('input[placeholder="Zoeken"]')
      .type('Dingus');
    cy.waitForReact();
    cy.contains('Bingus')
      .click();
    cy.url().should('include', Cypress.config().baseUrl + '/burgers/')
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
    cy.get('[data-status="success"]')
      .contains('afspraak')
      .should('be.visible');

  }
    
})
