// cypress/support/step_definitions/Generic/generic-tests.js

import { Before, After, When, Step } from "@badeball/cypress-cucumber-preprocessor";

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
  Step(this, 'I truncate the alarms table in alarmenservice');
  Step(this, 'I truncate the signals table in alarmenservice');
  Step(this, 'I truncate the bank transaction tables');
  
});
