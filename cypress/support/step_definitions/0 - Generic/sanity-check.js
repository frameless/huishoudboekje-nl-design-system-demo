
import { Given, When, Then, Step, DataTable } from "@badeball/cypress-cucumber-preprocessor";
import Burgers from "../../../pages/Burgers";
 
const burgers = new Burgers()

Given('I visit the Burgers page', () => {

  burgers.visit()

});
 
When("I search for {string}", (citizenname) => {

  burgers.search(citizenname)

});

Then('I find the citizen {string}', (citizenname) => {

  burgers.findBurger(citizenname)

});