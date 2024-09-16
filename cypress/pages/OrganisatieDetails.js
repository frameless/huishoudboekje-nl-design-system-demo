
import Api from "./Api";

const api = new Api()


class OrganisatieDetails {

    menu() {
      return cy.get('[data-test="menuOrganization"]')
    }

    menuWijzigen() {
      return cy.get('[data-test="menuOrganization.edit"]')
    }

    menuVerwijderen() {
      return cy.get('[data-test="menuOrganization.delete"]')
    }

    modalAnnuleren() {
      return cy.get('[data-test="buttonModal.cancel"]')
    }

    modalVerwijderen() {
      return cy.get('[data-test="buttonModal.delete"]')
    }

    modalOpslaan() {
      return cy.get('[data-test="buttonModal.submit"]')
    }

    buttonAfdelingToevoegen() {
      return cy.get('[data-test="button.addDepartment"]')
    }

    inputAfdelingNaam() {
      return cy.get('[data-test="input.createDepartment.name"]')
    }

    panelAfdeling(afdelingNaam) {
      return cy.get('p[title="'+ afdelingNaam +'"]')
    }

    buttonOpslaan(){
      return cy.get('[data-test="button.submitOrganisatie"]')
    }
    

    

}

export default OrganisatieDetails;