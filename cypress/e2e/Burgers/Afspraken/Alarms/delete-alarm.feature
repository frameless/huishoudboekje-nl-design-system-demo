# cypress/e2e/Alarms/delete-alarm.feature

Feature: delete alarm

  # Delete an alarm and its properties.

  Background:
    # Given I am logged in as an authorised site user
    # Given 1 or more agreements exists
    # Given an alarm exists

  @beforeCreateAgreement
  Scenario: delete alarm
    Given an alarm exists for this agreement
    When I delete the alarm
    Then the alarm is removed
