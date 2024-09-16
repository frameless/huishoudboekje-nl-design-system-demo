
Feature: list citizens with payment instructions within timeframe

  # Display a list of all payment instructions within a specific timeframe.

  Background:
    # Given I visit the 'Betaalinstructies Toevoegen' page

  Scenario: select payment instructions for default date
    Given two citizens have a payment instruction set to 02-05-2024
    And one citizen has a payment instruction set to 03-05-2024
    When I visit the 'Betaalinstructies Toevoegen' page
    And I set the date range input "Periode" from 02-05-2024 up until 02-05-2024
    Then only the two citizens who have a payment instruction set to 02-05-2024 are displayed

  Scenario: select payment instructions for other date
    Given I visit the 'Betaalinstructies Toevoegen' page
    When I set the date range input "Periode" from 03-05-2024 up until 03-05-2024
    Then only the citizen who has a payment instruction set to 03-05-2024 is displayed

  Scenario: select payment instructions for multiple days
    Given I visit the 'Betaalinstructies Toevoegen' page
    When I set the date range input "Periode" from 02-05-2024 up until 03-05-2024
    Then all three citizens are displayed
