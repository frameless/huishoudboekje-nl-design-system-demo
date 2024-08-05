import Generic from "./Generic";

const generic = new Generic()

class Bankafschriften {

    visit() {
      cy.visit("/bankzaken/bankafschriften")
    }

    uploadOnlyNegativeAmount(amount) {

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
        cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')
    
        cy.get('input[type="file"]')
            .should('exist')
            .click({ force: true })
    
        cy.get('input[type="file"]')
            .selectFile('cypress/testdata/paymentAmountNegative.xml', { force: true })
    
        // Wait for file to upload
        cy.wait(3000);
    
        // Contains file
        cy.contains('paymentAmountNegative.xml')
        cy.get('[aria-label="Close"]')
            .should('be.visible')
            .click();

    }
    
    consolidateOnlyNegativeAmount(amount) {
  
        // Reconciliate the bank transaction to the correct agreement
        cy.visit('/bankzaken/transacties')
        cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/transacties')
  
        cy.get('[data-test="transactionsPage.filters.notReconciliated"]')
          .click();
        cy.get('[data-test="transactions.expandFilter"]')
          .click();
        cy.get('#zoektermen')
          .type('HHB000001 Zorgtoeslag{enter}');
        cy.contains(amount)
          .click();
  
        cy.url().should('include', '/bankzaken/transacties/')
        cy.get('[data-test="switch.filterDescription"]') 
          .click({ force: true });
        cy.contains('Alle burgers')
          .click({ force: true });
        cy.contains('Dingus')
          .click();
        cy.get('[aria-label="Remove Belastingdienst Toeslagen Kantoor Utrecht"]')
          .click();
        cy.contains('Loon')
          .click();
  
        Step(this, "a success notification containing 'De transactie is afgeletterd' is displayed");
  
      }

    consolidateNegativeAmount(amount) {

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
      cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')

      cy.get('input[type="file"]')
        .should('exist')
        .click({ force: true })

      cy.get('input[type="file"]')
        .selectFile('cypress/testdata/paymentAmountNegative.xml', { force: true })

      // Wait for file to upload
      cy.wait(3000);

      // Contains file
      cy.contains('paymentAmountNegative.xml')
      cy.get('[aria-label="Close"]')
        .should('be.visible')
        .click();

      // Reconciliate the bank transaction to the correct agreement
      cy.visit('/bankzaken/transacties')
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
      cy.get('[data-test="switch.filterDescription"]') 
        .click({ force: true });
      cy.contains('Alle burgers')
        .click({ force: true });
      cy.contains('Dingus')
        .click();
      cy.get('[aria-label="Remove Belastingdienst Toeslagen Kantoor Utrecht"]')
        .click();
      cy.contains('Loon')
        .click();

      // Check success message
	generic.notificationSuccess('De transactie is afgeletterd');

    }
   
}

export default Bankafschriften;