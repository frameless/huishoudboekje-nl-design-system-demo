
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

When('I visit the baseUrl', () => {

  cy.visit('/')

});
 
Then('I am actually on the baseUrl', () => {

  cy.visit('/')
  cy.url().should('include', Cypress.config().baseUrl)
 
});
