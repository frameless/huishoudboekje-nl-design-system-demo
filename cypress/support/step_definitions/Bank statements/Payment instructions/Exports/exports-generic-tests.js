// cypress/support/step_definitions/Generic/generic-tests.js

import { Before, After, When, Step } from "@badeball/cypress-cucumber-preprocessor";
import Generic from "../../../../../pages/Generic";
import Api from "../../../../../pages/Api";
import Betaalinstructies from "../../../../../pages/Betaalinstructies";

const generic = new Generic()
const api = new Api()
const betaalinstructies = new Betaalinstructies()

//#region - Add test users

Before({ tags: "createCitizenA" }, function (){

  api.createTestBurgerA()

});

Before({ tags: "createCitizenB" }, function (){

  api.createTestBurgerB()

});

Before({ tags: "createCitizenC" }, function (){

  api.createTestBurgerC()

});

Before({ tags: "createCitizenD" }, function (){

  api.createTestBurgerD()

});

Before({ tags: "createCitizenE" }, function (){

  api.createTestBurgerE()

});

Before({ tags: "createCitizenZ" }, function (){

  api.createTestBurgerZ()

});

Before({ tags: "createCitizenABC" }, function (){

  api.createTestBurgerABC()

});


Before({ tags: "createCitizenPageMaximum" }, function (){

  api.createTestBurgerABCDEFGHIJZ()

});

After({ tags: "deleteCitizenABC" }, function (){

  // Delete test user A B and C
  api.deleteTestBurgerABC()

});

After({ tags: "deleteCitizenPageMaximum" }, function (){

  // Delete test user A B and C
  api.deleteTestBurgerABCDEFGHIJZ()

});

//#endregion

When("I visit the 'Betaalinstructies Toevoegen' page", () => {

  betaalinstructies.visitToevoegen()

})
