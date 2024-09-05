// cypress/support/step_definitions/Signals/create-signal-on-unexpected-payment.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

import Burgers from "../../../../pages/Burgers";
import BurgersDetails from "../../../../pages/BurgerDetails";
import AfspraakDetails from "../../../../pages/AfspraakDetails";

const burgers = new Burgers();
const burgerDetails = new BurgersDetails();
const afspraakDetails = new AfspraakDetails();

let uniqueId = 0;

//#region Scenario: payment amount too low, no amount margin

Given('an agreement exists for scenario "payment amount too low, no amount margin"', () => {
  
  // Set unique id names
  uniqueId = Date.now().toString();

  // Create agreements
  burgerDetails.insertAfspraak('Bingus', uniqueId, "10.00", 'NL86INGB0002445588', '5', 'false', '2024-01-01');

  // View burger detail page
  burgers.openBurger('Dingus Bingus')
  burgerDetails.viewAfspraak(uniqueId)

});

Given('an alarm exists for scenario "payment amount too low, no amount margin"', () => {
  
  //afspraakDetails.insertAlarm(uniqueId, "1", "1000", "0");

  cy.url().should('include', Cypress.config().baseUrl + '/afspraken/')
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  
  afspraakDetails.buttonAlarmToevoegen().click()

  // Check whether modal is opened and visible
  cy.get('section[aria-modal="true"]', { timeout: 10000 })
    .scrollIntoView()
    .should('exist');

  // Set alarm to 'eenmalig'
  cy.contains('Meer opties')
    .click();
  cy.get('[data-test="alarmForm.once"]')
    .click();

  // Fill in all required fields
      // 'Datum verwachte betaling'
          // Set date constants for comparison
          const dateNow = new Date().toLocaleDateString('nl-NL', {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
          })

      cy.get('[data-test="alarmForm.expectedDate"]')
        .type('{selectAll}' + dateNow + '{enter}')
        .should('have.value', dateNow)

      // 'Toegestane afwijking (in dagen)'
      cy.get('[data-test="alarmForm.dateMargin"]')
        .type('1')
        .should('have.value', '1')

      // 'Bedrag verwachte betaling'
      cy.get('[data-test="alarmForm.amount"]')
        .type('{selectAll}10')
        .should('have.value', '10') 

      // 'Toegestane afwijking bedrag'
      cy.get('[data-test="alarmForm.amountMargin"]')
        .type('{selectAll}0')
        .should('have.value', '0')

  // Click 'Opslaan' button
  cy.get('[data-test="buttonModal.submit"]')
      .click()

  // Check whether modal is closed
  cy.get('section[aria-modal="true"]', { timeout: 10000 })
      .should('not.exist');

});

