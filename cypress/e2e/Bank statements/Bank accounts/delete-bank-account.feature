# cypress/e2e/Bank statements/Bank accounts/delete-bank-account.feature

@bankservice
Feature: delete a bank account
  
  # Delete a bank account of an organisation or a citizen.

  Background:
    # Given I am logged in as an authorised site user

  Scenario: organisation and bank account are not used for reconciliation
    Given the "Belastingdienst Toeslagen Kantoor Utrecht" organisation exists
    Given the "Belastingdienst Toeslagen Kantoor Utrecht" department exists
    Given the "NL86INGB0002445588" bank account exists
    Given an agreement link to the department and the bank account exists
    Given the "UWV Utrecht" organisation exists
    Given I view the "UWV Utrecht" organisation
    When I click the "Add department" button
    Then the "Add department" modal is displayed
    When I input the name "Meervoudig gebruik IBAN"
    When I click the "Save" button
    Then a notification of success is displayed
    When I click the "Meervoudig gebruik IBAN" department
    When I click the "Add bank account" button
    Then I view the "Add bank account" modal
    When I input the IBAN "NL86INGB0002445588"
    When I click the "Save" button
    Then a notification of success is displayed
    When I click the "Delete bank account" button
    Then the "Delete bank account" modal is displayed
    When I click the "Delete" button
    Then a notification of successful bank account deletion is displayed

  @cleanupDepartment
  Scenario: organisation and bank account are used for reconciliation
    Given the "Belastingdienst Toeslagen Kantoor Utrecht" organisation exists
    Given the "Belastingdienst Toeslagen Kantoor Utrecht" department exists
    Given the "NL86INGB0002445588" bank account exists
    Given an agreement link to the department and the bank account exists
    Given I view the "Belastingdienst Toeslagen Kantoor Utrecht" organisation
    When I click the "Belastingdienst Toeslagen Kantoor Utrecht" department
    When I click the "Delete bank account" button of IBAN "NL86INGB0002445588"
    Then the "Delete bank account" modal is displayed
    When I click the "Delete" button
    Then a notification of failure is displayed
