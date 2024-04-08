// cypress/support/step_definitions/Alarms/read-alarm-settings.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region Scenario: no alarm exists

  //When('I view the "Agreement" page', () => {});
  // Is already defined in other test

  //Then('the "Er is geen alarm ingesteld." text is displayed', () => {
  // Is already defined in other test

  //Then('the "Add alarm" button is displayed', () => {
  // Is already defined in other test

//#endregion

//#region Scenario: monthly recurring alarm exists

  //When('I view the "Agreement" page', () => {});
  // Is already defined in other test

Given('a monthly recurring alarm exists', () => {

  Step(this, 'I create a test alarm');

});

Then('the alarm recurrency is displayed', () => {
 
  // Check if recurrency is displayed
  cy.contains('Periodiek');
  
});

Then('the alarm day of the month is displayed', () => {

  // Check if day of month is displayed
  cy.contains('op de 1e')

});

Then('the alarm allowed deviation in days is displayed', () => {

  // Check if deviation is displayed
  cy.contains('+1 dag')

});

Then('the alarm next date is displayed', () => {

  // Check if next date is displayed
  cy.contains('Volgende periodieke check')
  cy.contains('03-01-2099')

});

Then('the alarm expected amount is displayed', () => {

  // Check if expected amount is displayed
  cy.contains('Bedrag')
  cy.contains('123,45')

});

Then('the alarm allowed deviation of the expected amount is displayed', () => {

  // Check if allowed deviation of the expected amount is displayed
  cy.contains('+/- € 37,00')

});

Then('the alarm status is displayed', () => {

  // Check whether current status of alarm is displayed
  cy.get('label[class^="chakra-switch"]')
    .should('be.visible')

});

//Then('the "Delete alarm" button is displayed', () => {
// Is already defined in other test

//#endregion