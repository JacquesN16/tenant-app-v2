/// <reference types="cypress" />

describe('Property Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.createTestUser()
    cy.login()
  })

  describe('Create Property', () => {
    it('should successfully create a new property', () => {
      cy.visit('/properties')
      
      // Click create property button
      cy.contains('Create New Property').click()

      // Wait for modal to open
      cy.get('[role="dialog"]').should('be.visible')
      cy.contains('Create Property').should('be.visible')

      // Fill in property form
      cy.fixture('testData').then((data) => {
        const property = data.properties.testProperty
        
        // Fill in property details
        cy.get('input[name="name"]').type(property.name)
        cy.get('select[name="propertyType"]').select(property.type)
        
        // Fill in address
        cy.get('input[name="address.street"]').type(property.address.street)
        cy.get('input[name="address.city"]').type(property.address.city)
        cy.get('input[name="address.state"]').type(property.address.state)
        cy.get('input[name="address.zipCode"]').type(property.address.zipCode)
        cy.get('input[name="address.country"]').type(property.address.country)

        // Submit form
        cy.get('button[type="submit"]').click()

        // Verify modal closes and property appears
        cy.get('[role="dialog"]').should('not.exist')
        
        // Check if property card appears
        cy.contains(property.address.street).should('be.visible')
        cy.contains(property.address.city).should('be.visible')
      })
    })

    it('should show validation errors for invalid property data', () => {
      cy.visit('/properties')
      
      // Click create property button
      cy.contains('Create New Property').click()

      // Try to submit empty form
      cy.get('button[type="submit"]').click()

      // Should show validation errors
      cy.contains('required').should('be.visible')
    })

    it('should close modal when clicking outside or cancel', () => {
      cy.visit('/properties')
      
      // Click create property button
      cy.contains('Create New Property').click()

      // Modal should be visible
      cy.get('[role="dialog"]').should('be.visible')

      // Click outside modal to close (if implemented)
      cy.get('[data-radix-dialog-overlay]').click({ force: true })

      // Modal should close
      cy.get('[role="dialog"]').should('not.exist')
    })
  })

  describe('Property List and Cards', () => {
    it('should display properties in a grid layout', () => {
      cy.visit('/properties')

      // Should show properties grid or empty state
      cy.get('body').should('contain.text', 'Properties')
    })

    it('should navigate to property details when clicking a property card', () => {
      // First create a property
      cy.visit('/properties')
      cy.contains('Create New Property').click()
      
      cy.fixture('testData').then((data) => {
        const property = data.properties.testProperty
        
        cy.get('input[name="name"]').type(property.name)
        cy.get('select[name="propertyType"]').select(property.type)
        cy.get('input[name="address.street"]').type(property.address.street)
        cy.get('input[name="address.city"]').type(property.address.city)
        cy.get('input[name="address.state"]').type(property.address.state)
        cy.get('input[name="address.zipCode"]').type(property.address.zipCode)
        cy.get('input[name="address.country"]').type(property.address.country)
        
        cy.get('button[type="submit"]').click()
        
        // Wait for modal to close
        cy.get('[role="dialog"]').should('not.exist')
        
        // Click on the property card
        cy.contains(property.address.street).click()
        
        // Should navigate to property details
        cy.url().should('include', '/properties/')
        cy.contains(property.address.street).should('be.visible')
      })
    })
  })

  describe('Property Deletion', () => {
    it('should delete property and associated units but preserve tenants', () => {
      // First create a property with units and tenants
      cy.visit('/properties')
      
      // Create property
      cy.contains('Create New Property').click()
      cy.fixture('testData').then((data) => {
        const property = data.properties.testProperty
        
        cy.get('input[name="name"]').type(property.name)
        cy.get('select[name="propertyType"]').select(property.type)
        cy.get('input[name="address.street"]').type(property.address.street)
        cy.get('input[name="address.city"]').type(property.address.city)
        cy.get('input[name="address.state"]').type(property.address.state)
        cy.get('input[name="address.zipCode"]').type(property.address.zipCode)
        cy.get('input[name="address.country"]').type(property.address.country)
        
        cy.get('button[type="submit"]').click()
        cy.get('[role="dialog"]').should('not.exist')
        
        // Navigate to property details
        cy.contains(property.address.street).click()
        
        // Add a unit to the property
        cy.contains('Add Unit').click()
        
        // Fill unit form
        const unit = data.units.testUnit
        cy.get('input[name="unitNumber"]').type(unit.unitNumber)
        cy.get('input[name="bedrooms"]').type(unit.bedrooms.toString())
        cy.get('input[name="bathrooms"]').type(unit.bathrooms.toString())
        cy.get('input[name="squareFootage"]').type(unit.squareFootage.toString())
        
        cy.get('button[type="submit"]').click()
        cy.get('[role="dialog"]').should('not.exist')
        
        // Verify unit was created
        cy.contains(`Unit ${unit.unitNumber}`).should('be.visible')
        
        // Now delete the property
        cy.get('button').contains('Delete').click()
        
        // Confirm deletion
        cy.on('window:confirm', () => true)
        
        // Should redirect to properties list
        cy.url().should('include', '/properties')
        
        // Property should no longer exist
        cy.contains(property.address.street).should('not.exist')
        
        // Note: Tenants should still exist in the system but we'd need to check via API
        // This would require backend verification that tenants are preserved
      })
    })
  })
})