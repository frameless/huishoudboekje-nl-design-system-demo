
import Api from "./Api";

const api = new Api()


class AfdelingDetails {

    menu() {
      return cy.get('[data-test="menuDepartment"]')
    }

    menuWijzigen() {
      return cy.get('[data-test="menuDepartment.edit"]')
    }

    menuVerwijderen() {
      return cy.get('[data-test="menuDepartment.delete"]')
    }

    modalVerwijderen() {
      return cy.get('[data-test="modalDepartment.delete"]')
    }

    buttonPostadresToevoegen() {
      return cy.get('[data-test="button.addPostaddressModal"]')
    }

        inputPostadresStraatnaam() {
          return cy.get('[data-test="postaddress.streetname"]')
        }

        inputPostadresHuisnummer() {
          return cy.get('[data-test="postaddress.housenumber"]')
        }

        inputPostadresPostcode() {
          return cy.get('[data-test="postaddress.postcode"]')
        }

        inputPostadresPlaatsnaam() {
          return cy.get('[data-test="postaddress.placename"]')
        }

    buttonRekeningToevoegen() {
      return cy.get('[data-test="button.addBankAccountModal"]')
    }

        inputRekeningRekeninghouder() {
          return cy.get('[data-test="input.accountHolder"]')
        }

        inputRekeningIBAN() {
          return cy.get('[data-test="input.IBAN"]')
        }

    buttonPostadresVerwijderen() {
      return cy.get('[data-test="departmentPostaddress.delete"]')
    }

    buttonIBANVerwijderen() {
      return cy.get('[data-test="buttonIcon.Delete"]')
    }
    
    modalAnnuleren() {
      return cy.get('[data-test="buttonModal.cancel"]')
    }

    modalOpslaan() {
      return cy.get('[data-test="buttonModal.submit"]')
    }
    
    modalPostadresVerwijderen() {
      return cy.get('[data-test="modalPostaddress.delete"]')
    }

    modalIBANVerwijderen() {
      return cy.get('[data-test="button.Delete"]')
    }
    
}

export default AfdelingDetails;