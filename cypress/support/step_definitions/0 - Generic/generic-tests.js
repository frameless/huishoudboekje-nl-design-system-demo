// cypress/support/step_definitions/Generic/generic-tests.js

import { Before, After } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

// Before *each* test, run this (so this runs equal to the amount of tests)
Before(function () {
  cy.visit('/');
  cy.getCookie('appSession').then((c) => {
    const cookie = c
    if(c) {
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