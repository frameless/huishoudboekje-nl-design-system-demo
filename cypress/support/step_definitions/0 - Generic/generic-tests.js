// cypress/support/step_definitions/Generic/generic-tests.js

import { When, Then, Given, Before, BeforeAll, After, AfterAll } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

// Set database queries
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

const queryTruncateAlarm = `mutation Truncate {
  truncateTable(databaseName: "alarmenservice", tableName: "Alarm")
}`

const queryTruncateSignal = `mutation Truncate {
  truncateTable(databaseName: "alarmenservice", tableName: "signals")
}`

const queryTruncateBankTransactions = `mutation Truncate {
  truncateTable(databaseName: "banktransactieservice", tableName: "bank_transactions")
}`

const queryTruncateCustomerStatements = `mutation Truncate {
  truncateTable(databaseName: "banktransactieservice", tableName: "customer_statement_messages")
}`

const queryTruncateJournaalposten = `mutation Truncate {
  truncateTable(databaseName: "huishoudboekjeservice", tableName: "journaalposten")
}`

let cookieAppSession = '';
let cookieAppToken = '';

let citizenId = 0;

// Before each feature
BeforeAll({ order: 1 }, function () {
  
  cy.visit('/');
  Cypress.Cookies.debug(true)
  cy.getCookie('appSession').then((c) => {
    const cookie = c
    if (c) {
      // If there is a cookie, do this
    }
    else {
      // If no cookie, log in
      // Log in
      cy.wait(500);
      cy.get('body').then(($body) => {
        const buttonLogin = $body.find('button[type="submit"]')
        if (buttonLogin.length) {
          cy.get('[data-test="button.Login"]').click()
          //cy.get('button').contains('Inloggen').click()
          cy.loginToAAD(Cypress.env('aad_username'), Cypress.env('aad_password'))
          
          // Save cookie
          cy.getCookie('appSession').then((c) => {
            cookieAppSession = c;
            console.log('Saved cookie appSession: ' + cookieAppSession)
          })

          // Save cookie
          cy.getCookie('app-token').then((c) => {
            cookieAppToken = c;
            console.log('Saved cookie app-token: ' + cookieAppToken)
          })
        }
        else {
          // Already logged in; do nothing
        }

      })

    }

  })

});

BeforeAll({ order: 2 },function () {
// This hook will be executed once at the start of a feature.

  // Delete the test citizen if it exists
  cy.request({
    method: "post",
    url: Cypress.config().baseUrl + '/apiV2/graphql',
    body: { query: `query citizenSearch {
      burgers(search: "Bingus") {
        id
      }
    }` },
  }).then((res) => {
    citizenName = res.body.data.burgers;
    cy.log(citizenName);
    if (citizenName.length != 0)
    {
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
      });
    }
    else
    {
      // Test citizen does not exist
      // Do nothing
    }

  })
  
});

BeforeAll({ order: 3 },function () {
  // This hook will be executed once at the start of a feature.

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


});

Before(function () {

  cy.visit('/');
  cy.url().then((url) => {

    if (url.includes("localhost"))
    {
      // do nothing
      console.log('url includes "localhost", so no cookies shoud be set.')
    } 
    else
    {
      Cypress.Cookies.debug(true)

      // Set cookie
      cy.setCookie('appSession', cookieAppSession.value).then((c) => {
        console.log('Loaded cookie appSession: ' + cookieAppSession)
      })

      // Set cookie
      cy.setCookie('app-token', cookieAppToken.value).then((c) => {
        console.log('Loaded cookie app-token: ' + cookieAppToken)
      })

    }

  })

});

AfterAll({ order: 1 },function () {
// This hook will be executed once at the end of a feature.
  
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

// Clean up
  // Truncate alarms
  cy.request({
    method: "post",
    url: Cypress.env().graphqlUrl + '/graphql',
    body: { query: queryTruncateAlarm },
  }).then((res) => {
    console.log(res.body);
  });
  cy.log("Truncated table 'alarms'")

  // Truncate signals
  cy.request({
    method: "post",
    url: Cypress.env().graphqlUrl + '/graphql',
    body: { query: queryTruncateSignal },
  }).then((res) => {
    console.log(res.body);
  });
  cy.log("Truncated table 'signals'")

  // Truncate bank statements
  cy.request({
    method: "post",
    url: Cypress.env().graphqlUrl + '/graphql',
    body: { query: queryTruncateBankTransactions },
  }).then((res) => {
    console.log(res.body);
  });
  cy.log("Truncated table 'bank_transactions'")

  // Truncate customer statements
  cy.request({
    method: "post",
    url: Cypress.env().graphqlUrl + '/graphql',
    body: { query: queryTruncateCustomerStatements },
  }).then((res) => {
    console.log(res.body);
  });
  cy.log("Truncated table 'customer_statement_messages'")

  // Truncate journaalposten
  cy.request({
    method: "post",
    url: Cypress.env().graphqlUrl + '/graphql',
    body: { query: queryTruncateJournaalposten },
  }).then((res) => {
    console.log(res.body);
  });
  cy.log("Truncated table 'journaalposten'")
    
});

