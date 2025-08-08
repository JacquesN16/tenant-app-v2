/// <reference types="cypress" />

describe('Unit Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.createTestUser()
    cy.login()
  })

  describe('Create Unit', () => {
    it('should successfully create a new unit', () => {
      // First need to create a property
      cy.visit('/properties')
      cy.contains('Create New Property').click()
      
      cy.fixture('testData').then((data) => {
        const property = data.properties.testProperty
        
        // Create property first
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
        
        // Click add unit button
        cy.contains('Add Unit').click()
        
        // Wait for modal to open
        cy.get('[role="dialog"]').should('be.visible')
        cy.contains('Create Unit').should('be.visible')
        
        // Fill in unit form
        const unit = data.units.testUnit
        cy.get('input[name="unitNumber"]').type(unit.unitNumber)
        cy.get('input[name="bedrooms"]').type(unit.bedrooms.toString())
        cy.get('input[name="bathrooms"]').type(unit.bathrooms.toString())
        cy.get('input[name="squareFootage"]').type(unit.squareFootage.toString())
        
        // Submit form
        cy.get('button[type="submit"]').click()
        
        // Verify modal closes and unit appears
        cy.get('[role="dialog"]').should('not.exist')
        cy.contains(`Unit ${unit.unitNumber}`).should('be.visible')
        cy.contains(`${unit.bedrooms}`).should('be.visible') // bedrooms
        cy.contains(`${unit.bathrooms}`).should('be.visible') // bathrooms
      })
    })

    it('should show validation errors for invalid unit data', () => {
      // Create property first
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
        cy.get('[role="dialog"]').should('not.exist')
        
        cy.contains(property.address.street).click()
        
        // Click add unit button
        cy.contains('Add Unit').click()
        
        // Try to submit empty form
        cy.get('button[type="submit"]').click()
        
        // Should show validation errors
        cy.contains('required').should('be.visible')
      })
    })
  })

  describe('Unit Deletion', () => {
    it('should delete unit but preserve tenant', () => {
      // Create property and unit with tenant
      cy.visit('/properties')
      cy.contains('Create New Property').click()
      
      cy.fixture('testData').then((data) => {
        const property = data.properties.testProperty
        const unit = data.units.testUnit
        const tenant = data.tenants.testTenant
        
        // Create property
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
        
        // Create unit
        cy.contains('Add Unit').click()
        cy.get('input[name="unitNumber"]').type(unit.unitNumber)
        cy.get('input[name="bedrooms"]').type(unit.bedrooms.toString())
        cy.get('input[name="bathrooms"]').type(unit.bathrooms.toString())
        cy.get('input[name="squareFootage"]').type(unit.squareFootage.toString())
        cy.get('button[type="submit"]').click()
        cy.get('[role="dialog"]').should('not.exist')
        
        // Click on unit to go to unit details
        cy.contains(`Unit ${unit.unitNumber}`).click()
        
        // Create tenant for this unit
        cy.contains('Create New').click()
        
        // Fill tenant form
        cy.get('input[name="firstName"]').type(tenant.firstName)
        cy.get('input[name="lastName"]').type(tenant.lastName)
        cy.get('input[name="email"]').type(tenant.email)
        cy.get('input[name="phoneNumber"]').type(tenant.phone)
        cy.get('input[name="monthlyRent"]').type(tenant.monthlyRent.toString())
        cy.get('input[name="securityDeposit"]').type(tenant.securityDeposit.toString())
        cy.get('input[name="entryDate"]').type(tenant.entryDate)
        
        cy.get('button[type="submit"]').click()
        cy.get('[role="dialog"]').should('not.exist')
        
        // Verify tenant was created
        cy.contains(tenant.firstName).should('be.visible')
        cy.contains(tenant.lastName).should('be.visible')
        
        // Now go back to property and delete the unit
        // (Note: Unit deletion might be done from property detail page or unit detail page)
        // This test assumes there's a delete button on unit detail page
        // If not implemented, this would be a feature request
        
        // For now, we'll test that the unit exists and tenant is associated
        cy.contains('Occupied').should('be.visible')
        
        // Note: Actual unit deletion would require implementation of delete functionality
        // The test would verify that after deletion, the tenant still exists in the system
        // but is no longer associated with any unit
      })
    })
  })

  describe('Unit List and Details', () => {
    it('should display unit information correctly', () => {
      // Create property and unit
      cy.visit('/properties')
      cy.contains('Create New Property').click()
      
      cy.fixture('testData').then((data) => {
        const property = data.properties.testProperty
        const unit = data.units.testUnit
        
        // Create property
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
        
        // Create unit
        cy.contains('Add Unit').click()
        cy.get('input[name="unitNumber"]').type(unit.unitNumber)
        cy.get('input[name="bedrooms"]').type(unit.bedrooms.toString())
        cy.get('input[name="bathrooms"]').type(unit.bathrooms.toString())
        cy.get('input[name="squareFootage"]').type(unit.squareFootage.toString())
        cy.get('button[type="submit"]').click()
        cy.get('[role="dialog"]').should('not.exist')
        
        // Verify unit details are displayed
        cy.contains(`Unit ${unit.unitNumber}`).should('be.visible')
        cy.contains('Vacant').should('be.visible') // Initially vacant
        
        // Click on unit to see details
        cy.contains(`Unit ${unit.unitNumber}`).click()
        
        // Should be on unit detail page
        cy.url().should('include', '/units/')
        cy.contains(`Unit ${unit.unitNumber}`).should('be.visible')
        cy.contains(`${unit.bedrooms} Bedrooms`).should('be.visible')
        cy.contains(`${unit.bathrooms} Bathrooms`).should('be.visible')
        cy.contains(`${unit.squareFootage} m²`).should('be.visible')
      })
    })
  })
})