// cypress/support/step_definitions/Generic/generic-tests.js

import {When, Then, Given, Before, After} from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

// Before *each* test, run this (so this runs equal to the amount of tests)
Before({ order: 1 }, function () {
  cy.visit('/');
  cy.getCookie('appSession').then((c) => {
    const cookie = c
    if (c) {
      // If there is a cookie, do this
    }
    else {
      // If no cookie, log in
      // Log in
      cy.wait(500);
      cy.get('body').then(($body) => {
        const buttonLogin = $body.find('button[type="submit"]')
        if (buttonLogin.length) {
          cy.get('[data-test="button.Login"]').click()
          //cy.get('button').contains('Inloggen').click()
          cy.loginToAAD(Cypress.env('aad_username'), Cypress.env('aad_password'))
        }
        else {
          // Already logged in; do nothing
        }

      })

    }

  })

});

// Navigate to a page
When('I navigate to the page {string}', (url) => {

  cy.visit(url)
  cy.wait(500);
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + url)

});

// Find a button
Then('the button {string} is displayed', (buttonName) => {

  cy.get('button')
    .contains(buttonName)

});

// Click a button
When('I click the button {string}', (buttonName) => {

  cy.get('button')
    .contains(buttonName)
    .click();

});

// Find text
Then('the text {string} is displayed', (text) => {

  cy.contains(text);

});

// Find a field label
Then('the label {string} is displayed', (labelName) => {

  cy.get('label')
    .contains(labelName);

});

Then('the label {string} is marked as required', (labelName) => {

  cy.get('label')
    .contains(labelName)
    .children('span')
    .contains('*');

});

// Make sure text is not displayed on page
Then('the text {string} is not displayed', (text) => {

  cy.wait(1000);
  cy.get('body')
    .should('not.contain', text);

});

// Find a specific success message
Then('a success notification containing {string} is displayed', (notificationText) => {

  // Assertion
  cy.get('[data-status="success"]')
    .contains(notificationText)
    .should('be.visible');

});

// Find a specific error message
Then('an error notification containing {string} is displayed', (notificationText) => {

  // Assertion
  cy.get('[data-status="error"]')
    .contains(notificationText)
    .should('be.visible')

});

// Confirm that a specific citizen exists
Given('the {string} citizen exists', (citizen) => {

  // Chop off string for search
  var citizenChop = citizen.slice(0, citizen.length - 8);

  // Search for citizen
  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type(citizenChop);
  cy.waitForReact();
  cy.contains(citizen)

});

// Alarm modal is available
Then('the "Add alarm" modal is displayed', () => {

  // Assertion
  cy.get('[data-test="modal.Alarm"]')
    .should('be.visible');

});
