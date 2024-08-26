
class Betaalinstructies {

    // Setup
  
    visit()
    {
      cy.visit('/bankzaken/betaalinstructies')
    }
  
    visitToevoegen()
    {
      cy.visit('/bankzaken/betaalinstructies/toevoegen')
    }
  
    inputDateRangeStart(date)
    {
      cy.get('[data-test="input.dateRange.start"]')
        .type('{selectAll}' + date + '{enter}');
      cy.get('[data-test="skeleton"]', { timeout: 10000 })
        .should('not.exist');
      cy.wait(500);
    }
  
    inputDateRangeEnd(date)
    {
      cy.get('[data-test="input.dateRange.end"]')
        .type('{selectAll}' + date + '{enter}');
      cy.get('[data-test="skeleton"]', { timeout: 10000 })
        .should('not.exist');
      cy.wait(500);
    }

    textAmountSelected()
    {
      return cy.get('[data-test="text.amountSelected"]')
    }
  
    buttonSelectieAanpassen()
    {
      return cy.get('[data-test="button.editSelection"]', { timeout: 10000 })
    }
  
    buttonSelecteerAlles()
    {
      return cy.get('[data-test="button.selectAll"]', { timeout: 10000 })
    }

    buttonViewInstruction(instructionNumber)
    {
        return cy.get('[data-test="button.viewInstruction"]').eq(instructionNumber);
    }
  
    toggleAll()
    {
      return cy.get('[data-test="checkbox.toggleAll"]', { timeout: 10000 })
    }
  
    buttonExport()
    {
      return cy.get('[data-test="buttonModal.submit"]', { timeout: 10000 })
    }
  
    paymentInstruction(number)
    {    
      return cy.get('[data-test="expand.instructionListItem"]').eq(number);
    }
  
    paymentInstructionsAmount(number)
    {    
      cy.get('[data-test="expand.instructionListItem"]')
        .should('have.length', number);
    }
  
    getCheckbox(number)
    {
      return  cy.get('[data-test="expand.instructionListItem"]').eq(number)
                .find('input[type="checkbox"]')
    }
  
    sortbyFirstName()
    {
      cy.get('[data-test="sorting.firstname"]')
        .click();
    }
  
    sortbyLastName()
    {
      cy.get('[data-test="sorting.lastname"]')
        .click();
    }
  
    sortbyStartDate()
    {
      cy.get('[data-test="sorting.startdate"]')
        .click();
    }
  
    isCheckboxToggled(number)
    {
      cy.get('input[type="checkbox"]')
        .eq(number)
        .parent()
        .should('not.have.prop', 'data-checked');
    }
  
    addCitizenToFilter(name)
    {
      cy.contains('Alle burgers')
        .click();
      cy.contains(name)
        .click();
    }
    goToPrevPage()
    {
      cy.contains('Vorige')
        .click();
    }
  
    goToNextPage()
    {
      cy.contains('Volgende')
        .click();
    }

    redirectPaymentDetail()
    {
        cy.url().should('include', Cypress.config().baseUrl + '/bankzaken/betaalinstructies/')
    }
       
}

export default Betaalinstructies;
