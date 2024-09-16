// cypress/support/step_definitions/Organisaties/organisations.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";
import Generic from "../../../pages/Generic";
import Organisaties from "../../../pages/Organisaties";
import OrganisatieNew from "../../../pages/OrganisatieNew";
import OrganisatieDetails from "../../../pages/OrganisatieDetails";
 
const generic = new Generic()
const organisaties = new Organisaties()
const organisatieNew = new OrganisatieNew()
const organisatieDetails = new OrganisatieDetails()

let uniqueId = 0;

//#region Scenario: create an organisation

When("I add an organisation", () => {

    uniqueId = Date.now().toString();

    organisaties.visit();
    organisaties.buttonToevoegen().click();
    organisatieNew.correctUrl();
  
    // Fill in input fields
    organisatieNew.inputKvK().type('12345678');
    organisatieNew.inputVestigingsnummer().type('123456789012');
    organisatieNew.inputBedrijfsnaam().type(uniqueId);
    organisatieNew.buttonOpslaan().click();

    generic.notificationSuccess('organisatie opgeslagen')

});

Then("the organisation is created", () => {

    organisaties.visit()
    organisaties.panelOrganisatie(uniqueId)

});

//#endregion

//#region Scenario: edit an organisation to use an existing vestigingsnummer

When("I edit the organisation to use an existing vestigingsnummer", () => {

    // Navigate to the correct detail page
    organisaties.visit()
    organisaties.searchOrganisatie(uniqueId)
    organisaties.panelOrganisatie(uniqueId).click();

    // On the detail page, navigate to the edit page
    organisatieDetails.menu().click();
    organisatieDetails.menuWijzigen().click();

    // Change the branch number to the one used by Albert Heijn
    organisatieNew.inputVestigingsnummer().type('{selectAll}000018360785')

});

Then("I save the changes I made to the organisation", () => {

    organisatieNew.buttonOpslaan().click();

});

//#endregion

//#region Scenario: edit an organisation's company name

When("I change the company name of the organisation", () => {

    // Navigate to the correct detail page
    organisaties.visit()
    organisaties.searchOrganisatie(uniqueId)
    organisaties.panelOrganisatie(uniqueId).click();

    // On the detail page, navigate to the edit page
    organisatieDetails.menu().click();
    organisatieDetails.menuWijzigen().click();
    organisatieNew.inputBedrijfsnaam().type('{selectAll}NewName')

});

Then("the organisation is saved and the changes are displayed", () => {

    generic.notificationSuccess('Organisatie gewijzigd');
    generic.containsText('NewName');

});

//#endregion

//#region Scenario: delete an organisation without departments

When("I delete the organisation", () => {

    // Navigate to the correct detail page
    organisaties.visit()
    organisaties.searchOrganisatie('NewName')
    organisaties.panelOrganisatie('NewName').click();

    organisatieDetails.menu().click();
    organisatieDetails.menuVerwijderen().click();
    organisatieDetails.modalVerwijderen().click();

    generic.notificationSuccess('Organisatie is verwijderd');

});

Then("the organisation is deleted", () => {

    organisaties.visit()
    organisaties.panelOrganisatie(uniqueId).should('not.exist')
    organisaties.panelOrganisatie('NewName').should('not.exist')

});

//#endregion