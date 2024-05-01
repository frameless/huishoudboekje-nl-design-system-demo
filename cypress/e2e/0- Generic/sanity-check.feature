
Feature: bezoek huishoudboekje

  Scenario: bezoek huishoudboekje via localhost
    When I visit the baseUrl
    Then I am actually on the baseUrl

  Scenario: use search to find citizen
    Given I visit the Burgers page
    When I fill 'Mcpherso' in search
    Then I find the citizen 'Mcpherson'