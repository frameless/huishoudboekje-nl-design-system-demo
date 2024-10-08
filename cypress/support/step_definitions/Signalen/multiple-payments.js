// cypress/support/step_definitions/Signals/create-signal-on-multiple-payments.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

import Burgers from "../../../pages/Burgers";
import BurgersDetails from "../../../pages/BurgerDetails";
import AfspraakDetails from "../../../pages/AfspraakDetails";

const afspraakDetails = new AfspraakDetails()
const burgers = new Burgers();
const burgerDetails = new BurgersDetails();


let uniqueId = Date.now().toString() + 1;

//#region Scenario: multiple payments within timeframe

Given('an agreement exists for scenario "multiple payments within timeframe"', () => {

  // Create agreements
  burgerDetails.insertAfspraak('Bingus', uniqueId, "10.00", 'NL86INGB0002445588', '1', 'true', '2024-01-01');

  // View burger detail page
  burgers.openBurger('Dingus Bingus')
  burgerDetails.viewAfspraak(uniqueId)

});

Given('an alarm exists for scenario "multiple payments within timeframe"', () => {

//   afspraakDetails.insertAlarm(uniqueId, "1", "1000", "0");

//   burgers.openBurger('Dingus Bingus')
//   burgerDetails.viewAfspraak(uniqueId)

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

  // Check success message
  Step(this, "a success notification containing 'alarm' is displayed");

});

Given('two CAMT test files are created with the same transaction date', () => {

  // Get current date
  var todayDate = new Date().toISOString().slice(0, 10);

  // Create file 1
  cy.writeFile('cypress/testdata/paymentMultiple1.xml', `<?xml version='1.0' encoding='utf-8'?>
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
              <Id>2</Id>
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
                  <Amt Ccy="EUR">10.00</Amt>
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
                                  <Amt Ccy="EUR">10.00</Amt>
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

  // Create file 2
  cy.writeFile('cypress/testdata/paymentMultiple2.xml', `<?xml version='1.0' encoding='utf-8'?>
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
              <Id>3</Id>
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
                  <Amt Ccy="EUR">10.00</Amt>
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
                                  <Amt Ccy="EUR">10.00</Amt>
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

When('both bank transactions are reconciliated on the same agreement', () => {

  // Test file 1
    // Upload test file 1 CAMT
    cy.visit('/bankzaken/bankafschriften')
    cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')

    cy.get('input[type="file"]')
      .should('exist')
      .click({ force: true })

    cy.get('input[type="file"]')
      .selectFile('cypress/testdata/paymentMultiple1.xml', { force: true })

    // Wait for file to be uploaded
    cy.get('[data-test="uploadItem.check"]');
    cy.get('[aria-label="Close"]')
      .should('be.visible')
      .click();

    // Reconciliate the bank transactions to the correct agreement
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
      .click();
    cy.contains(uniqueId)
      .click();

    // Confirm afletteren
    cy.get('[data-test="button.confirmAfletter"]').click();
 
    // Check success message
    Step(this, "a success notification containing 'transactie' is displayed");

  // Test file 2
    // Upload test files CAMT
    cy.visit('/bankzaken/bankafschriften')
    cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')
  
    cy.get('input[type="file"]')
      .should('exist')
      .click({ force: true })
  
    cy.get('input[type="file"]')
      .selectFile('cypress/testdata/paymentMultiple2.xml', { force: true })

    // Wait for file to be uploaded
    cy.get('[data-test="uploadItem.check"]');
    cy.get('[aria-label="Close"]')
      .should('be.visible')
      .click();
  
    // Reconciliate the bank transactions to the correct agreement
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
      .click();
    cy.contains(uniqueId)
      .click();

    // Confirm afletteren
    cy.get('[data-test="button.confirmAfletter"]').click();
    
    // Check success message
    Step(this, "a success notification containing 'transactie' is displayed");
    
});

Then('a "Multiple payments" signal is created', () => {

  // Wait for signals to be triggered in frontend
  cy.wait(3000)

  // Navigate to page
  cy.visit('/signalen')
  cy.url().should('eq', Cypress.config().baseUrl + '/signalen')

  // Assertion
  cy.contains('meerdere transacties gevonden');
  cy.contains(uniqueId);
  cy.contains('Dingus Bingus');
  cy.contains('10,00');
 
});

//#endregion
