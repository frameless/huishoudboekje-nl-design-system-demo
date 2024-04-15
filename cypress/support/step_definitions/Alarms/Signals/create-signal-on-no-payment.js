// cypress/support/step_definitions/Signals/create-signal-on-no-payment.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

// Set database query
const queryTruncateAlarm = `mutation Truncate {
  truncateTable(databaseName: "alarmenservice", tableName: "Alarm")
}`

const queryTruncateSignal = `mutation Truncate {
  truncateTable(databaseName: "signalenservice", tableName: "Signal")
}`

const queryAddAlarm = `mutation CreateAlarm {
  createAlarm(input: {alarm:{
    afspraakId: 1,
    id: "test",
    isActive: true,
    datumMargin: 0,
    bedrag: 1000,
    bedragMargin: 0,
    byDay: [MONDAY,FRIDAY,TUESDAY,SATURDAY,SUNDAY,WEDNESDAY,THURSDAY],
    startDate: "2024-01-01"
  }})
  {
    alarm{
      id
    }
   }
  
  updateAfsprakenById(input: {
    id: 1,
    afsprakenPatch: {
      alarmId: "test"
    }
  }){
    afspraken{
      id
    }
  }
}`

//#region Scenario: no transaction within timeframe

Given('I create a test alarm with expired timeframe', () => {

  // Add alarm to database
    // Run query
    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryAddAlarm },
    }).then((res) => {
      console.log(res.body);
    });

  // Wait
  cy.wait(500)

});

Given('I undo reconciliation of a transaction', () => {

// Reconciliate transaction to trigger signal refresh
    // Create transaction
    cy.visit('/bankzaken/bankafschriften');
    cy.waitForReact();
    cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')
    cy.contains("Er zijn geen bankafschriften gevonden.")
    cy.get('input[type="file"]')
      .selectFile('voorbeeldbankafschriften/Banktransacties persona 1 zorgtoeslag.txt', { force: true })
    cy.wait(5000)
    cy.get('[aria-label="Close"]')
      .should('be.visible')
      .click()
    
    // Undo reconciliation of the first transaction
    cy.visit('/bankzaken/transacties');
    cy.waitForReact();
    cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/transacties');
    cy.get('[data-test="transactionsPage.filters.reconciliated"]')
      .click();
    cy.get('[data-test="transactions.expandFilter"]')
      .click();
    cy.waitForReact();
    cy.get('input[id="zoektermen"]')
      .type("MAAND JAN. NR. 999999990T000013 VOORSCHOT ZORGTOESLAG 2024");
    cy.get('[data-test="transactions.submitSearch"]')
      .click();
    cy.contains('Toeslagen')
      .click();
    cy.url().should('contains', Cypress.config().baseUrl + '/bankzaken/transacties/');
    cy.contains('Afletteren ongedaan maken')
      .click();

});

Given('I redo reconciliation of a transaction to trigger signal refresh', () => {

  // Reconciliate transaction to trigger signal refresh
    cy.visit('/bankzaken/transacties');
    cy.waitForReact();
    cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/transacties');
    cy.get('[data-test="transactionsPage.filters.notReconciliated"]')
      .click();
    cy.get('[data-test="transactions.expandFilter"]')
      .click();
    cy.waitForReact();
    cy.get('input[id="zoektermen"]')
      .type("MAAND JAN. NR. 999999990T000013 VOORSCHOT ZORGTOESLAG 2024");
    cy.get('[data-test="transactions.submitSearch"]')
      .click();
    cy.contains('Toeslagen')
      .click();
    cy.url().should('contains', Cypress.config().baseUrl + '/bankzaken/transacties/');
    cy.contains('Afletteren ongedaan maken')
      .click();
  
  });

When('the alarm timeframe expires', () => {

  // Given an alarm is enabled
  Step(this, 'I create a test alarm with expired timeframe');

  // Undo reconciliation
  Step(this, 'I undo reconciliation of a transaction');

  // Add Agreement to Civilian 1
  

  // Reconciliate the first transaction
  Step(this, 'I redo reconciliation of a transaction to trigger signal refresh');
 
});
 
Then('a "Payment missing" signal is created', () => {
  
  // Check whether notification is set
  cy.visit('/signalen');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/signalen')

  cy.pause();

  // Clean up
    // Transactions
    cy.visit('/bankzaken/bankafschriften');
    cy.waitForReact();
    cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')
    cy.get('[aria-label="Verwijderen"]')
      .should('be.visible')
      .click();
    cy.get('[aria-label="Verwijderen"]')
      .should('be.visible')
      .click();
    cy.waitForReact();
    cy.get('[data-status="success"]')
      .should('be.visible');

    // Alarms
    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateAlarm },
    }).then((res) => {
      console.log(res.body);
    });

    // Signals
    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateSignal },
    }).then((res) => {
      console.log(res.body);
    });
 
});

//#endregion
