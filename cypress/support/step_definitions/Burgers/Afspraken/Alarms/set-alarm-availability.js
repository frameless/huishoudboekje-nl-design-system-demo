// cypress/support/step_definitions/Alarms/set-alarm-availability.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

import Generic from "../../../../../pages/Generic";
import Burgers from "../../../../../pages/Burgers";
import BurgerDetails from "../../../../../pages/BurgerDetails";
import AfspraakDetails from "../../../../../pages/AfspraakDetails";
import AlarmModal from "../../../../../pages/AlarmModal";
 
const generic = new Generic()
const burgers = new Burgers()
const burgerDetails = new BurgerDetails()
const afspraakDetails = new AfspraakDetails()
const alarmModal = new AlarmModal()

//#region Scenario: toggle alarm to disabled

Given("an alarm exists", () => {

  Step(this, 'I create a test alarm');

});

Given("an agreement's alarm availability is 'Enabled'", () => {

  // Assert that the alarm availability is displayed
  afspraakDetails.toggleAlarmStatus().should('be.visible');
  afspraakDetails.toggleGetStatusDisabled().should('be.visible');

  // Check success message
  generic.notificationSuccess('Het alarm is opgeslagen');
  
});

When('I disable the alarm', () => {

  // Assert that the alarm availability is displayed and click it
  afspraakDetails.toggleAlarmStatus().should('be.visible')
  afspraakDetails.toggleGetStatusDisabled().should('be.visible').click()
  afspraakDetails.toggleAlarmStatus().should('be.visible')
  
});

Then('the alarm status is "Disabled"', () => {

  // Assert that the alarm is toggled to disabled after click
  afspraakDetails.toggleAlarmStatus().should('be.visible')
  afspraakDetails.toggleGetStatusDisabled().should('not.exist')

  // Check success message
  generic.notificationSuccess('Het alarm is uitgeschakeld');
  
});

//#endregion

//#region Scenario: toggle alarm to enabled

  Given("an agreement's alarm availability is 'Disabled'", () => {
   
    // Toggle the alarm to be disabled
    afspraakDetails.toggleAlarmStatus().should('be.visible');
    afspraakDetails.toggleGetStatusDisabled().should('be.visible').click();

    // Assert that the alarm is disabled
    afspraakDetails.toggleAlarmStatus().should('be.visible');
    afspraakDetails.toggleGetStatusDisabled().should('not.exist');
    
  });
  
  When('I enable the alarm', () => {
  
    // Click the alarm toggle
    afspraakDetails.toggleGetStatusEnabled().click()
    afspraakDetails.toggleAlarmStatus().should('be.visible')
    
  });
  
  Then('the alarm status is "Enabled"', () => {
  
    // Assert that the alarm is toggled to enabled after click
    afspraakDetails.toggleAlarmStatus().should('be.visible')
    afspraakDetails.toggleGetStatusDisabled().should('be.visible')
  
    // Check success message
    generic.notificationSuccess('Het alarm is ingeschakeld');
    
  });
  
  //#endregion