
import Generic from "./Generic";

const generic = new Generic();

class AlarmModal {

  isModalOpen() {
    // Check whether modal is opened and visible
    cy.get('[data-test="modal.Alarm"]', { timeout: 10000 })
      .should('be.visible');
  }

  isModalClosed() {
    // Check whether modal is closed
    cy.get('[data-test="modal.Alarm"]', { timeout: 10000 })
      .should('not.exist');
  }

	inputStartDateCurrentDate() {
		// Set date constants for comparison
		const dateNow = new Date().toLocaleDateString('nl-NL', {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		})

		// Check 'Startdatum' field
		cy.get('[data-test="alarmForm.startDate"]')
			.clear()
			.should('have.value', '')

		// Fill in 'Startdatum' field
		cy.get('[data-test="alarmForm.startDate"]')
			.type(dateNow + '{enter}')
			.should('have.value', dateNow)
	}

  inputStartDate() {
    // Fill in 'Startdatum' field
    cy.get('[data-test="alarmForm.startDate"]')
      .type('{selectAll}01-01-2099{enter}')
  }

  inputDayOfMonth(day) {
    // Check 'Dag in de maand' field  
    cy.get('[data-test="alarmForm.byMonthDay"]')
    .should('have.value', '')

    // Fill in 'Dag in de maand' field
    cy.get('[data-test="alarmForm.byMonthDay"]')
      .type(day)
      .should('have.value', day)
  }

  inputDeviationDay(day) {
    // Check 'Toegestane afwijking (in dagen)' field  
    cy.get('[data-test="alarmForm.dateMargin"]')
      .should('have.value', '')

    // Fill in 'Toegestane afwijking (in dagen)' field  
    cy.get('[data-test="alarmForm.dateMargin"]')
      .type(day)
      .should('have.value', day)
  }

  inputExpectedAmount()
  {
    let agreementValue;
    cy.get('label[class^="chakra-form__label"]').contains('Bedrag')
      .siblings()
      .then(($value) => {
        agreementValue = $value.text() // Store the agreement amount in a variable
        const newValue1 = agreementValue.slice(2) // Remove the valuta symbol from string
        const newValue2 = newValue1.replace(",", ".") // Replace the comma with a full stop

        // Check 'Bedrag verwachte betaling' field   
        cy.get('[data-test="alarmForm.amount"]')
          .invoke('val')
          .then((val2) => {
            expect(val2).to.eq(newValue2)

            // Clear and refill 'Bedrag verwachte betaling' field   
            cy.get('[data-test="alarmForm.amount"]')
              .type('{selectAll}' + newValue2) // Done via 'selectAll', as a clear() will automatically leave a zero
              .should('have.value', newValue2)
          })
      })
  }

  inputDeviationPayment(amount) {
    // Check 'Toegestane afwijking bedrag (in euro's)' field  
    cy.get('[data-test="alarmForm.amountMargin"]')
      .should('have.value', '')

    // Fill in 'Toegestane afwijking bedrag (in euro's)' field  
    cy.get('[data-test="alarmForm.amountMargin"]')
      .type(amount)
      .should('have.value', amount)
  }

  buttonOpslaan()
  {
    return cy.get('[data-test="buttonModal.submit"]', { timeout: 10000 })
  }

  buttonAnnuleren()
  {
    return cy.get('[data-test="buttonModal.reset"]', { timeout: 10000 })
  }

	createMonthlyAlarm() {

    this.isModalOpen()

    // Fill in values
    this.inputStartDate()
    this.inputDayOfMonth('1')
    this.inputDeviationDay('1')
    this.inputExpectedAmount()
    this.inputDeviationPayment('1')

    // Save alarm
    this.buttonOpslaan().click()

    this.isModalClosed()

    generic.notificationSuccess('Het alarm is opgeslagen')

	}
   
}

export default AlarmModal;