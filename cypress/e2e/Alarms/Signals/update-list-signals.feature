# cypress/e2e/Signals/update-list-signals.feature

@signalservice
Feature: update list signals

  # Refresh the listed signals manually and automatic.

  Background:
    # Given I am logged in as an authorised site user

  Scenario: view signals refresh timestamp
    When I navigate to the page '/signalen'
    Then the signals refresh timestamp is displayed
    Then the "Refresh signals" button is displayed

  Scenario: manually refresh signals
    When I navigate to the page '/signalen'
    Then I click the "Refresh signals" button
    Then the "Signals" page is refreshed

  @skip
  Scenario: automatically refresh signals
    When I navigate to the page '/signalen'
    Then 5 minutes pass
    Then the "Signals" page is automatically refreshed

