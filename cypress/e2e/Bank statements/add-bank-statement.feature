# cypress/e2e/Alarms/add-bank-statement.feature
Feature: add bank statement

  # Upload a bank statement and extract bank transaction data.

  Background:
    # Given I am logged in as an authorised site user

  # Scenario: add bank transaction with unknown iban
  #   When I view the "Bank statement" page
  #   When I click the "Add bank statement" button
  #   When I select "camt onbekende iban.xml"
  #   Then the "Add bank statement" modal opens
  #   Then the "Close modal" button is displayed
  #   Then the selected filename is displayed
  #   Then the file upload status icon is displayed

  #   When I click the "Close modal" button
  #   Then the modal closes
  #   Then the bank statement filename is displayed
  #   Then the bank statement upload timestamp is displayed
  #   Then the "Delete bank statement" button is displayed
  #   Then the "Add bank statement" button is displayed

  #   When I view the "Bank transactions" page
  #   When I click the "Advanced search options" button
  #   When I set the "Date from" filter to "9-2-2024"
  #   When I set the "Date to" filter to "9-2-2024"
  #   Then a bank transaction with "Onbekende IBAN" name is displayed
  #   Then the bank transaction amount is "-123,45"

  #   When I click the bank transaction
  #   When I select an agreement
  #   Then a notification of failure is displayed

  Scenario: add bank transaction without iban
    When I view the "Bank statement" page
    When I click the "Add bank statement" button
    When I select "camt053-kosten-betalingsverkeer-20231130.xml"
    Then the "Add bank statement" modal opens
    Then the close "Add bank statement" modal button is displayed
    Then the selected filename is displayed
    Then the file upload status icon is displayed

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

    When I click the bank transaction
    When I click the "Rubriek" button
    When I select the "Lokale lasten" option
    Then a success-notification is displayed
    Then the status is "Handmatig afgeletterd"
    Then the "Rubriek" button is not displayed
    Then the classification is "Lokale lasten"
    Then the "Afletteren ongedaan maken" button is displayed
