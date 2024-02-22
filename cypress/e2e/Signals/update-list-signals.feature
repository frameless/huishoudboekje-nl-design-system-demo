# cypress/e2e/Signals/update-list-signals.feature
Feature: update list signals

  # Refresh the listed signals manually and automatic.

  Background:
    # Given I am logged in as an authorised site user
    # Given 1 or more signals exists

  Scenario: view signals refresh timestamp
    When I view the "Signals" page
    Then the signals refresh timestamp is displayed
    Then the "Refresh signals" button is displayed

  Scenario: automatically refresh signals
    When I view the "Signals" page
    Then 5 minutes pass
    Then the "Signals" page is refreshed
    Then the signals refresh timestamp is displayed

  Scenario: manually refresh signals
    When I view the "Signals" page
    Then I click the "Refresh signals" button
    Then the "Signals" page is refreshed
    Then the signals refresh timestamp is displayed
