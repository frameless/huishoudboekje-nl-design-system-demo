// cypress/support/step_definitions/Alarms/read-alarm-settings.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";
import AfspraakDetails from "../../../../../pages/AfspraakDetails";
 
const afspraakDetails = new AfspraakDetails()


//Given('an alarm exists for this agreement', () => {});
// Is already defined in test delete-alarm

Then('the details are displayed', () => {

  afspraakDetails.readAlarm()

});