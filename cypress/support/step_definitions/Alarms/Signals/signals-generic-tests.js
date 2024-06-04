// cypress/support/step_definitions/Generic/generic-tests.js

import { Before, After, When } from "@badeball/cypress-cucumber-preprocessor";

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

Before({ tags: "@beforeTruncateSignals" }, function (){

  // Clean up
    // Truncate signals
    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateSignal },
    }).then((res) => {
      console.log(res.body);
    });

});

// After *all* tests, run this (so this runs once at the start)
After({ tags: "@cleanupSignal" }, function (){

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
  
  // Remove bank statement
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

  // Remove latest agreement
  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type('Mcpherson');
  cy.wait(500);
  cy.contains('Patterson')
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

});

After({ tags: "@cleanupTwoSignals" }, function (){

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
  
  // Remove bank statement
  cy.visit('/bankzaken/bankafschriften');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')
  cy.waitForReact();
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.get('[data-status="success"]')
    .should('be.visible');
  cy.wait(3000);
  
  // Remove bank statement two
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.wait(1000);
  cy.get('[data-status="success"]')
    .should('be.visible');
  cy.wait(3000);

  // Remove latest agreement
  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type('Mcpherson');
  cy.waitForReact();
  cy.contains('Patterson')
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

});

After({ tags: "@cleanupAlarmSignal" }, function (){

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

  // Remove latest agreement
  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type('Mcpherson');
  cy.waitForReact();
  cy.contains('Patterson')
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
    
})

After({ tags: "@cleanupSixStatementsAgreement" }, function (){

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
  
  // Remove bank statement 1
  cy.visit('/bankzaken/bankafschriften');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')
  cy.waitForReact();
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.get('[data-status="success"]')
    .should('be.visible');
  cy.wait(3000);
  
  // Remove bank statement 2
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.wait(1000);
  cy.get('[data-status="success"]')
    .should('be.visible');
  cy.wait(3000);

  // Remove bank statement 3
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.wait(1000);
  cy.get('[data-status="success"]')
    .should('be.visible');
  cy.wait(3000);

  // Remove bank statement 4
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.wait(1000);
  cy.get('[data-status="success"]')
    .should('be.visible');
  cy.wait(3000);

  // Remove bank statement 5
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.wait(1000);
  cy.get('[data-status="success"]')
    .should('be.visible');
  cy.wait(3000);

  // Remove bank statement 6
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.get('[aria-label="Verwijderen"]')
    .first()
    .click();
  cy.waitForReact();
  cy.wait(1000);
  cy.get('[data-status="success"]')
    .should('be.visible');
  cy.wait(3000);

  // Remove latest agreement
  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type('Mcpherson');
  cy.waitForReact();
  cy.contains('Patterson')
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

});