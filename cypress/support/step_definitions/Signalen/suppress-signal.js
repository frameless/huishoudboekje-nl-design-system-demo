// cypress/support/step_definitions/Signals/suppress-signal.js

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";


//#region Scenario: active signals exist

//Given('1 or more active signals exist', () => {});
  // Part of list-signals.feature

//When('I view the "Signals" page', () => {});
  // Part of list-signals.feature

Then('I enable the active signals filter', () => {

  cy.get('[data-test="checkbox.signalActive"]')
    .should('have.attr', 'data-checked');

});

Then('I disable the suppressed signals filter', () => {

  cy.get('[data-test="checkbox.signalInactive"]')
    .should('not.have.attr', 'data-checked');

});

Then('I click the "Suppress signal" button of a signal', () => {

  // Suppress active signal from previous test
  cy.get('[data-test="signal.switchActive"]')
    .click();

});

Then('that signal is closed', () => {

  // Make sure signal has disappeared
  cy.get('[data-test="signal.badgeActive"]')
    .should('not.exist')

});

//#endregion
