
Feature: bezoek huishoudboekje

  Scenario: bezoek huishoudboekje via localhost
    When I visit the baseUrl
    Then I am actually on the baseUrl

  Scenario: use search to find citizen
    Given I navigate to the page '/burgers'
    When I fill 'Dingu' in search
    Then I find the citizen 'Dingus'