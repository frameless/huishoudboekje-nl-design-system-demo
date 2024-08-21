// cypress/support/step_definitions/Generic/generic-tests.js

import { When, Then, Given, Before, BeforeAll, After, AfterAll } from "@badeball/cypress-cucumber-preprocessor";
import Generic from "../../../pages/Generic";
import Api from "../../../pages/Api";
import Burgers from "../../../pages/Burgers";
import BurgerDetails from "../../../pages/BurgerDetails";
import AfspraakDetails from "../../../pages/AfspraakDetails";
import AlarmModal from "../../../pages/AlarmModal";
 
const generic = new Generic()
const api = new Api ()
const burgers = new Burgers()
const burgerDetails = new BurgerDetails()
const afspraakDetails = new AfspraakDetails()
const alarmModal = new AlarmModal()


Before({ tags: "@createCitizenEndParcip" }, function (){

  api.createTestBurgerEndParcip();

});

After({ tags: "@deleteCitizenEndParcip" }, function (){

  api.deleteTestBurgerEndParcip();

});
