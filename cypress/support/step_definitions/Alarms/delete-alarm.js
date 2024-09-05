// cypress/support/step_definitions/Alarms/delete-alarm.js

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


Given('an alarm exists for this agreement', () => {
  
  // Navigate
  burgers.openBurger('Dingus Bingus')
  burgerDetails.viewLatestAfspraak()

  // Create an alarm
  afspraakDetails.buttonAlarmToevoegen().click()
  alarmModal.createMonthlyAlarm()
  
});

When('I delete the alarm', () => {
  
  // Click to delete
  afspraakDetails.buttonDeleteAlarm().click()

  // Click to confirm
  afspraakDetails.buttonDeleteAlarm().click()
  generic.notificationSuccess('Het alarm is verwijderd')
  
});

Then('the alarm is removed', () => {
 
  generic.containsText('Er is geen alarm ingesteld')
    
});
