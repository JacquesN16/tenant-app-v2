/// <reference types="cypress" />

describe('Tenant Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.createTestUser()
    cy.login()
  })

  describe('Create Tenant', () => {
    it('should successfully create a new tenant', () => {
      cy.visit('/properties')
      
      // Click create tenant button from properties page
      cy.contains('Create New Tenant').click()
      
      // Wait for modal to open
      cy.get('[role="dialog"]').should('be.visible')
      cy.contains('Create Tenant').should('be.visible')
      
      cy.fixture('testData').then((data) => {
        const tenant = data.tenants.testTenant
        
        // Fill in tenant form
        cy.get('input[name="firstName"]').type(tenant.firstName)
        cy.get('input[name="lastName"]').type(tenant.lastName)
        cy.get('input[name="email"]').type(tenant.email)
        cy.get('input[name="phoneNumber"]').type(tenant.phone)
        cy.get('input[name="monthlyRent"]').type(tenant.monthlyRent.toString())
        cy.get('input[name="securityDeposit"]').type(tenant.securityDeposit.toString())
        cy.get('input[name="entryDate"]').type(tenant.entryDate)
        
        // Submit form
        cy.get('button[type="submit"]').click()
        
        // Verify modal closes
        cy.get('[role="dialog"]').should('not.exist')
        
        // Note: Verification of tenant creation would depend on where the user is redirected
        // or how the UI shows success feedback
      })
    })

    it('should create tenant from unit details page', () => {
      // First create a property and unit
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
        
        // Navigate to property details and create unit
        cy.contains(property.address.street).click()
        cy.contains('Add Unit').click()
        
        cy.get('input[name="unitNumber"]').type(unit.unitNumber)
        cy.get('input[name="bedrooms"]').type(unit.bedrooms.toString())
        cy.get('input[name="bathrooms"]').type(unit.bathrooms.toString())
        cy.get('input[name="squareFootage"]').type(unit.squareFootage.toString())
        
        cy.get('button[type="submit"]').click()
        cy.get('[role="dialog"]').should('not.exist')
        
        // Click on unit to go to unit details
        cy.contains(`Unit ${unit.unitNumber}`).click()
        
        // Should be on unit detail page
        cy.url().should('include', '/units/')
        
        // Create tenant from unit page
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
        
        // Verify tenant appears on unit page
        cy.contains(tenant.firstName).should('be.visible')
        cy.contains(tenant.lastName).should('be.visible')
        cy.contains(tenant.email).should('be.visible')
        cy.contains('Occupied').should('be.visible')
      })
    })

    it('should show validation errors for invalid tenant data', () => {
      cy.visit('/properties')
      
      // Click create tenant button
      cy.contains('Create New Tenant').click()
      
      // Try to submit empty form
      cy.get('button[type="submit"]').click()
      
      // Should show validation errors
      cy.contains('required').should('be.visible')
    })

    it('should validate email format', () => {
      cy.visit('/properties')
      
      // Click create tenant button
      cy.contains('Create New Tenant').click()
      
      // Fill in invalid email
      cy.get('input[name="email"]').type('invalid-email')
      cy.get('input[name="firstName"]').type('Test')
      cy.get('input[name="lastName"]').type('User')
      
      // Try to submit
      cy.get('button[type="submit"]').click()
      
      // Should show email validation error
      cy.contains('email').should('be.visible')
    })
  })

  describe('Tenant Information Display', () => {
    it('should display tenant information correctly on unit page', () => {
      // Create property, unit, and tenant
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
        
        // Create unit
        cy.contains(property.address.street).click()
        cy.contains('Add Unit').click()
        
        cy.get('input[name="unitNumber"]').type(unit.unitNumber)
        cy.get('input[name="bedrooms"]').type(unit.bedrooms.toString())
        cy.get('input[name="bathrooms"]').type(unit.bathrooms.toString())
        cy.get('input[name="squareFootage"]').type(unit.squareFootage.toString())
        
        cy.get('button[type="submit"]').click()
        cy.get('[role="dialog"]').should('not.exist')
        
        // Create tenant
        cy.contains(`Unit ${unit.unitNumber}`).click()
        cy.contains('Create New').click()
        
        cy.get('input[name="firstName"]').type(tenant.firstName)
        cy.get('input[name="lastName"]').type(tenant.lastName)
        cy.get('input[name="email"]').type(tenant.email)
        cy.get('input[name="phoneNumber"]').type(tenant.phone)
        cy.get('input[name="monthlyRent"]').type(tenant.monthlyRent.toString())
        cy.get('input[name="securityDeposit"]').type(tenant.securityDeposit.toString())
        cy.get('input[name="entryDate"]').type(tenant.entryDate)
        
        cy.get('button[type="submit"]').click()
        cy.get('[role="dialog"]').should('not.exist')
        
        // Verify all tenant information is displayed
        cy.contains(tenant.firstName).should('be.visible')
        cy.contains(tenant.lastName).should('be.visible')
        cy.contains(tenant.email).should('be.visible')
        cy.contains(tenant.phone).should('be.visible')
        cy.contains(`€${tenant.monthlyRent}`).should('be.visible')
        cy.contains(`€${tenant.securityDeposit}`).should('be.visible')
        
        // Verify unit shows as occupied
        cy.contains('Occupied').should('be.visible')
        cy.contains('Active Tenant').should('be.visible')
      })
    })
  })

  describe('Tenant Editing', () => {
    it('should allow editing tenant information', () => {
      // Create property, unit, and tenant first
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
        
        // Create unit
        cy.contains(property.address.street).click()
        cy.contains('Add Unit').click()
        
        cy.get('input[name="unitNumber"]').type(unit.unitNumber)
        cy.get('input[name="bedrooms"]').type(unit.bedrooms.toString())
        cy.get('input[name="bathrooms"]').type(unit.bathrooms.toString())
        cy.get('input[name="squareFootage"]').type(unit.squareFootage.toString())
        
        cy.get('button[type="submit"]').click()
        cy.get('[role="dialog"]').should('not.exist')
        
        // Create tenant
        cy.contains(`Unit ${unit.unitNumber}`).click()
        cy.contains('Create New').click()
        
        cy.get('input[name="firstName"]').type(tenant.firstName)
        cy.get('input[name="lastName"]').type(tenant.lastName)
        cy.get('input[name="email"]').type(tenant.email)
        cy.get('input[name="phoneNumber"]').type(tenant.phone)
        cy.get('input[name="monthlyRent"]').type(tenant.monthlyRent.toString())
        cy.get('input[name="securityDeposit"]').type(tenant.securityDeposit.toString())
        cy.get('input[name="entryDate"]').type(tenant.entryDate)
        
        cy.get('button[type="submit"]').click()
        cy.get('[role="dialog"]').should('not.exist')
        
        // Click edit tenant
        cy.contains('Edit Tenant').click()
        
        // Update tenant information
        cy.get('input[name="firstName"]').clear().type('Updated')
        cy.get('input[name="lastName"]').clear().type('Name')
        
        cy.get('button[type="submit"]').click()
        cy.get('[role="dialog"]').should('not.exist')
        
        // Verify updated information
        cy.contains('Updated').should('be.visible')
        cy.contains('Name').should('be.visible')
      })
    })
  })
})