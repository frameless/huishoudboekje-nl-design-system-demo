# cypress/e2e/Alarms/delete-alarm.feature

@alarmservice
Feature: delete alarm

  # Delete an alarm and its properties.

  Background:
    # Given I am logged in as an authorised site user
    # Given 1 or more agreements exists
    # Given an alarm exists

  Scenario: view delete alarm form
    Given I view the "Agreement" page
    When I click the "Delete alarm" button
    Then the "Cancel delete alarm" button is displayed
    Then the "Confirm delete alarm" button is displayed

  Scenario: cancel alarm deletion
    Given I view the "Agreement" page
    When I click the "Cancel delete alarm" button
    Then the "Delete alarm" button is displayed

  Scenario: confirm alarm deletion
    Given I view the "Agreement" page
    When I click the "Confirm delete alarm" button
    Then a notification of success is displayed
    Then the "Er is geen alarm ingesteld." text is displayed
    Then the "Add alarm" button is displayed
