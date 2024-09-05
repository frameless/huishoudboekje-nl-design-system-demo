
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

// Set database query
const queryAddCitizenA = `mutation createBurger {
  createBurger(input:
  {
  	voornamen: "Aaron",
		voorletters: "A.B.C.",
  	achternaam: "Caronsson",
  	bsn: 253913081,
		geboortedatum: "2000-01-01",
  	straatnaam: "Sesamstraat",
  	huisnummer: "21",
  	plaatsnaam: "Maaskantje",
  	postcode: "4321AB",
    email: "aaron@bingus.tk",
    telefoonnummer: "0611211211",
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

const queryAddCitizenB = `mutation createBurger {
  createBurger(input:
  {
  	voornamen: "Babette",
		voorletters: "C.A.T.",
  	achternaam: "Aobinsson",
  	bsn: 540076508,
		geboortedatum: "2000-01-01",
  	straatnaam: "Sesamstraat",
  	huisnummer: "19",
  	plaatsnaam: "Maaskantje",
  	postcode: "4321AB",
    email: "babs@bingus.tk",
    telefoonnummer: "0612544111",
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

const queryAddCitizenC = `mutation createBurger {
  createBurger(input:
  {
  	voornamen: "Chip",
		voorletters: "C.C.",
  	achternaam: "Bhailark",
  	bsn: 123692313,
		geboortedatum: "2000-01-01",
  	straatnaam: "Sesamstraat",
  	huisnummer: "17",
  	plaatsnaam: "Maaskantje",
  	postcode: "4321AB",
    email: "chipper@bingus.tk",
    telefoonnummer: "0613544999",
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

const queryAddCitizenD = `mutation createBurger {
  createBurger(input:
  {
  	voornamen: "Derek",
		voorletters: "D.J.",
  	achternaam: "Dinkelberg",
  	bsn: 299574593,
		geboortedatum: "2000-01-01",
  	straatnaam: "Sesamstraat",
  	huisnummer: "15",
  	plaatsnaam: "Maaskantje",
  	postcode: "4321AB",
    email: "djdinkel@bingus.tk",
    telefoonnummer: "0666549871",
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

const queryAddCitizenE = `mutation createBurger {
  createBurger(input:
  {
  	voornamen: "Ernst",
		voorletters: "R.E.S.T.",
  	achternaam: "Bobby",
  	bsn: 592077524,
		geboortedatum: "2000-01-01",
  	straatnaam: "Sesamstraat",
  	huisnummer: "15",
  	plaatsnaam: "Maaskantje",
  	postcode: "4321AB",
    email: "djdinkel@bingus.tk",
    telefoonnummer: "0612546871",
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

const queryAddCitizenF = `mutation createBurger {
  createBurger(input:
  {
  	voornamen: "Fokke",
		voorletters: "D.E.",
  	achternaam: "Haan",
  	bsn: 480655443,
		geboortedatum: "2000-01-01",
  	straatnaam: "Sesamstraat",
  	huisnummer: "15",
  	plaatsnaam: "Maaskantje",
  	postcode: "4321AB",
    email: "fokke@bingus.tk",
    telefoonnummer: "0612776881",
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

const queryAddCitizenG = `mutation createBurger {
  createBurger(input:
  {
  	voornamen: "Gerard",
		voorletters: "E.",
  	achternaam: "Bowling",
  	bsn: 440453082,
		geboortedatum: "2000-01-01",
  	straatnaam: "Sesamstraat",
  	huisnummer: "15",
  	plaatsnaam: "Maaskantje",
  	postcode: "4321AB",
    email: "strike@bingus.tk",
    telefoonnummer: "0619546991",
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

const queryAddCitizenH = `mutation createBurger {
  createBurger(input:
  {
  	voornamen: "Harry",
		voorletters: "R.",
  	achternaam: "Botter",
  	bsn: 690082940,
		geboortedatum: "2000-01-01",
  	straatnaam: "Sesamstraat",
  	huisnummer: "15",
  	plaatsnaam: "Maaskantje",
  	postcode: "4321AB",
    email: "flipendo@bingus.tk",
    telefoonnummer: "0613543371",
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

const queryAddCitizenI = `mutation createBurger {
  createBurger(input:
  {
  	voornamen: "Irene",
		voorletters: "S.",
  	achternaam: "Worst",
  	bsn: 286575310,
		geboortedatum: "2000-01-01",
  	straatnaam: "Sesamstraat",
  	huisnummer: "15",
  	plaatsnaam: "Maaskantje",
  	postcode: "4321AB",
    email: "worstkaasscenario@bingus.tk",
    telefoonnummer: "0618546888",
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

const queryAddCitizenJ = `mutation createBurger {
  createBurger(input:
  {
  	voornamen: "Jidske",
		voorletters: "R.E.S.T.",
  	achternaam: "Sausema",
  	bsn: 635225189,
		geboortedatum: "2000-01-01",
  	straatnaam: "Sesamstraat",
  	huisnummer: "15",
  	plaatsnaam: "Maaskantje",
  	postcode: "4321AB",
    email: "juffrouw@bingus.tk",
    telefoonnummer: "0617547871",
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

const queryAddCitizenZ = `mutation createBurger {
  createBurger(input:
  {
  	voornamen: "Zack",
		voorletters: "Z.Z.Z.",
  	achternaam: "Zava",
  	bsn: 384215233,
		geboortedatum: "2000-01-01",
  	straatnaam: "Sesamstraat",
  	huisnummer: "13",
  	plaatsnaam: "Maaskantje",
  	postcode: "4321AB",
    email: "zackisasleep@bingus.tk",
    telefoonnummer: "0613549899",
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
let citizenIdA = 0;
let citizenIdB = 0;
let citizenIdC = 0;
let citizenIdD = 0;
let citizenIdE = 0;
let citizenIdF = 0;
let citizenIdG = 0;
let citizenIdH = 0;
let citizenIdI = 0;
let citizenIdJ = 0;
let citizenIdZ = 0;

class Api {

  truncateAlarms() {

    const queryTruncateAlarm = `mutation Truncate {
      truncateTable(databaseName: "alarmenservice", tableName: "alarms")
    }`

    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateAlarm },
    }).then((res) => {
      console.log(res.body);
    });
    cy.log("Truncated table 'alarms'")
    console.log("Truncated table 'alarms'")
  }

  truncateSignals() {

    const queryTruncateSignal = `mutation Truncate {
      truncateTable(databaseName: "alarmenservice", tableName: "signals")
    }`

    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateSignal },
    }).then((res) => {
      console.log(res.body);
    });
    cy.log("Truncated table 'signals'")
    console.log("Truncated table 'signals'")
  }

  truncateBankTransactions() {

    const queryTruncateBankTransactions = `mutation Truncate {
      truncateTable(databaseName: "banktransactieservice", tableName: "transactions")
    }`
    
    const queryTruncateCustomerStatements = `mutation Truncate {
      truncateTable(databaseName: "banktransactieservice", tableName: "customerstatementmessages")
    }`
    
    const queryTruncateJournaalposten = `mutation Truncate {
      truncateTable(databaseName: "huishoudboekjeservice", tableName: "journaalposten")
    }`

    const queryTruncateFiles = `mutation Truncate {
      truncateTable(databaseName: "fileservice", tableName: "files")
    }`

    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateBankTransactions },
    }).then((res) => {
      console.log(res.body);
    });
    cy.log("Truncated table 'transactions'")
    console.log("Truncated table 'transactions'")

    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateCustomerStatements },
    }).then((res) => {
      console.log(res.body);
    });
    cy.log("Truncated table 'customerstatementmessages'")
    console.log("Truncated table 'customerstatementmessages'")

    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateJournaalposten },
    }).then((res) => {
      console.log(res.body);
    });
    cy.log("Truncated table 'journaalposten'")
    console.log("Truncated table 'journaalposten'")
    
    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateFiles },
    }).then((res) => {
      console.log(res.body);
    });
    cy.log("Truncated table 'files'")
    console.log("Truncated table 'files'")

  }

  truncatePaymentrecords() {

    const queryTruncatePaymentrecords = `mutation Truncate {
      truncateTable(databaseName: "banktransactieservice", tableName: "paymentrecords")
    }`

    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncatePaymentrecords },
    }).then((res) => {
      console.log(res.body);
    });
    cy.log("Truncated table 'paymentrecords'")
    console.log("Truncated table 'paymentrecords'")
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

  
  createTestBurgerEndParcip() 
  {
    // Create a test user
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: queryAddCitizenEndParcip },
    }).then((res) => {
      console.log(res.body);
      citizenIdEndParcip = res.body.data.createBurger.burger.id;
      console.log('Test citizen has been created with id ' + citizenIdEndParcip)
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

  getAfspraakUuid(omschrijving)
  {
    return cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: `  query findAfspraakByUuid {
        searchAfspraken(zoektermen: "` + omschrijving + `") {
          afspraken {
            uuid
          }
        }
      }` },
    }).its('body')  
  }

  getAfdelingId(iban)
  {
    
    return cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: `query rekeningByIBAN {
        rekeningenByIbans(ibans: "`+ iban +`") {
          id
        }
        afdelingenByIban(iban: "`+ iban +`") {
          id
        }
      }` },
    }).its('body')
      
  }

  getPostadresId(afdelingId)
  {
    
    return cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: `query afdelingByIban {
                afdeling(id: `+ afdelingId +`) {
          postadressen {
            id
          }
        }
      }` },
    }).its('body')
      
  }

  createTestBurgerA()
  {
    // Create a test user
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: queryAddCitizenA },
    }).then((res) => {
      console.log(res.body);
      citizenIdA = res.body.data.createBurger.burger.id;
      console.log('Test citizen A has been created with id ' + citizenIdA)
    });
  }

  createTestBurgerB()
  {
    // Create a test user
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: queryAddCitizenB },
    }).then((res) => {
      console.log(res.body);
      citizenIdB = res.body.data.createBurger.burger.id;
      console.log('Test citizen B has been created with id ' + citizenIdB)
    });
  }

  createTestBurgerC()
  {
    // Create a test user
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: queryAddCitizenC },
    }).then((res) => {
      console.log(res.body);
      citizenIdC = res.body.data.createBurger.burger.id;
      console.log('Test citizen C has been created with id ' + citizenIdC)
    });
  }

  createTestBurgerD()
  {
    // Create a test user
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: queryAddCitizenD },
    }).then((res) => {
      console.log(res.body);
      citizenIdD = res.body.data.createBurger.burger.id;
      console.log('Test citizen D has been created with id ' + citizenIdD)
    });
  }

  createTestBurgerE()
  {
    // Create a test user
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: queryAddCitizenE },
    }).then((res) => {
      console.log(res.body);
      citizenIdE = res.body.data.createBurger.burger.id;
      console.log('Test citizen E has been created with id ' + citizenIdE)
    });
  }

  createTestBurgerF()
  {
    // Create a test user
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: queryAddCitizenF },
    }).then((res) => {
      console.log(res.body);
      citizenIdF = res.body.data.createBurger.burger.id;
      console.log('Test citizen F has been created with id ' + citizenIdF)
    });
  }

  createTestBurgerG()
  {
    // Create a test user
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: queryAddCitizenG },
    }).then((res) => {
      console.log(res.body);
      citizenIdG = res.body.data.createBurger.burger.id;
      console.log('Test citizen G has been created with id ' + citizenIdG)
    });
  }

  createTestBurgerH()
  {
    // Create a test user
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: queryAddCitizenH },
    }).then((res) => {
      console.log(res.body);
      citizenIdH = res.body.data.createBurger.burger.id;
      console.log('Test citizen H has been created with id ' + citizenIdH)
    });
  }

  createTestBurgerI()
  {
    // Create a test user
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: queryAddCitizenI },
    }).then((res) => {
      console.log(res.body);
      citizenIdI = res.body.data.createBurger.burger.id;
      console.log('Test citizen I has been created with id ' + citizenIdI)
    });
  }

  createTestBurgerJ()
  {
    // Create a test user
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: queryAddCitizenJ },
    }).then((res) => {
      console.log(res.body);
      citizenIdJ = res.body.data.createBurger.burger.id;
      console.log('Test citizen J has been created with id ' + citizenIdJ)
    });
  }

  createTestBurgerZ()
  {
    // Create a test user
    cy.request({
      method: "post",
      url: Cypress.config().baseUrl + '/apiV2/graphql',
      body: { query: queryAddCitizenZ },
    }).then((res) => {
      console.log(res.body);
      citizenIdZ = res.body.data.createBurger.burger.id;
      console.log('Test citizen Z has been created with id ' + citizenIdZ)
    });
  }

  createTestBurgerABC()
  {
    this.createTestBurgerA()
    cy.wait(50)
    this.createTestBurgerB()
    cy.wait(50)
    this.createTestBurgerC()
  }

  createTestBurgerABCDEFGHIJZ()
  {
    this.createTestBurgerABC()
    cy.wait(50)
    this.createTestBurgerD()
    cy.wait(50)
    this.createTestBurgerE()
    cy.wait(50)
    this.createTestBurgerF()
    cy.wait(50)
    this.createTestBurgerG()
    cy.wait(50)
    this.createTestBurgerH()
    cy.wait(50)
    this.createTestBurgerI()
    cy.wait(50)
    this.createTestBurgerJ()
    cy.wait(50)
    this.createTestBurgerZ()
  }

  deleteTestBurger()
  {
    this.getBurgerId("Bingus").then((res) => {
      console.log(res);	
      cy.log('Test citizen has id ' + res.data.burgers[0].id)
      let burgerId = res.data.burgers[0].id;

      // Delete test citizen
      cy.request({
        method: "post",
        url: Cypress.config().baseUrl + '/apiV2/graphql',
        body: { query: `mutation deleteBurger {
          deleteBurger(id: ` + burgerId + `)
          {
            ok
          }
        }` },
      }).then((res) => {
        console.log(res.body);
        console.log('Test citizen has been deleted with id ' + burgerId)
        cy.log('Deleted test citizen ' + burgerId)
      });
    });
  }
  
  deleteTestBurgerEndParcip() 
  {
    this.getBurgerId("Cipator").then((res) => {
      console.log(res);	
      cy.log('Test citizen has id ' + res.data.burgers[0].id)
      let burgerId = res.data.burgers[0].id;

      // Delete test citizen
      cy.request({
        method: "post",
        url: Cypress.config().baseUrl + '/apiV2/graphql',
        body: { query: `mutation deleteBurger {
          deleteBurger(id: ` + burgerId + `)
          {
            ok
          }
        }` },
      }).then((res) => {
        console.log(res.body);
        console.log('Test citizen has been deleted with id ' + burgerId)
        cy.log('Deleted test citizen ' + burgerId)
      });
    });
  }


  deleteTestBurgerA()
  {
    this.getBurgerId("Caronsson").then((res) => {
      console.log(res);	
      cy.log('Test citizen has id ' + res.data.burgers[0].id)
      let burgerId = res.data.burgers[0].id;

      // Delete test citizen
      cy.request({
        method: "post",
        url: Cypress.config().baseUrl + '/apiV2/graphql',
        body: { query: `mutation deleteBurger {
          deleteBurger(id: ` + burgerId + `)
          {
            ok
          }
        }` },
      }).then((res) => {
        console.log(res.body);
        console.log('Test citizen has been deleted with id ' + burgerId)
        cy.log('Deleted test citizen ' + burgerId)
      });
    });
  }

  deleteTestBurgerB()
  {
    this.getBurgerId("Aobinsson").then((res) => {
      console.log(res);	
      cy.log('Test citizen has id ' + res.data.burgers[0].id)
      let burgerId = res.data.burgers[0].id;

      // Delete test citizen
      cy.request({
        method: "post",
        url: Cypress.config().baseUrl + '/apiV2/graphql',
        body: { query: `mutation deleteBurger {
          deleteBurger(id: ` + burgerId + `)
          {
            ok
          }
        }` },
      }).then((res) => {
        console.log(res.body);
        console.log('Test citizen has been deleted with id ' + burgerId)
        cy.log('Deleted test citizen ' + burgerId)
      });
    });
  }

  deleteTestBurgerC()
  {
    this.getBurgerId("Bhailark").then((res) => {
      console.log(res);	
      cy.log('Test citizen has id ' + res.data.burgers[0].id)
      let burgerId = res.data.burgers[0].id;

      // Delete test citizen
      cy.request({
        method: "post",
        url: Cypress.config().baseUrl + '/apiV2/graphql',
        body: { query: `mutation deleteBurger {
          deleteBurger(id: ` + burgerId + `)
          {
            ok
          }
        }` },
      }).then((res) => {
        console.log(res.body);
        console.log('Test citizen has been deleted with id ' + burgerId)
        cy.log('Deleted test citizen ' + burgerId)
      });
    });
  }

  deleteTestBurgerD()
  {
    this.getBurgerId("Dinkelberg").then((res) => {
      console.log(res);	
      cy.log('Test citizen has id ' + res.data.burgers[0].id)
      let burgerId = res.data.burgers[0].id;

      // Delete test citizen
      cy.request({
        method: "post",
        url: Cypress.config().baseUrl + '/apiV2/graphql',
        body: { query: `mutation deleteBurger {
          deleteBurger(id: ` + burgerId + `)
          {
            ok
          }
        }` },
      }).then((res) => {
        console.log(res.body);
        console.log('Test citizen has been deleted with id ' + burgerId)
        cy.log('Deleted test citizen ' + burgerId)
      });
    });
  }

  deleteTestBurgerE()
  {
    this.getBurgerId("Bobby").then((res) => {
      console.log(res);	
      cy.log('Test citizen has id ' + res.data.burgers[0].id)
      let burgerId = res.data.burgers[0].id;

      // Delete test citizen
      cy.request({
        method: "post",
        url: Cypress.config().baseUrl + '/apiV2/graphql',
        body: { query: `mutation deleteBurger {
          deleteBurger(id: ` + burgerId + `)
          {
            ok
          }
        }` },
      }).then((res) => {
        console.log(res.body);
        console.log('Test citizen has been deleted with id ' + burgerId)
        cy.log('Deleted test citizen ' + burgerId)
      });
    });
  }
  
  deleteTestBurgerF()
  {
    this.getBurgerId("Haan").then((res) => {
      console.log(res);	
      cy.log('Test citizen has id ' + res.data.burgers[0].id)
      let burgerId = res.data.burgers[0].id;

      // Delete test citizen
      cy.request({
        method: "post",
        url: Cypress.config().baseUrl + '/apiV2/graphql',
        body: { query: `mutation deleteBurger {
          deleteBurger(id: ` + burgerId + `)
          {
            ok
          }
        }` },
      }).then((res) => {
        console.log(res.body);
        console.log('Test citizen has been deleted with id ' + burgerId)
        cy.log('Deleted test citizen ' + burgerId)
      });
    });
  }
  
  deleteTestBurgerG()
  {
    this.getBurgerId("Bowling").then((res) => {
      console.log(res);	
      cy.log('Test citizen has id ' + res.data.burgers[0].id)
      let burgerId = res.data.burgers[0].id;

      // Delete test citizen
      cy.request({
        method: "post",
        url: Cypress.config().baseUrl + '/apiV2/graphql',
        body: { query: `mutation deleteBurger {
          deleteBurger(id: ` + burgerId + `)
          {
            ok
          }
        }` },
      }).then((res) => {
        console.log(res.body);
        console.log('Test citizen has been deleted with id ' + burgerId)
        cy.log('Deleted test citizen ' + burgerId)
      });
    });
  }
  
  deleteTestBurgerH()
  {
    this.getBurgerId("Botter").then((res) => {
      console.log(res);	
      cy.log('Test citizen has id ' + res.data.burgers[0].id)
      let burgerId = res.data.burgers[0].id;

      // Delete test citizen
      cy.request({
        method: "post",
        url: Cypress.config().baseUrl + '/apiV2/graphql',
        body: { query: `mutation deleteBurger {
          deleteBurger(id: ` + burgerId + `)
          {
            ok
          }
        }` },
      }).then((res) => {
        console.log(res.body);
        console.log('Test citizen has been deleted with id ' + burgerId)
        cy.log('Deleted test citizen ' + burgerId)
      });
    });
  }
  
  deleteTestBurgerI()
  {
    this.getBurgerId("Worst").then((res) => {
      console.log(res);	
      cy.log('Test citizen has id ' + res.data.burgers[0].id)
      let burgerId = res.data.burgers[0].id;

      // Delete test citizen
      cy.request({
        method: "post",
        url: Cypress.config().baseUrl + '/apiV2/graphql',
        body: { query: `mutation deleteBurger {
          deleteBurger(id: ` + burgerId + `)
          {
            ok
          }
        }` },
      }).then((res) => {
        console.log(res.body);
        console.log('Test citizen has been deleted with id ' + burgerId)
        cy.log('Deleted test citizen ' + burgerId)
      });
    });
  }

  deleteTestBurgerJ()
  {
    this.getBurgerId("Sausema").then((res) => {
      console.log(res);	
      cy.log('Test citizen has id ' + res.data.burgers[0].id)
      let burgerId = res.data.burgers[0].id;

      // Delete test citizen
      cy.request({
        method: "post",
        url: Cypress.config().baseUrl + '/apiV2/graphql',
        body: { query: `mutation deleteBurger {
          deleteBurger(id: ` + burgerId + `)
          {
            ok
          }
        }` },
      }).then((res) => {
        console.log(res.body);
        console.log('Test citizen has been deleted with id ' + burgerId)
        cy.log('Deleted test citizen ' + burgerId)
      });
    });
  }

  deleteTestBurgerZ()
  {
    this.getBurgerId("Zava").then((res) => {
      console.log(res);	
      cy.log('Test citizen has id ' + res.data.burgers[0].id)
      let burgerId = res.data.burgers[0].id;

      // Delete test citizen
      cy.request({
        method: "post",
        url: Cypress.config().baseUrl + '/apiV2/graphql',
        body: { query: `mutation deleteBurger {
          deleteBurger(id: ` + burgerId + `)
          {
            ok
          }
        }` },
      }).then((res) => {
        console.log(res.body);
        console.log('Test citizen has been deleted with id ' + burgerId)
        cy.log('Deleted test citizen ' + burgerId)
      });
    });
  }

  deleteTestBurgerABC()
  {
    this.deleteTestBurgerA()
    cy.wait(50)
    this.deleteTestBurgerB()
    cy.wait(50)
    this.deleteTestBurgerC()
  }

  deleteTestBurgerABCDEFGHIJZ()
  {
    this.deleteTestBurgerABC()
    cy.wait(50)
    this.deleteTestBurgerD()
    cy.wait(50)
    this.deleteTestBurgerE()
    cy.wait(50)
    this.deleteTestBurgerF()
    cy.wait(50)
    this.deleteTestBurgerG()
    cy.wait(50)
    this.deleteTestBurgerH()
    cy.wait(50)
    this.deleteTestBurgerI()
    cy.wait(50)
    this.deleteTestBurgerJ()
    cy.wait(50)
    this.deleteTestBurgerZ()
    cy.wait(50)
  }
  
   
}

export default Api;