// cypress/support/step_definitions/Bank statements/Bank accounts/read-bank-account-of-organisation.feature

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region Scenario: no bank account

Given('no bank account exists', () => {

  // Since nothing needs to be done for this assertion,
  // this is a blank test step

});

Then('no bank account is displayed', () => {

  // Assertion: if no bank account exists,
  // the table should not exist
  // So this assertion is done by searching for table headers
  cy.get('body')
    .should('not.contain', 'Rekeninghouder')
    .should('not.contain', 'IBAN');
  
});

Then('the "Add bank account" button is displayed', () => {

  // Assertion
  cy.get('[data-test="button.addBankAccountModal"]')
    .should('be.visible');
  
});

//#endregion

//#region Scenario: bank account exists

Given('1 or more bank accounts exist', () => {

  // Create a bank account
  Step(this, 'I create a test bank account');

});

Then('the "Account holder" is displayed', () => {

  // Header
  cy.contains('Rekeninghouder');

  // Assertion
  cy.get('[id^=bank_account]')
    .children()
    .first()
    .children()
    .should('be.visible')
    .should('not.be.empty');

});

Then('the "IBAN" is displayed', () => {

  // Header
  cy.contains('IBAN');

  // Assertion
  cy.get('[id^=bank_account]')
    .children()
    .first()
    .next()
    .children()
    .should('be.visible')
    .should('not.be.empty');

});

Then('the "Edit bank account" button is displayed', () => {

  // Assertion
  cy.get('[id^=bank_account]')
    .find('[data-test="buttonIcon.Edit"]')
    .should('be.visible');

});

//#endregion