Given('a low amount CAMT test file is created with the amount {string}', (amount) => {

  // Get current date
  var todayDate = new Date().toISOString().slice(0, 10);

  // Create file
  cy.writeFile('cypress/testdata/paymentAmountTooLow-NoAmountMargin.xml', `<?xml version='1.0' encoding='utf-8'?>
  <Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.02" xmlns_xsi="http://www.w3.org/2001/XMLSchema-instance">
      <BkToCstmrStmt>
          <GrpHdr>
              <MsgId>588d0a9f-439d-4410-8a3e-1354c2a9c55e</MsgId>
              <CreDtTm>2024-04-02T13:58:31.802216</CreDtTm>
              <MsgPgntn>
                  <PgNb>1</PgNb>
                  <LastPgInd>true</LastPgInd>
              </MsgPgntn>
          </GrpHdr>
          <Stmt>
              <Id>12</Id>
              <ElctrncSeqNb>1</ElctrncSeqNb>
              <CreDtTm>2024-04-02T13:58:31.802216</CreDtTm>
              <Acct>
                <Id>
                      <IBAN>NL36ABNA5632579034</IBAN>
                </Id>
                  <Ccy>EUR</Ccy>
                  <Svcr>
                      <FinInstnId>
                          <BIC>ABNANL2A</BIC>
                      </FinInstnId>
                  </Svcr>
              </Acct>
              <Bal>
                  <Tp>
                      <CdOrPrtry>
                          <Cd>OPBD</Cd>
                      </CdOrPrtry>
                  </Tp>
                  <Amt Ccy="EUR">0.00</Amt>
                  <CdtDbtInd>CRDT</CdtDbtInd>
              </Bal>
              <Bal>
                  <Tp>
                      <CdOrPrtry>
                          <Cd>CRDT</Cd>
                      </CdOrPrtry>
                  </Tp>
                  <Amt Ccy="EUR">0.00</Amt>
                  <CdtDbtInd>CRDT</CdtDbtInd>
              </Bal>
              <TxsSummry>
                  <TtlNtries>
                      <NbOfNtries>1</NbOfNtries>
                      <Sum>2002.00</Sum>
                      <TtlNetNtryAmt>2002.00</TtlNetNtryAmt>
                      <CdtDbtInd>DBIT</CdtDbtInd>
                  </TtlNtries>
                  <TtlCdtNtries>
                      <NbOfNtries>0</NbOfNtries>
                      <Sum>0.00</Sum>
                  </TtlCdtNtries>
                  <TtlDbtNtries>
                      <NbOfNtries>1</NbOfNtries>
                      <Sum>2002.00</Sum>
                  </TtlDbtNtries>
              </TxsSummry>
              <Ntry>
                  <!-- Amount voor deze transactie -->
                  <Amt Ccy="EUR">` + amount + `</Amt>
                  <!-- /Amount voor deze transactie -->
                  <!-- Debit = negatief voor burger, credit = positief -->
                  <CdtDbtInd>CRDT</CdtDbtInd>
                  <!-- Bij DBIT, vervang Dbtr hierna door Cdtr -->
                  <!-- Bij CRDT, vervang Cdtr hierna door Dbtr -->
                  <Sts>BOOK</Sts>
                  <!-- Transactiedatum -->
                  <BookgDt>
                      <Dt>` + todayDate + `</Dt>
                  </BookgDt>
                  <ValDt>
                      <Dt>` + todayDate + `</Dt>
                  </ValDt>
                  <!-- /Transactiedatum -->
                  <AcctSvcrRef>232070C7H4CYV5</AcctSvcrRef>
                  <BkTxCd>
                      -<Prtry>
                          <Cd>849</Cd>
                          <Issr>INGBANK</Issr>
                      </Prtry>
                  </BkTxCd>
                  <NtryDtls>
                      <TxDtls>
                          <Refs>
                              <InstrId>INNDNL2U20260723000025610002518</InstrId>
                              <EndToEndId>123456789</EndToEndId>
                              <MndtId>5784272</MndtId>
                          </Refs>
                          <AmtDtls>
                              <TxAmt>
                                  <Amt Ccy="EUR">` + amount + `</Amt>
                              </TxAmt>
                          </AmtDtls>
                          <BkTxCd>
                              <Prtry>
                                  <Cd>849</Cd>
                                  <Issr>BNGBANK</Issr>
                              </Prtry>
                          </BkTxCd>
                          <!-- Tegenpartij -->
                          <RltdPties>
                              <Dbtr>
                                  <Nm>Belastingdienst Toeslagen Kantoor Utrecht</Nm>
                              </Dbtr>
                              <DbtrAcct>
                                  -<Id>
                                      <IBAN>NL86INGB0002445588</IBAN>
                                  </Id>
                              </DbtrAcct>
                          </RltdPties>
                          <!-- /Tegenpartij -->
                          <RltdAgts>
                              <DbtrAgt>
                                  <FinInstnId>
                                      <BIC>RABONL2U</BIC>
                                  </FinInstnId>
                              </DbtrAgt>
                          </RltdAgts>
                          <RmtInf>
                              <Ustrd>HHB000001 Zorgtoeslag</Ustrd>
                          </RmtInf>
                      </TxDtls>
                  </NtryDtls>
                  <!-- Zoektermen -->
                  <AddtlNtryInf>/TRTP/SEPA Incasso/REMI/HHB000001 Zorgtoeslag/CSID/NL12ZZZ091567230000/SVCL/CORE/testdata</AddtlNtryInf>
              </Ntry>
          </Stmt>
      </BkToCstmrStmt>
  </Document>`)
 
});

