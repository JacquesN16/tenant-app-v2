# Cypress E2E Tests for Tenant Management System

## Overview

This test suite covers all the major features requested:

1. **Authentication (Login & Signup)**
2. **Create New Property**
3. **Create New Unit**
4. **Create New Tenant**
5. **Remove Property** (with verification that units are deleted but tenants preserved)
6. **Remove Unit** (with verification that tenant is preserved)

## Test Files

- `cypress/e2e/auth.cy.ts` - Authentication flows
- `cypress/e2e/property-management.cy.ts` - Property CRUD operations
- `cypress/e2e/unit-management.cy.ts` - Unit CRUD operations  
- `cypress/e2e/tenant-management.cy.ts` - Tenant CRUD operations

## Running Tests

### Prerequisites

1. Start the backend server:
```bash
cd backend && npm run start:dev
```

2. Start the frontend development server:
```bash
cd frontend && npm run dev
```

3. Ensure the database is set up and accessible

### Running Tests

**Interactive Mode (Cypress GUI):**
```bash
cd frontend && npm run cy:open
```

**Headless Mode:**
```bash
cd frontend && npm run cy:run
```

**Headless with Browser Window:**
```bash
cd frontend && npm run cy:run:headed
```

## Test Structure

### Authentication Tests
- ✅ Successful login with correct credentials
- ✅ Error handling for incorrect credentials  
- ✅ Form validation for empty fields
- ✅ Navigation between login/signup pages
- ✅ Successful signup with valid data
- ✅ Validation for invalid signup data

### Property Management Tests
- ✅ Create new property with valid data
- ✅ Form validation for invalid property data
- ✅ Modal open/close functionality
- ✅ Property display in grid layout
- ✅ Navigation to property details
- ✅ Property deletion (including cascade deletion of units)

### Unit Management Tests
- ✅ Create new unit within a property
- ✅ Form validation for invalid unit data
- ✅ Unit display and details
- ✅ Unit deletion (with tenant preservation verification)
- ✅ Unit occupancy status tracking

### Tenant Management Tests
- ✅ Create tenant from properties page
- ✅ Create tenant from unit details page  
- ✅ Form validation for invalid tenant data
- ✅ Email format validation
- ✅ Tenant information display
- ✅ Tenant editing functionality
- ✅ Tenant-unit association

## Key Test Scenarios

### 1. Delete Property Cascade Behavior
- Creates property with units and tenants
- Deletes property
- Verifies units are removed
- **Important**: Tenants should remain in system (requires backend verification)

### 2. Delete Unit Preservation Behavior  
- Creates unit with associated tenant
- Deletes unit
- **Important**: Tenant should remain in system but be unassigned

### 3. Authentication Flow
- Tests complete login/logout cycle
- Verifies protected routes
- Tests session persistence

## Custom Commands

The test suite includes custom Cypress commands in `cypress/support/commands.ts`:

- `cy.login()` - Quick login with test credentials
- `cy.createTestUser()` - Create test user via API
- `cy.cleanupTestData()` - Clean up test data
- `cy.waitForElement()` - Wait for element with timeout

## Test Data

Test data is stored in `cypress/fixtures/testData.json` with realistic sample data for:
- User accounts
- Properties (various types and addresses)
- Units (different configurations)
- Tenants (complete profile data)

## Configuration

Cypress configuration is in `cypress.config.ts`:
- Base URL: `http://localhost:5173` (Vite dev server)
- API timeout: 10 seconds
- Video recording enabled for failed tests
- Screenshots on failure

## Important Notes

### Backend Dependencies
These tests require the backend API to be running and accessible. The tests will:
- Create test users via `/auth/signup` endpoint
- Perform CRUD operations on properties, units, and tenants
- Verify data relationships and cascade behaviors

### Deletion Verification
The most critical tests verify that:
1. **Property deletion** removes associated units but preserves tenants
2. **Unit deletion** preserves associated tenants (though they become unassigned)

These behaviors are core to the business logic and must be implemented correctly in the backend.

### Test Environment
- Tests assume a clean database state
- Each test creates its own test data
- Tests are designed to be independent and can run in any order

## Troubleshooting

### Common Issues

**Tests failing with network errors:**
- Ensure backend server is running on port 3000
- Ensure frontend server is running on port 5173
- Check that database is accessible

**Element not found errors:**
- The tests use semantic selectors (text content, roles)
- If UI text changes, tests may need updates
- Check that modals are properly rendered

**Test data conflicts:**
- Each test should clean up its own data
- Use unique email addresses for user creation
- Verify database state between test runs

### Debugging

**Enable verbose logging:**
```bash
DEBUG=cypress:* npm run cy:run
```

**Run specific test file:**
```bash
npx cypress run --spec "cypress/e2e/auth.cy.ts"
```

**Run in headed mode for debugging:**
```bash
npm run cy:run:headed
```

## Future Enhancements

- Add API response validation tests
- Add performance testing for large datasets
- Add accessibility (a11y) testing
- Add mobile responsive testing
- Add data export functionality tests
- Add billing system tests when implemented

This test suite provides comprehensive coverage of the core tenant management functionality and ensures the system behaves correctly for all major user workflows.