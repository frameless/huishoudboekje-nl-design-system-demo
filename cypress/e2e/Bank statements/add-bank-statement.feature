# cypress/e2e/Alarms/add-bank-statement.feature
Feature: add bank statement

  # Upload a customer statement message file.

  Background:
    # Given I am logged in as an authorised site user

  @cleanupStatement
  Scenario: no transactions in file
    Given I view the "Bank statement" page
    When I click the "Add bank statement" button
    When I select "Empty_customer_statement_message_CAMT.053_v2.xml"
    Then the "Add bank statement" modal opens
    Then the "Close modal" button is displayed
    Then the "Empty_customer_statement_message_CAMT.053_v2.xml" filename is displayed
    Then the file upload warning status icon is displayed
    Then the "No transactions in file" text is displayed
    When I click the "Close modal" button
    Then the "Empty_customer_statement_message_CAMT.053_v2.xml" file is displayed
    Then 0 transactions were added

  # ready to add to e2e tests
  @skip
  Scenario: add bank transaction with negative amount
    Given I view the "Bank statement" page
    When I click the "Add bank statement" button
    When I select "Negative_amount_CAMT.053_v1.xml"
    Then the "Add bank statement" modal opens
    Then the close "Add bank statement" modal button is displayed
    Then the "Negative_amount_CAMT.053_v1.xml" filename is displayed
    Then the file upload error status icon is displayed
    Then the "Customer statement message contains entry with negative amount" notification is displayed

  # ready to add to e2e tests
  @skip
  Scenario: invalid format
    Given I view the "Bank statement" page
    When I click the "Add bank statement" button
    When I select "Wrong_format_CAMT.053_v1.xml"
    Then the "Add bank statement" modal opens
    Then the close "Add bank statement" modal button is displayed
    Then the "Wrong_format_CAMT.053_v1.xml" filename is displayed
    Then the file upload error status icon is displayed
    Then the "Format is not CAMT.053.001.02" text is displayed
    Then 0 transactions were added

  # ready to add to e2e tests
  @skip
  Scenario: other bank account iban
    Given I view the "Bank statement" page
    When I click the "Add bank statement" button
    When I select "Wrong_bank_account_iban_CAMT.053_v1.xml"
    Then the "Add bank statement" modal opens
    Then the close "Add bank statement" modal button is displayed
    Then the "Wrong_bank_account_iban_CAMT.053_v1.xml" filename is displayed
    Then the file upload error status icon is displayed
    Then the "Bank account in file does not match bank account in application" text is displayed
    Then 0 transactions where added

  # ready to add to e2e tests
  @skip
  Scenario: duplicate file
    Given the "Gemeente Utrecht" organisation exists
    Given the "Gemeente Utrecht" organisation has a department "GEMEENTE UTRECHT" with the "NL71ABNA0411065785" bank account
    Given I view the "Bank statement" page
    When I click the "Add bank statement" button
    When I select "Duplicate_bank_transaction_1_CAMT.053_v1.xml"
    Then the "Add bank statement" modal opens
    Then the close "Add bank statement" modal button is displayed
    Then the "Duplicate_bank_transaction_1_CAMT.053_v1.xml" filename is displayed
    Then the file upload success status icon is displayed
    When I close the modal
    Then the "Duplicate_bank_transaction_1_CAMT.053_v1.xml" filename is displayed

    When I view the "Bank transactions" page
    When I click the "Advanced search options" button
    When I set the "Date from" filter to "3-4-2023"
    When I set the "Date to" filter to "3-4-2023"
    Then a bank transaction with "GEMEENTE UTRECHT" name is displayed
    Then the bank transaction amount is "-234,56"

    When I view the "Bank statement" page
    When I click the "Add bank statement" button
    When I select "Duplicate_bank_transaction_2_CAMT.053_v1.xml"
    Then the "Add bank statement" modal opens
    Then the close "Add bank statement" modal button is displayed
    Then the "Duplicate_bank_transaction_2_CAMT.053_v1.xml" filename is displayed
    Then the file upload error status icon is displayed
    Then the "Duplicate file" text is displayed
    When I close the modal
    Then the "Duplicate_bank_transaction_2_CAMT.053_v1.xml" filename is not displayed
    Then 1 bank transaction with "GEMEENTE UTRECHT" name is displayed
    Then the bank transaction amount is "-234,56"

  @cleanupStatement
  Scenario: add bank transaction without iban
    When I view the "Bank statement" page
    When I click the "Add bank statement" button
    When I select "camt053-kosten-betalingsverkeer-20231130.xml"
    Then the "Add bank statement" modal opens
    Then the close "Add bank statement" modal button is displayed
    Then the "camt053-kosten-betalingsverkeer-20231130.xml" filename is displayed
    Then the file upload success status icon is displayed

    When I click the close "Add bank statement" modal button
    Then the "Add bank statement" modal closes
    Then the bank statement filename is displayed
    Then the bank statement upload timestamp is displayed
    Then the "Delete bank statement" button is displayed
    Then the "Add bank statement" button is displayed

    When I view the "Bank transactions" page
    When I click the "Advanced search options" button
    When I set the "Date from" filter to "1-12-2023"
    When I set the "Date to" filter to "1-12-2023"
    Then a bank transaction with "Onbekende IBAN" name is displayed
    Then the bank transaction amount is "-281,94"

    When I click the "-281,94" bank transaction
    When I click the "Rubriek" button
    When I select the "Lokale lasten" option
    Then a success notification containing 'De transactie is afgeletterd' is displayed
    Then the status is "Handmatig afgeletterd"
    Then the "Rubriek" button is not displayed
    Then the classification is "Lokale lasten"
    Then the "Afletteren ongedaan maken" button is displayed

  @cleanupStatement
  Scenario: add bank transaction with payment mandate
    Given the "Gemeente Utrecht" organisation exists
    Given the "Gemeente Utrecht" organisation has a department "GEMEENTE UTRECHT" with the "NL71ABNA0411065785" bank account
    Given I view the "Bank statement" page
    When I click the "Add bank statement" button
    When I select "Payment_mandate_CAMT.053_v1.xml"
    Then the "Add bank statement" modal opens
    Then the "Close modal" button is displayed
    Then the "Payment_mandate_CAMT.053_v1.xml" filename is displayed
    Then the file upload success status icon is displayed

    When I click the "Close modal" button
    Then the "Payment_mandate_CAMT.053_v1.xml" filename is displayed
    Then the bank statement upload timestamp is displayed
    Then the "Delete bank statement" button is displayed
    Then the "Add bank statement" button is displayed

    When I view the "Bank transactions" page
    When I click the "Advanced search options" button
    When I set the "Date from" filter to "15-2-2024"
    When I set the "Date to" filter to "15-2-2024"
    Then a bank transaction with "GEMEENTE UTRECHT" name is displayed
    Then the bank transaction amount is "-654,32"

    When I click the "-654,32" bank transaction
    Then the bank transaction description contains the "123456789" end-to-end id
    Then the bank transaction description contains the "5784272" mandate id

  @cleanupStatement
  Scenario: add basic bank transaction
    Given the "Gemeente Utrecht" organisation exists
    Given the "Gemeente Utrecht" organisation has a department "GEM UTRECHT WENI" with the "NL76BNGH0285178598" bank account
    Given I view the "Bank statement" page
    When I click the "Add bank statement" button
    When I select "Basic_bank_transaction_CAMT.053_v1.xml"
    Then the "Add bank statement" modal opens
    Then the "Close modal" button is displayed
    Then the "Basic_bank_transaction_CAMT.053_v1.xml" filename is displayed
    Then the file upload success status icon is displayed

    When I click the "Close modal" button
    Then the "Basic_bank_transaction_CAMT.053_v1.xml" filename is displayed
    Then the bank statement upload timestamp is displayed
    Then the "Delete bank statement" button is displayed
    Then the "Add bank statement" button is displayed

    When I view the "Bank transactions" page
    When I click the "Advanced search options" button
    When I set the "Date from" filter to "27-10-2023"
    When I set the "Date to" filter to "27-10-2023"
    Then a bank transaction with "GEM UTRECHT WENI" name is displayed
    Then the bank transaction amount is "1251,26"

    When I click the "1251,26" bank transaction
    Then the bank transaction description contains "Normale bijschrijving"
    Then the bank transaction description contains the "000000013289682" end-to-end id