When('a low amount bank transaction is booked to an agreement', () => {

  // Upload testdata CAMT
  cy.visit('/bankzaken/bankafschriften')
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')

  cy.get('input[type="file"]')
    .should('exist')
    .click({ force: true })

  cy.get('input[type="file"]')
    .selectFile('cypress/testdata/paymentAmountTooLow-NoAmountMargin.xml', { force: true })
  
  // Wait for file to be uploaded
  cy.get('[data-test="uploadItem.check"]');

  // Reconciliate the bank transaction to the correct agreement
  cy.visit('/bankzaken/transacties')
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/transacties')

  cy.get('[data-test="transactionsPage.filters.notReconciliated"]')
    .click();
  cy.get('[data-test="transactions.expandFilter"]')
    .click();
  cy.get('#zoektermen')
    .should('be.visible')
    .type('HHB000001 Zorgtoeslag{enter}');
  cy.contains('9,99')
    .click();

  cy.url().should('include', '/bankzaken/transacties/')
  cy.get('[data-test="switch.filterDescription"]') 
    .click({ force: true });
  cy.contains('Alle burgers')
    .click({ force: true });
  cy.contains('Dingus')
    .click();
  cy.contains(uniqueId)
    .click();
 
});

  Then('the low amount bank transaction date is within the alarm timeframe', () => {

    // Get current date
    var todayDate = new Date().toISOString().slice(0, 10);

    cy.readFile('cypress/testdata/paymentAmountTooLow-NoAmountMargin.xml').should('contains', todayDate);
  
  });

  Then('the low amount bank transaction amount is smaller than the sum of the expected amount minus the allowed amount deviation', () => {

    cy.readFile('cypress/testdata/paymentAmountTooLow-NoAmountMargin.xml').should('contains', '9.99');
    
    cy.get('[data-test="transaction.amount"]')
      .contains('9,99');
    cy.get('[data-test="agreement.amount"]')
      .contains('10,00');
   
  });
  
  Then('a "Payment amount too low" signal is created', () => {
  
    cy.wait(3000)
    cy.visit('/signalen')
    cy.url().should('eq', Cypress.config().baseUrl + '/signalen')
  
    // Assertion
    cy.contains('0,01');
    cy.contains('Dingus Bingus');
    cy.contains('9,99');
   
  });

//#endregion

//#region Scenario: expected payment amount, no amount margin

Given('an agreement exists for scenario "expected payment amount, no amount margin"', () => {
  
  // Set unique id names
  uniqueId = Date.now().toString();

  // Create agreements
  burgerDetails.insertAfspraak('Bingus', uniqueId, "10.00", 'NL86INGB0002445588', '5', 'false', '2024-01-01');

  // View burger detail page
  burgers.openBurger('Dingus Bingus')
  burgerDetails.viewAfspraak(uniqueId)

});

