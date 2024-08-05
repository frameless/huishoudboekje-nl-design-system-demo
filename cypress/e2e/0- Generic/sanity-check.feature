
Feature: bezoek huishoudboekje

  Scenario: use search to find citizen
    Given I visit the Burgers page
    When I search for 'Dingu'
    Then I find the citizen 'Dingus'
