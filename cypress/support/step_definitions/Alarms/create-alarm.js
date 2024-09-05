// cypress/support/step_definitions/Alarms/create-alarm.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";
import Generic from "../../../pages/Generic";
import Burgers from "../../../pages/Burgers";
import BurgerDetails from "../../../pages/BurgerDetails";
import AfspraakDetails from "../../../pages/AfspraakDetails";
import AlarmModal from "../../../pages/AlarmModal";
 
const generic = new Generic()
const burgers = new Burgers()
const burgerDetails = new BurgerDetails()
const afspraakDetails = new AfspraakDetails()
const alarmModal = new AlarmModal()


//#region Scenario: create monthly alarm with basic options

Given("I view a citizen's agreement", () => {

  // Navigate to burger details page of test user
  burgers.openBurger('Dingus Bingus')

  // Open afspraak
  burgerDetails.viewLatestAfspraak()

});

When("I click the button 'Toevoegen' in the alarm section", () => {

  afspraakDetails.buttonAlarmToevoegen().click();

});

Then("I submit valid information in the modal's fields", () => {

  alarmModal.createMonthlyAlarm()

});

Then('the created alarm is displayed', () => {

  afspraakDetails.getAlarm()

});