Given('an alarm exists for scenario "expected payment amount, no amount margin"', () => {

  afspraakDetails.insertAlarm(uniqueId, "1", "1000", "0");

  // cy.url().should('include', Cypress.config().baseUrl + '/afspraken/')
  // cy.get('h2').contains('Alarm').should('be.visible')
  //   .scrollIntoView() // Scrolls 'Alarm' into view
  
  // afspraakDetails.buttonAlarmToevoegen().click()

  // // Check whether modal is opened and visible
  // cy.get('section[aria-modal="true"]', { timeout: 10000 })
  //   .scrollIntoView()
  //   .should('exist');

  // // Set alarm to 'eenmalig'
  // cy.contains('Meer opties')
  //   .click();
  // cy.get('[data-test="alarmForm.once"]')
  //   .click();

  // // Fill in all required fields
  //     // 'Datum verwachte betaling'
  //         // Set date constants for comparison
  //         const dateNow = new Date().toLocaleDateString('nl-NL', {
  //             year: "numeric",
  //             month: "2-digit",
  //             day: "2-digit",
  //         })

  //     cy.get('[data-test="alarmForm.expectedDate"]')
  //       .type('{selectAll}' + dateNow + '{enter}')
  //       .should('have.value', dateNow)

  //     // 'Toegestane afwijking (in dagen)'
  //     cy.get('[data-test="alarmForm.dateMargin"]')
  //       .type('1')
  //       .should('have.value', '1')

  //     // 'Bedrag verwachte betaling'
  //     cy.get('[data-test="alarmForm.amount"]')
  //       .type('{selectAll}10')
  //       .should('have.value', '10') 

  //     // 'Toegestane afwijking bedrag'
  //     cy.get('[data-test="alarmForm.amountMargin"]')
  //       .type('{selectAll}0{enter}')
  //       .should('have.value', '0')

  // // Click 'Opslaan' button
  // cy.get('[data-test="buttonModal.submit"]')
  //     .click()

  // // Check whether modal is closed
  // cy.get('section[aria-modal="true"]', { timeout: 10000 })
  //     .should('not.exist');

});

