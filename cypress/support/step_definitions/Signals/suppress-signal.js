// cypress/support/step_definitions/Signals/suppress-signal.js

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region Scenario: active signals exist

//Given('1 or more active signals exist', () => {});
  // Part of list-signals.feature

//When('I view the "Signals" page', () => {});
  // Part of list-signals.feature

Then('I enable the active signals filter', () => {

  // Skip unfinished test
  return "pending";

});

Then('I disable the suppressed signals filter', () => {

  // Skip unfinished test
  return "pending";

});

Then('I click the "Suppress signal" button of a signal', () => {

  // Skip unfinished test
  return "pending";

});

Then('that signal is closed', () => {

  // Skip unfinished test
  return "pending";

});

//#endregion
