// cypress/support/step_definitions/Signals/create-signal-on-unexpected-payment.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

import Burgers from "../../../../pages/Burgers";
import BurgersDetails from "../../../../pages/BurgerDetails";
import AfspraakDetails from "../../../../pages/AfspraakDetails";

const burgers = new Burgers();
const burgerDetails = new BurgersDetails();
const afspraakDetails = new AfspraakDetails();

let uniqueId = 0;

//#region Scenario: payment amount too high, no amount margin, before timeframe

Given('an agreement exists for scenario "payment amount too high, no amount margin, before timeframe"', () => {
  
  // Set unique id names
  uniqueId = Date.now().toString();

  // Create agreements
  burgerDetails.insertAfspraak('Bingus', uniqueId, "10.00", 'NL86INGB0002445588', '1', 'true', '2024-01-01');

  // View burger detail page
  burgers.openBurger('Dingus Bingus')
  burgerDetails.viewAfspraak(uniqueId)
  
});

Given('an alarm exists for scenario "payment amount too high, no amount margin, before timeframe"', () => {

  afspraakDetails.insertAlarm(uniqueId, "0", "1000", "0");

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
  //       .type('0')
  //       .should('have.value', '0')

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

Given('a high amount CAMT test file is created with the amount {string} and transaction date before the alarm timeframe', (amount) => {

  // Get previous date
  var todayDate = new Date();
  var yesterdayUnix = new Date(todayDate.getTime() - 24 * 60 * 60 * 1000);
  var yesterdayDate = yesterdayUnix.toISOString().slice(0, 10);

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
              <Id>7</Id>
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
                      <Dt>` + yesterdayDate + `</Dt>
                  </BookgDt>
                  <ValDt>
                      <Dt>` + yesterdayDate + `</Dt>
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

When('a high amount bank transaction with transaction date before the alarm timeframe is booked to an agreement', () => {

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

//#endregion

//#region Scenario: payment amount too high, no amount margin, on start of timeframe

Given('an agreement exists for scenario "payment amount too high, no amount margin, on start of timeframe"', () => {
  
  // Set unique id names
  uniqueId = Date.now().toString();

  // Create agreements
  burgerDetails.insertAfspraak('Bingus', uniqueId, "10.00", 'NL86INGB0002445588', '1', 'true', '2024-01-01');

  // View burger detail page
  burgers.openBurger('Dingus Bingus')
  burgerDetails.viewAfspraak(uniqueId)

});

Given('an alarm exists for scenario "payment amount too high, no amount margin, on start of timeframe"', () => {

  //afspraakDetails.insertAlarm(uniqueId, "0", "1000", "0");

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
        .type('0')
        .should('have.value', '0')

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

Given('a high amount CAMT test file is created with the amount {string} and transaction date on start of the alarm timeframe', (amount) => {

  // Get today's date
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
              <Id>8</Id>
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

When('a high amount bank transaction with transaction date on start of the alarm timeframe is booked to an agreement', () => {

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

Then('the high amount bank transaction date is equal to the start of the alarm timeframe', () => {

  const dateNow = new Date().toLocaleDateString('nl-NL', {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  
  cy.contains(dateNow);
 
});

//#endregion

//#region Scenario: payment amount too high, no amount margin, in timeframe

Given('an agreement exists for scenario "payment amount too high, no amount margin, in timeframe"', () => {
  
  // Set unique id names
  uniqueId = Date.now().toString();

  // Create agreements
  burgerDetails.insertAfspraak('Bingus', uniqueId, "10.00", 'NL86INGB0002445588', '1', 'true', '2024-01-01');

  // View burger detail page
  burgers.openBurger('Dingus Bingus')
  burgerDetails.viewAfspraak(uniqueId)

});

Given('an alarm exists for scenario "payment amount too high, no amount margin, in timeframe"', () => {

  afspraakDetails.insertAlarm(uniqueId, "5", "1000", "0");

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
  //       .type('5')
  //       .should('have.value', '5')

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

Given('a high amount CAMT test file is created with the amount {string} and transaction date in the alarm timeframe', (amount) => {

  // Get today's date
  var todayDate = new Date().toISOString().slice(0, 10);

  // Get tomorrow's date
  var date = new Date();
  var tomorrowUnix = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  var tomorrowDate = tomorrowUnix.toISOString().slice(0, 10);

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
              <Id>9</Id>
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
                      <Dt>` + tomorrowDate + `</Dt>
                  </BookgDt>
                  <ValDt>
                      <Dt>` + tomorrowDate + `</Dt>
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

When('a high amount bank transaction with transaction date within the alarm timeframe is booked to an agreement', () => {

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

Then('the high amount bank later transaction date is within the alarm timeframe', () => {

  // Get tomorrow's date
  var date = new Date();
  var tomorrowUnix = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  var tomorrowDate = tomorrowUnix.toLocaleDateString('nl-NL', {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  cy.get('[data-test="transaction.date"]')
    .contains(tomorrowDate);
 
});

//#endregion

//#region Scenario: payment amount too high, no amount margin, on end of timeframe

Given('an agreement exists for scenario "payment amount too high, no amount margin, on end of timeframe"', () => {
  
  // Set unique id names
  uniqueId = Date.now().toString();

  // Create agreements
  burgerDetails.insertAfspraak('Bingus', uniqueId, "10.00", 'NL86INGB0002445588', '1', 'true', '2024-01-01');

  // View burger detail page
  burgers.openBurger('Dingus Bingus')
  burgerDetails.viewAfspraak(uniqueId)

});

Given('an alarm exists for scenario "payment amount too high, no amount margin, on end of timeframe"', () => {

  afspraakDetails.insertAlarm(uniqueId, "5", "1000", "0");

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
  //       .type('5')
  //       .should('have.value', '5')

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

Given('a high amount CAMT test file is created with the amount {string} and transaction date on end of alarm timeframe', (amount) => {

  // Get five day later's date
  var todayDate = new Date().toISOString().slice(0, 10);

  // Get five day later's date
  var date = new Date();
  var fiveUnix = new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000);
  var fiveDate = fiveUnix.toISOString().slice(0, 10);

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
              <Id>10</Id>
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
                      <Dt>` + fiveDate + `</Dt>
                  </BookgDt>
                  <ValDt>
                      <Dt>` + fiveDate + `</Dt>
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

When('a high amount bank transaction with transaction date on end of the alarm timeframe is booked to an agreement', () => {

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

Then('the high amount bank transaction date is on the end date of the alarm timeframe', () => {

  // Get five day later's date
  var date = new Date();
  var fiveUnix = new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000);
  var fiveDate = fiveUnix.toLocaleDateString('nl-NL', {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  cy.get('[data-test="transaction.date"]')
    .contains(fiveDate);
 
});

//#endregion

//#region Scenario: payment amount too high, no amount margin, after timeframe

Given('an agreement exists for scenario "payment amount too high, no amount margin, after timeframe"', () => {
  
  // Set unique id names
  uniqueId = Date.now().toString();

  // Create agreements
  burgerDetails.insertAfspraak('Bingus', uniqueId, "10.00", 'NL86INGB0002445588', '1', 'true', '2024-01-01');

  // View burger detail page
  burgers.openBurger('Dingus Bingus')
  burgerDetails.viewAfspraak(uniqueId)

});

Given('an alarm exists for scenario "payment amount too high, no amount margin, after timeframe"', () => {

  afspraakDetails.insertAlarm(uniqueId, "0", "1000", "0");

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
  //       .type('0')
  //       .should('have.value', '0')

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

Given('a high amount CAMT test file is created with the amount {string} and transaction date after alarm timeframe', (amount) => {

  // Get five day later's date
  var todayDate = new Date().toISOString().slice(0, 10);

  // Get five day later's date
  var date = new Date();
  var tomorrowUnix = new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000);
  var tomorrowDate = tomorrowUnix.toISOString().slice(0, 10);

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
              <Id>11</Id>
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
                      <Dt>` + tomorrowDate + `</Dt>
                  </BookgDt>
                  <ValDt>
                      <Dt>` + tomorrowDate + `</Dt>
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

When('a high amount bank transaction with transaction date after the alarm timeframe is booked to an agreement', () => {

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

Then('the high amount bank transaction date is after the alarm timeframe', () => {

  // Get tomorrow's date
  var date = new Date();
  var tomorrowUnix = new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000);
  var tomorrowDate = tomorrowUnix.toLocaleDateString('nl-NL', {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  cy.get('[data-test="transaction.date"]')
    .contains(tomorrowDate);
 
});

//#endregion