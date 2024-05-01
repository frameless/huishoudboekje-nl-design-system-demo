// cypress/support/step_definitions/Bank statements/Bank accounts/create-bank-account-for-organisation.feature

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region Generic steps

When('I create a test organisation', () => {

  cy.visit('/organisaties');
  cy.url().should('eq', Cypress.config().baseUrl + '/organisaties');
  cy.waitForReact();
  cy.get('button')
    .contains('Toevoegen')
    .click();
  cy.url().should('eq', Cypress.config().baseUrl + '/organisaties/toevoegen');

  // Fill in input fields
  cy.get('[data-test="input.KvK"]')
    .type('12345678');
  cy.get('[data-test="input.branchnumber"]')
    .type('123456789012');
  cy.get('[data-test="input.companyname"]')
    .type('Lorem Ipsum 1337');
  cy.get('button[type="submit"]')
    .click();

  Step(this, 'a notification of success is displayed');

});

When('I create a test department', () => {

  cy.visit('/organisaties');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/organisaties');
  cy.get('input[placeholder="Zoeken"]')
    .type('Lorem Ipsum 1337');
  cy.get('p[title="Lorem Ipsum 1337"]')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/organisaties/');

  // Add department-modal
  cy.get('button')
    .contains('Toevoegen')
    .click();
  cy.get('button[type="reset"]')
    .should('be.visible'); // Small assertion to check if modal is available
  cy.get('[data-test="input.createDepartment.name"]')
    .type('Department of Testing');
  cy.get('button[type="submit"]')
    .click();

  Step(this, 'a notification of success is displayed');

});

When('I create a test bank account', () => {

  // Given I am viewing the department detail page
  cy.get('[data-test="button.addBankAccountModal"]')
    .click();
  cy.get('header[id^="chakra-modal"]')
    .should('be.visible');
  cy.get('[data-test="input.IBAN"]')
    .type('NL79KOEX0830642005');
  cy.get('[data-test="buttonModal.submit"]')
    .click();

  Step(this, 'a notification of success is displayed');

  cy.contains('NL79 KOEX 0830 6420 05');

});

//#endregion

//#region Scenario: view create bank account form

When('I view the "Organisation department" page', () => {

  Step(this, 'I create a test organisation');

  Step(this, 'I create a test department');

  cy.get('p[title="Department of Testing"]')
    .click();
  
  // Assertion
  cy.url().should('include', '/afdelingen/');

});


//When('I view the "Add bank account" modal');
  // Part of delete-bank-account.js

Then('the "Add bank account" modal opens', () => {

  cy.url().should('include', '/afdelingen/');
  cy.get('header[id^="chakra-modal"]')
    .should('be.visible');

});

// Then('the "Close modal" button is displayed', () => {});
// Part of create-alarm.js

Then('the "Account holder" form field is displayed', () => {

  cy.get('[data-test="input.accountHolder"]')
    .should('be.visible');

});

Then('the "IBAN" form field is displayed', () => {

  cy.get('[data-test="input.IBAN"]')
    .should('be.visible');

});

Then('the "Cancel form" button is displayed', () => {

  cy.get('button[type="reset"]')
    .should('be.visible');

});

//Then('the "Submit form" button is displayed');
// Part of create-alarm.js

//#endregion

//#region Scenario: save bank account

// When('I view the "Organisation department" page')
// When('I view the "Add bank account" modal')
// Then('the "Add bank account" modal opens')
  // Part of previous scenario

When('I fill in the "Account holder" form field', () => {

  cy.get('[data-test="input.accountHolder"]')
    .type('{selectAll}Lorem Ipsum Holder');

});

When('I fill in the "IBAN" form field', () => {

  cy.get('[data-test="input.IBAN"]')
    .type('NL79KOEX0830642005');

});

Then('the "Add bank account" modal is closed', () => {

  cy.get('header[id^="chakra-modal"]')
  .should('not.exist');

});

//#endregion
