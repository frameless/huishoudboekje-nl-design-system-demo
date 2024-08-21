
Feature: end participation

  # End the participation and set an end date for all active agreements.

  Background:
    # Given I am logged in as an authorised site user
    # Given a citizen exists

  @createCitizenEndParcip @deleteCitizenEndParcip
  Scenario: end participation
      Given citizen 'Party Cipator' has multiple agreements
      When I end the participation of 'Party Cipator' tomorrow
      Then all active agreements have tomorrow as end date
