import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";


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

