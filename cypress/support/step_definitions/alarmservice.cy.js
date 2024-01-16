// cypress/support/step_definitions/alarmservice.cy.js

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region Scenario: display no alarm set

When('I open the agreements page', () => {
 
  // Navigate to /burgers
  cy.visit('/');
  cy.url().should('eq', Cypress.config().baseUrl + '/huishoudens')
  cy.get('[href="/burgers"] > .css-fvrbn7 > .chakra-text')
    .click()
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')

  // Navigate to first displayed cilivian's detail page
  cy.get('.css-1ybnofw > :nth-child(2) > .chakra-stack')
    .click()
  cy.url().should('contains', Cypress.config().baseUrl + '/burgers/')

  // Navigate to first displayed agreement's detail page
  cy.get(':nth-child(5) > .chakra-button')
    .click()
  cy.url().should('contains', Cypress.config().baseUrl + '/afspraken/')
  cy.get(':nth-child(6) > .css-1uvkty4 > .css-1bef4uc > .do-not-print > .chakra-heading')
    .scrollIntoView() // Scrolls 'Alarm' into view
  
});

Then('the text "Er is geen alarm ingesteld." is displayed', () => {

  // Quick check of button element
  cy.visit('/afspraken/1');
  cy.url().should('eq', Cypress.config().baseUrl + '/afspraken/1')
  cy.get(':nth-child(6) > .css-1uvkty4 > .css-1bef4uc > .do-not-print > .chakra-heading')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.contains('Er is geen alarm ingesteld.')

});

Then('a button with label "Toevoegen" is displayed', () => {
  
  // Quick check of button element
  cy.visit('/afspraken/1');
  cy.url().should('eq', Cypress.config().baseUrl + '/afspraken/1')
  cy.get(':nth-child(6) > .css-1uvkty4 > .css-1bef4uc > .do-not-print > .chakra-heading')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.get('.css-1loywkv > :nth-child(1) > .chakra-stack > div.css-0 > .chakra-button')
  cy.contains('Toevoegen')

});

//#endregion
