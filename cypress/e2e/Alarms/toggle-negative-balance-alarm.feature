# cypress/e2e/Alarms/toggle-negative-balance-alarm.feature

Feature: toggle negative account balance alarm

  # Enable or disable alarm for signaling a negative account balance

  Background:
    # Given I am logged in as an authorised site user
    # Given the citizen 'Mcpherson Patterson' exists

  Scenario: view toggle form
    When I open the citizen overview page for "Mcpherson Patterson"
    Then the negative account balance alarm toggle label "Alarm bij negatief saldo" is displayed in the section "Saldo"
    Then the negative account balance alarm toggle is displayed
    Then the negative account balance alarm toggle is set to enabled

  @cleanupBankstatement
  Scenario: disable toggle
    When I open the citizen overview page for "Mcpherson Patterson"
    Given the account balance for "Mcpherson Patterson" is 0
    Given the citizen "Mcpherson Patterson" has an agreement "Loon"
    When I set the negative account balance alarm toggle to disabled
    When I navigate to the page '/bankzaken/bankafschriften'
    When I select a CAMT test file with negative payment amount '10.00'
    Then the CAMT test file with a negative payment amount is displayed
    When the negative amount bank transaction is booked to the agreement "Loon"
    When I navigate to the page '/signalen'
    Then no signal is created

  @cleanupBankstatement
  Scenario: enable toggle
    When I open the citizen overview page for "Mcpherson Patterson"
    Given the account balance for "Mcpherson Patterson" is 0
    Given the citizen "Mcpherson Patterson" has an agreement "Loon"
    When I set the negative account balance alarm toggle to enabled
    When I navigate to the page '/bankzaken/bankafschriften'
    When I select a CAMT test file with negative payment amount '10.00'
    Then the CAMT test file with a negative payment amount is displayed
    When the negative amount bank transaction is booked to the agreement "Loon"
    When I navigate to the page '/signalen'
    Then the text 'Er is een negatief saldo geconstateerd bij Mcpherson Patterson.' is displayed


