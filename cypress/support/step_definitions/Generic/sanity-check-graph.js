import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

const queryAlarm = `mutation CreateAlarm {
  createAlarm(input: {alarm:{
    afspraakId: 12,
    id: "test",
    isActive: false,
    datumMargin: 20,
    bedrag: 1230,
    bedragMargin: 5,
    startDate: "20-12-2023"
  }})
  {
    alarm{
      id
    }
   }
  }`

const queryTruncate = `mutation Truncate {
  truncateTable(databaseName: "alarmenservice", tableName: "Alarm")
}`

When('I call the database to insert data', () => {

  // Create an alarm
  cy.request({
    method: "post",
    url: Cypress.env().graphqlUrl + '/graphql',
    body: { query: queryAlarm },
  }).then((res) => {
    console.log(res.body);
  });

});
 
Then('I truncate the tables', () => {

  // Truncate the tables
  cy.request({
    method: "post",
    url: Cypress.env().graphqlUrl + '/graphql',
    body: { query: queryTruncate },
  }).then((res) => {
    console.log(res.body);
  });

});
