
Feature: display number of unprocessed payment instructions

  # Display the total number of payment instructions with an execution date earlier than today and that have not been included in an exported file.

  Scenario: unprocessed payment instruction exists
    Given one citizen has an agreement and a payment instruction with an execution date set to 02-05-2024
    When I visit the 'Betaalinstructies Toevoegen' page
    And I set the date range input "Periode" from 02-05-2024 up until 02-05-2024
    And I set the date range input "Periode" from 03-05-2024 up until 03-05-2024
    Then the text 'Er is/zijn 1 transactie(s) niet meegenomen in exports van de voorgaande week' is displayed
