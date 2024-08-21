
const queryTruncateSignal = `mutation Truncate {
  truncateTable(databaseName: "alarmenservice", tableName: "signals")
}`

const queryAddCitizen = `mutation createBurger {
  createBurger(input:
  {
    voornamen: "Dingus",
    voorletters: "D.L.C.",
    achternaam: "Bingus",
    bsn: 496734349,
    geboortedatum: "2000-01-01",
    straatnaam: "Sesamstraat",
    huisnummer: "23",
    plaatsnaam: "Maaskantje",
    postcode: "4321AB",
    email: "dingus@bingus.tk",
    telefoonnummer: "0612344321",
    rekeningen:
      [{rekeninghouder: "Tonnie Test",
        iban: "NL02ARSN0905984706"
      }],  
  }
)
  {
    burger{id}
  }
}`

const queryAddCitizenEndParcip = `mutation createBurger {
  createBurger(input:
  {
    voornamen: "Party",
    voorletters: "C.",
    achternaam: "Cipator",
    bsn: 578803008,
    geboortedatum: "2000-01-01",
    straatnaam: "Sesamstraat",
    huisnummer: "99",
    plaatsnaam: "Maaskantje",
    postcode: "4321AB",
    email: "part-i-c-pator@bingus.tk",
    telefoonnummer: "0618542337",
    rekeningen:
      [{rekeninghouder: "Tonnie Test",
        iban: "NL02ARSN0905984706"
      }],  
  }
)
  {
    burger{id}
  }
}`


let citizenId = 0;
let citizenIdEndParcip = 0;

class Api {

  truncateAlarms() {

    const queryTruncateAlarm = `mutation Truncate {
      truncateTable(databaseName: "alarmenservice", tableName: "Alarm")
    }`

    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateAlarm },
    }).then((res) => {
      console.log(res.body);
    });
    cy.log("Truncated table 'alarms'")
  }

  truncateSignals() {

    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateSignal },
    }).then((res) => {
      console.log(res.body);
    });
    cy.log("Truncated table 'signals'")
  }

  truncateBankTransactions() {

    const queryTruncateBankTransactions = `mutation Truncate {
      truncateTable(databaseName: "banktransactieservice", tableName: "bank_transactions")
    }`
    
    const queryTruncateCustomerStatements = `mutation Truncate {
      truncateTable(databaseName: "banktransactieservice", tableName: "customer_statement_messages")
    }`
    
    const queryTruncateJournaalposten = `mutation Truncate {
      truncateTable(databaseName: "huishoudboekjeservice", tableName: "journaalposten")
    }`

    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateBankTransactions },
    }).then((res) => {
      console.log(res.body);
    });
    cy.log("Truncated table 'bank_transactions'")

    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateCustomerStatements },
    }).then((res) => {
      console.log(res.body);
    });
    cy.log("Truncated table 'customer_statement_messages'")

    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateJournaalposten },
    }).then((res) => {
      console.log(res.body);
    });
    cy.log("Truncated table 'journaalposten'")
  }

  createTestBurger() {
    
    // Create a test user
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: queryAddCitizen },
    }).then((res) => {
      console.log(res.body);
      citizenId = res.body.data.createBurger.burger.id;
      console.log('Test citizen has been created with id ' + citizenId)
    });
    
  }

  createTestBurgerEndParcip() {

    // Create a test user
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: queryAddCitizenEndParcip },
    }).then((res) => {
      console.log(res.body);
      citizenIdEndParcip = res.body.data.createBurger.burger.id;
      console.log('Test citizen has been created', res.body.data.createBurger.burger.id)
    });
    
  }

  deleteTestBurger() {

    // Delete test citizen
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: `mutation deleteBurger {
        deleteBurger(id: ` + citizenId + `)
        {
          ok
        }
      }` },
    }).then((res) => {
      console.log(res.body);
      console.log('Test citizen has been deleted.')
      cy.log('Deleted test citizen')
    });
  }

  deleteTestBurgerEndParcip() {

    // Delete test citizen
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: `mutation deleteBurger {
        deleteBurger(id: ` + citizenIdEndParcip + `)
        {
          ok
        }
      }` },
    }).then((res) => {
      console.log(res.body);
      console.log('Test citizen has been deleted.')
      cy.log('Deleted test citizen')
    });
  }

  getBurgerId(name)
  {
    
    return cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: `query citizenSearch {
			burgers(search: "`+ name +`") {
				id
			}
		}` },
    }).its('body')
      
  }
   
}

export default Api;