
import { Given, When, Then, Step, DataTable } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

When('I visit the baseUrl', () => {

  cy.visit('/')

});
 
Then('I am actually on the baseUrl', () => {

  Step(this, 'I visit the baseUrl');
  
  cy.url().should('include', Cypress.config().baseUrl)
 
});

// ---------------

Given('I visit the Burgers page', () => {

  cy.visit('/burgers')

});

When("I fill {string} in search", (citizenname) => {

  cy.get('[placeholder="Zoeken"]')
    .type(citizenname);

});

Then('I find the citizen {string}', (citizenname) => {

  cy.contains(citizenname)

});

// ---------------