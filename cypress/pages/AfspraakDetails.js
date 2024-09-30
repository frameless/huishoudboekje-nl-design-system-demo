import Generic from "./Generic";
import Api from "./Api";

const generic = new Generic()
const api = new Api()

class AfspraakDetails {
   
  getMenu() {
		return cy.get('[data-test="agreement.menuKebab"]')
	}

	menuCopy() {
		return cy.get('[data-test="agreement.menuCopy"]')
	}

  buttonOpslaanCopy() {
		return cy.get('[data-test="button.Submit"]')
	}

	menuEnd() {
		return cy.get('[data-test="agreement.menuEnd"]')
	}

  buttonAfspraakBeeindigen() {
		return cy.get('[data-test="button.endAgreement"]')
	}

  buttonAfspraakFollowup() {
		return cy.get('[data-test="button.followupAgreement"]')
	}

  getAlarm() {
    cy.contains('Elke maand op de 1e');

    // Check current status of alarm
    cy.get('.chakra-switch__track');
    cy.get('.chakra-switch__thumb');
    cy.get('[data-checked=""]');
  }

  readAlarm() {
    cy.contains('Periodiek');
    cy.contains('op de 1e');
    cy.contains('+1 dag');
    cy.contains('Volgende periodieke check')
    cy.contains('+/- € ')
    cy.get('label[class^="chakra-switch"]')
      .should('be.visible')
  }

	buttonZoektermenSuggestie(name) {
		return cy.get('[data-test="button.zoektermSuggestie"]').contains(name)
	}

  inputZoektermen() {
    return cy.get('[data-test="input.Zoektermen"]')
  }

	buttonZoektermenOpslaan() {
		return cy.get('[data-test="button.OpslaanZoektermen"]')
	}

	buttonBetaalinstructieToevoegen() {
		return cy.get('[data-test="button.addPaymentInstruction"]')
	}

	buttonAlarmToevoegen() {
		return cy.get('[data-test="button.addAlarm"]')
	}

  toggleAlarmStatus() {
    return cy.get('input[type="checkbox"]', { timeout: 10000 })
  }

  toggleGetStatusDisabled() {
    return cy.get('label[data-checked]', { timeout: 10000 })
  }

  toggleGetStatusEnabled() {
    return cy.get('label[class^="chakra-switch"]', { timeout: 10000 })
  }

  buttonDeleteAlarm() {
    return cy.get('button[aria-label="Verwijderen"]', { timeout: 10000 })
  
  }

  redirectToAfspraak()
  {
    cy.url().should('include', Cypress.config().baseUrl + '/afspraken/', { timeout: 10000 });
  }

  redirectToBetaalinstructie()
  {
    cy.url().should('include', '/betaalinstructie', { timeout: 10000 });
  }

  insertAlarm(afspraakOmschrijving, datumMarge, bedrag, bedragMarge)
  {
    // Get afspraak id
		api.getAfspraakUuid(afspraakOmschrijving).then((res) => {
			console.log(res);	
			let afspraakUuid = res.data.searchAfspraken.afspraken[0].uuid;
      cy.log('Afspraak ' + afspraakOmschrijving + ' has uuid ' + afspraakUuid)
      let startDatum = Math.floor(Date.now() / 1000);

      const queryAddAlarm = `mutation createalarm {
        Alarms_Create(input:
        {
          alarm: {
            isActive: true,
            dateMargin: ` + datumMarge + `,
            amount: ` + bedrag + `,
            amountMargin: ` + bedragMarge + `,
            startDate: "` + startDatum + `",
            endDate: "` + startDatum + `",
            AlarmType: 3
          },
          agreementUuid: "` + afspraakUuid + `"
        }
      )
        {
          id
          isActive
          startDate
          checkOnDate
        }
      }`

      // Create alarm
      cy.request({
        method: "post",
        url: Cypress.config().baseUrl + '/apiV2/graphql',
        body: { query: queryAddAlarm },
      }).then((res) => {
        console.log(res.body);
        let alarmId = res.body.data.Alarms_Create.id;
        console.log('Test alarm has been created with id ' + alarmId)
      });

    })
  }

}

export default AfspraakDetails;

