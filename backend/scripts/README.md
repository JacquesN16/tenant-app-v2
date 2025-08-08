# Database Scripts

This directory contains scripts for managing test data in the tenant management system.

## Scripts

### clean-db.ts
Cleans all data from the database by deleting all records in the correct order (respecting foreign key constraints).

### populate-db.ts
Populates the database with comprehensive mock data including:
- **5 Users** (property owners) with realistic contact information
- **8 Properties** with different types (apartment buildings, condos, townhouses, etc.)
- **20+ Units** distributed across properties with varying bedroom/bathroom counts
- **25+ Tenants** with realistic lease terms and contact details
- **150+ Bills** (6 months of billing history per tenant with realistic payment status)

## Usage

### From Backend Directory
```bash
cd backend

# Clean database
npm run db:clean

# Populate with mock data
npm run db:populate

# Clean and populate (full reset)
npm run db:reset
```

### From Root Directory
```bash
# Clean database
./clean-db.sh

# Populate with mock data
./populate-db.sh

# Clean and populate (full reset)
./reset-db.sh
```

## Mock Data Details

### Users (Property Owners)
- 5 realistic users with names, emails, phone numbers, and addresses
- Each user owns 1-2 properties
- Passwords are hashed with bcrypt (default: "password123")

### Properties
- 8 properties across different US cities
- Mix of property types: apartment buildings, single family homes, condos, townhouses, duplexes, share houses
- Each property has a nickname and realistic address

### Units
- 2-6 units per property (total ~30 units)
- Realistic unit numbers (A1, B2, C3, etc.)
- Random bedroom/bathroom counts (1-3 bedrooms, 1-2 bathrooms)
- Square footage between 500-1300 sq ft
- 70% occupancy rate

### Tenants
- 25+ tenants with realistic names and contact information
- Monthly rent between $800-$2300
- Additional charges of $50-$250 (utilities, parking, etc.)
- Security deposits of 1-2x monthly rent
- Lease terms with entry dates and lease start/end dates
- 90% active tenancy rate

### Bills
- 6 months of billing history per tenant
- Bills include monthly rent + additional charges
- 80% payment rate (realistic for testing overdue scenarios)
- Due dates set to the first of each month

## Environment Requirements

Ensure your `.env` file has the correct `DATABASE_URL` pointing to your PostgreSQL database:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/tenant_db
```

## Notes

- All IDs are randomly generated strings
- Phone numbers use a realistic format (555-xxx-xxxx)
- Email addresses follow the pattern: firstname.lastname@email.com
- Dates are realistic and within reasonable ranges
- The scripts handle foreign key relationships correctly