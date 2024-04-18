# cypress/e2e/Alarms/set-alarm-availability.feature

@afterCleanupAlarm
Feature: set alarm availability

  #Disable and enable an alarm. Only enabled alarms create a notification.

  Background:
    # Given I am logged in as an authorised site user
    # Given 1 or more agreements exists
    # Given an alarm exists

  Scenario: toggle alarm to disabled
    Given I view the "Agreement" page
    Then the alarm availability is displayed
    Then the alarm availability is "Enabled"
    When I click the "Disable alarm" button
    Then the alarm status is "Disabled"

  Scenario: toggle alarm to enabled
    Given I view the "Agreement" page
    Then the alarm availability is displayed
    Then the alarm availability is "Disabled"
    When I click the "Enable alarm" button
    Then the alarm status is "Enabled"


