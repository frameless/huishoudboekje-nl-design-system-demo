// cypress/support/step_definitions/Bank statements/Bank accounts/delete-bank-account-of-organisation.feature

import {Given, When, Then, Step} from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region Scenario: bank account not used in journal entry

Given('the bank account is not applied to a journal entry', () => {

  Step(this, 'I create a test bank account');

});

When('I confirm by clicking the "Delete" button', () => {

  cy.get('[data-test="button.Delete"]')
    .click();

});

Then('the bank account "NL79KOEX0830642005" is not displayed', () => {

  cy.get('body')
    .should('not.contain', 'NL79 KOEX 0830 6420 05');
});

//#endregion

//#region Scenario: bank account used in journal entry

Given('the bank account is applied to a journal entry', () => {

  // Add bank account
  Step(this, 'I create a test bank account');

  // Add post address to test department
  cy.get('[data-test="button.addPostaddressModal"]')
    .click();
  cy.waitForReact();
  cy.get('[data-test="postaddress.streetname"]')
    .type('Teststraat');
  cy.get('[data-test="postaddress.housenumber"]')
    .type('1');
  cy.get('[data-test="postaddress.postcode"]')
    .type('1234AB');
  cy.get('[data-test="postaddress.placename"]')
    .type('Testburg');
  cy.get('[data-test="buttonModal.submit"]')
    .click();

  // Check success message
  cy.get('[data-status="success"]')
    .contains('Postadres')
    .should('be.visible');

  // Navigate to citizen
  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type('Mcpherson');
  cy.waitForReact();
  cy.contains('Patterson')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/burgers/')
  cy.get('[data-test="button.Add"]')
    .click();

  // Add agreement with test department
  cy.url().should('contains', '/afspraken/toevoegen');
  cy.get('[data-test="radio.agreementOrganization"]')
    .click();
  cy.get('#organisatie')
    .type('Lorem Ip');
  cy.contains('sum 1337')
    .click();
  // Check auto-fill
  cy.contains('Department of Testing');
  cy.contains('Teststraat 1');

  // Payment direction: Income
  cy.get('[data-test="radio.agreementIncome"]')
    .click();
  cy.get('#rubriek')
    .click()
    .contains('Inkomsten')
    .click();
  cy.get('[data-test="select.agreementIncomeDescription"]')
    .type('Inkomsten 1337');
  cy.get('[data-test="select.agreementIncomeAmount"]')
    .type('10');
  cy.get('[data-test="button.Submit"]')
    .click();

  // Check success message
  cy.get('[data-status="success"]')
    .contains('afspraak')
    .should('be.visible');

  // Navigate to test department
  cy.visit('/organisaties');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/organisaties');
  cy.get('input[placeholder="Zoeken"]')
    .type('Lorem Ipsum 1337');
  cy.get('p[title="Lorem Ipsum 1337"]')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/organisaties/');
  cy.get('p[title="Department of Testing"]')
    .click();

});

Then('the bank account "NL79KOEX0830642005" is displayed', () => {

  cy.contains('NL79 KOEX 0830 6420 05');

});

//#endregion
