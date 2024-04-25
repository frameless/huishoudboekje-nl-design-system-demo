
import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

const modalWait = 4000;

//#region  Scenario: no bank statements exist

Given('0 bank statements exist', () => {

  // Assert no bank statements
  cy.visit('/bankzaken/bankafschriften');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')
  cy.waitForReact();
  cy.get('[aria-label="Verwijderen"]')
    .should('not.exist');

});

When('I view the "Bank statements" page', () => {

  cy.visit('/bankzaken/bankafschriften');
  cy.waitForReact();

  // Assertion
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')

});

Then('the "Er zijn geen bankafschriften gevonden" text is displayed', () => {

  cy.contains('Er zijn geen bankafschriften gevonden');

});

// Then('the "Add bank statement" button is displayed', () => {});

//#endregion

//#region  Scenario: no bank statements exist

Given('1 or more bank statements exist', () => {

  // Navigate to bank statements page
  cy.visit('/bankzaken/bankafschriften');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')
  cy.waitForReact();
  cy.get('[aria-label="Verwijderen"]')
    .should('not.exist');

  // Add file 1
  cy.get('input[type="file"]')
    .selectFile('voorbeeldbankafschriften/camt053-kosten-betalingsverkeer-20231130.xml', { force: true });
  cy.wait(modalWait)
  cy.get('[data-test="uploadItem.check"]') // Assert file upload status icon is displayed
    .should('be.visible')

  // Close modal
  cy.get('[aria-label="Close"]')
    .should('exist')  
    .should('be.visible')
    .click()

  // Add file 2
  cy.get('input[type="file"]')
    .selectFile('voorbeeldbankafschriften/camt onbekende iban.xml', { force: true });
  cy.wait(modalWait)
  cy.get('[data-test="uploadItem.check"]') // Assert file upload status icon is displayed
    .should('be.visible')

  // Close modal
  cy.get('[aria-label="Close"]')
    .should('exist')  
    .should('be.visible')
    .click()

});

Then('the bank statement filenames are displayed', () => {

  // Assertion
  cy.contains('camt053-kosten-betalingsverkeer-20231130.xml');
  cy.contains('camt onbekende iban.xml');

});

//#endregion