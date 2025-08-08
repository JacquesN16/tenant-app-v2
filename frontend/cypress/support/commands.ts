/// <reference types="cypress" />

// Custom commands for the tenant management app

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>
      createTestUser(): Chainable<void>
      cleanupTestData(): Chainable<void>
      waitForElement(selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>
    }
  }
}

// Login command
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.visit('/auth/login')
  cy.get('[data-cy=email-input]').type(email)
  cy.get('[data-cy=password-input]').type(password)
  cy.get('[data-cy=login-button]').click()
  cy.url().should('include', '/dashboard')
})

// Create test user via API
Cypress.Commands.add('createTestUser', () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/auth/signup',
    body: {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    },
    failOnStatusCode: false
  })
})

// Clean up test data
Cypress.Commands.add('cleanupTestData', () => {
  // This would clean up test data from the database
  // Implementation depends on backend API endpoints
})

// Wait for element to be visible
Cypress.Commands.add('waitForElement', (selector: string, timeout = 10000) => {
  return cy.get(selector, { timeout }).should('be.visible')
})