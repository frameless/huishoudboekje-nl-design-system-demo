// cypress/support/step_definitions/Signals/filter-signal-type.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

import Signalen from "../../../../pages/Signalen";
import Bankafschriften from "../../../../pages/Bankafschriften";

const signalen = new Signalen();
const bankafschriften = new Bankafschriften();

// Set database query
const queryTruncateSignal = `mutation Truncate {
  truncateTable(databaseName: "alarmenservice", tableName: "signals")
}`

//#region Scenario: view filter form

Given('a signal with the type "Negatief saldo" exists', () => {

  Step(this, 'I open the citizen overview page for "Dingus Bingus"');
  Step(this, "the citizen's balance is '0,00'");
  Step(this, 'the negative account balance alarm toggle is displayed');
  Step(this, 'an agreement exists for scenario "negative citizen balance"');
  Step(this, 'I select a CAMT test file with negative payment amount "10.01"');
  Step(this, 'the negative amount bank transaction with amount "10,01" is booked to the correct agreement');

  cy.wait(10000);

  Step(this, 'I navigate to the page "/signalen"');
  Step(this, 'the text "Er is een negatief saldo geconstateerd bij Dingus Bingus." is displayed');

});

Given('a signal with the type "Missende betaling" exists', () => {

  Step(this, 'an agreement exists for scenario "no transaction within timeframe"');
  Step(this, 'an alarm exists for scenario "no transaction within timeframe"');
  Step(this, 'the alarm timeframe expires');

  cy.wait(10000);

  Step(this, 'a "Payment missing" signal is created');

});

Given('a signal with the type "Onverwacht bedrag" exists', () => {

  Step(this, 'an agreement exists for scenario "payment amount too low, no amount margin"');
  Step(this, 'an alarm exists for scenario "payment amount too low, no amount margin"');
  Step(this, 'a low amount CAMT test file is created with the amount "9.99"');
  Step(this, 'a low amount bank transaction is booked to an agreement');
  Step(this, 'the low amount bank transaction date is within the alarm timeframe');
  Step(this, 'the low amount bank transaction amount is smaller than the sum of the expected amount minus the allowed amount deviation');

  cy.wait(10000);

  Step(this, 'a "Payment amount too low" signal is created');

});

Given('a signal with the type "Meerdere transacties" exists', () => {

  Step(this, 'an agreement exists for scenario "multiple payments within timeframe"');
  Step(this, 'an alarm exists for scenario "multiple payments within timeframe"');
  Step(this, 'two CAMT test files are created with the same transaction date');
  Step(this, 'both bank transactions are reconciliated on the same agreement');

  cy.wait(10000);

  Step(this, 'a "Multiple payments" signal is created');

});

Then('the filter select "Filter op type" is displayed', () => {

  signalen.filterType().should('be.visible');

});

Then('the filter select "Filter op type" is clicked', () => {

  signalen.filterType().click('right');

});

Given('no type filter is enabled', () => {

  cy.contains('Kies een optie');

});

Then('signals with the text {string} are displayed', (signal) => {

  signalen.notFilterType().contains(signal)

});

//#endregion

//#region Scenario: remove option

Given('all type filters are enabled', () => {

  // Add 'Missende betaling'
  signalen.filterType().click('right');
  cy.wait(500);
  cy.contains('Missende betaling').click();
  cy.wait(500);

  // Add 'Onverwachte transactie'
  signalen.filterType().click('right');
  cy.wait(500);
  cy.contains('Onverwacht bedrag').click();
  cy.wait(500);

  // Add 'Meerdere transacties'
  signalen.filterType().click('right');
  cy.wait(500);
  cy.contains('Meerdere transacties').click();
  cy.wait(500);

  // Add 'Negatief saldo'
  signalen.filterType().click('right');
  cy.wait(500);
  cy.contains('Negatief saldo').click();
  cy.wait(500);

});

When('I click the delete icon for option {string}', (option) => {

  // Remove 'Missende betaling'
  signalen.filterType().click('right');
  signalen.filterType().find('[aria-label="Remove ' + option + '"]').click({ force: true });

});

Then('signals with the text {string} are not displayed', (signal) => {

  signalen.notFilterType().should('not.contain', signal)

});
 
//#endregion

//#region Scenario: add option

Then('I click the delete icon for all options', () => {

  // Remove 'Missende betaling'
  signalen.filterType().click('right');
  signalen.filterType().find('[aria-label="Remove Missende betaling"]').click({ force: true });

  // Remove 'Onverwachte transactie'
  signalen.filterType().click('right');
  signalen.filterType().find('[aria-label="Remove Onverwacht bedrag"]').click({ force: true });

  // Remove 'Meerdere transacties'
  signalen.filterType().click('right');
  signalen.filterType().find('[aria-label="Remove Meerdere transacties"]').click({ force: true });

  // Remove 'Negatief saldo'
  signalen.filterType().click('right');
  signalen.filterType().find('[aria-label="Remove Negatief saldo"]').click({ force: true });

});

Then('none of the signals are displayed', () => {

  Step(this, 'signals with the text "geen transactie gevonden" are not displayed');
  Step(this, 'signals with the text "afwijking" are not displayed');
  Step(this, 'signals with the text "meerdere transacties" are not displayed');
  Step(this, 'signals with the text "negatief saldo" are not displayed');

});
 
When('I select the option {string}', (option) => {

  signalen.filterType().click('right');
  cy.wait(500);
  cy.contains(option).click();
  cy.wait(500);

});

//#endregion
