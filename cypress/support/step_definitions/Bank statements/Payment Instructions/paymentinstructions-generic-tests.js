
import { Before, After, When, Step } from "@badeball/cypress-cucumber-preprocessor";

import Generic from "../../../../pages/Generic";
import Api from "../../../../pages/Api";
import AfspraakNew from "../../../../pages/AfspraakNew";
import AfspraakDetails from "../../../../pages/AfspraakDetails";
import BetaalinstructieNew from "../../../../pages/BetaalinstructieNew";
import Betaalinstructies from "../../../../pages/Betaalinstructies";

const generic = new Generic()
const api = new Api()
const afspraakNew = new AfspraakNew()
const afspraakDetails = new AfspraakDetails()
const betaalinstructieNew = new BetaalinstructieNew()
const betaalinstructies = new Betaalinstructies()

//#region - Add test users

Before({ tags: "@createCitizenA" }, function (){

  api.createTestBurgerA()

});

Before({ tags: "@createCitizenB" }, function (){

  api.createTestBurgerB()

});

Before({ tags: "@createCitizenC" }, function (){

  api.createTestBurgerC()

});

Before({ tags: "@createCitizenD" }, function (){

  api.createTestBurgerD()

});

Before({ tags: "@createCitizenE" }, function (){

  api.createTestBurgerE()

});

Before({ tags: "@createCitizenZ" }, function (){

  api.createTestBurgerZ()

});

Before({ tags: "@createCitizenABC" }, function (){

  api.createTestBurgerABC()

});


Before({ tags: "@createCitizenPageMaximum" }, function (){

  api.createTestBurgerABCDEFGHIJZ()

});

After({ tags: "@deleteCitizenABC" }, function (){

  // Delete test user A B and C
  api.deleteTestBurgerABC()

});

After({ tags: "@deleteCitizenPageMaximum" }, function (){

  // Delete test user A B and C
  api.deleteTestBurgerABCDEFGHIJZ()

});

//#endregion

Before({ tags: "@createPaymentInstruction" }, function (){

    // Create agreement
    afspraakNew.createAfspraakUitgaven('Caronsson', '2024-05-02')
  
    // Create payment instruction
    betaalinstructieNew.createBetaalinstructieMaandelijks()
    afspraakDetails.redirectToAfspraak()
    generic.containsText('Elke maand op de 2e')
    generic.containsText('Vanaf 02-05-2024 t/m ∞')

    // Export payment instruction
    betaalinstructies.inputDateRangeStart('02-05-2024')
    betaalinstructies.inputDateRangeEnd('02-05-2024')
    betaalinstructies.buttonExport().click()

});
