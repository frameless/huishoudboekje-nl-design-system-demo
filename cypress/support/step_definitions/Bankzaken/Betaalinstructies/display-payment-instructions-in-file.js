
import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

import Generic from "../../../../pages/Generic";
import Betaalinstructies from "../../../../pages/Betaalinstructies";

const generic = new Generic();
const betaalinstructies = new Betaalinstructies();

When('I view the first payment instruction export entry', () => {

  betaalinstructies.buttonViewInstruction(0).click()

});

Then('I am redirected to a payment instruction detail page', () => {

  betaalinstructies.redirectBetaalinstructieDetails()

});

Then('the included payment instructions are displayed', () => {

  // Check if correct info is available
  generic.containsText('Aaron Caronsson')

});