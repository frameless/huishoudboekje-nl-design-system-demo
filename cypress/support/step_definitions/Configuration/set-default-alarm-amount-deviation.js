
import { Given, When, Then, Step, DataTable } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region - Scenario: save default alarm amount deviation

Given('the "Gemeente Utrecht" department exists', () => {

  cy.contains('Utrecht')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/organisaties/');
  
  // Assert that department is available
  cy.get('p[title="Gemeente Utrecht"]')
    .click();
  cy.url().should('include', '/afdelingen/');  

});

Given('the "Gemeente Utrecht" department has the "Postbus 16200, 3500CE Utrecht" postal address', () => {

  // Assert that postal address is available
  cy.contains('16200');
  cy.contains('3500CE');
  cy.contains('Utrecht');

});

Given('the "Gemeente Utrecht" department has the "NL49BNGH0285171712" IBAN', () => {

  // Assert that bank account is available
  cy.contains('NL49 BNGH 0285 1717 12');

});

Given('the "Gemeente Utrecht" department has the "Gemeente Utrecht Huishoudboekje" account holder name', () => {

  // Assert that bank account is available
  cy.contains('Gemeente Utrecht Huishoudboekje');

});


Given('the "Uitkeringen" classification exists', () => {

  cy.contains('Uitkeringen');

});

Given('the "Add key-value pair form" is displayed', () => {

  cy.get('[data-test="section.parameter"]')
    .should('be.visible');

});

When('I open the "Citizen details" page for the "Carly Padilla" citizen', () => {

  // Navigate to citizen
  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type('Carly');
  cy.contains('Padilla', { timeout: 10000 })
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/burgers/')

});

When('I set the "Partij" option to "Organisatie"', () => {

  cy.get('[data-test="radio.agreementOrganization"]')
    .click();

});

Then('the field {string} is displayed', (field) => {

  cy.contains(field);

});

When('I set the field "Organisatie" to {string}', (input) => {

  // Chop off string for search
  var inputSlice = input.slice(0, input.length - 3);

  cy.get('#organisatie', { timeout: 10000 })
    .type(inputSlice)
  cy.contains(input, { timeout: 10000 })
    .click({ force: true });

});

When('the field "Afdeling" is set to {string}', (input) => {

  cy.get('#afdeling', { timeout: 10000 })
    .contains(input)

});

When('I set the field "Postadres" to {string}', (input) => {

  // Chop off string for search
  var inputSlice = input.slice(0, input.length - 3);

  cy.get('#postadres', { timeout: 10000 })
    .type(inputSlice)
  cy.contains(input, { timeout: 10000 })
    .click({ force: true });

});

When('I set the field "Tegenrekening" to {string}', (input) => {

  cy.get('#tegenrekening', { timeout: 10000 })
    .click()
  cy.contains(input, { timeout: 10000 })
    .click({ force: true });

});

When('I set the field "Rubriek" to {string}', (input) => {

  // Chop off string for search
  var inputSlice = input.slice(0, input.length - 3);

  cy.get('#rubriek', { timeout: 10000 })
    .type(inputSlice)
  cy.contains(input, { timeout: 10000 })
    .click({ force: true });

});

When('I set the field "Omschrijving" to {string}', (input) => {

  cy.get('[data-test="select.agreementIncomeDescription"]', { timeout: 10000 })
    .type(input);

});

When('I set the field "Bedrag" to {string}', (input) => {

  cy.get('[data-test="select.agreementIncomeAmount"]', { timeout: 10000 })
    .type(input);

});

When('I set the field "Startdatum" to {string}', (input) => {

  cy.get('[data-test="input.startDate"]', { timeout: 10000 })
    .type('{selectAll}' + input + '{enter}');

});

Then('the "Toegestane afwijking bedrag" field is set to {string}', (number) => {

  // Check 'Toegestane afwijking bedrag (in euro's)' field  
  cy.get('[data-test="alarmForm.amountMargin"]', { timeout: 10000 })
    .should('have.value', number)

});

//#endregion