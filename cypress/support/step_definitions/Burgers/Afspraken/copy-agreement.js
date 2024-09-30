import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";
import Generic from "../../../../pages/Generic";
import Burgers from "../../../../pages/Burgers";
import BurgerDetails from "../../../../pages/BurgerDetails";
import AfspraakDetails from "../../../../pages/AfspraakDetails";
import AlarmModal from "../../../../pages/AlarmModal";
 
const generic = new Generic()
const burgers = new Burgers()
const burgerDetails = new BurgerDetails()
const afspraakDetails = new AfspraakDetails()
const alarmModal = new AlarmModal()

let uniqueId = Date.now().toString();
let uniqueTerm1 = Date.now().toString() + 1;
let uniqueTerm2 = Date.now().toString() + 2;

//#region Scenario: copy an active agreement

When("I add search terms to the agreement", () => {

  // Create afspraak
  burgerDetails.insertAfspraak('Bingus', uniqueId, "10.00", 'NL86INGB0002445588', '1', 'true', '2024-01-01');

  // View burger detail page
  burgers.openBurger('Dingus Bingus')
  burgerDetails.viewAfspraak(uniqueId)

  afspraakDetails.inputZoektermen().type(uniqueTerm1);
  afspraakDetails.buttonZoektermenOpslaan().click();
  generic.notificationSuccess('De zoekterm is opgeslagen');
  
  afspraakDetails.inputZoektermen().type(uniqueTerm2);
  afspraakDetails.buttonZoektermenOpslaan().click();
  generic.notificationSuccess('De zoekterm is opgeslagen');

});

When("I copy the agreement", () => {

  afspraakDetails.getMenu().click();
  afspraakDetails.menuCopy().click();
  afspraakDetails.buttonZoektermenSuggestie(uniqueTerm1);
  afspraakDetails.buttonZoektermenSuggestie(uniqueTerm2);
  afspraakDetails.buttonOpslaanCopy().click();
  generic.notificationSuccess('De afspraak is opgeslagen');
  
});

Then("the agreement details and search terms are copied to a new agreement", () => {

  afspraakDetails.buttonZoektermenSuggestie(uniqueTerm1);
  afspraakDetails.buttonZoektermenSuggestie(uniqueTerm2);

});

//#endregion

//#region Scenario: create a follow-up agreement to an ended agreement

When('I end an agreement', () => {

  // View burger detail page
  burgers.openBurger('Dingus Bingus')
  burgerDetails.viewAfspraak(uniqueId)

  afspraakDetails.getMenu().click();
  afspraakDetails.menuEnd().click();
  afspraakDetails.buttonAfspraakBeeindigen().click();
  generic.notificationSuccess('Afspraak beëindigd');

});

When("I create a follow-up agreement to the ended agreement", () => {
  
  afspraakDetails.buttonAfspraakFollowup().click();
  afspraakDetails.buttonZoektermenSuggestie(uniqueTerm1);
  afspraakDetails.buttonZoektermenSuggestie(uniqueTerm2);
  afspraakDetails.buttonOpslaanCopy().click();
  generic.notificationSuccess('De afspraak is opgeslagen');

});

//#endregion