// Truncate tables
When('I truncate the alarms table in alarmenservice', () => {

  cy.request({
    method: "post",
    url: Cypress.env().graphqlUrl + '/graphql',
    body: { query: queryTruncateAlarm },
  }).then((res) => {
    console.log(res.body);
  });
  cy.log("Truncated table 'alarms'")

});

When('I truncate the signals table in alarmenservice', () => {

  cy.request({
    method: "post",
    url: Cypress.env().graphqlUrl + '/graphql',
    body: { query: queryTruncateSignal },
  }).then((res) => {
    console.log(res.body);
  });
  cy.log("Truncated table 'signals'")

});

When('I truncate the bank transaction tables', () => {

  // Truncate bank statements
  cy.request({
    method: "post",
    url: Cypress.env().graphqlUrl + '/graphql',
    body: { query: queryTruncateBankTransactions },
  }).then((res) => {
    console.log(res.body);
  });
  cy.log("Truncated table 'bank_transactions'")

  // Truncate customer statements
  cy.request({
    method: "post",
    url: Cypress.env().graphqlUrl + '/graphql',
    body: { query: queryTruncateCustomerStatements },
  }).then((res) => {
    console.log(res.body);
  });
  cy.log("Truncated table 'customer_statement_messages'")

  // Truncate journaalposten
  cy.request({
    method: "post",
    url: Cypress.env().graphqlUrl + '/graphql',
    body: { query: queryTruncateJournaalposten },
  }).then((res) => {
    console.log(res.body);
  });
  cy.log("Truncated table 'journaalposten'")

});

// Navigate to a page
When('I navigate to the page {string}', (url) => {

  cy.visit(url)
  cy.url().should('eq', Cypress.config().baseUrl + url)

});

// Find a button
Then('the button {string} is displayed', (buttonName) => {

  cy.get('button')
    .contains(buttonName)

});

// Click a button
When('I click the button {string}', (buttonName) => {

  cy.get('button')
    .contains(buttonName)
    .click();

});

// Find text
Then('the text {string} is displayed', (text) => {

  cy.contains(text);

});

// Click text
Then('the text {string} is clicked', (text) => {

  cy.contains(text)
    .click();

});

// Find a field label
Then('the label {string} is displayed', (labelName) => {

  cy.get('label')
    .contains(labelName);

});

Then('the label {string} is marked as required', (labelName) => {

  cy.get('label')
    .contains(labelName)
    .children('span')
    .contains('*');

});

// Make sure text is not displayed on page
Then('the text {string} is not displayed', (text) => {

  cy.get('body', { timeout: 10000 })
    .should('not.contain', text);

});

// Find a generic success message
Then('a notification of success is displayed', () => {

  // Assertion
  cy.get('[data-status="success"]', { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible');

  // Make sure notification has disappeared from view
  cy.get('[data-status="success"]', { timeout: 10000 })
    .should('not.exist');

});

// Find a specific success message
Then('a success notification containing {string} is displayed', (notificationText) => {

  // Assertion
  cy.get('[data-status="success"]', { timeout: 10000 })
    .should('contain', notificationText)
    .and('be.visible')

  // Make sure notification has disappeared from view
  cy.get('[data-status="success"]', { timeout: 10000 })
    .should('not.exist');

});

// Find a specific error message
Then('an error notification containing {string} is displayed', (notificationText) => {

  // Assertion
  cy.get('[data-status="error"]', { timeout: 10000 })
    .should('contain', notificationText)
    .and('be.visible');

  // Make sure notification has disappeared from view
  cy.get('[data-status="error"]', { timeout: 10000 })
    .should('not.exist');

});

Then('I wait one minute', () => {

  cy.wait(60000);

});

// Confirm that a specific citizen exists
Given('the {string} citizen exists', (fullName) => {

  // Function that splits last name from other names
  function lastName(fullName) {
    var n = fullName.split(" ");
    return n[n.length - 1];
  }

  searchTerm = lastName(fullName)

  // Search for citizen
  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type(searchTerm);
  cy.get('[data-test="citizen.tile"]', { timeout: 30000 })
    .should('be.visible')

});

// Alarm modal is available
Then('the "Add alarm" modal is displayed', () => {

  // Assertion
  cy.get('[data-test="modal.Alarm"]', { timeout: 10000 })
    .should('be.visible');

});

// Navigate to the test citizen's page
When('I open the citizen overview page for {string}', (fullName) => {

  // Function that splits last name from other names
  function lastName(fullName) {
    var n = fullName.split(" ");
    return n[n.length - 1];
  }

  searchTerm = lastName(fullName)

  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type(searchTerm);
  cy.get('[data-test="citizen.tile"]', { timeout: 30000 })
    .should('be.visible')
    .first()
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/burgers/')

});
