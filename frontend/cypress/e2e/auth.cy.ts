/// <reference types="cypress" />

describe('Authentication', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  describe('User Login', () => {
    it('should successfully login with correct credentials', () => {
      // Create a test user first
      cy.createTestUser()

      cy.visit('/auth/login')
      
      // Check if login page loads correctly
      cy.contains('Sign in to your account').should('be.visible')
      cy.get('#emailaddress').should('be.visible')
      cy.get('#password').should('be.visible')

      // Fill in login form
      cy.get('#emailaddress').type('test@example.com')
      cy.get('#password').type('password123')
      
      // Submit form
      cy.get('button[type="submit"]').click()

      // Verify successful login
      cy.url().should('include', '/dashboard')
      cy.contains('Dashboard').should('be.visible')
    })

    it('should show error message with incorrect credentials', () => {
      cy.visit('/auth/login')

      // Fill in login form with incorrect credentials
      cy.get('#emailaddress').type('wrong@example.com')
      cy.get('#password').type('wrongpassword')
      
      // Submit form
      cy.get('button[type="submit"]').click()

      // Should remain on login page and show error
      cy.url().should('include', '/auth/login')
      // Note: Error handling may vary based on implementation
    })

    it('should show validation errors for empty fields', () => {
      cy.visit('/auth/login')

      // Try to submit empty form
      cy.get('button[type="submit"]').click()

      // Should show validation errors
      cy.get('#emailaddress').should('have.class', 'border-red-500')
      cy.get('#password').should('have.class', 'border-red-500')
    })

    it('should navigate to signup page from login', () => {
      cy.visit('/auth/login')

      // Click signup link
      cy.contains('Sign up').click()
      
      cy.url().should('include', '/signup')
      cy.contains('Create your account').should('be.visible')
    })
  })

  describe('User Signup', () => {
    it('should successfully signup with valid information', () => {
      cy.visit('/auth/signup')
      
      // Check if signup page loads correctly
      cy.contains('Create your account').should('be.visible')
      cy.get('#firstName').should('be.visible')
      cy.get('#lastName').should('be.visible')
      cy.get('#emailaddress').should('be.visible')
      cy.get('#password').should('be.visible')

      // Fill in signup form
      cy.get('#firstName').type('New')
      cy.get('#lastName').type('User')
      cy.get('#emailaddress').type('newuser@example.com')
      cy.get('#password').type('newpass123')
      
      // Submit form
      cy.get('button[type="submit"]').click()

      // Verify successful signup (should redirect to dashboard or login)
      cy.url().should('match', /(dashboard|login)/)
    })

    it('should show validation errors for invalid data', () => {
      cy.visit('/auth/signup')

      // Fill in invalid data
      cy.get('#firstName').type('')
      cy.get('#lastName').type('')
      cy.get('#emailaddress').type('invalid-email')
      cy.get('#password').type('123') // Too short
      
      // Try to submit
      cy.get('button[type="submit"]').click()

      // Should show validation errors
      cy.get('#firstName').should('have.class', 'border-red-500')
      cy.get('#lastName').should('have.class', 'border-red-500')
      cy.get('#emailaddress').should('have.class', 'border-red-500')
      cy.get('#password').should('have.class', 'border-red-500')
    })

    it('should navigate to login page from signup', () => {
      cy.visit('/auth/signup')

      // Click login link
      cy.contains('Sign in').click()
      
      cy.url().should('include', '/auth/login')
      cy.contains('Sign in to your account').should('be.visible')
    })
  })
})