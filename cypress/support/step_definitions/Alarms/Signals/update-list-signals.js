// cypress/support/step_definitions/Signals/update-list-signals.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

let timestamp = 0;
let timestampLater1 = 0;
let timestampLater2 = 0;

//#region Scenario: view signals refresh timestamp

//When('I view the "Signals" page', () => {});
  // Part of list-signals.feature

Then('the signals refresh timestamp is displayed', () => {

  cy.contains('Laatste update:')
    .eq(0)
    .invoke('text')
    .then((text) => {
      timestamp = text.split(':')[1] + ":" + text.split(':')[2];
      timestampLater1 = timestamp;
      timestampLater2 = timestamp;
      cy.log(timestamp);
    })

});

Then('the "Refresh signals" button is displayed', () => {

  cy.get('[data-test="button.reload"]')
    .should('be.visible');

});

//#endregion

//#region Scenario: automatically refresh signals

//When('I view the "Signals" page', () => {});
  // Part of list-signals.feature

  Then('5 minutes pass', () => {

    cy.wait(300000)
  
  });
  
  Then('the "Signals" page is automatically refreshed', () => {
  
    cy.contains('Laatste update:')
      .eq(0)
      .invoke('text')
      .then((text) => {
        timestampLater2 = text.split(':')[1] + ":" + text.split(':')[2];
        cy.log(timestampLater2);
      })

    expect(timestampLater2).not.to.equal(timestamp);
  
  });
  
  //#endregion

  //#region Scenario: manually refresh signals

//When('I view the "Signals" page', () => {});
  // Part of list-signals.feature

  Then('I click the "Refresh signals" button', () => {

    cy.get('[data-test="button.reload"]')
      .click();
  
  });
  
  Then('the "Signals" page is refreshed', () => {
  
    cy.contains('Laatste update:')
    .eq(0)
    .invoke('text')
    .then((text) => {
      timestampLater1 = text.split(':')[1] + ":" + text.split(':')[2];
      cy.log(timestampLater1);
    })
  
  });

  //Then('the signals refresh timestamp is displayed', () => {});
    // Part of previous scenario
  
  //#endregion
