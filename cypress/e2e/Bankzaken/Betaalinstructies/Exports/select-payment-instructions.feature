
Feature: select payment instructions

  # Select specific payment instructions from a list.

  Background:
    # Given I visit the 'Betaalinstructies Toevoegen' page

  Scenario: untoggle all checkboxes
    Given I have three citizens with payment instructions
    And I visit the 'Betaalinstructies Toevoegen' page
    When I set the date range input "Periode" from 02-05-2024 up until 02-05-2024
    And I have all payment instructions selected
    And I untoggle all checkboxes
    Then all payment instructions are deselected

  Scenario: toggle all checkboxes
    Given I have no payment instructions selected
    When I toggle all checkboxes
    Then all payment instructions are selected
 
  Scenario: no checkbox checked when exporting
    Given all three payment instructions are selected
    When I untoggle all checkboxes
    Then the export button is disabled