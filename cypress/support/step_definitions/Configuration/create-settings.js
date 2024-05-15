
import { Given, When, Then, Step, DataTable } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region - Scenario: view add key-value pair form

Then('the field "Sleutel" is marked as required', () => {

  cy.get('[data-test="input.Sleutel"]')
    .should('have.attr', 'aria-required')
    .should('eq', 'true');

});

Then('the field "Sleutel" is empty', () => {

  cy.get('[data-test="input.Sleutel"]')
    .should('have.attr', 'value')
    .should('eq', '');

});

Then('the field "Waarde" is marked as required', () => {

  cy.get('[data-test="input.Waarde"]')
    .should('have.attr', 'aria-required')
    .should('eq', 'true');

});

Then('the field "Waarde" is empty', () => {

  cy.get('[data-test="input.Waarde"]')
    .should('have.attr', 'value')
    .should('eq', '');

});

When('the button "Opslaan" is displayed in the section with the header "Parameters"', () => {

  cy.get('[data-test="button.parameterSubmit"]')
    .should('be.visible');

});


//#endregion

//#region - Scenario: save key-value pair

When('I set the field "Sleutel" to {string}', (string) => {

  cy.get('[data-test="input.Sleutel"]')
    .type('{selectAll}' + string);

});

When('I set the field "Waarde" to {string}', (string) => {

  cy.get('[data-test="input.Waarde"]')
    .type('{selectAll}' + string);

});

When('I click the button "Opslaan" in the section with the header "Parameters"', () => {

  cy.get('[data-test="button.parameterSubmit"]')
    .click();

});

Then('the button "Wijzigen" is displayed for the key {string}', (string) => {

  cy.contains(string)
    .parent()
    .find('[data-test="button.Edit"]')
    .should('be.visible');

});

Then('the button "Verwijderen" is displayed for the key {string}', (string) => {

  cy.contains(string)
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible');

});

//#endregion