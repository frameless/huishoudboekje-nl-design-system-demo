// cypress/support/step_definitions/Alarms/create-alarm.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

import Generic from "../../../../../pages/Generic";
import Burgers from "../../../../../pages/Burgers";
import BurgerDetails from "../../../../../pages/BurgerDetails";
import AfspraakDetails from "../../../../../pages/AfspraakDetails";
import AlarmModal from "../../../../../pages/AlarmModal";
import Signalen from "../../../../../pages/Signalen";
import Bankafschriften from "../../../../../pages/Bankafschriften";
 
const generic = new Generic()
const burgers = new Burgers()
const burgerDetails = new BurgerDetails()
const afspraakDetails = new AfspraakDetails()
const alarmModal = new AlarmModal()
const signalen = new Signalen()
const bankafschriften = new Bankafschriften()

//#region Scenario: view toggle form

Then('the negative account balance alarm toggle is displayed', () => {

  generic.containsText('Alarm bij negatief saldo');
  burgerDetails.toggleNegativeBalance().should('be.visible');
  burgerDetails.sectionBalance().find('label[data-checked]').should('be.visible');

});

//#endregion

//#region Scenario: disable toggle

When('I disable the negative account balance alarm', () => {

  // Given the account balance is 0,00
  burgerDetails.balance().contains('€ 0,00');

  // Toggle
  burgerDetails.toggleNegativeBalanceEnabled().click()
  burgerDetails.toggleNegativeBalanceDisabled().should('be.visible')

  // Wait for switch track to process toggle
  cy.wait(500);

});

Then('no negative balance signal is created', () => {

  signalen.visit();
  generic.containsText('Er zijn geen signalen gevonden');

});

//#endregion

//#region Scenario: enable toggle

When('I enable the negative account balance alarm', () => {

  // Given the account balance is 0,00
  burgerDetails.balance().contains('€ 0,00');

  // Toggle
  burgerDetails.toggleNegativeBalanceEnabled().click()
  burgerDetails.toggleNegativeBalanceDisabled().should('be.visible')

  // Wait for switch track to process toggle
  cy.wait(500);

});

When('I consolidate a negative amount bank transaction to the agreement', () => {

  // Create agreement
  burgerDetails.insertAfspraak('Bingus', 'Loon', "10.00", 'NL86INGB0002445588', '5', 'false', '2024-01-01');

  bankafschriften.consolidateNegativeAmount('10.00');
    
});


Then('a negative balance signal is created', () => {
  
  signalen.visit();
  generic.containsText('Er is een negatief saldo geconstateerd');

});

//#endregion