Given('a CAMT test file is created with the amount {string}', (amount) => {

  // Get current date
  var todayDate = new Date().toISOString().slice(0, 10);

  // Create file
  cy.writeFile('cypress/testdata/paymentAmountExpected-NoAmountMargin.xml', `<?xml version='1.0' encoding='utf-8'?>
  <Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.02" xmlns_xsi="http://www.w3.org/2001/XMLSchema-instance">
      <BkToCstmrStmt>
          <GrpHdr>
              <MsgId>588d0a9f-439d-4410-8a3e-1354c2a9c55e</MsgId>
              <CreDtTm>2024-04-02T13:58:31.802216</CreDtTm>
              <MsgPgntn>
                  <PgNb>1</PgNb>
                  <LastPgInd>true</LastPgInd>
              </MsgPgntn>
          </GrpHdr>
          <Stmt>
              <Id>13</Id>
              <ElctrncSeqNb>1</ElctrncSeqNb>
              <CreDtTm>2024-04-02T13:58:31.802216</CreDtTm>
              <Acct>
                <Id>
                      <IBAN>NL36ABNA5632579034</IBAN>
                </Id>
                  <Ccy>EUR</Ccy>
                  <Svcr>
                      <FinInstnId>
                          <BIC>ABNANL2A</BIC>
                      </FinInstnId>
                  </Svcr>
              </Acct>
              <Bal>
                  <Tp>
                      <CdOrPrtry>
                          <Cd>OPBD</Cd>
                      </CdOrPrtry>
                  </Tp>
                  <Amt Ccy="EUR">0.00</Amt>
                  <CdtDbtInd>CRDT</CdtDbtInd>
              </Bal>
              <Bal>
                  <Tp>
                      <CdOrPrtry>
                          <Cd>CRDT</Cd>
                      </CdOrPrtry>
                  </Tp>
                  <Amt Ccy="EUR">0.00</Amt>
                  <CdtDbtInd>CRDT</CdtDbtInd>
              </Bal>
              <TxsSummry>
                  <TtlNtries>
                      <NbOfNtries>1</NbOfNtries>
                      <Sum>2002.00</Sum>
                      <TtlNetNtryAmt>2002.00</TtlNetNtryAmt>
                      <CdtDbtInd>DBIT</CdtDbtInd>
                  </TtlNtries>
                  <TtlCdtNtries>
                      <NbOfNtries>0</NbOfNtries>
                      <Sum>0.00</Sum>
                  </TtlCdtNtries>
                  <TtlDbtNtries>
                      <NbOfNtries>1</NbOfNtries>
                      <Sum>2002.00</Sum>
                  </TtlDbtNtries>
              </TxsSummry>
              <Ntry>
                  <!-- Amount voor deze transactie -->
                  <Amt Ccy="EUR">` + amount + `</Amt>
                  <!-- /Amount voor deze transactie -->
                  <!-- Debit = negatief voor burger, credit = positief -->
                  <CdtDbtInd>CRDT</CdtDbtInd>
                  <!-- Bij DBIT, vervang Dbtr hierna door Cdtr -->
                  <!-- Bij CRDT, vervang Cdtr hierna door Dbtr -->
                  <Sts>BOOK</Sts>
                  <!-- Transactiedatum -->
                  <BookgDt>
                      <Dt>` + todayDate + `</Dt>
                  </BookgDt>
                  <ValDt>
                      <Dt>` + todayDate + `</Dt>
                  </ValDt>
                  <!-- /Transactiedatum -->
                  <AcctSvcrRef>232070C7H4CYV5</AcctSvcrRef>
                  <BkTxCd>
                      -<Prtry>
                          <Cd>849</Cd>
                          <Issr>INGBANK</Issr>
                      </Prtry>
                  </BkTxCd>
                  <NtryDtls>
                      <TxDtls>
                          <Refs>
                              <InstrId>INNDNL2U20260723000025610002518</InstrId>
                              <EndToEndId>123456789</EndToEndId>
                              <MndtId>5784272</MndtId>
                          </Refs>
                          <AmtDtls>
                              <TxAmt>
                                  <Amt Ccy="EUR">` + amount + `</Amt>
                              </TxAmt>
                          </AmtDtls>
                          <BkTxCd>
                              <Prtry>
                                  <Cd>849</Cd>
                                  <Issr>BNGBANK</Issr>
                              </Prtry>
                          </BkTxCd>
                          <!-- Tegenpartij -->
                          <RltdPties>
                              <Dbtr>
                                  <Nm>Belastingdienst Toeslagen Kantoor Utrecht</Nm>
                              </Dbtr>
                              <DbtrAcct>
                                  -<Id>
                                      <IBAN>NL86INGB0002445588</IBAN>
                                  </Id>
                              </DbtrAcct>
                          </RltdPties>
                          <!-- /Tegenpartij -->
                          <RltdAgts>
                              <DbtrAgt>
                                  <FinInstnId>
                                      <BIC>RABONL2U</BIC>
                                  </FinInstnId>
                              </DbtrAgt>
                          </RltdAgts>
                          <RmtInf>
                              <Ustrd>HHB000001 Zorgtoeslag</Ustrd>
                          </RmtInf>
                      </TxDtls>
                  </NtryDtls>
                  <!-- Zoektermen -->
                  <AddtlNtryInf>/TRTP/SEPA Incasso/REMI/HHB000001 Zorgtoeslag/CSID/NL12ZZZ091567230000/SVCL/CORE/testdata</AddtlNtryInf>
              </Ntry>
          </Stmt>
      </BkToCstmrStmt>
  </Document>`)
 
});

When('an expected amount bank transaction is booked to an agreement', () => {

  // Upload testdata CAMT
  cy.visit('/bankzaken/bankafschriften')
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')

  cy.get('input[type="file"]')
    .should('exist')
    .click({ force: true })

  cy.get('input[type="file"]')
    .selectFile('cypress/testdata/paymentAmountExpected-NoAmountMargin.xml', { force: true })
  
  // Wait for file to be uploaded
  cy.get('[data-test="uploadItem.check"]');

  // Reconciliate the bank transaction to the correct agreement
  cy.visit('/bankzaken/transacties')
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/transacties')

  cy.get('[data-test="transactionsPage.filters.notReconciliated"]')
    .click();
  cy.get('[data-test="transactions.expandFilter"]')
    .click();
  cy.get('#zoektermen')
    .should('be.visible')
    .type('HHB000001 Zorgtoeslag{enter}');
  cy.contains('10,00')
    .click();

  cy.url().should('include', '/bankzaken/transacties/')
  cy.get('[data-test="switch.filterDescription"]') 
    .click({ force: true });
  cy.contains('Alle burgers')
    .click({ force: true });
  cy.contains('Dingus')
    .click({ force: true });
  cy.contains(uniqueId)
    .click();
 
});

