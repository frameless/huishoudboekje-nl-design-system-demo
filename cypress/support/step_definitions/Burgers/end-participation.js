// cypress/support/step_definitions/Alarms/create-alarm.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";
import Generic from "../../../pages/Generic"
import Burgers from "../../../pages/Burgers"
import BurgerDetails from "../../../pages/BurgerDetails"
import AfspraakDetails from "../../../pages/AfspraakDetails"
import Api from "../../../pages/Api";

const generic = new Generic()
const burgers = new Burgers()
const burgerDetails = new BurgerDetails()
const afspraakDetails = new AfspraakDetails()
const api = new Api()

// Get tomorrow's date
const date = new Date();
const tomorrowUnix = new Date(date.getTime() + 24 * 60 * 60 * 1000);
const tomorrowDate = tomorrowUnix.toLocaleDateString('nl-NL', {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

let citizenId = null;

//#region Scenario: end participation

Given("citizen 'Party Cipator' has multiple agreements", () => {  

    // Create agreements
    burgerDetails.insertAfspraak('Cipator', "Test afspraak 1234", "100.00", 'NL86INGB0002445588', '1',  'true', '2024-01-01');
    burgerDetails.insertAfspraak('Cipator', "Test afspraak 1234", "100.95", 'NL86INGB0002445588', '11',  'false', '2024-01-01');

});

When("I end the participation of 'Party Cipator' tomorrow", () => {

  burgers.openBurger('Party Cipator')
  burgerDetails.getMenu().click();
  burgerDetails.menuEndCitizen().click();

  burgerDetails.endCitizenDateField().type('{selectAll}' + tomorrowDate + '{enter}')
  burgerDetails.endCitizenConfirm().click();
  burgerDetails.endCitizenWarnConfirm().click();

  generic.notificationSuccess('De deelname stopt na');

});

Then("all active agreements have tomorrow as end date", () => {

  // Check end date of agreement 1
  burgers.openBurger('Party Cipator');
  burgerDetails.viewAfspraakByEntry(0);
  generic.containsText('Deze afspraak eindigt op')
  generic.containsText(tomorrowDate)

  // Check end date of agreement 2
  burgers.openBurger('Party Cipator')
  burgerDetails.viewAfspraakByEntry(1);
  generic.containsText('Deze afspraak eindigt op')
  generic.containsText(tomorrowDate)

});

