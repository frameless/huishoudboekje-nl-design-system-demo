
import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

const dayjs = require('dayjs');

const modalWait = 4000;

//region: Scenario: organisation and bank account are not used for reconciliation

Given('the "Belastingdienst Toeslagen Kantoor Utrecht" organisation exists', () => {

  cy.visit('/organisaties')
  cy.url().should('eq', Cypress.config().baseUrl + '/organisaties')

  // Type into search bar
  cy.get('input[placeholder="Zoeken"]')
    .type('Belastingdienst Toeslagen Kantoor Utrecht')
  
  // Assertion
  cy.get('p[title="Belastingdienst Toeslagen Kantoor Utrecht"]')
    .should('be.visible')

});

Given('the "Belastingdienst Toeslagen Kantoor Utrecht" department exists', () => {

  cy.get('p[title="Belastingdienst Toeslagen Kantoor Utrecht"]')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/organisaties/')

  // Assertion
  cy.get('p[title="Belastingdienst Toeslagen Kantoor Utrecht"]')
    .should('be.visible')

});

Given('the "NL86INGB0002445588" bank account exists', () => {

  cy.get('p[title="Belastingdienst Toeslagen Kantoor Utrecht"]')
    .click();
  cy.url().should('include', '/afdelingen/')

  // Assertion
  cy.contains('NL86 INGB 0002 4455 88')

});

Given('an agreement link to the department and the bank account exists', () => {

  // Navigate to civilian page
  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type('Fien');
  cy.contains('Sandra de Jager', { timeout: 10000 })
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/burgers/')

  // Assertion 1
  cy.contains('Belastingdienst Toeslagen Kantoor Utrecht ')

  // Navigate to agreement detail page
  cy.contains('Voorschot kindgebonden budget')
    .parent()
    .parent()
    .find('a[aria-label="Bekijken"]:visible')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/afspraken/')

  // Assertion 2
  cy.contains('NL86 INGB 0002 4455 88');

});

Given('the "UWV Utrecht" organisation exists', () => {

  cy.visit('/organisaties')
  cy.url().should('eq', Cypress.config().baseUrl + '/organisaties')

  // Type into search bar
  cy.get('input[placeholder="Zoeken"]')
    .type('UWV Utrecht')
  
  // Assertion
  cy.get('p[title="UWV Utrecht"]')
    .should('be.visible')

});

Given('I view the "UWV Utrecht" organisation', () => {
  
  cy.get('p[title="UWV Utrecht"]')
    .click();

  // Assertion
  cy.url().should('include', Cypress.config().baseUrl + '/organisaties/');
  cy.get('h2')
    .contains('UWV Utrecht')
    .should('be.visible');

});

When('I click the "Add department" button', () => {
    
  cy.get('[data-test="button.addDepartment"]')
    .click()
    .waitForReact();

});

Then('the "Add department" modal is displayed', () => {
   
  // Assertion
  cy.get('header[id^="chakra-modal"]')
    .should('be.visible');

});

When('I input the name "Meervoudig gebruik IBAN"', () => {
  
  // Assertion
  cy.get('input')
    .type('Meervoudig gebruik IBAN');

});

When('I click the "Save" button', () => {

  // Assertion
  cy.get('button[type="submit"]')
    .click();

});

When('I click the "Meervoudig gebruik IBAN" department', () => {

  // Assertion
  cy.contains('Meervoudig gebruik IBAN')
    .click();

});

When('I click the "Add bank account" button', () => {

  // Assertion
  cy.get('[data-test="button.addBankAccountModal"]')
    .click();

});

Then('I view the "Add bank account" modal', () => {

  // Assertion
  cy.get('header[id^="chakra-modal"]')
    .should('be.visible');

});

When('I input the IBAN "NL86INGB0002445588"', () => {

  // Fill in IBAN
  cy.get('input[id="iban"]')
    .type('NL86INGB0002445588');

});

When('I click the "Delete bank account" button', () => {

  cy.get('[data-test="buttonIcon.Delete"]')
    .click();

});

Then('the "Delete bank account" modal is displayed', () => {

  // Assertion
  cy.get('header[id^="chakra-modal"]', { timeout: 10000 })
    .should('be.visible');

});

When('I click the "Delete" button', () => {

  cy.get('[data-test="button.Delete"]')
    .click();

});

//endregion

//region: Scenario: organisation and bank account are used for reconciliation

Given('I view the "Belastingdienst Toeslagen Kantoor Utrecht" organisation', () => {

  Step(this, 'the "Belastingdienst Toeslagen Kantoor Utrecht" organisation exists');
    
  cy.get('p[title="Belastingdienst Toeslagen Kantoor Utrecht"]')
    .click();

  // Assertion
  cy.url().should('include', Cypress.config().baseUrl + '/organisaties/');
  cy.get('h2')
    .contains('Belastingdienst Toeslagen Kantoor Utrecht')
    .should('be.visible');

});

When('I click the "Belastingdienst Toeslagen Kantoor Utrecht" department', () => {
  
  cy.get('p[title="Belastingdienst Toeslagen Kantoor Utrecht"]')
    .click();

  // Assertion
  cy.url().should('include', Cypress.config().baseUrl + '/organisaties/');
  cy.get('h2')
    .contains('Belastingdienst Toeslagen Kantoor Utrecht')
    .should('be.visible');

});

When('I click the "Delete bank account" button of IBAN "NL86INGB0002445588"', () => {

  // Find and click the 'Delete' button
  cy.get('span').contains('NL86 INGB 0002 4455 88')
    .parent()
    .next()
    .find('[data-test="buttonIcon.Delete"]')
    .click();

});


//endregion