Then('the bank transaction date is within the alarm timeframe', () => {

  // Get current date
  var todayDate = new Date().toISOString().slice(0, 10);

  cy.readFile('cypress/testdata/paymentAmountExpected-NoAmountMargin.xml').should('contains', todayDate);
 
});

Then('the bank transaction amount is equal to the sum of the expected amount plus the allowed amount deviation', () => {

  cy.readFile('cypress/testdata/paymentAmountExpected-NoAmountMargin.xml').should('contains', '10.00');
  
  cy.get('[data-test="agreement.amount"]')
    .contains('10,00');
  
});

Then('no signal is created', () => {

  cy.wait(3000)
  cy.visit('/signalen')
  cy.url().should('eq', Cypress.config().baseUrl + '/signalen')

  // Assertion
  cy.contains('Er zijn geen signalen gevonden');
  
});

//#endregion

//#region Scenario: payment amount too high, no amount margin

Given('an agreement exists for scenario "payment amount too high, no amount margin"', function() {
  
  // Set unique id names
  uniqueId = Date.now().toString();
    
  // Create agreements
  burgerDetails.insertAfspraak('Bingus', uniqueId, "10.00", 'NL86INGB0002445588', '5', 'false', '2024-01-01');

  // View burger detail page
  burgers.openBurger('Dingus Bingus')
  burgerDetails.viewAfspraak(uniqueId)

});

Given('an alarm exists for scenario "payment amount too high, no amount margin"', () => {

  afspraakDetails.insertAlarm(uniqueId, "1", "1000", "0");

  // cy.url().should('include', Cypress.config().baseUrl + '/afspraken/')
  // cy.get('h2').contains('Alarm').should('be.visible')
  //   .scrollIntoView() // Scrolls 'Alarm' into view
  
  // afspraakDetails.buttonAlarmToevoegen().click()

  // // Check whether modal is opened and visible
  // cy.get('section[aria-modal="true"]', { timeout: 10000 })
  //   .scrollIntoView()
  //   .should('exist');

  // // Set alarm to 'eenmalig'
  // cy.contains('Meer opties')
  //   .click();
  // cy.get('[data-test="alarmForm.once"]')
  //   .click();

  // // Fill in all required fields
  //     // 'Datum verwachte betaling'
  //         // Set date constants for comparison
  //         const dateNow = new Date().toLocaleDateString('nl-NL', {
  //             year: "numeric",
  //             month: "2-digit",
  //             day: "2-digit",
  //         })

  //     cy.get('[data-test="alarmForm.expectedDate"]')
  //       .type('{selectAll}' + dateNow + '{enter}')
  //       .should('have.value', dateNow)

  //     // 'Toegestane afwijking (in dagen)'
  //     cy.get('[data-test="alarmForm.dateMargin"]')
  //       .type('1')
  //       .should('have.value', '1')

  //     // 'Bedrag verwachte betaling'
  //     cy.get('[data-test="alarmForm.amount"]')
  //       .type('{selectAll}10')
  //       .should('have.value', '10') 

  //     // 'Toegestane afwijking bedrag'
  //     cy.get('[data-test="alarmForm.amountMargin"]')
  //       .type('{selectAll}0')
  //       .should('have.value', '0')

  // // Click 'Opslaan' button
  // cy.get('[data-test="buttonModal.submit"]')
  //     .click()

  // // Check whether modal is closed
  // cy.get('section[aria-modal="true"]', { timeout: 10000 })
  //     .should('not.exist');

});

