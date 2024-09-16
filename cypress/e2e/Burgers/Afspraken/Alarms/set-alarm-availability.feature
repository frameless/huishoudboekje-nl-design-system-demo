# cypress/e2e/Alarms/set-alarm-availability.feature

@afterCleanupAlarm
Feature: set alarm availability

  #Disable and enable an alarm. Only enabled alarms create a notification.

  Background:
    # Given I am logged in as an authorised site user
    # Given 1 or more agreements exists
    # Given an alarm exists

  @beforeCreateAgreement @afterDeleteAgreement
  Scenario: toggle alarm to disabled and enabled
    Given an alarm exists
    And an agreement's alarm availability is 'Enabled'
    When I disable the alarm
    Then the alarm status is "Disabled"
    When I enable the alarm
    Then the alarm status is "Enabled"
