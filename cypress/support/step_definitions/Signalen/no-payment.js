// cypress/support/step_definitions/Signals/create-signal-on-no-payment.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

import Generic from "../../../pages/Generic";
import Burgers from "../../../pages/Burgers";
import BurgersDetails from "../../../pages/BurgerDetails";
import AfspraakDetails from "../../../pages/AfspraakDetails";

const generic = new Generic()
const burgers = new Burgers();
const burgerDetails = new BurgersDetails();
const afspraakDetails = new AfspraakDetails()

// Unique names
const uniqueSeed = Date.now().toString();

// Set database query
const queryTruncateAlarm = `mutation Truncate {
  truncateTable(databaseName: "alarmenservice", tableName: "alarms")
}`

const queryAddAlarm = `mutation CreateAlarm {
  createAlarm(input: {alarm:{
    uuid: "1d4eb9dc-7d20-4f8a-9e6d-68dd5bd0a4a9",
    isActive: true,
    dateMargin: 1,
    amount: 1000,
    amountMargin: 0,
    startDate: "1704106800",
    checkOnDate: "1704193200",
    type: 3,
    recurringMonths: [],
    recurringDayOfMonth: [],
    recurringDay: []
  }})
  {
    alarm{
      uuid
    }
   }
  
  updateAfsprakenById(input: {
    id: 1,
    afsprakenPatch: {
      alarmId: "1d4eb9dc-7d20-4f8a-9e6d-68dd5bd0a4a9"
    }
  }){
    afspraken{
      alarmUuid
    }
  }
}`

const evaluateAlarms = "sh cypress/pipeline/evaluate-alarms.sh"

//#region Scenario: no transaction within timeframe

Given('an agreement exists for scenario "no transaction within timeframe"', () => {
  
  // Create agreements
  burgerDetails.insertAfspraak('Bingus', uniqueSeed, "10.00", 'NL86INGB0002445588', '5', 'false', '2024-01-01');

  // View burger detail page
  burgers.openBurger('Dingus Bingus')
  burgerDetails.viewAfspraak(uniqueSeed)

});

Given('an alarm exists for scenario "no transaction within timeframe"', () => {

 // afspraakDetails.insertAlarm(uniqueSeed, "1", "1000", "0");

  cy.url().should('include', Cypress.config().baseUrl + '/afspraken/')
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  
  afspraakDetails.buttonAlarmToevoegen().click()

  // Check whether modal is opened and visible
  cy.get('section[aria-modal="true"]', { timeout: 10000 })
    .scrollIntoView()
    .should('exist');

  // Set alarm to 'eenmalig'
  cy.contains('Meer opties')
    .click();
  cy.get('[data-test="alarmForm.once"]')
    .click();

  // Fill in all required fields
      // 'Datum verwachte betaling'

      cy.get('[data-test="alarmForm.expectedDate"]')
        .type('{selectAll}01-01-2024{enter}')
        .should('have.value', '01-01-2024')

      // 'Toegestane afwijking (in dagen)'
      cy.get('[data-test="alarmForm.dateMargin"]')
        .type('1')
        .should('have.value', '1')

      // 'Toegestane afwijking bedrag'
      cy.get('[data-test="alarmForm.amountMargin"]')
        .type('{selectAll}0')
        .should('have.value', '0')

  // Click 'Opslaan' button
  cy.get('[data-test="buttonModal.submit"]')
    .click()

  // Check whether modal is closed
  cy.get('section[aria-modal="true"]', { timeout: 10000 })
    .should('not.exist');

  // Success notification
  generic.notificationSuccess('Het alarm is opgeslagen.');

});

When('the alarm timeframe expires', () => {

  // If local
  cy.visit('/');
  cy.getCookie('appSession').then((c) => {
    const cookie = c
    if(c) {
      // If there is a cookie, do this
      cy.exec(evaluateAlarms).then((result) => {
        cy.log(result.stdout);
        cy.log(result.stderr);
      })
    }
    else {
      // If no cookie, refresh alarms to trigger timeframe expiration evaluation
      cy.exec('docker-compose run evaluate-alarms').then((result) => {
        cy.log(result.stderr);
      })
    }

  // Wait for alarm evaluation to complete
  cy.wait(10000);

  })

});

Then('a "Payment missing" signal is created', () => {

  // Refresh alarms to trigger timeframe expiration evaluation
  cy.visit('/signalen')
  cy.url().should('eq', Cypress.config().baseUrl + '/signalen')

  // Assertion
  cy.contains('geen transactie gevonden');
  cy.contains(uniqueSeed);
  cy.contains('Dingus Bingus');
 
});

//#endregion