Given('a high amount CAMT test file is created with the amount {string}', (amount) => {

  // Get current date
  var todayDate = new Date().toISOString().slice(0, 10);

  // Create file
  cy.writeFile('cypress/testdata/paymentAmountTooHigh-NoAmountMargin.xml', `<?xml version='1.0' encoding='utf-8'?>
  <Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.02" xmlns_xsi="http://www.w3.org/2001/XMLSchema-instance">
      <BkToCstmrStmt>
          <GrpHdr>
              <MsgId>588d0a9f-439d-4410-8a3e-1354c2a9c55e</MsgId>
              <CreDtTm>2024-04-02T13:58:31.802216</CreDtTm>
              <MsgPgntn>
                  <PgNb>1</PgNb>
                  <LastPgInd>true</LastPgInd>
              </MsgPgntn>
          </GrpHdr>
          <Stmt>
              <Id>14</Id>
              <ElctrncSeqNb>1</ElctrncSeqNb>
              <CreDtTm>2024-04-02T13:58:31.802216</CreDtTm>
              <Acct>
                <Id>
                      <IBAN>NL36ABNA5632579034</IBAN>
                </Id>
                  <Ccy>EUR</Ccy>
                  <Svcr>
                      <FinInstnId>
                          <BIC>ABNANL2A</BIC>
                      </FinInstnId>
                  </Svcr>
              </Acct>
              <Bal>
                  <Tp>
                      <CdOrPrtry>
                          <Cd>OPBD</Cd>
                      </CdOrPrtry>
                  </Tp>
                  <Amt Ccy="EUR">0.00</Amt>
                  <CdtDbtInd>CRDT</CdtDbtInd>
              </Bal>
              <Bal>
                  <Tp>
                      <CdOrPrtry>
                          <Cd>CRDT</Cd>
                      </CdOrPrtry>
                  </Tp>
                  <Amt Ccy="EUR">0.00</Amt>
                  <CdtDbtInd>CRDT</CdtDbtInd>
              </Bal>
              <TxsSummry>
                  <TtlNtries>
                      <NbOfNtries>1</NbOfNtries>
                      <Sum>2002.00</Sum>
                      <TtlNetNtryAmt>2002.00</TtlNetNtryAmt>
                      <CdtDbtInd>DBIT</CdtDbtInd>
                  </TtlNtries>
                  <TtlCdtNtries>
                      <NbOfNtries>0</NbOfNtries>
                      <Sum>0.00</Sum>
                  </TtlCdtNtries>
                  <TtlDbtNtries>
                      <NbOfNtries>1</NbOfNtries>
                      <Sum>2002.00</Sum>
                  </TtlDbtNtries>
              </TxsSummry>
              <Ntry>
                  <!-- Amount voor deze transactie -->
                  <Amt Ccy="EUR">` + amount + `</Amt>
                  <!-- /Amount voor deze transactie -->
                  <!-- Debit = negatief voor burger, credit = positief -->
                  <CdtDbtInd>CRDT</CdtDbtInd>
                  <!-- Bij DBIT, vervang Dbtr hierna door Cdtr -->
                  <!-- Bij CRDT, vervang Cdtr hierna door Dbtr -->
                  <Sts>BOOK</Sts>
                  <!-- Transactiedatum -->
                  <BookgDt>
                      <Dt>` + todayDate + `</Dt>
                  </BookgDt>
                  <ValDt>
                      <Dt>` + todayDate + `</Dt>
                  </ValDt>
                  <!-- /Transactiedatum -->
                  <AcctSvcrRef>232070C7H4CYV5</AcctSvcrRef>
                  <BkTxCd>
                      -<Prtry>
                          <Cd>849</Cd>
                          <Issr>INGBANK</Issr>
                      </Prtry>
                  </BkTxCd>
                  <NtryDtls>
                      <TxDtls>
                          <Refs>
                              <InstrId>INNDNL2U20260723000025610002518</InstrId>
                              <EndToEndId>123456789</EndToEndId>
                              <MndtId>5784272</MndtId>
                          </Refs>
                          <AmtDtls>
                              <TxAmt>
                                  <Amt Ccy="EUR">` + amount + `</Amt>
                              </TxAmt>
                          </AmtDtls>
                          <BkTxCd>
                              <Prtry>
                                  <Cd>849</Cd>
                                  <Issr>BNGBANK</Issr>
                              </Prtry>
                          </BkTxCd>
                          <!-- Tegenpartij -->
                          <RltdPties>
                              <Dbtr>
                                  <Nm>Belastingdienst Toeslagen Kantoor Utrecht</Nm>
                              </Dbtr>
                              <DbtrAcct>
                                  -<Id>
                                      <IBAN>NL86INGB0002445588</IBAN>
                                  </Id>
                              </DbtrAcct>
                          </RltdPties>
                          <!-- /Tegenpartij -->
                          <RltdAgts>
                              <DbtrAgt>
                                  <FinInstnId>
                                      <BIC>RABONL2U</BIC>
                                  </FinInstnId>
                              </DbtrAgt>
                          </RltdAgts>
                          <RmtInf>
                              <Ustrd>HHB000001 Zorgtoeslag</Ustrd>
                          </RmtInf>
                      </TxDtls>
                  </NtryDtls>
                  <!-- Zoektermen -->
                  <AddtlNtryInf>/TRTP/SEPA Incasso/REMI/HHB000001 Zorgtoeslag/CSID/NL12ZZZ091567230000/SVCL/CORE/testdata</AddtlNtryInf>
              </Ntry>
          </Stmt>
      </BkToCstmrStmt>
  </Document>`)
 
});

