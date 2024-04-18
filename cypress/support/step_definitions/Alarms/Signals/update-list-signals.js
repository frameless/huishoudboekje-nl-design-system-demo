// cypress/support/step_definitions/Signals/update-list-signals.js

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region Scenario: view signals refresh timestamp

//When('I view the "Signals" page', () => {});
  // Part of list-signals.feature

Then('the signals refresh timestamp is displayed', () => {

  // Skip unfinished test
  return "pending";

});

Then('the "Refresh signals" button is displayed', () => {

  // Skip unfinished test
  return "pending";

});

//#endregion

//#region Scenario: automatically refresh signals

//When('I view the "Signals" page', () => {});
  // Part of list-signals.feature

  Then('5 minutes pass', () => {

    //cy.wait(300000)
    return "pending";
  
  });
  
  Then('the "Signals" page is refreshed', () => {
  
    // Skip unfinished test
    return "pending";
  
  });

  //Then('the signals refresh timestamp is displayed', () => {});
    // Part of previous scenario
  
  //#endregion

  //#region Scenario: manually refresh signals

//When('I view the "Signals" page', () => {});
  // Part of list-signals.feature

  Then('I click the "Refresh signals" button', () => {

    // Skip unfinished test
    return "pending";
  
  });
  
  //Then('the "Signals" page is refreshed', () => {});
    // Part of previous scenario

  //Then('the signals refresh timestamp is displayed', () => {});
    // Part of previous scenario
  
  //#endregion
