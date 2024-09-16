
import Api from "./Api";

const api = new Api()


class OrganisatieNew {

    visit() {
      cy.visit("/organisaties/toevoegen")
    }

    correctUrl(){
      cy.url().should('eq', Cypress.config().baseUrl + '/organisaties/toevoegen');
    }

    inputKvK(){
      return cy.get('[data-test="input.KvK"]')
    }

    inputVestigingsnummer(){
      return cy.get('[data-test="input.branchnumber"]')
    }

    inputBedrijfsnaam(){
      return cy.get('[data-test="input.companyname"]')
    }

    buttonOpslaan(){
      return cy.get('[data-test="button.submitOrganisatie"]')
    }

}

export default OrganisatieNew;