When('a high amount bank transaction is booked to an agreement', () => {

  // Upload testdata CAMT
  cy.visit('/bankzaken/bankafschriften')
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')

  cy.get('input[type="file"]')
    .should('exist')
    .click({ force: true })

  cy.get('input[type="file"]')
    .selectFile('cypress/testdata/paymentAmountTooHigh-NoAmountMargin.xml', { force: true })
  
  // Wait for file to be uploaded
  cy.get('[data-test="uploadItem.check"]');

  // Reconciliate the bank transaction to the correct agreement
  cy.visit('/bankzaken/transacties')
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/transacties')

  cy.get('[data-test="transactionsPage.filters.notReconciliated"]')
    .click();
  cy.get('[data-test="transactions.expandFilter"]')
    .click();
  cy.get('#zoektermen')
    .should('be.visible')
    .type('HHB000001 Zorgtoeslag{enter}');
  cy.contains('10,01')
    .click();

  cy.url().should('include', '/bankzaken/transacties/')
  cy.get('[data-test="switch.filterDescription"]') 
    .click({ force: true });
  cy.contains('Alle burgers')
    .click({ force: true });
  cy.contains('Dingus')
    .click();
  cy.contains(uniqueId)
    .click();
 
});

Then('the high amount bank transaction date is within the alarm timeframe', () => {

  // Get current date
  var todayDate = new Date().toISOString().slice(0, 10);

  cy.readFile('cypress/testdata/paymentAmountTooHigh-NoAmountMargin.xml').should('contains', todayDate);
 
});

Then('the high amount bank transaction amount is greater than the sum of the expected amount plus the allowed amount deviation', () => {

  cy.readFile('cypress/testdata/paymentAmountTooHigh-NoAmountMargin.xml').should('contains', '10.01');
  
  cy.get('[data-test="transaction.amount"]')
    .contains('10,01');
  cy.contains('10,00');
 
});

Then('a "Payment amount too high" signal is created', () => {

  cy.wait(3000)
  cy.visit('/signalen')
  cy.url().should('eq', Cypress.config().baseUrl + '/signalen')

  // Assertion
  cy.contains('0,01');
  cy.contains('Dingus Bingus');
  cy.contains('10,01');
 
});

//#endregion
