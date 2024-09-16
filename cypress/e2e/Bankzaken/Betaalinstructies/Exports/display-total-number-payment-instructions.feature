
Feature: display total number of payment instructions

  # Display the total number of payment instructions.

  Background:
    # Given I visit the 'Betaalinstructies Toevoegen' page

  Scenario: no payment instructions exist
    Given no unprocessed payment instructions exist with an execution date on 02-05-2024
    And I visit the 'Betaalinstructies Toevoegen' page
    When I set the date range input "Periode" from 02-05-2024 up until 02-05-2024
    Then the text 'Geen betaalinstructies gevonden in periode' is displayed

  Scenario: view total number
    Given one citizen has an agreement and a payment instruction with an execution date set to 02-05-2024
    And another citizen has 2 agreements and payment instructions with an execution date set to 02-05-2024
    When I visit the 'Betaalinstructies Toevoegen' page
    And I set the date range input "Periode" from 02-05-2024 up until 02-05-2024
    Then the selected amount of payment instructions is 3 out of 3
