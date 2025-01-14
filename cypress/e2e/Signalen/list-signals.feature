# cypress/e2e/Signals/list-signals.feature

@signalservice 
Feature: list signals

  # A list with all signals of alarms. The properties of a signal must be human-readable.

  Background:
    # Given I am logged in as an authorised site user

  Scenario: no signal exists
    Given 0 active signals exist
    When I navigate to the page '/signalen'
    Then the text 'Er zijn geen signalen gevonden' is displayed

  Scenario: active signals exist
    Given 1 or more active signals exist
    When I navigate to the page '/signalen'
    Then the signal description is displayed
    Then the signal date is displayed
    Then the "Suppress signal" switch track is displayed
    Then the signal status is displayed

  @cleanupAlarmSignal
  Scenario: suppressed signals exist
    Given 1 or more suppressed signals exist
    When I navigate to the page '/signalen'
    Then I enable the suppressed signals filter
    Then all suppressed signals are displayed
