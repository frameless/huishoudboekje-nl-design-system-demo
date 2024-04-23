// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import 'cypress-react-selector';

function loginViaAAD(username: string, password: string) {
  //cy.visit('/')
  //cy.get('[data-test="button.Login"]').click()
  //cy.get('button').contains('Inloggen').click()

  // Login to the AAD tenant.
  cy.origin(
    'login.microsoftonline.com',
    {
      args: {
        username,
      },
    },
    ({username}) => {
      cy.get('input[type="email"]').type(username, {
        log: false,
      })
      cy.get('input[type="submit"]').click()
    }
  )


  cy.origin(
    'login.microsoftonline.com',
    {
      args: {
        password,
      },
    },
    ({password}) => {
      cy.get('input[type="password"]').type(password, {
        log: false,
      })
      cy.get('input[type="submit"]').click()

      cy.wait(1000)

      // In case of 2FA warning message
      cy.get('body').then(($body) => {
        const buttonLogin = $body.find('#btnAskLater')
        if (buttonLogin.length) {
          cy.get('#btnAskLater').click()
        }
        else {
          // no 2FA warning message, so do nothing
        }
      })

      cy.wait(3000);
      cy.get('#idBtn_Back').click();
    }
  )

  cy.waitForReact();

  // Wait for redirect
  cy.url({timeout: 10000}).should('contain', Cypress.config().baseUrl);

  // Wait for elements to load in
  cy.wait(1000);

  // Click login button again if necessary
  cy.get('body').then(($body) => {
    const buttonLogin = $body.find('button[type="submit"]')
    if (buttonLogin.length) {
      cy.get('[data-test="button.Login"]').click()

      // // Login to the AAD tenant.
      // cy.origin(
      //   'login.microsoftonline.com',
      //   {
      //     args: {
      //       username,
      //     },
      //   },
      //   ({username}) => {
      //     cy.get('input[type="email"]').type(username, {
      //       log: false,
      //     })
      //     cy.get('input[type="submit"]').click()
      //   }
      // )

      // cy.origin(
      //   'login.microsoftonline.com',
      //   {
      //     args: {
      //       password,
      //     },
      //   },
      //   ({password}) => {
      //     cy.get('input[type="password"]').type(password, {
      //       log: false,
      //     })
      //     cy.get('input[type="submit"]').click()

      //     cy.wait(1000)

      //     // In case of 2FA warning message
      //     cy.get('body').then(($body) => {
      //       const buttonLogin = $body.find('#btnAskLater')
      //       if (buttonLogin.length) {
      //         cy.get('#btnAskLater').click()
      //       }
      //       else {
      //         // no 2FA warning message, so do nothing
      //       }
      //     })

      //     cy.wait(3000);
      //     cy.get('#idBtn_Back').click();
      //   }
      // )
    }
    else {
      // Already logged in; check for username
      cy.contains(`${Cypress.env('aad_username')}`, {timeout: 10000});
    }

    // Ensure Microsoft has redirected us back to the sample app with our logged in user.
    cy.url({timeout: 10000}).should('contain', Cypress.config().baseUrl + '/huishoudens');

  })

}

Cypress.Commands.add('loginToAAD', (username: string, password: string) => {
  const log = Cypress.log({
    displayName: 'Azure Active Directory Login',
    message: [`🔐 Authenticating | ${username}`],
    autoEnd: false,
  })
  log.snapshot('before')

  loginViaAAD(username, password)

  log.snapshot('after')
  log.end()
})

