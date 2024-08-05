# cypress/e2e/Alarms/read-alarm.feature

Feature: read alarm

  # Read the properties of an alarm.

  Background:
    # Given I am logged in as an authorised site user
    # Given 1 or more agreements exists

  # Scenario: one-time alarm exists
    # TODO
    
  @beforeCleanupAlarm @beforeCreateAgreement @afterCleanupAlarm
  Scenario: alarm details are displayed
    Given an alarm exists for this agreement
    Then the details are displayed
