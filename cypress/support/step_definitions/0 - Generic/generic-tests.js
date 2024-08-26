// cypress/support/step_definitions/Generic/generic-tests.js

import { When, Then, Given, Before, BeforeAll, After, AfterAll } from "@badeball/cypress-cucumber-preprocessor";
import Generic from "../../../pages/Generic";
import Api from "../../../pages/Api";
import Burgers from "../../../pages/Burgers";
import BurgerDetails from "../../../pages/BurgerDetails";
import AfspraakDetails from "../../../pages/AfspraakDetails";
import AlarmModal from "../../../pages/AlarmModal";
 
const generic = new Generic()
const api = new Api()
const burgers = new Burgers()
const burgerDetails = new BurgerDetails()
const afspraakDetails = new AfspraakDetails()
const alarmModal = new AlarmModal()

let cookieAppSession = '';
let cookieAppToken = '';

const login = (name) => {
  cy.session(
    'session',
    () => {
      
      // Log in
      cy.visit('/')
      cy.wait(500);
      cy.get('body').then(($body) => {
        const buttonLogin = $body.find('button[type="submit"]')
        if (buttonLogin.length) {
          cy.get('[data-test="button.Login"]').click()
          //cy.get('button').contains('Inloggen').click()
          cy.loginToAAD(Cypress.env('aad_username'), Cypress.env('aad_password'))
          
          // Save cookie
          cy.getCookie('appSession').then((c) => {
            cookieAppSession = c;
            console.log('Saved cookie appSession: ' + cookieAppSession)
          })

          // Save cookie
          cy.getCookie('app-token').then((c) => {
            cookieAppToken = c;
            console.log('Saved cookie app-token: ' + cookieAppToken)
          })
        }
      })
    },
    {
      validate() {
        cy.visit('/')
        cy.contains(`${Cypress.env('aad_username')}`, {timeout: 10000});
      },
      cacheAcrossSpecs: true,
    }
  )
}

BeforeAll({ order: 1 }, function () {
  
  cy.visit('/');
  Cypress.Cookies.debug(true)
  cy.url().then((url) => {

    if (url.includes("localhost"))
    {
      // do nothing
      console.log('url includes "localhost", so no cookies should be set.')
    }
    else
    {
      login()
    }

  });

});

BeforeAll({ order: 2 },function () {
// This hook will be executed once at the start of a feature.

  // // Delete the test citizen if it exists
  // cy.request({
  //   method: "post",
  //   url: Cypress.config().baseUrl + '/apiV2/graphql',
  //   body: { query: `query citizenSearch {
  //     burgers(search: "Bingus") {
  //       id
  //     }
  //   }` },
  // }).then((res) => {
  //   citizenName = res.body.data.burgers;
  //   cy.log(citizenName);
  //   if (citizenName.length != 0)
  //   {
  //     api.deleteTestBurger()
  //   }
  //   else
  //   {
  //     // Test citizen does not exist
  //     // Do nothing
  //   }

  // })
  
});

BeforeAll({ order: 3 },function () {

  api.createTestBurger()
  api.createTestBurgerABCDEFGHIJZ()

});

Before({ order: 1 },function () {

  cy.visit('/');
  Cypress.Cookies.debug(true)
  cy.url().then((url) => {
    
    if (url.includes("localhost"))
    {
      // do nothing
      console.log('url includes "localhost", so no cookies should be set.')
    }
    else
    {
      login()
    }

  });

});

AfterAll({ order: 1 },function () {
// This hook will be executed once at the end of a feature.
  
  api.deleteTestBurger()
  api.deleteTestBurgerABCDEFGHIJZ()

  // Clean up
  api.truncateAlarms()
  api.truncateSignals()
  api.truncatePaymentrecords()
  api.truncateBankTransactions()

});

// Truncate tables
When('I truncate the alarms table in alarmenservice', () => {

  api.truncateAlarms()

});

When('I truncate the signals table in alarmenservice', () => {

  api.truncateSignals()

});

When('I truncate the bank transaction tables', () => {

  api.truncateBankTransactions()

});

// Navigate to a page
When('I navigate to the page {string}', (url) => {

  cy.visit(url)
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

  generic.containsText(text);

});

// Click text
Then('the text {string} is clicked', (text) => {

  cy.contains(text)
    .click();

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

  generic.notContainsText(text);

});

// Find a generic success message
Then('a notification of success is displayed', () => {

  // Assertion
  cy.get('[data-status="success"]', { timeout: 30000 })
    .scrollIntoView()
    .should('be.visible');

  // Make sure notification has disappeared from view
  cy.get('[data-status="success"]', { timeout: 10000 })
    .should('not.exist');

});

// Find a specific success message
Then('a success notification containing {string} is displayed', (notificationText) => {

  generic.notificationSuccess(notificationText)

});

// Find a specific error message
Then('an error notification containing {string} is displayed', (notificationText) => {

  generic.notificationError(notificationText)

});

Then('I wait one minute', () => {

  cy.wait(60000);

});

// Confirm that a specific citizen exists
Given('the {string} citizen exists', (fullName) => {

  // Function that splits last name from other names
  function lastName(fullName) {
    var n = fullName.split(" ");
    return n[n.length - 1];
  }

  searchTerm = lastName(fullName)

  // Search for citizen
  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type(searchTerm);
  cy.get('[data-test="citizen.tile"]', { timeout: 30000 })
    .should('be.visible')

});

// Alarm modal is available
Then('the "Add alarm" modal is displayed', () => {

  // Assertion
  cy.get('[data-test="modal.Alarm"]', { timeout: 10000 })
    .should('be.visible');

});

// Navigate to the test citizen's page
When('I open the citizen overview page for {string}', (fullName) => {

  // Function that splits last name from other names
  function lastName(fullName) {
    var n = fullName.split(" ");
    return n[n.length - 1];
  }

  searchTerm = lastName(fullName)

  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type(searchTerm);
  cy.get('[data-test="citizen.tile"]', { timeout: 30000 })
    .should('be.visible')
    .first()
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/burgers/')

});
