# cypress/e2e/Alarms/toggle-negative-balance-alarm.feature

Feature: toggle negative account balance alarm

  # Enable or disable alarm for signaling a negative account balance

  Background:
    # Given I am logged in as an authorised site user
    # Given the test citizen exists

  Scenario: view toggle form
    When I open the citizen overview page for 'Dingus Bingus'
    Then the negative account balance alarm toggle is displayed

  @cleanupBankstatement
  Scenario: disable toggle
    Given I open the citizen overview page for 'Dingus Bingus'
    When I disable the negative account balance alarm
    When I consolidate a negative amount bank transaction to the agreement
    Then no negative balance signal is created

  @cleanupBankstatement
  Scenario: enable toggle
    Given I open the citizen overview page for 'Dingus Bingus'
    When I enable the negative account balance alarm
    When I consolidate a negative amount bank transaction to the agreement
    Then a negative balance signal is created
