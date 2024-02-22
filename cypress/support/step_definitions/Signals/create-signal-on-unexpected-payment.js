// cypress/support/step_definitions/Signals/create-signal-on-unexpected-payment.js

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region Scenario: payment amount too high

When('a bank transaction is booked to an agreement', () => {

  // Skip unfinished test
 
});

Then('the bank transaction date is within the alarm timeframe', () => {

  // Skip unfinished test
 
});

Then('the bank transaction amount is greater than the sum of the expected amount plus the allowed amount deviation', () => {

  // Skip unfinished test
 
});

Then('a "Payment amount too high" signal is created', () => {

  // Skip unfinished test
 
});

//#endregion

//#region Scenario: payment amount too low

//When('a bank transaction is booked to an agreement', () => {});
  // Part of previous scenario

//Then('the bank transaction date is within the alarm timeframe', () => {});
  // Part of previous scenario

Then('the bank transaction amount is smaller than the sum of the expected amount minus the allowed amount deviation', () => {

  // Skip unfinished test
 
});

Then('a "Payment amount too low" signal is created', () => {

  // Skip unfinished test
 
});

//#endregion

//#region Scenario: expected payment amount

//When('a bank transaction is booked to an agreement', () => {});
  // Part of previous scenario

//Then('the bank transaction date is within the alarm timeframe', () => {});
  // Part of previous scenario

  Then('the bank transaction amount is smaller than the sum of the expected amount plus the allowed amount deviation or greater than the sum of the expected amount minus the allowed amount deviation', () => {

    // Skip unfinished test
   
  });
  
  Then('no signal is created', () => {
  
    // Skip unfinished test
   
  });
  
  //#endregion
