// cypress/support/step_definitions/Bank statements/Bank accounts/update-bank-account-of-organisation.feature

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

When('I click the "Edit bank account" button', () => {

  cy.get('[data-test="buttonIcon.Edit"]')
    .click();

});

Then('the "Edit bank account" modal opens', () => {

  cy.get('section[id^="chakra-modal"]')
    .should('be.visible');

});

Then('the "IBAN" form field is disabled', () => {

  cy.get('[data-test="input.IBAN"]')
    .should('be.disabled');

});

