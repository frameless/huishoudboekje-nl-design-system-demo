// cypress/support/step_definitions/Alarms/create-alarm.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region Scenario: view toggle form

Then('the negative account balance alarm toggle label "Alarm bij negatief saldo" is displayed in the section "Saldo"', () => {

  cy.get('[data-test="citizen.sectionBalance"]')
    .contains('Alarm bij negatief saldo');

});

Then('the negative account balance alarm toggle is displayed', () => {

  cy.get('[data-test="citizen.toggleNegativeBalance"]')
    .should('be.visible');

});

Then('the negative account balance alarm toggle is set to enabled', () => {

  cy.get('[data-test="citizen.sectionBalance"]')
    .find('label[data-checked]')
    .should('be.visible')

});

//#endregion

//#region Scenario: enable toggle

Given("the citizen's account balance is 0", () => {

  cy.get('[data-test="citizen.balance"]')
    .contains('€ 0,00');

});

Given('the citizen has an agreement "Loon"', () => {

  // Already on correct page, so click 'Toevoegen' button
  cy.get('[data-test="button.Add"]')
    .click();

  // Add agreement with test department
  cy.url().should('contains', '/afspraken/toevoegen'); 
  cy.get('[data-test="radio.agreementOrganization"]')
    .click();
  cy.get('#organisatie')
    .type('Belast');
  cy.contains('ingdienst')
    .click();
  // Check auto-fill
  cy.contains('Graadt van Roggenweg');
  // Fill in IBAN
  cy.get('#tegenrekening')
    .type('NL86');
  cy.contains('0002')
    .click();

  // Payment direction: Toeslagen
  cy.get('[data-test="radio.agreementIncome"]')
    .click();
  cy.get('#rubriek')
    .click()
    .contains('Toeslagen')
    .click();
  cy.get('[data-test="select.agreementIncomeDescription"]')
    .type('Loon');
  cy.get('[data-test="select.agreementIncomeAmount"]')
    .type('10');
  cy.get('[data-test="button.Submit"]')
    .click();

  // Check success message
  cy.get('[data-status="success"]')
    .contains('afspraak')
    .should('be.visible');

});

When('I set the negative account balance alarm toggle to enabled', () => {

  Step(this, 'I open the citizen overview page for "Dingus Bingus"');

  cy.get('[data-test="citizen.sectionBalance"]')
    .find('label[class^="chakra-switch"]')
    .click()
  cy.waitForReact()
  cy.get('input[type="checkbox"]')
    .should('be.visible')

  cy.wait(1000);

});

When('I select a CAMT test file with negative payment amount {string}', (amount) => {

// Get current date
var todayDate = new Date().toISOString().slice(0, 10);

// Create file
cy.writeFile('cypress/testdata/paymentAmountNegative.xml', `<?xml version='1.0' encoding='utf-8'?>
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
            <Id>1</Id>
            <ElctrncSeqNb>1</ElctrncSeqNb>
            <CreDtTm>2024-04-02T13:58:31.802216</CreDtTm>
            <Acct>
                <Id>
                    <IBAN>NL86INGB0002445588</IBAN>
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
                <Amt Ccy="EUR">123.00</Amt>
                <!-- /Amount voor deze transactie -->
                <!-- Debit = negatief voor burger, credit = positief -->
                <CdtDbtInd>DBIT</CdtDbtInd>
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
                            <Cdtr>
                                <Nm>Belastingdienst Toeslagen Kantoor Utrecht</Nm>
                            </Cdtr>
                            <CdtrAcct>
                                -<Id>
                                    <IBAN>NL86INGB0002445588</IBAN>
                                </Id>
                            </CdtrAcct>
                        </RltdPties>
                        <!-- /Tegenpartij -->
                        <RltdAgts>
                            <CdtrAgt>
                                <FinInstnId>
                                    <BIC>RABONL2U</BIC>
                                </FinInstnId>
                            </CdtrAgt>
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

  // Upload testdata CAMT
  cy.visit('/bankzaken/bankafschriften')
  cy.waitForReact()
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')
  
  cy.get('input[type="file"]')
    .should('exist')
    .click({ force: true })

  cy.get('input[type="file"]')
    .selectFile('cypress/testdata/paymentAmountNegative.xml', { force: true })
  cy.wait(3000);

});

When('the CAMT test file with a negative payment amount is displayed', (amount) => {
  
  cy.contains('paymentAmountNegative.xml')
  cy.get('[aria-label="Close"]')
    .should('be.visible')
    .click();

  });

When('the negative amount bank transaction is booked to the agreement "Loon"', () => {
  
  // Reconciliate the bank transaction to the correct agreement
  cy.visit('/bankzaken/transacties')
  cy.waitForReact()
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/transacties')
  
  cy.get('[data-test="transactionsPage.filters.notReconciliated"]')
    .click();
  cy.get('[data-test="transactions.expandFilter"]')
    .click();
  cy.get('#zoektermen')
    .type('HHB000001 Zorgtoeslag{enter}');
  cy.contains('10,00')
    .click();
  
  cy.url().should('include', '/bankzaken/transacties/')
  cy.contains('Alle burgers')
    .click({ force: true });
  cy.contains('Dingus')
    .click();
  cy.get('[aria-label="Remove Belastingdienst Toeslagen Kantoor Utrecht"]')
    .click();
  cy.contains('Loon')
    .click();

  Step(this, "a success notification containing 'De transactie is afgeletterd' is displayed");
    
  });


//#endregion

//#region Scenario: disable toggle

When('I set the negative account balance alarm toggle to disabled', () => {

  Step(this, 'I open the citizen overview page for "Dingus Bingus"');

  cy.get('[data-test="citizen.sectionBalance"]')
    .find('label[data-checked]')
    .should('be.visible')
    .click()
  cy.waitForReact()
  cy.get('input[type="checkbox"]')
    .should('be.visible')

  cy.wait(1000);

});

//#endregion
